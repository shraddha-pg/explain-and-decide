import { useState } from "react";
import { theme } from "../theme";
import { AnalysisResult } from "../types";
import AnalysisResultView from "./AnalysisResultView";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";

function callGroq(text: string): Promise<AnalysisResult> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "CALL_GROQ", text: text.slice(0, 4000) }, (response) => {
      if (response?.error === "NO_API_KEY") reject(new Error("NO_API_KEY"));
      else if (response?.error) reject(new Error("FETCH_ERROR"));
      else resolve(response.result);
    });
  });
}

interface AnalyzeTabProps {
  onNeedApiKey: () => void;
}

export default function AnalyzeTab({ onNeedApiKey }: AnalyzeTabProps) {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const analyze = async (text: string) => {
    if (!text.trim() || text.trim().length < 20) {
      setError("Please enter at least a sentence to analyze.");
      return;
    }
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const data = await callGroq(text);
      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "NO_API_KEY") {
        setError("Add your Groq API key in Settings first.");
        onNeedApiKey();
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const analyzeCurrentPage = () => {
    // Route through background — background stays alive after popup closes
    chrome.runtime.sendMessage({ type: "FORWARD_TO_TAB", forward: "EXPLAIN_PAGE" });
    window.close();
  };

  const openSidebarOnPage = () => {
    chrome.runtime.sendMessage({ type: "FORWARD_TO_TAB", forward: "TOGGLE_SIDEBAR" });
    window.close();
  };

  const reset = () => {
    setResult(null);
    setError("");
    setInputText("");
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 16, gap: 12, overflowY: "auto" }}>

      {/* Quick action buttons */}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={openSidebarOnPage} style={{
          flex: 1, padding: "9px 0", borderRadius: 8,
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDark})`,
          border: "none", color: "#000", fontSize: 12, fontWeight: 700,
          cursor: "pointer", fontFamily: theme.fontSans,
          transition: "opacity 0.2s",
        }}>
          ⚡ Open on page
        </button>
        <button onClick={analyzeCurrentPage} style={{
          flex: 1, padding: "9px 0", borderRadius: 8,
          background: theme.bgCard,
          border: `1px solid ${theme.border}`,
          color: theme.textMuted, fontSize: 12, fontWeight: 500,
          cursor: "pointer", fontFamily: theme.fontSans,
          transition: "all 0.2s",
        }}>
          📄 Explain this page
        </button>
      </div>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, height: 1, background: theme.border }} />
        <span style={{ fontSize: 10, color: theme.textFaint, fontFamily: theme.fontMono, letterSpacing: 2 }}>
          OR PASTE TEXT
        </span>
        <div style={{ flex: 1, height: 1, background: theme.border }} />
      </div>

      {/* Text input — only show if no result */}
      {!result && (
        <>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Paste any confusing text here — email, contract, article, notice, terms..."
            style={{
              width: "100%",
              height: 110,
              padding: "11px 13px",
              background: "rgba(0,0,0,0.06)",
              border: `1px solid ${theme.border}`,
              borderRadius: 10,
              color: theme.text,
              fontSize: 12,
              fontFamily: theme.fontSans,
              lineHeight: 1.7,
              resize: "none",
              outline: "none",
            }}
          />

          <button
            onClick={() => analyze(inputText)}
            disabled={loading || !inputText.trim()}
            style={{
              padding: "11px 0",
              borderRadius: 8,
              width: "100%",
              background: loading || !inputText.trim()
                ? "rgba(245,158,11,0.2)"
                : `linear-gradient(135deg, ${theme.accent}, ${theme.accentDark})`,
              border: "none",
              color: loading || !inputText.trim() ? theme.textFaint : "#000",
              fontSize: 13,
              fontWeight: 700,
              cursor: loading || !inputText.trim() ? "not-allowed" : "pointer",
              fontFamily: theme.fontSans,
              transition: "all 0.2s",
            }}
          >
            {loading ? "Analyzing..." : "⚡ Explain & Decide"}
          </button>
        </>
      )}

      {/* States */}
      {error && <ErrorMessage message={error} />}
      {loading && <Loading />}
      {result && <AnalysisResultView result={result} onReset={reset} />}
    </div>
  );
}
