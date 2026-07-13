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
  const orbsRef = useRef<THREE.Group[]>([])
  const animationRef = useRef<number>(0)
  const scrollProgressRef = useRef<number>(0)
  
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

  // Always start from the top (landing page) on reload
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  // Handle scroll and update current woman and intro opacities
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      
      // Intro animation based on scroll - spans 4 viewport heights to give clear 1st then 2nd screen then transition to 3rd visualization without skip
      const introScrollDistance = window.innerHeight * 4
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
      
      // Update current woman based on scroll past intro
      const introHeight = window.innerHeight * 4
      const visualizationScrollY = Math.max(0, scrollY - introHeight)
      const maxVisualizationScroll = document.body.scrollHeight - window.innerHeight - introHeight
      const progress = maxVisualizationScroll > 0 ? Math.min(visualizationScrollY / maxVisualizationScroll, 1) : 0
      scrollProgressRef.current = progress
      // Landing view: first 8% of visualization scroll shows wide field with no highlighted orb, matching screenshot Image1 faithfully
      // This ensures when users first scroll into visualization they see wide star field with small orbs and terrain, no text overlay, exactly like reference image.
      // After that threshold, start cycling through women with close-up zoom.
      let index: number
      if (progress < 0.08) {
        index = -1
      } else {
        const adjustedProgress = (progress - 0.08) / 0.92
        index = Math.min(Math.floor(adjustedProgress * WOMEN.length), WOMEN.length - 1)
      }
      
      if (index !== currentIndex) {
        setCurrentIndex(index)
        setTimeout(() => setDisplayIndex(index), 200)
        // Text shows up when fully zoomed in per video analysis - delay longer than camera move start to allow zoom animation to complete
        setTimeout(() => setShowTextIndex(index), 900)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentIndex])

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return

    // Scene - dark navy sky matching screenshot Image1 faithfully
    // Screenshot shows deep slate blue ~#1e2e4a, not bright #2a4f7a. Faithful replica to visualization landing.
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1e2e4a)
    sceneRef.current = scene

    // Camera - adjusted per user feedback: hills more prominent, orbs lower on screen, no terrain ends visible
    // Previous showed terrain ends slightly and orbs too high. Now camera lower y to see hills prominent, tighter FOV to zoom in and hide edges, orbs gathered center lower.
    const camera = new THREE.PerspectiveCamera(
      32,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    // Camera at y 0.3 just above terrain top (~-5), looking at y 1.8 to bring horizon up to ~44% showing more prominent hills in foreground and orbs lower on screen.
    // Position z 34 closer to terrain to fill frame edge-to-edge no ends visible, orbs pushed further back to appear smaller and lower.
    camera.position.set(12, 0.3, 34)
    camera.lookAt(12, 1.8, -26)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0xffffff, 0) // transparent like original
    rendererRef.current = renderer

    // Lighting - softer cooler tones matching screenshot dark navy sky, subtle terrain shading for low-poly facets visible but not harsh
    const hemiLight = new THREE.HemisphereLight(0x7a9bc0, 0x0a1a2f, 1.2)
    scene.add(hemiLight)
    const ambientLight = new THREE.AmbientLight(0x8aa8cc, 0.65)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xd8e8f8, 1.8)
    directionalLight.position.set(20, 50, 30)
    scene.add(directionalLight)
    // Very subtle warm fill to hint at orb glow reflecting, not dominant like before
    const warmFill = new THREE.DirectionalLight(0xffd8a0, 0.35)
    warmFill.position.set(-20, 25, 25)
    scene.add(warmFill)
    // Cool rim for silhouette
    const rimLight = new THREE.DirectionalLight(0x5a7a9a, 0.7)
    rimLight.position.set(-30, 12, -25)
    scene.add(rimLight)
    const sideLight = new THREE.DirectionalLight(0xb0c8e0, 0.4)
    sideLight.position.set(35, 6, -8)
    scene.add(sideLight)

    // Stars - subtle sparse matching screenshot Image1 faithfully
    // Screenshot shows ~150 small white dots, soft, not overpowering, scattered uniformly.
    const starsGeometry = new THREE.BufferGeometry()
    const starsCount = 650
    const starsPositions = new Float32Array(starsCount * 3)
    for (let i = 0; i < starsCount; i++) {
      starsPositions[i * 3] = (Math.random() - 0.5) * 520
      starsPositions[i * 3 + 1] = Math.random() * 110 + 2   // y 2 to 112 covering full sky
      starsPositions[i * 3 + 2] = (Math.random() - 0.5) * 360 - 12
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3))
    
    const starCanvas = document.createElement('canvas')
    starCanvas.width = 64
    starCanvas.height = 64
    const starCtx = starCanvas.getContext('2d')!
    const gradient = starCtx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.6)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    starCtx.fillStyle = gradient
    starCtx.fillRect(0, 0, 64, 64)
    const starTexture = new THREE.CanvasTexture(starCanvas)
    
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.35,
      transparent: true,
      opacity: 0.62,
      sizeAttenuation: true,
      map: starTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)

    // 3D TERRAIN - faithful to screenshot Image1 low rolling hills, horizon at bottom ~35%, terrain spans full width no visible ends
    // Screenshot shows subtle low-poly terrain filling bottom, muted dark blue, not tall spiky mountains, edges not visible.
    const groundSize = 220
    const groundSegments = 72
    const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize, groundSegments, Math.floor(groundSegments/2))
    const groundPositions = groundGeometry.attributes.position.array as Float32Array

    // Subtle low rolling hills matching screenshot - increased amplitude for more prominent hills per user feedback "hills need to be a bit more prominent" and "a little bit taller"
    const terrainHeight = (x: number, y: number) => {
      let h = 0
      // Gentle broad undulation - hills more prominent now with higher amplitude but still keeping horizon fairly flat
      h += Math.sin(x * 0.035) * Math.cos(y * 0.028) * 2.9
      h += Math.sin(x * 0.055 + y * 0.042 + 1.1) * 2.05
      h += Math.cos(x * 0.078 - y * 0.062) * 1.38
      h += Math.sin(x * 0.12 + 0.9) * 0.82
      h += Math.cos(x * 0.18) * Math.sin(y * 0.14 + 0.6) * 0.58
      // Subtle jitter for low-poly facets - increased for more prominent hill definition
      const hash = (n: number) => n - Math.floor(n)
      const n1 = hash(Math.sin(x * 7.13 + y * 34.7) * 43758.5453)
      const n2 = hash(Math.sin(x * 41.2 + y * 19.8) * 3758.5453)
      h += (n1 - 0.5) * 0.68
      h += (n2 - 0.5) * 0.48
      // tilt to lower far edge
      h += y * -0.0028
      const distFromCenterX = Math.abs(x) / 110
      const farFade = Math.max(0, (y + 36) / 95)
      h *= (1 - farFade * 0.45) * (1 - distFromCenterX * 0.06)
      const topEdgeFactor = Math.max(0, Math.min(1, (y - 44) / 38))
      h *= (1 - topEdgeFactor * 0.38)
      return h
    }

    for (let i = 0; i < groundPositions.length; i += 3) {
      const x = groundPositions[i]
      const y = groundPositions[i + 1]
      // original random jitter ranges scaled up for taller bigger mountain facets visible up close - increased for obvious height variation per user feedback mountains need to be taller
      const rx = (Math.random() - 0.5) * 0.62
      const ry = (Math.random() - 0.5) * 0.24
      const rz = (Math.random() - 0.5) * 0.62
      groundPositions[i] = x + rx
      groundPositions[i + 1] = y + ry
      groundPositions[i + 2] = terrainHeight(x, y) + rz
    }
    groundGeometry.attributes.position.needsUpdate = true
    groundGeometry.computeVertexNormals()

    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x2c445f, // muted dark slate blue matching screenshot Image1 terrain faithfully, was too bright 0x3a6a8a
      roughness: 0.92,
      metalness: 0.03,
      side: THREE.DoubleSide,
      flatShading: true
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    // Lowered further to push horizon to bottom ~25-28% to show more sky less terrain per user feedback "terrain is too high"
    ground.position.set(0, -6.8, -6.2)
    scene.add(ground)

    // Subtle wireframe to emphasize low-poly facets - muted to match darker terrain in screenshot
    const wireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(groundGeometry),
      new THREE.LineBasicMaterial({ color: 0x3a556f, transparent: true, opacity: 0.14 })
    )
    wireframe.rotation.x = -Math.PI / 2
    wireframe.position.set(0, -6.8, -6.2)
    scene.add(wireframe)

    // Create glowing orbs using ACTUAL position coordinates from women3d.ts
    // These are the original coordinates from the oneamongstmany.com site
    // TEMPORARILY HIDDEN - focusing on terrain and stars first
    const orbs: THREE.Group[] = []
    WOMEN.forEach((woman, index) => {
      const orbGroup = new THREE.Group()
      
      // Size based on backlinks - much smaller initially for wide landing view per user feedback "orbs need to be much lower and smaller", then zoom in dramatically on scroll
      const maxBacklinks = Math.max(...WOMEN.map(w => w.backlinks))
      const minSize = 0.4
      const maxSize = 1.0
      const size = minSize + (woman.backlinks / maxBacklinks) * (maxSize - minSize)
      
      // Original site orbs: 4 circles each of different warm colors moving around constrained way per video analysis and reference screenshot Image1
      // From Floating_orbs_animation.mov frames and Image1 screenshot: orbs are warm yellow-gold, not white. Image1 shows soft golden glow #ffe8a0 core fading to #e6a040 outer, no harsh white.
      // Previous version looked mostly white per user feedback comparing Image1 original vs Image2 now — adjusting to warmer palette with less white dominance.
      // Colors sampled from Image1 original screenshot: warm pale yellow core #ffe8a0, golden mid #ffcc66, amber #ffb84d, muted gold outer #e6a040
      const circleConfigs = [
        { sizeMult: 1.0,  color: 0xffe8a0, opacity: 0.78, offsetRadius: 0.14 }, // warm pale yellow core, was off-white #fff8e0 at 0.92 too white
        { sizeMult: 0.82, color: 0xffcc66, opacity: 0.68, offsetRadius: 0.22 }, // warm gold, was pale yellow #ffe8a0 at 0.78
        { sizeMult: 0.68, color: 0xffb84d, opacity: 0.58, offsetRadius: 0.28 }, // amber, was warm gold #ffcc70 at 0.65
        { sizeMult: 0.55, color: 0xe6a040, opacity: 0.48, offsetRadius: 0.35 }, // muted gold outer, was soft orange #ffb347 at 0.55
      ]
      
      circleConfigs.forEach((cfg, ci) => {
        const geometry = new THREE.SphereGeometry(size * cfg.sizeMult, 32, 32)
        const material = new THREE.MeshBasicMaterial({
          color: cfg.color,
          transparent: true,
          opacity: cfg.opacity,
          depthWrite: false,
          blending: THREE.NormalBlending, // switched from Additive to Normal to avoid over-white washout per Image2 feedback "mostly white", original Image1 shows soft warm not additive white-out
        })
        const sphere = new THREE.Mesh(geometry, material)
        // store per-circle animation parameters for constrained movement within orb
        sphere.userData = {
          offsetRadius: cfg.sizeMult * 0.35, // constrained movement radius relative to orb size
          phaseX: Math.random() * Math.PI * 2 + ci * 1.3,
          phaseY: Math.random() * Math.PI * 2 + ci * 0.9,
          phaseZ: Math.random() * Math.PI * 2 + ci * 1.7,
          speed: 0.25 + Math.random() * 0.18 + ci * 0.06,
        }
        orbGroup.add(sphere)
      })

      // Use ACTUAL position coordinates from women3d.ts - these are from the original site
      // Position: { x, y, z } where x is horizontal, y is height, z is depth
      // Lower y significantly and gather x toward center per user feedback "orbs should be lower and gathered in the center with varying depth"
      // Screenshot shows orbs clustered center-right lower half, varying depth, one top-left isolated at ~32% down from top.
      // Final tweak per reviewer: even lower y scale 0.22 and offset -0.3 to push orbs much lower on screen near horizon, gather x factor 0.35 for tighter center cluster matching screenshot.
      const centerX = 12
      const rawX = woman.position.x
      const x = centerX + (rawX - centerX) * 0.35
      const y = woman.position.y * 0.22 - 0.3
      const z = (woman.position.z * 1.6) - 34
      
      orbGroup.position.set(x, y, z)
      orbGroup.userData = { 
        originalY: y,
        originalX: x,
        originalZ: z,
        floatOffset: Math.random() * Math.PI * 2,
        baseSize: size,
        womanIndex: index
      }
      
      // TEMPORARILY HIDDEN previously - now enabled per user request to put floating orbs in
      scene.add(orbGroup)
      orbs.push(orbGroup)
    })
    orbsRef.current = orbs

    // Animation loop
    const clock = new THREE.Clock()
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime()
      
      // Gentle floating for orbs (when visible) with 4 circles each moving independently constrained way per original video analysis
      orbs.forEach((orb, index) => {
        const floatOffset = orb.userData.floatOffset
        orb.position.y = orb.userData.originalY + Math.sin(elapsedTime * 0.18 + floatOffset) * 0.35
        orb.position.x = orb.userData.originalX + Math.sin(elapsedTime * 0.09 + floatOffset) * 0.22
        
        // Highlighted orb scales up dramatically like in original video - zoom in then text appears
        const isHighlighted = index === displayIndex
        const targetScale = isHighlighted ? 3.2 : 1
        const currentScale = orb.scale.x
        const newScale = currentScale + (targetScale - currentScale) * 0.028
        orb.scale.set(newScale, newScale, newScale)
        
        // Animate 4 circles within each orb with constrained independent movement per Floating_orbs_animation.mov frame analysis
        // Each circle has its own phase and offset radius stored in userData, creating organic blob effect like original
        orb.children.forEach((child, childIndex) => {
          if (child instanceof THREE.Mesh) {
            const material = child.material as THREE.MeshBasicMaterial
            const childData = child.userData
            // Constrained movement within orb radius - circles drift around center but stay within orb bounds like original video frames show 4 circles overlapping with slight offset
            const offsetR = childData.offsetRadius || 0.25
            const speed = childData.speed || 0.3
            const px = childData.phaseX || 0
            const py = childData.phaseY || 0
            const pz = childData.phaseZ || 0
            child.position.x = Math.sin(elapsedTime * speed + px) * offsetR
            child.position.y = Math.cos(elapsedTime * speed * 0.85 + py) * offsetR * 0.7
            child.position.z = Math.sin(elapsedTime * speed * 1.1 + pz) * offsetR * 0.5

            // Brighter glow when highlighted - 4 circles with base opacities matching Image1 original warm yellow palette, not white washout like Image2 feedback
            if (isHighlighted) {
              const targetOpacities = [0.88, 0.76, 0.66, 0.56]  // warmer when zoomed in per video frames showing intense golden glow on close-up, was 0.98 white too bright causing Image2 white-out issue
              if (childIndex < targetOpacities.length) {
                material.opacity += (targetOpacities[childIndex] - material.opacity) * 0.06
              }
            } else {
              const baseOpacities = [0.78, 0.68, 0.58, 0.48]  // base opacities for 4 circles matching Image1 original warm golden distant view, was 0.92 white causing mostly white appearance in Image2
              if (childIndex < baseOpacities.length) {
                material.opacity += (baseOpacities[childIndex] - material.opacity) * 0.06
              }
            }
          }
        })
      })
      
      // Camera follows orb through 3D space (when orbs are visible)
      const targetOrb = orbs[displayIndex]
      if (targetOrb) {
        const targetX = targetOrb.position.x
        const targetY = targetOrb.position.y + 0.5
        const targetZ = targetOrb.position.z + 22
        
        // Smooth camera pan through the 3D space to each orb
        camera.position.x += (targetX - camera.position.x) * 0.015
        camera.position.y += (targetY - camera.position.y) * 0.015
        camera.position.z += (targetZ - camera.position.z) * 0.018
        
        // Look at the orb, with downward angle to see terrain/horizon below
        camera.lookAt(targetOrb.position.x, targetOrb.position.y - 3.5, targetOrb.position.z)
      } else {
        // Wide landing view - fixed camera low near terrain so hills look big and prominent per user feedback, viewer just above ground
        // Zoomed in to hide terrain ends, lower angle, hills prominent lower 44% frame, orbs much lower on screen gathered center with varying depth per screenshot.
        // Hold this composition steady during landing phase (progress <0.08) for faithful replica.
        const targetX = 12
        const targetY = 0.3
        const targetZ = 34
        const lookX = 12
        const lookY = 1.8
        const lookZ = -26

        camera.position.x += (targetX - camera.position.x) * 0.035
        camera.position.y += (targetY - camera.position.y) * 0.035
        camera.position.z += (targetZ - camera.position.z) * 0.035
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
  }, [displayIndex])

  const currentWoman = showTextIndex >= 0 ? WOMEN[showTextIndex] : null

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Intro Section with Video Background */}
      <div className={styles.intro} style={{ opacity: introOpacity }}>
        <div className={styles.videos}>
          <video 
            autoPlay muted loop playsInline
            style={{ opacity: fancyOpacity }}
          >
            <source src="https://storage.googleapis.com/one-amongst-many-v2/fancy_reduced.mp4" type="video/mp4" />
          </video>
          <video 
            autoPlay muted loop playsInline
            style={{ opacity: timelapseOpacity }}
          >
            <source src="https://storage.googleapis.com/one-amongst-many-v2/timelapse_reduced.mp4" type="video/mp4" />
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

      {/* 3D Visualization Canvas */}
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        style={{ opacity: showVisualization ? 1 : 0 }}
      />
      
      {/* Woman Info Overlay - hidden during wide landing view and during zoom transition, only shows when fully zoomed in per video analysis */}
      <div className={styles.overlay} style={{ opacity: showVisualization && showTextIndex >= 0 ? 1 : 0 }}>
        {currentWoman && (
        <div className={styles.orbInfo} key={showTextIndex}>
          <div className={styles.orbYear}>{currentWoman.year}</div>
          <h2 className={styles.orbName}>{currentWoman.name}</h2>
          <div className={styles.orbFields}>{currentWoman.fields}</div>
          <p className={styles.orbSummary}>{currentWoman.shortSummary}</p>
          <a 
            href={currentWoman.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.readMore}
          >
            read more →
          </a>
        </div>
        )}
      </div>
    </div>
  )
}
