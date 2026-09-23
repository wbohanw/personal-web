import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { GalleryItem } from './PortfolioPage'

type GallerySceneProps = {
  items: GalleryItem[]
  activeId: string
  selectedId: string | null
  frameTurned: boolean
  onActiveChange: (id: string) => void
  onSelect: (id: string) => void
  onFocused: () => void
}

const FRAME_SPACING = 6.85
const PROJECT_COLORS = [
  ['#d7ff44', '#163e32', '#f6f0d4'],
  ['#fe6338', '#171717', '#f0d5b8'],
  ['#d9cdc2', '#254e69', '#f7e85c'],
  ['#7d5cff', '#fc8fbe', '#18152b'],
  ['#76c6ea', '#f0dfac', '#3d1c5d'],
  ['#ff574d', '#efeddf', '#17232d'],
]

function makeArchiveTexture(item: GalleryItem, index: number) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 768
  const context = canvas.getContext('2d')
  if (!context) return new THREE.CanvasTexture(canvas)

  const [accent] = PROJECT_COLORS[index % PROJECT_COLORS.length]
  context.fillStyle = '#14130f'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.strokeStyle = '#756d5d'
  context.lineWidth = 2
  context.strokeRect(48, 48, 928, 672)
  context.fillStyle = '#ddd4c3'
  context.font = '600 26px Arial'
  context.fillText('PROJECT ARCHIVE', 84, 110)
  context.fillStyle = accent
  context.font = '700 116px Georgia'
  context.fillText(item.number, 78, 277)
  context.fillStyle = '#f4efe6'
  context.font = '500 64px Georgia'
  context.fillText(item.title, 82, 394)
  context.fillStyle = '#8c8476'
  context.font = '24px Arial'
  context.fillText('OPENING MEDIA + PROCESS + OUTCOME', 84, 645)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

function makePhotoTexture(source: THREE.Texture) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 750
  const context = canvas.getContext('2d')
  if (!context) return new THREE.CanvasTexture(canvas)

  context.fillStyle = '#0b0b0a'
  context.fillRect(0, 0, canvas.width, canvas.height)

  const image = source.image as CanvasImageSource & { width: number; height: number }
  const scale = Math.min(canvas.width / image.width, canvas.height / image.height)
  const width = image.width * scale
  const height = image.height * scale
  context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

