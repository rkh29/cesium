<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// ── Reactive state ─────────────────────────────────────────────────────────
const containerRef = ref<HTMLDivElement | null>(null)
const d2gCount   = ref(0)
const geoCount   = ref(0)
const islCount   = ref(0)
const blindCount = ref(0)  // "盲星": 无D2G 且未被GEO选中，只能靠同轨骨干多跳

// ── Three.js handles (NOT reactive) ───────────────────────────────────────
let renderer: THREE.WebGLRenderer | null = null
let animId = 0
let ro: ResizeObserver | null = null

// ──────────────────────────────────────────────────────────────────────────
//  架构常量：严格对齐《卫星网络架构设计》
// ──────────────────────────────────────────────────────────────────────────
const R_EARTH = 1.0
const R_LEO   = 1.26   // 1 650 km → 模型单位
const R_GEO   = 6.61   // 35 786 km → 模型单位

// Walker Delta 55°: 15/3/f  (f=1)
const INCLINATION   = (55 * Math.PI) / 180
const RAANS         = [30, 150, 270]   // 3 个轨道面升交点赤经，间隔 120°
const SATS_PER_PLANE = 5              // 每面 5 星 → 共 15 颗 LEO

// GEO：赤道均布 0°/120°/240°
const GEO_LONS      = [0, 120, 240]

// 路由阈值（对应文档物理约束）
const D2G_DIST   = 0.80   // LEO→地面视距（D2G 优先）
const ISL_DIST   = 0.85   // 跨轨 ISL 开闭阈值（赤道孤岛效应）
const GEO_FOV    = 6.20   // GEO 端机视场（EDRS 模型：每 GEO 3 端机）

// LEO 轨道速度（仿真单位）
const LEO_SPEED  = 0.0048

// 三个轨道面配色 —— 蓝 / 绿 / 琥珀
const PLANE_COLORS  = [0x33ccff, 0x44ff99, 0xffaa33] as const

// ── 工具函数 ───────────────────────────────────────────────────────────────
function ll2v3(lat: number, lon: number, r: number): THREE.Vector3 {
  const φ = (lat * Math.PI) / 180
  const λ = (lon * Math.PI) / 180
  return new THREE.Vector3(
    r * Math.cos(φ) * Math.cos(λ),
    r * Math.sin(φ),
    -r * Math.cos(φ) * Math.sin(λ)
  )
}

function dynBuf(maxSegs: number): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(maxSegs * 2 * 3), 3))
  return g
}

