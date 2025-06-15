/* pages/run/[runId].tsx
   – Sticky Header, Sticky Tabs, Sticky Table-Header
   – keine externe Layout-Komponente mehr nötig                      */

import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState } from 'react'
import { RunProvider, useRun } from '@/context/RunContext'

/* ─── Kleine Helfer ────────────────────────────────────────────────*/
const TabNames = ['Team', 'Box', 'Tod'] as const
type Tab = typeof TabNames[number]

/* ─── UI-Layout mit Sticky-Elementen ───────────────────────────────*/
function StickyLayout() {
  const { game, trainers, encounters } = useRun()
  const [tab, setTab] = useState<Tab>('Team')

  const rows =
    tab === 'Team'
      ? encounters.filter(e => e.status === 'Team')
      : tab === 'Box'
      ? encounters.filter(e => e.status === 'Box')
      : encounters.filter(e => e.status === 'Tod')

  return (
    <>
      <Head>
        <title>Nuzlocke Soullink · {game}</title>
      </Head>

      {/* ── Titelzeile ───────────────────────────────────────── */}
      <header className="sticky top-0 z-30 h-14 flex items-center px-4
                         bg-slate-900 text-white border-b border-slate-700">
        <h1 className="text-lg font-semibold truncate">
          {game} · Nuzlocke Soullink
        </h1>
      </header>

      {/* ── Tabs ────────────────────────────────────────────── */}
      <nav className="sticky top-14 z-20 h-11 flex bg-slate-800 border-b border-slate-700">
        {TabNames.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 text-sm font-medium
                        ${tab === t
                          ? 'text-white border-b-2 border-sky-400'
                          : 'text-slate-300 hover:text-white'}`}
          >
            {t}
          </button>
        ))}
      </nav>

      {/* ── Scroll-Bereich mit Tabelle ──────────────────────── */}
      <section className="flex-1 overflow-y-auto p-4">
        <table className="w-full text-slate-200">
          <thead>
            <tr className="bg-slate-900 sticky top-[5.5rem] z-10">
              <th className="py-2 px-2 text-left">Location</th>
              {trainers.map(tr => (
                <th key={tr} className="py-2 px-2 text-left">
                  {tr}
                </th>
              ))}
              <th className="py-2 px-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(e => (
              <tr
                key={e.id}
                className="odd:bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <td className="py-2 px-2">{e.location}</td>
                {trainers.map(tr => {
                  const slot = e.slots.find(s => s.trainer === tr)
                  return (
                    <td key={tr} className="py-2 px-2">
                      {slot?.name ?? '—'}
                    </td>
                  )
                })}
                <td className="py-2 px-2">{e.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}

/* ─── Page-Komponente ─────────────────────────────────────────────*/
export default function RunPage() {
  const router = useRouter()
  if (!router.isReady) return null

  const { runId, game, trainers } = router.query
  if (typeof game !== 'string' || typeof trainers !== 'string')
    return <p className="p-6 text-red-500">Ungültige URL-Parameter.</p>

  const trainerList = trainers.split('|').filter(Boolean)

  return (
    <RunProvider
      runId={String(runId)}
      initialGame={game}
      initialTrainers={trainerList}
    >
      {/* volle Höhe → Scrollen nur im Content-Bereich */}
      <div className="h-screen flex flex-col overflow-hidden">
        <StickyLayout />
      </div>
    </RunProvider>
  )
}
