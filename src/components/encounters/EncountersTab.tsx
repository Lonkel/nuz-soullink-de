// src/components/encounters/EncountersTab.tsx
import { useState } from 'react'
import { MinusCircle, Pencil } from 'lucide-react'
import { v4 as uuid } from 'uuid'

import { useRun, Status }     from '@/context/RunContext'
import type { Encounter }     from '@/context/RunContext'
import LocationSelect         from '@/components/ui/LocationSelect'
import PokemonSelect          from '@/components/ui/PokemonSelect'
import { sprite }             from '@/utils/sprites'

const statusClasses = {
  Team: 'bg-green-600',
  Box:  'bg-yellow-500',
  Tod:  'bg-red-600',
} as const

export default function EncountersTab() {
  const { trainers, encounters, setEncounters } = useRun()

  /* ───────────────────────── Local State ───────────────────────── */
  // merkt die Zelle, die gerade editiert wird
  const [editing, setEditing] = useState<{ id: string; idx: number } | null>(null)

  /* ───────────────────────── State-Helper ───────────────────────── */
  const patch = (id: string, fn: (e: Encounter) => Encounter) =>
    setEncounters(prev => prev.map(e => (e.id === id ? fn(e) : e)))

  const addEncounter = () =>
    setEncounters(e => [
      ...e,
      {
        id: uuid(),
        location: '',
        slots: trainers.map(t => ({ trainer: t, name: '' })),
        status: 'Box' as const,
      } satisfies Encounter,
    ])

  const removeEncounter = (id: string) =>
    setEncounters(prev => prev.filter(e => e.id !== id))

  /* ──────────────────────────── JSX ──────────────────────────── */
  return (
    <>
      {/* ───────────── Tabelle ───────────── */}
      <table className="w-full text-sm table-fixed">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="p-2">Herkunft</th>
            {trainers.map(t => (
              <th key={t} className="p-2">{t}</th>
            ))}
            <th className="p-2 w-32">Status</th>
            <th className="p-2 w-12" />  {/* Leere Kopfzelle fürs Löschen-Icon */}
          </tr>
        </thead>

        <tbody>
          {encounters.map(enc => (
            <tr key={enc.id} className="border-t h-24">
              {/* Herkunft */}
              <td className="relative p-2">
                <LocationSelect
                  value={enc.location}
                  onChange={loc => patch(enc.id, e => ({ ...e, location: loc }))}
                />
              </td>

              {/* Pokémon-Slots */}
              {enc.slots.map((slot, idx) => {
                const isEditing = editing?.id === enc.id && editing.idx === idx
                const needsSelect = !slot.name || isEditing

                return (
                  <td key={idx} className="relative p-2">
                    {/* Auswahl-Komponente */}
                    {needsSelect && enc.location && (
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

                    {/* Sprite + Edit-Overlay */}
                    {slot.name && !isEditing && (
                      <button
                        onClick={() => setEditing({ id: enc.id, idx })}
                        className="group mx-auto relative h-24"
                        aria-label="Pokémon bearbeiten"
                      >
                        <img
                          src={sprite(slot.name)}
                          alt={slot.name}
                          className="h-24 mx-auto"
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
                  </td>
                )
              })}

              {/* Status */}
              <td className="p-2 w-32">
                <select
                  value={enc.status}
                  onChange={e =>
                    patch(enc.id, old => ({ ...old, status: e.target.value as Status }))
                  }
                  className={`w-full text-white rounded ${statusClasses[enc.status]}`}
                >
                  <option value="Team">Team</option>
                  <option value="Box">Box</option>
                  <option value="Tod">Tod</option>
                </select>
              </td>

              {/* Löschen */}
              <td className="p-2 w-12 text-center">
                <button
                  onClick={() => removeEncounter(enc.id)}
                  className="text-red-600 hover:text-red-800"
                  aria-label="Eintrag löschen"
                >
                  <MinusCircle size={20} fill="white" className="stroke-red-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ───────────── +Reihe-Button ───────────── */}
      <div className="mt-3 text-right">
        <button
          onClick={addEncounter}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          + Reihe
        </button>
      </div>
    </>
  )
}