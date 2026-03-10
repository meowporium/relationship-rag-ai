"use client"
import { useState } from "react"
import Link from "next/link"

const QUESTIONS = [
  {
    id: 0,
    text: "When your partner doesn't text back for a few hours, you usually...",
    options: [
      { text: "Assume they're busy and carry on with your day", style: "secure" },
      { text: "Feel anxious and check your phone repeatedly", style: "anxious" },
      { text: "Feel relieved — you needed the space anyway", style: "avoidant" },
      { text: "Panic but pretend to be fine on the outside", style: "fearful" },
    ]
  },
  {
    id: 1,
    text: "When someone gets emotionally close to you, you feel...",
    options: [
      { text: "Happy — closeness is what you want", style: "secure" },
      { text: "Excited but terrified they'll eventually leave", style: "anxious" },
      { text: "Suffocated and need to pull back", style: "avoidant" },
      { text: "Both desperate for it and scared of it simultaneously", style: "fearful" },
    ]
  },
  {
    id: 2,
    text: "After a fight with your partner, you...",
    options: [
      { text: "Talk it through calmly and work toward resolution", style: "secure" },
      { text: "Worry obsessively until they confirm you're okay", style: "anxious" },
      { text: "Go quiet and need several days of space", style: "avoidant" },
      { text: "Want to fix it but emotionally shut down instead", style: "fearful" },
    ]
  },
  {
    id: 3,
    text: "How do you feel about depending on a partner emotionally?",
    options: [
      { text: "Natural — mutual reliance is healthy", style: "secure" },
      { text: "I want to but fear they'll eventually let me down", style: "anxious" },
      { text: "Uncomfortable — I'd rather handle everything myself", style: "avoidant" },
      { text: "I want support but feel I don't deserve it", style: "fearful" },
    ]
  },
  {
    id: 4,
    text: "When you're stressed, you tend to...",
    options: [
      { text: "Reach out to your partner or close friends naturally", style: "secure" },
      { text: "Need constant reassurance that everything will be okay", style: "anxious" },
      { text: "Withdraw completely and deal with it alone", style: "avoidant" },
      { text: "Want help but push people away when they offer it", style: "fearful" },
    ]
  },
  {
    id: 5,
    text: "If your partner says they need space for a few days, you...",
    options: [
      { text: "Respect it and use the time for yourself", style: "secure" },
      { text: "Spiral — convinced you did something wrong", style: "anxious" },
      { text: "Feel secretly relieved", style: "avoidant" },
      { text: "Panic internally but act like you're totally fine", style: "fearful" },
    ]
  },
  {
    id: 6,
    text: "In past relationships, you've mostly felt...",
    options: [
      { text: "Secure, valued, and at ease", style: "secure" },
      { text: "Like you needed more reassurance than you ever got", style: "anxious" },
      { text: "Like things got too intense and you needed an exit", style: "avoidant" },
      { text: "Confused — wanting love but feeling unworthy of it", style: "fearful" },
    ]
  },
  {
    id: 7,
    text: "How easy is it to express your emotional needs?",
    options: [
      { text: "Easy — I know what I need and I say it clearly", style: "secure" },
      { text: "Hard — I worry constantly it'll push people away", style: "anxious" },
      { text: "Hard — I'd rather pretend I have no needs at all", style: "avoidant" },
      { text: "I try, but then feel ashamed or embarrassed for asking", style: "fearful" },
    ]
  },
  {
    id: 8,
    text: "When someone you love is upset with you, you feel...",
    options: [
      { text: "Concerned but able to address it without panicking", style: "secure" },
      { text: "Terrified — you'll do anything to fix it immediately", style: "anxious" },
      { text: "Defensive and want to create distance from them", style: "avoidant" },
      { text: "Overwhelmed with shame and want to disappear", style: "fearful" },
    ]
  },
  {
    id: 9,
    text: "When a relationship ends, you usually...",
    options: [
      { text: "Grieve properly, learn from it, and move forward", style: "secure" },
      { text: "Struggle to let go even when it was clearly over", style: "anxious" },
      { text: "Move on quickly — detachment comes naturally to you", style: "avoidant" },
      { text: "Feel devastated but believe somewhere that you deserved it", style: "fearful" },
    ]
  },
  {
    id: 10,
    text: "When your relationship is going really well, you tend to...",
    options: [
      { text: "Enjoy it fully and feel grateful", style: "secure" },
      { text: "Wait anxiously for things to go wrong", style: "anxious" },
      { text: "Find reasons to create distance or pick fights", style: "avoidant" },
      { text: "Feel undeserving and wonder when they'll realize their mistake", style: "fearful" },
    ]
  },
  {
    id: 11,
    text: "Your partner cancels plans last minute. You feel...",
    options: [
      { text: "Disappointed but understanding — things come up", style: "secure" },
      { text: "Convinced they're losing interest in you", style: "anxious" },
      { text: "Honestly a little relieved — you needed the time alone", style: "avoidant" },
      { text: "Hurt but you tell them it's totally fine", style: "fearful" },
    ]
  },
]