// ── 场景初始化 ─────────────────────────────────────────────────────────────
function initScene(el: HTMLDivElement) {
  const W = el.clientWidth, H = el.clientHeight

  // Scene
  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x010306, 0.009)

  // Camera — 初始位置能同时看到 LEO 和 GEO
  const cam = new THREE.PerspectiveCamera(42, W / H, 0.1, 1200)
  cam.position.set(14, 8, 16)

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(W, H)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  el.appendChild(renderer.domElement)

  // Controls
  const ctrl = new OrbitControls(cam, renderer.domElement)
  ctrl.enableDamping = true
  ctrl.dampingFactor = 0.06
  ctrl.maxDistance = 50
  ctrl.minDistance = 2

  // ────────────────────────────────────────────────────────────────────────
  //  ECEF 固连组（地球 + 地面站 + GEO 一起随地球自转）
  // ────────────────────────────────────────────────────────────────────────
  const ecef = new THREE.Group()
  scene.add(ecef)

  // 地球线框壳
  ecef.add(new THREE.Mesh(
    new THREE.SphereGeometry(R_EARTH, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0x0d2640, wireframe: true, transparent: true, opacity: 0.45 })
  ))
  // 遮挡核心（隐藏背面线条）
  ecef.add(new THREE.Mesh(
    new THREE.SphereGeometry(R_EARTH - 0.012, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x030912 })
  ))

  // 赤道参考环（赤道孤岛效应视觉提示）
  const eqRing = new THREE.Mesh(
    new THREE.RingGeometry(R_EARTH * 1.004, R_EARTH * 1.022, 128),
    new THREE.MeshBasicMaterial({ color: 0x1a4466, side: THREE.DoubleSide, transparent: true, opacity: 0.30 })
  )
  eqRing.rotation.x = Math.PI / 2
  ecef.add(eqRing)

  // ── 地面段：1 MCS + 4 边界站 ──────────────────────────────────────────
  const GS_CONFIG = [
    { lat: 35, lon: 105, color: 0xffcc00, size: 0.08 },  // MCS 中心主控站（大一圈）
    { lat: 53, lon: 126, color: 0x33ff66, size: 0.06 },  // BND-N 漠河
    { lat: 18, lon: 110, color: 0x33ff66, size: 0.06 },  // BND-S 海南
    { lat: 40, lon: 73,  color: 0x33ff66, size: 0.06 },  // BND-W 新疆
    { lat: 48, lon: 134, color: 0x33ff66, size: 0.06 },  // BND-E 黑龙江
  ]
  const gsMeshes: THREE.Mesh[] = []
  GS_CONFIG.forEach(g => {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(g.size, g.size, g.size),
      new THREE.MeshBasicMaterial({ color: g.color })
    )
    m.position.copy(ll2v3(g.lat, g.lon, R_EARTH))
    m.lookAt(0, 0, 0)
    ecef.add(m)
    gsMeshes.push(m)
  })

  // 地面光缆：4 边界站 → MCS
  const gbArr = new Float32Array(4 * 2 * 3)
  let gi = 0
  const mcsP = gsMeshes[0].position
  for (let k = 1; k <= 4; k++) {
    const p = gsMeshes[k].position
    gbArr[gi++] = p.x;   gbArr[gi++] = p.y;   gbArr[gi++] = p.z
    gbArr[gi++] = mcsP.x; gbArr[gi++] = mcsP.y; gbArr[gi++] = mcsP.z
  }
  const gbGeo = new THREE.BufferGeometry()
  gbGeo.setAttribute('position', new THREE.BufferAttribute(gbArr, 3))
  ecef.add(new THREE.LineSegments(
    gbGeo,
    new THREE.LineBasicMaterial({ color: 0xffcc00, transparent: true, opacity: 0.40 })
  ))

  // ────────────────────────────────────────────────────────────────────────
  //  GEO 高轨管控层：3 Jetson "主控脑" 节点
  //  赤道均布 0°/120°/240°，35786 km
  // ────────────────────────────────────────────────────────────────────────
  const geoMeshes: THREE.Mesh[] = []

  // GEO 轨道带（静态细环，体现同步轨道位置）
  const geoBelt = new THREE.Mesh(
    new THREE.RingGeometry(R_GEO - 0.06, R_GEO + 0.06, 128),
    new THREE.MeshBasicMaterial({ color: 0xff3333, side: THREE.DoubleSide, transparent: true, opacity: 0.06 })
  )
  geoBelt.rotation.x = Math.PI / 2
  ecef.add(geoBelt)

  GEO_LONS.forEach(lon => {
    // 主球体（大）
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.20, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xff3333 })
    )
    core.position.copy(ll2v3(0, lon, R_GEO))
    ecef.add(core)
    geoMeshes.push(core)

    // 外圈光环（体现"脑节点"身份）
    const halo = new THREE.Mesh(
      new THREE.RingGeometry(0.30, 0.34, 32),
      new THREE.MeshBasicMaterial({ color: 0xff6666, side: THREE.DoubleSide, transparent: true, opacity: 0.50 })
    )
    halo.position.copy(core.position)
    halo.lookAt(0, 0, 0)
    ecef.add(halo)
  })

  // GEO 骨干闭环（三者两两相连）
  const geoRingArr = new Float32Array(3 * 2 * 3)
  let ri = 0
  const addSeg = (a: THREE.Vector3, b: THREE.Vector3) => {
    geoRingArr[ri++] = a.x; geoRingArr[ri++] = a.y; geoRingArr[ri++] = a.z
    geoRingArr[ri++] = b.x; geoRingArr[ri++] = b.y; geoRingArr[ri++] = b.z
  }
  addSeg(geoMeshes[0].position, geoMeshes[1].position)
  addSeg(geoMeshes[1].position, geoMeshes[2].position)
  addSeg(geoMeshes[2].position, geoMeshes[0].position)
  const geoRingGeo = new THREE.BufferGeometry()
  geoRingGeo.setAttribute('position', new THREE.BufferAttribute(geoRingArr, 3))
  ecef.add(new THREE.LineSegments(
    geoRingGeo,
    new THREE.LineBasicMaterial({ color: 0xff3333, transparent: true, opacity: 0.80 })
  ))

  // GEO-B (120°) 馈电直连 MCS（对标北斗：国内集中主控）
  const feedArr = new Float32Array(6)
  const gB = geoMeshes[1].position
  const ms = gsMeshes[0].position
  feedArr[0] = gB.x; feedArr[1] = gB.y; feedArr[2] = gB.z
  feedArr[3] = ms.x; feedArr[4] = ms.y; feedArr[5] = ms.z
  const feedGeo = new THREE.BufferGeometry()
  feedGeo.setAttribute('position', new THREE.BufferAttribute(feedArr, 3))
  ecef.add(new THREE.Line(feedGeo, new THREE.LineBasicMaterial({ color: 0x44ffaa, transparent: true, opacity: 0.70 })))

  // ────────────────────────────────────────────────────────────────────────
  //  LEO 低轨数据转发层：Walker Delta 55°: 15/3/1
  //  3 轨道面 × 5 星 = 15 颗 LEO（树莓派节点）
  //  相位偏移 f=1：Δφ = 2π·f / N_total = 2π/15
  // ────────────────────────────────────────────────────────────────────────
  interface SatData {
    mesh: THREE.Mesh
    angle: number
    speed: number
    planeIndex: number
    hasD2G: boolean       // 优先级1：已被地面站直连
    hasGEO: boolean       // 优先级2：被 GEO 选中中继
    intraLine?: THREE.LineLoop
    planeSats?: SatData[]
  }

  const leoSats: SatData[] = []
  const satGeo = new THREE.SphereGeometry(0.05, 12, 12)

  RAANS.forEach((raanDeg, pi) => {
    const planeGrp = new THREE.Group()
    planeGrp.rotation.order = 'YXZ'
    planeGrp.rotation.y = (raanDeg * Math.PI) / 180
    planeGrp.rotation.x = INCLINATION
    scene.add(planeGrp)

    // 轨道迹（各面独立配色）
    const trace = new THREE.Mesh(
      new THREE.RingGeometry(R_LEO - 0.004, R_LEO + 0.004, 128),
      new THREE.MeshBasicMaterial({ color: PLANE_COLORS[pi], side: THREE.DoubleSide, transparent: true, opacity: 0.12 })
    )
    trace.rotation.x = Math.PI / 2
    planeGrp.add(trace)

    const planeSats: SatData[] = []
    // Walker 相位偏移（f=1）
    const phase = pi * (2 * Math.PI / (RAANS.length * SATS_PER_PLANE))

    for (let i = 0; i < SATS_PER_PLANE; i++) {
      const angle = i * ((2 * Math.PI) / SATS_PER_PLANE) + phase
      const sat = new THREE.Mesh(satGeo, new THREE.MeshBasicMaterial({ color: PLANE_COLORS[pi] }))
      sat.position.set(R_LEO * Math.cos(angle), 0, -R_LEO * Math.sin(angle))
      planeGrp.add(sat)

      const sd: SatData = {
        mesh: sat, angle, speed: LEO_SPEED,
        planeIndex: pi, hasD2G: false, hasGEO: false
      }
      leoSats.push(sd)
      planeSats.push(sd)
    }

    // 同轨骨干环（永久连通，各面颜色一致）
    const ig = new THREE.BufferGeometry()
    ig.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SATS_PER_PLANE * 3), 3))
    const il = new THREE.LineLoop(ig, new THREE.LineBasicMaterial({ color: PLANE_COLORS[pi], transparent: true, opacity: 0.55 }))
    planeGrp.add(il)
    planeSats[0].intraLine = il
    planeSats[0].planeSats = planeSats
  })

  // ── 动态链路缓冲区 ────────────────────────────────────────────────────
  const d2gGeo   = dynBuf(15)   // LEO→地面（最多 15 条）
  const relayGeo = dynBuf(9)    // LEO→GEO（3 Agent × 3 面 = 最多 9 条）
  const islGeo   = dynBuf(60)   // 跨轨 ISL

  const d2dMesh = new THREE.LineSegments(d2gGeo,
    new THREE.LineBasicMaterial({ color: 0x33ff66, transparent: true, opacity: 0.90 }))
  const relMesh = new THREE.LineSegments(relayGeo,
    new THREE.LineBasicMaterial({ color: 0xff5533, transparent: true, opacity: 0.70, blending: THREE.AdditiveBlending }))
  const islMesh = new THREE.LineSegments(islGeo,
    new THREE.LineBasicMaterial({ color: 0xbb44ff, transparent: true, opacity: 0.45 }))
  scene.add(d2dMesh, relMesh, islMesh)

  const d2gArr   = d2gGeo.attributes.position.array   as Float32Array
  const relArr   = relayGeo.attributes.position.array  as Float32Array
  const islArr   = islGeo.attributes.position.array    as Float32Array

  const pA = new THREE.Vector3(), pB = new THREE.Vector3()

  // ── ResizeObserver ─────────────────────────────────────────────────────
  ro = new ResizeObserver(() => {
    const w = el.clientWidth, h = el.clientHeight
    if (!w || !h) return
    cam.aspect = w / h
    cam.updateProjectionMatrix()
    renderer!.setSize(w, h)
  })
  ro.observe(el)

  // ────────────────────────────────────────────────────────────────────────
  //  动画循环
  // ────────────────────────────────────────────────────────────────────────
  function animate() {
    animId = requestAnimationFrame(animate)
    ctrl.update()

    // ECEF 旋转（地球自转 + GEO 相对地面静止）
    ecef.rotation.y += 0.0008

    // LEO 推进轨道角
    leoSats.forEach(sd => {
      sd.angle += sd.speed
      sd.mesh.position.set(R_LEO * Math.cos(sd.angle), 0, -R_LEO * Math.sin(sd.angle))
    })

    // 更新同轨骨干环（始终连通）
    leoSats.forEach(sd => {
      if (!sd.intraLine || !sd.planeSats) return
      const arr = sd.intraLine.geometry.attributes.position.array as Float32Array
      sd.planeSats.forEach((ps, idx) => {
        arr[idx * 3]     = ps.mesh.position.x
        arr[idx * 3 + 1] = ps.mesh.position.y
        arr[idx * 3 + 2] = ps.mesh.position.z
      })
      sd.intraLine.geometry.attributes.position.needsUpdate = true
    })

    // ── 跨轨 ISL（LEO Mesh）：赤道孤岛效应 ──────────────────────────────
    // 距离超过阈值时（赤道上空轨道面间距大）链路断开；
    // 高纬度交织区距离收拢后重新闭合。
    let islIdx = 0, islActive = 0
    for (let i = 0; i < leoSats.length; i++) {
      for (let j = i + 1; j < leoSats.length; j++) {
        if (leoSats[i].planeIndex === leoSats[j].planeIndex) continue
        leoSats[i].mesh.getWorldPosition(pA)
        leoSats[j].mesh.getWorldPosition(pB)
        if (pA.distanceTo(pB) < ISL_DIST && islIdx + 6 <= islArr.length) {
          islArr[islIdx++] = pA.x; islArr[islIdx++] = pA.y; islArr[islIdx++] = pA.z
          islArr[islIdx++] = pB.x; islArr[islIdx++] = pB.y; islArr[islIdx++] = pB.z
          islActive++
        }
      }
    }
    islGeo.setDrawRange(0, islIdx / 3)
    islGeo.attributes.position.needsUpdate = true
    islCount.value = islActive

    // 重置覆盖标记
    leoSats.forEach(sd => { sd.hasD2G = false; sd.hasGEO = false })

    // ── 优先级 1：D2G 直连地面站 ────────────────────────────────────────
    let d2gIdx = 0, d2gActive = 0
    leoSats.forEach(sd => {
      sd.mesh.getWorldPosition(pA)
      let bestGS: THREE.Mesh | null = null, bestD = D2G_DIST
      gsMeshes.forEach(gs => {
        gs.getWorldPosition(pB)
        const d = pA.distanceTo(pB)
        if (d < bestD) { bestD = d; bestGS = gs }
      })
      if (bestGS && d2gIdx + 6 <= d2gArr.length) {
        sd.hasD2G = true
        ;(bestGS as THREE.Mesh).getWorldPosition(pB)
        d2gArr[d2gIdx++] = pA.x; d2gArr[d2gIdx++] = pA.y; d2gArr[d2gIdx++] = pA.z
        d2gArr[d2gIdx++] = pB.x; d2gArr[d2gIdx++] = pB.y; d2gArr[d2gIdx++] = pB.z
        d2gActive++
      }
    })
    d2gGeo.setDrawRange(0, d2gIdx / 3)
    d2gGeo.attributes.position.needsUpdate = true
    d2gCount.value = d2gActive

    // ── 优先级 2：GEO 中继（盲星→GEO 端机）───────────────────────────
    // EDRS 模型：每个 GEO Agent 装备 3 个对低轨端机，
    // 每端机只连接某一轨道面中距离最近的"盲星"（未被 D2G 覆盖）。
    let relIdx = 0, relActive = 0
    geoMeshes.forEach(geoM => {
      geoM.getWorldPosition(pB)
      for (let pi = 0; pi < RAANS.length; pi++) {
        let closest: SatData | null = null, minD = GEO_FOV
        leoSats.forEach(sd => {
          if (sd.planeIndex !== pi || sd.hasD2G) return
          sd.mesh.getWorldPosition(pA)
          const d = pA.distanceTo(pB)
          if (d < minD) { minD = d; closest = sd }
        })
        if (closest && relIdx + 6 <= relArr.length) {
          ;(closest as SatData).hasGEO = true
          ;(closest as SatData).mesh.getWorldPosition(pA)
          relArr[relIdx++] = pA.x; relArr[relIdx++] = pA.y; relArr[relIdx++] = pA.z
          relArr[relIdx++] = pB.x; relArr[relIdx++] = pB.y; relArr[relIdx++] = pB.z
          relActive++
        }
      }
    })
    relayGeo.setDrawRange(0, relIdx / 3)
    relayGeo.attributes.position.needsUpdate = true
    geoCount.value = relActive

    // ── 盲星统计（无 D2G，无 GEO——只能靠同轨骨干多跳）───────────────
    blindCount.value = leoSats.filter(sd => !sd.hasD2G && !sd.hasGEO).length

    renderer!.render(scene, cam)
  }

  animate()
}

