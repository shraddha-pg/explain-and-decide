import { AnalysisResult } from "../types";
import { CATEGORY_ICONS, COMPLEXITY_COLOR } from "../theme";
import { C, primaryBtn, ghostBtn } from "./types";

interface Props {
  result: AnalysisResult;
  copied: boolean;
  onCopy: () => void;
  onNew: () => void;
  onRefresh: () => void;
}

export default function ResultView({ result, copied, onCopy, onNew, onRefresh }: Props) {
  const cards = [
    { label: "What is this saying?", text: result.summary, border: C.border, bg: "rgba(0,0,0,0.03)" },
    { label: "What does it want?", text: result.wants, border: C.border, bg: "rgba(0,0,0,0.03)" },
    result.flags && result.flags !== "null"
      ? { label: "⚠ Watch out", text: result.flags, border: "rgba(239,68,68,0.25)", bg: "rgba(239,68,68,0.05)" }
      : { label: "✓ No red flags", text: "Nothing suspicious detected.", border: "rgba(16,185,129,0.25)", bg: "rgba(16,185,129,0.05)" },
    { label: "What should you do?", text: result.action, border: "rgba(245,158,11,0.3)", bg: "rgba(245,158,11,0.06)" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9, animation: "edIn 0.3s ease" }}>
      {/* Meta */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10, color: C.muted, background: "rgba(0,0,0,0.05)", border: `1px solid ${C.border}`, padding: "3px 8px", borderRadius: 10 }}>
          {CATEGORY_ICONS[result.category] ?? "📄"} {result.category}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: COMPLEXITY_COLOR[result.complexity] ?? C.text }}>● {result.complexity}</span>
        </div>
      </div>

      {/* Cards */}
      {cards.map((c, i) => (
        <div key={i} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: "11px 13px" }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 5 }}>{c.label}</p>
          <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>{c.text}</p>
        </div>
      ))}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
        <button onClick={onCopy} style={{ ...ghostBtn, flex: 1, width: "auto" }}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
        <button onClick={onNew} style={{ ...primaryBtn, width: "auto", padding: "10px 20px" }}>
          ⚡ New
        </button>
      </div>
    </div>
  );
}
