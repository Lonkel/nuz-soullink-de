// src/context/RunContext.tsx
import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

export type Status = 'Team' | 'Box' | 'Tod'

export interface Slot {
  trainer: string
  name: string          // '' = noch nicht gewählt
}

export interface Encounter {
  id: string
  location: string
  slots: Slot[]         // Reihenfolge == Trainer-Liste
  status: Status
  killer?: string       // Friedhof
}

type RunState = {
  game: string
  trainers: string[]
  encounters: Encounter[]
  setEncounters: React.Dispatch<React.SetStateAction<Encounter[]>>
}

export const RunContext = createContext<RunState | null>(null)
export const useRun = () => useContext(RunContext)!
