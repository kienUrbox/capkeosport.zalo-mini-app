export type ScreenProps = Record<string, never>

// Match Status Types
export type MatchStatus =
  | 'MATCHED' // Đã match, chưa cáp
  | 'PENDING' // Đã gửi lời mời, chờ phản hồi
  | 'CAPPING' // Đang capping (trao đổi)
  | 'CONFIRMING' // Đang xác nhận kèo
  | 'CONFIRMED' // Đã chốt kèo
  | 'UPCOMING' // Sắp diễn ra
  | 'FINISHED' // Đã kết thúc

// Match Card Variants
export type MatchCardVariant =
  | 'matched' // Tab "Đã Match"
  | 'capping' // Tab "Đang Cáp Kèo"
  | 'confirmed' // Tab "Đã Chốt Kèo"
  | 'upcoming' // Tab "Lịch Sắp Tới" - sắp diễn ra
  | 'finished' // Tab "Lịch Sắp Tới" - đã kết thúc

// Team Types
export type Team = {
  id: string
  name: string
  logo: string
  level: string
  gender: 'Nam' | 'Nữ' | 'Mixed'
  stats?: {
    attack: number
    defense: number
    technique: number
  }
  location?: string
  pitch?: string[]
  members?: number
}

// Match Suggestion Types
export type MatchSuggestion = {
  suggestedBy: 'teamA' | 'teamB' // Team nào đã gợi ý
  date?: string
  time?: string
  location?: string
  notes?: string
  createdAt: string
}

// Match Types
export type Match = {
  id: string
  status: MatchStatus
  teamA: Team
  teamB: Team
  date?: string
  time?: string
  location?: string
  score?: {
    teamA: number
    teamB: number
  }
  countdown?: {
    days: number
    hours: number
    minutes: number
    seconds: number
  }
  createdAt: string
  updatedAt: string
  notes?: string
  gallery?: string[]
  // Nếu true, nghĩa là đối thủ (teamB) đã gửi kèo đến user (teamA)
  // Nếu false hoặc undefined, nghĩa là user có thể gửi lời mời
  isReceived?: boolean
  // Gợi ý kèo từ một trong 2 đội
  suggestion?: MatchSuggestion
  // Zalo chat link để 2 đội trao đổi
  zaloChatLink?: string
}

// Countdown Data
export type CountdownData = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

