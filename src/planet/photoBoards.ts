import * as T from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import portrait from '../assets/planet/bohan-portrait.jpg'
import hackathon from '../assets/milestones/databricks-4.png'
import robotics from '../assets/milestones/qec-3.png'

export const photoStops = [
  { lat: 40, lon: -13, faceLat: 28, faceLon: 0, photo: portrait, title: 'Bohan Wang', caption: 'A little hello', direction: 'Workshop', width: .20, height: .27 },
  { lat: 14, lon: -50, faceLat: 9, faceLon: -35, photo: robotics, title: 'Engineering together', caption: 'Quebec Engineering Competition', direction: 'Camp', width: .34, height: .27 },
  { lat: 34, lon: 53, faceLat: 23, faceLon: 48, photo: hackathon, title: 'Building with friends', caption: 'Databricks AI Agent Hackathon', direction: 'Lighthouse', width: .34, height: .27 },
]

export function photoStopPosition(lat: number, lon: number, radius = 1) {
  return new T.Vector3().setFromSphericalCoords(radius, Math.PI / 2 - T.MathUtils.degToRad(lat), T.MathUtils.degToRad(lon))
}

// One small photo texture per stop; wooden pieces are merged by material.
export function makePhotoBoards(world: T.Group, radius: number, invalidate: () => void) {
  const group = new T.Group()
  group.name = 'Roadside photo boards'
  let disposed = false
  const textures: T.Texture[] = []
  const images: HTMLImageElement[] = []
  const wood = new T.MeshStandardMaterial({ color: '#9c7958', roughness: .94 })
  const blue = new T.MeshStandardMaterial({ color: '#466c84', roughness: .86 })
  const brass = new T.MeshStandardMaterial({ color: '#d2b77d', roughness: .65 })
  const batches = new Map<T.Material, T.BufferGeometry[]>()
  world.updateMatrixWorld(true)
  const groundRay = new T.Raycaster()

  for (const stop of photoStops) {
    const up = photoStopPosition(stop.lat, stop.lon)
    groundRay.set(up.clone().multiplyScalar(radius + .12), up.clone().negate())
    groundRay.far = .2
    const ground = groundRay.intersectObject(world, true)[0]
    const stand = new T.Group()
    stand.position.copy(up).multiplyScalar((ground?.point.length() ?? radius + .052) + .005)
    const front = photoStopPosition(stop.faceLat, stop.faceLon).addScaledVector(up, -photoStopPosition(stop.faceLat, stop.faceLon).dot(up)).normalize()
    const right = new T.Vector3().crossVectors(up, front).normalize()
    stand.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(right, up, front))
    stand.updateMatrix()
    group.add(stand)

    const box = (size: [number, number, number], position: [number, number, number], material: T.Material) => {
      const source = new T.BoxGeometry(...size)
      const geo = source.toNonIndexed()
      source.dispose()
      geo.translate(...position).applyMatrix4(stand.matrix)
      if (!batches.has(material)) batches.set(material, [])
      batches.get(material)!.push(geo)
    }
    const w = stop.width, h = stop.height, y = .11 + h / 2
    for (const x of [-w * .36, w * .36]) box([.022, y + .03, .024], [x, (y + .03) / 2, -.016], wood)
    box([w + .028, h + .028, .025], [0, y, 0], wood)
    box([w + .045, .018, .05], [0, y + h / 2 + .018, .005], blue)
    for (const x of [-w / 2, w / 2]) box([.012, h, .017], [x, y, .017], blue)
    box([w, .012, .017], [0, y - h / 2, .017], blue)
    for (const x of [-w * .42, w * .42]) box([.007, .007, .006], [x, y + h * .44, .021], brass)

    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = Math.round(512 * h / w)
    const ctx = canvas.getContext('2d')!
    const texture = new T.CanvasTexture(canvas)
    texture.colorSpace = T.SRGBColorSpace
    texture.anisotropy = 4
    textures.push(texture)
    const draw = (image?: HTMLImageElement) => {
      const cw = canvas.width, ch = canvas.height
      ctx.fillStyle = '#f4efe2'; ctx.fillRect(0, 0, cw, ch)
      const area = { x: 24, y: 24, w: cw - 48, h: ch - 148 }
      if (image) {
        const scale = Math.min(area.w / image.naturalWidth, area.h / image.naturalHeight)
        const width = image.naturalWidth * scale, height = image.naturalHeight * scale
        ctx.drawImage(image, area.x + (area.w - width) / 2, area.y + (area.h - height) / 2, width, height)
      }
      ctx.textAlign = 'center'; ctx.fillStyle = '#294b61'
      ctx.font = '26px Georgia'; ctx.fillText(stop.title, cw / 2, ch - 87, cw - 40)
      ctx.fillStyle = '#6d7c7c'; ctx.font = '17px Georgia'
      ctx.fillText(stop.caption, cw / 2, ch - 56, cw - 40)
      ctx.fillStyle = '#466c84'; ctx.font = '18px Georgia'
      ctx.fillText(`${stop.direction} →`, cw / 2, ch - 24, cw - 40)
      texture.needsUpdate = true
      invalidate()
    }
    draw()
    // An unlit print keeps the original photograph readable in both system themes.
    const print = new T.Mesh(new T.PlaneGeometry(w - .015, h - .015), new T.MeshBasicMaterial({ map: texture, toneMapped: false }))
    print.position.set(0, y, .023)
    stand.add(print)
    const image = new Image()
    images.push(image)
    image.onload = () => { if (!disposed) draw(image) }
    image.onerror = () => { if (!disposed) invalidate() }
    image.src = stop.photo
  }
  for (const [material, geometries] of batches) {
    const geometry = mergeGeometries(geometries)
    geometries.forEach(g => g.dispose())
    if (geometry) {
      const mesh = new T.Mesh(geometry, material)
      mesh.castShadow = true; mesh.receiveShadow = true
      group.add(mesh)
    }
  }
  return {
    group,
    dispose() {
      disposed = true
      images.forEach(image => { image.onload = null; image.onerror = null })
      const materials = new Set<T.Material>([wood, blue, brass])
      group.traverse(object => {
        if (object instanceof T.Mesh) {
          object.geometry.dispose()
          const list = Array.isArray(object.material) ? object.material : [object.material]
          list.forEach(material => materials.add(material))
        }
      })
      materials.forEach(material => material.dispose())
      textures.forEach(texture => texture.dispose())
    },
  }
}
