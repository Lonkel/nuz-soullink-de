import { useState } from 'react'
import { useRouter } from 'next/router'
import { v4 as uuid } from 'uuid'

export default function StartPage() {
  const router = useRouter()

  /* Spiel & Trainer-States */
  const [game, setGame] = useState('')
  const [trainers, setTrainers] = useState<string[]>([''])

  /* Trainer-Helpers */
  const addTrainer = () => setTrainers(t => [...t, ''])
  const updateTrainer = (i: number, name: string) =>
    setTrainers(t => t.map((n, idx) => (idx === i ? name : n)))
  const removeTrainer = (i: number) =>
    setTrainers(t => t.filter((_, idx) => idx !== i))

  /* Start-Button */
  const startRun = () => {
    if (!game || trainers.some(n => n.trim() === '')) return
    const runId = uuid()
    router.push(
      `/run/${runId}?game=${encodeURIComponent(game)}&trainers=${encodeURIComponent(
        trainers.join('|'),
      )}`,
    )
  }

  const startDisabled = !game || trainers.some(n => n.trim() === '')

  return (
    <main className="mx-auto max-w-xl p-8 space-y-6 text-white">
      <h1 className="text-3xl font-bold">Neuer Soullink-Run</h1>

      {/* Spiel wählen */}
      <section className="space-y-2">
        <label className="block font-semibold">Spiel</label>
        <select
          value={game}
          onChange={e => setGame(e.target.value)}
          className="w-full rounded bg-gray-800 p-2"
        >
          <option value="">– auswählen –</option>
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
      </section>

      {/* Trainer:innen */}
      <section className="space-y-3">
        <div className="font-semibold">Trainer:innen</div>

        {trainers.map((name, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              value={name}
              onChange={e => updateTrainer(idx, e.target.value)}
              placeholder={`Trainer ${idx + 1}`}
              className="flex-1 rounded bg-gray-800 p-2"
            />
            {trainers.length > 1 && (
              <button
                onClick={() => removeTrainer(idx)}
                className="rounded bg-red-600 px-3 hover:bg-red-700"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addTrainer}
          className="rounded bg-blue-600 px-3 py-1 hover:bg-blue-700"
        >
          + Trainer
        </button>
      </section>

      {/* Start */}
      <button
        onClick={startRun}
        disabled={startDisabled}
        className={`w-full rounded px-4 py-2 text-lg font-bold ${
          startDisabled ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        Start
      </button>
    </main>
  )
}
