// src/pages/index.tsx – Startbildschirm
import { useState } from 'react'
import { useRouter } from 'next/router'
import { X } from 'lucide-react'
import { nanoid } from 'nanoid'

/* ──────────────────────────────────────────
   Pokémon-Spiele (kannst du jederzeit ergänzen)
──────────────────────────────────────────── */
const pokemonGames = [
  'Rot', 'Blau', 'Gelb',
  'Gold', 'Silber', 'Kristall',
  'Rubin', 'Saphir', 'Smaragd',
  'Feuerrot', 'Blattgrün',
  'Diamant', 'Perl', 'Platin',
  'HeartGold', 'SoulSilver',
  'Schwarz', 'Weiß',
  'Schwarz 2', 'Weiß 2',
  'X', 'Y',
  'Omega Rubin', 'Alpha Saphir',
  'Sonne', 'Mond',
  'Ultrasonne', 'Ultramond',
  'Schwert', 'Schild',
  'Strahlender Diamant', 'Leuchtende Perle',
  'Legenden Arceus',
  'Karmesin', 'Purpur'
]

/* ──────────────────────────────────────────
   React-Komponente
──────────────────────────────────────────── */
export default function StartPage() {
  const router = useRouter()

  const [trainers, setTrainers] = useState<string[]>([''])
  const [game,     setGame]     = useState('')

  /* ---------- Trainer-Felder bearbeiten ---------- */
  const updateTrainer = (i: number, value: string) => {
    const next = [...trainers]
    next[i] = value
    setTrainers(next)
  }

  const addTrainer    = () => setTrainers([...trainers, ''])
  const removeTrainer = (i: number) => {
    const next = [...trainers]
    next.splice(i, 1)
    setTrainers(next)
  }

  /* ---------- Run starten ---------- */
  const startRun = () => {
    const cleanedTrainers = trainers.map(t => t.trim()).filter(Boolean)

    if (cleanedTrainers.length === 0 || !game) {
      alert('Bitte mindestens einen Trainer eintragen und ein Spiel wählen.')
      return
    }

    // 1) Konfiguration serialisieren
    const encoded = encodeURIComponent(JSON.stringify({
      trainers: cleanedTrainers,
      game
    }))

    // 2) Eindeutige Run-ID erzeugen
    const runId = nanoid(6)              // z. B. "aB3k9Z"

    // 3) Im Browser persistieren (SSR-safe)
    if (typeof window !== 'undefined') {
      localStorage.setItem(runId, encoded)
    }

    // 4) Weiterleiten
    router.push(`/run/${runId}`)
  }

  /* ─────────────── Render ─────────────── */
  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Soullocke starten</h1>

      {/* Trainer-Liste */}
      <section className="space-y-2">
        <label className="block font-medium">Trainer:</label>

        {trainers.map((name, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              placeholder={`Trainer ${i + 1}`}
              className="flex-1 border p-2 rounded"
              value={name}
              onChange={e => updateTrainer(i, e.target.value)}
            />

            {trainers.length > 1 && (
              <button
                aria-label="Entfernen"
                onClick={() => removeTrainer(i)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>
            )}
          </div>
        ))}

        <button onClick={addTrainer}
                className="text-sm text-blue-600 hover:underline">
          + Trainer hinzufügen
        </button>
      </section>

      {/* Spielauswahl */}
      <section>
        <label className="block font-medium mb-1">Pokémon-Spiel wählen:</label>
        <select
          value={game}
          onChange={e => setGame(e.target.value)}
          className="w-full border p-2 rounded bg-gray-800 text-white"
        >
          <option value="">-- Spiel auswählen --</option>
          {pokemonGames.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </section>

      {/* Start-Button */}
      <button
        onClick={startRun}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Start
      </button>
    </main>
  )
}
