"use client"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"

const STORAGE_KEY = "solace_chat_history"

const SUGGESTIONS = [
  { text: "My partner stopped talking to me 💔", color: "#e11d48" },
  { text: "I feel insecure in my relationship 😟", color: "#7c3aed" },
  { text: "I can't move on after my breakup 😢", color: "#db2777" },
  { text: "Do I have anxious attachment? 🤔", color: "#059669" },
]

function TinyCat() {
  return (
    <svg width="36" height="36" viewBox="0 0 100 100" fill="none" style={{ flexShrink: 0 }}>
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
      <ellipse cx="37" cy="50" rx="5" ry="3" fill="#f9a8d4" opacity="0.6"/>
      <ellipse cx="63" cy="50" rx="5" ry="3" fill="#f9a8d4" opacity="0.6"/>
      <ellipse cx="32" cy="80" rx="9" ry="6" fill="#fce7f3"/>
      <ellipse cx="68" cy="80" rx="9" ry="6" fill="#fce7f3"/>
      <path d="M78 70 Q95 55 85 40 Q80 33 74 40" stroke="#f9a8d4" strokeWidth="6" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

interface Message {
  id: string
  role: "user" | "ai"
  content: string
  sources?: string[]
  processingTime?: number
  timestamp: Date
}

interface HistoryMessage { role: "user" | "ai"; content: string }

async function sendMessage(query: string, history: HistoryMessage[]) {
  const res = await fetch("http://localhost:8000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, history }),
  })
  if (!res.ok) throw new Error("Server error")
  return res.json()
}

async function checkHealth() {
  try { const r = await fetch("http://localhost:8000/health"); return r.ok } catch { return false }
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
      <TinyCat />
      <div style={{ background: "white", border: "1.5px solid #fce7f3", borderRadius: "18px 18px 18px 4px", padding: "14px 18px", display: "flex", gap: 5, alignItems: "center", boxShadow: "0 2px 8px rgba(244,114,182,0.1)" }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#f9a8d4", animation: `dot-bounce 1.2s ease-in-out ${i*0.2}s infinite` }}/>
        ))}
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", gap: 10, alignItems: "flex-end" }}>
      {!isUser && <TinyCat />}
      <div style={{ maxWidth: "70%" }}>
        <div style={{
          padding: "13px 17px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isUser ? "linear-gradient(135deg,#f472b6,#e11d48)" : "white",
          color: isUser ? "white" : "#3b0764",
          fontSize: 15, lineHeight: 1.65,
          border: isUser ? "none" : "1.5px solid #fce7f3",
          boxShadow: isUser ? "0 4px 16px rgba(244,114,182,0.3)" : "0 2px 8px rgba(244,114,182,0.08)",
          fontFamily: "system-ui,sans-serif",
          whiteSpace: "pre-wrap",
        }}>
          {message.content}
        </div>
        {!isUser && message.sources && message.sources.length > 0 && (
          <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#a78bfa" }}>✦</span>
            {message.sources.map(s => (
              <span key={s} style={{ fontSize: 11, color: "#c4b5fd", background: "#faf5ff", border: "1px solid #e9d5ff", padding: "2px 8px", borderRadius: 999 }}>{s}</span>
            ))}
            {message.processingTime && <span style={{ fontSize: 11, color: "#d8b4fe" }}>{message.processingTime}ms</span>}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOnline, setIsOnline] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    checkHealth().then(setIsOnline)
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setMessages(parsed.map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) })))
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)) } catch {}
    }
  }, [messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const clearHistory = () => { setMessages([]); localStorage.removeItem(STORAGE_KEY) }

  const handleSend = async (query: string) => {
    if (!query.trim() || isLoading) return
    setInput("")
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: query, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)
    const history: HistoryMessage[] = messages.map(m => ({ role: m.role, content: m.content }))
    try {
      const data = await sendMessage(query, history)
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(), role: "ai", content: data.response,
        sources: data.sources, processingTime: data.processing_time_ms, timestamp: new Date()
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(), role: "ai",
        content: "⚠️ Can't reach the backend. Make sure it's running:\nuvicorn backend.main:app --reload --port 8000",
        timestamp: new Date()
      }])
    } finally { setIsLoading(false) }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "linear-gradient(160deg,#fff7ed 0%,#fdf2f8 50%,#f0fdf4 100%)", fontFamily: "system-ui,sans-serif" }}>

      {/* warm blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", width: 500, height: 500, top: "-15%", right: "-15%", borderRadius: "50%", background: "radial-gradient(circle,#fda4af44,#f9a8d422)", filter: "blur(80px)" }}/>
        <div style={{ position: "absolute", width: 400, height: 400, bottom: "-15%", left: "-15%", borderRadius: "50%", background: "radial-gradient(circle,#bbf7d033,#a7f3d022)", filter: "blur(80px)" }}/>
      </div>

      {/* header */}
      <header style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 64, background: "rgba(255,247,237,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(251,146,60,0.15)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/">
            <button style={{ background: "white", border: "1.5px solid #fce7f3", color: "#be185d", padding: "6px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>← Back</button>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CatMascot size={34}/>
            <div>
              <div style={{ color: "#be185d", fontWeight: 800, fontSize: 15 }}>Solace</div>
              <div style={{ color: "#d97706", fontSize: 11, fontWeight: 600 }}>Relationship Companion</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {messages.length > 0 && (
            <button onClick={clearHistory} style={{ background: "white", border: "1.5px solid #fce7f3", color: "#be185d", padding: "6px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>🗑 Clear</button>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 999, background: "white", border: "1.5px solid #fce7f3", fontSize: 12, fontWeight: 600 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: isOnline ? "#16a34a" : "#dc2626", boxShadow: isOnline ? "0 0 6px #16a34a" : "none" }}/>
            <span style={{ color: isOnline ? "#16a34a" : "#dc2626" }}>{isOnline ? "Online" : "Offline"}</span>
          </div>
        </div>
      </header>

      {/* messages */}
      <div style={{ position: "relative", zIndex: 1, flex: 1, overflowY: "auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
        {messages.length === 0 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 24 }}>
            <div style={{ animation: "float 3s ease-in-out infinite" }}>
              <CatMascot size={100}/>
            </div>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: "#1c1917", marginBottom: 8, letterSpacing: "-1px" }}>
                Hey! I&apos;m <span style={{ background: "linear-gradient(135deg,#e11d48,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Solace</span> 🌸
              </h1>
              <p style={{ color: "#78716c", fontSize: 15 }}>Your warm, judgment-free relationship companion</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 420 }}>
              {SUGGESTIONS.map(s => (
                <button key={s.text} onClick={() => handleSend(s.text)} style={{
                  textAlign: "left", padding: "14px 18px", borderRadius: 14,
                  background: "white", border: `1.5px solid ${s.color}22`,
                  borderLeft: `3px solid ${s.color}`,
                  color: "#44403c", fontSize: 14, cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  fontFamily: "system-ui,sans-serif",
                }}>
                  {s.text}
                </button>
              ))}
            </div>
            <p style={{ color: "#a8a29e", fontSize: 12 }}>Your conversation is saved locally 💾</p>
          </div>
        )}
        {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef}/>
      </div>

      {/* input bar */}
      <div style={{ position: "relative", zIndex: 10, padding: "16px 24px 20px", background: "rgba(255,247,237,0.85)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(251,146,60,0.15)", flexShrink: 0 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", gap: 10, alignItems: "flex-end" }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(input) } }}
            placeholder="Share what's on your mind... 🌸"
            rows={1}
            style={{
              flex: 1, background: "white", border: "1.5px solid #fce7f3", borderRadius: 16,
              padding: "13px 18px", color: "#1c1917", fontSize: 15, outline: "none",
              resize: "none", fontFamily: "system-ui,sans-serif", lineHeight: 1.5,
              boxShadow: "0 2px 8px rgba(244,114,182,0.08)",
            }}
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            style={{
              background: input.trim() && !isLoading ? "linear-gradient(135deg,#f472b6,#e11d48)" : "#fce7f3",
              color: input.trim() && !isLoading ? "white" : "#f9a8d4",
              border: "none", padding: "13px 20px", borderRadius: 14,
              fontWeight: 700, fontSize: 15, cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
              boxShadow: input.trim() && !isLoading ? "0 4px 16px rgba(244,114,182,0.4)" : "none",
              transition: "all 0.2s", flexShrink: 0,
            }}
          >
            Send ✦
          </button>
        </div>
        <p style={{ textAlign: "center", color: "#d1c5bd", fontSize: 11, marginTop: 10, margin: "10px 0 0" }}>
          🌸 For crisis support, call or text 988
        </p>
      </div>

      <style>{`
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes dot-bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
      `}</style>
    </div>
  )
}