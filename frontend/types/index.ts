export interface Message {
  id: string
  role: "user" | "ai"
  content: string
  sources?: string[]
  processingTime?: number
  timestamp: Date
}

export interface ChatResponse {
  response: string
  sources: string[]
  processing_time_ms: number
}