onMounted(() => { if (containerRef.value) initScene(containerRef.value) })
onUnmounted(() => {
  cancelAnimationFrame(animId)
  ro?.disconnect()
  renderer?.dispose()
})
</script>

<template>
  <div class="sat-wrapper">
    <div ref="containerRef" class="sat-canvas"></div>

    <!-- ── 拓扑 HUD（左上）────────────────────────────────────────── -->
    <div class="hud hud-topo">
      <div class="hud-title">星网拓扑</div>

      <div class="hud-section">
        <div class="hud-sub">LEO 数据转发层 · 15 节点</div>
        <div v-for="(label, i) in ['面Ⅰ RAAN 30°','面Ⅱ RAAN 150°','面Ⅲ RAAN 270°']" :key="i" class="hud-plane-row">
          <span class="plane-dot" :style="{ background: ['#33ccff','#44ff99','#ffaa33'][i] }"></span>
          <span class="plane-label">轨道{{ label }}</span>
          <span class="plane-count">× 5 sat</span>
        </div>
      </div>

      <div class="hud-section">
        <div class="hud-sub">GEO 管控层 · 3 节点</div>
        <div v-for="(g, i) in ['GEO-A  0°','GEO-B 120°','GEO-C 240°']" :key="i" class="hud-plane-row">
          <span class="plane-dot" style="background:#ff4444; border-radius:50%"></span>
          <span class="plane-label">{{ g }}</span>
          <span class="plane-count">Jetson</span>
        </div>
      </div>
    </div>

    <!-- ── 链路状态 HUD（右上）────────────────────────────────────── -->
    <div class="hud hud-link">
      <div class="hud-title">链路状态</div>
      <div class="hud-row">
        <span class="hud-label">D2G 直连</span>
        <span class="hud-val" style="color:#33ff66">{{ d2gCount }}</span>
      </div>
      <div class="hud-row">
        <span class="hud-label">GEO 中继</span>
        <span class="hud-val" style="color:#ff5533">{{ geoCount }}</span>
      </div>
      <div class="hud-row">
        <span class="hud-label">跨轨 ISL</span>
        <span class="hud-val" style="color:#bb44ff">{{ islCount }}</span>
      </div>
      <div class="hud-row hud-blind">
        <span class="hud-label">盲星多跳</span>
        <span class="hud-val" style="color:#ffaa33">{{ blindCount }}</span>
      </div>
    </div>

    <!-- ── 图例（左下）────────────────────────────────────────────── -->
    <div class="legend">
      <div class="leg-group">
        <div class="leg-row"><span class="ldot" style="background:#ffcc00"></span>MCS 主控站</div>
        <div class="leg-row"><span class="lseg" style="background:#ffcc00;opacity:.5"></span>地面光缆汇聚</div>
      </div>
      <div class="leg-divider"></div>
      <div class="leg-group">
        <div class="leg-row"><span class="lseg" style="background:#33ff66"></span>D2G 直连地面</div>
        <div class="leg-row"><span class="lseg" style="background:#ff5533"></span>盲区→GEO 中继</div>
        <div class="leg-row"><span class="lseg" style="background:#bb44ff"></span>跨轨交织 ISL</div>
        <div class="leg-row"><span class="lseg" style="background:#ff3333;height:3px"></span>GEO 骨干闭环</div>
        <div class="leg-row"><span class="lseg" style="background:#44ffaa"></span>GEO-B→MCS 馈电</div>
      </div>
      <div class="leg-divider"></div>
      <div class="leg-group">
        <div class="leg-row"><span class="lseg" style="background:#33ccff"></span>同轨骨干环 (面Ⅰ)</div>
        <div class="leg-row"><span class="lseg" style="background:#44ff99"></span>同轨骨干环 (面Ⅱ)</div>
        <div class="leg-row"><span class="lseg" style="background:#ffaa33"></span>同轨骨干环 (面Ⅲ)</div>
      </div>
    </div>

    <div class="tip">左键拖拽 · 右键平移 · 滚轮缩放</div>
  </div>
