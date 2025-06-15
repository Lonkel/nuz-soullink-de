// ───────────────────────────────────────────────────────────────
// TeamTab – 1) Schaden-Matrix  2) eigentliche Team-Tabelle
// ───────────────────────────────────────────────────────────────
import { useState } from 'react'
import { Pencil } from 'lucide-react'

import { useRun, Status }   from '@/context/RunContext'
import type { Encounter }   from '@/context/RunContext'
import PokemonSelect        from '@/components/ui/PokemonSelect'
import LocationSelect       from '@/components/ui/LocationSelect'
import TypeIcon             from '@/components/ui/TypeIcon'
import { sprite }           from '@/utils/sprites'
import { pokemonTypes }     from '@/utils/pokemonTypes'
import { TYPE_CHART }       from '@/data/typeChart'
import type { Multiplier, Label } from '@/utils/typeMath'

const statusClasses = {
  Team: 'bg-green-600',
  Box:  'bg-yellow-500',
  Tod:  'bg-red-600',
} as const

/* ───────── aggregiert Schwächen / Resistenzen pro Trainer ───── */
function aggregatePerTrainer(encounters: Encounter[], trainers: string[]) {
  const mons: Record<string, string[]> = Object.fromEntries(
    trainers.map(t => [t, [] as string[]]),
  )

  encounters
    .filter(e => e.status === 'Team')
    .forEach(e =>
      e.slots.forEach(s => {
        if (s.name) mons[s.trainer].push(s.name)
      }),
    )

  const chart: Record<string, Record<Label, string[]>> = {}
  trainers.forEach(t => {
    const map: Record<Label, string[]> = {
      'x4': [],
      'x2': [],
      'x1': [],
      'x1/2': [],
      'x1/4': [],
      'x0': [],
    }

    Object.keys(TYPE_CHART).forEach(att => {
      let min: Multiplier = 4
      let max: Multiplier = 0

      mons[t].forEach(pn => {
        const def = pokemonTypes(pn).map(x => x.toLowerCase())
        const m1 = TYPE_CHART[att]?.[def[0]] ?? 1
        const m2 = def[1] ? TYPE_CHART[att]?.[def[1]] ?? 1 : 1
        const m = (m1 * m2) as Multiplier
        min = Math.min(min, m) as Multiplier
        max = Math.max(max, m) as Multiplier
      })

      let label: Label = 'x1'
      if (max >= 4) label = 'x4'
      else if (max >= 2) label = 'x2'
      else if (min === (0 as Multiplier)) label = 'x0'
      else if (min <= 0.25) label = 'x1/4'
      else if (min <= 0.5) label = 'x1/2'

      map[label].push(att)
    })

    chart[t] = map
  })

  return chart
}

/* ─────────────────────────────────────────────────────────────── */

