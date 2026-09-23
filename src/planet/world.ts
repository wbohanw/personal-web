import * as T from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { places } from './data'
import { photoStops, photoStopPosition } from './photoBoards'

export const RADIUS = 2.5
const UP = new T.Vector3(0, 1, 0)
const palette = { wall: '#f2ead8', roof: '#416785', trim: '#d8d7c8', wood: '#ab8965', dark: '#2b495a', glass: '#92c5d2', gold: '#e5b36c', leaf: '#679493' }
export function point(lat: number, lon: number, r = RADIUS + .055) {
  const a = lat * Math.PI / 180, b = lon * Math.PI / 180
  return new T.Vector3(Math.cos(a) * Math.sin(b), Math.sin(a), Math.cos(a) * Math.cos(b)).multiplyScalar(r)
}
function random(seed: number) {
  let n = seed
  return () => { n = (n * 1664525 + 1013904223) >>> 0; return n / 4294967296 }
}
function material(color: string) { return new T.MeshStandardMaterial({ color, roughness: .88, flatShading: true }) }
export function makeWorld() {
  const rand = random(42)
  const group = new T.Group()
  const materials = new Map<string, T.MeshStandardMaterial>()
  const mat = (c: string) => { if (!materials.has(c)) materials.set(c, material(c)); return materials.get(c)! }
  function shape(parent: T.Object3D, geo: T.BufferGeometry, color: string, p: number[] = [0, 0, 0], rot: number[] = [0, 0, 0]) {
    const m = new T.Mesh(geo, mat(color)); m.position.set(p[0], p[1], p[2]); m.rotation.set(rot[0], rot[1], rot[2]); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m
  }
  const box = (g: T.Object3D, s: number[], p: number[], c: string, rot?: number[]) => shape(g, new T.BoxGeometry(...s as [number, number, number]), c, p, rot)
  const cylinder = (g: T.Object3D, top: number, bottom: number, h: number, p: number[], c: string, n = 8) => shape(g, new T.CylinderGeometry(top, bottom, h, n), c, p)
  const ball = (g: T.Object3D, r: number, p: number[], c: string, detail = 0) => shape(g, new T.IcosahedronGeometry(r, detail), c, p)
  const surface = (lat: number, lon: number, turn = 0, r = RADIUS + .055) => {
    const g = new T.Group(); g.position.copy(point(lat, lon, r)); g.quaternion.setFromUnitVectors(UP, g.position.clone().normalize()); g.rotateY(turn); group.add(g); return g
  }
  const pole = (g: T.Object3D, a: number[], b: number[], radius: number, color: string) => {
    const start = new T.Vector3(...a as [number, number, number]), end = new T.Vector3(...b as [number, number, number]);
    const mesh = cylinder(g, radius, radius, start.distanceTo(end), start.clone().add(end).multiplyScalar(.5).toArray(), color, 6)
    mesh.quaternion.setFromUnitVectors(UP, end.sub(start).normalize()); return mesh
  }
  const roof = (g: T.Object3D, width: number, depth: number, y: number, height: number, color = palette.roof) => {
    const triangle = new T.Shape(); triangle.moveTo(-width / 2, 0); triangle.lineTo(0, height); triangle.lineTo(width / 2, 0); triangle.closePath()
    const geom = new T.ExtrudeGeometry(triangle, { depth, bevelEnabled: false }); geom.translate(0, y, -depth / 2)
    shape(g, geom, color)
    for (let i = 1; i < 7; i++) {
      const z = -depth / 2 + i * depth / 7
      pole(g, [-width / 2, y + .012, z], [0, y + height + .012, z], .009, '#6c8ca1')
      pole(g, [0, y + height + .012, z], [width / 2, y + .012, z], .009, '#6c8ca1')
    }
  }
  const window = (g: T.Object3D, x: number, y: number, z: number, w = .13, h = .17) => {
    box(g, [w + .04, h + .04, .032], [x, y, z], palette.trim)
    box(g, [w, h, .038], [x, y, z + .008], palette.dark)
    box(g, [w - .028, h - .025, .04], [x, y, z + .01], palette.gold)
    box(g, [.012, h, .048], [x, y, z + .015], palette.trim)
    box(g, [w, .012, .048], [x, y, z + .015], palette.trim)
  }
  function tree(g: T.Object3D, x: number, z: number, s = 1, color = '#527d82') {
    cylinder(g, .018 * s, .028 * s, .2 * s, [x, .1 * s, z], palette.wood, 5)
    for (let j = 0; j < 3; j++) shape(g, new T.ConeGeometry((.17 - j * .035) * s, (.32 - j * .035) * s, 5), j === 1 ? '#6f9799' : color, [x, (.29 + j * .14) * s, z], [0, j * .5, 0])
  }
  function flowers(g: T.Object3D, x: number, z: number, color = '#f3dfad') {
    for (let j = 0; j < 3; j++) {
      const a = j * 2.1, px = x + Math.sin(a) * .065, pz = z + Math.cos(a) * .06
      cylinder(g, .008, .008, .075, [px, .038, pz], '#6a9791', 4)
      ball(g, .027, [px, .09, pz], color)
    }
  }
  function fence(g: T.Object3D, x: number, z: number, length: number) {
    for (let i = 0; i <= 5; i++) box(g, [.028, .2, .035], [x + i * length / 5, .1, z], '#e5e0c9')
    box(g, [length + .04, .026, .03], [x + length / 2, .08, z], '#e5e0c9')
    box(g, [length + .04, .026, .03], [x + length / 2, .16, z], '#e5e0c9')
  }
  function bench(g: T.Object3D, x: number, z: number) {
    for (let j = 0; j < 3; j++) box(g, [.35, .025, .035], [x, .14, z + j * .04], palette.wood)
    for (const dx of [-.13, .13]) { box(g, [.025, .16, .025], [x + dx, .08, z + .04], palette.dark); box(g, [.025, .28, .025], [x + dx, .14, z - .02], palette.dark) }
    box(g, [.35, .065, .025], [x, .25, z - .02], palette.wood)
  }
  function house(g: T.Object3D, s = 1, roofColor = palette.roof) {
    const h = new T.Group(); h.scale.setScalar(s); g.add(h)
    box(h, [.68, .08, .61], [0, .04, 0], '#c9c8b4')
    box(h, [.59, .46, .48], [0, .29, 0], palette.wall)
    roof(h, .77, .69, .52, .35, roofColor)
    box(h, [.12, .27, .035], [0, .175, .252], '#537889')
    box(h, [.028, .028, .03], [.033, .18, .274], palette.gold)
    window(h, -.2, .33, .255, .1, .14); window(h, .2, .33, .255, .1, .14)
    cylinder(h, .058, .058, .015, [0, .645, .355], palette.gold, 12).rotation.x = Math.PI / 2
    box(h, [.14, .32, .12], [.2, .75, -.16], '#d8d6c9')
    box(h, [.19, .05, .16], [.2, .93, -.16], palette.roof)
    for (let i = 0; i < 3; i++) box(h, [.27 + i * .04, .035, .095], [0, .05 - i * .012, .31 + i * .07], '#e8dfc7')
    return h
  }
  // A faceted sea, with hand-shaped archipelagos laid onto its curved surface.
  const ocean = new T.IcosahedronGeometry(RADIUS, 5)
  const vertices = ocean.getAttribute('position'); const colors: number[] = []; const oceanColors = ['#78b8d0', '#80bfd3', '#83bfd4', '#86c1d6', '#89c5d9', '#7bb9d1']
  for (let i = 0; i < vertices.count; i += 3) {
    const c = new T.Color(oceanColors[Math.floor(rand() * oceanColors.length)])
    for (let j = 0; j < 3; j++) colors.push(c.r, c.g, c.b)
  }
  ocean.setAttribute('color', new T.Float32BufferAttribute(colors, 3))
  const seaMat = new T.MeshStandardMaterial({ vertexColors: true, roughness: .63, flatShading: true })
  const sea = new T.Mesh(ocean, seaMat); sea.receiveShadow = true; group.add(sea)
  const paths = [[46, -40, 57, 42], [46, -40, 9, -22], [9, -22, 8, -70], [12, 49, 57, 42], [9, -22, -27, -1], [28, 0, 46, -40], [28, 0, 9, -22]]
  const pathClearings = paths.flatMap(([a, b, c, d]) => Array.from({ length: 28 }, (_, index) => point(a, b, 1).lerp(point(c, d, 1), index / 27).normalize().multiplyScalar(RADIUS + .06)))
  const arrival = point(28, 0)
  const photoClearings = photoStops.map(stop => photoStopPosition(stop.lat, stop.lon, RADIUS + .06))
  const landDefinitions = [
    { lat: 35, lon: -27, rx: 1.01, ry: .76, seed: 1 },
    { lat: 14, lon: 49, rx: .40, ry: .64, seed: 4 },
    { lat: -36, lon: 0, rx: .56, ry: .34, seed: 8 },
    { lat: 8, lon: -77, rx: .28, ry: .45, seed: 3 },
    { lat: 15, lon: 160, rx: .67, ry: .86, seed: 12 },
    { lat: -43, lon: -125, rx: .57, ry: .42, seed: 5 },
  ]
  const landColors = ['#b4cdbe', '#adc7b9', '#b8cdbb', '#bbd1c1', '#a9c6bd', '#c1d3bf']
  const contour = (a: number, seed: number) => 1 + .105 * Math.sin(a * 5 + seed) + .08 * Math.cos(a * 3 + seed) + .04 * Math.sin(a * 9)
  for (const land of landDefinitions) {
    const center = point(land.lat, land.lon, 1); const q = new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 0, 1), center)
    const local = (a: number, f: number, offset: number) => {
      const k = contour(a, land.seed), x = Math.cos(a) * land.rx * k * f, y = Math.sin(a) * land.ry * k * f
      const d = Math.sqrt(x * x + y * y)
      return new T.Vector3(d ? Math.sin(d) * x / d : 0, d ? Math.sin(d) * y / d : 0, Math.cos(d)).applyQuaternion(q).multiplyScalar(RADIUS + offset)
    }
    for (const layer of [{ f: 1.12, r: .008, color: '#97cfd6' }, { f: 1.045, r: .025, color: '#e1ddc0' }, { f: 1, r: .052, color: null }]) {
      const pos: number[] = [], col: number[] = [], segments = 54, rings = 8
      const tri = (a: T.Vector3, b: T.Vector3, c: T.Vector3) => { pos.push(...a.toArray(), ...b.toArray(), ...c.toArray()); const clr = new T.Color(layer.color ?? landColors[Math.floor(rand() * landColors.length)]); for (let j = 0; j < 3; j++) col.push(clr.r, clr.g, clr.b) }
      for (let j = 0; j < rings; j++) for (let i = 0; i < segments; i++) {
        const a = i / segments * Math.PI * 2, b = (i + 1) / segments * Math.PI * 2
        const p0 = local(a, j / rings * layer.f, layer.r), p1 = local(a, (j + 1) / rings * layer.f, layer.r), p2 = local(b, (j + 1) / rings * layer.f, layer.r), p3 = local(b, j / rings * layer.f, layer.r)
        tri(p0, p1, p2); if (j) tri(p0, p2, p3)
      }
      const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.setAttribute('color', new T.Float32BufferAttribute(col, 3)); geo.computeVertexNormals()
      const mesh = new T.Mesh(geo, new T.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1, side: T.DoubleSide })); mesh.receiveShadow = true; group.add(mesh)
    }
    // Plant groves around clearings; exact seeds keep the world stable on every visit.
    for (let i = 0; i < 52; i++) {
      const a = rand() * Math.PI * 2, f = Math.sqrt(rand()) * .95
      const p = local(a, f, .06), latitude = Math.asin(p.y / p.length()) * 180 / Math.PI, longitude = Math.atan2(p.x, p.z) * 180 / Math.PI
      if (photoClearings.some(center => p.distanceTo(center) < .27) || places.some(place => p.distanceTo(point(place.lat, place.lon)) < .66) || p.distanceTo(arrival) < .7 || pathClearings.some(center => p.distanceTo(center) < .19)) continue
      const grove = surface(latitude, longitude, rand() * 6)
      const s = .47 + rand() * .67
      if (i % 7 === 0) { const rock = ball(grove, .11 * s, [0, .05, 0], '#a2b5af'); rock.scale.set(1, .7, 1.3) }
      else if (i % 5 === 0) { cylinder(grove, .016, .023, .17, [0, .085, 0], palette.wood, 5); ball(grove, .14 * s, [0, .22, 0], ['#94b9b0', '#d3c9bb', '#ccdad0'][i % 3], 1) }
      else tree(grove, 0, 0, s)
      if (i % 3 === 0) flowers(grove, .12, .09)
    }
  }
  // Winding stepping-stone routes.
  paths.forEach(([a, b, c, d]) => {
    const v0 = point(a, b, 1), v1 = point(c, d, 1)
    for (let i = 1; i < 28; i++) {
      const t = i / 28, v = v0.clone().lerp(v1, t).normalize(); const lat = Math.asin(v.y) * 180 / Math.PI, lon = Math.atan2(v.x, v.z) * 180 / Math.PI + Math.sin(t * 8) * 2
      const g = surface(lat, lon, rand() * 2)
      const rock = cylinder(g, .047 + rand() * .014, .06, .017, [0, .005, 0], '#e7dec5', 6); rock.scale.z = .73
    }
  })
  // Workshop: a blue tiled roof, awning, workbench and a tiny helpful robot.
  const workshop = surface(46, -40, -.22); house(workshop, 1.15)
  box(workshop, [.67, .035, .3], [0, .34, .43], '#6e99b0', [-.15, 0, 0])
  for (const x of [-.30, .30]) cylinder(workshop, .014, .014, .32, [x, .16, .54], palette.trim)
  box(workshop, [.28, .045, .17], [.57, .22, .10], palette.wood)
  for (const x of [.46, .67]) box(workshop, [.026, .22, .13], [x, .11, .10], palette.dark)
  box(workshop, [.13, .1, .025], [.56, .29, .08], palette.dark)
  box(workshop, [.1, .075, .027], [.56, .29, .10], '#acd3d5')
  const robot = new T.Group(); robot.position.set(-.56, .03, .28); workshop.add(robot)
  box(robot, [.14, .13, .11], [0, .09, 0], '#e9e6d9'); box(robot, [.19, .13, .14], [0, .24, 0], '#d6e6df'); box(robot, [.15, .065, .015], [0, .245, .077], palette.dark)
  for (const x of [-.045, .045]) { ball(robot, .018, [x, .248, .09], '#7fd5df'); box(robot, [.035, .06, .045], [x, 0, .02], palette.dark) }
  pole(robot, [0, .29, 0], [.03, .39, 0], .008, palette.dark); ball(robot, .025, [.03, .39, 0], palette.gold)
  fence(workshop, -.62, -.4, 1.2); flowers(workshop, .48, .35); tree(workshop, -.65, -.25, .8)
  // Lighthouse, with wraparound railings and a glowing lantern room.
  const lighthouse = surface(57, 42, .2)
  cylinder(lighthouse, .36, .40, .08, [0, .04, 0], '#d2cfb9', 10)
  cylinder(lighthouse, .17, .26, .91, [0, .52, 0], palette.wall, 10)
  cylinder(lighthouse, .215, .23, .16, [0, .35, 0], '#638eaa', 10)
  cylinder(lighthouse, .183, .20, .12, [0, .73, 0], '#638eaa', 10)
  cylinder(lighthouse, .28, .28, .055, [0, 1, 0], palette.roof, 12)
  cylinder(lighthouse, .18, .18, .22, [0, 1.14, 0], '#e9c787', 8)
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * Math.PI * 2
    cylinder(lighthouse, .014, .014, .27, [Math.sin(a) * .18, 1.145, Math.cos(a) * .18], palette.roof, 5)
    cylinder(lighthouse, .008, .008, .14, [Math.sin(a) * .265, 1.09, Math.cos(a) * .265], palette.wall, 5)
  }
  const rail = shape(lighthouse, new T.TorusGeometry(.266, .012, 4, 16), palette.wall, [0, 1.16, 0]); rail.rotation.x = Math.PI / 2
  cylinder(lighthouse, 0, .29, .19, [0, 1.34, 0], palette.roof, 8)
  pole(lighthouse, [0, 1.4, 0], [0, 1.57, 0], .012, palette.dark); ball(lighthouse, .035, [0, 1.57, 0], palette.gold)
  window(lighthouse, 0, .60, .21, .055, .13)
  box(lighthouse, [.11, .19, .03], [0, .18, .257], palette.roof)
  const keeper = new T.Group(); keeper.position.set(-.41, 0, -.08); lighthouse.add(keeper); house(keeper, .48)
  flowers(lighthouse, .38, .14); fence(lighthouse, -.25, -.4, .6)
  // Camp with two canvas tents, a fire circle, bunting and a trophy.
  const camp = surface(9, -22, -.28)
  function tent(x: number, z: number, s: number, color: string) {
    const t = new T.Group(); t.position.set(x, .015, z); t.scale.setScalar(s); camp.add(t)
    roof(t, .54, .50, .025, .37, color)
    const opening = new T.Shape(); opening.moveTo(-.16, 0); opening.lineTo(0, .29); opening.lineTo(.16, 0); opening.closePath()
    shape(t, new T.ShapeGeometry(opening), palette.dark, [0, .025, .253])
    pole(t, [0, 0, .27], [0, .44, .27], .012, palette.wood)
    for (const side of [-1, 1]) { pole(t, [0, .38, .24], [side * .40, 0, .43], .005, '#ede6cd'); box(t, [.025, .04, .03], [side * .4, .02, .43], palette.wood) }
  }
  tent(-.20, -.13, 1.1, '#d6ad72'); tent(.38, -.20, .63, '#739bb0')
  for (let i = 0; i < 7; i++) ball(camp, .04, [Math.cos(i) * .13, .025, .4 + Math.sin(i) * .13], '#9daba2')
  box(camp, [.19, .035, .04], [0, .035, .4], '#906c4e', [0, .5, 0]); box(camp, [.19, .035, .04], [0, .065, .4], '#906c4e', [0, -.6, 0]); shape(camp, new T.ConeGeometry(.055, .15, 5), '#eab874', [0, .13, .4])
  for (const x of [-.58, .58]) pole(camp, [x, 0, -.4], [x, .65, -.4], .013, palette.wood)
  pole(camp, [-.58, .61, -.4], [.58, .61, -.4], .006, palette.wall)
  for (let i = 0; i < 7; i++) { const g = new T.ConeGeometry(.052, .12, 3); const flag = shape(camp, g, i % 2 ? '#7da5b2' : '#dfb67b', [-.47 + i * .157, .55, -.4]); flag.rotation.z = Math.PI; flag.scale.z = .12 }
  box(camp, [.18, .05, .17], [.52, .04, .26], palette.wood); cylinder(camp, .025, .04, .09, [.52, .11, .26], palette.gold); cylinder(camp, .075, .025, .09, [.52, .20, .26], palette.gold)
  bench(camp, -.39, .36); flowers(camp, .56, .07)
  // Discovery lab: a blue research house, telescope, and outdoor worktable.
  const lab = surface(8, -70, .35); house(lab, .86, '#6a91a3')
  for (let i = 0; i < 3; i++) pole(lab, [.38 + Math.cos(i * Math.PI * 2 / 3) * .16, .03, .38 + Math.sin(i * Math.PI * 2 / 3) * .16], [.38, .39, .38], .018, palette.trim)
  pole(lab, [.30, .38, .46], [.53, .64, .15], .065, '#658aa6')
  pole(lab, [.52, .63, .17], [.55, .66, .13], .08, palette.trim)
  pole(lab, [.55, .66, .13], [.557, .668, .12], .059, palette.dark)
  box(lab, [.38, .035, .24], [-.3, .22, .45], palette.wood)
  for (const x of [-.45, -.15]) pole(lab, [x, .02, .45], [x, .22, .45], .018, palette.trim)
  box(lab, [.17, .012, .13], [-.32, .247, .44], '#f8f0df', [0, .16, 0])
  cylinder(lab, .025, .04, .08, [-.2, .28, .45], '#96bbc3')
  tree(lab, -.47, -.18, .75); flowers(lab, .36, -.25, '#edcbb5')
  // Library: taller gables, an outdoor shelf and a reading bench.
  const library = surface(12, 49, -.30); const libraryHouse = house(library, 1.04, '#506b91'); libraryHouse.scale.y = 1.23
  box(library, [.30, .38, .14], [.51, .19, .10], palette.wood)
  for (let row = 0; row < 2; row++) {
    box(library, [.28, .017, .15], [.51, .04 + row * .18, .12], '#dac9a6')
    for (let i = 0; i < 6; i++) box(library, [.027, .09 + (i % 3) * .025, .07], [.40 + i * .043, .09 + row * .18, .14], ['#709bb0', '#c7a36d', '#d7d9c2', '#66847c'][i % 4], [0, 0, i === 5 ? -.17 : 0])
  }
  bench(library, -.5, .24); tree(library, -.55, -.20, 1.1); flowers(library, .33, .4)
  // A glass conservatory and garden on a small southern island.
  const garden = surface(-34, 2, -.12)
  box(garden, [.65, .075, .55], [0, .036, 0], '#d9d8bf')
  box(garden, [.55, .36, .44], [0, .23, 0], '#afd0cc')
  roof(garden, .64, .54, .42, .24, '#93b7b6')
  for (const x of [-.28, -.09, .09, .28]) {
    pole(garden, [x, .07, .225], [x, .43, .225], .014, '#edf0de')
    pole(garden, [x, .07, -.225], [x, .43, -.225], .014, '#edf0de')
  }
  for (const z of [-.27, -.09, .09, .27]) {
    pole(garden, [-.32, .43, z], [0, .67, z], .013, '#edf0de'); pole(garden, [0, .67, z], [.32, .43, z], .013, '#edf0de')
  }
  box(garden, [.57, .022, .46], [0, .24, 0], '#e9e9d6')
  for (const x of [-.48, .48]) { cylinder(garden, .085, .06, .13, [x, .075, .17], '#c89b7c'); ball(garden, .11, [x, .19, .17], '#84a993', 1) }
  cylinder(garden, .18, .18, .035, [.52, .18, -.17], palette.wall, 12); cylinder(garden, .02, .03, .18, [.52, .09, -.17], palette.wood)
  cylinder(garden, .04, .032, .055, [.52, .22, -.17], '#e6b784'); bench(garden, -.51, -.12); fence(garden, -.53, -.40, 1.1)
  // Footbridge over the eastern channel.
  const bridge = surface(27, 25, .05)
  for (let i = 0; i < 14; i++) { const x = -.43 + i * .066, y = .04 + Math.sin(i / 13 * Math.PI) * .075; box(bridge, [.06, .03, .23], [x, y, 0], '#c5a785'); if (i % 3 === 0) for (const z of [-.13, .13]) box(bridge, [.019, .19, .019], [x, y + .09, z], palette.wood) }
  for (const z of [-.13, .13]) pole(bridge, [-.43, .22, z], [.43, .22, z], .012, palette.wood)
  // Small boats, sea ripples and buoys keep the ocean alive.
  for (const [lat, lon, turn, s] of [[-9, 26, -.4, 1], [-29, -53, 1.1, .70], [24, 108, .6, .8]]) {
    const boat = surface(lat, lon, turn, RADIUS + .016); boat.scale.setScalar(s)
    const hull = ball(boat, .18, [0, .04, 0], '#eae2ca'); hull.scale.set(.62, .36, 1.7)
    box(boat, [.13, .016, .27], [0, .10, 0], palette.wood)
    pole(boat, [0, .10, 0], [0, .62, 0], .009, palette.wood)
    const sail = new T.Shape(); sail.moveTo(.014, .15); sail.lineTo(.014, .60); sail.lineTo(.24, .17); sail.closePath(); shape(boat, new T.ShapeGeometry(sail), '#f9f1d9')
    const blueSail = new T.Shape(); blueSail.moveTo(-.015, .21); blueSail.lineTo(-.015, .49); blueSail.lineTo(-.15, .22); blueSail.closePath(); shape(boat, new T.ShapeGeometry(blueSail), '#618faa')
  }
  for (let i = 0; i < 56; i++) {
    const lat = -65 + rand() * 125, lon = -180 + rand() * 360, wave = surface(lat, lon, 0, RADIUS + .008)
    box(wave, [.08 + rand() * .11, .006, .014], [0, 0, 0], '#bbdde0')
  }
  // Merge the little pieces by material: all the detail, without thousands of draw calls.
  group.updateMatrixWorld(true)
  const buckets = new Map<T.Material, T.BufferGeometry[]>()
  const originals: T.Mesh[] = []
  group.traverse(obj => {
    if (!(obj instanceof T.Mesh) || obj === sea || Array.isArray(obj.material) || obj.geometry.getAttribute('color')) return
    const geometry = obj.geometry.index ? obj.geometry.toNonIndexed() : obj.geometry.clone()
    geometry.applyMatrix4(obj.matrixWorld); geometry.deleteAttribute('uv')
    if (!buckets.has(obj.material)) buckets.set(obj.material, [])
    buckets.get(obj.material)!.push(geometry); originals.push(obj)
  })
  originals.forEach(mesh => { mesh.removeFromParent(); mesh.geometry.dispose() })
  buckets.forEach((geometries, material) => {
    const merged = mergeGeometries(geometries)
    geometries.forEach(g => g.dispose())
    if (merged) { const mesh = new T.Mesh(merged, material); mesh.castShadow = true; mesh.receiveShadow = true; group.add(mesh) }
  })
  return group
}

export function makeCloud() {
  const g = new T.Group(), mat = new T.MeshStandardMaterial({ color: '#fff9e9', flatShading: true, roughness: 1 })
  ;[[-.3, 0, 0, .19], [-.07, .07, 0, .26], [.2, .015, .015, .21], [.38, -.02, .01, .14], [.02, -.08, .13, .17]].forEach(([x, y, z, r]) => {
    const m = new T.Mesh(new T.IcosahedronGeometry(r, 1), mat); m.position.set(x, y, z); m.scale.y = .75; g.add(m)
  })
  return g
}
