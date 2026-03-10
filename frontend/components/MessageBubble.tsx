import { Message } from "@/types"

function CatAvatar() {
  return (
    <svg width="34" height="34" viewBox="0 0 100 100" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="50" cy="50" r="45" fill="#7c3aed" opacity="0.85"/>
      <circle cx="50" cy="46" r="18" fill="#d8b4fe"/>
      <polygon points="34,32 28,18 40,28" fill="#c084fc"/>
      <polygon points="66,32 72,18 60,28" fill="#c084fc"/>
      <ellipse cx="44" cy="44" rx="4" ry="5" fill="#1e1b4b"/>
      <ellipse cx="56" cy="44" rx="4" ry="5" fill="#1e1b4b"/>
      <circle cx="45.5" cy="42.5" r="1.2" fill="white"/>
      <circle cx="57.5" cy="42.5" r="1.2" fill="white"/>
      <ellipse cx="50" cy="50" rx="2" ry="1.5" fill="#f9a8d4"/>
      <ellipse cx="39" cy="53" rx="4" ry="2.5" fill="#f9a8d4" opacity="0.5"/>
      <ellipse cx="61" cy="53" rx="4" ry="2.5" fill="#f9a8d4" opacity="0.5"/>
    </svg>
  )
}

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexDirection: isUser ? "row-reverse" : "row" }}>

      {/* Avatar */}
      {isUser ? (
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#c44dff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, boxShadow: "0 4px 15px rgba(196,77,255,0.3)" }}>
          🧑
        </div>
      ) : (
        <CatAvatar/>
      )}

      {/* Bubble */}
      <div style={{ display: "flex", flexDirection: "column", maxWidth: "min(520px, 75vw)", alignItems: isUser ? "flex-end" : "flex-start" }}>
        <div style={isUser ? {
          background: "linear-gradient(135deg,#7c3aed,#c44dff)",
          color: "white",
          padding: "12px 18px",
          borderRadius: "18px 18px 4px 18px",
          fontSize: 14,
          lineHeight: 1.65,
          boxShadow: "0 4px 20px rgba(124,58,237,0.3)",
        } : {
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "rgba(255,255,255,0.92)",
          padding: "12px 18px",
          borderRadius: "18px 18px 18px 4px",
          fontSize: 14,
          lineHeight: 1.65,
          backdropFilter: "blur(10px)",
        }}>
          {message.content.split("\n").map((line, i) => (
            <p key={i} style={{ margin: i > 0 ? "8px 0 0" : 0 }}>{line}</p>
          ))}
        </div>

        {message.sources && message.sources.length > 0 && (
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 6, paddingLeft: 4 }}>
            ✨ <span style={{ color: "#c44dff" }}>{message.sources.join(", ")}</span>
          </p>
        )}
        {message.processingTime && (
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", paddingLeft: 4 }}>{message.processingTime}ms</p>
        )}
      </div>
    </div>
  )
}