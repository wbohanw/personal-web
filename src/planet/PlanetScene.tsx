import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type MutableRefObject, type RefObject } from 'react'
import * as THREE from 'three'
import { makeCloud, makeWorld, point, RADIUS } from './world'
import { places, type PlaceId } from './data'
import { makePhotoBoards } from './photoBoards'
import WorldWalk, { type WalkInput, type WorldMode } from './WorldWalk'

export type ViewCommand = { place: PlaceId | null; serial: number }
type Props = {
  labels: RefObject<HTMLDivElement>
  command: ViewCommand
  night: boolean
  reducedMotion: boolean
  paused: boolean
  mode: WorldMode
  walkInput: MutableRefObject<WalkInput>
  onModeChange: (mode: WorldMode) => void
  onNearby: (place: PlaceId | null) => void
  onReady: () => void
  onError: () => void
  onSelect: (place: PlaceId) => void
}
function World({ labels, command, night, reducedMotion, paused, mode, walkInput, onModeChange, onNearby, onReady, onError, onSelect }: Props) {
  const { camera, gl, size, invalidate } = useThree()
  const world = useMemo(() => makeWorld(), [])
  useEffect(() => {
    const boards = makePhotoBoards(world, RADIUS, invalidate)
    world.add(boards.group)
    invalidate()
    return () => { world.remove(boards.group); boards.dispose() }
  }, [world, invalidate])
  const root = useRef<THREE.Group>(null)
  const clouds = useMemo(() => [makeCloud(), makeCloud(), makeCloud(), makeCloud()], [])
  const target = useRef(new THREE.Quaternion().setFromEuler(new THREE.Euler(.08, -.08, -.10)))
  const orientation = useRef(new THREE.Euler(.08, -.08, -.10, 'YXZ'))
  const drag = useRef({ active: false, x: 0, y: 0, moved: false })
  const reusable = useMemo(() => ({ world: new THREE.Vector3(), normal: new THREE.Vector3(), screen: new THREE.Vector3(), quaternion: new THREE.Quaternion() }), [])
  const light = useRef<THREE.DirectionalLight>(null)
  const ambient = useRef<THREE.AmbientLight>(null)
  useEffect(() => {
    const canvas = gl.domElement
    const down = (e: PointerEvent) => {
      if (e.button !== 0 || paused || mode !== 'overview') return
      drag.current = { active: true, x: e.clientX, y: e.clientY, moved: false }
      orientation.current.setFromQuaternion(target.current, 'YXZ')
      canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing'; invalidate()
    }
    const move = (e: PointerEvent) => {
      if (!drag.current.active) return
      const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y
      if (Math.abs(dx) + Math.abs(dy) > 2) {
        drag.current.moved = true
        orientation.current.y += dx * .006
        orientation.current.x = THREE.MathUtils.clamp(orientation.current.x + dy * .006, -1.25, 1.25)
        target.current.setFromEuler(orientation.current)
        drag.current.x = e.clientX; drag.current.y = e.clientY; invalidate()
      }
    }
    const up = (e: PointerEvent) => { drag.current.active = false; canvas.style.cursor = 'grab'; if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId) }
    const lost = (e: Event) => { e.preventDefault(); onError() }
    canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up); canvas.addEventListener('webglcontextlost', lost)
    return () => { canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up); canvas.removeEventListener('webglcontextlost', lost) }
  }, [gl, invalidate, onError, paused, mode])
  useEffect(() => {
    if (!command.place) target.current.setFromEuler(new THREE.Euler(.08, -.08, -.10))
    else {
      const place = places.find(p => p.id === command.place)
      if (!place) return
      target.current.setFromUnitVectors(point(place.lat, place.lon, 1), new THREE.Vector3(-.08, .20, 1).normalize())
    }
    invalidate()
  }, [command, invalidate])
  useEffect(() => { onReady() }, [onReady])
  useEffect(() => {
    invalidate()
    if (paused || (reducedMotion && mode === 'overview')) return
    const timer = window.setInterval(invalidate, 1000 / 30)
    return () => window.clearInterval(timer)
  }, [paused, reducedMotion, mode, invalidate])
  useEffect(() => { invalidate() }, [night, invalidate])
  useEffect(() => {
    return () => {
      const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>()
      for (const obj of [world, ...clouds]) obj.traverse(child => { if (child instanceof THREE.Mesh) { geometries.add(child.geometry); (Array.isArray(child.material) ? child.material : [child.material]).forEach(m => materials.add(m)) } })
      geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose())
    }
  }, [world, clouds])
  useFrame((state, dt) => {
    const planet = root.current
    if (!planet) return
    const speed = reducedMotion ? 1 : 1 - Math.exp(-Math.min(dt, .05) * 6)
    if (mode === 'overview') {
      planet.quaternion.slerp(target.current, speed)
      // Keep the existing framing on smaller screens.
      const desiredZoom = size.width < 550 ? .92 : 1
      camera.zoom = THREE.MathUtils.lerp(camera.zoom, desiredZoom, speed); camera.updateProjectionMatrix()
      if (planet.quaternion.angleTo(target.current) > .001 || Math.abs(camera.zoom - desiredZoom) > .001) invalidate()
    }
    if (Math.abs((light.current?.intensity ?? 0) - (night ? 1.1 : 2.7)) > .01) invalidate()
    if (light.current) light.current.intensity = THREE.MathUtils.lerp(light.current.intensity, night ? 1.1 : 2.7, speed)
    if (ambient.current) ambient.current.intensity = THREE.MathUtils.lerp(ambient.current.intensity, night ? .5 : .85, speed)
    const t = reducedMotion || paused ? 0 : state.clock.elapsedTime
    const cloudPositions = [[-3.0, 1.65, .2], [2.85, 1.0, -.5], [-2.8, -1.35, 1.3], [2.2, -2.0, 1.6]]
    clouds.forEach((cloud, i) => { const p = cloudPositions[i]; cloud.position.set(p[0] + Math.sin(t * .13 + i) * .08, p[1] + Math.cos(t * .19 + i) * .035, p[2]); cloud.rotation.y = .2 + i * .4; cloud.scale.setScalar(i === 2 ? .85 : 1) })
    planet.updateMatrixWorld()
    if (mode !== 'overview') return
    const labelDimensions = places.map((_, index) => {
      const el = labels.current?.children[index] as HTMLElement | undefined
      return { width: el?.offsetWidth ?? 140, height: el?.offsetHeight ?? 35 }
    })
    const occupied: { x: number; y: number; width: number; height: number }[] = []
    places.forEach((p, index) => {
      const el = labels.current?.children[index] as HTMLElement | undefined
      if (!el) return
      reusable.world.copy(point(p.lat, p.lon, p.id === 'experience' ? 4.36 : p.id === 'projects' ? 3.84 : 3.4))
      planet.localToWorld(reusable.world)
      reusable.normal.copy(point(p.lat, p.lon, 1)).applyQuaternion(planet.quaternion)
      reusable.screen.copy(reusable.world).project(camera)
      const offsets: Record<string, [number, number]> = { awards: [19, 31], books: [15, 10], life: [0, 19] }
      const offset = offsets[p.id] ?? [0, -8]
      const { width, height } = labelDimensions[index]
      const x = THREE.MathUtils.clamp((reusable.screen.x * .5 + .5) * size.width + offset[0], width / 2 + 20, size.width - width / 2 - 20)
      let y = THREE.MathUtils.clamp((-reusable.screen.y * .5 + .5) * size.height + offset[1], height / 2 + 18, size.height - height / 2 - 45)
      const visible = reusable.normal.z > .10
      if (visible) {
        for (const previous of occupied) {
          if (Math.abs(x - previous.x) < (width + previous.width) / 2 + 7 && Math.abs(y - previous.y) < (height + previous.height) / 2 + 9) y = previous.y + (height + previous.height) / 2 + 10
        }
        occupied.push({ x, y, width, height })
      }
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
      el.style.opacity = visible ? '1' : '0'; el.style.visibility = visible ? 'visible' : 'hidden'; el.style.pointerEvents = visible ? 'auto' : 'none'
    })
  })
  return <>
    <ambientLight ref={ambient} intensity={.85} />
    <hemisphereLight args={['#cfe9ed', '#7699a6', 1.1]} />
    <directionalLight ref={light} position={[-3, 7, 7]} intensity={2.7} color="#fff3dc" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-normalBias={.025} shadow-bias={-.0003} />
    <directionalLight position={[5, -1, 2]} intensity={.45} color="#9abde4" />
    <group ref={root}><primitive object={world} />
      {mode === 'overview' && places.map(p => <mesh key={p.id} position={point(p.lat, p.lon, p.id === 'experience' ? 3.18 : 2.89)} onClick={event => { if (event.delta < 6 && !drag.current.moved && !paused && event.object.getWorldPosition(new THREE.Vector3()).z > .2) { event.stopPropagation(); onSelect(p.id) } }} onPointerOver={event => { if (!paused && !drag.current.active) { event.stopPropagation(); gl.domElement.style.cursor = 'pointer' } }} onPointerOut={() => { if (!drag.current.active) gl.domElement.style.cursor = 'grab' }}><sphereGeometry args={[p.id === 'experience' ? .44 : .4, 8, 6]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>)}
    </group>
    {clouds.map((cloud, i) => <primitive key={i} object={cloud} />)}
    <WorldWalk mode={mode} planet={root} world={world} input={walkInput} paused={paused} reducedMotion={reducedMotion} onModeChange={onModeChange} onNearby={onNearby} onSelect={onSelect} />
  </>
}
export default function PlanetScene(props: Props) {
  return <Canvas frameloop="demand" shadows dpr={[1, 1.5]} camera={{ position: [0, 0, 12.3], fov: 39, near: .015, far: 35 }} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }} onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.0 }}>
    <World {...props} />
  </Canvas>
}
