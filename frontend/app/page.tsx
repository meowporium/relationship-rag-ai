"use client"
import Link from "next/link"

function CatMascot({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="65" rx="28" ry="24" fill="#f9a8d4" opacity="0.9"/>
      <circle cx="50" cy="42" r="22" fill="#fce7f3"/>
      <polygon points="30,26 22,10 38,20" fill="#f9a8d4"/>
      <polygon points="70,26 78,10 62,20" fill="#f9a8d4"/>
      <polygon points="30,24 25,14 36,21" fill="#fbcfe8"/>
      <polygon points="70,24 75,14 64,21" fill="#fbcfe8"/>
      <ellipse cx="42" cy="40" rx="5" ry="6" fill="#4c1d95"/>
      <ellipse cx="58" cy="40" rx="5" ry="6" fill="#4c1d95"/>
      <circle cx="44" cy="38" r="1.5" fill="white"/>
      <circle cx="60" cy="38" r="1.5" fill="white"/>
      <ellipse cx="50" cy="47" rx="2.5" ry="2" fill="#f472b6"/>
      <path d="M46 50 Q50 54 54 50" stroke="#be185d" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <line x1="28" y1="46" x2="43" y2="48" stroke="#d946ef" strokeWidth="1" opacity="0.5"/>
      <line x1="28" y1="50" x2="43" y2="50" stroke="#d946ef" strokeWidth="1" opacity="0.5"/>
      <line x1="57" y1="48" x2="72" y2="46" stroke="#d946ef" strokeWidth="1" opacity="0.5"/>
      <line x1="57" y1="50" x2="72" y2="50" stroke="#d946ef" strokeWidth="1" opacity="0.5"/>
      <ellipse cx="37" cy="50" rx="5" ry="3" fill="#f9a8d4" opacity="0.6"/>
      <ellipse cx="63" cy="50" rx="5" ry="3" fill="#f9a8d4" opacity="0.6"/>
      <ellipse cx="32" cy="80" rx="9" ry="6" fill="#fce7f3"/>
      <ellipse cx="68" cy="80" rx="9" ry="6" fill="#fce7f3"/>
      <path d="M78 70 Q95 55 85 40 Q80 33 74 40" stroke="#f9a8d4" strokeWidth="6" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

function TinyCat() {
  return (
    <svg width="36" height="36" viewBox="0 0 100 100" fill="none" style={{flexShrink:0}}>
      <circle cx="50" cy="50" r="45" fill="#f472b6" opacity="0.9"/>
      <circle cx="50" cy="46" r="18" fill="#fce7f3"/>
      <polygon points="34,32 28,18 40,28" fill="#f9a8d4"/>
      <polygon points="66,32 72,18 60,28" fill="#f9a8d4"/>
      <ellipse cx="44" cy="44" rx="4" ry="5" fill="#4c1d95"/>
      <ellipse cx="56" cy="44" rx="4" ry="5" fill="#4c1d95"/>
      <circle cx="45.5" cy="42.5" r="1.2" fill="white"/>
      <circle cx="57.5" cy="42.5" r="1.2" fill="white"/>
      <ellipse cx="50" cy="50" rx="2" ry="1.5" fill="#f472b6"/>
      <ellipse cx="39" cy="53" rx="4" ry="2.5" fill="#fce7f3" opacity="0.7"/>
      <ellipse cx="61" cy="53" rx="4" ry="2.5" fill="#fce7f3" opacity="0.7"/>
    </svg>
  )
}

const MOODS = [
  { emoji: "😊", label: "Happy",    color: "#16a34a" },
  { emoji: "😐", label: "Okay",     color: "#2563eb" },
  { emoji: "😟", label: "Stressed", color: "#d97706" },
  { emoji: "😔", label: "Down",     color: "#7c3aed" },
  { emoji: "😰", label: "Anxious",  color: "#dc2626" },
]

const FEATURES = [
  { emoji: "🫂", color: "#e11d48", bg: "#fff1f2", title: "Emotional Support",   desc: "A compassionate listener, always here. Share freely without fear of judgment." },
  { emoji: "🧠", color: "#7c3aed", bg: "#f5f3ff", title: "Psychology-Backed",   desc: "Grounded in real relationship science and evidence-based wellness practices." },
  { emoji: "🔒", color: "#059669", bg: "#ecfdf5", title: "100% Private",        desc: "Runs locally on your machine. Your conversations never leave your device." },
  { emoji: "🌸", color: "#db2777", bg: "#fdf2f8", title: "Judgment-Free Space", desc: "Express yourself freely. This is your safe, cozy space to just be you." },
]

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#fff7ed 0%,#fdf2f8 40%,#f0fdf4 100%)", fontFamily: "Georgia, 'Times New Roman', serif" }}>

      {/* warm blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", width: 600, height: 600, top: "-15%", right: "-15%", borderRadius: "50%", background: "radial-gradient(circle,#fda4af55,#f9a8d433)", filter: "blur(80px)" }}/>
        <div style={{ position: "absolute", width: 500, height: 500, bottom: "-15%", left: "-15%", borderRadius: "50%", background: "radial-gradient(circle,#bbf7d044,#a7f3d033)", filter: "blur(80px)" }}/>
        <div style={{ position: "absolute", width: 400, height: 400, top: "40%", left: "30%", borderRadius: "50%", background: "radial-gradient(circle,#ddd6fe33,#c4b5fd22)", filter: "blur(80px)" }}/>
      </div>

      {/* navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,247,237,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(251,146,60,0.15)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <CatMascot size={38}/>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#be185d", letterSpacing: "-0.5px" }}>Solace</span>
          </div>
          {/* Nav links — icon only on small, text+icon on wide */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href="/quiz">
              <button style={{ background: "white", color: "#7c3aed", border: "1.5px solid #ddd6fe", padding: "8px 16px", borderRadius: 999, fontWeight: 600, fontSize: 13, cursor: "pointer", boxShadow: "0 1px 4px rgba(124,58,237,0.08)" }}>
                Quiz 🧠
              </button>
            </Link>
            <Link href="/journal">
              <button style={{ background: "white", color: "#db2777", border: "1.5px solid #fbcfe8", padding: "8px 16px", borderRadius: 999, fontWeight: 600, fontSize: 13, cursor: "pointer", boxShadow: "0 1px 4px rgba(219,39,119,0.08)" }}>
                Journal 📓
              </button>
            </Link>
            <Link href="/chat">
              <button style={{ background: "linear-gradient(135deg,#f472b6,#e11d48)", color: "white", border: "none", padding: "10px 22px", borderRadius: 999, fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 16px rgba(244,114,182,0.4)" }}>
                Chat now 💬
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* hero */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 999, background: "white", border: "1.5px solid #fbcfe8", color: "#be185d", fontSize: 13, fontWeight: 600, marginBottom: 32, boxShadow: "0 2px 8px rgba(244,114,182,0.15)" }}>
            🌸 Your cozy relationship companion
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <div style={{ animation: "float 3s ease-in-out infinite" }}>
              <CatMascot size={130}/>
            </div>
          </div>

          <h1 style={{ fontSize: "clamp(38px,6vw,64px)", fontWeight: 900, color: "#1c1917", lineHeight: 1.15, marginBottom: 20, letterSpacing: "-2px" }}>
            You don&apos;t have to{" "}
            <span style={{ background: "linear-gradient(135deg,#e11d48,#f472b6,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              figure it out alone
            </span>
          </h1>

          <p style={{ fontSize: 18, color: "#57534e", marginBottom: 40, maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.75, fontFamily: "system-ui,sans-serif" }}>
            Solace is a warm, honest AI companion for relationship support. Psychology-grounded, judgment-free, and 100% private.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 60 }}>
            <Link href="/chat">
              <button style={{ background: "linear-gradient(135deg,#f472b6,#e11d48)", color: "white", border: "none", padding: "16px 36px", borderRadius: 18, fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 8px 28px rgba(244,114,182,0.4)", fontFamily: "system-ui,sans-serif" }}>
                Start Talking 💬
              </button>
            </Link>
            <Link href="/quiz">
              <button style={{ background: "white", color: "#7c3aed", border: "1.5px solid #ddd6fe", padding: "16px 36px", borderRadius: 18, fontWeight: 700, fontSize: 16, cursor: "pointer", boxShadow: "0 4px 16px rgba(124,58,237,0.1)", fontFamily: "system-ui,sans-serif" }}>
                Take the Quiz 🧠
              </button>
            </Link>
          </div>

          {/* chat preview */}
          <div style={{ maxWidth: 540, margin: "0 auto", borderRadius: 24, padding: 24, background: "white", border: "1.5px solid #fce7f3", boxShadow: "0 20px 60px rgba(244,114,182,0.12)", textAlign: "left" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
              {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }}/>)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ background: "linear-gradient(135deg,#f472b6,#e11d48)", color: "white", padding: "12px 16px", borderRadius: "18px 18px 4px 18px", fontSize: 14, maxWidth: 260, fontFamily: "system-ui,sans-serif" }}>
                  I feel like my partner doesn&apos;t listen to me 😔
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <TinyCat/>
                <div style={{ background: "#fdf2f8", border: "1px solid #fce7f3", color: "#4a1942", padding: "12px 16px", borderRadius: "18px 18px 18px 4px", fontSize: 14, maxWidth: 280, fontFamily: "system-ui,sans-serif" }}>
                  That sounds really painful 🌸 Feeling unheard creates real loneliness.
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ background: "linear-gradient(135deg,#f472b6,#e11d48)", color: "white", padding: "12px 16px", borderRadius: "18px 18px 4px 18px", fontSize: 14, maxWidth: 260, fontFamily: "system-ui,sans-serif" }}>
                  Where do I even start?
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <TinyCat/>
                <div style={{ background: "#fdf2f8", border: "1px solid #fce7f3", color: "#4a1942", padding: "12px 16px", borderRadius: "18px 18px 18px 4px", fontSize: 14, maxWidth: 280, fontFamily: "system-ui,sans-serif" }}>
                  Right here. No judgment, ever ✨
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <input readOnly placeholder="Message Solace..." style={{ flex: 1, background: "#fdf2f8", border: "1px solid #fce7f3", borderRadius: 12, padding: "10px 16px", color: "#4a1942", fontSize: 14, outline: "none", fontFamily: "system-ui,sans-serif" }}/>
              <Link href="/chat">
                <button style={{ background: "linear-gradient(135deg,#f472b6,#e11d48)", color: "white", border: "none", padding: "10px 18px", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Send 💌</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* features */}
      <section id="features" style={{ position: "relative", zIndex: 1, padding: "60px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: "#1c1917", marginBottom: 10, letterSpacing: "-0.5px" }}>Why Solace? 💫</h2>
            <p style={{ color: "#78716c", fontSize: 16, fontFamily: "system-ui,sans-serif" }}>Built with love for your emotional wellbeing</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: f.bg, border: `1.5px solid ${f.color}22`, borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{f.emoji}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1c1917", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: "#78716c", fontSize: 14, lineHeight: 1.65, fontFamily: "system-ui,sans-serif", margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* mood */}
      <section style={{ position: "relative", zIndex: 1, padding: "60px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", background: "white", border: "1.5px solid #fce7f3", borderRadius: 28, padding: "48px 32px", textAlign: "center", boxShadow: "0 4px 24px rgba(244,114,182,0.1)" }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🌈</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#1c1917", marginBottom: 8, letterSpacing: "-0.5px" }}>How are you feeling right now?</h2>
          <p style={{ color: "#78716c", marginBottom: 32, fontSize: 15, fontFamily: "system-ui,sans-serif" }}>Tap a mood — Solace will meet you exactly where you are</p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
            {MOODS.map(m => (
              <Link href="/chat" key={m.label}>
                <button style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "16px 20px", borderRadius: 16, background: "#fdf2f8", border: "1.5px solid #fce7f3", cursor: "pointer", boxShadow: "0 2px 8px rgba(244,114,182,0.08)" }}>
                  <span style={{ fontSize: 32 }}>{m.emoji}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: m.color, fontFamily: "system-ui,sans-serif" }}>{m.label}</span>
                </button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* cta */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <CatMascot size={90}/>
          </div>
          <h2 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 900, color: "#1c1917", margin: "0 0 14px", letterSpacing: "-1px" }}>You deserve support 💜</h2>
          <p style={{ color: "#78716c", fontSize: 17, marginBottom: 32, fontFamily: "system-ui,sans-serif", lineHeight: 1.65 }}>Solace is here for you, any time, any feeling.</p>
          <Link href="/chat">
            <button style={{ background: "linear-gradient(135deg,#f472b6,#e11d48)", color: "white", border: "none", padding: "18px 44px", borderRadius: 20, fontWeight: 800, fontSize: 18, cursor: "pointer", boxShadow: "0 10px 36px rgba(244,114,182,0.4)", fontFamily: "system-ui,sans-serif" }}>
              Start Your Journey ✨
            </button>
          </Link>
        </div>
      </section>

      {/* footer */}
      <footer style={{ position: "relative", zIndex: 1, padding: "28px 24px", borderTop: "1px solid #fce7f3", background: "rgba(255,247,237,0.6)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CatMascot size={28}/>
            <span style={{ color: "#be185d", fontWeight: 800, fontSize: 15 }}>Solace</span>
          </div>
          <p style={{ color: "#a8a29e", fontSize: 13, fontFamily: "system-ui,sans-serif", margin: 0 }}>Made with 💜 · Crisis support: call or text 988</p>
        </div>
      </footer>

      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`}</style>
    </div>
  )
}