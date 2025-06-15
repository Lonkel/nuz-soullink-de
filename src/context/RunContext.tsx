/* ──────────────────────────────────────────────────────────────
   RunContext  –  zentrale Datenquelle, Supabase-synchron
   • Tabelle runs(id uuid PK, data jsonb, updated_at timestamptz)
   • RLS: SELECT, INSERT, UPDATE für role public erlaubt
   • Realtime-Broadcast in Supabase aktiviert
   ────────────────────────────────────────────────────────────── */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'
import { supabase } from '@/lib/db'

/* ╭─ Typen ────────────────────────────────────────────────────╮ */
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
/* ╰─────────────────────────────────────────────────────────────╯ */

export const RunContext = createContext<RunState | undefined>(undefined)

export const useRun = () => {
  const ctx = useContext(RunContext)
  if (!ctx) throw new Error('useRun must be used inside <RunProvider>')
  return ctx
}

/* ╭─ Provider ────────────────────────────────────────────────╮ */
interface RunProviderProps {
  children: ReactNode
  runId: string
  initialGame: string
  initialTrainers: string[]
}

interface RunRow {
  id: string
  data: {
    game: string
    trainers: string[]
    encounters: Encounter[]
    team: Encounter[]
  }
}

export function RunProvider({
  children,
  runId,
  initialGame,
  initialTrainers,
}: RunProviderProps) {
  const [run, setRun] = useState<RunRow['data'] | null>(null)

  /* 1 ─ Initial laden ODER Default-Row anlegen */
  useEffect(() => {
    ;(async () => {
      const { data: row, status, error } = await supabase
        .from('runs')
        .select('data')
        .eq('id', runId)
        .maybeSingle<RunRow>()

      if (row) {
        setRun(row.data)
        return
      }

      if (status === 200 || status === 406) {
        const fresh: RunRow['data'] = {
          game: initialGame,
          trainers: initialTrainers,
          encounters: [],
          team: [],
        }
        await supabase.from('runs').insert({ id: runId, data: fresh })
        setRun(fresh)
        return
      }

      if (error) console.error('Loader error', error)
    })()
  }, [runId, initialGame, initialTrainers])

  /* 2 ─ Realtime-Subscription */
  useEffect(() => {
    const channel = supabase
      .channel('run-' + runId)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'runs',
          filter: `id=eq.${runId}`,
        },
        payload => setRun((payload.new as RunRow).data),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [runId])

  /* 3 ─ Speichern (UPSERT) */
  const save = async (next: RunRow['data']) => {
    setRun(next)
    const { error } = await supabase
      .from('runs')
      .upsert({ id: runId, data: next }, { onConflict: 'id' })
    if (error) console.error('supabase upsert failed', error)
  }

  /* 4 ─ Setter-Helfer */
  const setEncounters: Setter<Encounter[]> = update =>
    setRun(cur => {
      if (!cur) return cur
      const nextList =
        typeof update === 'function' ? update(cur.encounters) : update
      const next = { ...cur, encounters: nextList }
      save(next)
      return next
    })

  const setTeam: Setter<Encounter[]> = update =>
    setRun(cur => {
      if (!cur) return cur
      const nextList =
        typeof update === 'function' ? update(cur.team) : update
      const next = { ...cur, team: nextList }
      save(next)
      return next
    })

  /* 5 ─ Ladezustand */
  if (!run) return null

  const value: RunState = {
    game: run.game,
    trainers: run.trainers,
    encounters: run.encounters,
    setEncounters,
    team: run.team,
    setTeam,
  }

  return (
    <RunContext.Provider value={value}>
      {children}
    </RunContext.Provider>
  )
}
/* ╰─────────────────────────────────────────────────────────────╯ */
