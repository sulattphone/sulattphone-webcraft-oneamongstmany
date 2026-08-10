import type { Woman } from '../data/women3d'

export interface LayoutNode {
  x: number
  depth: number
  height: number
}

export interface OrbLayout {
  nodes: LayoutNode[]
  maxDepth: number
}

function mapRange(
  value: number,
  domainMinimum: number,
  domainMaximum: number,
  rangeMinimum: number,
  rangeMaximum: number,
): number {
  if (domainMaximum === domainMinimum) return rangeMinimum
  const progress = (value - domainMinimum) / (domainMaximum - domainMinimum)
  return rangeMinimum + progress * (rangeMaximum - rangeMinimum)
}

export function createOrbLayout(women: readonly Woman[]): OrbLayout {
  if (women.length === 0) return { nodes: [], maxDepth: 0 }

  const years = women.map(({ year }) => year)
  const backlinks = women.map(({ backlinks: count }) => count)
  const minimumYear = Math.min(...years)
  const maximumYear = Math.max(...years)
  const minimumBacklinks = Math.min(...backlinks)
  const maximumBacklinks = Math.max(...backlinks)
  const maxDepth = 1.5 * women.length
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))

  const nodes = women.map((woman, index) => {
    const radius = 10 * Math.sqrt(0.5 + index)
    return {
      x: radius * Math.cos(index * goldenAngle),
      depth: mapRange(woman.year, minimumYear, maximumYear, 0, -maxDepth),
      height: mapRange(
        woman.backlinks,
        minimumBacklinks,
        maximumBacklinks,
        -1,
        2,
      ),
      velocityX: 0,
    }
  })

  let alpha = 1
  const alphaDecay = 1 - Math.pow(0.001, 1 / 300)
  const collisionDiameter = 2.5

  for (let tick = 0; tick < 1000; tick += 1) {
    alpha += (0 - alpha) * alphaDecay
    for (const node of nodes) {
      node.velocityX += (0 - node.x) * 0.07 * alpha
    }

    for (let first = 0; first < nodes.length; first += 1) {
      for (let second = first + 1; second < nodes.length; second += 1) {
        const a = nodes[first]
        const b = nodes[second]
        const deltaX = a.x + a.velocityX - (b.x + b.velocityX)
        const deltaDepth = a.depth - b.depth
        const distance = Math.hypot(deltaX, deltaDepth)
        if (distance >= collisionDiameter || distance <= 0.0001) continue

        const overlap =
          ((collisionDiameter - distance) / distance) * alpha * 0.5
        const force = deltaX * overlap
        a.velocityX += force
        b.velocityX -= force
      }
    }

    for (const node of nodes) {
      node.velocityX *= 0.6
      node.x += node.velocityX
    }
  }

  for (const [first, second] of [
    [1, 2],
    [12, 13],
  ] as const) {
    if (!nodes[first] || !nodes[second]) continue
    const firstX = nodes[first].x
    const firstHeight = nodes[first].height
    nodes[first].x = nodes[second].x
    nodes[first].height = nodes[second].height
    nodes[second].x = firstX
    nodes[second].height = firstHeight
  }

  const offsets = [0.5, -0.5, -0.5, 0.5]
  offsets.forEach((offset, index) => {
    if (nodes[index]) nodes[index].x += offset
  })

  return {
    nodes: nodes.map(({ x, depth, height }) => ({ x, depth, height })),
    maxDepth,
  }
}
