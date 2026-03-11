import { useState, useEffect } from "react";
import { theme } from "./theme";
import { TabType } from "./types";
import AnalyzeTab from "./components/AnalyzeTab";
import SettingsTab from "./components/SettingsTab";

export default function App() {
  const [tab, setTab] = useState<TabType>("analyze");
  const [hasKey, setHasKey] = useState<boolean | null>(null); 

  useEffect(() => {
    chrome.storage.sync.get("groqApiKey", (res) => {
      if (res.groqApiKey) {
        setHasKey(true);
        setTab("analyze");
      } else {
        setHasKey(false);
        setTab("settings");
      }
    });
  }, []);

  if (hasKey === null) {
    return (
      <div style={{ width: 380, height: 480, background: "#faf8f4", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 24, height: 24, border: "2px solid rgba(245,158,11,0.2)", borderTopColor: "#f59e0b", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      width: 380,
      minHeight: 480,
      maxHeight: 600,
      background: theme.bg,
      color: theme.text,
      fontFamily: theme.fontSans,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(245,158,11,0.25); border-radius: 2px; }
        textarea::placeholder { color: rgba(30,20,5,0.35); }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "13px 16px",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        background: "rgba(245,158,11,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 17 }}>⚡</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: theme.accent, letterSpacing: 0.3 }}>
            Explain & Decide
          </span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {(["analyze", "settings"] as TabType[]).map(t => (
            <button
              key={t}
              onClick={() => {
                if (t === "analyze" && !hasKey) return; // block karo
                setTab(t);
              }}
              style={{
                fontSize: 10, padding: "4px 10px", borderRadius: 6,
                background: tab === t ? theme.accent : "rgba(0,0,0,0.06)",
                border: "1px solid " + (tab === t ? theme.accentDark : "rgba(0,0,0,0.1)"),
                color: tab === t ? "#000" : (t === "analyze" && !hasKey) ? "rgba(30,20,5,0.2)" : "rgba(30,20,5,0.4)",
                cursor: (t === "analyze" && !hasKey) ? "not-allowed" : "pointer",
                fontFamily: theme.fontMono, letterSpacing: 1,
                fontWeight: 700, textTransform: "uppercase" as const,
                transition: "all 0.2s",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {tab === "analyze"
        ? <AnalyzeTab onNeedApiKey={() => setTab("settings")} />
        : <SettingsTab onKeySaved={() => { setHasKey(true); setTab("analyze"); }} />
      }
    </div>
  );
}
