import { createRoot } from "react-dom/client";
import SidebarApp from "../sidebar/SidebarApp";

// Inject CSS
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = chrome.runtime.getURL("content.css");
document.head.appendChild(link);

// Guard against double injection
if (!(window as any).__edLoaded) {
  (window as any).__edLoaded = true;

  // Mount React sidebar
  const host = document.createElement("div");
  host.id = "ed-host";
  document.body.appendChild(host);
  createRoot(host).render(<SidebarApp />);

  // Forward chrome messages to SidebarApp via CustomEvent
  chrome.runtime.onMessage.addListener((msg) => {
    window.dispatchEvent(new CustomEvent("explain-decide-msg", { detail: msg }));
    return false;
  });
}
