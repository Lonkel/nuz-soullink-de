import { useState } from 'react'
import PokemonCard from '@/components/ui/PokemonCard'
import pokemonData from '@/data/pokemon.json'

const pokemonList = pokemonData.map(p => p.de)

export default function TrainerPokemonSelect({ trainer }: { trainer: string }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filteredList = pokemonList.filter(poke =>
    poke.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="flex flex-col items-center mb-4">
      <span className="text-white font-bold text-lg mb-2">{trainer}</span>

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
      {selected && <PokemonCard name={selected} />}
    </div>
  )
}
