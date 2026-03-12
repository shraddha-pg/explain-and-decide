import { useState, useEffect, useCallback, useRef } from "react";
import { AnalysisResult } from "../types";
import { Tab, View, C } from "./types";
import AnalyzeTab from "./AnalyzeTab";
import SettingsTab from "./SettingsTab";

const sendMsg = (msg: any, cb?: (r: any) => void) => chrome.runtime.sendMessage(msg, cb);
const getStorage = (key: string, cb: (r: any) => void) => chrome.storage.sync.get(key, cb);
const setStorage = (obj: any, cb?: () => void) => chrome.storage.sync.set(obj, cb);
const removeStorage = (key: string, cb?: () => void) => chrome.storage.sync.remove(key, cb);

function callGroq(text: string): Promise<AnalysisResult> {
  return new Promise((resolve, reject) => {
    sendMsg({ type: "CALL_GROQ", text: text.slice(0, 4000) }, (r: any) => {
      if (r?.error === "NO_API_KEY") reject(new Error("NO_API_KEY"));
      else if (r?.error === "INVALID_API_KEY") reject(new Error("INVALID_API_KEY"));
      else if (r?.error) reject(new Error("FETCH_ERROR"));
      else resolve(r.result);
    });
  });
}

export default function SidebarApp() {
  // Sidebar state
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const setOpenSync = (v: boolean) => { openRef.current = v; setOpen(v); };
  const [width, setWidth] = useState(400);
  const [tab, setTab] = useState<Tab>("analyze");

  // Analyze state
  const [view, setView] = useState<View>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Settings state
  const [apiKey, setApiKey] = useState("");
  const [savedKey, setSavedKey] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [apiError, setApiError] = useState("");
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    getStorage("groqApiKey", (res: any) => {
      if (res.groqApiKey) { setSavedKey(res.groqApiKey); setApiKey(res.groqApiKey); setHasKey(true); }
      else { setHasKey(false); setTab("settings"); }
    });
  }, []);

  const analyze = useCallback(async (text: string) => {
    if (!text || text.trim().length < 20) return;
    setTab("analyze"); setView("loading"); setResult(null); setErrorMsg("");
    try {
      const data = await callGroq(text);
      setResult(data); setView("result");
    } catch (err: any) {
      if (err.message === "NO_API_KEY" || err.message === "INVALID_API_KEY") {
        setApiError(err.message === "INVALID_API_KEY" ? "API key is invalid. Please update it." : "Add your Groq API key to get started.");
        setHasKey(false); setTab("settings"); setView("idle");
      } else {
        setErrorMsg("Something went wrong. Try again."); setView("error");
      }
    }
  }, []);

  const explainPage = useCallback(() => {
    const el = document.querySelector("article, main, [role='main']") || document.body;
    analyze((el as HTMLElement).innerText.slice(0, 4000));
  }, [analyze]);

  // Message bridge from content script
  useEffect(() => {
    const handler = (e: Event) => {
      const msg = (e as CustomEvent).detail;
      if (msg.type === "TOGGLE_SIDEBAR") setOpenSync(!openRef.current);
      if (msg.type === "EXPLAIN_PAGE") { setOpenSync(true); setTimeout(explainPage, 100); }
      if (msg.type === "EXPLAIN_TEXT") { setOpenSync(true); setTimeout(() => analyze(msg.text), 100); }
    };
    window.addEventListener("explain-decide-msg", handler);
    return () => window.removeEventListener("explain-decide-msg", handler);
  }, [analyze, explainPage]);

  // Resize
  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX, startW = width;
    const onMove = (ev: MouseEvent) => setWidth(Math.min(600, Math.max(300, startW + startX - ev.clientX)));
    const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [width]);

  // Settings handlers
  const saveKey = () => {
    setStorage({ groqApiKey: apiKey }, () => {
      setSavedKey(apiKey); setHasKey(true); setApiError(""); setSaveMsg("Saved!");
      setTimeout(() => { setSaveMsg(""); setTab("analyze"); }, 1000);
    });
  };
  const removeKey = () => removeStorage("groqApiKey", () => {
    setSavedKey(""); setApiKey(""); setHasKey(false); setApiError("");
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes edIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes edSpin{to{transform:rotate(360deg)}}
        #ed-sb *{box-sizing:border-box;margin:0;padding:0;font-family:'DM Sans',sans-serif!important}
        #ed-sb ::-webkit-scrollbar{width:3px}
        #ed-sb ::-webkit-scrollbar-thumb{background:rgba(245,158,11,0.3);border-radius:2px}
        #ed-sb textarea::placeholder,#ed-sb input::placeholder{color:rgba(30,20,5,0.3)!important}
        #ed-sb button:focus,#ed-sb textarea:focus,#ed-sb input:focus{outline:none!important}
        #ed-resize:hover{background:rgba(245,158,11,0.6)!important}
      `}</style>

      <div id="ed-sb" style={{
        position: "fixed", top: 0, right: 0, width, height: "100vh",
        background: C.bg, borderLeft: "1px solid rgba(180,140,60,0.18)",
        boxShadow: "-6px 0 32px rgba(0,0,0,0.09)",
        display: "flex", flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(105%)",
        transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
        zIndex: 2147483647, pointerEvents: open ? "all" : "none",
      }}>
        {/* Resize handle */}
        <div id="ed-resize" onMouseDown={startResize} style={{ position: "absolute", left: 0, top: 0, width: 4, height: "100%", cursor: "ew-resize", background: "rgba(245,158,11,0.2)", transition: "background 0.15s" }} />

        {/* Header */}
        <div style={{ padding: "12px 16px", flexShrink: 0, borderBottom: `1px solid ${C.border}`, background: "rgba(245,158,11,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 16 }}>⚡</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>Explain & Decide</span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {(["analyze", "settings"] as Tab[]).map(t => (
              <button key={t} onClick={() => { if (t === "analyze" && !hasKey) return; setTab(t); }} style={{
                fontSize: 10, padding: "4px 10px", borderRadius: 6, letterSpacing: 1, fontWeight: 700,
                textTransform: "uppercase", cursor: t === "analyze" && !hasKey ? "not-allowed" : "pointer",
                background: tab === t ? C.accent : "rgba(0,0,0,0.05)",
                border: `1px solid ${tab === t ? C.accentDark : C.border}`,
                color: tab === t ? "#000" : t === "analyze" && !hasKey ? "rgba(30,20,5,0.2)" : C.muted,
                transition: "all 0.15s",
              }}>{t}</button>
            ))}
            <button onClick={() => setOpenSync(false)} style={{ marginLeft: 2, background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 13, color: C.muted }}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          {tab === "analyze" && (
            <AnalyzeTab
              view={view}
              result={result}
              errorMsg={errorMsg}
              onAnalyze={(text) => { analyze(text); }}
              onExplainPage={explainPage}
              onReset={() => { setView("idle"); setResult(null); setErrorMsg(""); }}
            />
          )}
          {tab === "settings" && (
            <SettingsTab
              apiKey={apiKey}
              savedKey={savedKey}
              saveMsg={saveMsg}
              apiError={apiError}
              onKeyChange={setApiKey}
              onSave={saveKey}
              onRemove={removeKey}
            />
          )}
        </div>
      </div>
    </>
  );
}
