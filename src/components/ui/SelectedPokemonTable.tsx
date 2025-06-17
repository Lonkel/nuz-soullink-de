import TypeGrid             from '@/components/TypeGrid'
import { sprite }            from '@/utils/sprites'
import { pokemonTypes }      from '@/utils/pokemonTypes'
import { damageMultipliers } from '@/utils/pokemonTypes'

/* exakte Spaltenreihenfolge wie in TeamsTab */
const bucketKeys = ['x4', 'x2', 'x0.5', 'x0.25', 'x0'] as const
type BucketKey = typeof bucketKeys[number]

export default function SelectedPokemonTable({
  name,
  onDelete,
}: {
  name: string
  onDelete: () => void
}) {
  const types   = pokemonTypes(name)
  const buckets = damageMultipliers(name) as Record<BucketKey, string[]>

  return (
    <table
      className="w-full text-sm table-fixed border-collapse
                 border-2 border-white/20"
    >
      {/* ‑- gleiche Breiten wie TeamsTab ‑- */}
      <colgroup>
        <col className="w-20" />  {/* Sprite */}
        <col className="w-16" />  {/* Partner-Sprite (leer) */}
        <col className="w-24" />  {/* Typen */}
        {bucketKeys.map(k => (
          <col key={k} className="w-28" />
        ))}
        <col className="w-24" />  {/* Löschen-Button */}
      </colgroup>

      <tbody>
        <tr className="divide-x divide-white/20">
          {/* Sprite */}
          <td className="p-2 flex justify-center">
            <img src={sprite(name)} alt={name} className="h-20" />
          </td>

          {/* Partner-Sprite-Spalte bleibt leer */}
          <td />

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
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
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
