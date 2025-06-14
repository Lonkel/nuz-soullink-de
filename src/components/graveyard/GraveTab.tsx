// ───────────────────────────────────────────────────────────────
// src/components/graveyard/GraveTab.tsx
// Zeigt nur Begegnungen mit Status „Tod“.
// Statt einer Status-Spalte gibt es rechts eine Spalte „Mörder“,
// in der man per Dropdown den verantwortlichen Trainer auswählt.
// Enthält Typ-Spalten wie der Begegnungen-Tab.
// ───────────────────────────────────────────────────────────────
import { useState } from 'react'
import { Pencil, MinusCircle } from 'lucide-react'
import TypeIcon from '@/components/ui/TypeIcon'

import { useRun }    from '@/context/RunContext'
import type { Encounter } from '@/context/RunContext'
import PokemonSelect  from '@/components/ui/PokemonSelect'
import LocationSelect from '@/components/ui/LocationSelect'
import { sprite }     from '@/utils/sprites'
import { pokemonTypes } from '@/utils/pokemonTypes'

export default function GraveTab() {
  const { trainers, encounters, setEncounters } = useRun()
  const rows = encounters.filter(e => e.status === 'Tod')

  const [editing, setEditing] =
    useState<{ id: string; idx: number } | null>(null)

  /* Helper zum Aktualisieren */
  const patch = (id: string, fn: (e: Encounter) => Encounter) =>
    setEncounters(prev => prev.map(e => (e.id === id ? fn(e) : e)))

  const removeRow = (id: string) =>
    setEncounters(prev => prev.filter(e => e.id !== id))

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-700 text-white">
          <th className="p-2">Herkunft</th>

          {/* Trainer- & Typ-Spalten */}
          {trainers.map(t => (
            <>
              <th key={t} className="p-2">{t}</th>
              <th key={`${t}-typ`} className="p-2 w-20">Typ</th>
            </>
          ))}

          <th className="p-2 w-32">Mörder</th>
          <th className="p-2 w-12" />
        </tr>
      </thead>

      <tbody>
        {rows.map(enc => (
          <tr key={enc.id} className="border-t h-24 align-top">
            {/* Herkunft */}
            <td className="p-2">
              <LocationSelect
                value={enc.location}
                onChange={loc =>
                  patch(enc.id, e => ({ ...e, location: loc }))
                }
              />
            </td>

            {/* Slots + Typ-Zellen */}
            {enc.slots.map((slot, idx) => {
              const isEditing =
                editing?.id === enc.id && editing.idx === idx
              const types = pokemonTypes(slot.name)

              return (
                <>
                  {/* Pokémon-Slot */}
                  <td key={`slot-${idx}`} className="relative p-2">
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
                        className="group mx-auto relative h-12"
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

                  {/* Typ-Zelle */}
                  <td key={`type-${idx}`} className="p-2 text-center">
                    {types.map(t => <TypeIcon key={t} type={t} />)
}
                  </td>
                </>
              )
            })}

            {/* Mörder-Dropdown */}
            <td className="p-2 w-32">
              <select
                value={enc.killer ?? ''}
                onChange={e =>
                  patch(enc.id, old => ({ ...old, killer: e.target.value }))
                }
                className="w-full rounded bg-gray-800 text-white"
              >
                <option value="">– auswählen –</option>
                {trainers.map(tr => (
                  <option key={tr} value={tr}>
                    {tr}
                  </option>
                ))}
              </select>
            </td>

            {/* Löschen */}
            <td className="p-2 w-12 text-center">
              <button
                onClick={() => removeRow(enc.id)}
                className="text-red-600 hover:text-red-800"
                aria-label="Eintrag löschen"
              >
                <MinusCircle size={20} fill="white" className="stroke-red-600" />
              </button>
            </td>
          </tr>
        ))}

        {rows.length === 0 && (
          <tr>
            <td
              colSpan={trainers.length * 2 + 2} // Herkunft + pro Trainer 2 Spalten + Mörder
              className="py-8 text-center text-gray-400"
            >
              Keine toten Pokémon – schön so!
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
