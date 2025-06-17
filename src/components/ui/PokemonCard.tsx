import TypeGrid from '@/components/TypeGrid'
import { sprite } from '@/utils/sprites'
import { pokemonTypes, damageMultipliers } from '@/utils/pokemonTypes'

export default function PokemonCard({ name }: { name: string }) {
  const types = pokemonTypes(name)
  const multipliers = damageMultipliers(name)

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg flex flex-col items-center w-60">
      {/* Pokémon-Sprite */}
      <img src={sprite(name)} alt={name} className="h-16" />

      {/* Typen */}
      <TypeGrid types={types} />

      {/* Schadensmultiplikatoren */}
      <div className="mt-2 text-sm text-white text-center space-y-1">
        <p className="text-green-400">x4: {multipliers.x4?.join(', ') || '–'}</p>
        <p className="text-green-300">x2: {multipliers.x2?.join(', ') || '–'}</p>
        <p className="text-red-300">x0.5: {multipliers.x0_5?.join(', ') || '–'}</p>
        <p className="text-red-400">x0.25: {multipliers.x0_25?.join(', ') || '–'}</p>
        <p className="text-gray-500">x0: {multipliers.x0?.join(', ') || '–'}</p>
      </div>
    </div>
  )
}
