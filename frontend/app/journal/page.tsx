"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

const MOODS = [
  { emoji: "😊", label: "Happy",    color: "#16a34a", bg: "#f0fdf4" },
  { emoji: "😐", label: "Okay",     color: "#2563eb", bg: "#eff6ff" },
  { emoji: "😟", label: "Stressed", color: "#d97706", bg: "#fffbeb" },
  { emoji: "😔", label: "Down",     color: "#7c3aed", bg: "#faf5ff" },
  { emoji: "😰", label: "Anxious",  color: "#dc2626", bg: "#fef2f2" },
  { emoji: "😡", label: "Angry",    color: "#b91c1c", bg: "#fff1f2" },
  { emoji: "🥰", label: "Loved",    color: "#db2777", bg: "#fdf2f8" },
  { emoji: "😴", label: "Tired",    color: "#6d28d9", bg: "#f5f3ff" },
]

const PROMPTS = [
  "What's been weighing on your mind today?",
  "How did your relationship make you feel this week?",
  "What do you wish you could say but haven't?",
  "What are you grateful for right now?",
  "What pattern do you keep noticing in yourself?",
  "What does your ideal relationship look like?",
  "What's something you need to forgive yourself for?",
  "What would you tell your past self about love?",
  "What emotion have you been avoiding lately?",
  "What does feeling loved actually look like to you?",
]

interface JournalEntry {
  id: string
  date: string
  mood: typeof MOODS[0] | null
  text: string
  prompt: string
}

