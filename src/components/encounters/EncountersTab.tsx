import React, { Fragment, useState } from 'react'
import { Pencil, MinusCircle } from 'lucide-react'
import { v4 as uuid } from 'uuid'
import TypeIcon from '@/components/ui/TypeIcon'

import { useRun, Status }  from '@/context/RunContext'
import type { Encounter }  from '@/context/RunContext'
import PokemonSelect       from '@/components/ui/PokemonSelect'
import LocationSelect      from '@/components/ui/LocationSelect'
import { sprite }          from '@/utils/sprites'
import { pokemonTypes }    from '@/utils/pokemonTypes'
import TypeGrid            from '@/components/TypeGrid'
import { getAllEvolutions, getDexNumber } from '@/utils/evolution'

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
    setEncounters((prev) => prev.filter((e) => e.id !== id))

  /* ─── Begegnungs-Tabelle ─── */
  const encounterTable = (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-700 text-white">
          <th className="p-2">Herkunft</th>
          {trainers.map((t) => (
            <Fragment key={t}>
              <th className="p-2">{t}</th>
              <th className="p-2 w-20" /> {/* leer für Typ-Icon */}
            </Fragment>
          ))}
          <th className="p-2 w-32">Status</th>
          <th className="p-2 w-12" /> {/* Trash-Icon */}
        </tr>
      </thead>
      <tbody>
        {encounters.map((enc) => (
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
                onChange={(loc) => patch(enc.id, (e) => ({ ...e, location: loc }))}
              />
            </td>

            {/* Slots + Typ-Icons */}
            {enc.slots.map((slot, idx) => {
              const isEditing = editing?.id === enc.id && editing.idx === idx
              const types = pokemonTypes(slot.name)

              return (
                <Fragment key={idx}>
                  {/* Slot-Zelle */}
                  <td className="relative p-2 align-top text-center">
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
                    {!slot.name && !isEditing && (
                      <button
                        onClick={() => setEditing({ id: enc.id, idx })}
                        className="mx-auto flex h-10 w-10 items-center justify-center
                                   rounded-full bg-gray-700 text-white hover:bg-gray-600"
                      >
                        +
                      </button>
                    )}
                    {slot.name && !isEditing && (
                      <button
                        onClick={() => setEditing({ id: enc.id, idx })}
                        className="group mx-auto relative h-12"
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
                  </td>

                  {/* Typ-Icon-Zelle */}
                  <td className="p-2 text-sm text-center">
                    {types.map((t) => (
                      <TypeIcon
                        key={t}
                        type={t}
                        className={enc.status === 'Tod' ? 'grayscale' : ''}
                      />
                    ))}
                  </td>
                </Fragment>
              )
            })}

            {/* Status */}
            <td className="p-2 w-32">
              <select
                value={enc.status}
                onChange={(e) =>
                  patch(enc.id, (o) => ({
                    ...o,
                    status: e.target.value as Status,
                  }))
                }
                className={`w-full font-bold text-white rounded ${
                  statusClasses[enc.status]
                }`}
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
  )

  /* ─── + Reihe Button ─── */
  const addButton = (
    <div className="mt-3 text-right">
      <button
        onClick={addRow}
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        + Reihe
      </button>
    </div>
  )

  /* ─── Begegnete Pokémon + Entwicklungen ─── */
  const seen = new Set<string>()
  encounters.forEach((enc) =>
    enc.slots.forEach((slot) => slot.name && seen.add(slot.name))
  )

  const expanded = Array.from(seen)
    .flatMap((name) => getAllEvolutions(name))
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .sort((a, b) => getDexNumber(a) - getDexNumber(b))

  const evolutionSection = (
    <div className="mt-8 border-t border-white/30 pt-4">
      <h2 className="text-xl font-bold text-white mb-3">
        Bereits begegnete Pokémon & ihre Entwicklungen
      </h2>
      <div className="grid grid-cols-6 gap-4">
        {expanded.map((name) => (
          <div key={name} className="flex flex-col items-center">
            <img src={sprite(name)} alt={name} className="h-16" />
            <TypeGrid types={pokemonTypes(name)} />
            <span className="mt-1 text-white text-sm">{name}</span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <>
      {encounterTable}
      {addButton}
      {evolutionSection}
    </>
  )
}
