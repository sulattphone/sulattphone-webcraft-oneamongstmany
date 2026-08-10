import * as THREE from 'three'
import type { Woman } from '../data/women3d'
import { getCameraPosition } from './camera'
import { createOrbLayout } from './layout'
import { createSeededRandom, randomGaussian } from './random'

const ORB_CANVAS_SIZE = 256
const ORB_RADIUS = 80
const GLOW_ALPHA = [0.05, 0.1, 0.85] as const
const GLOW_RADIUS = [1, 0.75, 0.5] as const

interface OrbCircle {
  centerX: number
  centerY: number
  radius: number
  color: string
  offset: number
  circleCount: number
  speed: number
}

interface OrbRecord {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
  context: CanvasRenderingContext2D
  texture: THREE.CanvasTexture
  circles: OrbCircle[]
  originalDepth: number
}

export interface Visualization {
  render: (
    elapsedSeconds: number,
    scrollProgress: number,
    focusIndex: number,
    motionEnabled: boolean,
  ) => void
  resize: (width: number, height: number, pixelRatio: number) => void
  dispose: () => void
}

function warmGlowColor(progress: number): string {
  const bounded = THREE.MathUtils.clamp(progress, 0, 1)
  const red = Math.round(0xff + (0xf0 - 0xff) * bounded)
  const green = Math.round(0xe0 + (0x88 - 0xe0) * bounded)
  const blue = Math.round(0x70 + (0x40 - 0x70) * bounded)
  return `rgb(${red}, ${green}, ${blue})`
}

function createNoise(seed: number): (value: number) => number {
  const random = createSeededRandom(seed)
  const permutation = new Uint8Array(512)
  for (let index = 0; index < 256; index += 1) {
    const value = Math.floor(random() * 256)
    permutation[index] = value
    permutation[index + 256] = value
  }

  return (input: number) => {
    const integer = Math.floor(input)
    const index = integer & 255
    const fraction = input - integer
    const smooth =
      fraction *
      fraction *
      fraction *
      (fraction * (fraction * 6 - 15) + 10)
    const first = permutation[index] / 255
    const second = permutation[index + 1] / 255
    return first + smooth * (second - first)
  }
}

function createSky(
  size: number,
  geometries: Set<THREE.BufferGeometry>,
  materials: Set<THREE.Material>,
  textures: Set<THREE.Texture>,
): THREE.Mesh {
  const canvas = document.createElement('canvas')
  canvas.width = 2
  canvas.height = 512
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Unable to create sky texture')

  const gradient = context.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, '#192e4c')
  gradient.addColorStop(0.4, '#1e3558')
  gradient.addColorStop(0.7, '#2a446e')
  gradient.addColorStop(1, '#345488')
  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const geometry = new THREE.SphereGeometry(size, 20, 20)
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide,
  })
  textures.add(texture)
  geometries.add(geometry)
  materials.add(material)

  const sky = new THREE.Mesh(geometry, material)
  sky.translateZ(-3)
  return sky
}

function createTerrain(
  size: number,
  random: () => number,
  geometries: Set<THREE.BufferGeometry>,
  materials: Set<THREE.Material>,
): THREE.Mesh {
  const widthSegments = Math.max(1, Math.floor(size))
  const heightSegments = Math.max(1, Math.floor(size / 2))
  const geometry = new THREE.PlaneGeometry(
    size,
    size,
    widthSegments,
    heightSegments,
  )
  const positions = geometry.attributes.position.array as Float32Array
  for (let index = 0; index < positions.length; index += 3) {
    positions[index] += (random() - 0.5) * 0.5
    positions[index + 1] += (random() - 0.5) * 0.2
    positions[index + 2] += (random() - 0.5) * 0.5
  }
  geometry.attributes.position.needsUpdate = true
  geometry.computeVertexNormals()

  const material = new THREE.MeshStandardMaterial({
    color: 0x213344,
    side: THREE.DoubleSide,
    flatShading: true,
    roughness: 1,
  })
  geometries.add(geometry)
  materials.add(material)

  const terrain = new THREE.Mesh(geometry, material)
  terrain.rotation.x = -Math.PI / 2
  terrain.translateZ(-3)
  return terrain
}

