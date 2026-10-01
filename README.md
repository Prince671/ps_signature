# Prince Soni | Portfolio 🚀

A premium, high-performance developer portfolio built with a **Nothing OS**-inspired **Brutalist** aesthetic — dot-matrix typography, sharp borders, and a signal-red accent palette. Showcases full-stack MERN development and GenAI engineering work through an immersive, interactive experience.

## ✨ key features

- **Matrix Snake Loader**: A custom 7x7 dot-matrix spiral animation with real-time system logs.
- **Interactive Terminal**: A fully functional custom terminal with command history (↑/↓ arrows), typewriter effects, and a `nova` command to summon the AI assistant.
- **Nova AI Assistant**: A Gemini-powered chat assistant that answers questions about the portfolio, skills, and projects.
- **Live GitHub Activity**: A real contribution heatmap pulled from a public, no-auth GitHub API.
- **Live LeetCode Activity**: A real submission heatmap and solved-problem stats pulled from a public LeetCode data adapter, with a graceful fallback if the API is unavailable.
- **Bento Grid Skills**: A filterable grid covering languages, frameworks, AI/GenAI tooling, databases, cloud, and dev tools.
- **Dynamic Project Filters & System Architecture Diagrams**: Each project includes an animated node diagram of its architecture.
- **Availability Badge**: A real-time `STATUS: AVAILABLE_FOR_HIRE` indicator in the Hero section.
- **Atmospheric Rainfall**: High-performance Canvas-based background animation.
- **SEO Optimized**: Complete meta tags, Open Graph support, sitemap.xml, and robots.txt.

## 🛠️ tech stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion
- **Showcased Stack**: JavaScript, React, Node.js, Express, MongoDB, Python, LangChain, Pinecone/ChromaDB, AWS
- **AI Assistant**: Google Gemini (`@google/genai`)
- **Deployment**: Vercel

## 🚀 getting started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Prince671/Prince-Soni-Portfolio.git
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy `.env.example` to `.env` and fill in your own values:
   ```bash
   cp .env.example .env
   ```
   - `VITE_SERVICE_ID`, `VITE_TEMPLATE_ID`, `VITE_PUBLIC_KEY` — EmailJS credentials for the contact form.
   - `VITE_RESUME_URL` — optional external resume link (defaults to `/resume.pdf`).
   - `VITE_CHAT_ENDPOINT` — optional backend endpoint for the Pulse AI assistant. It should accept `{ model, input }` JSON and return `{ output_text }` or `{ answer }` JSON.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Production build:**
   ```bash
   npm run build
   npm run preview
   ```

## 🔴 GitHub & LeetCode activity

Both heatmaps use public, unauthenticated third-party APIs and require no secrets:
- GitHub: `github-contributions-api.deno.dev` (username hardcoded in `GithubStats.jsx`)
- LeetCode: `alfa-leetcode-api.onrender.com` (username hardcoded in `LeetCodeStats.jsx`)

These are community-run adapters, not official APIs — if either goes down, the corresponding section shows a graceful "temporarily unavailable" fallback and a direct link to the profile instead of fabricated numbers.

## ⚠️ Security note on the AI assistant

The Pulse assistant sends requests only to `VITE_CHAT_ENDPOINT`. Keep provider credentials on that server endpoint; never put private AI API keys in `VITE_*` variables because Vite bundles them into public client code. Without an endpoint, Pulse offers a contact fallback.

## 📄 License

This project is personal portfolio work, originally adapted from an open-source portfolio template and personalized with my own content, projects, and branding. Feel free to use it for inspiration.

---
Developed by **Prince Soni** 🧬
