#!/usr/bin/env node
// scripts/buildEvolutionMap.js

const fs    = require('fs')
const path  = require('path')
const fetch = require('node-fetch')
const pokedex = require('../data/pokemon.json')

// EN → DE Mapping aus deinem Dex-JSON
const EN2DE = {}
pokedex.forEach(entry => {
  EN2DE[entry.en.toLowerCase()] = entry.de
})

async function buildEvolutionMap() {
  // 1) Alle Evolution-Chain-URLs abrufen
  const listRes   = await fetch('https://pokeapi.co/api/v2/evolution-chain?limit=10000')
  const listJson  = await listRes.json()
  const chainUrls = listJson.results.map(r => r.url)

  const evoMap = {}

  // 2) Rekursive Traversierung jeder Chain
  function traverse(node, chain) {
    const enName = node.species.name.toLowerCase()
    const deName = EN2DE[enName]
    if (!deName) return

    const fullChain = [...chain, deName]
    fullChain.forEach(base => {
      evoMap[base] = Array.from(
        new Set([
          ...(evoMap[base] || []),
          ...fullChain.filter(x => x !== base)
        ])
      )
    })

    node.evolves_to.forEach(child => traverse(child, fullChain))
  }

  // 3) Alle Chains abarbeiten
  for (const url of chainUrls) {
    try {
      const res  = await fetch(url)
      const json = await res.json()
      traverse(json.chain, [])
    } catch (err) {
      console.warn('⚠️ Fehler bei', url, err)
    }
  }

  // 4) Ergebnis schreiben
  const outPath = path.resolve(__dirname, '../src/data/evolutionMap.json')
  fs.writeFileSync(outPath, JSON.stringify(evoMap, null, 2), 'utf-8')
  console.log(`✅ evolutionMap.json geschrieben mit ${Object.keys(evoMap).length} Einträgen`)
}

buildEvolutionMap().catch(err => {
  console.error('Build fehlgeschlagen:', err)
  process.exit(1)
})
