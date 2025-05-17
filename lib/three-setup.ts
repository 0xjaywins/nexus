// This file will be imported dynamically to avoid SSR issues
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

export interface ThreeSceneOptions {
  canvas: HTMLCanvasElement
  backgroundColor?: string
  cameraPosition?: [number, number, number]
  orbitControls?: boolean
}

export function createScene(options: ThreeSceneOptions) {
  const { canvas, backgroundColor = "#0A0A0A", cameraPosition = [0, 0, 5], orbitControls = false } = options

  // Create scene
  const scene = new THREE.Scene()
  if (backgroundColor === "transparent") {
    scene.background = null
  } else {
    scene.background = new THREE.Color(backgroundColor)
  }

  // Create camera
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
  camera.position.set(...cameraPosition)

  // Create renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  })
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Add orbit controls if needed
  let controls: OrbitControls | null = null
  if (orbitControls) {
    controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = false
  }

  // Handle resize
  const handleResize = () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  }

  window.addEventListener("resize", handleResize)

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate)

    if (controls) controls.update()

    renderer.render(scene, camera)
  }

  animate()

  return {
    scene,
    camera,
    renderer,
    controls,
    cleanup: () => {
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
      if (controls) controls.dispose()
    },
  }
}

export function createWireframeSphere(
  scene: THREE.Scene,
  radius = 2,
  color = 0x00ffee,
  position: [number, number, number] = [0, 0, 0],
) {
  const geometry = new THREE.SphereGeometry(radius, 16, 16)
  const wireframe = new THREE.WireframeGeometry(geometry)
  const material = new THREE.LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.5,
    linewidth: 1,
  })

  const sphere = new THREE.LineSegments(wireframe, material)
  sphere.position.set(...position)
  scene.add(sphere)

  // Animation function
  const animate = () => {
    sphere.rotation.x += 0.001
    sphere.rotation.y += 0.002
  }

  return {
    mesh: sphere,
    animate,
  }
}

export function createParticleSystem(scene: THREE.Scene, count = 500, color = 0x00ffee, size = 0.05, radius = 3) {
  const particles = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    // Create particles in a spherical distribution
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random()) // Cube root for more uniform distribution

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }

  particles.setAttribute("position", new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    color,
    size,
    transparent: true,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  })

  const particleSystem = new THREE.Points(particles, material)
  scene.add(particleSystem)

  // Animation function
  const animate = () => {
    particleSystem.rotation.y += 0.001
  }

  return {
    mesh: particleSystem,
    animate,
  }
}

export function createCyberpunkGrid(scene: THREE.Scene, color = 0x00ffee) {
  // Create a grid of lines
  const gridSize = 20
  const gridDivisions = 20
  const gridColor = color

  // Create horizontal grid lines
  const horizontalGrid = new THREE.Group()

  for (let i = -gridSize / 2; i <= gridSize / 2; i += gridSize / gridDivisions) {
    const lineGeometry = new THREE.BufferGeometry()
    const lineVertices = new Float32Array([-gridSize / 2, 0, i, gridSize / 2, 0, i])

    lineGeometry.setAttribute("position", new THREE.BufferAttribute(lineVertices, 3))

    const opacity = Math.abs(i) < 0.1 ? 0.5 : 0.15 // Make center line brighter

    const lineMaterial = new THREE.LineBasicMaterial({
      color: gridColor,
      transparent: true,
      opacity: opacity,
    })

    const line = new THREE.Line(lineGeometry, lineMaterial)
    horizontalGrid.add(line)
  }

  // Create vertical grid lines
  const verticalGrid = new THREE.Group()

  for (let i = -gridSize / 2; i <= gridSize / 2; i += gridSize / gridDivisions) {
    const lineGeometry = new THREE.BufferGeometry()
    const lineVertices = new Float32Array([i, 0, -gridSize / 2, i, 0, gridSize / 2])

    lineGeometry.setAttribute("position", new THREE.BufferAttribute(lineVertices, 3))

    const opacity = Math.abs(i) < 0.1 ? 0.5 : 0.15 // Make center line brighter

    const lineMaterial = new THREE.LineBasicMaterial({
      color: gridColor,
      transparent: true,
      opacity: opacity,
    })

    const line = new THREE.Line(lineGeometry, lineMaterial)
    verticalGrid.add(line)
  }

  // Rotate the grid to be visible from the camera
  horizontalGrid.rotation.x = Math.PI / 2
  verticalGrid.rotation.x = Math.PI / 2

  // Position the grid lower in the scene
  horizontalGrid.position.y = -2
  verticalGrid.position.y = -2

  // Add grid to scene
  scene.add(horizontalGrid)
  scene.add(verticalGrid)

  // Animation function
  const animate = () => {
    // Subtle movement of the grid
    const time = Date.now() * 0.0002
    horizontalGrid.position.z = Math.sin(time) * 0.5
    verticalGrid.position.z = Math.sin(time) * 0.5
  }

  return {
    mesh: [horizontalGrid, verticalGrid],
    animate,
  }
}

