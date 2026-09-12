<h1 align="center">Ahmad Aqib</h1>

<p align="center">
  <strong>Full-stack Developer · Backend &amp; Infrastructure</strong><br>
  Curious about what happens after the app goes live.
</p>

<p align="center">
  <a href="https://ahmadaqib.site"><strong>Portfolio ↗</strong></a> &nbsp;·&nbsp;
  <a href="https://github.com/ahmadaqib?tab=repositories">Code</a> &nbsp;·&nbsp;
  <a href="mailto:ahmadaqibsunu@gmail.com">Get in touch</a> &nbsp;·&nbsp;
  <a href="https://www.instagram.com/ahmadaqibb/">Instagram</a>
</p>

---

I'm Aqib. I work across application code, databases, and deployment infrastructure, mostly with **Laravel, Vue, and TypeScript**.

Give me a slow endpoint, a release with too many manual steps, or a module everyone avoids changing. Those are the problems I like working through.

I also care about the conversation before the code: agreeing on scope, surfacing constraints, and making decisions the team can actually follow through on.

**Here for the code?** Start below. **Up for a challenge?** [Try the boss fight ↓](#boss-fight)

## Selected work

| Project | What you'll find |
| :--- | :--- |
| **[ngafe.space ↗](https://github.com/ahmadaqib/ngafe.space)** | A Laravel and Livewire app for café discovery and reviews, with moderation tools. |
| **[Sniper-Loker ↗](https://github.com/ahmadaqib/Sniper-Loker)** | A Go backend that collects job listings from multiple sources and delivers updates over WebSockets. |

## Loadout

| Area | Tools |
| :--- | :--- |
| **Web** | PHP · Laravel · Livewire · Vue · TypeScript · JavaScript · Tailwind CSS |
| **Data** | PostgreSQL · MySQL · Redis |
| **Infrastructure** | Docker · Linux · Nginx · Cloudflare · CI/CD |

<details>
<summary>Open the rest of the toolkit</summary>

- **Backend & scripting:** Python, Node.js, CodeIgniter.
- **More data tools:** MongoDB, Firebase.
- **Mobile:** Flutter, native Android.
- **Design & 3D:** Figma, Photoshop, Blender, Cinema 4D.
- **Working with people:** negotiation, conflict resolution, technical leadership.

</details>

<details>
<summary>Where AI fits into my workflow</summary>

I use **Codex, Claude Code, and ChatGPT** daily; Gemini occasionally. They help me trace unfamiliar code, compare approaches, draft tests, and review changes.

Before shipping, I check the business rules, read the diff, and verify what the change actually does.

</details>

## Quest log

What I'm working toward, and what would count as progress.

| Quest | Done when |
| :--- | :--- |
| **Go & Rust** | A small tool solves a real problem, with documented choices and relevant benchmarks. |
| **Backend performance** | A slow path has a reproducible test case and a measured before/after comparison. |
| **Infrastructure & DX** | A deployment is repeatable, and recovery from a failed release has been rehearsed. |
| **Distributed systems** | An experiment shows what happens when work is retried, delayed, or interrupted. |

<a name="boss-fight"></a>

## Optional boss fight · The retry trap

An order is saved. The response never reaches the client. The client retries.

**The customer wanted one order. Your API received two requests.**

Pick a fix. Open your choice.

<details>
<summary><strong>A · Increase the timeout</strong></summary>

This may reduce retries, but a response can still get lost. The client still cannot tell whether the first request succeeded.

The duplicate-order problem survives. Try another move.

</details>

<details>
<summary><strong>B · Disable the submit button</strong></summary>

Useful feedback for the person clicking. It won't stop a client retrying a request, or two requests arriving together.

Keep the UI improvement. The API still needs a defence.

</details>

<details>
<summary><strong>C · Give the operation a stable identity</strong></summary>

This is where I'd start: reuse an **idempotency key** across retries and enforce uniqueness on the server, including when requests arrive concurrently.

I'd check the crash cases too: what if the order is saved, but the result isn't recorded? Then I'd trace the side effects. Payments, stock updates, and notifications each need a retry strategy.

**Second phase:** the same key arrives with a different payload.

I'd reject the mismatch. Reusing an operation's identity should not silently change its meaning.

[Compare with Stripe's idempotency behavior ↗](https://docs.stripe.com/api/idempotent_requests)

</details>

---

## Work together

Open to **engineering projects, architecture discussions, and technical collaborations**.

Tell me what you're building, where it's stuck, and the constraints. A rough problem description is enough to start.

**[Start a conversation →](mailto:ahmadaqibsunu@gmail.com)** &nbsp;·&nbsp; **[Visit my portfolio ↗](https://ahmadaqib.site)**

<p align="center"><sub>Usually on Linux. Often with coffee. Still checking the query plan.</sub></p>