</template>

<style scoped>
.sat-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background: #020508;
  border-radius: inherit;
  overflow: hidden;
}
.sat-canvas { width: 100%; height: 100%; }

/* ── 通用 HUD 底板 ─────────────────────────────────────── */
.hud {
  position: absolute;
  background: rgba(4, 8, 14, 0.90);
  border-radius: 8px;
  padding: 10px 13px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  pointer-events: none;
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.hud-title {
  color: #8edcff;
  font-size: 11px;
  letter-spacing: .1em;
  margin-bottom: 2px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(142,220,255,.2);
}

/* ── 拓扑 HUD（左上）────────────────────────────────────── */
.hud-topo {
  top: 14px;
  left: 14px;
  border: 1px solid rgba(142,220,255,.25);
  box-shadow: 0 0 12px rgba(142,220,255,.12);
  min-width: 190px;
}
.hud-section { display: flex; flex-direction: column; gap: 4px; }
.hud-sub {
  color: #6a8090;
  font-size: 10px;
  margin-bottom: 2px;
  letter-spacing: .05em;
}
.hud-plane-row {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ccc;
}
.plane-dot {
  width: 8px; height: 8px;
  border-radius: 2px;
  flex-shrink: 0;
}
.plane-label { flex: 1; color: #b0c4d8; }
.plane-count { color: #557080; font-size: 11px; }

/* ── 链路 HUD（右上）────────────────────────────────────── */
.hud-link {
  top: 14px;
  right: 14px;
  border: 1px solid rgba(51,255,102,.25);
  box-shadow: 0 0 12px rgba(51,255,102,.12);
  min-width: 150px;
}
.hud-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
}
.hud-label { color: #7a9aaa; }
.hud-val { font-weight: bold; font-size: 15px; }
.hud-blind { margin-top: 2px; padding-top: 5px; border-top: 1px solid rgba(255,255,255,.08); }

/* ── 图例（左下）────────────────────────────────────────── */
.legend {
  position: absolute;
  bottom: 14px;
  left: 14px;
  background: rgba(4, 8, 14, 0.90);
  border: 1px solid rgba(0,255,204,.20);
  border-radius: 8px;
  padding: 10px 13px;
  font-size: 11px;
  pointer-events: none;
  backdrop-filter: blur(8px);
  box-shadow: 0 0 12px rgba(0,255,204,.10);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.leg-group { display: flex; flex-direction: column; gap: 4px; }
.leg-divider {
  height: 1px;
  background: rgba(255,255,255,.08);
  margin: 3px 0;
}
.leg-row {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #99b0bc;
}
.ldot {
  flex-shrink: 0;
  display: inline-block;
  width: 9px; height: 9px;
  border-radius: 2px;
}
.lseg {
  flex-shrink: 0;
  display: inline-block;
  width: 15px;
  height: 2px;
}

/* ── 操作提示（右下）────────────────────────────────────── */
.tip {
  position: absolute;
  bottom: 14px;
  right: 14px;
  color: #3a5060;
  font-size: 11px;
  pointer-events: none;
}
</style>
