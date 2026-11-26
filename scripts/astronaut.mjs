#!/usr/bin/env node
// Binary Astronaut — animated SVG for a GitHub profile README.
//
// The astronaut is drawn with the bits of your username, and every star in
// the sky is a day you contributed during the last year (brighter = busier).
//
// Usage:
//   GITHUB_TOKEN=... USERNAME=ahmadaqib node scripts/astronaut.mjs dist/astronaut.svg
//   node scripts/astronaut.mjs dist/astronaut.svg --mock   # offline preview with fake data
//
// No dependencies. Needs Node 18+ (global fetch).

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const args = process.argv.slice(2);
const OUT = args.find((a) => !a.startsWith("--")) ?? "dist/astronaut.svg";
const MOCK = args.includes("--mock");
const USERNAME = process.env.USERNAME || "ahmadaqib";
const TOKEN = process.env.GITHUB_TOKEN;

// ─── palette ────────────────────────────────────────────────────────────────
const C = {
  bgInner: "#0f1a3a",
  bgOuter: "#050814",
  border: "#1e293b",
  accent: "#38bdf8",
  helmet: "#e2e8f0",
  suit: "#cbd5e1",
  pack: "#64748b",
  glove: "#94a3b8",
  ring: "#38bdf8",
  dim: "#64748b",
  faint: "#334155",
  text: "#f1f5f9",
};

// ─── deterministic randomness ───────────────────────────────────────────────
function hash(str) {
  let h = 2166136261;
  for (const ch of str) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const r2 = (n) => Math.round(n * 100) / 100;

// ─── data ───────────────────────────────────────────────────────────────────
const LEVEL = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };

async function fetchCalendar() {
  if (MOCK) {
    const rand = rng(hash(USERNAME));
    const weeks = [];
    const start = new Date(Date.UTC(2025, 10, 23));
    for (let w = 0; w < 53; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(start.getTime() + (w * 7 + d) * 864e5).toISOString().slice(0, 10);
        const level = rand() < 0.3 ? 0 : 1 + Math.floor(rand() * 4);
        days.push({ date, level, count: level * 6 });
      }
      weeks.push(days);
    }
    return { total: 8645, weeks };
  }

  if (!TOKEN) throw new Error("GITHUB_TOKEN is not set (use --mock for an offline preview)");
  const query = `query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount contributionLevel } }
        }
      }
    }
  }`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "binary-astronaut",
    },
    body: JSON.stringify({ query, variables: { login: USERNAME } }),
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  const cal = json.data.user.contributionsCollection.contributionCalendar;
  return {
    total: cal.totalContributions,
    weeks: cal.weeks.map((w) =>
      w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: LEVEL[d.contributionLevel] ?? 0,
      })),
    ),
  };
}

// ─── astronaut shape (grid rasterizer) ──────────────────────────────────────
const COLS = 32;
const ROWS = 40;

const inCircle = (x, y, cx, cy, r) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
const inEllipse = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
const inRect = (x, y, x0, y0, x1, y1) => x >= x0 && x <= x1 && y >= y0 && y <= y1;
function distToSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
const onPath = (x, y, pts, w) =>
  pts.slice(1).some((p, i) => distToSeg(x, y, pts[i][0], pts[i][1], p[0], p[1]) <= w / 2);

