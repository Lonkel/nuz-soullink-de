/* ordnet beliebige Typ‐Icons in zwei Spalten */
import TypeIcon from '@/components/ui/TypeIcon'

interface Props {
  types: string[]          // z. B. ['Feuer','Boden']
}

export default function TypeGrid({ types }: Props) {
  if (!types?.length) return null

  return (
    <div className="grid grid-cols-2 gap-1">
      {types.map(t => (
        <TypeIcon key={t} type={t} />
      ))}
    </div>
  )
}
