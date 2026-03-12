// Shared types for sidebar components
export type Tab = "analyze" | "settings";
export type View = "idle" | "loading" | "result" | "error";

export const C = {
  bg: "#faf8f4", text: "#1a1208", accent: "#f59e0b", accentDark: "#d97706",
  muted: "rgba(30,20,5,0.4)", faint: "rgba(30,20,5,0.25)", border: "rgba(0,0,0,0.09)",
};

export const primaryBtn: React.CSSProperties = {
  padding: "10px 0", borderRadius: 8, width: "100%", border: "none",
  background: `linear-gradient(135deg,${C.accent},${C.accentDark})`,
  color: "#000", fontSize: 13, fontWeight: 700, cursor: "pointer",
};
export const ghostBtn: React.CSSProperties = {
  ...primaryBtn, background: "rgba(0,0,0,0.04)", border: `1px solid ${C.border}`, color: C.muted,
};
export const disabledBtn: React.CSSProperties = {
  ...primaryBtn, background: "rgba(245,158,11,0.15)", color: "rgba(30,20,5,0.3)", cursor: "not-allowed",
};
