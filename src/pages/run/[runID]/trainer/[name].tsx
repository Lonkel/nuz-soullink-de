import { useRouter } from 'next/router'
import TrainerTab    from '@/components/trainer/TrainerTab'
import { RunProvider }   from '@/context/RunProvider'      // falls du darüber globalen State lieferst
import Layout     from '@/components/Layout' // deine Tab-Navigation

export default function TrainerPage() {
  const router = useRouter()
  const { runId, name, cfg } = router.query   // cfg = encodedConfig (falls du das nutzt)

  if (!runId || !name) return null            // noch am Laden

  return (
  <RunProvider encodedConfig={cfg as string}>
   <Layout>
      <TrainerTab trainer={name as string} />
    </Layout>
  </RunProvider>
)
}
