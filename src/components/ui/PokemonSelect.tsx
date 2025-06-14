import { useState } from 'react'
import { Combobox } from '@headlessui/react'
import pokedex from '@/data/pokemon.json'  // <— JSON enthält de / en
import { sprite } from '@/utils/sprites'
import type { DexEntry } from '@/types/pokemon'

export default function PokemonSelect({
  onSelect
}: {
  onSelect: (germanName: string) => void   // wir geben den DE-Namen zurück
}) {
  // Tipp: dem Import den Typ aufzwingen, sonst ist es 'any'
  const pokemon: DexEntry[] = pokedex as unknown as DexEntry[]

  const [query, setQuery] = useState('')

  const filtered =
    query === ''
      ? pokemon
      : pokemon.filter(p =>
          [p.de, p.en].some(name =>
            name.toLowerCase().includes(query.toLowerCase())
          )
        )

  return (
    <Combobox value="" onChange={onSelect}>
      <div className="relative">
        <Combobox.Input
          className="border p-1 w-full"
          placeholder="Pokémon wählen..."
          onChange={e => setQuery(e.target.value)}
        />
        <Combobox.Options className="absolute bg-gray-800 w-full max-h-60 overflow-auto z-10">
          {filtered.map(p => (
            <Combobox.Option key={p.id} value={p.de}>
              <div className="flex items-center gap-2">
                <img src={sprite(p.de)} className="h-6" alt={p.de} />
                <span>{p.de}</span>
                <span className="opacity-60 text-xs">({p.en})</span>
              </div>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  )
}
