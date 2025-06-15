// ───────────────────────────────────────────────────────────────
// TeamsTab
// • keine “obere Tabelle” mehr
// • pro Trainer eine eigene Tabelle untereinander
// • Kopfzeile: Trainer | Typ | x4 | x2 | x1/2 | x1/4 | x0 | Status
// • klare Spaltentrennung (Tailwind-Border)
// ───────────────────────────────────────────────────────────────
import { useState } from 'react'
import { Pencil } from 'lucide-react'

import { useRun, Status } from '@/context/RunContext'
import type { Encounter } from '@/context/RunContext'

import TypeIcon      from '@/components/ui/TypeIcon'
import PokemonSelect from '@/components/ui/PokemonSelect'
import { sprite }    from '@/utils/sprites'
import { pokemonTypes } from '@/utils/pokemonTypes'
import { TYPE_CHART }   from '@/data/typeChart'

const statusClasses = {
  Team: 'bg-green-600',
  Box:  'bg-yellow-500',
  Tod:  'bg-red-600',
} as const

/* ───────── Effektivitäts-Bucket eines einzelnen Pokémon ─────── */
type BucketKey = 'x4' | 'x2' | 'x1/2' | 'x1/4' | 'x0'
const bucketKeys: BucketKey[] = ['x4', 'x2', 'x1/2', 'x1/4', 'x0']

function calcBuckets(pokeName: string) {
  const defs = pokemonTypes(pokeName).map(t => t.toLowerCase())

  const buckets: Record<BucketKey, string[]> = {
    'x4'  : [],
    'x2'  : [],
    'x1/2': [],
    'x1/4': [],
    'x0'  : [],
  }

  for (const att of Object.keys(TYPE_CHART)) {
    const m1 = TYPE_CHART[att]?.[defs[0]] ?? 1
    const m2 = defs[1] ? TYPE_CHART[att]?.[defs[1]] ?? 1 : 1
    const mult = m1 * m2

    if (mult === 4) buckets['x4'].push(att)
    else if (mult === 2) buckets['x2'].push(att)
    else if (mult === 0.5) buckets['x1/2'].push(att)
    else if (mult === 0.25) buckets['x1/4'].push(att)
    else if (mult === 0) buckets['x0'].push(att)
  }

  return buckets
}

/* ─────────────────────────────────────────────────────────────── */
export default function TeamsTab() {
  const { trainers, encounters, setEncounters } = useRun()

  // für das Edit-Popup
  const [editing, setEditing] =
    useState<{ id: string; idx: number } | null>(null)

  const patch = (id: string, fn: (e: Encounter) => Encounter) =>
    setEncounters(prev => prev.map(e => (e.id === id ? fn(e) : e)))

  /* -------- Hilfsstruktur pro Trainer ------------------------- */
  type Row = {
    id: string            // encounter-id
    idx: number           // slot-index
    name: string
    status: Status
    trainer: string
    buckets: Record<BucketKey, string[]>
  }

  const rowsByTrainer: Record<string, Row[]> = Object.fromEntries(
    trainers.map(t => [t, [] as Row[]]),
  )

  encounters
    .filter(e => e.status === 'Team')          // nur echte Team-Pokémon
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

  /* --------------- R E N D E R -------------------------------- */
  return (
    <div className="space-y-10">
      {trainers.map(trainer => {
        const rows = rowsByTrainer[trainer]
        if (rows.length === 0) return null  // Trainer hat kein Pokémon

        return (
          <table
            key={trainer}
            className="w-full text-sm table-fixed border-collapse border border-white/20"
          >
            {/* Spaltenbreiten + Abgrenzung */}
            <colgroup>
              <col className="w-32" /> {/* Pokémon */}
              <col className="w-24" /> {/* Typ */}
              {bucketKeys.map(() => (
                <col key={crypto.randomUUID()} className="w-28" />
              ))}
              <col className="w-24" /> {/* Status */}
            </colgroup>

            {/* Kopfzeile */}
            <thead>
              <tr className="bg-gray-700 text-white border-b border-white/20">
                <th className="p-2 text-left">{trainer}</th>
                <th className="p-2">Typ</th>
                <th className="p-2">x4</th>
                <th className="p-2">x2</th>
                <th className="p-2">x1/2</th>
                <th className="p-2">x1/4</th>
                <th className="p-2">x0</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>

            {/* Datenzeilen */}
            <tbody>
              {rows.map(row => {
                const types = pokemonTypes(row.name)

                return (
                  <tr key={`${row.id}-${row.idx}`} className="border-b border-white/20">
                    {/* Pokémon + Icon */}
                    <td className="p-2 flex items-center gap-2">
                      <button
                        onClick={() => setEditing({ id: row.id, idx: row.idx })}
                        className="group relative h-14"
                      >
                        <img src={sprite(row.name)} alt={row.name} className="h-14" />
                        <Pencil
                          size={18}
                          fill="white"
                          className="absolute right-0 bottom-0 stroke-red-600
                                     rounded-full bg-black/60 p-[2px]
                                     opacity-0 group-hover:opacity-100 transition"
                        />
                      </button>
                      {row.name}
                    </td>

                    {/* Typen */}
                    <td className="p-2">
                      <div className="flex gap-1">
                        {types.map(t => (
                          <TypeIcon key={t} type={t} />
                        ))}
                      </div>
                    </td>

                    {/* Effektivitätsspalten */}
                    {bucketKeys.map(k => (
                      <td key={k} className="p-2">
                        <div className="flex gap-1 flex-wrap">
                          {row.buckets[k].map(t => (
                            <TypeIcon key={t} type={t} />
                          ))}
                        </div>
                      </td>
                    ))}

                    {/* Status-Select */}
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
