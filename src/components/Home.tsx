import { useEffect, useRef, useState, type ReactNode } from 'react'
import women from '../data/women3d'
import { createVisualization } from '../visualization/scene'
import {
  useDelayedValue,
  useStoryScroll,
} from '../visualization/useStoryScroll'
import styles from './Home.module.css'
import IntroVideos from './IntroVideos'

interface ExternalLinkProps {
  href: string
  children: ReactNode
  className?: string
}

function ExternalLink({ href, children, className }: ExternalLinkProps) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      referrerPolicy="strict-origin-when-cross-origin"
    >
      {children}
    </a>
  )
}

function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return reducedMotion
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollProgressRef = useRef(0)
  const focusIndexRef = useRef(-1)
  const visualizationActiveRef = useRef(false)
  const story = useStoryScroll(women.length)
  const delayedFocusIndex = useDelayedValue(story.focusIndex, 200)
  const reducedMotion = useReducedMotion()

  scrollProgressRef.current = story.visualizationProgress
  focusIndexRef.current = delayedFocusIndex
  visualizationActiveRef.current = story.visualizationVisible

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    return () => {
      window.history.scrollRestoration = previousRestoration
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let visualization: ReturnType<typeof createVisualization> | undefined
    let animationFrame = 0
    let startTime: number | null = null
    let disposed = false
    let initialFrameRendered = false

    const resize = () => {
      visualization?.resize(
        window.innerWidth,
        window.innerHeight,
        window.devicePixelRatio,
      )
    }
    const animate = (timestamp: number) => {
      if (!visualization || disposed) return
      if (startTime === null) startTime = timestamp
      if (visualizationActiveRef.current || !initialFrameRendered) {
        visualization.render(
          (timestamp - startTime) / 1000,
          scrollProgressRef.current,
          focusIndexRef.current,
          !reducedMotion && visualizationActiveRef.current,
        )
        initialFrameRendered = true
      }
      animationFrame = window.requestAnimationFrame(animate)
    }
    const start = () => {
      if (disposed) return
      try {
        visualization = createVisualization(canvas, women)
      } catch {
        canvas.hidden = true
        return
      }
      resize()
      window.addEventListener('resize', resize)
      animationFrame = window.requestAnimationFrame(animate)
    }

    // Deferring initialization avoids creating two WebGL renderers during
    // React Strict Mode's development-only mount/cleanup/remount cycle.
    animationFrame = window.requestAnimationFrame(start)

    return () => {
      disposed = true
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(animationFrame)
      visualization?.dispose()
    }
  }, [reducedMotion])

  const currentWoman =
    story.storyIndex >= 0 ? women[story.storyIndex] : undefined
  const storyVisible = story.visualizationVisible && story.storyOpacity > 0
  const outroVisible = story.visualizationVisible && story.outroOpacity > 0

  return (
    <main className={styles.container}>
      <section
        className={styles.intro}
        style={{
          opacity: story.introOpacity,
          visibility: story.introOpacity > 0 ? 'visible' : 'hidden',
        }}
        aria-hidden={story.introOpacity === 0}
      >
        <IntroVideos />
        <div className={styles.overlayImage} aria-hidden="true" />

        <div
          className={styles.subsection}
          style={{ opacity: story.narrativeOpacity }}
        >
          <h1 className={styles.title}>One Amongst Many</h1>
          <div className={styles.byline}>
            by{' '}
            <ExternalLink href="https://cdacanay.com/">
              Christina Dacanay
            </ExternalLink>
            ,{' '}
            <ExternalLink href="https://tina.pizza/">
              Tina Rungsawang
            </ExternalLink>
            , and{' '}
            <ExternalLink href="https://sxywu.com/">Shirley Wu</ExternalLink>
          </div>
          <p>
            Young women entering fields dominated by men often feel like there
            is no history of people like them in their field. We know now that
            this is an issue of storytelling, not of history. Women have been
            contributing to every field, however invisibly, since the beginning
            of time.
          </p>
          <p>
            One Amongst Many attempts to illuminate the histories of women in
            computing that have been diminished or erased. It is a data
            installation where each woman is arranged in a field by the year of
            her greatest achievement, and the height of the orb correlated to
            her renown. Every orb starts dimmed, and gets brighter each time
            another person reads about them, literally shedding light on the
            woman&apos;s accomplishments.
          </p>
        </div>

        <div
          className={styles.subsection}
          style={{ opacity: story.legendOpacity }}
        >
          <p>
            One Amongst Many is a physical data visualization created at New
            York University&apos;s ITP Master&apos;s program. The original
            installation consisted of 16-20 illuminated orbs suspended from the
            ceiling, each with a woman&apos;s biography inside. This website is
            a digital analog to the installation, so that people around the
            world can learn about these incredible women in computing.
          </p>
        </div>

        <div
          className={styles.arrow}
          style={{ opacity: story.arrowOpacity }}
          aria-hidden="true"
        >
          ⌄
        </div>
      </section>

      <canvas
        ref={canvasRef}
        className={styles.canvas}
        aria-label="3D visualization of women in computing, showing glowing orbs representing individuals arranged in a landscape. Scroll to explore each woman's story."
        role="img"
      />

      {story.visualizationVisible && story.storyIndex >= 0 && (
        <div className={styles.progress} aria-live="polite">
          {story.storyIndex + 1} of {women.length}
        </div>
      )}

      <section
        className={styles.overlay}
        style={{
          opacity: storyVisible ? story.storyOpacity : 0,
          visibility: storyVisible ? 'visible' : 'hidden',
        }}
        aria-hidden={!storyVisible}
      >
        {currentWoman && (
          <article className={styles.orbText} key={currentWoman.name}>
            <div className={styles.orbYear}>
              <strong>{currentWoman.year}</strong>
            </div>
            <h2 className={styles.orbName}>{currentWoman.name}</h2>
            <div className={styles.orbFields}>
              <em>{currentWoman.fields}</em>
            </div>
            <p className={styles.orbSummary}>{currentWoman.shortSummary}</p>
            <p className={styles.readMoreLine}>
              <ExternalLink
                href={currentWoman.url}
                className={styles.readMore}
              >
                read more
              </ExternalLink>{' '}
              →
            </p>
          </article>
        )}
      </section>

      <section
        className={styles.outro}
        style={{
          opacity: outroVisible ? story.outroOpacity : 0,
          visibility: outroVisible ? 'visible' : 'hidden',
        }}
        aria-hidden={!outroVisible}
      >
        <div className={styles.videoFrame}>
          <iframe
            src="https://www.youtube-nocookie.com/embed/bEM0CRdCrQo"
            title="One Amongst Many installation video"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
            allow="encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <p className={styles.outroCredits}>
          <strong>Read more about One Amongst Many here:</strong>
          <br />
          <ExternalLink href="https://cdacanay.com/itp-blog/2019/12/23/one-amongst-many-connecting-womxn-in-computing">
            Christina&apos;s design-centric recounting
          </ExternalLink>
          <br />
          <ExternalLink href="https://tina.pizza/one-amongst-many">
            Tina&apos;s physical computing story
          </ExternalLink>
          <br />
          <ExternalLink href="https://www.datasketch.es/june/">
            Shirley&apos;s data visualization write-up
          </ExternalLink>
        </p>
        <p className={styles.outroFooter}>
          <em>Made with love in Brooklyn, 2019.</em>
        </p>
      </section>
    </main>
  )
}
