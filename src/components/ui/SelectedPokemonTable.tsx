import TypeGrid              from '@/components/TypeGrid'
import { sprite }             from '@/utils/sprites'
import { pokemonTypes }       from '@/utils/pokemonTypes'
import { damageMultipliers }  from '@/utils/pokemonTypes'

const bucketKeys = ['x4', 'x2', 'x0.5', 'x0.25', 'x0'] as const
type BucketKey = typeof bucketKeys[number]

export default function SelectedPokemonTable({
  name,
  onDelete,
}: {
  name: string
  onDelete: () => void
}) {
  const types    = pokemonTypes(name)
  const buckets  = damageMultipliers(name) as Record<BucketKey, string[]>

  return (
    <table className="mt-2 table-fixed border-collapse border-2 border-white/20 text-sm">
      <colgroup>
        <col className="w-20" />
        <col className="w-24" />
        {bucketKeys.map(k => (
          <col key={k} className="w-24" />
        ))}
        <col className="w-12" />
      </colgroup>

      <tbody>
        <tr className="divide-x divide-white/20">
          {/* Sprite */}
          <td className="p-2">
            <img src={sprite(name)} alt={name} className="h-16" />
          </td>

          {/* Typen */}
          <td className="p-2">
            <TypeGrid types={types} />
          </td>

          {/* x4 … x0 */}
          {bucketKeys.map(k => (
            <td key={k} className="p-2">
              <TypeGrid types={buckets[k]} />
            </td>
          ))}

          {/* Löschen-Button */}
          <td className="p-2 text-center">
            <button
              onClick={onDelete}
              className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              title="Pokémon entfernen"
            >
              ✕
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
