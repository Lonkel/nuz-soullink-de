// ───────────────────────────────────────────────
// src/pages/run/_layout.tsx   (komplett ersetzen)
// ───────────────────────────────────────────────
import { Tab } from '@headlessui/react'

import EncountersTab from '@/components/encounters/EncountersTab'
import TeamTab       from '@/components/team/TeamsTab'
import BoxTab        from '@/components/box/BoxTab'
import GraveTab      from '@/components/graveyard/GraveTab'
import PokemonHeader from '@/components/ui/PokemonHeader'
import { useRun }    from '@/context/RunContext'

const tabs = ['Begegnungen', 'Team', 'Box', 'Friedhof'] as const

/* Kürzel → Klartext */
const GAME_NAME: Record<string, string> = {
  RB: 'Rot / Blau',
  G: 'Gelb',
  GSK: 'Gold / Silber / Kristall',
  HGSS: 'HeartGold / SoulSilver',
  RSE: 'Rubin / Saphir / Smaragd',
  ORAS: 'Omega Rubin / Alpha Saphir',
  DPPT: 'Diamant / Perl / Platin',
  BDSP: 'Brillant-Diamant / Leucht-Perl',
  XY: 'X / Y',
  SMUSUM: 'Sonne / Mond / Ultra',
}

export default function Layout() {
  const { game } = useRun()
  const fullTitle = GAME_NAME[game] ?? game ?? '?'

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="sticky top-0 z-40 bg-gray-900
               px-4 py-4 text-2xl font-bold text-white">
        Soullink&nbsp;–&nbsp;Pokémon&nbsp;{fullTitle}
      </h1>

        {/* ── Neues Pokémon-Panel ── */}
        <PokemonHeader />

        <Tab.Group>
         {/* klebt direkt unter der Überschrift (4 rem = 64 px) */}
          <Tab.List
            className="sticky top-[4rem] z-30
                       bg-gray-900 flex gap-2
                       border-b border-gray-700 px-4 pb-2">
            {tabs.map(t => (
              <Tab
                key={t}
                className={({ selected }) =>
                  [
                    'px-4 py-2 rounded-t focus:outline-none transition-colors',
                    selected
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-white hover:bg-gray-600',
                  ].join(' ')
                }
              >
                {t}
              </Tab>
            ))}
          </Tab.List>
    
          {/* Inhalt scrollt unter Header + Tabs hindurch */}
          <Tab.Panels
            /* 100 vh minus 4 rem Header minus 2.75 rem Tabs ≈ 7 rem */
            className="h-[calc(100vh-7rem)] overflow-y-auto px-4 pt-4"
          >
            <Tab.Panel><EncountersTab /></Tab.Panel>
            <Tab.Panel><TeamTab /></Tab.Panel>
            <Tab.Panel><BoxTab /></Tab.Panel>
            <Tab.Panel><GraveTab /></Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
    </main>
  )
}
