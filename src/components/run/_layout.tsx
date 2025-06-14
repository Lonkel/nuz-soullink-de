// ───────────────────────────────────────────────
// src/pages/run/_layout.tsx   (komplett ersetzen)
// ───────────────────────────────────────────────
import { Tab } from '@headlessui/react'

import EncountersTab from '@/components/encounters/EncountersTab'
import TeamTab       from '@/components/team/TeamTab'
import BoxTab        from '@/components/box/BoxTab'
import GraveTab      from '@/components/graveyard/GraveTab'

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
      <h1 className="mb-6 text-2xl font-bold text-white">
        Soullink&nbsp;–&nbsp;Pokémon&nbsp;{fullTitle}
      </h1>

      <Tab.Group>
        <Tab.List className="flex gap-2 border-b pb-2">
          {tabs.map((t) => (
            <Tab
              key={t}
              className={({ selected }) =>
                [
                  'px-4 py-2 rounded-t focus:outline-none',
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

        <Tab.Panels className="pt-4">
          <Tab.Panel>
            <EncountersTab />
          </Tab.Panel>
          <Tab.Panel>
            <TeamTab />
          </Tab.Panel>
          <Tab.Panel>
            <BoxTab />
          </Tab.Panel>
          <Tab.Panel>
            <GraveTab />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </main>
  )
}