type Style = "secure" | "anxious" | "avoidant" | "fearful"

const RESULTS: Record<Style, {
  title: string; emoji: string; color: string; bg: string; border: string; tagline: string;
  desc: string; traits: string[]; growth: string[];
  nextSteps: { icon: string; title: string; desc: string }[];
  chat: string;
}> = {
  secure: {
    title: "Secure Attachment",
    emoji: "🌿",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    tagline: "Comfortable with closeness and independence",
    desc: "You feel confident in relationships — you can be vulnerable without losing yourself, give your partner space without spiraling, and communicate your needs clearly. You handle conflict without catastrophizing and trust that relationships can survive difficulty. This typically develops from consistent, reliable caregiving early in life.",
    traits: [
      "Communicates needs directly and without guilt",
      "Comfortable with both intimacy and independence",
      "Handles conflict without panic or shutdown",
      "Trusts partners without needing constant reassurance",
      "Can be vulnerable without fearing rejection",
    ],
    growth: [
      "Stay curious — security can quietly become complacency",
      "Be patient with partners who have insecure styles; they're not broken",
      "Check in with yourself occasionally — even secure people have blind spots",
    ],
    nextSteps: [
      { icon: "💬", title: "Talk to Solace", desc: "Explore what secure attachment looks like in your specific relationship" },
      { icon: "📖", title: "Read: Attached by Amir Levine", desc: "Foundational book on attachment theory — validates and deepens your understanding" },
      { icon: "🧘", title: "Be a secure base", desc: "If your partner has an insecure style, learn how to hold space for them" },
      { icon: "📓", title: "Journal your patterns", desc: "Write about moments you feel reactive — secure doesn't mean perfect" },
    ],
    chat: "I got Secure Attachment on the Solace quiz. What does this mean for how I show up in my relationship?"
  },
  anxious: {
    title: "Anxious Attachment",
    emoji: "🌊",
    color: "#db2777",
    bg: "#fdf2f8",
    border: "#fbcfe8",
    tagline: "Craving closeness but fearing it slipping away",
    desc: "You want deep connection but often feel unsure whether you're loved enough. Small things — an unanswered text, a quiet evening — can trigger a spiral of doubt. You may seek reassurance frequently, and the absence of it feels unbearable. This usually develops when early caregiving was inconsistent — love was present but unpredictable.",
    traits: [
      "Hyper-aware of even small shifts in your partner's mood",
      "Seeks frequent reassurance and feels uneasy without it",
      "Fears abandonment even in stable relationships",
      "Tends to overthink, over-apologize, and over-explain",
      "Can come across as clingy, though the need underneath is real",
    ],
    growth: [
      "Notice when you're seeking reassurance vs. actually needing it",
      "Build a life and identity that exists independently of the relationship",
      "Practice sitting with uncertainty — not every silence means something is wrong",
    ],
    nextSteps: [
      { icon: "💬", title: "Talk to Solace", desc: "Explore your anxiety patterns in a safe, judgment-free conversation" },
      { icon: "📖", title: "Read: Attached by Amir Levine", desc: "Specifically written for anxious attachers — deeply validating and practical" },
      { icon: "🧠", title: "Consider therapy", desc: "CBT and attachment-based therapy are very effective for anxious attachment" },
      { icon: "📓", title: "Start a feelings journal", desc: "Track when anxiety spikes — patterns become visible and less powerful over time" },
    ],
    chat: "I got Anxious Attachment on the Solace quiz. How does this affect my relationships and what can I do about it?"
  },
  avoidant: {
    title: "Avoidant Attachment",
    emoji: "🏔️",
    color: "#7c3aed",
    bg: "#faf5ff",
    border: "#ddd6fe",
    tagline: "Valuing independence but struggling with real intimacy",
    desc: "You tend to pull back when relationships get emotionally intense. You've built strong self-reliance — sometimes to the point where you dismiss your own emotional needs entirely. Closeness can feel threatening without you fully understanding why. This usually develops when emotional needs were met with indifference early on, so you learned that needing others wasn't safe.",
    traits: [
      "Withdraws emotionally when things get too close or intense",
      "Highly self-reliant, often to a fault",
      "Downplays emotional needs — sometimes even to yourself",
      "Feels suffocated by too much intimacy or emotional demand",
      "May unconsciously self-sabotage when relationships get serious",
    ],
    growth: [
      "Try to sit with discomfort instead of immediately retreating",
      "Practice naming one feeling per day, even just to yourself",
      "Recognize that needing others is not weakness — it's human",
    ],
    nextSteps: [
      { icon: "💬", title: "Talk to Solace", desc: "Explore what triggers your withdrawal and what intimacy actually feels like" },
      { icon: "📖", title: "Read: Avoidant by Diane Poole Heller", desc: "Goes deep into the avoidant experience with compassionate exercises" },
      { icon: "🧠", title: "Try somatic therapy", desc: "Avoidant attachment often lives in the body — somatic approaches can help" },
      { icon: "🫂", title: "Practice micro-vulnerability", desc: "Share one small honest feeling per day with someone you trust — start tiny" },
    ],
    chat: "I got Avoidant Attachment on the Solace quiz. How does this show up in my relationships and how do I work on it?"
  },
  fearful: {
    title: "Fearful-Avoidant",
    emoji: "🌪️",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    tagline: "Wanting love deeply but being terrified of it",
    desc: "You experience a painful push-pull: you crave closeness but fear being hurt. You may oscillate between clinging and withdrawing, leaving both you and your partners confused. Deep down, there's often a belief that you're not quite worthy of stable love. This style often develops when early caregivers were both a source of comfort and fear.",
    traits: [
      "Oscillates between intense closeness and sudden withdrawal",
      "Struggles with self-worth — questions whether you deserve love",
      "High emotional intensity that's difficult to regulate",
      "Often feels confused by your own contradictory feelings",
      "May repeat painful relationship patterns without understanding why",
    ],
    growth: [
      "Therapy is genuinely very helpful here — this style deserves real support",
      "Learn to identify when you're in 'pull toward' vs 'push away' mode",
      "You're not broken — this was a survival response that can be unlearned",
    ],
    nextSteps: [
      { icon: "💬", title: "Talk to Solace", desc: "Explore the push-pull cycle in a safe space with no judgment" },
      { icon: "🧠", title: "Seek trauma-informed therapy", desc: "EMDR or trauma-focused therapy can be life-changing for this pattern" },
      { icon: "📖", title: "Read: The Body Keeps the Score", desc: "Explains why fearful attachment often lives deep in the nervous system" },
      { icon: "🌱", title: "Work on self-worth first", desc: "The relationship with yourself is the foundation — start there" },
    ],
    chat: "I got Fearful-Avoidant Attachment on the Solace quiz. Can you help me understand this and what I can do about it?"
  }
}