export function createLightParticles(scene: THREE.Scene, count = 300, color = 0x00ffee, size = 0.03) {
  // Create particles
  const particlesGeometry = new THREE.BufferGeometry()
  const particlesCount = count

  // Create positions array
  const positions = new Float32Array(particlesCount * 3)
  const velocities = new Float32Array(particlesCount * 3)
  const alphas = new Float32Array(particlesCount)

  for (let i = 0; i < particlesCount; i++) {
    // Random positions in a sphere
    const radius = 5 + Math.random() * 5
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)

    // Random velocities (very slow)
    velocities[i * 3] = (Math.random() - 0.5) * 0.01
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01

    // Random alpha values for twinkling
    alphas[i] = Math.random()
  }

  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

  // Create material with custom shader for twinkling
  const particlesMaterial = new THREE.PointsMaterial({
    color: color,
    size: size,
    transparent: true,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    opacity: 0.7,
  })

  const particles = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particles)

  // Animation function
  const animate = () => {
    const positions = particles.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < particlesCount; i++) {
      // Update positions based on velocities
      positions[i * 3] += velocities[i * 3]
      positions[i * 3 + 1] += velocities[i * 3 + 1]
      positions[i * 3 + 2] += velocities[i * 3 + 2]

      // Twinkle effect - vary opacity
      alphas[i] += 0.01 * (Math.random() - 0.5)
      alphas[i] = Math.max(0.2, Math.min(1, alphas[i]))
    }

    particles.geometry.attributes.position.needsUpdate = true

    // Gentle rotation
    particles.rotation.y += 0.0005
  }

  return {
    mesh: particles,
    animate,
  }
}

export function createGradientBackground(scene: THREE.Scene) {
  // Create a large sphere that surrounds the scene
  const geometry = new THREE.SphereGeometry(50, 32, 32)
  geometry.scale(-1, 1, 1) // Flip the geometry inside out

  // Create a shader material with a gradient
  const material = new THREE.ShaderMaterial({
    uniforms: {
      color1: { value: new THREE.Color("#0A0A0A") },
      color2: { value: new THREE.Color("#1A1A2A") },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec2 vUv;
      void main() {
        gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
      }
    `,
    side: THREE.BackSide,
  })

  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  return {
    mesh,
    animate: () => {}, // No animation needed
  }
}

export function createSpinningToken(
  scene: THREE.Scene,
  radius = 0.5,
  color = 0x00ffee,
  position: [number, number, number] = [0, 0, 0],
) {
  // Create a coin-like geometry
  const geometry = new THREE.CylinderGeometry(radius, radius, 0.1, 32)

  // Create material with glow effect
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.8,
  })

  const token = new THREE.Mesh(geometry, material)
  token.position.set(...position)
  token.rotation.x = Math.PI / 2 // Make it flat like a coin

  // Add edge glow
  const edgeGeometry = new THREE.TorusGeometry(radius, 0.03, 16, 100)
  const edgeMaterial = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.9,
  })

  const edge = new THREE.Mesh(edgeGeometry, edgeMaterial)
  token.add(edge)

  scene.add(token)

  // Animation function - gentler rotation
  const animate = () => {
    token.rotation.y += 0.01
  }

  return {
    mesh: token,
    animate,
  }
}