function createStars(
  maxDepth: number,
  random: () => number,
  geometries: Set<THREE.BufferGeometry>,
  materials: Set<THREE.Material>,
): THREE.InstancedMesh {
  const geometry = new THREE.CircleGeometry(0.075, 20)
  const material = new THREE.MeshBasicMaterial({ color: 0xfffef5 })
  geometries.add(geometry)
  materials.add(material)

  const stars = new THREE.InstancedMesh(geometry, material, 480)
  const transform = new THREE.Object3D()
  for (let index = 0; index < 480; index += 1) {
    const angle = randomGaussian(random, -Math.PI / 2, Math.PI / 2)
    const radius = maxDepth + random() * 20
    const scale = random()
    transform.position.set(
      radius * Math.cos(angle),
      random() * (maxDepth / 2) - 3,
      radius * Math.sin(angle),
    )
    transform.scale.setScalar(scale)
    transform.updateMatrix()
    stars.setMatrixAt(index, transform.matrix)
  }
  stars.instanceMatrix.needsUpdate = true
  return stars
}

function createOrbRecords(
  scene: THREE.Scene,
  women: readonly Woman[],
  layout: ReturnType<typeof createOrbLayout>,
  random: () => number,
  geometries: Set<THREE.BufferGeometry>,
  materials: Set<THREE.Material>,
  textures: Set<THREE.Texture>,
): OrbRecord[] {
  const referenceCounts = women.map(({ references }) => references)
  const minimumReferences = Math.min(...referenceCounts)
  const maximumReferences = Math.max(...referenceCounts)
  const ages = women.map(({ year, birthYear }) =>
    birthYear === null ? 36 : Math.max(1, year - birthYear),
  )
  const minimumAge = Math.min(...ages)
  const maximumAge = Math.max(...ages)
  const geometry = new THREE.PlaneGeometry(1.25, 1.25)
  geometries.add(geometry)

  return women.map((woman, index) => {
    const canvas = document.createElement('canvas')
    canvas.width = ORB_CANVAS_SIZE * 2
    canvas.height = ORB_CANVAS_SIZE * 2
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Unable to create orb texture')
    context.scale(2, 2)
    context.globalCompositeOperation = 'screen'

    const referenceProgress =
      maximumReferences === minimumReferences
        ? 0
        : (woman.references - minimumReferences) /
          (maximumReferences - minimumReferences)
    const circleCount = Math.min(4 + Math.floor(referenceProgress * 4), 7)
    const age = ages[index]
    const speed =
      maximumAge === minimumAge
        ? 0.5
        : 0.5 +
          ((Math.log(age) - Math.log(minimumAge)) /
            (Math.log(maximumAge) - Math.log(minimumAge))) *
            0.5
    const circles = Array.from({ length: circleCount }, (_, circleIndex) => ({
      centerX: ORB_CANVAS_SIZE / 2,
      centerY: ORB_CANVAS_SIZE / 2,
      radius: randomGaussian(random, ORB_RADIUS, 10),
      color: warmGlowColor(randomGaussian(random, 0.25, 0.15)),
      offset: 1000 * index + 10 * circleIndex,
      circleCount,
      speed,
    }))

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    textures.add(texture)
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 1,
    })
    materials.add(material)

    const node = layout.nodes[index]
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(-node.x, node.height, node.depth)
    scene.add(mesh)

    return {
      mesh,
      context,
      texture,
      circles,
      originalDepth: node.depth,
    }
  })
}

