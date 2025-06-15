// src/components/Layout.tsx
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { useRun } from '@/context/RunContext'   //  neu


export default function Layout({ children }: { children: ReactNode }) {
  const router   = useRouter()
  const { runId } = router.query
  const { trainers } = useRun()                //  hier bekommst du die Namen

  const base = `/run/${runId ?? ''}`

  return (
    <div className="p-4">
      <nav className="mb-4 flex flex-wrap gap-4 text-white">
        <TabLink href={base}>Übersicht</TabLink>

        {/* dynamisch für jeden Trainer */}
        {trainers.map(t => (
          <TabLink key={t} href={`${base}/trainer/${t}`}>
            {t}
          </TabLink>
        ))}

        {/* wenn du weitere Tabs hast, hier anhängen */}
      </nav>

      {children}
    </div>
  )
}


/* Kleiner Link-Wrapper, der den aktiven Tab hervorhebt */
function TabLink({ href, children }: { href: string; children: ReactNode }) {
  const router = useRouter()
  const active = router.asPath === href || router.asPath.startsWith(href + '/')

  return (
    <Link
      href={href}
      className={active ? 'font-bold underline' : 'hover:underline'}
    >
      {children}
    </Link>
  )
}
