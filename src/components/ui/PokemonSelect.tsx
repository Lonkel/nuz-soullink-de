// src/components/ui/PokemonSelect.tsx
import { useEffect, useRef, useState } from 'react'

export interface PokemonSelectProps {
  onSelect: (germanName: string) => void
  onCancel?: () => void
  names?: string[]
}

/* kleine Fallback-Liste, falls nichts via props kommt */
const defaultNames = [
  'Bisasam', 'Bisaknosp', 'Bisaflor',
  'Glumanda', 'Glutexo', 'Glurak',
  'Schiggy', 'Schillok', 'Turtok'
]

export default function PokemonSelect({
  onSelect,
  onCancel,
  names = defaultNames
}: PokemonSelectProps) {
  const [query, setQuery] = useState('')
  const boxRef = useRef<HTMLDivElement>(null)

  /* Outside-Click → onCancel */
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) onCancel?.()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [onCancel])

  const matches = names.filter(n =>
    n.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div
      ref={boxRef}
      className="absolute z-50 w-56 max-h-80 overflow-auto rounded
                 bg-gray-800 p-3 text-white shadow-lg"
    >
      {/* Suchfeld + Cancel */}
      <div className="mb-2 flex gap-2">
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Pokémon suchen…"
          className="flex-1 rounded bg-gray-700 px-2 py-1 text-sm outline-none"
        />
        {onCancel && (
          <button
            onClick={onCancel}
            aria-label="Abbrechen"
            className="px-2 text-gray-400 hover:text-gray-200"
          >
            ✕
          </button>
        )}
      </div>

      {/* Trefferliste */}
      {matches.length === 0 && (
        <p className="text-sm text-gray-400">Kein Treffer</p>
      )}

      <ul>
        {matches.map(name => (
          <li key={name}>
            <button
              onClick={() => onSelect(name)}
              className="w-full rounded px-2 py-1 text-left
                         hover:bg-blue-600"
            >
              {name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
