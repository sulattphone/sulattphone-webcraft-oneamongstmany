import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import womenData from '../data/women3d'
import styles from './Home.module.css'

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

function cubehelixLerp(t: number): string {
  const r = Math.round(0xFF + (0xF0 - 0xFF) * t)
  const g = Math.round(0xE0 + (0x88 - 0xE0) * t)
  const b = Math.round(0x70 + (0x40 - 0x70) * t)
  return `rgb(${r},${g},${b})`
}

const WOMEN = womenData

const isPhone = /iPhone|iPod|Android.+Mobile|Windows Phone|BlackBerry|Opera Mini|Mobile.*Firefox/i.test(navigator.userAgent)

function createSkyTexture(size: number) {
  const canvas = document.createElement('canvas')
  canvas.width = 2
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createLinearGradient(0, 0, 0, 512)
  gradient.addColorStop(0, '#192e4c')
  gradient.addColorStop(0.4, '#1e3558')
  gradient.addColorStop(0.7, '#2a446e')
  gradient.addColorStop(1, '#345488')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 2, 512)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(size, 20, 20),
    new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide })
  )
  sphere.translateZ(-3)
  return sphere
}

function createTerrain(size: number) {
  const geo = new THREE.PlaneGeometry(size, size, size, size / 2)
  const pos = geo.attributes.position.array as Float32Array
  for (let i = 0; i < pos.length; i += 3) {
    pos[i] += (Math.random() - 0.5) * 0.5
    pos[i + 1] += (Math.random() - 0.5) * 0.2
    pos[i + 2] += (Math.random() - 0.5) * 0.5
  }
  geo.attributes.position.needsUpdate = true
  geo.computeVertexNormals()
  const mat = new THREE.MeshStandardMaterial({
    color: 0x213344,
    side: THREE.DoubleSide,
    flatShading: true,
    roughness: 1
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.rotation.x = -Math.PI / 2
  mesh.translateZ(-3)
  return mesh
}

function createStars(maxZ: number) {
  const randomGaussian = (mean = 0, std = 1) => {
    let u = 0, v = 0
    while (u === 0) u = Math.random()
    while (v === 0) v = Math.random()
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * std + mean
  }
  const geo = new THREE.CircleGeometry(0.075, 20)
  const mat = new THREE.MeshBasicMaterial({ color: 0xFFFEF5 })
  const stars: THREE.Mesh[] = []
  for (let i = 0; i < 480; i++) {
    const star = new THREE.Mesh(geo, mat)
    const angle = randomGaussian(-Math.PI / 2, Math.PI / 2)
    const r = maxZ + Math.random() * 20
    const sc = Math.random()
    star.position.set(
      r * Math.cos(angle),
      Math.random() * (maxZ / 2) - 3,
      r * Math.sin(angle)
    )
    star.scale.set(sc, sc, sc)
    stars.push(star)
  }
  return stars
}

type SimNode = { x: number; y: number; vx: number; vy: number; height: number; woman: typeof WOMEN[number] }

function runForceSimulation() {
  const years = WOMEN.map(w => w.year)
  const backs = WOMEN.map(w => w.backlinks)
  const minYear = Math.min(...years)
  const maxYear = Math.max(...years)
  const minBack = Math.min(...backs)
  const maxBack = Math.max(...backs)
  const maxZ = 1.5 * WOMEN.length
  const lerp = (v: number, dMin: number, dMax: number, rMin: number, rMax: number) => {
    if (dMax === dMin) return rMin
    return rMin + ((v - dMin) / (dMax - dMin)) * (rMax - rMin)
  }
  const yForBacklinks = (b: number) => lerp(b, minBack, maxBack, -1, 2)
  const zForYear = (y: number) => lerp(y, minYear, maxYear, 0, -maxZ)

  const nodes: SimNode[] = WOMEN.map((w, i) => {
    const fy = zForYear(w.year)
    const initialRadius = 10
    const initialAngle = Math.PI * (3 - Math.sqrt(5))
    const radius = initialRadius * Math.sqrt(0.5 + i)
    const angle = i * initialAngle
    return {
      x: radius * Math.cos(angle),
      y: fy,
      vx: 0,
      vy: 0,
      height: yForBacklinks(w.backlinks),
      woman: w
    }
  })

  let alpha = 1.0
  const alphaMin = 0.001
  const alphaDecay = 1 - Math.pow(alphaMin, 1.0 / 300.0)
  const velocityDecay = 0.4
  const collideRadius = 1.25

  for (let tick = 0; tick < 1000; tick++) {
    alpha += (0 - alpha) * alphaDecay
    for (const n of nodes) {
      n.vx += (0 - n.x) * 0.07 * alpha
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i]
        const b = nodes[j]
        const dx = (a.x + a.vx) - (b.x + b.vx)
        const dy = (a.y + a.vy) - (b.y + b.vy)
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < collideRadius * 2 && dist > 0.0001) {
          const overlap = ((collideRadius * 2 - dist) / dist) * alpha * 0.5
          const fx = dx * overlap
          a.vx += fx
          b.vx -= fx
        }
      }
    }
    for (const n of nodes) {
      n.vx *= 1 - velocityDecay
      n.x += n.vx
    }
  }

  for (const [a, b] of [[1, 2], [12, 13]] as const) {
    const tmpX = nodes[a].x
    const tmpH = nodes[a].height
    nodes[a].x = nodes[b].x
    nodes[a].height = nodes[b].height
    nodes[b].x = tmpX
    nodes[b].height = tmpH
  }

  nodes[0].x += 0.5
  nodes[1].x -= 0.5
  nodes[2].x -= 0.5
  nodes[3].x += 0.5

  return { nodes, maxZ }
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const scrollProgressRef = useRef<number>(0)
  const displayIndexRef = useRef<number>(-1)

  const [currentIndex, setCurrentIndex] = useState(-1)
  const [displayIndex, setDisplayIndex] = useState(-1)
  const [showTextIndex, setShowTextIndex] = useState(-1)

  const showTextIndexRef = useRef<number>(-1)
  const showVisualizationRef = useRef<boolean>(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const outroRef = useRef<HTMLDivElement>(null)

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
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const introScrollDistance = window.innerHeight * 10
      const introProgress = Math.min(scrollY / introScrollDistance, 1)
      const timelineProgress = introProgress * 3

      setScrollOpacity(Math.max(0, Math.min(1, 1 - timelineProgress / 0.9)))

      let newArrow = 1
      if (timelineProgress >= 2.2 && timelineProgress < 2.9) newArrow = 1 - (timelineProgress - 2.2) / 0.7
      else if (timelineProgress >= 2.9) newArrow = 0
      setArrowOpacity(newArrow)

      let newFancy = 1
      if (timelineProgress >= 1) newFancy = timelineProgress < 1.4 ? 1 - (timelineProgress - 1) / 0.4 : 0
      setFancyOpacity(newFancy)

      let newLegend = 0
      if (timelineProgress >= 0.8 && timelineProgress < 1.3) newLegend = (timelineProgress - 0.8) / 0.5
      else if (timelineProgress >= 1.3 && timelineProgress < 2.2) newLegend = 1
      else if (timelineProgress >= 2.2 && timelineProgress < 2.9) newLegend = 1 - (timelineProgress - 2.2) / 0.7
      setLegendOpacity(newLegend)

      let newTimelapse = 0
      if (timelineProgress >= 0.8 && timelineProgress < 1.3) newTimelapse = (timelineProgress - 0.8) / 0.5
      else if (timelineProgress >= 1.3 && timelineProgress < 2.2) newTimelapse = 1
      else if (timelineProgress >= 2.2 && timelineProgress < 2.9) newTimelapse = 1 - (timelineProgress - 2.2) / 0.7
      setTimelapseOpacity(newTimelapse)

      const newIntro = timelineProgress < 2.2 ? 1 : timelineProgress < 3 ? Math.max(0, 1 - (timelineProgress - 2.2) / 0.8) : 0
      setIntroOpacity(newIntro)

      setShowVisualization(scrollY > introScrollDistance * 0.82)

      const introHeight = window.innerHeight * 10
      const visualizationScrollY = Math.max(0, scrollY - introHeight)
      const maxVisualizationScroll = document.body.scrollHeight - window.innerHeight - introHeight
      const progress = maxVisualizationScroll > 0 ? Math.min(visualizationScrollY / maxVisualizationScroll, 1) : 0
      scrollProgressRef.current = progress

      let index: number
      if (progress < 0.01) index = -1
      else {
        const adjusted = (progress - 0.01) / 0.99
        const exact = adjusted * (WOMEN.length + 1)
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

  useEffect(() => {
    if (!canvasRef.current) return

    const scene = new THREE.Scene()
    const { nodes: simNodes, maxZ } = runForceSimulation()

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(0, 0, 10)
    camera.lookAt(0, 0, -2 * maxZ)

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x192e4c, 1)

    const dirLight = new THREE.DirectionalLight(0x8ab8e8, 8)
    dirLight.position.set(30, 80, 60)
    scene.add(dirLight)
    const dirLeft = new THREE.DirectionalLight(0x7aa8d8, 3)
    dirLeft.position.set(-40, 60, 50)
    scene.add(dirLeft)
    scene.add(new THREE.AmbientLight(0x70a8d8, 0.8))

    const terrainSize = maxZ + 20
    scene.add(createTerrain(terrainSize))
    scene.add(createSkyTexture(terrainSize))
    createStars(maxZ).forEach(s => scene.add(s))

    const canvasSize = 256
    const circleRadiusBase = 80
    const alphaVals = [0.05, 0.1, 0.85]
    const radiusScales = [1, 0.75, 0.5]

    const randomGaussian = (mean = 0, std = 1) => {
      let u = 0, v = 0
      while (u === 0) u = Math.random()
      while (v === 0) v = Math.random()
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * std + mean
    }

    const orbs: THREE.Mesh[] = []

    WOMEN.forEach((woman, s) => {
      const canvas = document.createElement('canvas')
      canvas.width = canvasSize * 2
      canvas.height = canvasSize * 2
      const ctx = canvas.getContext('2d')!
      ctx.scale(2, 2)
      ;(ctx as any).globalCompositeOperation = 'screen'

      const refs = WOMEN.map(w => w.references)
      const minRef = Math.min(...refs)
      const maxRef = Math.max(...refs)
      const numCircles = maxRef === minRef ? 4 : Math.min(4 + Math.floor(((woman.references - minRef) / (maxRef - minRef)) * 4), 7)

      const ages = WOMEN.map(w => (w.birthYear ? w.year - (w.birthYear as number) : 36))
      const minAge = Math.min(...ages)
      const maxAge = Math.max(...ages)
      const age = woman.birthYear ? woman.year - (woman.birthYear as number) : 36
      const speed = maxAge === minAge ? 0.5 : 0.5 + ((Math.log(age) - Math.log(minAge)) / (Math.log(maxAge) - Math.log(minAge))) * 0.5

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

      const simNode = simNodes[s]
      const x = -simNode.x
      const y = simNode.height
      const z = simNode.y

      const geometry = new THREE.PlaneGeometry(1.25, 1.25)
      const texture = new THREE.CanvasTexture(canvas)
      texture.colorSpace = THREE.SRGBColorSpace
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 1 })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(x, y, z)
      ;(mesh as any).userData = { originalX: x, originalY: y, originalZ: z, canvas, ctx, circles, floatOffset: Math.random() * Math.PI * 2 }
      scene.add(mesh)
      orbs.push(mesh)
    })

    const ORB_SEGMENT = 2
    const camTl = gsap.timeline({ paused: true })
    simNodes.forEach((orb, i) => {
      camTl.to(camera.position, { x: -orb.x, y: orb.height, z: orb.y + 2, duration: 1 }, i * ORB_SEGMENT)
    })
    camTl.to(camera.position, { x: 0, y: 0, z: -maxZ - 5, duration: 2 }, orbs.length * ORB_SEGMENT)

    const clock = new THREE.Clock()
    let globalM = 0

    const animate = () => {
      const elapsed = clock.getElapsedTime()
      globalM += 0.01

      const curDisplay = displayIndexRef.current
      orbs.forEach((orb: any, idx: number) => {
        const { ctx, circles } = orb.userData
        const distZ = Math.abs(orb.userData.originalZ - camera.position.z)
        const isHighlighted = idx === curDisplay
        const isNear = distZ < 25 || isHighlighted
        if (!isNear && curDisplay !== -1) return

        ctx.clearRect(0, 0, canvasSize, canvasSize)
        ;(ctx as any).globalCompositeOperation = 'screen'
        circles.forEach((circle: any, a: number) => {
          const f = noise1(circle.offset + globalM)
          const p = (a * elapsed) / (circle.numCircles * circle.speed) + circle.offset
          let mx = 0.65 * f * circle.radius * Math.cos(p) * Math.sin(p)
          let vy = 0.5 * f * circle.radius * Math.sin(p)
          mx *= a % 2 ? Math.cos(p) : Math.sin(p)
          mx += circle.cx + 10 * f
          vy += circle.cy + 10 * f
          for (let e = 0; e < 3; e++) {
            ctx.globalAlpha = alphaVals[e]
            ctx.fillStyle = circle.color
            ctx.beginPath()
            ctx.arc(mx, vy, radiusScales[e] * circle.radius, 0, Math.PI * 2)
            ctx.fill()
          }
        })
        orb.material.map.needsUpdate = true
      })

      orbs.forEach((orb: any) => {
        const dist = Math.abs(orb.userData.originalZ - camera.position.z)
        const s = 1 - (dist > 15 ? (dist - 15) / (1.5 * 15) : 0)
        orb.scale.set(s, s, s)
      })

      const tlTime = scrollProgressRef.current * camTl.duration()
      camTl.seek(tlTime, false)

      let textIdx = Math.floor((tlTime - 0.5) / ORB_SEGMENT)
      let textOpacity = 0
      if (textIdx >= 0 && textIdx < orbs.length && tlTime < orbs.length * ORB_SEGMENT) {
        const local = tlTime - textIdx * ORB_SEGMENT
        if (local < 0.5) textOpacity = 0
        else if (local < 0.7) textOpacity = (local - 0.5) / 0.2
        else if (local < 1.7) textOpacity = 1
        else if (local < 1.9) textOpacity = 1 - (local - 1.7) / 0.2
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
        overlayRef.current.style.visibility = vis > 0 ? 'visible' : 'hidden'
      }

      const outroStart = orbs.length * ORB_SEGMENT + 0.5
      const outroOpacity = Math.max(0, Math.min(1, (tlTime - outroStart) / 0.5))
      if (outroRef.current) {
        const vis = showVisualizationRef.current ? outroOpacity : 0
        outroRef.current.style.opacity = String(vis)
        outroRef.current.style.visibility = vis > 0 ? 'visible' : 'hidden'
      }

      renderer.render(scene, camera)
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
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
    <div className={styles.container}>
      <div className={styles.intro} style={{ opacity: introOpacity }}>
        <div className={styles.videos}>
          <video autoPlay muted loop playsInline style={{ opacity: fancyOpacity }}>
            <source src="/videos/fancy_reduced.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline style={{ opacity: timelapseOpacity }}>
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

      <canvas
        ref={canvasRef}
        className={styles.canvas}
        aria-label="3D visualization of women in computing, showing glowing orbs representing individuals arranged in a landscape. Scroll to explore each woman's story."
        role="img"
      />

      {showVisualization && showTextIndex >= 0 && (
        <div className={styles.progress} aria-live="polite">
          {showTextIndex + 1} of {WOMEN.length}
        </div>
      )}
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
