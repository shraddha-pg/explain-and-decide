import { theme } from "../theme";

type Variant = "default" | "warning" | "safe" | "action";

const variantStyles: Record<Variant, { background: string; border: string; labelColor: string }> = {
  default: {
    background: theme.bgCard,
    border: `1px solid ${theme.border}`,
    labelColor: theme.textFaint,
  },
  warning: {
    background: theme.dangerBg,
    border: `1px solid ${theme.dangerBorder}`,
    labelColor: theme.danger,
  },
  safe: {
    background: theme.successBg,
    border: `1px solid ${theme.successBorder}`,
    labelColor: theme.success,
  },
  action: {
    background: theme.accentBg,
    border: `1px solid rgba(245,158,11,0.35)`,
    labelColor: theme.accentDark,
  },
};

interface ResultCardProps {
  label: string;
  text: string;
  variant?: Variant;
  animDelay?: number;
}

export default function ResultCard({ label, text, variant = "default", animDelay = 0 }: ResultCardProps) {
  const s = variantStyles[variant];

  return (
    <div style={{
      background: s.background,
      border: s.border,
      borderRadius: 12,
      padding: "13px 15px",
      animation: `fadeUp 0.4s ease ${animDelay}s both`,
    }}>
      <p style={{
        fontSize: 10,
        fontWeight: 700,
        color: s.labelColor,
        letterSpacing: 1.5,
        textTransform: "uppercase",
        marginBottom: 8,
        fontFamily: theme.fontMono,
      }}>
        {label}
      </p>
      <p style={{
        fontSize: 13,
        color: theme.text,
        lineHeight: 1.75,
        fontFamily: theme.fontSans,
      }}>
        {text}
      </p>
    </div>
  );
}
