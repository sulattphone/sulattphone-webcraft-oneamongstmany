import { describe, expect, it } from 'vitest'
import women from '../data/women3d'
import { createOrbLayout } from './layout'

describe('orb layout', () => {
  it('is deterministic, finite, and covers all women', () => {
    const first = createOrbLayout(women)
    const second = createOrbLayout(women)

    expect(first).toEqual(second)
    expect(first.nodes).toHaveLength(18)
    expect(first.maxDepth).toBe(27)
    for (const node of first.nodes) {
      expect(Number.isFinite(node.x)).toBe(true)
      expect(Number.isFinite(node.height)).toBe(true)
      expect(Number.isFinite(node.depth)).toBe(true)
    }
  })

  it('orders the installation by achievement year', () => {
    const { nodes } = createOrbLayout(women)
    expect(nodes[0].depth).toBe(0)
    expect(nodes[nodes.length - 1].depth).toBe(-27)
    for (let index = 1; index < nodes.length; index += 1) {
      expect(nodes[index].depth).toBeLessThanOrEqual(nodes[index - 1].depth)
    }
  })
})