function makePlaqueTexture(item: GalleryItem) {
  const canvas = document.createElement('canvas')
  canvas.width = 768
  canvas.height = 84
  const context = canvas.getContext('2d')
  if (!context) return new THREE.CanvasTexture(canvas)

  context.fillStyle = '#ece5d8'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = '#211e19'
  context.font = '500 31px Georgia'
  context.fillText(item.title, 22, 38)
  context.fillStyle = '#746d62'
  context.font = '500 14px Arial'
  context.fillText(`${item.number}  /  ${item.category}`, 22, 65)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

function ArtworkFrame({ item, index, active, selected, turned, onSelect }: {
  item: GalleryItem
  index: number
  active: boolean
  selected: boolean
  turned: boolean
  onSelect: (id: string) => void
}) {
  const flipRef = useRef<THREE.Group>(null)
  const hoverAmount = useRef(0)
  const [hovered, setHovered] = useState(false)
  const sourceTexture = useLoader(THREE.TextureLoader, item.coverImage)
  const frontTexture = useMemo(() => makePhotoTexture(sourceTexture), [sourceTexture])
  const backTexture = useMemo(() => makeArchiveTexture(item, index), [item, index])
  const plaqueTexture = useMemo(() => makePlaqueTexture(item), [item])

  useEffect(() => () => { frontTexture.dispose(); backTexture.dispose(); plaqueTexture.dispose() }, [frontTexture, backTexture, plaqueTexture])
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : ''
    return () => { document.body.style.cursor = '' }
  }, [hovered])

  useFrame((_, delta) => {
    if (!flipRef.current) return
    flipRef.current.rotation.y = THREE.MathUtils.damp(flipRef.current.rotation.y, selected && turned ? Math.PI : 0, 5.4, delta)
    hoverAmount.current = THREE.MathUtils.damp(hoverAmount.current, hovered && !selected ? 1 : 0, 8, delta)
    const scale = 1 + hoverAmount.current * 0.025
    flipRef.current.scale.setScalar(scale)
    flipRef.current.position.z = THREE.MathUtils.damp(flipRef.current.position.z, selected ? 0.34 : hovered ? 0.18 : 0, 7, delta)
  })

  return (
    <group position={[index * FRAME_SPACING, 0.55, 0]}>
      <group
        ref={flipRef}
        onClick={event => { event.stopPropagation(); if (event.delta < 6) onSelect(item.id) }}
        onPointerEnter={event => { event.stopPropagation(); setHovered(true) }}
        onPointerLeave={() => setHovered(false)}
      >
        <mesh castShadow><boxGeometry args={[5.42, 3.74, 0.2]} /><meshStandardMaterial color="#171713" metalness={0.38} roughness={0.42} /></mesh>
        <mesh position={[0, 0, 0.106]}><planeGeometry args={[5.12, 3.44]} /><meshBasicMaterial color="#eee9df" toneMapped={false} /></mesh>
        <mesh position={[0, 0, 0.112]}><planeGeometry args={[4.72, 3.04]} /><meshBasicMaterial map={frontTexture} toneMapped={false} /></mesh>
        <mesh position={[0, 0, -0.106]} rotation={[0, Math.PI, 0]}><planeGeometry args={[5.12, 3.44]} /><meshBasicMaterial map={backTexture} toneMapped={false} /></mesh>
        <mesh position={[0, -2.15, -0.02]}><boxGeometry args={[2.75, 0.31, 0.075]} /><meshBasicMaterial map={plaqueTexture} toneMapped={false} /></mesh>
      </group>
      {active && <pointLight position={[0, 2.9, 3.5]} color="#fff4dd" intensity={18} distance={8} decay={2} />}
    </group>
  )
}

function GalleryWall({ itemCount }: { itemCount: number }) {
  const wallWidth = Math.max(80, (itemCount - 1) * FRAME_SPACING + 24)
  const wallCenter = ((itemCount - 1) * FRAME_SPACING) / 2
  return (
    <group>
      <color attach="background" args={['#e8e5de']} />
      <fog attach="fog" args={['#e8e5de', 18, 32]} />
      <mesh receiveShadow position={[wallCenter, 0.4, -0.38]}><planeGeometry args={[wallWidth, 7.4]} /><meshStandardMaterial color="#e8e5de" roughness={0.99} /></mesh>
      <mesh position={[wallCenter, -2.72, -0.08]}><boxGeometry args={[wallWidth, 0.11, 0.22]} /><meshStandardMaterial color="#6f695f" roughness={0.8} /></mesh>
      <mesh receiveShadow position={[wallCenter, -2.79, 2.6]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[wallWidth, 7.2]} /><meshStandardMaterial color="#35322d" roughness={0.62} metalness={0.08} /></mesh>
      <mesh position={[wallCenter, 3.47, -0.1]}><boxGeometry args={[wallWidth, 0.07, 0.14]} /><meshStandardMaterial color="#a8a197" roughness={0.85} /></mesh>
    </group>
  )
}

