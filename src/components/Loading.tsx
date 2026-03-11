import { theme } from "../theme";

interface LoadingProps {
  text?: string;
}

export default function Loading({ text = "Reading carefully..." }: LoadingProps) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      padding: "32px 0",
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div style={{
        width: 28,
        height: 28,
        border: `2px solid rgba(245,158,11,0.15)`,
        borderTopColor: theme.accent,
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <p style={{
        fontSize: 12,
        color: theme.textMuted,
        fontFamily: theme.fontMono,
        letterSpacing: 1,
      }}>
        {text}
      </p>
    </div>
  );
}
