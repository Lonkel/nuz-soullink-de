import pokedex from '@/data/pokemon.json'
import { TYPE_CHART } from '@/data/typeChart'

interface DexEntry {
  de: string          // Deutscher Pokémon-Name
  types: string[]     // Deutsche Typen, z. B. ["Wasser", "Boden"]
}

/*  Map: "bisasam" → ["Pflanze", "Gift"]  */
const TYPE_MAP: Record<string, string[]> = Object.fromEntries(
  (pokedex as DexEntry[]).map(p => [p.de.toLowerCase(), p.types]),
)

/**
 * Gibt die Typen eines Pokémon zurück.
 */
export const pokemonTypes = (germanName: string): string[] =>
  TYPE_MAP[germanName.toLowerCase()] ?? []

/**
 * Berechnet die Schadensmultiplikatoren für ein Pokémon basierend auf seinen Typen.
 */
export const damageMultipliers = (germanName: string) => {
  const types = pokemonTypes(germanName)  // Holt die Typen aus der Map
  const multipliers: Record<string, string[]> = {
    "x4": [], "x2": [], "x0.5": [], "x0.25": [], "x0": [],
  }

  for (const attackType of Object.keys(TYPE_CHART)) {
    const m1 = TYPE_CHART[attackType]?.[types[0].toLowerCase()] ?? 1
    const m2 = types[1] ? TYPE_CHART[attackType]?.[types[1].toLowerCase()] ?? 1 : 1
    const multiplier = m1 * m2

    if (multiplier === 4) multipliers["x4"].push(attackType)
    else if (multiplier === 2) multipliers["x2"].push(attackType)
    else if (multiplier === 0.5) multipliers["x0.5"].push(attackType)
    else if (multiplier === 0.25) multipliers["x0.25"].push(attackType)
    else if (multiplier === 0) multipliers["x0"].push(attackType)
  }

  return multipliers
}
