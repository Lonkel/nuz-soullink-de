// pages/index.tsx  (oder Re_Index.tsx)
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

type RunMeta = { id: string; title: string } // passt du später an

export default function Home() {
  const router = useRouter()
  const [runs, setRuns] = useState<RunMeta[] | null>(null)

  /* ----------------------------------------------------------
     1)  Beim ersten Render client-seitig gespeicherte Runs laden
  ---------------------------------------------------------- */
  useEffect(() => {
    const stored = localStorage.getItem('runs')       // <- dein Key
    if (stored) {
      setRuns(JSON.parse(stored) as RunMeta[])
    } else {
      setRuns([])                                     // keine Runs vorhanden
    }
  }, [])

  /* ----------------------------------------------------------
     2)  Auto-Redirect, wenn exakt EIN Run existiert
  ---------------------------------------------------------- */
  useEffect(() => {
    if (runs && runs.length === 1) {
      router.replace(`/run/${runs[0].id}`)
    }
  }, [runs, router])

  /* ----------------------------------------------------------
     3)  Anzeige – mehrere oder gar keine Runs
  ---------------------------------------------------------- */
  if (runs === null) return null // noch am Laden

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Wähle deinen Run</h1>

      {runs.length === 0 && (
        <div className="mb-6">
          Du hast noch keinen Run angelegt.
        </div>
      )}

      <ul className="space-y-2 list-disc pl-6 mb-8">
        {runs.map(r => (
          <li key={r.id}>
            <Link href={`/run/${r.id}`} className="underline">
              {r.title || r.id}
            </Link>
          </li>
        ))}
      </ul>

      {/* Button zum neuen Run-Wizard / Setup-Seite */}
      <Link
        href="/setup"
        className="inline-block rounded bg-green-600 px-4 py-2 font-bold hover:bg-green-500"
      >
        Neuen Run erstellen
      </Link>
    </div>
  )
}
