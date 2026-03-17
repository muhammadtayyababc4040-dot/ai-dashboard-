// =============================================
// AI BUSINESS DASHBOARD — app.js
// Uses Claude AI (claude-sonnet-4-20250514)
// Replace ANTHROPIC_API_KEY in config below
// =============================================

const CONFIG = {
  API_KEY: "YOUR_ANTHROPIC_API_KEY", // ← Replace with your key
  MODEL: "claude-sonnet-4-20250514",
};

// ── SAMPLE DATA ────────────────────────────────────────────────
const SALES = [
  { id: "TXN-001", item: "Coffee & Pastry", amount: 6.50, time: "08:12", payment: "Card", status: "ok" },
  { id: "TXN-002", item: "Fuel – Petrol 40L", amount: 72.00, time: "08:45", payment: "Card", status: "ok" },
  { id: "TXN-003", item: "Energy Drink x4", amount: 8.40, time: "09:30", payment: "Cash", status: "ok" },
  { id: "TXN-004", item: "Cigarettes x20", amount: 16.00, time: "10:05", payment: "Cash", status: "ok" },
  { id: "TXN-005", item: "Fuel – Diesel 80L", amount: 148.00, time: "10:22", payment: "Card", status: "ok" },
  { id: "TXN-006", item: "Lottery Ticket", amount: 2.00, time: "11:00", payment: "Cash", status: "ok" },
  { id: "TXN-007", item: "Sandwich + Drink", amount: 9.50, time: "12:15", payment: "Card", status: "ok" },
  { id: "TXN-008", item: "Fuel – Petrol 20L", amount: 9999.99, time: "13:45", payment: "Card", status: "warning" },
  { id: "TXN-009", item: "Motor Oil 5L", amount: 34.99, time: "14:30", payment: "Card", status: "ok" },
  { id: "TXN-010", item: "Snacks Bundle", amount: 12.80, time: "15:10", payment: "Cash", status: "ok" },
  { id: "TXN-011", item: "Car Wash Token", amount: 8.00, time: "15:55", payment: "Cash", status: "ok" },
  { id: "TXN-012", item: "Refund – Pastry", amount: -3.50, time: "16:20", payment: "Card", status: "warning" },
];

const INVENTORY = [
  { product: "Petrol (Litres)", category: "Fuel", stock: 4200, min: 1000, status: "ok" },
  { product: "Diesel (Litres)", category: "Fuel", stock: 890, min: 1000, status: "danger" },
  { product: "Coffee Pods", category: "Beverages", stock: 340, min: 200, status: "ok" },
  { product: "Energy Drinks", category: "Beverages", stock: 48, min: 60, status: "warning" },
  { product: "Cigarettes (Packs)", category: "Tobacco", stock: 210, min: 100, status: "ok" },
  { product: "Sandwiches", category: "Food", stock: 14, min: 20, status: "warning" },
  { product: "Motor Oil 5L", category: "Auto", stock: 22, min: 10, status: "ok" },
  { product: "Lottery Tickets", category: "Other", stock: 5, min: 20, status: "danger" },
  { product: "Car Wash Tokens", category: "Services", stock: 78, min: 30, status: "ok" },
  { product: "Snack Bars", category: "Food", stock: 112, min: 50, status: "ok" },
];

const WEEKLY_REVENUE = [1240, 980, 1650, 1420, 1890, 2100, 1750];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("current-date").textContent =
    new Date().toLocaleDateString("en-IE", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  initNav();
  loadKPIs();
  renderCharts();
  renderSalesTable(SALES);
  renderInventoryTable(INVENTORY);
  bindButtons();
});

function initNav() {
  document.querySelectorAll(".nav-item").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const page = link.dataset.page;
      document.querySelectorAll(".nav-item").forEach(l => l.classList.remove("active"));
      document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
      link.classList.add("active");
      document.getElementById("page-" + page).classList.add("active");
      document.getElementById("page-title").textContent = link.textContent.trim().replace(/^[^ ]+ /, "");
    });
  });
  document.getElementById("refresh-btn").addEventListener("click", () => {
    loadKPIs(); renderCharts();
  });
}

