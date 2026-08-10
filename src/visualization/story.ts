export const INTRO_VIEWPORTS = 10
export const ORB_SEGMENT = 2
export const ORB_TRANSITION = 1
export const FINAL_TRANSITION = 2

export interface IntroVisualState {
  introOpacity: number
  narrativeOpacity: number
  arrowOpacity: number
  firstVideoOpacity: number
  legendOpacity: number
  secondVideoOpacity: number
}

export interface ScrollStoryState extends IntroVisualState {
  visualizationVisible: boolean
  visualizationProgress: number
  focusIndex: number
  timelineTime: number
  storyIndex: number
  storyOpacity: number
  outroOpacity: number
}

export function clamp(value: number, minimum = 0, maximum = 1): number {
  return Math.min(maximum, Math.max(minimum, value))
}

function fadeInOut(
  time: number,
  fadeInStart: number,
  fadeInEnd: number,
  fadeOutStart: number,
  fadeOutEnd: number,
): number {
  if (time < fadeInStart || time >= fadeOutEnd) return 0
  if (time < fadeInEnd) {
    return clamp((time - fadeInStart) / (fadeInEnd - fadeInStart))
  }
  if (time < fadeOutStart) return 1
  return clamp(1 - (time - fadeOutStart) / (fadeOutEnd - fadeOutStart))
}

export function getTimelineDuration(womanCount: number): number {
  return womanCount * ORB_SEGMENT + FINAL_TRANSITION
}

export function getIntroVisualState(timelineProgress: number): IntroVisualState {
  const time = clamp(timelineProgress, 0, 3)
  const narrativeOpacity = clamp(1 - time / 0.9)
  const arrowOpacity = time < 2.2 ? 1 : clamp(1 - (time - 2.2) / 0.7)
  const firstVideoOpacity = time < 1 ? 1 : clamp(1 - (time - 1) / 0.4)
  const legendOpacity = fadeInOut(time, 0.8, 1.3, 2.2, 2.9)
  const introOpacity =
    time < 2.2 ? 1 : time < 3 ? clamp(1 - (time - 2.2) / 0.8) : 0

  return {
    introOpacity,
    narrativeOpacity,
    arrowOpacity,
    firstVideoOpacity,
    legendOpacity,
    secondVideoOpacity: legendOpacity,
  }
}

export function getFocusIndex(progress: number, womanCount: number): number {
  if (progress < 0.01 || womanCount === 0) return -1
  const adjustedProgress = (clamp(progress) - 0.01) / 0.99
  return Math.min(
    Math.floor(adjustedProgress * (womanCount + 1)),
    womanCount - 1,
  )
}

export function getStoryOverlay(
  timelineTime: number,
  womanCount: number,
): { index: number; opacity: number } {
  const index = Math.floor((timelineTime - 0.5) / ORB_SEGMENT)
  if (
    index < 0 ||
    index >= womanCount ||
    timelineTime >= womanCount * ORB_SEGMENT
  ) {
    return { index: -1, opacity: 0 }
  }

  const localTime = timelineTime - index * ORB_SEGMENT
  return {
    index,
    opacity: fadeInOut(localTime, 0.5, 0.7, 1.7, 1.9),
  }
}

export function getScrollStoryState(
  scrollY: number,
  viewportHeight: number,
  documentHeight: number,
  womanCount: number,
): ScrollStoryState {
  const safeViewportHeight = Math.max(1, viewportHeight)
  const introDistance = safeViewportHeight * INTRO_VIEWPORTS
  const introProgress = clamp(scrollY / introDistance)
  const intro = getIntroVisualState(introProgress * 3)
  const visualizationDistance = Math.max(
    0,
    documentHeight - safeViewportHeight - introDistance,
  )
  const visualizationProgress =
    visualizationDistance > 0
      ? clamp(Math.max(0, scrollY - introDistance) / visualizationDistance)
      : 0
  const timelineTime = visualizationProgress * getTimelineDuration(womanCount)
  const story = getStoryOverlay(timelineTime, womanCount)
  const outroStart = womanCount * ORB_SEGMENT + 0.5

  return {
    ...intro,
    visualizationVisible: scrollY > introDistance * 0.82,
    visualizationProgress,
    focusIndex: getFocusIndex(visualizationProgress, womanCount),
    timelineTime,
    storyIndex: story.index,
    storyOpacity: story.opacity,
    outroOpacity: clamp((timelineTime - outroStart) / 0.5),
  }
}
