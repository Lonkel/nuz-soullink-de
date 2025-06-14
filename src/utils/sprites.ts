import pokedex from '@/data/pokemon.json'

const slug = (s:string) => s.toLowerCase().replace(/ /g,'-')

export function sprite(query: string | number) {
  const q = String(query).toLowerCase()

  const p =
    pokedex.find(p => String(p.id) === q) ||
    pokedex.find(p => p.de.toLowerCase() === q) ||
    pokedex.find(p => p.en.toLowerCase() === q)

  return p
    ? `https://img.pokemondb.net/sprites/home/normal/${slug(p.en)}.png` // Variante B
    : '/sprites/unknown.png'
}