// Returns the part of the astronaut a grid cell belongs to (or null).
function part(x, y) {
  if (inCircle(x, y, 24.6, 1.3, 1.1)) return "tip";
  if (onPath(x, y, [[21.5, 5], [24.3, 1.8]], 0.9)) return "helmet";
  if (inEllipse(x, y, 13.2, 8.6, 1.4, 1)) return "glint";
  if (inEllipse(x, y, 16.4, 11.2, 6, 4.4)) return "visor";
  if (inCircle(x, y, 16, 11, 8.4)) return "helmet";
  if (inRect(x, y, 14, 22.5, 18.2, 24.6)) return "panel";
  if (inRect(x, y, 11, 19.2, 21.2, 20.2) || inRect(x, y, 10.2, 28, 22, 28.9)) return "ring";
  if (inCircle(x, y, 4.4, 12.4, 1.8) || inCircle(x, y, 27.4, 30, 1.8)) return "glove";
  if (inRect(x, y, 10, 35.6, 14.8, 37.8) || inRect(x, y, 18, 35.2, 23, 37.4)) return "glove";
  if (onPath(x, y, [[10.5, 21.5], [6, 18.5], [4.6, 13.8]], 2.8)) return "suit";
  if (onPath(x, y, [[21.5, 21.5], [25.8, 25], [27.2, 28.6]], 2.8)) return "suit";
  if (onPath(x, y, [[13.5, 30.5], [12.6, 35.8]], 3.4)) return "suit";
  if (onPath(x, y, [[18.6, 30.5], [20.2, 35.4]], 3.4)) return "suit";
  if (inRect(x, y, 10, 20, 22, 31.5)) return "suit";
  if (inRect(x, y, 8, 20.5, 24, 30.5)) return "pack";
  return null;
}

function lerpColor(a, b, t) {
  const pa = a.match(/\w\w/g).map((h) => parseInt(h, 16));
  const pb = b.match(/\w\w/g).map((h) => parseInt(h, 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, "0")).join("");
}

