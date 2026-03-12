import { useState } from "react";
import { AnalysisResult } from "../types";
import { View, C, primaryBtn, ghostBtn, disabledBtn } from "./types";
import ResultView from "./ResultView";

interface Props {
  onAnalyze: (text: string) => void;
  onExplainPage: () => void;
  onReset: () => void;
  view: View;
  result: AnalysisResult | null;
  errorMsg: string;
}

export default function AnalyzeTab({ onAnalyze, onExplainPage, onReset, view, result, errorMsg }: Props) {
  const [inputText, setInputText] = useState("");
  const [copied, setCopied] = useState(false);

  const reset = () => { setInputText(""); onReset(); };

  const copyResult = () => {
    if (!result) return;
    const text = [
      `What it says:\n${result.summary}`,
      `What it wants:\n${result.wants}`,
      result.flags && result.flags !== "null" ? `Watch out:\n${result.flags}` : null,
      `What to do:\n${result.action}`,
    ].filter(Boolean).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, animation: "edIn 0.25s ease" }}>

      {view === "idle" && (<>
        <button onClick={onExplainPage} style={primaryBtn}>📄 Explain this page</button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ fontSize: 10, color: C.faint, letterSpacing: 2 }}>OR PASTE TEXT</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>
        <textarea
          value={inputText} onChange={e => setInputText(e.target.value)}
          placeholder="Paste any confusing text — email, contract, notice..."
          style={{ width: "100%", height: 120, padding: "10px 12px", background: "rgba(0,0,0,0.04)", border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 13, lineHeight: 1.7, resize: "none", outline: "none" }}
        />
        <button onClick={() => onAnalyze(inputText)} style={inputText.trim().length >= 20 ? primaryBtn : disabledBtn} disabled={inputText.trim().length < 20}>
          ⚡ Explain & Decide
        </button>
      </>)}

      {view === "loading" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "50px 0", gap: 14 }}>
          <div style={{ width: 28, height: 28, border: "2px solid rgba(245,158,11,0.2)", borderTopColor: C.accent, borderRadius: "50%", animation: "edSpin 0.8s linear infinite" }} />
          <p style={{ fontSize: 11, color: C.muted, letterSpacing: 1 }}>Reading carefully...</p>
        </div>
      )}

      {view === "error" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ padding: "11px 13px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10 }}>
            <p style={{ fontSize: 13, color: "#ef4444", lineHeight: 1.6 }}>{errorMsg}</p>
          </div>
          <button onClick={reset} style={ghostBtn}>← Try again</button>
        </div>
      )}

      {view === "result" && result && (
        <ResultView
          result={result}
          copied={copied}
          onCopy={copyResult}
          onNew={() => { reset(); }}
          onRefresh={onExplainPage}
        />
      )}
    </div>
  );
}
