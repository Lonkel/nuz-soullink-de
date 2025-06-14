import { useRun, Status } from '@/context/RunContext'

export default function FilteredTab({ wanted }:{ wanted: Status }) {
  const { trainers, encounters } = useRun()
  const rows = encounters.filter(e => e.status === wanted)

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-700 text-white">
          <th className="p-2">Herkunft</th>
          {trainers.map(t => <th key={t} className="p-2">{t}</th>)}
          {wanted === 'Tod' && <th className="p-2">Mörder</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map(enc => (
          <tr key={enc.id} className="border-t">
            <td className="p-1">{enc.location}</td>
            {enc.slots.map((s, i) => (
              <td key={i} className="p-1">{s.name}</td>
            ))}
            {wanted === 'Tod' && (
              <td className="p-1">{enc.killer ?? '–'}</td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
