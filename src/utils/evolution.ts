// src/utils/evolution.ts
import pokedex from '@/data/pokemon.json'
import rawEvoMap from '@/data/evolutionMap.json'

/** Dex-JSON-Eintrag (deutsch/englisch + ID) */
interface DexEntry {
  de: string
  id: number
}

/** Das ist dein fertiges Evolutions-Mapping */
const EVOLUTION_MAP: Record<string, string[]> =
  rawEvoMap as Record<string, string[]>

/** Pokédex-Nummern-Map für Sortierung */
const DEX_NR_MAP: Record<string, number> = Object.fromEntries(
  (pokedex as DexEntry[]).map(p => [p.de, p.id]),
)

/**
 * Gibt alle Formen einer Evolutions-Kette zurück:
 * Basis-Form + alle anderen Ketten-Mitglieder.
 */
export function getAllEvolutions(name: string): string[] {
  return [name, ...(EVOLUTION_MAP[name] ?? [])]
}

/**
 * Liefert die Nationaldex-Nummer (für Sortierung).
 */
export function getDexNumber(name: string): number {
  return DEX_NR_MAP[name] ?? Number.MAX_SAFE_INTEGER
}
