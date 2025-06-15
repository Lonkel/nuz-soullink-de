import { useRouter } from 'next/router'
import { RunProvider } from '@/context/RunContext'
import Layout from '@/components/run/_layout'

export default function RunPage() {
  const router = useRouter()
  const { game, trainers } = router.query

  /* Router erst nutzen, wenn Query bereit ist */
  if (!router.isReady) return null

  if (typeof game !== 'string' || typeof trainers !== 'string') {
    return <p className="p-6 text-red-500">Ungültige URL-Parameter.</p>
  }

  const trainerList = trainers.split('|').filter(Boolean)

  return (
    <RunProvider
   runId={String(router.query.runId)}
   initialGame={game}
   initialTrainers={trainerList}
 >
      <Layout />
    </RunProvider>
  )
}
