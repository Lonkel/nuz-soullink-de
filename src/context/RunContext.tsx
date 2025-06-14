import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'

export type Status = 'Team' | 'Box' | 'Tod'

export interface Slot {
  trainer: string
  name: string
}

export interface Encounter {
  id: string
  location: string
  slots: Slot[]
  status: Status
  killer?: string
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

const RunContext = createContext<RunState | null>(null)

export const useRun = (): RunState => {
  const ctx = useContext(RunContext)
  if (!ctx) throw new Error('useRun must be used inside <RunProvider>')
  return ctx
}

interface RunProviderProps {
  children: ReactNode
  initialGame: string
  initialTrainers: string[]
}

export function RunProvider({
  children,
  initialGame,
  initialTrainers,
}: RunProviderProps) {
  const [encounters, setEncounters] = useState<Encounter[]>([])
  const [team, setTeam] = useState<Encounter[]>([])

  const value: RunState = {
    game: initialGame,
    trainers: initialTrainers,
    encounters,
    setEncounters,
    team,
    setTeam,
  }

  return <RunContext.Provider value={value}>{children}</RunContext.Provider>
}
