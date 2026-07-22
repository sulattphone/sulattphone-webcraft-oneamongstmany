import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import womenData from '../data/women3d'
import styles from './Home.module.css'

// Faithful replica of oneamongstmany.com visualization
const WOMEN = womenData

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
  
  // Intro opacity states based on scroll
  const [scrollOpacity, setScrollOpacity] = useState(1)
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
      
      // Update current woman based on scroll past intro - must match introScrollDistance 10*VH (reduced from 16)
      const introHeight = window.innerHeight * 10
      const visualizationScrollY = Math.max(0, scrollY - introHeight)
      const maxVisualizationScroll = document.body.scrollHeight - window.innerHeight - introHeight
      const progress = maxVisualizationScroll > 0 ? Math.min(visualizationScrollY / maxVisualizationScroll, 1) : 0
      scrollProgressRef.current = progress
      let index: number
      let textIdx: number
      if (progress < 0.01) {
        // Minimal wide view (0.01≈0.4VH) to avoid lag then bam - per feedback "first scrolls after landing page of viz, no camera move then bam zoomed at first orb"
        // Make visualization full form almost immediately, then camera starts moving gradually to first orb over its 2 scrolls turn, no lag
        index = -1
        textIdx = -1
      } else {
        const adjustedProgress = (progress - 0.01) / 0.99
        const exact = adjustedProgress * WOMEN.length
        index = Math.min(Math.floor(exact), WOMEN.length - 1)
        const frac = exact - index // 0..1 within current orb's 2 scrolls turn
        if (frac >= 0.15 && frac <= 0.85) {
          textIdx = index
        } else if (frac > 0.88) {
          textIdx = Math.min(index + 1, WOMEN.length - 1)
        } else {
          textIdx = -1
        }
      }
      
      if (index !== currentIndex) {
        setCurrentIndex(index)
        setTimeout(() => setDisplayIndex(index), 200)
      }
      // Text update without extra delay - only when orb centered per "text should only fade-in when orb is in center place"
      if (textIdx !== showTextIndex) {
        setShowTextIndex(textIdx)
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
    scene.background = new THREE.Color(0x1e3a58)
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
    renderer.setClearColor(0xffffff, 0)
    rendererRef.current = renderer

    // LIGHTS - brighter than original for less dark per user feedback
    const hemiLight = new THREE.HemisphereLight(0x8ab0d0, 0x1a2a4a, 2.0)
    scene.add(hemiLight)
    const ambientLight = new THREE.AmbientLight(0xa0c0e0, 1.6)
    scene.add(ambientLight)
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2)
    dirLight.position.set(0, 100, 100)
    scene.add(dirLight)

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
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a5a, // brighter terrain per user "terrain still pretty dark" - was #0B1E38 (11,30,56) very dark, now lighter #1E3A5A (30,58,90) more visible like original screenshot bottom 40%
      side: THREE.DoubleSide,
      flatShading: true,
      roughness: 0.85
    })
    const ground = new THREE.Mesh(groundGeo, groundMat)
    ground.rotation.x = -Math.PI / 2
    ground.translateZ(-3) // original translateZ(-3)
    scene.add(ground)

    // BACKGROUND SPHERE - matching sky #1e3a58, tiny bit lighter
    const bgSphere = new THREE.Mesh(
      new THREE.SphereGeometry(t, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0x1e3656, side: THREE.BackSide })
    )
    bgSphere.translateZ(-3)
    scene.add(bgSphere)

    const randomGaussian = (mean = 0, std = 1) => {
      let u = 0, v = 0
      while (u === 0) u = Math.random()
      while (v === 0) v = Math.random()
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * std + mean
    }
    // Stars as circles without glow per user feedback - original site has simple white circles, not glowy halos
    const starCanvas = document.createElement('canvas')
    starCanvas.width = 32
    starCanvas.height = 32
    const sCtx = starCanvas.getContext('2d')!
    // Solid white circle without soft glow gradient - just crisp circle on transparent bg like original CircleGeometry
    sCtx.fillStyle = 'rgba(255,255,255,1)'
    sCtx.beginPath()
    sCtx.arc(16, 16, 14, 0, Math.PI*2)
    sCtx.fill()
    const starTexture = new THREE.CanvasTexture(starCanvas)
    // STARS - revert to perfect size before, just remove glow per user feedback
    const starCount = 1500 // revert to 1500+600=2100 that had perfect size before too big
    const starsGeo = new THREE.BufferGeometry()
    const starsPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      // All stars use same faithful Gaussian distribution as original, not full circle which puts half behind camera - fixes "6200 coded but few visible"
      const angle = randomGaussian(-Math.PI / 2, Math.PI / 2) // original Gaussian centered -90°, keeps z negative (in front) not behind
      const dist = i < 480 ? (t + Math.random() * 20) : (t + 5 + Math.random() * 50) // 47-67 for first 480 faithful, 52-97 for extra but still limited vs 150 previously offscreen
      const y = i < 480 ? (Math.random() * (maxZPosition / 2 + 3) - 3) : (Math.random() * 40 + 3) // keep y within visible  -3..13.5 faithful + 3..43 extra, not 80+ offscreen top
      starsPos[i*3] = dist * Math.cos(angle) * 0.7 // 0.7 X squeeze to keep within visible frustum (was ±67 giving edge, now ±47*0.7=±33 closer to visible ±20)
      starsPos[i*3+1] = y
      starsPos[i*3+2] = dist * Math.sin(angle)
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3))
    const starsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.65, // perfect size before - was 1.4 perfect, reverting to 0.65 which had perfect size in earlier 2100 stars version
      map: starTexture,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      sizeAttenuation: true
    })
    const stars = new THREE.Points(starsGeo, starsMat)
    scene.add(stars)
    const brightCount = 600 // perfect size before
    const brightGeo = new THREE.BufferGeometry()
    const brightPos = new Float32Array(brightCount * 3)
    for (let i = 0; i < brightCount; i++) {
      const angle = randomGaussian(-Math.PI / 2, Math.PI / 2)
      const dist = t + Math.random() * 60
      const y = Math.random() * 50 + 8
      brightPos[i*3] = dist * Math.cos(angle) * 0.7
      brightPos[i*3+1] = y
      brightPos[i*3+2] = dist * Math.sin(angle)
    }
    brightGeo.setAttribute('position', new THREE.BufferAttribute(brightPos, 3))
    const brightMat = new THREE.PointsMaterial({
      color: 0xfffff0,
      size: 1.15, // perfect size before
      map: starTexture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      sizeAttenuation: true
    })
    const brightStars = new THREE.Points(brightGeo, brightMat)
    scene.add(brightStars)

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

    // Prepare nodes for force simulation: x=0, y=zForYear (fy fixed), height=yForBacklinks
    // Tuned for original_orbs_placement.png: wider X spread (collide 2.2) and taller Y spread (scale 2.5) to match original's 40% width, 30% height centered cluster
    const simNodes = WOMEN.map(w => ({
      x: 0,
      y: zForYear(w.year), // fy in original is year mapped, fixed Y
      height: yForBacklinks(w.backlinks),
      woman: w
    }))

    // EXACT original collide 1.25 gives screen x 0.315-0.641 width 0.325 and y 0.298-0.604 height 0.307 matching original target 0.30-0.70 w0.40 and 0.32-0.62 h0.30 - faithful!
    const collideRadius = 1.25
    const minDist = collideRadius * 2
    for (let iter = 0; iter < 1000; iter++) {
      for (const n of simNodes) {
        n.x += (0 - n.x) * 0.18 // stronger pull to center for tighter cluster like original 40% width, was 0.1 giving edge-to-edge 90% in faithful_exact2.png
      }
      // collide - only x moves (fy fixed)
      for (let i = 0; i < simNodes.length; i++) {
        for (let j = i+1; j < simNodes.length; j++) {
          const a = simNodes[i]
          const b = simNodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const absDy = Math.abs(dy)
          if (absDy >= minDist) continue // enough vertical separation, no collision
          // Need horizontal separation: |dx| >= sqrt(minDist^2 - dy^2)
          const neededDx = Math.sqrt(minDist*minDist - dy*dy)
          const currentAbsDx = Math.abs(dx)
          if (currentAbsDx < neededDx) {
            const overlap = neededDx - currentAbsDx
            // Push apart: if dx ~0, push randomly left/right
            if (Math.abs(dx) < 0.001) {
              const dir = (Math.random() > 0.5 ? 1 : -1) * (i % 2 === 0 ? 1 : -1)
              a.x += dir * overlap * 0.5
              b.x -= dir * overlap * 0.5
            } else {
              const sign = dx > 0 ? 1 : -1
              a.x += sign * overlap * 0.5
              b.x -= sign * overlap * 0.5
            }
          }
        }
      }
    }

    // Original orb alpha 0.05,0.1 too dark per user feedback "so dark" - increased for brighter glowing like video frames where orbs are prominent warm golden
    const canvasSize = 256
    const circleRadiusBase = 80
    const alphaVals = [0.22, 0.45, 1] // increased from 0.05,0.1 to 0.22,0.45 for brighter, less dark
    const radiusScales = [1, 0.75, 0.5]
    const colorStart = { r: 0xFF, g: 0xEB, b: 0x4B } // revert to before neon - #FFEB4B more yellow but not neon #FFEF00, per user "revert orbs colors to before"
    const colorEnd = { r: 0xFF, g: 0xC8, b: 0x2B } // #FFC82B golden amber, before #FFB700
    const lerpColor = (t: number) => {
      const r = Math.round(colorStart.r + (colorEnd.r - colorStart.r) * t)
      const g = Math.round(colorStart.g + (colorEnd.g - colorStart.g) * t)
      const b = Math.round(colorStart.b + (colorEnd.b - colorStart.b) * t)
      return `rgb(${r},${g},${b})`
    }
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

      // Number of circles based on references (approx via backlinks): 4-8
      const numCircles = Math.round(4 + (woman.backlinks / maxBack) * 4) // 4 to 8
      const age = 36 // simplified, original uses year-birthYear
      const speed = 0.5 + (age / 100) * 0.5 // 0.5-1

      const circles = []
      for (let e = 0; e < numCircles; e++) {
        circles.push({
          cx: canvasSize / 2,
          cy: canvasSize / 2,
          radius: randomGaussian(circleRadiusBase, 10),
          color: lerpColor(Math.max(0, Math.min(1, randomGaussian(0.25, 0.15)))),
          offset: 1000 * s + 10 * e,
          numCircles,
          speed
        })
      }
      orbCanvases.push({ canvas, ctx, circles })

      const simNode = simNodes[s]
      // EXACT original positions: x=simX, y=height (backlinks→[-1,2]), z=simY (year→[0,-maxZ]) - keep at origin
      const x = simNode.x
      const y = simNode.height
      const z = simNode.y

      // EXACT original plane size: 1.25 fixed, not based on backlinks (references used for circle count, not size)
      const geometry = new THREE.PlaneGeometry(1.25, 1.25, 1, 1)
      const texture = new THREE.CanvasTexture(canvas)
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 1, depthWrite: false, depthTest: false })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(x, y, z)
      ;(mesh as any).userData = { originalX: x, originalY: y, originalZ: z, canvas, ctx, circles, woman, floatOffset: Math.random()*Math.PI*2 }
      scene.add(mesh)
      orbs.push(mesh)
    })
    orbsRef.current = orbs as any

    // Animation loop - FAITHFUL to original grace.js: drawCircles with noise, distance scale, camera lerp
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
          const f = Math.sin(l + globalM) * 0.5 + 0.6
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

      // Orbs static and fixed size per user "should stay fixed" - no resizing on zoom in
      orbs.forEach((orb: any) => {
        orb.scale.set(1, 1, 1)
      });

      const scrollY = window.scrollY
      const introH = window.innerHeight * 10
      const maxVizScroll = Math.max(1, document.body.scrollHeight - window.innerHeight - introH)
      const vizScrollY = Math.max(0, scrollY - introH)
      const prog = vizScrollY / maxVizScroll
      const isWideCam = displayIndexRef.current === -1

      if (!isWideCam && orbs.length > 0) {
        const adjusted = (prog - 0.01) / 0.99
        const exactIndex = Math.min(adjusted * orbs.length, orbs.length - 0.001)
        const curIdx = Math.min(Math.floor(exactIndex), orbs.length - 1)
        const nextIdx = Math.min(curIdx + 1, orbs.length - 1)
        const frac = exactIndex - curIdx
        const wideX = 0, wideY = 0, wideZ = 10
        const wideLookX = 0, wideLookY = 0, wideLookZ = -2 * maxZPosition
        let tx, ty, tz, lx, ly, lz
        if (curIdx === 0) {
          // First orb: lerp from wide view to first orb over its 2 scrolls turn - fixes lag then bam jump
          const curOrb = orbs[0]
          tx = wideX + (curOrb.position.x - wideX) * frac
          ty = wideY + (curOrb.position.y + 0.6 - wideY) * frac
          tz = wideZ + (curOrb.position.z + 3 - wideZ) * frac
          lx = wideLookX + (curOrb.position.x - wideLookX) * frac
          ly = wideLookY + (curOrb.position.y - 0.8 - wideLookY) * frac
          lz = wideLookZ + (curOrb.position.z - 2 - wideLookZ) * frac
        } else {
          const curOrb = orbs[curIdx]
          const nextOrb = orbs[nextIdx]
          if (!curOrb || !nextOrb) return
          tx = curOrb.position.x + (nextOrb.position.x - curOrb.position.x) * frac
          ty = curOrb.position.y + (nextOrb.position.y - curOrb.position.y) * frac + 0.6
          tz = curOrb.position.z + (nextOrb.position.z - curOrb.position.z) * frac + 3
          lx = curOrb.position.x + (nextOrb.position.x - curOrb.position.x) * frac
          ly = curOrb.position.y + (nextOrb.position.y - curOrb.position.y) * frac - 0.8
          lz = curOrb.position.z + (nextOrb.position.z - curOrb.position.z) * frac - 2
        }

        camera.position.set(tx, ty, tz)
        camera.lookAt(lx, ly, lz)
      } else {
        // Wide view - visualization full form for 2 scrolls, but closer to first orb to avoid bam jump per "lag then bam at first orb" feedback
        // Original wide at 0,0,10 is 7 units from first orb at z+3 (2.5), causing jump. Bring to 0,1,6.5 for gradual start
        const targetX = 0
        const targetY = 1
        const targetZ = 6.5
        const lookX = 0
        const lookY = 0
        const lookZ = -12

        camera.position.set(targetX, targetY, targetZ)
        camera.lookAt(lookX, lookY, lookZ)
      }
      // If no orbs (hidden), camera now pans across background terrain on scroll instead of staying static
      
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

        <div className={styles.arrow} style={{ opacity: scrollOpacity }}>⌄</div>
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
      {/* Orb info - text on top of floating orbs, no background oval, not strictly in orb bounds, like original site, accurate content and link */}
      <div className={styles.overlay} style={{ opacity: showVisualization && showTextIndex >= 0 ? 1 : 0 }}>
        {currentWoman && (
          <div className={styles.orbText} key={showTextIndex}>
            <div className={styles.orbYear}>{currentWoman.year}</div>
            <h2 className={styles.orbName}>{currentWoman.name}</h2>
            <div className={styles.orbFields}>{currentWoman.fields}</div>
            <p className={styles.orbSummary}>{currentWoman.shortSummary}</p>
            <a href={currentWoman.url} target="_blank" rel="noopener noreferrer" className={styles.readMore}>
              read more -&gt;
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
