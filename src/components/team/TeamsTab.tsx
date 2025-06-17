// ─────────────────────────────────────────────
// TeamsTab – pro Trainer eine eigene Tabelle
// ─────────────────────────────────────────────
import { useRun, Status } from '@/context/RunContext'
import type { Encounter } from '@/context/RunContext'
import TrainerPokemonSelect from '@/components/team/TrainerPokemonSelect'
import TypeGrid   from '@/components/TypeGrid'
import { sprite } from '@/utils/sprites'
import { pokemonTypes } from '@/utils/pokemonTypes'
import { TYPE_CHART }   from '@/data/typeChart'

/* Status-Styles */
const statusClasses = {
  Team: 'bg-green-600',
  Box:  'bg-yellow-500',
  Tod:  'bg-red-600',
} as const

/* Buckets für Effektivitäten */
type BucketKey = 'x4' | 'x2' | 'x0.5' | 'x0.25' | 'x0'
const bucketKeys: BucketKey[] = ['x4', 'x2', 'x0.5', 'x0.25', 'x0']

/* ────── Effektivitäten berechnen ────── */
function calcBuckets(name: string) {
  const defs = pokemonTypes(name).map(t => t.toLowerCase())
  const b: Record<BucketKey, string[]> = {
    x4: [], x2: [], 'x0.5': [], 'x0.25': [], x0: [],
  }

  for (const att of Object.keys(TYPE_CHART)) {
    const m1 = TYPE_CHART[att]?.[defs[0]] ?? 1
    const m2 = defs[1] ? TYPE_CHART[att]?.[defs[1]] ?? 1 : 1
    const mult = m1 * m2

    if      (mult === 4)     b.x4.push(att)
    else if (mult === 2)     b.x2.push(att)
    else if (mult === 0.5)   b['x0.5'].push(att)
    else if (mult === 0.25)  b['x0.25'].push(att)
    else if (mult === 0)     b.x0.push(att)
  }
  return b
}

/* ─────────────────────────────────────── */
export default function TeamsTab() {
  const { trainers, encounters, setEncounters } = useRun()

  /* Helper zum Patchen */
  const patch = (id: string, fn: (e: Encounter) => Encounter) =>
    setEncounters(prev => prev.map(e => (e.id === id ? fn(e) : e)))

  /* Zeilenstruktur */
  type Row = {
    id: string
    idx: number
    name: string
    trainer: string
    status: Status
    buckets: Record<BucketKey, string[]>
    partners: string[]
  }

  /* Nach Trainer gruppieren */
  const rowsByTrainer: Record<string, Row[]> = Object.fromEntries(
    trainers.map(t => [t, [] as Row[]]),
  )

  encounters
    .filter(e => e.status === 'Team')
    .forEach(e =>
      e.slots.forEach((slot, idx) => {
        if (!slot.name) return

        const partners = e.slots
          .filter(s => s.trainer !== slot.trainer && s.name)
          .map(s => s.name as string)

        rowsByTrainer[slot.trainer].push({
          id: e.id,
          idx,
          name: slot.name,
          trainer: slot.trainer,
          status: e.status,
          buckets: calcBuckets(slot.name),
          partners,
        })
      }),
    )

  /* ───────────── Render ───────────── */
  return (
    <div className="space-y-10">
      {trainers.map(trainer => {
        const rows = rowsByTrainer[trainer]
        if (rows.length === 0) return null

        return (
          <div key={trainer}>
            {/* Pokémon-Suche + Ein-Zeilen-Tabelle */}
            <TrainerPokemonSelect trainer={trainer} />

            {/* Team-Tabelle */}
            <table className="w-full text-sm table-fixed border-collapse border-2 border-white/30">
              <colgroup>
                <col className="w-20" />  {/* Sprite */}
                <col className="w-16" />  {/* Partner-Sprite */}
                <col className="w-24" />  {/* Typen */}
                {bucketKeys.map(k => (
                  <col key={k} className="w-28" />
                ))}
                <col className="w-24" />  {/* Status */}
              </colgroup>

              <thead>
                <tr className="bg-gray-700 text-white border-b-2 border-white/30 divide-x-2 divide-white/30">
                  <th className="p-2 text-left">{trainer}</th>
                  <th className="p-2">Link</th>
                  <th className="p-2">Typ</th>
                  {bucketKeys.map(k => (
                    <th key={k} className="p-2">{k}</th>
                  ))}
                  <th className="p-2">Status</th>
                </tr>
              </thead>

              <tbody>
                {rows.map(row => (
                  <tr key={`${row.id}-${row.idx}`} className="border-b border-white/20">
                    {/* Sprite */}
                    <td className="p-2 flex justify-center">
                      <img src={sprite(row.name)} alt={row.name} className="h-20" />
                    </td>

                    {/* Partner-Sprites */}
                    <td className="p-2 relative">
                      {row.partners.map((p, i) => (
                        <img
                          key={p}
                          src={sprite(p)}
                          alt={p}
                          className="h-12 absolute bottom-1 right-1"
                          style={{ right: `${i * 2}rem` }}
                        />
                      ))}
                    </td>

                    {/* Typen */}
                    <td className="p-2">
                      <TypeGrid types={pokemonTypes(row.name)} />
                    </td>

                    {/* Buckets */}
                    {bucketKeys.map(k => (
                      <td key={k} className="p-2">
                        <TypeGrid types={row.buckets[k]} />
                      </td>
                    ))}

                    {/* Status */}
                    <td className="p-2">
                      <select
                        value={row.status}
                        onChange={e =>
                          patch(row.id, enc => ({ ...enc, status: e.target.value as Status }))
                        }
                        className={`w-full rounded font-bold text-white ${statusClasses[row.status]}`}
                      >
                        <option value="Team">Team</option>
                        <option value="Box">Box</option>
                        <option value="Tod">Tod</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}
