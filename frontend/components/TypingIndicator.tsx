export default function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
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

      <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "18px 18px 18px 4px", padding: "14px 20px", display: "flex", alignItems: "center", gap: 10, backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 200, 400].map(delay => (
            <span key={delay} style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "linear-gradient(135deg,#ff6b9d,#c44dff)",
              display: "inline-block",
              animation: "bounce 1.2s infinite",
              animationDelay: `${delay}ms`,
              boxShadow: "0 0 8px rgba(255,107,157,0.5)",
            }}/>
          ))}
        </div>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Solace is thinking...</span>
      </div>

      <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-8px)}}`}</style>
    </div>
  )
}