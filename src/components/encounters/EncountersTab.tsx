import { useState } from 'react'
import { Pencil, MinusCircle } from 'lucide-react'
import { v4 as uuid } from 'uuid'
import TypeIcon from '@/components/ui/TypeIcon'

import { useRun, Status }  from '@/context/RunContext'
import type { Encounter }  from '@/context/RunContext'
import PokemonSelect       from '@/components/ui/PokemonSelect'
import LocationSelect      from '@/components/ui/LocationSelect'
import { sprite }          from '@/utils/sprites'
import { pokemonTypes }    from '@/utils/pokemonTypes'        // ← NEU

const statusClasses = {
  Team: 'bg-green-600',
  Box:  'bg-yellow-500',
  Tod:  'bg-red-600',
} as const

export default function EncountersTab() {
  const { trainers, encounters, setEncounters } = useRun()
  const [editing, setEditing] =
    useState<{ id: string; idx: number } | null>(null)

  /* ------- helpers ------- */
  const patch = (id: string, fn: (e: Encounter) => Encounter) =>
    setEncounters((prev) => prev.map((e) => (e.id === id ? fn(e) : e)))

  const addRow = () =>
    setEncounters((e) => [
      ...e,
      {
        id: uuid(),
        location: '',
        slots: trainers.map((t) => ({ trainer: t, name: '' })),
        status: 'Box',
      } satisfies Encounter,
    ])

    const removeRow = (id: string) =>
     setEncounters(prev => prev.filter(e => e.id !== id))

  /* ------- JSX ------- */
  return (
    <>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="p-2">Herkunft</th>

            {/* ➊  Trainer + Typ-Spalten */}
            {trainers.map((t) => (
              <>
                <th key={t} className="p-2">{t}</th>
                <th key={`${t}-typ`} className="p-2 w-20" />   {/* leer */}
              </>
            ))}

            <th className="p-2 w-32">Status</th>
            <th className="p-2 w-12" />      {/* Platz für Trash-Icon */}
          </tr>
        </thead>

        <tbody>
          {encounters.map((enc) => (
            <tr
              key={enc.id}
              className={
                [
                  'border-t h-32',
                  enc.status === 'Tod' && 'bg-gray-800/30 text-gray-400',
                ]
                  .filter(Boolean)
                  .join(' ')
              }
            >
              {/* Herkunft */}
              <td className="p-2 align-middle">
                <LocationSelect
                  value={enc.location}
                  onChange={(loc) => patch(enc.id, (e) => ({ ...e, location: loc }))}
                />
              </td>

              {/* ➋  Slots + Typzelle */}
              {enc.slots.map((slot, idx) => {
                const isEditing = editing?.id === enc.id && editing.idx === idx
                const types = pokemonTypes(slot.name)

                return (
                  <>
                    {/* eigentlicher Slot */}
                    <td key={`slot-${idx}`} className="relative p-2 align-top text-center">
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
                           <img
                             src={sprite(slot.name)}
                             alt={slot.name}
                             className={`h-24 mx-auto ${enc.status === 'Tod' ? 'grayscale' : ''}`}
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
                    <td key={`type-${idx}`} className="p-2 text-sm text-center">
                      {types.map(t => <TypeIcon key={t} type={t} className={enc.status === 'Tod' ? 'grayscale' : ''} />)
                      }
                    </td>
                  </>
                )
              })}

              {/* Status */}
              <td className="p-2 w-32">
                <select
                  value={enc.status}
                  onChange={(e) =>
                    patch(enc.id, (o) => ({ ...o, status: e.target.value as Status }))
                  }
                  className={`w-full font-bold text-white rounded ${statusClasses[enc.status]}`}
                >
                  <option value="Team">Team</option>
                  <option value="Box">Box</option>
                  <option value="Tod">Tod</option>
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
        </tbody>
      </table>

      {/* + Reihe Button */}
      <div className="mt-3 text-right">
        <button
          onClick={addRow}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          + Reihe
        </button>
      </div>
    </>
  )
}
