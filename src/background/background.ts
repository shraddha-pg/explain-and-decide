// Background service worker

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "explain-selection",
      title: "Explain & Decide this",
      contexts: ["selection"],
    });
    chrome.contextMenus.create({
      id: "explain-page",
      title: "Explain & Decide this page",
      contexts: ["page"],
    });
  });
});

// Context menu click — already works fine
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) return;

  if (info.menuItemId === "explain-selection" && info.selectionText) {
    chrome.tabs.sendMessage(tab.id, {
      type: "EXPLAIN_TEXT",
      text: info.selectionText,
    }).catch(() => {});
  }

  if (info.menuItemId === "explain-page") {
    chrome.tabs.sendMessage(tab.id, { type: "EXPLAIN_PAGE" }).catch(() => {});
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {

  // Popup asks background to forward a message to the active tab
  // Background stays alive so the message actually gets delivered
  if (message.type === "FORWARD_TO_TAB") {
    console.log("FORWARD_TO_TAB received");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      console.log("tabId:", tabId);
      if (!tabId) return;

      chrome.scripting
        .executeScript({
          target: { tabId },
          files: ["content.js"],
        })
        .then(() => {
          console.log("Script injected successfully");
          setTimeout(() => {
            chrome.tabs
              .sendMessage(tabId, { type: message.forward })
              .then(() => console.log("Message sent OK"))
              .catch((err) => console.log("Send failed:", err.message));
          }, 200);
        })
        .catch((err) => {
          console.log("Inject failed:", err.message);
          chrome.tabs
            .sendMessage(tabId, { type: message.forward })
            .catch((e) => console.log("Fallback also failed:", e.message));
        });
    });
    return false;
  }

  // Proxy Groq API call — keeps API key safe in storage
  if (message.type === "CALL_GROQ") {
    chrome.storage.sync.get("groqApiKey", async (result) => {
      const apiKey = result.groqApiKey;
      if (!apiKey) { sendResponse({ error: "NO_API_KEY" }); return; }

      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            max_tokens: 800,
            temperature: 0.4,
            messages: [
              {
                role: "system",
                content: `You are a sharp, no-fluff assistant. When given text, you analyze it and respond ONLY in this exact JSON format with no extra text:
{
  "summary": "What this is saying in 1-2 plain English sentences. Simple language, no jargon.",
  "wants": "What this text wants from the reader or what action it expects. 1 sentence.",
  "flags": "Any red flags, suspicious claims, hidden clauses, or things to be careful about. If none, say null.",
  "action": "The single most important thing the reader should do next. 1 clear sentence.",
  "complexity": "simple | moderate | complex",
  "category": "legal | financial | news | email | technical | medical | general"
}
Be direct. Be honest. Warn about red flags. Don't sugarcoat.`,
              },
              { role: "user", content: `Analyze this text:\n\n${message.text}` },
            ],
          }),
        });

        const data = await res.json();
        const raw = data.choices?.[0]?.message?.content ?? "";

        try {
          const clean = raw.replace(/```json|```/g, "").trim();
          sendResponse({ result: JSON.parse(clean) });
        } catch {
          sendResponse({ error: "PARSE_ERROR", raw });
        }
      } catch (err) {
        sendResponse({ error: "FETCH_ERROR", message: String(err) });
      }
    });

    return true; // keep channel open for async
  }
});
