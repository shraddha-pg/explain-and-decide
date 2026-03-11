import { useState, useEffect } from "react";
import { theme } from "../theme";

interface SettingsTabProps {
  onKeySaved?: () => void;
}
export default function SettingsTab({ onKeySaved }: SettingsTabProps) {
  const [apiKey, setApiKey] = useState("");
  const [savedKey, setSavedKey] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    chrome.storage.sync.get("groqApiKey", (res) => {
      if (res.groqApiKey) { setSavedKey(res.groqApiKey); setApiKey(res.groqApiKey); }
    });
  }, []);

  const saveKey = () => {
    chrome.storage.sync.set({ groqApiKey: apiKey }, () => {
      setSavedKey(apiKey);
      setSaveMsg("Saved!");
      setTimeout(() => setSaveMsg(""), 2000);
      onKeySaved?.();
    });
  };

  const isSaved = apiKey === savedKey && !!savedKey;

  return (
    
    <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      {!savedKey && (
        <div style={{
          padding: "14px 16px",
          background: "rgba(245,158,11,0.1)",
          border: "1px solid rgba(245,158,11,0.3)",
          borderRadius: 10,
          marginBottom: 4,
        }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#d97706", marginBottom: 6, fontFamily: theme.fontSans }}>
            👋 Welcome! One-time setup
          </p>
          <p style={{ fontSize: 11, color: "rgba(30,20,5,0.6)", lineHeight: 1.7, fontFamily: theme.fontSans }}>
            Explain & Decide needs a free Groq API key to work. Takes 2 minutes — follow the steps below.
          </p>
        </div>
      )}
      {/* API Key section */}
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 6, fontFamily: theme.fontSans }}>
          Groq API Key
        </p>
        <p style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.7, marginBottom: 12, fontFamily: theme.fontSans }}>
          Free at{" "}
          <span style={{ color: theme.accent, fontWeight: 600 }}>console.groq.com</span>
          {" "}→ API Keys → Create key → paste below.
        </p>
        <input
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="gsk_..."
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "rgba(0,0,0,0.06)",
            border: `1px solid ${theme.border}`,
            borderRadius: 8,
            color: theme.text,
            fontSize: 12,
            fontFamily: theme.fontMono,
            marginBottom: 10,
            outline: "none",
          }}
        />
        <button onClick={saveKey}
          disabled={!apiKey.trim()}
          style={{
            width: "100%", padding: "10px 0", borderRadius: 8,
            background: !apiKey.trim()
              ? "rgba(0,0,0,0.06)"
              : isSaved
                ? theme.successBg
                : `linear-gradient(135deg, ${theme.accent}, ${theme.accentDark})`,
            border: isSaved ? `1px solid ${theme.successBorder}` : "none",
            color: !apiKey.trim()
              ? theme.textFaint
              : isSaved ? theme.success : "#000",
            fontSize: 13, fontWeight: 700,
            cursor: !apiKey.trim() ? "not-allowed" : "pointer",
            fontFamily: theme.fontSans, transition: "all 0.2s",
          }}>
          {saveMsg ? `✓ ${saveMsg}` : isSaved ? "✓ Key saved" : "Save API Key"}
        </button>
      </div>

      {/* How to use */}
      <div style={{
        padding: "14px 16px",
        background: theme.accentBg,
        border: `1px solid rgba(245,158,11,0.2)`,
        borderRadius: 10,
      }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: theme.accentDark, marginBottom: 10, fontFamily: theme.fontSans }}>
          {savedKey ? "How to use" : "How to get your free API key"}
        </p>
        {!savedKey ? [
          "Go to console.groq.com",
          "Sign up for a free account",
          "Click 'API Keys' in the left sidebar",
          "Click 'Create API Key' → copy it",
          "Paste it above and hit Save",
        ].map((tip, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
            <span style={{
              minWidth: 20, height: 20,
              background: theme.accent,
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700, color: "#000",
              flexShrink: 0, marginTop: 1,
            }}>
              {i + 1}
            </span>
            <p style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.65, fontFamily: theme.fontSans }}>{tip}</p>
          </div>
        )) : [
          "Right-click any page → Explain & Decide this page",
          "Click extension icon → paste any text directly",
          "Click ⚡ Open on page → sidebar slides in",
        ].map((tip, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7 }}>
            <span style={{ color: theme.accent, fontSize: 10, fontFamily: theme.fontMono, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>◆</span>
            <p style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.65, fontFamily: theme.fontSans }}>{tip}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop: "auto", textAlign: "center" }}>
        <p style={{ fontSize: 10, color: theme.textFaint, fontFamily: theme.fontMono }}>
          Explain & Decide · v1.0.0 · Built by Shraddha
        </p>
      </div>
    </div>
  );
}
