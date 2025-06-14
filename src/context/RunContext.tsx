import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'
 import usePersistentState from '@/hooks/usePersistentState'

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

export const RunContext = createContext<RunState | null>(null)

export const useRun = (): RunState => {
  const ctx = useContext(RunContext)
  if (!ctx) throw new Error('useRun must be used inside <RunProvider>')
  return ctx
}

interface RunProviderProps {
  children: ReactNode
  runId: string
  initialGame: string
  initialTrainers: string[]
}

export function RunProvider({
  children,
  runId,
  initialGame,
  initialTrainers,
}: RunProviderProps) {
  const [encounters, setEncounters] = usePersistentState<Encounter[]>(
    `${runId}-encounters`,
    [],
  )
  const [team, setTeam] = usePersistentState<Encounter[]>(
    `${runId}-team`,
    [],
  )

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
