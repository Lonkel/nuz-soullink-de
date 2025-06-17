import { useState } from 'react'
import TypeGrid from '@/components/TypeGrid'
import { sprite } from '@/utils/sprites'
import { pokemonTypes } from '@/utils/pokemonTypes'
import pokemonData from '@/data/pokemon.json'

const pokemonList = pokemonData.map(p => p.de)   // Dynamisch aus JSON-Datei

export default function PokemonHeader() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="absolute top-2 right-4 z-40 flex flex-col items-end">
      {/* ── "+ Button" ── */}
      <button
        onClick={() => setSelected(null)}
        className="h-8 w-8 bg-blue-600 text-white font-bold text-lg rounded-full"
      >
        +
      </button>

      {/* ── Auswahl-Feld ── */}
      {selected === null && (
        <div className="mt-2 bg-gray-900 p-2 rounded-lg shadow-lg">
          {pokemonList.map(poke => (
            <button
              key={poke}
              onClick={() => setSelected(poke)}
              className="block w-full text-left px-3 py-1 hover:bg-gray-700"
            >
              {poke}
            </button>
          ))}
        </div>
      )}

      {/* ── Pokémon-Anzeige ── */}
      {selected && (
        <div className="mt-2 flex flex-col items-center bg-gray-900 p-2 rounded-lg shadow-lg">
          <img src={sprite(selected)} alt={selected} className="h-14" />
          <TypeGrid types={pokemonTypes(selected)} />
        </div>
      )}
    </div>
  )
}
