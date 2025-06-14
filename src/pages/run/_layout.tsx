// src/pages/run/_layout.tsx
import { Tab } from '@headlessui/react'
import EncountersTab from '@/components/encounters/EncountersTab'
import FilteredTab   from '@/components/team/FilteredTab'

const tabs = ['Begegnungen', 'Team', 'Box', 'Friedhof'] as const

export default function Layout() {
  return (
    <main className="max-w-5xl mx-auto p-6">
      <Tab.Group>
        <Tab.List className="flex gap-2 border-b pb-2">
          {tabs.map(t => (
            <Tab key={t} className={({ selected }) =>
              [
                  'px-4 py-2 rounded-t focus:outline-none',
                  selected
                    ? 'bg-blue-600 text-white'          // aktiver Tab
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                ].join(' ')
            }>
              {t}
            </Tab>
          ))}
        </Tab.List>

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
