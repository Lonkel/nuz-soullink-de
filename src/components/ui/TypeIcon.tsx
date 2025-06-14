const url = (type: string) =>
  `https://media.bisafans.de/3569bf2/typen/${encodeURIComponent(type)}.png`

export default function TypeIcon({ type }: { type: string }) {
  return (
    <img
      src={url(type)}
      alt={type}
      title={type}
      className="h-6 w-6 mx-auto"

    />
  )
}
