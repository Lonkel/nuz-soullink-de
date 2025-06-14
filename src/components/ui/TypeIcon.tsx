const url = (type: string) =>
  `https://media.bisafans.de/3569bf2/typen/${encodeURIComponent(
    type.toLowerCase(),
  )}.png`

export default function TypeIcon({ type }: { type: string }) {
  return (
    <img
      src={url(type)}
      alt={type}
      title={type}
      className="h-8 w-18 mx-auto"   /* etwas größer, gut erkennbar */
      loading="lazy"
    />
  )
}
