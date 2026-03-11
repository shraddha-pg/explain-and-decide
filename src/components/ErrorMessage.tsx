import { theme } from "../theme";

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div style={{
      padding: "10px 14px",
      background: theme.dangerBg,
      border: `1px solid ${theme.dangerBorder}`,
      borderRadius: 8,
    }}>
      <p style={{ fontSize: 12, color: theme.danger, lineHeight: 1.6 }}>{message}</p>
    </div>
  );
}
