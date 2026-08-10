import { memo, useEffect, useRef } from 'react'
import { getIntroVisualState, INTRO_VIEWPORTS } from '../visualization/story'
import styles from './Home.module.css'

function startPlayback(video: HTMLVideoElement): void {
  if (!video.paused) return
  void video.play().catch(() => {
    // Muted inline video normally autoplays. If a browser still blocks it,
    // the next scroll, pointer, or keyboard interaction retries playback.
  })
}

function IntroVideos() {
  const firstVideoRef = useRef<HTMLVideoElement>(null)
  const secondVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const firstVideo = firstVideoRef.current
    const secondVideo = secondVideoRef.current
    if (!firstVideo || !secondVideo) return

    const videos = [firstVideo, secondVideo]
    let animationFrame = 0
    let playbackWanted = true

    const update = () => {
      animationFrame = 0
      const introDistance = Math.max(1, window.innerHeight * INTRO_VIEWPORTS)
      const timelineProgress = Math.min(window.scrollY / introDistance, 1) * 3
      const visualState = getIntroVisualState(timelineProgress)

      firstVideo.style.opacity = String(visualState.firstVideoOpacity)
      secondVideo.style.opacity = String(visualState.secondVideoOpacity)

      const shouldPlay = visualState.introOpacity > 0 && !document.hidden
      if (shouldPlay !== playbackWanted) {
        playbackWanted = shouldPlay
        if (shouldPlay) videos.forEach(startPlayback)
        else videos.forEach((video) => video.pause())
      }
    }

    const requestUpdate = () => {
      if (animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(update)
      }
    }
    const retryPlayback = () => {
      if (playbackWanted) videos.forEach(startPlayback)
    }

    videos.forEach((video) => {
      video.muted = true
      video.defaultMuted = true
      video.addEventListener('canplay', retryPlayback)
      startPlayback(video)
    })
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    window.addEventListener('pointerdown', retryPlayback, { passive: true })
    window.addEventListener('keydown', retryPlayback)
    document.addEventListener('visibilitychange', requestUpdate)
    update()

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      window.removeEventListener('pointerdown', retryPlayback)
      window.removeEventListener('keydown', retryPlayback)
      document.removeEventListener('visibilitychange', requestUpdate)
      videos.forEach((video) => {
        video.removeEventListener('canplay', retryPlayback)
        video.pause()
      })
      if (animationFrame !== 0) window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <div className={styles.videos} aria-hidden="true">
      <video
        ref={firstVideoRef}
        className={styles.firstVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
      >
        <source src="/videos/fancy_reduced.mp4" type="video/mp4" />
      </video>
      <video
        ref={secondVideoRef}
        className={styles.secondVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
      >
        <source src="/videos/timelapse_reduced.mp4" type="video/mp4" />
      </video>
    </div>
  )
}

export default memo(IntroVideos)
