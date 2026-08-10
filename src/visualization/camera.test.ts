import { describe, expect, it } from 'vitest'
import { getCameraPosition } from './camera'
import type { LayoutNode } from './layout'

const nodes: LayoutNode[] = [
  { x: 2, height: 1, depth: -4 },
  { x: -3, height: 2, depth: -8 },
]

describe('camera timeline', () => {
  it('moves for one unit, holds for one unit, then pulls back', () => {
    expect(getCameraPosition(0, nodes, 12)).toEqual({ x: 0, y: 0, z: 10 })

    // Two orbs produce a six-unit timeline. At t=1, the first move is complete.
    expect(getCameraPosition(1 / 6, nodes, 12)).toEqual({ x: -2, y: 1, z: -2 })
    expect(getCameraPosition(1.5 / 6, nodes, 12)).toEqual({
      x: -2,
      y: 1,
      z: -2,
    })
    expect(getCameraPosition(3 / 6, nodes, 12)).toEqual({ x: 3, y: 2, z: -6 })
    expect(getCameraPosition(1, nodes, 12)).toEqual({ x: 0, y: 0, z: -17 })
  })
})
