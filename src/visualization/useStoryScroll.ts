import { useEffect, useState } from 'react'
import { getScrollStoryState, type ScrollStoryState } from './story'

function readStoryState(womanCount: number): ScrollStoryState {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return getScrollStoryState(0, 1, 1, womanCount)
  }
  return getScrollStoryState(
    window.scrollY,
    window.innerHeight,
    document.documentElement.scrollHeight,
    womanCount,
  )
}

export function useStoryScroll(womanCount: number): ScrollStoryState {
  const [state, setState] = useState(() => readStoryState(womanCount))

  useEffect(() => {
    let animationFrame = 0
    const update = () => {
      animationFrame = 0
      setState(readStoryState(womanCount))
    }
    const requestUpdate = () => {
      if (animationFrame === 0) animationFrame = window.requestAnimationFrame(update)
    }

    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    update()

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (animationFrame !== 0) window.cancelAnimationFrame(animationFrame)
    }
  }, [womanCount])

  return state
}

export function useDelayedValue<T>(value: T, delayMilliseconds: number): T {
  const [delayedValue, setDelayedValue] = useState(value)

  useEffect(() => {
    const timeout = window.setTimeout(() => setDelayedValue(value), delayMilliseconds)
    return () => window.clearTimeout(timeout)
  }, [delayMilliseconds, value])

  return delayedValue
}
