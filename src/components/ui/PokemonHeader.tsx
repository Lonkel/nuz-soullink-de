import { useState } from 'react'
import TypeGrid from '@/components/TypeGrid'
import { sprite } from '@/utils/sprites'
import { pokemonTypes } from '@/utils/pokemonTypes'
import pokemonData from '@/data/pokemon.json'

const pokemonList = pokemonData.map(p => p.de)   // Dynamisch aus JSON-Datei

export default function PokemonHeader() {
  const [selected, setSelected] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filteredList = pokemonList.filter(poke =>
    poke.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="absolute top-2 right-4 z-40 flex flex-col items-end">
      {/* ── Suchfeld ── */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Pokémon suchen..."
        className="px-2 py-1 w-40 rounded bg-gray-800 text-white border border-gray-600"
      />

      {/* ── Dropdown-Liste ── */}
      {search && (
        <div className="mt-2 bg-gray-900 p-2 rounded-lg shadow-lg max-h-40 overflow-y-auto">
          {filteredList.map(poke => (
            <button
              key={poke}
              onClick={() => {
                setSelected(poke)
                setSearch('')
              }}
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
