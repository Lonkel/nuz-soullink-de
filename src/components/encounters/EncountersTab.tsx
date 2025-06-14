import { useRun, Status } from '@/context/RunContext'
import LocationSelect from '@/components/ui/LocationSelect'
import PokemonSelect  from '@/components/ui/PokemonSelect'
import { sprite } from '@/utils/sprites'
import { v4 as uuid } from 'uuid'
import type { Encounter } from '@/context/RunContext'   // oder eigenen Typ

const statusClasses = { Team:'bg-green-600', Box:'bg-yellow-500', Tod:'bg-red-600' }

export default function EncountersTab() {
  const { trainers, encounters, setEncounters } = useRun()

  const addEncounter = () =>
   setEncounters((e) => [
     ...e,
     {
       id: uuid(),
       location: '',
       slots: trainers.map((t) => ({ trainer: t, name: '' })),
       status: 'Box' as const
     } satisfies Encounter
   ])

  const patch = (id: string, fn: (e: Encounter) => Encounter) =>
    setEncounters(prev => prev.map(e => e.id===id ? fn(e) : e))

  return (
    <>
      
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="p-2">Herkunft</th>
            {trainers.map(t => <th key={t} className="p-2">{t}</th>)}
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {encounters.map(enc => (
            <tr key={enc.id} className="border-t h-24">
              {/* Herkunft */}
              <td className="relative p-2">
                <LocationSelect
                  value={enc.location}
                  onChange={loc => patch(enc.id, e=>({ ...e, location: loc }))}
                />
              </td>

              {/* Pokémon pro Trainer */}
              {enc.slots.map((slot, idx) => (
                <td key={idx} className="relative p-2">
                  {!slot.name && enc.location && (
                    <PokemonSelect onSelect={poke =>
                      patch(enc.id, e=>{
                        const s=[...e.slots]; s[idx]={...slot,name:poke}
                        return {...e, slots:s}
                      })}
                    />
                  )}
                  {slot.name && (
                    <img src={sprite(slot.name)} alt={slot.name}
                         className="h-12 mx-auto" />
                  )}
                </td>
              ))}

              {/* Status */}
              <td className="p-2 w-32">
                <select
                  value={enc.status}
                  onChange={e =>
                    patch(enc.id, old=>({ ...old, status:e.target.value as Status }))
                  }
                  className={`w-full text-white rounded ${statusClasses[enc.status]}`}
                >
                  <option value="Team">Team</option>
                  <option value="Box">Box</option>
                  <option value="Tod">Tod</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 text-right">
        <button
          onClick={addEncounter}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          + 
        </button>
      </div>
    </>
  )
}
