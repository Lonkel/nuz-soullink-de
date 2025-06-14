// context/RunProvider.tsx
import { RunContext } from './RunContext'
import { useState, PropsWithChildren } from 'react'
import { v4 as uuid } from 'uuid'

export const RunProvider = ({
  encodedConfig,
  children
}: PropsWithChildren<{ encodedConfig: string }>) => {
  const decoded = JSON.parse(decodeURIComponent(encodedConfig))
  const [encounters, setEncounters] = useState<Encounter[]>([])

  const updateEncounter = (enc: Encounter) =>
    setEncounters(prev =>
      prev.map(e => (e.id === enc.id ? enc : e))
    )

  return (
    <RunContext.Provider
      value={{ ...decoded, encounters, updateEncounter }}
    >
      {children}
    </RunContext.Provider>
  )
}
