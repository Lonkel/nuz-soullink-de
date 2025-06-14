// src/pages/run/[runId].tsx
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Encounter } from '@/context/RunContext'
import Layout from '../../components/run/_layout'
import { RunProvider } from '@/context/RunContext'

export default function RunPage() {
  const { query } = useRouter()
  const id = query.runId as string | undefined

  const [trainers, setTrainers]     = useState<string[]>([])
  const [game, setGame]             = useState('')
  const [encounters, setEncounters] = useState<Encounter[]>([])

  /* 1) Config (Trainer + Game) laden, die im localStorage steckt */
  useEffect(() => {
    if (!id) return
    const raw = localStorage.getItem(id)
    if (!raw) return
    const parsed = JSON.parse(decodeURIComponent(raw))
    setTrainers(parsed.trainers)
    setGame(parsed.game)
  }, [id])

  /* 2) Encounter-Speicher an dieselbe ID koppeln */
  useEffect(() => {
    if (!id) return
    const raw = localStorage.getItem(`${id}_enc`)
    if (raw) setEncounters(JSON.parse(raw))
  }, [id])

  useEffect(() => {
    if (!id) return
    localStorage.setItem(`${id}_enc`, JSON.stringify(encounters))
  }, [encounters, id])

  if (!id || !game) return null   // optional Loader

  return (
    <RunProvider
      initialGame="HG/SS"
      initialTrainers={['Red', 'Blue']}
    >
      <Layout />
    </RunProvider>
  )
}
