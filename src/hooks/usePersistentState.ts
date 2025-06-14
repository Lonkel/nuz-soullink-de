import { useEffect, useState } from 'react'

export default function usePersistentState<T>(
  key: string,
  initial: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return initial
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    if (typeof window !== 'undefined')
      window.localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState]
}