function paintOrb(
  orb: OrbRecord,
  elapsedSeconds: number,
  motionPhase: number,
  noise: (value: number) => number,
): void {
  const { context, circles } = orb
  context.clearRect(0, 0, ORB_CANVAS_SIZE, ORB_CANVAS_SIZE)
  context.globalCompositeOperation = 'screen'

  circles.forEach((circle, circleIndex) => {
    const noiseValue = noise(circle.offset + motionPhase)
    const phase =
      (circleIndex * elapsedSeconds) / (circle.circleCount * circle.speed) +
      circle.offset
    let x =
      0.65 *
      noiseValue *
      circle.radius *
      Math.cos(phase) *
      Math.sin(phase)
    let y = 0.5 * noiseValue * circle.radius * Math.sin(phase)
    x *= circleIndex % 2 ? Math.cos(phase) : Math.sin(phase)
    x += circle.centerX + 10 * noiseValue
    y += circle.centerY + 10 * noiseValue

    GLOW_ALPHA.forEach((alpha, glowIndex) => {
      context.globalAlpha = alpha
      context.fillStyle = circle.color
      context.beginPath()
      context.arc(x, y, GLOW_RADIUS[glowIndex] * circle.radius, 0, Math.PI * 2)
      context.fill()
    })
  })
  context.globalAlpha = 1
  orb.texture.needsUpdate = true
}

export function createVisualization(
  canvas: HTMLCanvasElement,
  women: readonly Woman[],
): Visualization {
  const geometries = new Set<THREE.BufferGeometry>()
  const materials = new Set<THREE.Material>()
  const textures = new Set<THREE.Texture>()
  const random = createSeededRandom(0x4f414d)
  const noise = createNoise(0x574f4d)
  const scene = new THREE.Scene()
  const layout = createOrbLayout(women)
  const camera = new THREE.PerspectiveCamera(45, 1, 1, 1000)
  camera.position.set(0, 0, 10)
  camera.lookAt(0, 0, -2 * layout.maxDepth)

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  })
  renderer.setClearColor(0x192e4c, 1)

  const mainLight = new THREE.DirectionalLight(0x8ab8e8, 8)
  mainLight.position.set(30, 80, 60)
  scene.add(mainLight)
  const fillLight = new THREE.DirectionalLight(0x7aa8d8, 3)
  fillLight.position.set(-40, 60, 50)
  scene.add(fillLight)
  scene.add(new THREE.AmbientLight(0x70a8d8, 0.8))

  const terrainSize = layout.maxDepth + 20
  scene.add(createTerrain(terrainSize, random, geometries, materials))
  scene.add(createSky(terrainSize, geometries, materials, textures))
  scene.add(createStars(layout.maxDepth, random, geometries, materials))
  const orbs = createOrbRecords(
    scene,
    women,
    layout,
    random,
    geometries,
    materials,
    textures,
  )

  let disposed = false

  return {
    render(elapsedSeconds, scrollProgress, focusIndex, motionEnabled) {
      if (disposed) return
      const cameraPosition = getCameraPosition(
        scrollProgress,
        layout.nodes,
        layout.maxDepth,
      )
      camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
      const animationTime = motionEnabled ? elapsedSeconds : 0
      const motionPhase = animationTime * 0.6

      orbs.forEach((orb, index) => {
        const distance = Math.abs(orb.originalDepth - camera.position.z)
        if (distance < 25 || index === focusIndex || focusIndex === -1) {
          paintOrb(orb, animationTime, motionPhase, noise)
        }
        const scale = THREE.MathUtils.clamp(
          1 - (distance > 15 ? (distance - 15) / 22.5 : 0),
          0,
          1,
        )
        orb.mesh.scale.setScalar(scale)
      })

      renderer.render(scene, camera)
    },

    resize(width, height, pixelRatio) {
      if (disposed) return
      const safeWidth = Math.max(1, width)
      const safeHeight = Math.max(1, height)
      camera.aspect = safeWidth / safeHeight
      camera.updateProjectionMatrix()
      renderer.setPixelRatio(Math.min(Math.max(1, pixelRatio), 2))
      renderer.setSize(safeWidth, safeHeight, false)
    },

    dispose() {
      if (disposed) return
      disposed = true
      geometries.forEach((geometry) => geometry.dispose())
      materials.forEach((material) => material.dispose())
      textures.forEach((texture) => texture.dispose())
      renderer.renderLists.dispose()
      renderer.dispose()
      scene.clear()
    },
  }
}
