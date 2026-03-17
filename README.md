# 📊 AI-Powered Business Dashboard

A clean, dark-themed internal business dashboard powered by **Claude AI (claude-sonnet-4-20250514)**. Built using vanilla HTML, CSS, and JavaScript — no frameworks, no build step, just open and run.

![Dashboard Preview](https://img.shields.io/badge/Built%20with-Claude%20AI-7c8cf8?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live-22c55e?style=for-the-badge)

## 🚀 Features

- **KPI Overview** — Revenue, transactions, average order value, stock alerts
- **Interactive Charts** — Daily revenue bar chart + product category breakdown (Chart.js)
- **Sales Table** — Searchable transaction log with status badges
- **🤖 AI: Generate Business Summary** — Claude analyses your data and writes an executive summary
- **🤖 AI: Flag Anomalies** — Claude scans transactions and highlights suspicious entries
- **🤖 AI: Reorder Suggestions** — Claude prioritises what stock needs ordering and why
- **🤖 AI Report Generator** — Ask Claude for any custom report in plain English

## 🛠 Tech Stack

- HTML / CSS / JavaScript (no framework)
- [Chart.js](https://www.chartjs.org/) for data visualisation
- [Anthropic Claude API](https://docs.anthropic.com) (`claude-sonnet-4-20250514`)

## ⚙️ Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-dashboard.git
   cd ai-dashboard
   ```

2. Open `app.js` and replace the API key:
   ```js
   const CONFIG = {
     API_KEY: "YOUR_ANTHROPIC_API_KEY", // ← paste your key here
     MODEL: "claude-sonnet-4-20250514",
   };
   ```

3. Open `index.html` in your browser — no server needed.

> **Note:** For production use, move API calls to a backend to protect your API key.

## 📁 File Structure

```
ai-dashboard/
├── index.html   # App structure
├── style.css    # Dark theme styling
├── app.js       # Data, charts, and Claude AI integration
└── README.md
```

## 💡 How the AI Integration Works

Each AI button sends your business data as context to the Claude API:

```js
async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": CONFIG.API_KEY, ... },
    body: JSON.stringify({ model: CONFIG.MODEL, max_tokens: 1000, messages: [{ role: "user", content: prompt }] })
  });
  return (await res.json()).content[0].text;
}
```

The dashboard passes live data (revenue totals, inventory levels, transaction logs) as context so Claude gives accurate, data-driven responses — not generic answers.

## 🧠 Built With AI-Native Development

This project was built using vibe coding methodology — using Claude Code to generate structure, then reviewing, testing, and refining every piece of output before shipping.

---

Built by **Muhammad Tayyab** | BSc (Hons) Computing, Dublin