function CatMascot({ size = 40 }: { size?: number }) {
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

export default function QuizPage() {
  const [current, setCurrent] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [scores, setScores] = useState<Record<Style, number>>({ secure: 0, anxious: 0, avoidant: 0, fearful: 0 })
  const [result, setResult] = useState<Style | null>(null)
  const [animating, setAnimating] = useState(false)

  const q = QUESTIONS[current]
  const progress = (current / QUESTIONS.length) * 100

  const handleNext = () => {
    if (selectedIndex === null) return
    const chosenStyle = q.options[selectedIndex].style as Style
    const newScores = { ...scores, [chosenStyle]: scores[chosenStyle] + 1 }
    setScores(newScores)
    setAnimating(true)
    if (current === QUESTIONS.length - 1) {
      const winner = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0] as Style
      setTimeout(() => { setResult(winner); setAnimating(false) }, 350)
    } else {
      setTimeout(() => { setCurrent(c => c + 1); setSelectedIndex(null); setAnimating(false) }, 300)
    }
  }

  const restart = () => {
    setCurrent(0); setSelectedIndex(null)
    setScores({ secure: 0, anxious: 0, avoidant: 0, fearful: 0 })
    setResult(null); setAnimating(false)
  }

  const bg = "linear-gradient(160deg,#fff7ed 0%,#fdf2f8 40%,#f0fdf4 100%)"

  // ── Result screen ──
  if (result) {
    const r = RESULTS[result]
    return (
      <div style={{ minHeight: "100vh", background: bg, fontFamily: "system-ui,sans-serif", padding: "40px 24px" }}>
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", width: 500, height: 500, top: "-15%", right: "-15%", borderRadius: "50%", background: `radial-gradient(circle,${r.border}88,transparent)`, filter: "blur(80px)" }}/>
          <div style={{ position: "absolute", width: 400, height: 400, bottom: "-15%", left: "-15%", borderRadius: "50%", background: "radial-gradient(circle,#bbf7d033,transparent)", filter: "blur(80px)" }}/>
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto" }}>
          <Link href="/">
            <button style={{ background: "white", border: "1.5px solid #fce7f3", color: "#be185d", padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 600, marginBottom: 36, display: "inline-block" }}>← Home</button>
          </Link>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 64, marginBottom: 8 }}>{r.emoji}</div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: r.color, marginBottom: 10 }}>Your attachment style</div>
            <h1 style={{ fontSize: "clamp(32px,6vw,52px)", fontWeight: 900, margin: "0 0 8px", letterSpacing: "-1.5px", color: r.color }}>
              {r.title}
            </h1>
            <p style={{ color: "#78716c", fontSize: 15, fontStyle: "italic", margin: 0 }}>{r.tagline}</p>
          </div>

          {/* Description */}
          <div style={{ background: r.bg, border: `1.5px solid ${r.border}`, borderRadius: 20, padding: 24, marginBottom: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <p style={{ color: "#44403c", fontSize: 15, lineHeight: 1.8, margin: 0 }}>{r.desc}</p>
          </div>

          {/* Traits */}
          <div style={{ background: "white", border: "1.5px solid #fce7f3", borderRadius: 20, padding: 22, marginBottom: 14, boxShadow: "0 2px 8px rgba(244,114,182,0.06)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: r.color, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>How this shows up in you</div>
            {r.traits.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < r.traits.length - 1 ? 10 : 0 }}>
                <span style={{ color: r.color, flexShrink: 0, fontSize: 14, fontWeight: 700 }}>✦</span>
                <span style={{ color: "#57534e", fontSize: 14, lineHeight: 1.65 }}>{t}</span>
              </div>
            ))}
          </div>

          {/* Growth */}
          <div style={{ background: "white", border: "1.5px solid #fce7f3", borderRadius: 20, padding: 22, marginBottom: 14, boxShadow: "0 2px 8px rgba(244,114,182,0.06)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: r.color, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>What to work on</div>
            {r.growth.map((g, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < r.growth.length - 1 ? 10 : 0 }}>
                <span style={{ color: r.color, flexShrink: 0, fontWeight: 700 }}>→</span>
                <span style={{ color: "#57534e", fontSize: 14, lineHeight: 1.65 }}>{g}</span>
              </div>
            ))}
          </div>

          {/* Next Steps */}
          <div style={{ background: "white", border: "1.5px solid #fce7f3", borderRadius: 20, padding: 22, marginBottom: 28, boxShadow: "0 2px 8px rgba(244,114,182,0.06)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: r.color, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>What to do next</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {r.nextSteps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 16px", borderRadius: 14, background: r.bg, border: `1px solid ${r.border}` }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{step.icon}</span>
                  <div>
                    <div style={{ color: "#1c1917", fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{step.title}</div>
                    <div style={{ color: "#78716c", fontSize: 13, lineHeight: 1.5 }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/chat">
              <button style={{ background: `linear-gradient(135deg,#f472b6,#e11d48)`, color: "white", border: "none", padding: "14px 28px", borderRadius: 14, fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(244,114,182,0.35)" }}>
                Talk to Solace 🐱
              </button>
            </Link>
            <button onClick={restart} style={{ background: "white", border: "1.5px solid #fce7f3", color: "#be185d", padding: "14px 28px", borderRadius: 14, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Quiz screen ──
  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "system-ui,sans-serif", padding: "40px 24px" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: 500, height: 500, top: "-10%", right: "-10%", borderRadius: "50%", background: "radial-gradient(circle,#fda4af44,#f9a8d422)", filter: "blur(70px)" }}/>
        <div style={{ position: "absolute", width: 400, height: 400, bottom: "-10%", left: "-10%", borderRadius: "50%", background: "radial-gradient(circle,#bbf7d033,transparent)", filter: "blur(70px)" }}/>
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 620, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <Link href="/">
            <button style={{ background: "white", border: "1.5px solid #fce7f3", color: "#be185d", padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>← Home</button>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CatMascot size={30}/>
            <span style={{ color: "#be185d", fontWeight: 800, fontSize: 15 }}>Solace</span>
          </div>
          <div style={{ fontSize: 13, color: "#a8a29e", fontWeight: 600 }}>{current + 1} / {QUESTIONS.length}</div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 6, background: "#fce7f3", borderRadius: 999, marginBottom: 40, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#f472b6,#e11d48)", borderRadius: 999, transition: "width 0.4s ease" }}/>
        </div>

        {/* Question */}
        <div style={{ opacity: animating ? 0 : 1, transform: animating ? "translateY(8px)" : "translateY(0)", transition: "opacity 0.25s ease, transform 0.25s ease" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#db2777", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>Question {current + 1} of {QUESTIONS.length}</div>
            <h2 style={{ fontSize: "clamp(18px,3vw,24px)", fontWeight: 800, color: "#1c1917", lineHeight: 1.45, margin: 0 }}>{q.text}</h2>
          </div>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
            {q.options.map((opt, i) => {
              const isSelected = selectedIndex === i
              return (
                <button
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  style={{
                    textAlign: "left", padding: "16px 20px", borderRadius: 14,
                    border: isSelected ? "1.5px solid #f472b6" : "1.5px solid #fce7f3",
                    background: isSelected ? "#fdf2f8" : "white",
                    color: isSelected ? "#be185d" : "#44403c",
                    fontSize: 15, cursor: "pointer", transition: "all 0.15s",
                    fontFamily: "system-ui,sans-serif", lineHeight: 1.5,
                    display: "flex", alignItems: "center", gap: 14,
                    boxShadow: isSelected ? "0 2px 12px rgba(244,114,182,0.2)" : "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                    border: isSelected ? "2px solid #f472b6" : "2px solid #fce7f3",
                    background: isSelected ? "#f472b6" : "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s",
                  }}>
                    {isSelected && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "white" }}/>}
                  </div>
                  {opt.text}
                </button>
              )
            })}
          </div>

          {/* Next button */}
          <button
            onClick={handleNext}
            disabled={selectedIndex === null}
            style={{
              width: "100%", padding: "16px", borderRadius: 14, border: "none",
              background: selectedIndex !== null ? "linear-gradient(135deg,#f472b6,#e11d48)" : "#fce7f3",
              color: selectedIndex !== null ? "white" : "#f9a8d4",
              fontSize: 16, fontWeight: 700, fontFamily: "system-ui,sans-serif",
              cursor: selectedIndex !== null ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              boxShadow: selectedIndex !== null ? "0 6px 20px rgba(244,114,182,0.35)" : "none",
            }}
          >
            {current === QUESTIONS.length - 1 ? "See My Result ✨" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  )
}