// ── KPIs ──────────────────────────────────────────────────────
function loadKPIs() {
  const revenue = SALES.filter(s => s.amount > 0).reduce((a, s) => a + s.amount, 0);
  const txns = SALES.length;
  const avg = (revenue / SALES.filter(s => s.amount > 0).length).toFixed(2);
  const alerts = INVENTORY.filter(i => i.status !== "ok").length;
  document.getElementById("kpi-revenue").textContent = "€" + revenue.toFixed(2);
  document.getElementById("kpi-transactions").textContent = txns;
  document.getElementById("kpi-avg").textContent = "€" + avg;
  document.getElementById("kpi-alerts").textContent = alerts;
}

// ── CHARTS ────────────────────────────────────────────────────
let revenueChart, productsChart;
function renderCharts() {
  if (revenueChart) revenueChart.destroy();
  if (productsChart) productsChart.destroy();

  revenueChart = new Chart(document.getElementById("revenue-chart"), {
    type: "bar",
    data: {
      labels: DAYS,
      datasets: [{ label: "Revenue (€)", data: WEEKLY_REVENUE, backgroundColor: "#7c8cf8", borderRadius: 6 }]
    },
    options: { plugins: { legend: { display: false } }, scales: { x: { ticks: { color: "#64748b" }, grid: { color: "#2d3148" } }, y: { ticks: { color: "#64748b" }, grid: { color: "#2d3148" } } } }
  });

  productsChart = new Chart(document.getElementById("products-chart"), {
    type: "doughnut",
    data: {
      labels: ["Fuel", "Food & Drink", "Tobacco", "Auto", "Other"],
      datasets: [{ data: [62, 18, 10, 6, 4], backgroundColor: ["#7c8cf8", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"], borderWidth: 0 }]
    },
    options: { plugins: { legend: { labels: { color: "#94a3b8", font: { size: 11 } } } } }
  });
}

// ── TABLES ───────────────────────────────────────────────────
function renderSalesTable(data) {
  document.getElementById("sales-tbody").innerHTML = data.map(s => `
    <tr>
      <td>${s.id}</td><td>${s.item}</td>
      <td style="color:${s.amount < 0 ? "#ef4444" : "#22c55e"}">€${s.amount.toFixed(2)}</td>
      <td>${s.time}</td><td>${s.payment}</td>
      <td><span class="badge ${s.status}">${s.status === "ok" ? "✓ OK" : "⚠ Review"}</span></td>
    </tr>`).join("");
}

function renderInventoryTable(data) {
  document.getElementById("inventory-tbody").innerHTML = data.map(i => `
    <tr>
      <td>${i.product}</td><td>${i.category}</td><td>${i.stock}</td><td>${i.min}</td>
      <td><span class="badge ${i.status}">${i.status === "ok" ? "✓ OK" : i.status === "warning" ? "⚠ Low" : "✕ Critical"}</span></td>
    </tr>`).join("");
}

// ── SEARCH ───────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sales-search").addEventListener("input", e => {
    const q = e.target.value.toLowerCase();
    renderSalesTable(SALES.filter(s => s.item.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)));
  });
});

// ── AI CALLS ─────────────────────────────────────────────────
function bindButtons() {
  document.getElementById("generate-summary-btn").addEventListener("click", generateSummary);
  document.getElementById("ai-flag-btn").addEventListener("click", flagAnomalies);
  document.getElementById("ai-reorder-btn").addEventListener("click", reorderSuggestions);
  document.getElementById("generate-report-btn").addEventListener("click", generateReport);
}

async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CONFIG.API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: CONFIG.MODEL,
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content[0].text;
}

