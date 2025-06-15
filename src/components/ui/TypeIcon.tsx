const slug = (t: string) =>
  t
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')

const url = (type: string) =>
  `https://media.bisafans.de/3569bf2/typen/${encodeURIComponent(
    type.toLowerCase(),
  )}.png`

export default function TypeIcon({ type, className = '' }: { type: string; className?: string }) {
  return (
    <img
      src={url(type)}
      alt={type}
      title={type}
      className={`h-8 w-18 mx-auto ${className}`}
      loading="lazy"
    />
  )
}
