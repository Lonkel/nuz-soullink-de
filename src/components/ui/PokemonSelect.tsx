import { useEffect, useRef, useState } from 'react'
import { Combobox } from '@headlessui/react'
import pokedex from '@/data/pokemon.json'  // <— JSON enthält de / en
import { sprite } from '@/utils/sprites'
import type { DexEntry } from '@/types/pokemon'

export interface PokemonSelectProps {
  onSelect: (germanName: string) => void
  onCancel?: () => void          // ← optionaler Callback
  names?: string[]
}


const defaultNames = [
  'Bisasam',
  'Bisaknosp',
  'Bisaflor',
  'Glumanda',
  'Glutexo',
  'Glurak',
  'Schiggy',
  'Schillok',
  'Turtok',
]

export default function PokemonSelect({
  onSelect,
  onCancel,
  names = defaultNames,
}: PokemonSelectProps) {
  const [query, setQuery] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)

  /* ─ Click-Outside → Cancel ─ */
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) onCancel?.()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [onCancel])

  const filtered = names.filter((n) =>
    n.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div
      ref={wrapperRef}
      className="absolute z-50 w-56 max-h-80 overflow-auto rounded bg-gray-800 p-3 text-white shadow-lg"
    >
      {/* Suchfeld + Cancel */}
      <div className="mb-2 flex gap-2">
        <input
          autoFocus
          placeholder="Pokémon suchen…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
      {filtered.length === 0 && (
        <p className="text-sm text-gray-400">Kein Treffer</p>
      )}

      <ul>
        {filtered.map((name) => (
          <li key={name}>
            <button
              onClick={() => onSelect(name)}
              className="w-full rounded px-2 py-1 text-left hover:bg-blue-600"
            >
              {name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}