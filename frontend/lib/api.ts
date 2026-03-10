const API_URL = "http://localhost:8000"

export interface HistoryMessage {
  role: "user" | "ai"
  content: string
}

export interface ChatResponse {
  response: string
  sources: string[]
  processing_time_ms: number
}

export async function sendMessage(
  query: string,
  history: HistoryMessage[] = []
): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, history }),
  })
  if (!response.ok) throw new Error(`Server error: ${response.status}`)
  return response.json()
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`)
    return response.ok
  } catch {
    return false
  }
}