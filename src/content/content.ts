// Content script — injects the explain sidebar into any webpage
  // Inject styles
  function injectStyles() {
    if (document.getElementById("ed-styles")) return;
    const link = document.createElement("link");
    link.id = "ed-styles";
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL("content.css");
    document.head.appendChild(link);
  }
  injectStyles();
  
// GUARD: prevent double injection when executeScript runs on already-loaded tab
if ((window as any).__explainDecideLoaded) {
  // Already loaded — just handle the pending action if any
} else {
  (window as any).__explainDecideLoaded = true;

  let sidebarEl: HTMLElement | null = null;
  let isSidebarOpen = false;

  function createSidebar() {
    if (sidebarEl) return;
    sidebarEl = document.createElement("div");
    sidebarEl.id = "explain-decide-sidebar";
    sidebarEl.innerHTML = `
      <div id="ed-panel">
        <div id="ed-header">
          <div id="ed-logo">
            <span id="ed-logo-icon">⚡</span>
            <span id="ed-logo-text">Explain & Decide</span>
          </div>
          <button id="ed-close">✕</button>
        </div>
        <div id="ed-body">
          <div id="ed-idle">
            <div id="ed-idle-icon">🔍</div>
            <p id="ed-idle-title">Select text on this page</p>
            <p id="ed-idle-sub">or right-click → "Explain & Decide"</p>
            <button id="ed-explain-page-btn">Explain entire page</button>
          </div>
          <div id="ed-loading" style="display:none">
            <div id="ed-spinner"></div>
            <p id="ed-loading-text">Analyzing...</p>
          </div>
          <div id="ed-result" style="display:none"></div>
          <div id="ed-error" style="display:none">
            <div id="ed-error-icon">⚠️</div>
            <p id="ed-error-text"></p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(sidebarEl);
    document.getElementById("ed-close")?.addEventListener("click", closeSidebar);
    document.getElementById("ed-explain-page-btn")?.addEventListener("click", explainPage);
  }

  function openSidebar() {
    if (!sidebarEl) createSidebar();
    sidebarEl!.classList.add("open");
    isSidebarOpen = true;
  }

  function closeSidebar() {
    sidebarEl?.classList.remove("open");
    isSidebarOpen = false;
  }

  function showLoading(text = "Analyzing...") {
    document.getElementById("ed-idle")!.style.display = "none";
    const loading = document.getElementById("ed-loading")!;
    loading.style.display = "flex";
    document.getElementById("ed-result")!.style.display = "none";
    document.getElementById("ed-error")!.style.display = "none";
    document.getElementById("ed-loading-text")!.textContent = text;
  }

  function showResult(data: {
    summary: string;
    wants: string;
    flags: string | null;
    action: string;
    complexity: string;
    category: string;
  }) {
    document.getElementById("ed-loading")!.style.display = "none";
    const result = document.getElementById("ed-result")!;
    const complexityColor = data.complexity === "simple" ? "#10b981" : data.complexity === "moderate" ? "#f59e0b" : "#ef4444";
    const categoryIcons: Record<string, string> = {
      legal: "⚖️", financial: "💰", news: "📰",
      email: "✉️", technical: "💻", medical: "🏥", general: "📄",
    };

    result.style.display = "flex";
    result.innerHTML = `
      <div class="ed-meta">
        <span class="ed-category">${categoryIcons[data.category] ?? "📄"} ${data.category}</span>
        <span class="ed-complexity" style="color:${complexityColor}">● ${data.complexity}</span>
      </div>
      <div class="ed-card">
        <div class="ed-card-label">🔍 What is this saying?</div>
        <div class="ed-card-text">${data.summary}</div>
      </div>
      <div class="ed-card">
        <div class="ed-card-label">⚡ What does it want from you?</div>
        <div class="ed-card-text">${data.wants}</div>
      </div>
      ${data.flags && data.flags !== "null" ? `
      <div class="ed-card ed-card-warning">
        <div class="ed-card-label">🚩 Watch out</div>
        <div class="ed-card-text">${data.flags}</div>
      </div>` : `
      <div class="ed-card ed-card-safe">
        <div class="ed-card-label">✅ No red flags</div>
        <div class="ed-card-text">Nothing suspicious detected.</div>
      </div>`}
      <div class="ed-card ed-card-action">
        <div class="ed-card-label">👉 What should you do?</div>
        <div class="ed-card-text">${data.action}</div>
      </div>
      <button id="ed-copy-btn">Copy summary</button>
    `;

    document.getElementById("ed-copy-btn")?.addEventListener("click", () => {
      const text = `What it says: ${data.summary}\n\nWhat it wants: ${data.wants}\n\n${data.flags && data.flags !== "null" ? `Watch out: ${data.flags}\n\n` : ""}What to do: ${data.action}`;
      navigator.clipboard.writeText(text);
      const btn = document.getElementById("ed-copy-btn");
      if (btn) { btn.textContent = "Copied! ✓"; setTimeout(() => { if (btn) btn.textContent = "Copy summary"; }, 2000); }
    });
  }

  function showError(msg: string) {
    document.getElementById("ed-loading")!.style.display = "none";
    document.getElementById("ed-error")!.style.display = "flex";
    document.getElementById("ed-error-text")!.textContent = msg;
  }

  function analyzeText(text: string) {
    if (!text || text.trim().length < 20) { showError("Please select more text."); return; }
    openSidebar();
    showLoading("Reading and analyzing...");
    chrome.runtime.sendMessage({ type: "CALL_GROQ", text: text.slice(0, 4000) }, (response) => {
      if (response?.error === "NO_API_KEY") { showError("Add your Groq API key in the extension popup first."); return; }
      if (response?.error) { showError("Something went wrong. Please try again."); return; }
      showResult(response.result);
    });
  }

  function explainPage() {
    const article =
      document.querySelector("article") ||
      document.querySelector("main") ||
      document.querySelector('[role="main"]') ||
      document.body;
    analyzeText(article.innerText.slice(0, 4000));
  }

  // Listen for messages
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "EXPLAIN_TEXT") analyzeText(message.text);
    if (message.type === "EXPLAIN_PAGE") explainPage();
    if (message.type === "TOGGLE_SIDEBAR") {
      if (isSidebarOpen) closeSidebar();
      else openSidebar();
    }
  });
}
