// ──────────────────────────────────────────────────────────────
// src/components/ui/PokemonSelect.tsx
// Verwendet deine echte `pokemon.json`. Keine Fallback-Liste, kein
// automatisches Öffnen aller Dropdowns. Props:
//
//   • onSelect (Pflicht) – wird mit deutschem Namen aufgerufen
//   • onCancel (optional) – schließt das Pop-over ohne Auswahl
// ──────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react'
import pokedex from '@/data/pokemon.json' // ← Pfad ggf. anpassen

/* ------- Typ für einen Eintrag deiner JSON (falls nötig) ------- */
interface DexEntry {
  id: number
  de: string
  en: string
  types: string[]
}

/* ------- Statisches Namens-Array aus der JSON bauen ----------- */
const NAMES: string[] = (pokedex as any[]).map((p) => p.de)

export interface PokemonSelectProps {
  onSelect: (germanName: string) => void
  onCancel?: () => void
}

export default function PokemonSelect({ onSelect, onCancel }: PokemonSelectProps) {
  const [query, setQuery] = useState('')
  const boxRef = useRef<HTMLDivElement>(null)

  /* Outside-Click → Popover schließen */
  useEffect(() => {
    const handle = (e: MouseEvent) =>
      !boxRef.current?.contains(e.target as Node) && onCancel?.()

    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
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
      {/* Suchfeld + Cancel-Button */}
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

      {/* Trefferliste */}
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
