import { describe, expect, it } from 'vitest'
import {
  getFocusIndex,
  getIntroVisualState,
  getScrollStoryState,
  getStoryOverlay,
  getTimelineDuration,
} from './story'

describe('intro timeline', () => {
  it('preserves the original crossfade windows', () => {
    expect(getIntroVisualState(0)).toEqual({
      introOpacity: 1,
      narrativeOpacity: 1,
      arrowOpacity: 1,
      firstVideoOpacity: 1,
      legendOpacity: 0,
      secondVideoOpacity: 0,
    })
    expect(getIntroVisualState(1.3).legendOpacity).toBe(1)
    const crossfade = getIntroVisualState(1.1)
    expect(crossfade.firstVideoOpacity).toBeCloseTo(0.75)
    expect(crossfade.secondVideoOpacity).toBeCloseTo(0.6)
    const midpoint = getIntroVisualState(2.55)
    expect(midpoint.arrowOpacity).toBeCloseTo(0.5)
    expect(midpoint.legendOpacity).toBeCloseTo(0.5)
    expect(midpoint.secondVideoOpacity).toBeCloseTo(0.5)
    expect(getIntroVisualState(3)).toEqual({
      introOpacity: 0,
      narrativeOpacity: 0,
      arrowOpacity: 0,
      firstVideoOpacity: 0,
      legendOpacity: 0,
      secondVideoOpacity: 0,
    })
  })
})

describe('story progression', () => {
  it('keeps the wide establishing view before the first woman', () => {
    expect(getFocusIndex(0, 18)).toBe(-1)
    expect(getFocusIndex(0.0099, 18)).toBe(-1)
    expect(getFocusIndex(0.01, 18)).toBe(0)
    expect(getFocusIndex(1, 18)).toBe(17)
  })

  it('uses the same two-unit rhythm and text fade', () => {
    expect(getTimelineDuration(18)).toBe(38)
    expect(getStoryOverlay(0.49, 18)).toEqual({ index: -1, opacity: 0 })
    expect(getStoryOverlay(0.6, 18)).toEqual({
      index: 0,
      opacity: expect.closeTo(0.5),
    })
    expect(getStoryOverlay(1.2, 18)).toEqual({ index: 0, opacity: 1 })
    expect(getStoryOverlay(1.8, 18)).toEqual({
      index: 0,
      opacity: expect.closeTo(0.5),
    })
    expect(getStoryOverlay(36, 18)).toEqual({ index: -1, opacity: 0 })
  })

  it('maps the ten-viewport intro and remaining document to the visualization', () => {
    const beforeVisualization = getScrollStoryState(8200, 1000, 50000, 18)
    expect(beforeVisualization.visualizationVisible).toBe(false)
    expect(beforeVisualization.visualizationProgress).toBe(0)

    const transition = getScrollStoryState(8201, 1000, 50000, 18)
    expect(transition.visualizationVisible).toBe(true)
    expect(transition.visualizationProgress).toBe(0)

    const end = getScrollStoryState(49000, 1000, 50000, 18)
    expect(end.visualizationProgress).toBe(1)
    expect(end.outroOpacity).toBe(1)
  })
})