function SlidingRail({ items, activeId, selectedId, frameTurned, onActiveChange, onSelect, onFocused }: GallerySceneProps) {
  const { gl } = useThree()
  const railRef = useRef<THREE.Group>(null)
  const targetX = useRef(0)
  const dragStart = useRef(0)
  const dragOrigin = useRef(0)
  const dragging = useRef(false)
  const wheelTimer = useRef<number | null>(null)
  const focusSignaled = useRef(false)
  const selectedIndex = items.findIndex(item => item.id === selectedId)
  const activeIndex = Math.max(0, items.findIndex(item => item.id === activeId))
  const minX = -(items.length - 1) * FRAME_SPACING

  const snapToNearest = useCallback(() => {
    const index = THREE.MathUtils.clamp(Math.round(-targetX.current / FRAME_SPACING), 0, items.length - 1)
    targetX.current = -index * FRAME_SPACING
    onActiveChange(items[index].id)
  }, [items, onActiveChange])

  useEffect(() => {
    if (selectedIndex < 0) targetX.current = -activeIndex * FRAME_SPACING
  }, [activeIndex, selectedIndex])

  useEffect(() => {
    if (selectedIndex >= 0) targetX.current = -selectedIndex * FRAME_SPACING
    focusSignaled.current = false
  }, [selectedIndex])

  useEffect(() => {
    const canvas = gl.domElement
    const handleWheel = (event: WheelEvent) => {
      if (selectedIndex >= 0) return
      event.preventDefault()
      const distance = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
      targetX.current = THREE.MathUtils.clamp(targetX.current - distance * 0.009, minX, 0)
      if (wheelTimer.current) window.clearTimeout(wheelTimer.current)
      wheelTimer.current = window.setTimeout(snapToNearest, 150)
    }
    const handlePointerDown = (event: PointerEvent) => {
      if (selectedIndex >= 0) return
      dragging.current = true
      dragStart.current = event.clientX
      dragOrigin.current = targetX.current
      canvas.setPointerCapture(event.pointerId)
    }
    const handlePointerMove = (event: PointerEvent) => {
      if (!dragging.current || selectedIndex >= 0) return
      targetX.current = THREE.MathUtils.clamp(dragOrigin.current + (event.clientX - dragStart.current) * 0.013, minX, 0)
    }
    const handlePointerUp = (event: PointerEvent) => {
      if (!dragging.current) return
      dragging.current = false
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
      snapToNearest()
    }
    const handleKey = (event: KeyboardEvent) => {
      if (selectedIndex >= 0) return
      const current = Math.round(-targetX.current / FRAME_SPACING)
      if (event.key === 'ArrowRight') {
        const next = Math.min(items.length - 1, current + 1)
        targetX.current = -next * FRAME_SPACING
        onActiveChange(items[next].id)
      }
      if (event.key === 'ArrowLeft') {
        const next = Math.max(0, current - 1)
        targetX.current = -next * FRAME_SPACING
        onActiveChange(items[next].id)
      }
    }

    canvas.addEventListener('wheel', handleWheel, { passive: false })
    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerup', handlePointerUp)
    canvas.addEventListener('pointercancel', handlePointerUp)
    window.addEventListener('keydown', handleKey)
    return () => {
      canvas.removeEventListener('wheel', handleWheel)
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('pointercancel', handlePointerUp)
      window.removeEventListener('keydown', handleKey)
      if (wheelTimer.current) window.clearTimeout(wheelTimer.current)
    }
  }, [gl, items, minX, onActiveChange, selectedIndex, snapToNearest])

  useFrame((_, delta) => {
    if (!railRef.current) return
    railRef.current.position.x = THREE.MathUtils.damp(railRef.current.position.x, targetX.current, 5.8, delta)
    if (selectedIndex >= 0 && !focusSignaled.current && Math.abs(railRef.current.position.x - targetX.current) < 0.025) {
      focusSignaled.current = true
      onFocused()
    }
  })

  return (
    <group ref={railRef}>
      {items.map((item, index) => (
        <group key={item.id}>
          <ArtworkFrame item={item} index={index} active={item.id === activeId} selected={item.id === selectedId} turned={frameTurned} onSelect={onSelect} />
        </group>
      ))}
    </group>
  )
}

function SceneContent(props: GallerySceneProps) {
  return (
    <>
      <ambientLight intensity={1.05} color="#fff5df" />
      <directionalLight position={[-3, 7, 8]} color="#fff7e9" intensity={1.35} />
      <GalleryWall itemCount={props.items.length} />
      <Suspense fallback={null}><SlidingRail {...props} /></Suspense>
    </>
  )
}

export default function GalleryScene(props: GallerySceneProps) {
  return (
    <div className="gallery-canvas">
      <Canvas shadows camera={{ position: [0, 0.48, 9.4], fov: 37, near: 0.1, far: 55 }} dpr={[1, 1.6]} gl={{ antialias: true, powerPreference: 'high-performance' }} aria-label="Horizontally sliding three-dimensional project wall">
        <SceneContent {...props} />
      </Canvas>
    </div>
  )
}
