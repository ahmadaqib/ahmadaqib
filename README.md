<h1 align="center">Ahmad Aqib</h1>

<p align="center">
  Full-stack developer from Makassar, Indonesia.<br>
  I build web apps, and I usually stick around for what happens after they go live.
</p>

<p align="center">
  <a href="https://ahmadaqib.site"><strong>Portfolio ↗</strong></a> &nbsp;·&nbsp;
  <a href="https://github.com/ahmadaqib?tab=repositories">Code</a> &nbsp;·&nbsp;
  <a href="mailto:ahmadaqibsunu@gmail.com">Email</a> &nbsp;·&nbsp;
  <a href="https://www.instagram.com/ahmadaqibb/">Instagram</a>
</p>

---

Hey, I'm Aqib.

Most of my days are spent somewhere between application code, databases, and servers, usually with **Laravel, Vue, and TypeScript**.

The work I enjoy most is the stuff people quietly avoid. The endpoint that's been slow for months. The deploy that needs a checklist and a little prayer. The module nobody touches anymore because the last change broke something. I like figuring out why, and leaving it in better shape than I found it.

I also like the part before the code: talking through scope, asking the slightly annoying "what happens if…" questions early, and making sure whatever we decide is something the team can actually keep doing.

### Things I've built

- **[ngafe.space ↗](https://github.com/ahmadaqib/ngafe.space)**
  A café discovery and review app for students in Makassar, built with Laravel and Livewire. Comes with moderation tools, because reviews need a bit of looking after.

- **[Sniper-Loker ↗](https://github.com/ahmadaqib/Sniper-Loker)**
  A Go backend that pulls job listings from several sources and pushes new ones to you in real time over WebSockets.

### What I work with

Most days it's **PHP, Laravel, Livewire, Vue, TypeScript, and Tailwind** on the front of things, **PostgreSQL, MySQL, and Redis** for data, and **Docker, Linux, Nginx, Cloudflare, and CI/CD** keeping it all running.

<details>
<summary>And a few more</summary>
<br>

I'm also comfortable with Python, Node.js, and CodeIgniter on the backend, MongoDB and Firebase for data, and Flutter or native Android for mobile. Outside of code, I do some design and 3D work in Figma, Photoshop, Blender, and Cinema 4D.

</details>

<details>
<summary>How I use AI</summary>
<br>

I use Codex, Claude Code, and ChatGPT pretty much every day, and Gemini now and then. Mostly to find my way around unfamiliar code, compare approaches, draft tests, and get a second pair of eyes on a change.

But I still read the diff, check it against the business rules, and make sure I know what a change actually does before it ships. The tools help. The responsibility stays with me.

</details>

### What I'm learning right now

- **Go and Rust.** I want to ship a small tool that solves a real problem, with the trade-offs written down and benchmarks that actually mean something.
- **Backend performance.** Taking a slow path, making it reproducible, and showing an honest before and after.
- **Deploys I don't have to babysit.** Repeatable releases, and actually practicing the rollback before I need it.
- **Distributed systems.** Poking at what happens when work gets retried, delayed, or cut off halfway.

### A problem I keep coming back to

A customer places an order. The server saves it, but the response gets lost on the way back. The client retries. Now there are two orders, and the customer only wanted one.

A longer timeout or a disabled submit button helps a little, but neither really fixes it. What I'd reach for is an **idempotency key**: the client sends the same key on every retry, and the server treats it as unique, even when two requests land at the same moment.

The interesting part is the edges. What if the order gets saved but the key doesn't? Do the payment, the stock update, and the notification each survive a retry? And if the same key shows up with a different payload, I'd reject it. The same identity shouldn't quietly start meaning something else.

[Stripe's take on this](https://docs.stripe.com/api/idempotent_requests) is worth a read if you're curious. And if you've got your own version of this problem, I'd honestly love to hear it.

### Let's talk

I'm open to engineering projects, architecture discussions, and collaborations. No need for a polished brief. Just tell me what you're building, where it's stuck, and what you're working around. That's plenty to start with.

**[Send me an email →](mailto:ahmadaqibsunu@gmail.com)** &nbsp;·&nbsp; **[See my portfolio ↗](https://ahmadaqib.site)**

<p align="center"><sub>Usually on Linux. Usually with coffee. Probably staring at a query plan.</sub></p>
