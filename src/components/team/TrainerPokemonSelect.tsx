import { useState }              from 'react'
import SelectedPokemonTable      from '@/components/ui/SelectedPokemonTable'
import pokemonData               from '@/data/pokemon.json'

/* Alle deutschen Namen aus der Pokédex-JSON */
const pokemonList = (pokemonData as { de: string }[]).map(p => p.de)

export default function TrainerPokemonSelect({ trainer }: { trainer: string }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [search,   setSearch]   = useState('')

  const filtered = pokemonList.filter(n =>
    n.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="flex flex-col items-center mb-6">
      <span className="mb-1 text-white font-bold">{trainer}</span>

      {/* ── Suchfeld & Dropdown (nur sichtbar, wenn kein Pokémon gewählt) ── */}
      {!selected && (
        <>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Pokémon suchen…"
            className="w-44 px-2 py-1 rounded bg-gray-800 text-white border border-gray-600"
          />

          {search && (
            <div className="mt-2 w-44 max-h-40 overflow-y-auto rounded-lg bg-gray-900 p-2 shadow-lg">
              {filtered.map(name => (
                <button
                  key={name}
                  onClick={() => {
                    setSelected(name)
                    setSearch('')
                  }}
                  className="block w-full px-3 py-1 text-left hover:bg-gray-700"
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Gewähltes Pokémon als Tabellen-Row ── */}
      {selected && (
        <SelectedPokemonTable
          name={selected}
          onDelete={() => setSelected(null)}
        />
      )}
    </div>
  )
}
