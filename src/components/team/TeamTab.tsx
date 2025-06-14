// ───────────────────────────────────────────────────────────────
// src/components/team/TeamTab.tsx
// Zeigt *nur* die Begegnungen, deren Status „Team“ ist.
// Layout & Funktionen identisch zum Begegnungen-Tab:
//   • Pokémon austauschbar (Stift-Overlay)
//   • Status-Dropdown (Team/Box/Tod) – ändert sich der Status,
//     verschwindet die Reihe hier automatisch.
//   • Kein „+ Reihe“-Button, weil neue Einträge ausschließlich
//     im Begegnungen-Tab angelegt werden.
// ───────────────────────────────────────────────────────────────
import { useState } from 'react'
import { Pencil } from 'lucide-react'

import { useRun, Status } from '@/context/RunContext'
import type { Encounter } from '@/context/RunContext'
import PokemonSelect      from '@/components/ui/PokemonSelect'
import LocationSelect     from '@/components/ui/LocationSelect'
import { sprite }         from '@/utils/sprites'


const statusClasses = {
  Team: 'bg-green-600',
  Box:  'bg-yellow-500',
  Tod:  'bg-red-600',
} as const

interface Props { wanted: Status }

export default function FilteredTab({ wanted }: Props) {
  const { trainers, encounters, setEncounters } = useRun()
  const rows = encounters.filter((e) => e.status === wanted)

  const [editing, setEditing] =
    useState<{ id: string; idx: number } | null>(null)


  const patch = (id: string, fn: (e: Encounter) => Encounter) =>
    setEncounters((prev) => prev.map((e) => (e.id === id ? fn(e) : e)))

  
  return (
    <table className="w-full text-sm table-fixed">
      <thead>
        <tr className="bg-gray-700 text-white">
          <th className="p-2">Herkunft</th>
          {trainers.map((t) => (
            <th key={t} className="p-2">{t}</th>
          ))}
          <th className="p-2 w-32">Status</th>
        </tr>
      </thead>

      <tbody>
        {rows.map((enc) => (
          <tr key={enc.id} className="border-t h-24">
            {/* Herkunft */}
            <td className="p-2">
              <LocationSelect
                value={enc.location}
                onChange={(loc) => patch(enc.id, (e) => ({ ...e, location: loc }))}
              />
            </td>

            {/* Pokémon-Slots */}
            {enc.slots.map((slot, idx) => {
              const isEditing = editing?.id === enc.id && editing.idx === idx
              return (
                <td key={idx} className="relative p-2">
                  {isEditing && (
                    <PokemonSelect
                      onSelect={(poke) => {
                        patch(enc.id, (e) => {
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
                      className="group mx-auto relative h-12"
                    >
                      <img src={sprite(slot.name)} alt={slot.name} className="h-12 mx-auto" />
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
              )
            })}

            {/* Status */}
            <td className="p-2 w-32">
              <select
                value={enc.status}
                onChange={(e) =>
                  patch(enc.id, (old) => ({ ...old, status: e.target.value as Status }))
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
            <td colSpan={trainers.length + 2} className="py-8 text-center text-gray-400">
              Keine Einträge.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}