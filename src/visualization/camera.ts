import type { LayoutNode } from './layout'
import {
  FINAL_TRANSITION,
  ORB_SEGMENT,
  ORB_TRANSITION,
  clamp,
  getTimelineDuration,
} from './story'

export interface Point3D {
  x: number
  y: number
  z: number
}

const INITIAL_CAMERA: Point3D = { x: 0, y: 0, z: 10 }

function orbCameraTarget(node: LayoutNode): Point3D {
  return { x: -node.x, y: node.height, z: node.depth + 2 }
}

function quadraticEaseOut(progress: number): number {
  const remaining = 1 - clamp(progress)
  return 1 - remaining * remaining
}

function interpolate(from: Point3D, to: Point3D, progress: number): Point3D {
  const eased = quadraticEaseOut(progress)
  return {
    x: from.x + (to.x - from.x) * eased,
    y: from.y + (to.y - from.y) * eased,
    z: from.z + (to.z - from.z) * eased,
  }
}

export function getCameraPosition(
  progress: number,
  nodes: readonly LayoutNode[],
  maxDepth: number,
): Point3D {
  if (nodes.length === 0) return INITIAL_CAMERA

  const timelineTime = clamp(progress) * getTimelineDuration(nodes.length)
  const orbTimelineEnd = nodes.length * ORB_SEGMENT

  if (timelineTime < orbTimelineEnd) {
    const index = Math.min(
      Math.floor(timelineTime / ORB_SEGMENT),
      nodes.length - 1,
    )
    const localTime = timelineTime - index * ORB_SEGMENT
    const target = orbCameraTarget(nodes[index])
    if (localTime >= ORB_TRANSITION) return target

    const previous =
      index === 0 ? INITIAL_CAMERA : orbCameraTarget(nodes[index - 1])
    return interpolate(previous, target, localTime / ORB_TRANSITION)
  }

  const finalTarget = { x: 0, y: 0, z: -maxDepth - 5 }
  const finalProgress = (timelineTime - orbTimelineEnd) / FINAL_TRANSITION
  return interpolate(
    orbCameraTarget(nodes[nodes.length - 1]),
    finalTarget,
    finalProgress,
  )
}
