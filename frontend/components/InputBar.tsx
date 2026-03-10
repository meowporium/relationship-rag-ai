"use client"
import { useState, useRef, KeyboardEvent } from "react"

interface InputBarProps {
  onSend: (message: string) => void
  disabled: boolean
}

export default function InputBar({ onSend, disabled }: InputBarProps) {
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (!value.trim() || disabled) return
    onSend(value.trim())
    setValue("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"
  }

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 140) + "px"
  }

  const canSend = value.trim().length > 0 && !disabled

  return (
    <div style={{ position: "relative", zIndex: 10, flexShrink: 0, padding: "14px 24px 20px", background: "rgba(15,5,40,0.75)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", background: "rgba(255,255,255,0.06)", border: `1px solid ${canSend ? "rgba(196,77,255,0.4)" : "rgba(255,255,255,0.1)"}`, borderRadius: 20, padding: "12px 14px", transition: "border-color 0.2s", boxShadow: canSend ? "0 0 20px rgba(196,77,255,0.1)" : "none" }}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKey}
            onInput={handleInput}
            placeholder="Share what's on your mind... 💭"
            rows={1}
            disabled={disabled}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "rgba(255,255,255,0.9)", fontSize: 14, lineHeight: 1.6, resize: "none", fontFamily: "inherit", opacity: disabled ? 0.5 : 1 }}
          />
          <button
            onClick={handleSend}
            disabled={!canSend}
            style={{
              width: 38, height: 38, borderRadius: 12, border: "none", cursor: canSend ? "pointer" : "not-allowed",
              background: canSend ? "linear-gradient(135deg,#ff6b9d,#c44dff)" : "rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              boxShadow: canSend ? "0 4px 20px rgba(196,77,255,0.5)" : "none",
              transform: canSend ? "scale(1.05)" : "scale(1)", transition: "all 0.2s",
              opacity: canSend ? 1 : 0.4,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 8 }}>
          🌸 For crisis support, call or text <span style={{ color: "rgba(255,255,255,0.35)" }}>988</span>
        </p>
      </div>
    </div>
  )
}