// ─────────────────────────────────────────────
// src/components/ui/PokemonSelect.tsx
// endgültig ESLint-sauber (keine unused-vars, kein any)
// ─────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react'
import pokedex from '@/data/pokemon.json'

/* 1 ▸ Interface passt zu deiner JSON */
interface DexEntry {
  id: number
  de: string
  en: string
  types: string[]
}

/* 2 ▸ getypte Konstante statt "as any" */
const POKEDEX: ReadonlyArray<DexEntry> = pokedex as DexEntry[]
const NAMES = POKEDEX.map((p) => p.de) // deutsches Feld "de"

export interface PokemonSelectProps {
  onSelect: (germanName: string) => void
  onCancel?: () => void
}

export default function PokemonSelect({ onSelect, onCancel }: PokemonSelectProps) {
  const [query, setQuery] = useState('')
  const boxRef = useRef<HTMLDivElement>(null)

  /* Outside-Click → Cancel */
  useEffect(() => {
    const h = (e: MouseEvent) =>
      !boxRef.current?.contains(e.target as Node) && onCancel?.()
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [onCancel])

  const filtered = NAMES.filter((n) =>
    n.toLowerCase().includes(query.toLowerCase()),
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
          onChange={(e) => setQuery(e.target.value)}
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

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400">Kein Treffer</p>
      ) : (
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
      )}
    </div>
  )
}
