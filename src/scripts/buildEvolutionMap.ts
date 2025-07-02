// scripts/buildEvolutionMap.ts
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import pokedex from '../src/data/pokemon.json'

/** Dein Dex-JSON hat diese Felder */
interface DexEntry {
  de: string   // deutscher Name
  en: string   // englischer Name
}

/** API-Antwort, wenn du die Chain-Liste lädst */
interface ChainList {
  results: { url: string }[]
}

/** Einzelne Evolutions-Kette von der PokeAPI */
interface EvolutionChain {
  chain: EvolutionNode
}

interface EvolutionNode {
  species: { name: string }      // englischer Name
  evolves_to: EvolutionNode[]    // nächste Stufe(n)
}

// 1) EN-→DE-Map aus deinem Dex-JSON bauen
const EN2DE: Record<string, string> = {}
;(pokedex as DexEntry[]).forEach(p => {
  EN2DE[p.en.toLowerCase()] = p.de
})

async function buildEvolutionMap() {
  // ────────────────
  // 2) Chain-URLs laden & typisieren
  // ────────────────
  const listRes   = await fetch('https://pokeapi.co/api/v2/evolution-chain?limit=10000')
  const listJson  = (await listRes.json()) as ChainList
  const chainUrls = listJson.results.map(r => r.url)

  const evoMap: Record<string, string[]> = {}

  // ────────────────
  // 3) Chain-Baum traversieren
  // ────────────────
  function traverse(node: EvolutionNode, chain: string[]) {
    const enName = node.species.name.toLowerCase()
    const deName = EN2DE[enName]
    if (!deName) return

    // komplette Kette bis hierhin
    const fullChain = [...chain, deName]

    // bidirektional verknüpfen
    fullChain.forEach(base => {
      evoMap[base] = Array.from(
        new Set([
          ...(evoMap[base] ?? []),
          ...fullChain.filter(x => x !== base),
        ])
      )
    })

    // nächster Schritt
    for (const nxt of node.evolves_to) {
      traverse(nxt, fullChain)
    }
  }

  // ─────────────────
  // 4) jede Chain-URL abarbeiten
  // ─────────────────
  for (const url of chainUrls) {
    try {
      const res  = await fetch(url)
      const json = (await res.json()) as EvolutionChain
      traverse(json.chain, [])
    } catch (err) {
      console.error(`⚠️ Fehler bei ${url}:`, err)
    }
  }

  // ───────────────────────────────────
  // 5) Ergebnis nach src/data/evolutionMap.json schreiben
  // ───────────────────────────────────
  const outPath = path.resolve(__dirname, '../src/data/evolutionMap.json')
  fs.writeFileSync(outPath, JSON.stringify(evoMap, null, 2), 'utf-8')
  console.log(`✅ evolutionMap.json geschrieben (${Object.keys(evoMap).length} Einträge)`)
}

buildEvolutionMap().catch(err => {
  console.error('Build fehlgeschlagen:', err)
  process.exit(1)
})
