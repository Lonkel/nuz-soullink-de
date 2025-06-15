import { TYPE_CHART } from '@/data/typeChart'
import { pokemonTypes } from '@/utils/pokemonTypes'
import type { Encounter } from '@/context/RunContext'

export type Multiplier = 4 | 2 | 1 | 0.5 | 0.25 | 0

/* ---------- 1  Label-Typ ---------- */
export type Label = 'x4' | 'x2' | 'x1' | 'x0,5' | 'x0,25' | 'x0'

/* ---------- 2  Statische Mapping-Tabelle ---------- */
const LABEL_TO_NUM: Record<Label, Multiplier> = {
  'x4': 4,
  'x2': 2,
  'x1': 1,
  'x0,5': 0.5,
  'x0,25': 0.25,
  'x0': 0,
}

/* Jetzt kann nichts mehr undefined sein */
export const labelToNumber = (lbl: Label): Multiplier => LABEL_TO_NUM[lbl]

/* ---------- Effektivität & Aggregation ---------- */
export function effectiveness(
  attack: string,
  defenderTypes: string[],
): Multiplier {
  const m1 = TYPE_CHART[attack]?.[defenderTypes[0]] ?? 1
  const m2 = defenderTypes[1]
    ? TYPE_CHART[attack]?.[defenderTypes[1]] ?? 1
    : 1
  return (m1 * m2) as Multiplier
}

export function aggregateTeam(encounters: Encounter[]) {
  const agg: Record<string, Record<Multiplier, number>> = {}

  encounters
    .filter(e => e.status === 'Team')
    .forEach(e =>
      e.slots.forEach(slot => {
        if (!slot.name) return
        const def = pokemonTypes(slot.name).map(t => t.toLowerCase())
        Object.keys(TYPE_CHART).forEach(att => {
          const mult = effectiveness(att, def)
          agg[att] ??= { 4: 0, 2: 0, 1: 0, 0.5: 0, 0.25: 0, 0: 0 }
          agg[att][mult]++
        })
      }),
    )

  return agg
}

export { TYPE_CHART } from '@/data/typeChart'
