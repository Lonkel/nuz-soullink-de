/* ──────────────────────────────────────────────────────────────
   RunContext  –  Supabase-synchrone zentrale Datenquelle
   • keine LocalStorage-Persistenz mehr
   • alle Browser sehen dieselben Daten in Echtzeit
   • Tabelle  runs(id uuid  PK, data jsonb, updated_at timestamptz)
   • RLS: allow anon  select, insert, update  on table runs
   • Realtime in Supabase-Dashboard für runs aktivieren
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

/* ╭─ Types ────────────────────────────────────────────────────╮ */
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

const RunContext = createContext<RunState | undefined>(undefined)

export const useRun = () => {
  const ctx = useContext(RunContext)
  if (!ctx)
    throw new Error('useRun must be used inside <RunProvider>')
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

  /* ── 1. Initial laden (oder anlegen) ─────────────────────── */
  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data, error } = await supabase
        .from('runs')
        .select('data')
        .eq('id', runId)
        .single<RunRow>()

      if (error && error.code !== 'PGRST116') console.error(error)

      if (!cancelled) {
        if (data) {
          setRun(data.data)
        } else {
          const fresh = {
            game: initialGame,
            trainers: initialTrainers,
            encounters: [],
            team: [],
          }
          await supabase.from('runs').insert({ id: runId, data: fresh })
          setRun(fresh)
        }
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [runId, initialGame, initialTrainers])

  /* ── 2. Realtime-Subscription ─────────────────────────────── */
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
        payload => {
          // andere Clients haben aktualisiert → State übernehmen
          setRun(payload.new.data as RunRow['data'])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [runId])

  // ─── Supabase-Loader + Mutations  ────────────────────────────────
useEffect(() => {
  let cancelled = false

  ;(async () => {
    const { data: row, error } = await supabase
      .from('runs')
      .select('data')
      .eq('id', runId)
      .single()

    if (cancelled) return

    if (row) {
      /* bereits vorhanden → in den React-State */
      setRun(row.data)
    } else if (error?.code === 'PGRST116') {
      /* Zeile fehlt → frische Default-Daten anlegen */
      const fresh: RunRow['data'] = {
        game:      initialGame,
        trainers:  initialTrainers,
        encounters: [],
        team:       [],
      }
      await supabase.from('runs').insert({ id: runId, data: fresh })
      setRun(fresh)
    } else if (error) {
      console.error('Loader error', error)
    }
  })()

  return () => {
    cancelled = true
  }
}, [runId, initialGame, initialTrainers])

/* ─── Speichern: immer UPSERT, nie mehr 404 ───────────────────── */
const save = async (next: RunRow['data']) => {
  setRun(next)                                         // sofort UI updaten
  const { error } = await supabase
    .from('runs')
    .upsert({ id: runId, data: next }, { onConflict: 'id' })
  if (error) console.error('supabase upsert failed', error)
}

/* ─── Setter-Helfer ───────────────────────────────────────────── */
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

  /* ── 4. Beim ersten Render ist run==null → Ladezustand ───── */
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
/* ╰────────────────────────────────────────────────────────────╯ */
