// ────────────────────────────────────────────────────────────────
// src/context/RunContext.tsx
// Vollständige, ESLint-saubere Version.
// – verwaltet Encounters UND Team
// – kein „…“-Fehler mehr, alle Generics korrekt
// – Provider akzeptiert optionale Initial-Daten, baut die States selbst
// ────────────────────────────────────────────────────────────────
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'

/* ─────────────────────── Typen ─────────────────────── */
export type Status = 'Team' | 'Box' | 'Tod'

export interface Slot {
  trainer: string
  name: string            // '' = noch nicht gewählt
}

export interface Encounter {
  id: string
  location: string
  slots: Slot[]           // Reihenfolge == Trainer-Liste
  status: Status
  killer?: string         // nur relevant, wenn status === 'Tod'
}

type Setter<T> = Dispatch<SetStateAction<T>>

export interface RunState {
  game: string
  trainers: string[]
  encounters: Encounter[]
  setEncounters: Setter<Encounter[]>
  team: Encounter[]
  setTeam: Setter<Encounter[]>
}

/* ─────────────────────── Context ─────────────────────── */
export const RunContext = createContext<RunState | null>(null)

/* Hook zum bequemen Zugriff */
export const useRun = (): RunState => {
  const ctx = useContext(RunContext)
  if (!ctx) throw new Error('useRun must be used inside <RunProvider>')
  return ctx
}

/* ─────────────────────── Provider ───────────────────────
   Kann (muss aber nicht) Initial-Daten bekommen.
   Beispiel:
     <RunProvider initialGame="HG/SS" initialTrainers={['Red', 'Blue']}>
        <App />
     </RunProvider>
*/
interface RunProviderProps {
  children: ReactNode
  initialGame?: string
  initialTrainers?: string[]
  initialEncounters?: Encounter[]
  initialTeam?: Encounter[]
}

export function RunProvider({
  children,
  initialGame = '',
  initialTrainers = [],
  initialEncounters = [],
  initialTeam = [],
}: RunProviderProps) {
  /* States */
  const [game] = useState(initialGame)                 // selten verändert
  const [trainers] = useState(initialTrainers)
  const [encounters, setEncounters] = useState<Encounter[]>(initialEncounters)
  const [team, setTeam] = useState<Encounter[]>(initialTeam)

  const value: RunState = {
    game,
    trainers,
    encounters,
    setEncounters,
    team,
    setTeam,
  }

  return <RunContext.Provider value={value}>{children}</RunContext.Provider>
}
