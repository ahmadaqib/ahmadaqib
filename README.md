<h1 align="center">Ahmad Aqib</h1>

<p align="center">
  <strong>Full-stack Developer · Backend & Infrastructure</strong><br>
  Web applications, the systems behind them, and the decisions that keep them maintainable.
</p>

<p align="center">
  <a href="mailto:ahmadaqibsunu@gmail.com">Discuss a project ↗</a> &nbsp;·&nbsp;
  <a href="https://github.com/ahmadaqib?tab=repositories">Explore my code</a> &nbsp;·&nbsp;
  <a href="https://www.instagram.com/ahmadaqibb/">Instagram</a>
</p>

---

### 01 / Character select

I'm Aqib. I work across application code, databases, and deployment infrastructure.

I'm interested in the parts of engineering that become visible after launch: slow queries, awkward releases, confusing abstractions, and code nobody wants to touch.

My toolkit includes Laravel, Vue, and TypeScript. My current focus is Go, Rust, backend performance, and distributed systems.

Negotiation is part of my toolkit, too. A technical decision needs agreement on scope, constraints, and what the team can actually deliver.

**Open to:** engineering projects, architecture discussions, and technical collaborations.

### 02 / Quest board

Current areas of focus. The finish lines below are goals, not claimed achievements.

| Quest | Focus | What progress should look like |
| :--- | :--- | :--- |
| ⚙️ **Go deeper** | Go & Rust | Small, useful tools with clear benchmarks and documented trade-offs. |
| 🔎 **Find the bottleneck** | Backend performance | A reproducible slow path, a measured fix, and a before/after comparison. |
| 🛠️ **Make shipping repeatable** | Infrastructure & DX | Deployments that are easy to repeat, inspect, and recover from. |
| 🧩 **Study failure** | Distributed systems | Understand what happens when work is retried, delayed, or interrupted. |

### 03 / Loadout

| Area | Tools |
| :--- | :--- |
| **Application development** | PHP · Laravel · Livewire · TypeScript · JavaScript · Vue · Tailwind CSS |
| **Backend & scripting** | Go · Rust · Python · Node.js · CodeIgniter |
| **Data** | PostgreSQL · MySQL · Redis · MongoDB · Firebase |
| **Infrastructure** | Docker · Linux · Nginx · Cloudflare · CI/CD |
| **Mobile** | Flutter · Native Android |

<details>
<summary>🎒 Open the side inventory</summary>

**Design:** Figma, Photoshop, Blender, Cinema 4D.

**Working with people:** strategic negotiation, conflict resolution, and technical leadership.

</details>

<!--
PORTFOLIO UPGRADE — replace this comment with 2–3 verified project stories.
Place them ABOVE the quest board when ready. Do not publish empty cards.
For each project: link, user problem, your contribution, and observable result.
Use measurements only when you can support them. A working demo, test suite,
or concise architecture note is useful evidence when business metrics are private.
-->

### 04 / AI in the workflow

I use **Codex, Claude Code, and ChatGPT** daily; Gemini occasionally.

They help me explore designs, work through unfamiliar code, draft tests, and review changes. I still need to establish the business context, check the assumptions, and verify the behavior before shipping.

The useful question is: **does the change solve the problem, and how do we know?**

### 05 / Bonus level: the retry trap

An API creates an order. The response times out. The client retries.

**How many orders should exist?**

<details>
<summary>▸ Reveal the catch</summary>

The intended result is one. A timeout alone doesn't tell the client whether the first request succeeded.

I'd start by checking how the API identifies the same operation across retries, and whether that protection holds when requests arrive concurrently.

Then I'd look beyond the order record: can payment, stock updates, or notifications happen twice?

**Bonus question:** what should happen if the same idempotency key arrives with a different payload?

</details>

<details>
<summary>▸ Unlock one more question</summary>

**“Should this be a microservice?”**

Which constraint does the split remove—and who will own the extra deployment, monitoring, and failure modes?

If we can't answer that yet, I'd keep the boundary in the code and revisit the deployment boundary when there's a reason.

</details>

---

### Have a problem worth working on?

Tell me what you're building, where it's getting stuck, and the constraints you're working within.

**[Start a conversation →](mailto:ahmadaqibsunu@gmail.com)**

<p align="center"><sub>Usually on Linux. Often with coffee. Benchmark first.</sub></p>
