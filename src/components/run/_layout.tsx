import { Tab } from '@headlessui/react'
import EncountersTab from '@/components/encounters/EncountersTab'
import FilteredTab   from '@/components/team/TeamTab'
import { useRun }    from '@/context/RunContext'

const tabs = ['Begegnungen', 'Team', 'Box', 'Friedhof'] as const

export default function Layout() {
  const { game } = useRun()

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">
        Soullink&nbsp;–&nbsp;Pokémon&nbsp;{game || '?'}
      </h1>

      <Tab.Group>
        {/* Tab-Leiste */}
        <Tab.List className="flex gap-2 border-b pb-2">
          {tabs.map(t => (
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

        {/* Panels */}
        <Tab.Panels className="pt-4">
          <Tab.Panel><EncountersTab /></Tab.Panel>
          <Tab.Panel><FilteredTab wanted="Team" /></Tab.Panel>
          <Tab.Panel><FilteredTab wanted="Box"  /></Tab.Panel>
          <Tab.Panel><FilteredTab wanted="Tod"  /></Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </main>
  )
}
