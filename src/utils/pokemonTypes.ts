import pokedex from '@/data/pokemon.json'

interface DexEntry {
  de: string
  types: string[]
}

/* ➊  Map „bisasam“ → ['Pflanze', 'Gift'] */
const TYPE_MAP: Record<string, string[]> = Object.fromEntries(
  (pokedex as DexEntry[]).map((p) => [p.de.toLowerCase(), p.types]),
)

/* ➋  Helfer */
export const pokemonTypes = (germanName: string): string[] =>
  TYPE_MAP[germanName.toLowerCase()] ?? []