export default function TeamTab() {
  const { trainers, encounters, setEncounters } = useRun()
  const rows = encounters.filter(e => e.status === 'Team')
  const [editing, setEditing] =
    useState<{ id: string; idx: number } | null>(null)

  const patch = (id: string, fn: (e: Encounter) => Encounter) =>
    setEncounters(prev => prev.map(e => (e.id === id ? fn(e) : e)))

  /* Schaden-Matrix vorberechnen */
  const trainerChart = aggregatePerTrainer(rows, trainers)
  const chartLabels: Label[] = ['x4', 'x2', 'x1/2', 'x1/4', 'x0']

  /* Gemeinsames <colgroup> – gleiche Spaltenbreiten für beide Tabellen */
  const COLS = (
    <colgroup>
      <col className="w-28" />
      {trainers.map(() => (
        <>
          <col className="w-28" />
          <col className="w-24" />
        </>
      ))}
      <col className="w-32" />
    </colgroup>
  )

  /* ─────────────── R E N D E R ───────────────────────────────── */
  return (
    <>
      {/* 1) Schaden-Matrix */}
      <table className="mb-6 w-full text-sm table-fixed">
        {COLS}
        <tbody>
          {chartLabels.map((lbl, idx) => (
            <tr
              key={lbl}
              className={`h-10 ${idx ? 'border-t border-white/20' : ''}`}
            >
              {/* Zeilenlabel */}
              <td className="px-2 font-bold text-white whitespace-nowrap">
                {lbl}
              </td>

              {/* pro Trainer: Chart-Zelle + Dummy */}
              {trainers.map(t => (
                <>
                  <td
                    key={`${lbl}-${t}`}
                    className="p-1 align-top"
                  >
                    <div className="grid grid-cols-2 gap-1 justify-items-start">
                      {trainerChart[t][lbl].map(ty => (
                        <TypeIcon key={ty} type={ty} />
                      ))}
                    </div>
                  </td>
                  <td key={`${lbl}-${t}-dummy`} className="p-1" />
                </>
              ))}

              {/* Status-Dummy */}
              <td className="p-2" />
            </tr>
          ))}
        </tbody>
      </table>

      {/* 2) Team-Tabelle */}
      <table className="w-full text-sm table-fixed">
        {COLS}
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="p-2">Herkunft</th>
            {trainers.map(t => (
              <>
                <th key={t} className="p-2">{t}</th>
                <th key={`${t}-typ`} className="p-2" />
              </>
            ))}
            <th className="p-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {rows.map(enc => (
            <tr
              key={enc.id}
              className={[
                'border-t h-32',
                enc.status === 'Tod' && 'bg-gray-800/30 text-gray-400',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {/* Herkunft */}
              <td className="p-2 align-middle">
                <LocationSelect
                  value={enc.location}
                  onChange={loc =>
                    patch(enc.id, e => ({ ...e, location: loc }))
                  }
                />
              </td>

              {/* Pokémon-Slots + Typen */}
              {enc.slots.map((slot, idx) => {
                const isEditing =
                  editing?.id === enc.id && editing.idx === idx
                const types = pokemonTypes(slot.name)

                return (
                  <>
                    {/* Slot */}
                    <td
                      key={`slot-${idx}`}
                      className="relative p-2 align-top text-center"
                    >
                      {isEditing && (
                        <PokemonSelect
                          onSelect={poke => {
                            patch(enc.id, e => {
                              const s = [...e.slots]
                              s[idx] = { ...slot, name: poke }
                              return { ...e, slots: s }
                            })
                            setEditing(null)
                          }}
                          onCancel={() => setEditing(null)}
                        />
                      )}

                      {slot.name && !isEditing && (
                        <button
                          onClick={() => setEditing({ id: enc.id, idx })}
                          className="group mx-auto relative h-24"
                        >
                          <img
                            src={sprite(slot.name)}
                            alt={slot.name}
                            className={`h-24 mx-auto ${
                              enc.status === 'Tod' ? 'grayscale' : ''
                            }`}
                          />
                          <Pencil
                            size={18}
                            fill="white"
                            className="absolute right-0 bottom-0 stroke-red-600
                                       rounded-full bg-black/60 p-[2px]
                                       opacity-0 group-hover:opacity-100 transition"
                          />
                        </button>
                      )}

                      {!slot.name && !isEditing && (
                        <button
                          onClick={() => setEditing({ id: enc.id, idx })}
                          className="mx-auto flex h-10 w-10 items-center justify-center
                                     rounded-full bg-gray-700 text-white hover:bg-gray-600"
                        >
                          +
                        </button>
                      )}
                    </td>

                    {/* Typen */}
                    <td
                      key={`type-${idx}`}
                      className="p-2 text-center align-middle"
                    >
                      {types.map(t => (
                        <TypeIcon
                          key={t}
                          type={t}
                          className={enc.status === 'Tod' ? 'grayscale' : ''}
                        />
                      ))}
                    </td>
                  </>
                )
              })}

              {/* Status */}
              <td className="p-2 align-middle">
                <select
                  value={enc.status}
                  onChange={e =>
                    patch(enc.id, o => ({
                      ...o,
                      status: e.target.value as Status,
                    }))
                  }
                  className={`w-full font-bold text-white rounded ${statusClasses[enc.status]}`}
                >
                  <option value="Team">Team</option>
                  <option value="Box">Box</option>
                  <option value="Tod">Tod</option>
                </select>
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td
                colSpan={trainers.length * 2 + 2}
                className="py-8 text-center text-gray-400"
              >
                Dein Team ist derzeit leer.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}