// src/utils/evolution.ts
import pokedex from '@/data/pokemon.json'

/**
 * Entspricht der Struktur in deiner pokemon.json:
 * - id          → Nationaldex-Nummer
 * - de          → deutscher Name
 * - types       → Typen
 * - evolutions? → optionale Liste der Weiterentwicklungen (falls nicht im JSON vorhanden: leer)
 */
interface DexEntry {
  id: number
  de: string
  types: string[]
  evolutions?: string[]
}

// 1) Map für Evolutionsstufen: "Schillok" → ["Schiggy","Turtok"]
const EVOLUTION_MAP: Record<string, string[]> = Object.fromEntries(
  (pokedex as DexEntry[]).map(p => [
    p.de,
    p.evolutions ?? [],        // falls evolutions fehlt, leeres Array
  ]),
)

// 2) Map für Pokédex-Nummer: "Schillok" → 007
const DEX_NR_MAP: Record<string, number> = Object.fromEntries(
  (pokedex as DexEntry[]).map(p => [p.de, p.id]),
)

/* Gibt Basisform + direkte Weiterentwicklungen zurück. */
export function getAllEvolutions(name: string): string[] {
  const evos = EVOLUTION_MAP[name] ?? []
  return [name, ...evos]
}

/* Liefert die Nationaldex-Nummer (für Sortierung). */
export function getDexNumber(name: string): number {
  return DEX_NR_MAP[name] ?? Number.MAX_SAFE_INTEGER
}
