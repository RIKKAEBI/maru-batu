export type FireStoreTree = {
  results: {
    [key: string]: Result
  }
  questions: {
    [key: string]: Question
  }
}

export type Result = {
  // 何問目か
  id: number
  // その人の答え
  result: boolean
  // 個人特定するやつ
  uid: string
  // その人の名前
  name: string
  // チーム
  team: string
}

export type Question = {
  // 問題の数
  id: number
  // その問題の可否
  result: boolean
}

export type Ranking = {
  [uid: string]: Rank
}

export type Rank = {
  uid: string
  name: string
  total: number
}

export type TeamRank = {
  id: string
  total: number
}