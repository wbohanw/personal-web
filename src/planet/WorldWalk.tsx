import { useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { places, type PlaceId } from './data'
import { point, RADIUS } from './world'

export type WorldMode = 'overview' | 'loading' | 'entering' | 'walking'
export type WalkInput = { keys: Set<string>; pulse: Map<string, number> }
type Props = {
  mode: WorldMode
  planet: RefObject<THREE.Group>
  world: THREE.Group
  input: MutableRefObject<WalkInput>
  paused: boolean
  reducedMotion: boolean
  onModeChange: (mode: WorldMode) => void
  onNearby: (place: PlaceId | null) => void
  onSelect: (place: PlaceId) => void
}
const WALK_KEYS = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'ShiftRight'])
const EYE_HEIGHT = .19
const WALK_SPEED = .34

export default function WorldWalk({ mode, planet, world, input, paused, reducedMotion, onModeChange, onNearby, onSelect }: Props) {
  const { camera, gl, size, invalidate } = useThree()
  const body = useRef({ up: new THREE.Vector3(), forward: new THREE.Vector3(), pitch: -.05, nearby: null as PlaceId | null })
  const orbit = useRef({ position: camera.position.clone(), quaternion: camera.quaternion.clone(), zoom: camera.zoom, fov: (camera as THREE.PerspectiveCamera).fov })
  const entry = useRef<null | { startedAt: number; frames: number; width: number; height: number; phase: 'ground' | 'orbit' }>(null)
  const flight = useRef<null | {
    elapsed: number
    fromDirection: THREE.Vector3
    fromRadius: number
    toRadius: number
    arc: THREE.Quaternion
    fromRotation: THREE.Quaternion
    toRotation: THREE.Quaternion
    fromFov: number
  }>(null)
  const previousMode = useRef<WorldMode>('overview')
  const drag = useRef({ active: false, x: 0, y: 0, pointer: -1 })
  const scratch = useMemo(() => ({ right: new THREE.Vector3(), direction: new THREE.Vector3(), nextUp: new THREE.Vector3(), nextEye: new THREE.Vector3(), ahead: new THREE.Vector3(), transport: new THREE.Quaternion(), matrix: new THREE.Matrix4(), groundRay: new THREE.Raycaster(), wallRay: new THREE.Raycaster(), center: new THREE.Vector3(), local: new THREE.Vector3() }), [])

  useLayoutEffect(() => {
    const returning = mode === 'overview' && previousMode.current !== 'overview'
    previousMode.current = mode
    input.current.keys.clear(); input.current.pulse.clear()
    if (returning) {
      // Restore the overview before paint, including exits while the loading screen is visible.
      entry.current = null
      flight.current = null
      drag.current.active = false
      body.current.nearby = null
      if (document.pointerLockElement === gl.domElement) document.exitPointerLock()
      camera.position.copy(orbit.current.position)
      camera.quaternion.copy(orbit.current.quaternion)
      camera.zoom = orbit.current.zoom
      ;(camera as THREE.PerspectiveCamera).fov = orbit.current.fov
      camera.updateProjectionMatrix()
      invalidate()
      return
    }
    if (mode !== 'loading' || !planet.current) return
    orbit.current = { position: camera.position.clone(), quaternion: camera.quaternion.clone(), zoom: camera.zoom, fov: (camera as THREE.PerspectiveCamera).fov }
    body.current.up.copy(point(28, 0, 1)).applyQuaternion(planet.current.quaternion)
    const destination = point(46, -40, 1).applyQuaternion(planet.current.quaternion)
    body.current.forward.copy(destination).addScaledVector(body.current.up, -destination.dot(body.current.up)).normalize()
    body.current.pitch = -.05
    // Warm the landing view behind the mask before starting the visible camera flight.
    planet.current.updateMatrixWorld(true)
    scratch.groundRay.set(scratch.nextEye.copy(body.current.up).multiplyScalar(RADIUS + .12), scratch.direction.copy(body.current.up).negate())
    scratch.groundRay.far = .2
    const ground = scratch.groundRay.intersectObject(world, true)[0]
    const radius = (ground ? ground.point.length() : RADIUS + .052) + EYE_HEIGHT
    camera.position.copy(body.current.up).multiplyScalar(radius)
    const look = camera.position.clone().add(body.current.forward).addScaledVector(body.current.up, Math.tan(body.current.pitch))
    scratch.matrix.lookAt(camera.position, look, body.current.up)
    camera.quaternion.setFromRotationMatrix(scratch.matrix)
    camera.zoom = 1
    ;(camera as THREE.PerspectiveCamera).fov = 72
    camera.updateProjectionMatrix()
    const fromDirection = orbit.current.position.clone().normalize()
    flight.current = {
      elapsed: 0,
      fromDirection,
      fromRadius: orbit.current.position.length(),
      toRadius: radius,
      arc: new THREE.Quaternion().setFromUnitVectors(fromDirection, body.current.up),
      fromRotation: orbit.current.quaternion.clone(),
      toRotation: camera.quaternion.clone(),
      fromFov: orbit.current.fov,
    }
    entry.current = { startedAt: performance.now(), frames: 0, width: 0, height: 0, phase: 'ground' }
    invalidate()
  }, [mode, camera, gl, input, invalidate, planet, scratch, world])

  useEffect(() => {
    const canvas = gl.domElement
    const clear = () => { input.current.keys.clear(); input.current.pulse.clear(); drag.current.active = false }
    const active = mode === 'walking' && !paused
    if (!active) {
      clear()
      if (document.pointerLockElement === canvas) document.exitPointerLock()
      return
    }
    const turn = (dx: number, dy: number) => {
      body.current.forward.applyAxisAngle(body.current.up, -dx * .0026).normalize()
      body.current.pitch = THREE.MathUtils.clamp(body.current.pitch - dy * .0026, -1.12, 1.12)
      invalidate()
    }
    const keydown = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement)?.closest('button, a, input, textarea, select, dialog')) return
      if (WALK_KEYS.has(event.code)) {
        event.preventDefault(); input.current.keys.add(event.code)
        input.current.pulse.set(event.code, performance.now() + 140); invalidate()
      } else if (event.code === 'KeyE' && !event.repeat && body.current.nearby) {
        if (document.pointerLockElement === canvas) document.exitPointerLock()
        onSelect(body.current.nearby)
      }
    }
    const keyup = (event: KeyboardEvent) => { input.current.keys.delete(event.code) }
    const down = (event: PointerEvent) => {
      if (event.button !== 0 || document.pointerLockElement === canvas) return
      canvas.focus(); drag.current = { active: true, x: event.clientX, y: event.clientY, pointer: event.pointerId }
      canvas.setPointerCapture(event.pointerId)
    }
    const move = (event: PointerEvent) => {
      if (document.pointerLockElement === canvas) turn(event.movementX, event.movementY)
      else if (drag.current.active && event.pointerId === drag.current.pointer) {
        turn(event.clientX - drag.current.x, event.clientY - drag.current.y)
        drag.current.x = event.clientX; drag.current.y = event.clientY
      }
    }
    const up = (event: PointerEvent) => { drag.current.active = false; if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId) }
    const lockChange = () => { clear() }
    canvas.tabIndex = 0; canvas.setAttribute('aria-label', 'Walk around the planet. WASD to move, drag to look, E to explore a nearby place.'); canvas.focus()
    document.addEventListener('keydown', keydown); document.addEventListener('keyup', keyup)
    canvas.addEventListener('pointerdown', down); document.addEventListener('pointermove', move); canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up)
    document.addEventListener('pointerlockchange', lockChange); window.addEventListener('blur', clear); document.addEventListener('visibilitychange', clear)
    return () => {
      clear(); canvas.removeAttribute('tabindex'); canvas.removeAttribute('aria-label')
      document.removeEventListener('keydown', keydown); document.removeEventListener('keyup', keyup)
      canvas.removeEventListener('pointerdown', down); document.removeEventListener('pointermove', move); canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up)
      document.removeEventListener('pointerlockchange', lockChange); window.removeEventListener('blur', clear); document.removeEventListener('visibilitychange', clear)
    }
  }, [mode, paused, gl, input, invalidate, onSelect])

  useFrame((_, delta) => {
    if (mode === 'overview') return
    if (mode === 'loading' && entry.current) {
      const pending = entry.current
      if (paused) { pending.frames = 0; pending.startedAt = performance.now(); return }
      const resized = pending.width !== size.width || pending.height !== size.height
      const settled = Math.abs(size.width - gl.domElement.clientWidth) < 1 && Math.abs(size.height - gl.domElement.clientHeight) < 1
      pending.frames = resized || !settled ? 0 : pending.frames + 1
      pending.width = size.width; pending.height = size.height
      // Warm both ends of the flight at the settled canvas size before removing the mask.
      if (pending.frames >= 3 && pending.phase === 'ground' && performance.now() - pending.startedAt >= 300) {
        camera.position.copy(orbit.current.position)
        camera.quaternion.copy(orbit.current.quaternion)
        camera.zoom = 1
        ;(camera as THREE.PerspectiveCamera).fov = orbit.current.fov
        camera.updateProjectionMatrix()
        pending.phase = 'orbit'
        pending.frames = 0
      } else if (pending.frames >= 3 && pending.phase === 'orbit' && performance.now() - pending.startedAt >= 500) {
        entry.current = null
        onModeChange('entering')
      }
      invalidate()
      return
    }
    if (mode === 'entering' && flight.current) {
      if (paused) return
      const f = flight.current
      f.elapsed += Math.min(delta, .05)
      const t = reducedMotion ? 1 : Math.min(Math.max(0, f.elapsed - .12) / 2.4, 1)
      const ease = t * t * t * (t * (t * 6 - 15) + 10)
      // Stay outside the sphere, and reuse scratch objects to keep each frame lightweight.
      scratch.transport.identity().slerp(f.arc, ease)
      camera.position.copy(f.fromDirection).applyQuaternion(scratch.transport)
        .multiplyScalar(THREE.MathUtils.lerp(f.fromRadius, f.toRadius, ease))
      camera.quaternion.slerpQuaternions(f.fromRotation, f.toRotation, ease)
      ;(camera as THREE.PerspectiveCamera).fov = THREE.MathUtils.lerp(f.fromFov, 72, ease)
      camera.updateProjectionMatrix()
      if (t === 1) { flight.current = null; onModeChange('walking') }
      invalidate()
      return
    }
    if (mode !== 'walking' || paused || !planet.current) return
    const b = body.current, dt = Math.min(delta, .04)
    const pressed = (key: string) => input.current.keys.has(key) || (input.current.pulse.get(key) ?? 0) > performance.now()
    const yaw = Number(pressed('ArrowLeft')) - Number(pressed('ArrowRight'))
    if (yaw) b.forward.applyAxisAngle(b.up, yaw * dt * 1.3)
    scratch.right.crossVectors(b.forward, b.up).normalize()
    const forward = Number(pressed('KeyW') || pressed('ArrowUp')) - Number(pressed('KeyS') || pressed('ArrowDown'))
    const side = Number(pressed('KeyD')) - Number(pressed('KeyA'))
    scratch.direction.copy(b.forward).multiplyScalar(forward).addScaledVector(scratch.right, side)
    if (scratch.direction.lengthSq() > 0) {
      const distance = WALK_SPEED * dt * (pressed('ShiftLeft') || pressed('ShiftRight') ? 1.7 : 1)
      scratch.direction.normalize()
      scratch.nextUp.copy(b.up).addScaledVector(scratch.direction, distance / RADIUS).normalize()
      scratch.nextEye.copy(scratch.nextUp).multiplyScalar(camera.position.length())
      scratch.ahead.subVectors(scratch.nextEye, camera.position).normalize()
      scratch.wallRay.set(camera.position, scratch.ahead); scratch.wallRay.far = distance + .065
      const blocked = scratch.wallRay.intersectObject(world, true).length > 0
      if (!blocked) {
        scratch.transport.setFromUnitVectors(b.up, scratch.nextUp)
        b.forward.applyQuaternion(scratch.transport).normalize(); b.up.copy(scratch.nextUp)
      }
    }
    // Follow the curved land/sea surface, rather than flying through the globe.
    scratch.groundRay.set(scratch.nextEye.copy(b.up).multiplyScalar(RADIUS + .12), scratch.direction.copy(b.up).negate())
    scratch.groundRay.far = .2
    const ground = scratch.groundRay.intersectObject(world, true)[0]
    const radius = (ground ? ground.point.length() : RADIUS + .052) + EYE_HEIGHT
    camera.position.copy(b.up).multiplyScalar(radius)
    scratch.direction.copy(b.forward).multiplyScalar(Math.cos(b.pitch)).addScaledVector(b.up, Math.sin(b.pitch))
    scratch.matrix.lookAt(camera.position, scratch.nextEye.copy(camera.position).add(scratch.direction), b.up)
    camera.quaternion.setFromRotationMatrix(scratch.matrix)
    let nearest: PlaceId | null = null, nearestDistance = .95
    for (const place of places) {
      scratch.center.copy(point(place.lat, place.lon, 1)).applyQuaternion(planet.current.quaternion)
      const distance = Math.acos(THREE.MathUtils.clamp(scratch.center.dot(b.up), -1, 1)) * RADIUS
      if (distance < nearestDistance) { nearestDistance = distance; nearest = place.id }
    }
    if (nearest !== b.nearby) { b.nearby = nearest; onNearby(nearest) }
    // Continue while walking even when ambient decorative motion is disabled.
    if (forward || side || yaw) invalidate()
  })
  return null
}
