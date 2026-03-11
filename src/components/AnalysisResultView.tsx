import { useState } from "react";
import ResultCard from "./ResultCard";
import { theme, CATEGORY_ICONS, COMPLEXITY_COLOR } from "../theme";
import { AnalysisResult } from "../types";

interface AnalysisResultViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function AnalysisResultView({ result, onReset }: AnalysisResultViewProps) {
  const [copied, setCopied] = useState(false);

  const copyResult = () => {
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
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

      {/* Meta row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
        <span style={{
          fontSize: 10,
          color: theme.textMuted,
          fontFamily: theme.fontMono,
          background: theme.bgCard,
          border: `1px solid ${theme.border}`,
          padding: "3px 8px",
          borderRadius: 10,
        }}>
          {CATEGORY_ICONS[result.category] ?? "📄"} {result.category}
        </span>
        <span style={{
          fontSize: 10,
          fontFamily: theme.fontMono,
          color: COMPLEXITY_COLOR[result.complexity] ?? theme.text,
          fontWeight: 600,
        }}>
          ● {result.complexity}
        </span>
      </div>

      <ResultCard
        label="🔍 What is this saying?"
        text={result.summary}
        animDelay={0}
      />
      <ResultCard
        label="⚡ What does it want?"
        text={result.wants}
        animDelay={0.07}
      />
      {result.flags && result.flags !== "null"
        ? <ResultCard label="🚩 Watch out" text={result.flags} variant="warning" animDelay={0.14} />
        : <ResultCard label="✅ No red flags" text="Nothing suspicious detected." variant="safe" animDelay={0.14} />
      }
      <ResultCard
        label="👉 What should you do?"
        text={result.action}
        variant="action"
        animDelay={0.21}
      />

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
        <button onClick={copyResult} style={{
          flex: 1,
          padding: "9px 0",
          borderRadius: 8,
          background: theme.bgCard,
          border: `1px solid ${theme.border}`,
          color: theme.textMuted,
          fontSize: 12,
          cursor: "pointer",
          fontFamily: theme.fontSans,
          transition: "all 0.2s",
        }}>
          {copied ? "Copied! ✓" : "Copy summary"}
        </button>
        <button onClick={onReset} style={{
          padding: "9px 14px",
          borderRadius: 8,
          background: "transparent",
          border: `1px solid ${theme.border}`,
          color: theme.textFaint,
          fontSize: 12,
          cursor: "pointer",
          fontFamily: theme.fontSans,
        }}>
          ↩ New
        </button>
      </div>
    </div>
  );
}
