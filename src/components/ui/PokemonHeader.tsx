import { useState } from 'react'
import TypeGrid from '@/components/TypeGrid'
import { sprite } from '@/utils/sprites'
import { pokemonTypes } from '@/utils/pokemonTypes'
import pokemonData from '@/data/pokemon.json'
import { useRun } from '@/context/RunContext'

const pokemonList = pokemonData.map(p => p.de)  // Deutsche Pokémon-Namen aus JSON

export default function PokemonHeader() {
  const { trainers } = useRun()  // Anzahl der Trainer im aktuellen Run
  const [selected, setSelected] = useState<Record<string, string | null>>(
    Object.fromEntries(trainers.map(t => [t, null])),
  )
  const [search, setSearch] = useState<Record<string, string>>(
    Object.fromEntries(trainers.map(t => [t, ''])),
  )

  return (
    <div className="absolute top-2 right-4 z-40 flex flex-col gap-4">
      {trainers.map(trainer => {
        const filteredList = pokemonList.filter(poke =>
          poke.toLowerCase().includes(search[trainer].toLowerCase()),
        )

        return (
          <div key={trainer} className="flex flex-col items-end">
            {/* Trainer-Label */}
            <span className="text-white font-bold">{trainer}</span>

            {/* ── Suchfeld ── */}
            <input
              type="text"
              value={search[trainer]}
              onChange={(e) =>
                setSearch(prev => ({ ...prev, [trainer]: e.target.value }))
              }
              placeholder="Pokémon suchen..."
              className="px-2 py-1 w-40 rounded bg-gray-800 text-white border border-gray-600"
            />

            {/* ── Dropdown-Liste ── */}
            {search[trainer] && (
              <div className="mt-2 bg-gray-900 p-2 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                {filteredList.map(poke => (
                  <button
                    key={poke}
                    onClick={() => {
                      setSelected(prev => ({ ...prev, [trainer]: poke }))
                      setSearch(prev => ({ ...prev, [trainer]: '' }))
                    }}
                    className="block w-full text-left px-3 py-1 hover:bg-gray-700"
                  >
                    {poke}
                  </button>
                ))}
              </div>
            )}

            {/* ── Pokémon-Anzeige ── */}
            {selected[trainer] && (
              <div className="mt-2 flex flex-col items-center bg-gray-900 p-2 rounded-lg shadow-lg">
                <img src={sprite(selected[trainer]!)} alt={selected[trainer]!} className="h-14" />
                <TypeGrid types={pokemonTypes(selected[trainer]!)} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
