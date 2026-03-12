import { useEffect } from "react";

// Popup just toggles the sidebar then closes itself
export default function App() {
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (!tabId) return;
      chrome.runtime.sendMessage({ type: "FORWARD_TO_TAB", forward: "TOGGLE_SIDEBAR" });
      setTimeout(() => window.close(), 80);
    });
  }, []);

  return (
    <div style={{ width: 1, height: 1, overflow: "hidden" }} />
  );
}
