// ───────────────────────────────────────────────────────────────
// TeamsTab  –  pro Trainer eine eigene Tabelle
// ───────────────────────────────────────────────────────────────
import { useRun, Status } from '@/context/RunContext'
import type { Encounter } from '@/context/RunContext'

import TypeGrid   from '@/components/TypeGrid'          // ← NEU
import { sprite } from '@/utils/sprites'
import { pokemonTypes } from '@/utils/pokemonTypes'
import { TYPE_CHART }   from '@/data/typeChart'

const statusClasses = {
  Team: 'bg-green-600',
  Box:  'bg-yellow-500',
  Tod:  'bg-red-600',
} as const

/* ───────── Effektivitäts-Bucket eines Pokémon ───────── */
type BucketKey = 'x4' | 'x2' | 'x0,5' | 'x0,25' | 'x0'
const bucketKeys: BucketKey[] = ['x4', 'x2', 'x0,5', 'x0,25', 'x0']

function calcBuckets(pokeName: string) {
  const defs = pokemonTypes(pokeName).map(t => t.toLowerCase())

  const buckets: Record<BucketKey, string[]> = {
    'x4': [], 'x2': [], 'x0,5': [], 'x0,25': [], 'x0': [],
  }

  for (const att of Object.keys(TYPE_CHART)) {
    const m1 = TYPE_CHART[att]?.[defs[0]] ?? 1
    const m2 = defs[1] ? TYPE_CHART[att]?.[defs[1]] ?? 1 : 1
    const mult = m1 * m2

    if      (mult === 4)    buckets['x4'].push(att)
    else if (mult === 2)    buckets['x2'].push(att)
    else if (mult === 0.5)  buckets['x0,5'].push(att)
    else if (mult === 0.25) buckets['x0,25'].push(att)
    else if (mult === 0)    buckets['x0'].push(att)
  }
  return buckets
}

/* ─────────────────────────────────────────────────────── */
export default function TeamsTab() {
  const { trainers, encounters, setEncounters } = useRun()

  const patch = (id: string, fn: (e: Encounter) => Encounter) =>
    setEncounters(prev => prev.map(e => (e.id === id ? fn(e) : e)))

  /* Daten nach Trainer gruppieren */
  type Row = {
    id: string
    idx: number
    name: string
    status: Status
    trainer: string
    buckets: Record<BucketKey, string[]>
  }

  const rowsByTrainer: Record<string, Row[]> = Object.fromEntries(
    trainers.map(t => [t, [] as Row[]]),
  )

  encounters
    .filter(e => e.status === 'Team')
    .forEach(e =>
      e.slots.forEach((slot, idx) => {
        if (!slot.name) return
        rowsByTrainer[slot.trainer].push({
          id: e.id,
          idx,
          name: slot.name,
          status: e.status,
          trainer: slot.trainer,
          buckets: calcBuckets(slot.name),
        })
      }),
    )

  /* ─────────── R E N D E R ─────────── */
  return (
    <div className="space-y-10">
      {trainers.map(trainer => {
        const rows = rowsByTrainer[trainer]
        if (rows.length === 0) return null

        return (
          <table
            key={trainer}
            className="w-full text-sm table-fixed border-collapse border border-white/30"
          >
            <colgroup>
              <col className="w-32" />
              <col className="w-24" />
              {bucketKeys.map(k => (
                <col key={k} className="w-28" />
              ))}
              <col className="w-24" />
            </colgroup>

            <thead>
              <tr className="bg-gray-700 text-white border-b border-white/30">
                <th className="p-2 text-left">{trainer}</th>
                <th className="p-2">Typ</th>
                <th className="p-2">x4</th>
                <th className="p-2">x2</th>
                <th className="p-2">x0,5</th>
                <th className="p-2">x0,25</th>
                <th className="p-2">x0</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {rows.map(row => {
                const types = pokemonTypes(row.name)

                return (
                  <tr key={`${row.id}-${row.idx}`} className="border-b border-white/30">
                    {/* Pokémon + Sprite */}
                     <td className="p-2 flex justify-center">
                       <img
                         src={sprite(row.name)}
                         alt={row.name}
                         title={row.name}        /* Tooltip beim Hover */
                         className="h-24"
                       />
                     </td>

                    {/* Typen */}
                    <td className="p-2">
                      <TypeGrid types={types} />
                    </td>

                    {/* Effektivität */}
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
                        className={`w-full font-bold text-white rounded ${statusClasses[row.status]}`}
                      >
                        <option value="Team">Team</option>
                        <option value="Box">Box</option>
                        <option value="Tod">Tod</option>
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )
      })}
    </div>
  )
}