const STORAGE_KEY = "solace_journal"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [mood, setMood] = useState<typeof MOODS[0] | null>(null)
  const [text, setText] = useState("")
  const [prompt] = useState(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)])
  const [saved, setSaved] = useState(false)
  const [view, setView] = useState<"write" | "history">("write")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setEntries(JSON.parse(raw))
    } catch {}
  }, [])

  const save = () => {
    if (!text.trim()) return
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      mood, text: text.trim(), prompt,
    }
    const updated = [entry, ...entries]
    setEntries(updated)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
    setText(""); setMood(null); setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#fff7ed 0%,#fdf2f8 40%,#f0fdf4 100%)", fontFamily: "system-ui,sans-serif" }}>

      {/* blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", width: 500, height: 500, top: "-15%", right: "-15%", borderRadius: "50%", background: "radial-gradient(circle,#fda4af44,#f9a8d422)", filter: "blur(80px)" }}/>
        <div style={{ position: "absolute", width: 400, height: 400, bottom: "-15%", left: "-15%", borderRadius: "50%", background: "radial-gradient(circle,#bbf7d033,#a7f3d022)", filter: "blur(80px)" }}/>
      </div>

      {/* header */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,247,237,0.88)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(251,146,60,0.15)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/">
              <button style={{ background: "white", border: "1.5px solid #fce7f3", color: "#be185d", padding: "6px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>← Home</button>
            </Link>
            <div>
              <div style={{ color: "#be185d", fontWeight: 800, fontSize: 16 }}>📓 My Journal</div>
              <div style={{ color: "#a16207", fontSize: 11, fontWeight: 600 }}>{entries.length} {entries.length === 1 ? "entry" : "entries"} · private & local</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4, background: "white", padding: 4, borderRadius: 10, border: "1.5px solid #fce7f3" }}>
            {(["write", "history"] as const).map(tab => (
              <button key={tab} onClick={() => setView(tab)} style={{
                padding: "6px 14px", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "none",
                background: view === tab ? "linear-gradient(135deg,#f472b6,#e11d48)" : "transparent",
                color: view === tab ? "white" : "#a8a29e",
              }}>
                {tab === "write" ? "✏️ Write" : "📚 History"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto", padding: "40px 24px" }}>

        {/* ── WRITE ── */}
        {view === "write" && (
          <div>
            {/* Prompt card */}
            <div style={{ background: "white", border: "1.5px solid #fce7f3", borderRadius: 18, padding: "20px 24px", marginBottom: 28, display: "flex", alignItems: "center", gap: 16, boxShadow: "0 4px 16px rgba(244,114,182,0.08)" }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>💭</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#db2777", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Today&apos;s prompt</div>
                <div style={{ color: "#44403c", fontSize: 15, fontStyle: "italic", lineHeight: 1.5 }}>{prompt}</div>
              </div>
            </div>

            {/* Mood picker */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#a8a29e", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>How are you feeling?</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {MOODS.map(m => (
                  <button key={m.label} onClick={() => setMood(mood?.label === m.label ? null : m)} style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 999,
                    background: mood?.label === m.label ? m.bg : "white",
                    border: mood?.label === m.label ? `1.5px solid ${m.color}` : "1.5px solid #fce7f3",
                    cursor: "pointer", transition: "all 0.15s",
                    boxShadow: mood?.label === m.label ? `0 2px 8px ${m.color}22` : "none",
                  }}>
                    <span style={{ fontSize: 18 }}>{m.emoji}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: mood?.label === m.label ? m.color : "#a8a29e" }}>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div style={{ marginBottom: 20 }}>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Write freely — this is just for you. No one else will see this..."
                rows={10}
                style={{
                  width: "100%", background: "white", border: "1.5px solid #fce7f3",
                  borderRadius: 18, padding: "20px 22px", color: "#1c1917", fontSize: 15,
                  lineHeight: 1.75, resize: "none", outline: "none", fontFamily: "Georgia, serif",
                  boxSizing: "border-box", boxShadow: "0 2px 12px rgba(244,114,182,0.06)",
                }}
              />
              <div style={{ textAlign: "right", fontSize: 12, color: "#d1c5bd", marginTop: 6 }}>{text.length} characters</div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <button onClick={save} disabled={!text.trim()} style={{
                padding: "13px 30px", borderRadius: 14, border: "none", fontWeight: 700, fontSize: 15,
                cursor: text.trim() ? "pointer" : "not-allowed",
                background: text.trim() ? "linear-gradient(135deg,#f472b6,#e11d48)" : "#fce7f3",
                color: text.trim() ? "white" : "#f9a8d4",
                boxShadow: text.trim() ? "0 6px 20px rgba(244,114,182,0.35)" : "none",
                transition: "all 0.2s", fontFamily: "system-ui,sans-serif",
              }}>
                {saved ? "✅ Saved!" : "Save Entry 💾"}
              </button>
              {text.trim() && (
                <Link href="/chat">
                  <button style={{ padding: "13px 22px", borderRadius: 14, border: "1.5px solid #fce7f3", background: "white", color: "#be185d", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "system-ui,sans-serif" }}>
                    Talk to Solace 🐱
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* ── HISTORY ── */}
        {view === "history" && (
          <div>
            {entries.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 24px" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>📓</div>
                <h2 style={{ color: "#1c1917", fontWeight: 800, fontSize: 24, marginBottom: 8 }}>No entries yet</h2>
                <p style={{ color: "#78716c", fontSize: 15 }}>Start writing to see your entries here</p>
                <button onClick={() => setView("write")} style={{ marginTop: 24, padding: "12px 28px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#f472b6,#e11d48)", color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                  Write your first entry ✏️
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {entries.map(entry => {
                  const isExpanded = expandedId === entry.id
                  return (
                    <div key={entry.id}
                      onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                      style={{ background: "white", border: "1.5px solid #fce7f3", borderRadius: 18, padding: 22, cursor: "pointer", boxShadow: "0 2px 8px rgba(244,114,182,0.06)", transition: "all 0.2s" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          {entry.mood && <span style={{ fontSize: 26 }}>{entry.mood.emoji}</span>}
                          <div>
                            <div style={{ color: "#1c1917", fontWeight: 700, fontSize: 14 }}>{formatDate(entry.date)}</div>
                            {entry.mood && <div style={{ fontSize: 12, fontWeight: 700, color: entry.mood.color }}>{entry.mood.label}</div>}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ color: "#d1c5bd", fontSize: 12 }}>{entry.text.length} chars</span>
                          <span style={{ color: "#d1c5bd", fontSize: 14 }}>{isExpanded ? "▲" : "▼"}</span>
                        </div>
                      </div>

                      {!isExpanded && (
                        <p style={{ color: "#78716c", fontSize: 14, margin: "10px 0 0", lineHeight: 1.55, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                          {entry.text}
                        </p>
                      )}

                      {isExpanded && (
                        <div onClick={e => e.stopPropagation()} style={{ marginTop: 16 }}>
                          <div style={{ fontSize: 12, color: "#db2777", fontStyle: "italic", marginBottom: 10, opacity: 0.7 }}>Prompt: {entry.prompt}</div>
                          <p style={{ color: "#44403c", fontSize: 15, lineHeight: 1.75, margin: "0 0 16px", whiteSpace: "pre-wrap", fontFamily: "Georgia, serif" }}>{entry.text}</p>
                          <div style={{ display: "flex", gap: 10 }}>
                            <Link href="/chat">
                              <button style={{ padding: "8px 16px", borderRadius: 10, border: "1.5px solid #fce7f3", background: "white", color: "#be185d", fontSize: 13, cursor: "pointer", fontWeight: 700 }}>Talk to Solace 🐱</button>
                            </Link>
                            <button onClick={() => deleteEntry(entry.id)} style={{ padding: "8px 16px", borderRadius: 10, border: "1.5px solid #fecdd3", background: "#fff1f2", color: "#be123c", fontSize: 13, cursor: "pointer", fontWeight: 700 }}>Delete 🗑</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}