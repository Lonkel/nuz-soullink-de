import { useEffect, useRef, useState } from 'react'

export interface PokemonSelectProps {
  onSelect: (germanName: string) => void
  onCancel?: () => void
  names?: string[]
}

const fallback = [
  ''
]

export default function PokemonSelect({
  onSelect,
  onCancel,
  names = fallback
}: PokemonSelectProps) {
  const [q, setQ] = useState('')
  const box = useRef<HTMLDivElement>(null)

  /* Outside-click => cancel */
  useEffect(() => {
    const h = (e: MouseEvent) =>
      !box.current?.contains(e.target as Node) && onCancel?.()
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [onCancel])

  const list = names.filter(n => n.toLowerCase().includes(q.toLowerCase()))

  return (
    <div
      ref={box}
      className="absolute z-50 w-56 max-h-80 overflow-auto rounded bg-gray-800 p-3 text-white shadow-lg"
    >
      <div className="mb-2 flex gap-2">
        <input
          autoFocus
          value={q}
          onChange={e => setQ(e.target.value)}
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

      {list.length === 0 && (
        <p className="text-sm text-gray-400">Kein Treffer</p>
      )}

      <ul>
        {list.map(name => (
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
