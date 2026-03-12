import { C, primaryBtn, ghostBtn } from "./types";

interface Props {
  apiKey: string;
  savedKey: string;
  saveMsg: string;
  apiError: string;
  onKeyChange: (k: string) => void;
  onSave: () => void;
  onRemove: () => void;
}

export default function SettingsTab({ apiKey, savedKey, saveMsg, apiError, onKeyChange, onSave, onRemove }: Props) {
  const isSaved = apiKey === savedKey && !!savedKey;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, animation: "edIn 0.25s ease" }}>

      {apiError && (
        <div style={{ padding: "10px 13px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 9 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", marginBottom: 2 }}>⚠️ API Key Issue</p>
          <p style={{ fontSize: 11, color: "#ef4444", lineHeight: 1.6, opacity: 0.85 }}>{apiError}</p>
        </div>
      )}

      {!savedKey && (
        <div style={{ padding: "10px 13px", background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 9 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: C.accentDark, marginBottom: 2 }}>👋 One-time setup</p>
          <p style={{ fontSize: 11, color: "rgba(30,20,5,0.5)", lineHeight: 1.6 }}>Free Groq API key needed — takes 2 min.</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Groq API Key</p>
        <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
          Free at <span style={{ color: C.accent, fontWeight: 600 }}>console.groq.com</span> → API Keys
        </p>
        <input
          type="password" value={apiKey} onChange={e => onKeyChange(e.target.value)} placeholder="gsk_..."
          style={{ width: "100%", padding: "9px 11px", background: "rgba(0,0,0,0.04)", border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 12, fontFamily: "monospace", outline: "none" }}
        />
        {!apiError && (
          <button onClick={onSave} disabled={!apiKey.trim()} style={{
            ...primaryBtn,
            background: !apiKey.trim() ? "rgba(0,0,0,0.05)" : isSaved ? "rgba(16,185,129,0.12)" : `linear-gradient(135deg,${C.accent},${C.accentDark})`,
            border: isSaved ? "1px solid rgba(16,185,129,0.3)" : "none",
            color: !apiKey.trim() ? C.faint : isSaved ? "#10b981" : "#000",
            cursor: !apiKey.trim() ? "not-allowed" : "pointer",
          }}>
            {saveMsg ? `✓ ${saveMsg}` : isSaved ? "✓ Saved" : "Save API Key"}
          </button>
        )}
        {savedKey && (
          <button onClick={onRemove} style={{ ...ghostBtn, border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
            🗑 Remove key
          </button>
        )}
      </div>

      <div style={{ padding: "11px 13px", background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 9 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: C.accentDark, marginBottom: 8 }}>
          {savedKey ? "How to use" : "Setup steps"}
        </p>
        {(!savedKey
          ? ["Go to console.groq.com", "Sign up (free)", "API Keys → Create API Key", "Copy & paste above", "Hit Save"]
          : ["Right-click any page → Explain & Decide", "Extension icon → sidebar opens", "Paste text → Explain & Decide"]
        ).map((tip, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
            <span style={{ minWidth: 16, height: 16, background: C.accent, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "#000", flexShrink: 0, marginTop: 1 }}>
              {!savedKey ? i + 1 : "·"}
            </span>
            <p style={{ fontSize: 11, color: "rgba(30,20,5,0.5)", lineHeight: 1.6 }}>{tip}</p>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 10, color: C.faint, textAlign: "center" }}>Explain & Decide · v1.0.0</p>
    </div>
  );
}
