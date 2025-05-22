import * as THREE from "three";

interface SceneOptions {
  canvas: HTMLCanvasElement;
  backgroundColor: string;
}

export function createScene({ canvas, backgroundColor }: SceneOptions) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  if (backgroundColor === "transparent") {
    renderer.setClearColor(0x000000, 0);
  } else {
    renderer.setClearColor(backgroundColor);
  }

  camera.position.z = 5;

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", handleResize);

  const cleanup = () => {
    window.removeEventListener("resize", handleResize);
    scene.clear();
    renderer.dispose();
  };

  return { scene, camera, renderer, cleanup };
}

export function createCyberpunkGrid(scene: THREE.Scene, color: THREE.Color) {
  const gridSize = 50;
  const divisions = 50;
  const gridHelper = new THREE.GridHelper(gridSize, divisions, color, color);
  gridHelper.position.y = -1;
  scene.add(gridHelper);

  const animate = () => {
    gridHelper.rotation.x += 0.001;
    gridHelper.rotation.z += 0.001;
  };

  return { animate };
}

export function createLightParticles(
  scene: THREE.Scene,
  count: number,
  color: THREE.Color,
  size: number
) {
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

    velocities[i * 3] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
  }

  particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({ color, size });
  const points = new THREE.Points(particles, material);
  scene.add(points);

  const animate = () => {
    const positions = points.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      if (Math.abs(positions[i * 3]) > 5) velocities[i * 3] *= -1;
      if (Math.abs(positions[i * 3 + 1]) > 5) velocities[i * 3 + 1] *= -1;
      if (Math.abs(positions[i * 3 + 2]) > 5) velocities[i * 3 + 2] *= -1;
    }
    points.geometry.attributes.position.needsUpdate = true;
  };

  return { animate };
}

export function createGradientBackground(scene: THREE.Scene) {
  const geometry = new THREE.PlaneGeometry(10, 10);
  const material = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      void main() {
        gl_FragColor = vec4(vUv.x, vUv.y, 1.0, 1.0);
      }
    `,
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.z = -1;
  scene.add(plane);

  const animate = () => {
    // Gradient doesn't need animation, but included for consistency
  };

  return { animate };
}
