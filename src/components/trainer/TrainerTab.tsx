// ───────────────────────────────────────────────────────────────
// TrainerTab  –  shows one trainer’s current team and,
//                for every single Pokémon, its damage chart
//                (x0 | x1/4 | x1/2 | x2 | x4).
// ───────────────────────────────────────────────────────────────
import { useMemo } from 'react'
import { useRun }   from '@/context/RunContext'
import { TYPE_CHART }   from '@/data/typeChart'
import { pokemonTypes } from '@/utils/pokemonTypes'
import TypeIcon         from '@/components/ui/TypeIcon'
import { sprite }       from '@/utils/sprites'

type Label = 'x0' | 'x1/4' | 'x1/2' | 'x2' | 'x4'
const labels: Label[] = ['x0', 'x1/4', 'x1/2', 'x2', 'x4']

/* ——————————————————————————————————————————————————————————— */
export default function TrainerTab({ trainer }: { trainer: string }) {
  const { encounters } = useRun()

  /* Pokémon, die aktuell bei diesem Trainer im Team sind */
  const team = useMemo(
    () =>
      encounters
        .filter(e => e.status === 'Team')
        .flatMap(e => e.slots)
        .filter(s => s.trainer === trainer && s.name)
        .map(s => s.name as string),
    [encounters, trainer],
  )

  /* Damage chart pro Pokémon (Map: pokémon → label → Typen[]) */
  const chart = useMemo(() => {
    const m: Record<string, Record<Label, string[]>> = {}
    team.forEach(poke => {
      const def = pokemonTypes(poke).map(t => t.toLowerCase())
      const bucket: Record<Label, string[]> = {
        'x0': [],
        'x1/4': [],
        'x1/2': [],
        'x2': [],
        'x4': [],
      }

      Object.keys(TYPE_CHART).forEach(att => {
        const m1 = TYPE_CHART[att]?.[def[0]] ?? 1
        const m2 = def[1] ? TYPE_CHART[att]?.[def[1]] ?? 1 : 1
        const mult = m1 * m2
        if (mult === 0) bucket['x0'].push(att)
        else if (mult === 0.25) bucket['x1/4'].push(att)
        else if (mult === 0.5) bucket['x1/2'].push(att)
        else if (mult === 2) bucket['x2'].push(att)
        else if (mult === 4) bucket['x4'].push(att)
      })

      m[poke] = bucket
    })
    return m
  }, [team])

  /* ────────────── R E N D E R ─────────────────────────────── */
  if (team.length === 0)
    return (
      <div className="text-gray-400 p-6">
        {trainer} hat aktuell keine Pokémon im Team.
      </div>
    )

  return (
    <table className="w-full text-sm table-fixed">
      <colgroup>
        <col className="w-32" /> {/* Pokémon */}
        {labels.map(lbl => (
          <col key={lbl} className="w-28" />
        ))}
      </colgroup>

      <thead>
        <tr className="bg-gray-700 text-white">
          <th className="p-2 text-left">Pokémon</th>
          {labels.map(l => (
            <th key={l} className="p-2">
              {l}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {team.map(poke => (
          <tr key={poke} className="border-t">
            {/* Pokémon-Sprite + Name */}
            <td className="p-2 flex items-center gap-2">
              <img src={sprite(poke)} alt={poke} className="h-12" />
              {poke}
            </td>

            {/* Damage cells */}
            {labels.map(l => (
              <td key={l} className="p-2 align-top">
                <div className="grid grid-cols-2 gap-1 justify-items-start">
                  {chart[poke][l].map(t => (
                    <TypeIcon key={t} type={t} />
                  ))}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