async function generateSummary() {
  const btn = document.getElementById("generate-summary-btn");
  const out = document.getElementById("ai-summary-output");
  btn.disabled = true; btn.classList.add("loading");
  out.innerHTML = '<span class="placeholder">Generating AI summary...</span>';
  try {
    const revenue = SALES.filter(s => s.amount > 0).reduce((a, s) => a + s.amount, 0);
    const alerts = INVENTORY.filter(i => i.status !== "ok").length;
    const text = await callClaude(
      `You are a business analyst AI. Analyse this retail business data and give a concise, actionable summary (3-4 sentences max):\n\nToday's Revenue: €${revenue.toFixed(2)}\nTransactions: ${SALES.length}\nAnomolous transactions: ${SALES.filter(s => s.status !== "ok").length}\nInventory alerts: ${alerts} items (${INVENTORY.filter(i => i.status === "danger").map(i => i.product).join(", ")})\nTop revenue day this week: Saturday (€2,100)\n\nHighlight key wins, risks, and one recommendation.`
    );
    out.textContent = text;
  } catch (e) {
    out.innerHTML = `<span style="color:#ef4444">Error: ${e.message}. Check your API key in app.js</span>`;
  }
  btn.disabled = false; btn.classList.remove("loading");
}

async function flagAnomalies() {
  const btn = document.getElementById("ai-flag-btn");
  const out = document.getElementById("anomaly-output");
  btn.disabled = true; btn.classList.add("loading");
  out.style.display = "block";
  out.innerHTML = '<span class="placeholder">Scanning for anomalies...</span>';
  try {
    const text = await callClaude(
      `You are a fraud detection AI for a petrol station. Review these transactions and flag anything suspicious (unusual amounts, negative values, patterns). Be specific about transaction IDs.\n\nTransactions:\n${SALES.map(s => `${s.id}: ${s.item} — €${s.amount} at ${s.time} via ${s.payment}`).join("\n")}`
    );
    out.textContent = text;
  } catch (e) {
    out.innerHTML = `<span style="color:#ef4444">Error: ${e.message}</span>`;
  }
  btn.disabled = false; btn.classList.remove("loading");
}

async function reorderSuggestions() {
  const btn = document.getElementById("ai-reorder-btn");
  const out = document.getElementById("reorder-output");
  btn.disabled = true; btn.classList.add("loading");
  out.style.display = "block";
  out.innerHTML = '<span class="placeholder">Generating reorder recommendations...</span>';
  try {
    const text = await callClaude(
      `You are an inventory management AI. Based on this stock data, give prioritised reorder recommendations. Be concise and practical.\n\nInventory:\n${INVENTORY.map(i => `${i.product} (${i.category}): ${i.stock} units, minimum: ${i.min} — Status: ${i.status}`).join("\n")}`
    );
    out.textContent = text;
  } catch (e) {
    out.innerHTML = `<span style="color:#ef4444">Error: ${e.message}</span>`;
  }
  btn.disabled = false; btn.classList.remove("loading");
}

async function generateReport() {
  const btn = document.getElementById("generate-report-btn");
  const out = document.getElementById("report-output");
  const prompt = document.getElementById("report-prompt").value.trim();
  if (!prompt) { alert("Please enter a report request first."); return; }
  btn.disabled = true; btn.classList.add("loading");
  out.style.display = "block";
  out.innerHTML = '<span class="placeholder">Generating your report...</span>';
  const context = `Business data context:\n- Today's revenue: €${SALES.filter(s => s.amount > 0).reduce((a, s) => a + s.amount, 0).toFixed(2)}\n- Transactions: ${SALES.length}\n- Weekly revenue: Mon €1240, Tue €980, Wed €1650, Thu €1420, Fri €1890, Sat €2100, Sun €1750\n- Inventory alerts: ${INVENTORY.filter(i => i.status !== "ok").length} items`;
  try {
    const text = await callClaude(`${context}\n\nUser request: ${prompt}`);
    out.textContent = text;
  } catch (e) {
    out.innerHTML = `<span style="color:#ef4444">Error: ${e.message}</span>`;
  }
  btn.disabled = false; btn.classList.remove("loading");
}
