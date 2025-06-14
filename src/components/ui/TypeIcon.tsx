const URL = (t: string) =>
  `https://media.bisafans.de/3569bf2/typen/${encodeURIComponent(t)}.png`

export default function TypeIcon({ type }: { type: string }) {
  return (
    <img
      src={URL(type)}
      alt={type}
      title={type}
      className="h-6 w-6 mx-auto"
      loading="lazy"
    />
  )
}
