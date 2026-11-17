import { useCallback, useEffect, useRef, useState } from 'react'
import './HeaderLoadProgress.css'

export default function HeaderLoadProgress({ ready, failed = false, onComplete }) {
  const [phase, setPhase] = useState('idle')
  const completed = useRef(false)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const complete = useCallback(() => {
    if (completed.current) return

    completed.current = true
    setPhase('done')
    onCompleteRef.current?.()
  }, [])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setPhase((current) => current === 'idle' ? 'loading' : current)
    })

    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (!ready) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      complete()
      return
    }

    const frame = requestAnimationFrame(() => {
      setPhase((current) => current === 'done' ? current : 'finishing')
    })

    return () => cancelAnimationFrame(frame)
  }, [ready, complete])

  useEffect(() => {
    if (phase !== 'finishing') return

    const fallback = window.setTimeout(complete, 1000)
    return () => window.clearTimeout(fallback)
  }, [phase, complete])

  return (
    <div className={`yh-progress yh-progress--${failed ? 'cancelled' : phase}`}>
      <div className="yh-progress__track" aria-hidden="true">
        <span
          className="yh-progress__fill"
          onTransitionEnd={(event) => {
            if (
              event.target === event.currentTarget &&
              event.propertyName === 'transform' &&
              phase === 'finishing'
            ) {
              complete()
            }
          }}
        />
      </div>

      <span className="yh-progress__status" role="status">
        {failed ? 'Navigation failed' : phase === 'done' ? 'Website ready' : 'Loading website'}
      </span>
    </div>
  )
}
