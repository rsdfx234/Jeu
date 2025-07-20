export interface User {
  id: string
  firstName: string
  whatsapp: string
  currentLevel: number
  score: number
  isFinalist: boolean
  isWinner: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Riddle {
  id: string
  riddleNumber: number
  title: string
  text: string
  freeHint1: string
  freeHint2: string
  bonusHint: string
  megaHint: string
  correctAnswer: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserProgress {
  id: string
  userId: string
  riddleId: string
  attempts: number
  isCompleted: boolean
  answers?: string
  unlockedHints?: string
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface PaymentRequest {
  id: string
  userId: string
  amount: number
  paymentType: 'bonus_hint' | 'mega_hint' | 'answer'
  riddleNumber: number
  paymentMethod: 'orange_money' | 'wave'
  transactionRef?: string
  status: 'pending' | 'approved' | 'rejected'
  screenshotUrl?: string
  approvedBy?: string
  approvedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface AppSettings {
  id: string
  prizeAmount: number
  gameIsActive: boolean
  registrationOpen: boolean
  winnersCount: number
  totalRiddles: number
  paymentPhone: string
  createdAt: Date
  updatedAt: Date
}

export interface GameState {
  user: User | null
  currentRiddle: Riddle | null
  progress: UserProgress | null
  unlockedHints: string[]
}