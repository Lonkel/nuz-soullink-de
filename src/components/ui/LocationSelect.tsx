import { useState } from 'react'
import { Combobox } from '@headlessui/react'
import raw from '@/data/locations.json'

/* 1) Datensatz-Typ angeben, damit TS weiß, was drinsteckt */
interface LocationEntry {
  Region: string
  Ort: string
}

/* 2) JSON typisieren + gleich in einen anzeigbaren String umwandeln */
const locations: string[] = (raw as LocationEntry[]).map(
  (l) => `${l.Region} – ${l.Ort}`
)

export default function LocationSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [query, setQuery] = useState('')

  const filtered =
    query === ''
      ? locations
      : locations.filter((loc) =>
          loc.toLowerCase().includes(query.toLowerCase())
        )

  return (
    <Combobox value={value} onChange={onChange}>
      <div className="relative">
        <Combobox.Input
          className="border p-1 w-full"
          onChange={(e) => setQuery(e.target.value)}
        />
        <Combobox.Options className="absolute bg-gray-800 w-full max-h-60 overflow-auto z-10">
          {filtered.map((loc) => (
            /* 3) key & value sind jetzt garantiert Strings */
            <Combobox.Option key={loc} value={loc}>
              {loc}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  )
}
