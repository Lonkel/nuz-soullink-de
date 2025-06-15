// pages/setup.tsx   (oder pages/setup/index.tsx)
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Setup() {
  const router = useRouter()

  useEffect(() => {
    // TODO: hier später deinen Setup-Wizard einbauen.
    // Vorläufig legen wir einfach einen Dummy-Run an
    // und springen sofort in die Team-Ansicht.
    const id = Date.now().toString(36)          // zufällige ID
    localStorage.setItem('runs', JSON.stringify([{ id, title: 'Neuer Run' }]))
    router.replace(`/run/${id}`)
  }, [router])

  return null
}