// ─── svg ────────────────────────────────────────────────────────────────────
function render({ total, weeks }) {
  const W = 840, H = 340;
  const rand = rng(hash(USERNAME + ":scene"));
  // Stars: one per contributed day, placed by week (x) and a seeded hash (y).
  // Stars that would land on the text block are moved above or below it.
  const nWeeks = weeks.length;
  const days = weeks.flatMap((w, wi) => w.map((d) => ({ ...d, wi })));
  const brightest = [...days].sort((a, b) => b.count - a.count).slice(0, 6).filter((d) => d.count > 0);
  const stars = [];
  for (const d of days) {
    const sr = rng(hash(d.date));
    const x = 14 + (d.wi / Math.max(1, nWeeks - 1)) * (W - 28) + (sr() - 0.5) * 14;
    let y = 12 + sr() * (H - 24);
    if (x < 460 && y > 72 && y < 252) y = sr() < 0.5 ? 12 + sr() * 54 : 262 + sr() * 66;
    if (d.level === 0) {
      if (sr() < 0.5) stars.push(`<circle cx="${r2(x)}" cy="${r2(y)}" r="0.5" fill="#94a3b8" opacity="0.15"/>`);
      continue;
    }
    const rad = [0, 0.7, 1, 1.35, 1.8][d.level];
    const op = [0, 0.45, 0.65, 0.85, 1][d.level];
    const tw = sr() < 0.4;
    const style = tw ? ` class="tw" style="animation-duration:${r2(2 + sr() * 4)}s;animation-delay:-${r2(sr() * 5)}s"` : "";
    stars.push(`<circle cx="${r2(x)}" cy="${r2(y)}" r="${rad}" fill="#e0f2fe" opacity="${op}"${style}/>`);
    if (brightest.includes(d)) {
      const s = 5;
      stars.push(
        `<path class="spark" style="animation-delay:-${r2(sr() * 4)}s" transform="translate(${r2(x)} ${r2(y)})" d="M0 -${s} L0.9 -0.9 L${s} 0 L0.9 0.9 L0 ${s} L-0.9 0.9 L-${s} 0 L-0.9 -0.9Z" fill="#fef9c3"/>`,
      );
    }
  }

  // Astronaut made of bits: the username in 8-bit ASCII, repeated.
  const bits = [...USERNAME].map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join("");
  const SX = 6.8, SY = 6.8, OX = 592, OY = 30;
  const cells = [];
  let bi = 0;
  for (let gy = 0; gy < ROWS; gy++) {
    for (let gx = 0; gx < COLS; gx++) {
      const p = part(gx + 0.5, gy + 0.5);
      if (!p) continue;
      const bit = bits[bi++ % bits.length];
      const x = r2(OX + gx * SX + SX / 2);
      const y = r2(OY + gy * SY + SY * 0.8);
      let fill, cls = "";
      switch (p) {
        case "visor": {
          const t = Math.min(1, Math.max(0, (gx - 10 + (gy - 7) * 0.6) / 13));
          fill = t < 0.5 ? lerpColor("#38bdf8", "#818cf8", t * 2) : lerpColor("#818cf8", "#e879f9", (t - 0.5) * 2);
          break;
        }
        case "glint": fill = "#ffffff"; break;
        case "helmet": fill = C.helmet; break;
        case "suit": fill = C.suit; break;
        case "pack": fill = C.pack; break;
        case "glove": fill = C.glove; break;
        case "ring": fill = C.ring; break;
        case "tip": fill = "#fb7185"; cls = "blink"; break;
        case "panel": {
          const lights = ["#34d399", "#fbbf24", "#f472b6", "#38bdf8"];
          fill = lights[(gx + gy) % lights.length];
          cls = "blink";
          break;
        }
      }
      const delay = cls ? ` style="animation-delay:-${r2(rand() * 2)}s"` : "";
      const flip = (p === "suit" || p === "helmet" || p === "visor") && rand() < 0.14;
      if (flip) {
        const dur = r2(1.6 + rand() * 3.4), del = r2(rand() * 4);
        const st = `animation-duration:${dur}s;animation-delay:-${del}s`;
        cells.push(`<text x="${x}" y="${y}" fill="${fill}" class="fa" style="${st}">${bit}</text>`);
        cells.push(`<text x="${x}" y="${y}" fill="${fill}" class="fb" style="${st}">${bit === "1" ? "0" : "1"}</text>`);
      } else {
        cells.push(`<text x="${x}" y="${y}" fill="${fill}"${cls ? ` class="${cls}"` : ""}${delay}>${bit}</text>`);
      }
    }
  }

  // Code debris drifting around the astronaut.
  const debris = [
    ["{ }", 560, 64, 6.5], ["</>", 818, 112, 8], [";", 566, 262, 5.5],
    ["=>", 812, 296, 7.2], ["&&", 700, 326, 9], ["[ ]", 548, 168, 7.8],
  ]
    .map(([g, x, y, d], i) =>
      `<text class="drift" x="${x}" y="${y}" style="animation-duration:${d}s;animation-delay:-${i * 1.3}s">${g.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</text>`)
    .join("");

  const totalFmt = total.toLocaleString("en-US");
  const aqibBits = [...(process.env.NICKNAME || "aqib")].map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d">
<title id="t">${USERNAME}, floating in space</title>
<desc id="d">An astronaut made of binary digits drifting through a starfield. Each star is a day with contributions in the last year: ${totalFmt} contributions in total.</desc>
<style>
  text{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace}
  .bits text{font-size:8.6px;font-weight:700;text-anchor:middle}
  .astro{animation:float 7s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}
  @keyframes float{0%,100%{transform:translate(0,-9px) rotate(-7deg)}50%{transform:translate(-6px,9px) rotate(5deg)}}
  .tw{animation:tw 3s ease-in-out infinite}
  @keyframes tw{0%,100%{opacity:.15}50%{opacity:1}}
  .spark{animation:spark 4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
  @keyframes spark{0%,100%{opacity:.25}50%{opacity:1}}
  .fa{animation:fa 3s steps(1) infinite}.fb{animation:fb 3s steps(1) infinite}
  @keyframes fa{0%{opacity:1}50%{opacity:0}}
  @keyframes fb{0%{opacity:0}50%{opacity:1}}
  .blink{animation:blink 1.4s steps(1) infinite}
  @keyframes blink{0%{opacity:1}50%{opacity:.25}}
  .drift{font-size:13px;fill:#475569;animation:drift 7s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
  @keyframes drift{0%,100%{transform:translate(0,0) rotate(0)}50%{transform:translate(8px,-12px) rotate(25deg)}}
  .cursor{animation:blink 1.1s steps(1) infinite}
  .shoot{animation:shoot 9s linear infinite;opacity:0}
  @keyframes shoot{0%{transform:translate(0,0);opacity:0}2%{opacity:1}9%{transform:translate(420px,170px);opacity:0}100%{opacity:0}}
  .ringspin{animation:ringspin 40s linear infinite;transform-box:fill-box;transform-origin:center}
  @keyframes ringspin{to{transform:rotate(360deg)}}
  @media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>
<defs>
  <radialGradient id="sky" cx="70%" cy="40%" r="80%">
    <stop offset="0" stop-color="${C.bgInner}"/><stop offset="1" stop-color="${C.bgOuter}"/>
  </radialGradient>
  <radialGradient id="nebula" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#7c3aed" stop-opacity=".22"/><stop offset="1" stop-color="#7c3aed" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="planet" cx="35%" cy="30%" r="75%">
    <stop offset="0" stop-color="#7dd3fc"/><stop offset=".45" stop-color="#2563eb"/><stop offset="1" stop-color="#0b1026"/>
  </radialGradient>
  <linearGradient id="tail" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient>
  <linearGradient id="visorEdge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38bdf8"/><stop offset="1" stop-color="#e879f9"/></linearGradient>
  <linearGradient id="fade" x1="0" x2="1"><stop offset="0" stop-color="#050814" stop-opacity=".75"/><stop offset=".55" stop-color="#050814" stop-opacity="0"/></linearGradient>
  <clipPath id="card"><rect width="${W}" height="${H}" rx="16"/></clipPath>
</defs>

<g clip-path="url(#card)">
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <ellipse cx="660" cy="150" rx="260" ry="150" fill="url(#nebula)"/>
  <g>${stars.join("")}</g>

  <g class="shoot"><line x1="60" y1="20" x2="150" y2="56" stroke="url(#tail)" stroke-width="1.6" stroke-linecap="round"/></g>

  <rect width="${W}" height="${H}" fill="url(#fade)"/>

  <g transform="translate(440 322) rotate(-12)">
    <ellipse rx="112" ry="15" fill="none" stroke="${C.accent}" stroke-opacity=".18" stroke-width="5"/>
    <circle r="60" fill="url(#planet)" opacity=".9"/>
    <path d="M-112 0 A112 15 0 0 0 112 0" fill="none" stroke="${C.accent}" stroke-opacity=".45" stroke-width="2.5"/>
    <g class="ringspin"><ellipse rx="134" ry="20" fill="none" stroke="#c4b5fd" stroke-opacity=".3" stroke-width="1" stroke-dasharray="1 7"/></g>
  </g>

  <g transform="translate(48 0)">
    <text x="0" y="96" font-size="14" fill="${C.dim}">~/space $ whoami</text>
    <text x="0" y="132" font-size="30" font-weight="700" fill="${C.text}">${USERNAME}<tspan class="cursor" fill="${C.accent}">_</tspan></text>
    <text x="0" y="166" font-size="15" fill="${C.accent}">${totalFmt} contributions in the last year</text>
    <text x="0" y="192" font-size="12" fill="${C.faint}">${aqibBits}</text>
    <text x="0" y="236" font-size="12" fill="${C.dim}">✦ every star here is a day I contributed</text>
  </g>

  <g>${debris}</g>
  <g class="astro">
    <ellipse cx="${r2(OX + 16.4 * SX)}" cy="${r2(OY + 11.2 * SY)}" rx="${r2(6.4 * SX)}" ry="${r2(4.8 * SY)}" fill="#020617" fill-opacity=".85" stroke="url(#visorEdge)" stroke-width="1.2"/>
    <g class="bits">${cells.join("")}</g>
  </g>
</g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="16" fill="none" stroke="${C.border}"/>
</svg>
`;
}

const data = await fetchCalendar();
const svg = render(data);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, svg);
console.log(`✓ ${OUT} (${(svg.length / 1024).toFixed(1)} KB, ${data.total} contributions)`);
