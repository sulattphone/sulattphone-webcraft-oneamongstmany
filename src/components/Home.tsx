import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import womenData from '../data/women3d'
import styles from './Home.module.css'

// Perlin noise (1D) — original uses p5.js noise()
const noisePerm = new Uint8Array(512)
for (let i = 0; i < 256; i++) noisePerm[i] = noisePerm[i + 256] = Math.floor(Math.random() * 256)
function noise1(x: number): number {
  const X = Math.floor(x) & 255
  x -= Math.floor(x)
  const u = x * x * x * (x * (x * 6 - 15) + 10)
  const a = noisePerm[X] / 255
  const b = noisePerm[X + 1] / 255
  return a + u * (b - a)
}

// Golden color interpolation — warm yellow core to distinctly orange outer circles
function cubehelixLerp(t: number): string {
  const r = Math.round(0xFF + (0xF0 - 0xFF) * t)
  const g = Math.round(0xE0 + (0x88 - 0xE0) * t)
  const b = Math.round(0x70 + (0x40 - 0x70) * t)
  return `rgb(${r},${g},${b})`
}

// Faithful replica of oneamongstmany.com visualization
const WOMEN = womenData

// Mobile detection for outro iframe sizing (from original index.html isMobile)
const isPhone = /iPhone|iPod|Android.+Mobile|Windows Phone|BlackBerry|Opera Mini|Mobile.*Firefox/i.test(navigator.userAgent)

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const orbsRef = useRef<THREE.Mesh[]>([])
  const animationRef = useRef<number>(0)
  const scrollProgressRef = useRef<number>(0)
  const displayIndexRef = useRef<number>(-1)
  
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [displayIndex, setDisplayIndex] = useState(-1)
  const [showTextIndex, setShowTextIndex] = useState(-1)

  // Refs for animate-loop access (avoid stale closures)
  const showTextIndexRef = useRef<number>(-1)
  const showVisualizationRef = useRef<boolean>(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const outroRef = useRef<HTMLDivElement>(null)

  // Intro opacity states based on scroll
  const [scrollOpacity, setScrollOpacity] = useState(1)
  const [arrowOpacity, setArrowOpacity] = useState(1)
  const [legendOpacity, setLegendOpacity] = useState(0)
  const [fancyOpacity, setFancyOpacity] = useState(1)
  const [timelapseOpacity, setTimelapseOpacity] = useState(0)
  const [introOpacity, setIntroOpacity] = useState(1)
  const [showVisualization, setShowVisualization] = useState(false)

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    const params = new URLSearchParams(window.location.search)
    if (params.has('viz')) {
      const vh = parseFloat(params.get('viz') || '12')
      window.scrollTo(0, window.innerHeight * vh)
      setTimeout(() => window.scrollTo(0, window.innerHeight * vh), 100)
      setTimeout(() => window.scrollTo(0, window.innerHeight * vh), 500)
      setIntroOpacity(0)
      setShowVisualization(true)
      setScrollOpacity(0)
      setLegendOpacity(0)
      setFancyOpacity(0)
      setTimelapseOpacity(0)
    } else {
      window.scrollTo(0, 0)
    }
    if (params.has('orb')) {
      const idx = parseInt(params.get('orb') || '0', 10)
      setDisplayIndex(idx)
      setCurrentIndex(idx)
      setShowTextIndex(idx)
      setShowVisualization(true)
      setIntroOpacity(0)
      setScrollOpacity(0)
      setLegendOpacity(0)
      setFancyOpacity(0)
      setTimelapseOpacity(0)
    }
  }, [])

  // Handle scroll and update current woman and intro opacities
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      
      // Intro animation based on scroll - now 10 viewport heights (reduced a little from 16 per user feedback, still 2.5x original for more scroll to 2nd page)
      const introScrollDistance = window.innerHeight * 10
      const introProgress = Math.min(scrollY / introScrollDistance, 1)
      const timelineProgress = introProgress * 3
      
      // scrollOpacity: first screen fades out over 0 to 0.9 timeline with overlap to avoid gap at transition
      const newScrollOpacity = Math.max(0, Math.min(1, 1 - timelineProgress / 0.9))
      setScrollOpacity(newScrollOpacity)

      // arrowOpacity: persist through page 1 and 2, fade out only going into the 3D viz (2.2→2.9)
      let newArrowOpacity = 1
      if (timelineProgress >= 2.2 && timelineProgress < 2.9) {
        newArrowOpacity = 1 - ((timelineProgress - 2.2) / 0.7)
      } else if (timelineProgress >= 2.9) {
        newArrowOpacity = 0
      }
      setArrowOpacity(newArrowOpacity)
      
      // fancyOpacity: first video visible 0-1, fade out 1-1.4
      let newFancyOpacity = 1
      if (timelineProgress >= 1) {
        newFancyOpacity = timelineProgress < 1.4 ? 1 - ((timelineProgress - 1) / 0.4) : 0
      }
      setFancyOpacity(newFancyOpacity)
      
      // legendOpacity: second screen clearly visible between first and third - fade in 0.8-1.3, stay 1.3-2.2, fade out 2.2-2.9 to ensure no skip gap
      let newLegendOpacity = 0
      if (timelineProgress >= 0.8 && timelineProgress < 1.3) {
        newLegendOpacity = (timelineProgress - 0.8) / 0.5
      } else if (timelineProgress >= 1.3 && timelineProgress < 2.2) {
        newLegendOpacity = 1
      } else if (timelineProgress >= 2.2 && timelineProgress < 2.9) {
        newLegendOpacity = 1 - ((timelineProgress - 2.2) / 0.7)
      }
      setLegendOpacity(newLegendOpacity)
      
      // timelapseOpacity: second video matches legend timing for second screen background
      let newTimelapseOpacity = 0
      if (timelineProgress >= 0.8 && timelineProgress < 1.3) {
        newTimelapseOpacity = (timelineProgress - 0.8) / 0.5
      } else if (timelineProgress >= 1.3 && timelineProgress < 2.2) {
        newTimelapseOpacity = 1
      } else if (timelineProgress >= 2.2 && timelineProgress < 2.9) {
        newTimelapseOpacity = 1 - ((timelineProgress - 2.2) / 0.7)
      }
      setTimelapseOpacity(newTimelapseOpacity)
      
      // introOpacity: fade out over last part of intro to smoothly transition to visualization 3rd screen, not abrupt
      const newIntroOpacity = timelineProgress < 2.2 ? 1 : timelineProgress < 3 ? Math.max(0, 1 - ((timelineProgress - 2.2) / 0.8)) : 0
      setIntroOpacity(newIntroOpacity)
      
      // Show visualization when intro starts fading out around 85% through intro scroll for smooth crossfade, not abrupt jump from 1st to 3rd skipping 2nd
      setShowVisualization(scrollY > introScrollDistance * 0.82)
      
      // Update current woman based on scroll past intro
      const introHeight = window.innerHeight * 10
      const visualizationScrollY = Math.max(0, scrollY - introHeight)
      const maxVisualizationScroll = document.body.scrollHeight - window.innerHeight - introHeight
      const progress = maxVisualizationScroll > 0 ? Math.min(visualizationScrollY / maxVisualizationScroll, 1) : 0
      scrollProgressRef.current = progress
      // Text display is driven by the GSAP camera timeline in the animate loop (synced with camera)
      // Track currentIndex for displayIndex (orb highlight) — matches timeline: each orb = 2 units, pullback = 2
      let index: number
      if (progress < 0.01) {
        index = -1
      } else {
        const adjustedProgress = (progress - 0.01) / 0.99
        const exact = adjustedProgress * (WOMEN.length + 1) // +1 accounts for pullback share
        index = Math.min(Math.floor(exact), WOMEN.length - 1)
      }

      if (index !== currentIndex) {
        setCurrentIndex(index)
        setTimeout(() => setDisplayIndex(index), 200)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentIndex])

  // Initialize Three.js scene - FAITHFUL to original grace.js code
  useEffect(() => {
    if (!canvasRef.current) return

    const scene = new THREE.Scene()
    // Original uses transparent background with alpha renderer
    sceneRef.current = scene

    // FAITHFUL CAMERA from original: Perspective 45, pos 0,0,10, lookAt 0,0,-2*maxZ
    const count = WOMEN.length
    const maxZPosition = 1.5 * count // original 1.5*d.length = 27 for 18
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    )
    camera.position.set(0, 0, 10)
    camera.lookAt(0, 0, -2 * maxZPosition)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x192e4c, 1)
    rendererRef.current = renderer

    // Cool blue-tinted lights — stronger directional for hilly facet shading
    const dirLight = new THREE.DirectionalLight(0x8ab8e8, 8)
    dirLight.position.set(30, 80, 60)
    scene.add(dirLight)
    // Second directional from the left so left-side slopes also show facet shading
    const dirLightLeft = new THREE.DirectionalLight(0x7aa8d8, 3)
    dirLightLeft.position.set(-40, 60, 50)
    scene.add(dirLightLeft)
    const ambientLight = new THREE.AmbientLight(0x70a8d8, 0.8)
    scene.add(ambientLight)

    // FAITHFUL TERRAIN from original: PlaneGeometry(t,t,t,t/2) t=maxZ+20, jitter random, rotateX -PI/2, translateZ -3
    const t = maxZPosition + 20
    const groundGeo = new THREE.PlaneGeometry(t, t, t, t / 2)
    const gPos = groundGeo.attributes.position.array as Float32Array
    for (let i = 0; i < gPos.length; i += 3) {
      gPos[i] += (Math.random() - 0.5) * 0.5 // x jitter -0.25..0.25
      gPos[i + 1] += (Math.random() - 0.5) * 0.2 // y jitter -0.1..0.1
      gPos[i + 2] += (Math.random() - 0.5) * 0.5 // z jitter -0.25..0.25
    }
    groundGeo.attributes.position.needsUpdate = true
    groundGeo.computeVertexNormals()
    // Terrain: MeshStandardMaterial with flatShading for facet shading
    // Deep blue base — white lights brighten to original's blue terrain
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x213344,
      side: THREE.DoubleSide,
      flatShading: true,
      roughness: 1
    })
    const ground = new THREE.Mesh(groundGeo, groundMat)
    ground.rotation.x = -Math.PI / 2
    ground.translateZ(-3)
    scene.add(ground)

    // Sky sphere with subtle gradient: dark navy top → slightly lighter navy bottom
    // Canvas y=0 (top) maps to sphere zenith, y=512 (bottom) maps to horizon
    const skyCanvas = document.createElement('canvas')
    skyCanvas.width = 2
    skyCanvas.height = 512
    const skyCtx = skyCanvas.getContext('2d')!
    const skyGradient = skyCtx.createLinearGradient(0, 0, 0, 512)
    skyGradient.addColorStop(0, '#192e4c') // dark navy zenith (perfect, keep)
    skyGradient.addColorStop(0.4, '#1e3558') // mid transition
    skyGradient.addColorStop(0.7, '#2a446e') // lighter approaching horizon
    skyGradient.addColorStop(1, '#345488') // clearly lighter blue at horizon
    skyCtx.fillStyle = skyGradient
    skyCtx.fillRect(0, 0, 2, 512)
    const skyTexture = new THREE.CanvasTexture(skyCanvas)
    skyTexture.colorSpace = THREE.SRGBColorSpace // prevent linear→sRGB brightening
    const bgSphere = new THREE.Mesh(
      new THREE.SphereGeometry(t, 20, 20),
      new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide })
    )
    bgSphere.translateZ(-3)
    scene.add(bgSphere)

    const randomGaussian = (mean = 0, std = 1) => {
      let u = 0, v = 0
      while (u === 0) u = Math.random()
      while (v === 0) v = Math.random()
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * std + mean
    }

    // EXACT ORIGINAL STARS from grace.js
    const starGeo = new THREE.CircleGeometry(0.075, 20)
    const starMat = new THREE.MeshBasicMaterial({ color: 0xFFFEF5 })
    for (let i = 0; i < 480; i++) {
      const star = new THREE.Mesh(starGeo, starMat)
      const angle = randomGaussian(-Math.PI / 2, Math.PI / 2)
      const r = maxZPosition + Math.random() * 20
      const sc = Math.random()
      star.position.set(
        r * Math.cos(angle),
        Math.random() * (maxZPosition / 2) - 3,
        r * Math.sin(angle)
      )
      star.scale.set(sc, sc, sc)
      scene.add(star)
    }

    // Create glowing orbs using ORIGINAL SITE LOGIC from grace.ce88a159.js
    // Use existing maxZPosition from above (27), compute scales
    const years = WOMEN.map(w => w.year)
    const backs = WOMEN.map(w => w.backlinks)
    const minYear = Math.min(...years)
    const maxYear = Math.max(...years)
    const minBack = Math.min(...backs)
    const maxBack = Math.max(...backs)
    const lerp = (v: number, dMin: number, dMax: number, rMin: number, rMax: number) => {
      if (dMax === dMin) return rMin
      const t = (v - dMin) / (dMax - dMin)
      return rMin + t * (rMax - rMin)
    }
    // Scale functions matching original d3 scaleLinear
    const yForBacklinks = (b: number) => lerp(b, minBack, maxBack, -1, 2) // original range [-1,2]
    const zForYear = (y: number) => lerp(y, minYear, maxYear, 0, -maxZPosition) // original [0, -maxZ]

    // d3.forceSimulation exact replication:
    // 1. Initialize nodes in phyllotaxis pattern (d3's default initialization)
    // 2. Run velocity Verlet with forceCollide(1.25) + forceX(0), 1000 ticks
    const simNodes = WOMEN.map((w, i) => {
      const fy = zForYear(w.year) // fixed y (year → z position)
      // d3 phyllotaxis initialization: initialRadius=10, initialAngle=π*(3-√5)
      const initialRadius = 10
      const initialAngle = Math.PI * (3 - Math.sqrt(5))
      const radius = initialRadius * Math.sqrt(0.5 + i)
      const angle = i * initialAngle
      return {
        x: radius * Math.cos(angle),
        y: fy, // fixed y
        vx: 0,
        vy: 0,
        height: yForBacklinks(w.backlinks),
        woman: w
      }
    })

    // d3 simulation parameters
    let alpha = 1.0
    const alphaMin = 0.001
    const alphaDecay = 1 - Math.pow(alphaMin, 1.0 / 300.0)
    const velocityDecay = 0.4
    const collideRadius = 1.25

    for (let tick = 0; tick < 1000; tick++) {
      alpha += (0 - alpha) * alphaDecay

      // forceX(0) with moderate strength 0.07 — between too-tight 0.1 and too-wide 0.02
      for (const n of simNodes) {
        n.vx += (0 - n.x) * 0.07 * alpha
      }

      // forceCollide(1.25) — check pairs for overlap
      for (let i = 0; i < simNodes.length; i++) {
        for (let j = i + 1; j < simNodes.length; j++) {
          const a = simNodes[i]
          const b = simNodes[j]
          const dx = (a.x + a.vx) - (b.x + b.vx)
          const dy = (a.y + a.vy) - (b.y + b.vy)
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < collideRadius * 2 && dist > 0.0001) {
            const overlap = (collideRadius * 2 - dist) / dist * alpha * 0.5
            const fx = dx * overlap
            a.vx += fx
            b.vx -= fx
            // y is fixed (fy set), so don't apply dy force
          }
        }
      }

      // Integrate: velocity decay + position update
      for (const n of simNodes) {
        n.vx *= (1 - velocityDecay)
        n.x += n.vx
        // y is fixed, no integration needed
      }
    }

    // Swap same-year orb positions to match original site's physical layout:
    // Barbara Paulson (1) ↔ Kathleen Booth (2), Jaime Levy (12) ↔ Nancy Hafkin (13)
    for (const [a, b] of [[1, 2], [12, 13]] as const) {
      const tmpX = simNodes[a].x
      const tmpHeight = simNodes[a].height
      simNodes[a].x = simNodes[b].x
      simNodes[a].height = simNodes[b].height
      simNodes[b].x = tmpX
      simNodes[b].height = tmpHeight
    }

    // Horizontal tweaks: mesh x = -simNode.x, so positive offset here = left on screen
    // First orb (Adele Goldstine) toward the left side of the screen
    simNodes[0].x += 1.0
    // Shift first three orbs to the right by 0.5
    simNodes[0].x -= 0.5
    simNodes[1].x -= 0.5
    simNodes[2].x -= 0.5
    // Shift Grace Hopper (3) to the left by 0.5
    simNodes[3].x += 0.5

    // Original orb constants from grace.js
    const canvasSize = 256
    const circleRadiusBase = 80
    const alphaVals = [0.05, 0.1, 0.85] // slightly reduced brightest pass to prevent white-out
    const radiusScales = [1, 0.75, 0.5]
    // reuse randomGaussian from stars above
    const orbCanvases: { canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, circles: any[] }[] = []
    const orbs: THREE.Mesh[] = []

    WOMEN.forEach((woman, s) => {
      const canvas = document.createElement('canvas')
      canvas.width = canvasSize * 2
      canvas.height = canvasSize * 2
      const ctx = canvas.getContext('2d')!
      ctx.scale(2, 2)
      ;(ctx as any).globalCompositeOperation = 'screen'

      // Original: numCircles from scaleQuantize(references) → 4..7
      const refs = WOMEN.map(w => w.references)
      const minRef = Math.min(...refs)
      const maxRef = Math.max(...refs)
      const numCircles = maxRef === minRef ? 4 : Math.min(4 + Math.floor(((woman.references - minRef) / (maxRef - minRef)) * 4), 7)
      // Original: speed from scaleLog(age at achievement, default 36) → [0.5, 1]
      const ages = WOMEN.map(w => w.birthYear ? w.year - (w.birthYear as number) : 36)
      const minAge = Math.min(...ages)
      const maxAge2 = Math.max(...ages)
      const age = woman.birthYear ? woman.year - (woman.birthYear as number) : 36
      const speed = maxAge2 === minAge ? 0.5 : 0.5 + (Math.log(age) - Math.log(minAge)) / (Math.log(maxAge2) - Math.log(minAge)) * 0.5

      const circles = []
      for (let e = 0; e < numCircles; e++) {
        circles.push({
          cx: canvasSize / 2,
          cy: canvasSize / 2,
          radius: randomGaussian(circleRadiusBase, 10),
          color: cubehelixLerp(Math.max(0, Math.min(1, randomGaussian(0.25, 0.15)))),
          offset: 1000 * s + 10 * e,
          numCircles,
          speed
        })
      }
      orbCanvases.push({ canvas, ctx, circles })

      const simNode = simNodes[s]
      // EXACT original positions: x=simX, y=height (backlinks→[-1,2]), z=simY (year→[0,-maxZ]) - keep at origin
      const x = -simNode.x // negate to match original's left-right orientation
      const y = simNode.height
      const z = simNode.y

      // EXACT original plane size: 1.25 fixed, not based on backlinks (references used for circle count, not size)
      const geometry = new THREE.PlaneGeometry(1.25, 1.25, 1, 1)
      const texture = new THREE.CanvasTexture(canvas)
      texture.colorSpace = THREE.SRGBColorSpace // render golden colors as authored, not linear-brightened
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 1 })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(x, y, z)
      ;(mesh as any).userData = { originalX: x, originalY: y, originalZ: z, canvas, ctx, circles, woman, floatOffset: Math.random()*Math.PI*2 }
      scene.add(mesh)
      orbs.push(mesh)
    })
    orbsRef.current = orbs as any

    // GSAP camera timeline — each orb gets 1 unit move + 1 unit hold (segment = 2)
    // Hold gives the user a couple more scrolls at each orb before moving on
    camera.lookAt(0, 0, -2 * maxZPosition)
    const ORB_SEGMENT = 2 // 1 move + 1 hold per orb
    const camTl = gsap.timeline({ paused: true })
    orbs.forEach((_mesh: THREE.Mesh, i: number) => {
      const orb = simNodes[i]
      camTl.to(camera.position, {
        x: -orb.x, y: orb.height, z: orb.y + 2,
        duration: 1
      }, i * ORB_SEGMENT)
    })
    // Final pullback after all orbs
    camTl.to(camera.position, {
      x: 0, y: 0, z: -maxZPosition - 5,
      duration: 2
    }, orbs.length * ORB_SEGMENT)

    // Animation loop - FAITHFUL to original grace.js: drawCircles with noise, distance scale, GSAP camera scrub
    const clock = new THREE.Clock()
    let globalM = 0
    const animate = () => {
      const elapsedTime = clock.getElapsedTime()
      globalM += 0.01 // original M+=0.01

      // Draw circles + info on orbs - optimized: only update near orbs to avoid GPU stall blank in headless (was updating all 18 512x512 textures each frame → 18MB/frame → stall)
      const curDisplayIndex = displayIndexRef.current
      orbs.forEach((orb: any, idx: number) => {
        const { ctx, circles } = orb.userData
        const orbZ = orb.userData.originalZ as number
        const camZ = camera.position.z
        const distZ = Math.abs(orbZ - camZ)
        const isHighlighted = idx === curDisplayIndex
        const isNear = distZ < 25 || isHighlighted
        if (!isNear && curDisplayIndex !== -1) return

        ctx.clearRect(0, 0, canvasSize, canvasSize)
        ;(ctx as any).globalCompositeOperation = 'screen'
        circles.forEach((circle: any, a: number) => {
          const n = circle.cx, o = circle.cy, h = circle.radius, c = circle.color, l = circle.offset, d = circle.numCircles, u = circle.speed
          const f = noise1(l + globalM) // original: p5.noise(offset + M)
          const p = (a * elapsedTime) / (d * u) + l
          let mx = 0.65 * f * h * Math.cos(p) * Math.sin(p)
          let vy = 0.5 * f * h * Math.sin(p)
          mx *= a % 2 ? Math.cos(p) : Math.sin(p)
          mx += n + 10 * f
          vy += o + 10 * f
          for (let e = 0; e < 3; e++) {
            ctx.globalAlpha = alphaVals[e]
            ctx.fillStyle = c
            ctx.beginPath()
            ctx.arc(mx, vy, radiusScales[e] * h, 0, Math.PI * 2, false)
            ctx.fill()
          }
        })
        // Text now displayed as HTML overlay on top of orbs (no background, not fitting orb bounds strictly) per latest feedback, not inside canvas
        // Keep canvas only with glowing circles like original
        orb.material.map.needsUpdate = true
      });

      // Orb fade by distance — original: scale 1-(dist>15 ? (dist-15)/22.5 : 0)
      const camZF = camera.position.z
      orbs.forEach((orb: any) => {
        const dist = Math.abs(orb.userData.originalZ - camZF)
        const s = 1 - (dist > 15 ? (dist - 15) / (1.5 * 15) : 0)
        orb.scale.set(s, s, s)
      });

      // Camera: scrub GSAP timeline by scroll progress
      // Map scrollProgressRef (0..1) to camTl duration (0..orbs.length+2)
      const prog = scrollProgressRef.current
      const tlTime = prog * camTl.duration()
      camTl.seek(tlTime, false) // seek without suppressing events

      // Sync text with camera timeline — each orb segment is 2 units (1 move + 1 hold)
      // Text swaps at i*2 + 0.5, fades in →0.7, holds through the hold period →1.7, fades out →1.9
      let textIdx = Math.floor((tlTime - 0.5) / ORB_SEGMENT)
      let textOpacity = 0
      if (textIdx >= 0 && textIdx < orbs.length && tlTime < orbs.length * ORB_SEGMENT) {
        const localTime = tlTime - textIdx * ORB_SEGMENT
        if (localTime < 0.5) textOpacity = 0
        else if (localTime < 0.7) textOpacity = (localTime - 0.5) / 0.2
        else if (localTime < 1.7) textOpacity = 1
        else if (localTime < 1.9) textOpacity = 1 - (localTime - 1.7) / 0.2
        else textOpacity = 0
      } else {
        textIdx = -1
      }
      if (textIdx !== showTextIndexRef.current) {
        showTextIndexRef.current = textIdx
        setShowTextIndex(textIdx)
      }
      if (overlayRef.current) {
        const vis = showVisualizationRef.current && textIdx >= 0 ? textOpacity : 0
        overlayRef.current.style.opacity = String(vis)
        // visibility:hidden kills pointer events on invisible text/links
        overlayRef.current.style.visibility = vis > 0 ? 'visible' : 'hidden'
      }

      // Outro — original: outroOpacity 0→1 at orbs.length + 0.5, duration 0.5
      // Our timeline: pullback starts at orbs.length * ORB_SEGMENT
      const outroStart = orbs.length * ORB_SEGMENT + 0.5
      const outroOpacity = Math.max(0, Math.min(1, (tlTime - outroStart) / 0.5))
      if (outroRef.current) {
        const vis = showVisualizationRef.current ? outroOpacity : 0
        outroRef.current.style.opacity = String(vis)
        // visibility:hidden prevents the invisible iframe from capturing clicks
        outroRef.current.style.visibility = vis > 0 ? 'visible' : 'hidden'
      }

      renderer.render(scene, camera)
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationRef.current)
      renderer.dispose()
    }
  }, [])

  useEffect(() => { displayIndexRef.current = displayIndex }, [displayIndex])
  useEffect(() => { showVisualizationRef.current = showVisualization }, [showVisualization])

  const currentWoman = showTextIndex >= 0 ? WOMEN[showTextIndex] : null

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Intro Section with Video Background - self-hosted local assets */}
      <div className={styles.intro} style={{ opacity: introOpacity }}>
        <div className={styles.videos}>
          <video 
            autoPlay muted loop playsInline
            style={{ opacity: fancyOpacity }}
          >
            <source src="/videos/fancy_reduced.mp4" type="video/mp4" />
          </video>
          <video 
            autoPlay muted loop playsInline
            style={{ opacity: timelapseOpacity }}
          >
            <source src="/videos/timelapse_reduced.mp4" type="video/mp4" />
          </video>
        </div>
        <div className={styles.overlayImage}></div>
        
        <div className={styles.subsection} style={{ opacity: scrollOpacity }}>
          <h1 className={styles.title}>One Amongst Many</h1>
          <div className={styles.byline}>
            by <a href="http://cdacanay.com/" target="_blank" rel="noopener noreferrer">Christina Dacanay</a>,{' '}
            <a href="https://tina.pizza/" target="_blank" rel="noopener noreferrer">Tina Rungsawang</a>, and{' '}
            <a href="http://sxywu.com/" target="_blank" rel="noopener noreferrer">Shirley Wu</a>
          </div>
          <p>
            Young women entering fields dominated by men often feel like there is no history of people like them in their field. We know now that this is an issue of storytelling, not of history. Women have been contributing to every field, however invisibly, since the beginning of time.
          </p>
          <p>
            One Amongst Many attempts to illuminate the histories of women in computing that have been diminished or erased. It is a data installation where each woman is arranged in a field by the year of her greatest achievement, and the height of the orb correlated to her renown. Every orb starts dimmed, and gets brighter each time another person reads about them, literally shedding light on the woman's accomplishments.
          </p>
        </div>

        <div className={styles.subsection} style={{ opacity: legendOpacity }}>
          <p>
            One Amongst Many is a physical data visualization created at New York University's ITP Master's program. The original installation consisted of 16-20 illuminated orbs suspended from the ceiling, each with a woman's biography inside. This website is a digital analog to the installation, so that people around the world can learn about these incredible women in computing.
          </p>
        </div>

        <div className={styles.arrow} style={{ opacity: arrowOpacity }}>⌄</div>
      </div>

      {/* 3D Visualization Canvas - always rendered behind intro for smooth crossfade, no opacity toggle glitch */}
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        aria-label="3D visualization of women in computing, showing glowing orbs representing individuals arranged in a landscape. Scroll to explore each woman's story."
        role="img"
      />
      
      {/* Progress indicator */}
      {showVisualization && showTextIndex >= 0 && (
        <div className={styles.progress} aria-live="polite">
          {showTextIndex + 1} of {WOMEN.length}
        </div>
      )}
      {/* Orb info - text synced to camera timeline via overlayRef opacity in animate loop */}
      <div ref={overlayRef} className={styles.overlay} style={{ opacity: 0, visibility: 'hidden' }}>
        {currentWoman && (
          <div className={styles.orbText} key={showTextIndex}>
            <div className={styles.orbYear}><strong>{currentWoman.year}</strong></div>
            <div className={styles.orbName}>{currentWoman.name}</div>
            <div className={styles.orbFields}><em>{currentWoman.fields}</em></div>
            <div className={styles.orbSummary}>{currentWoman.shortSummary}</div>
            <p className={styles.readMoreLine}>
              <a href={currentWoman.url} target="_blank" rel="noopener noreferrer" className={styles.readMore}>
                read more
              </a>
              {' →'}
            </p>
          </div>
        )}
      </div>

      {/* Outro - original Infobox.vue outro template: YouTube embed + credits, fades in after final pullback */}
      <div ref={outroRef} className={styles.outro} style={{ opacity: 0, visibility: 'hidden' }}>
        <p>
          <iframe
            width={isPhone ? 340 : 854}
            height={isPhone ? 240 : 480}
            src="https://www.youtube.com/embed/bEM0CRdCrQo"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </p>
        <p className={styles.outroCredits}>
          <strong>Read more about One Amongst Many here:</strong><br />
          <a href="http://www.cdacanay.com/itp-blog/2019/12/23/one-amongst-many-connecting-womxn-in-computing" target="_blank" rel="noopener noreferrer">Christina's design-centric recounting</a><br />
          <a href="https://tina.pizza/one-amongst-many" target="_blank" rel="noopener noreferrer">Tina's physical computing story</a><br />
          <a href="http://www.datasketch.es/june/" target="_blank" rel="noopener noreferrer">Shirley's data visualization write-up</a>
        </p>
        <p className={styles.outroFooter} style={{ fontSize: '.85em' }}><em>Made with love in Brooklyn, 2019.</em></p>
      </div>
    </div>
  )
}
