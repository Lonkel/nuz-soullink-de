// ──────────────────────────────────────────────────────────────
// src/pages/run/[runId].tsx
//  • Kein Hard-Coding von Spiel oder Trainern mehr
//  • Kleiner “Setup-Header”, in dem du Game & Trainer:innen anpasst
//  • Darunter dein vorhandenes Tab-Layout (<Layout/>)
// ──────────────────────────────────────────────────────────────
import { useState } from 'react'
import Layout from 'src/components/run/_layout'

import {
  RunContext,
  type Encounter,         // nur für useState-Typen
} from '@/context/RunContext'

export default function RunPage() {
  /* ───────── Basis-States ───────── */
  const [game, setGame]                     = useState('')               // leer = noch nicht gewählt
  const [trainers, setTrainers]             = useState<string[]>([''])   // mind. 1 Feld
  const [encounters, setEncounters]         = useState<Encounter[]>([])
  const [team, setTeam]                     = useState<Encounter[]>([])

  /* ───────── Helper für Trainer-Liste ───────── */
  const addTrainer       = () => setTrainers((t) => [...t, ''])
  const updateTrainer    = (i: number, name: string) =>
    setTrainers((t) => {
      const copy = [...t]
      copy[i] = name
      return copy
    })
  const removeTrainer    = (i: number) =>
    setTrainers((t) => t.filter((_, idx) => idx !== i))

  /* ───────── UI ───────── */
  return (
    <RunContext.Provider
      value={{ game, trainers, encounters, setEncounters, team, setTeam }}
    >
      {/* Setup-Header */}
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <section className="rounded bg-gray-800 p-4 space-y-4 text-white">
          <h2 className="text-lg font-bold">Run-Info</h2>

          {/* Spiel wählen */}
          <div className="flex items-center gap-3">
            <label className="w-20">Spiel:</label>
            <select
              value={game}
              onChange={(e) => setGame(e.target.value)}
              className="flex-1 rounded bg-gray-700 p-2 outline-none"
            >
              <option value="">– wählen –</option>
              <option value="RB">Rot / Blau</option>
              <option value="G">Gelb</option>
              <option value="GSK">Gold / Silber / Kristall</option>
              <option value="HGSS">HeartGold / SoulSilver</option>
              <option value="RSE">Rubin / Saphir / Smaragd</option>
              <option value="ORAS">Omega Rubin / Alpha Saphir</option>
              <option value="DPPT">Diamant / Perl / Platin</option>
              <option value="BDSP">BrillantDiamant / LeuchtPerl</option>
              <option value="XY">X / Y</option>
              <option value="SMUSUM">Sonne / Mond / Ultra</option>
            </select>
          </div>

          {/* Trainer:innen verwalten */}
          <div className="space-y-2">
            <div className="font-semibold">Trainer:innen:</div>

            {trainers.map((name, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={name}
                  onChange={(e) => updateTrainer(idx, e.target.value)}
                  placeholder={`Trainer ${idx + 1}`}
                  className="flex-1 rounded bg-gray-700 p-2 outline-none"
                />
                {trainers.length > 1 && (
                  <button
                    onClick={() => removeTrainer(idx)}
                    className="rounded bg-red-600 px-3 text-white hover:bg-red-700"
                    aria-label="Trainer entfernen"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addTrainer}
              className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
            >
              + Trainer
            </button>
          </div>
        </section>

        {/* Tabs & Tabellen */}
        <Layout />
      </div>
    </RunContext.Provider>
  )
}
