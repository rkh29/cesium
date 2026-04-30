<template>
  <div id="satmap-container" ref="containerRef">
    <iframe
      ref="iframeRef"
      :key="iframeSrc"
      class="satmap-iframe"
      :class="{ ready: iframeReady }"
      :src="iframeSrc"
      frameborder="0"
      allowfullscreen
      @load="onIframeLoad"
    />

    <div class="action-btns">
      <el-button
        :type="showAllStatus ? 'primary' : 'default'"
        plain
        @click="showAllStatus = !showAllStatus"
      >
        查看卫星状态
      </el-button>
      <el-button
        :type="isEditMode ? 'primary' : 'default'"
        plain
        @click="toggleEditDialog"
      >
        编辑卫星
      </el-button>
    </div>

    <transition name="side-panel">
      <div v-if="selectedSatellite" class="satellite-side-panel">
        <div class="side-panel-head">
          <div>
            <strong>{{ selectedSatellite.name }}</strong>
            <span>NORAD {{ selectedSatellite.id }} · {{ selectedSatellite.instanceId }}</span>
          </div>
          <span class="detail-status" :class="selectedSatellite.status">
            {{ getStatusLabel(selectedSatellite.status) }}
          </span>
        </div>
        <div class="side-panel-subtitle">
          已选中卫星，轨迹正在地图上高亮显示
        </div>
        <div class="side-panel-list">
          <div class="info-row">
            <label>轨道类型</label>
            <strong>{{ getOrbitClass(selectedSatellite.alt) }}</strong>
          </div>
          <div class="info-row">
            <label>轨道高度</label>
            <strong>{{ Math.round((selectedSatellite.alt || 0) / 1000) }} km</strong>
          </div>
          <div class="info-row">
            <label>轨道速度</label>
            <strong>{{ selectedOrbitMetrics.speedKps.toFixed(2) }} km/s</strong>
          </div>
          <div class="info-row">
            <label>轨道周期</label>
            <strong>{{ selectedOrbitMetrics.periodMinutes.toFixed(1) }} min</strong>
          </div>
        </div>
        <div class="side-panel-actions">
          <el-button type="primary" plain @click="showInfoDialog = true">
            查看卫星信息
          </el-button>
          <el-button plain @click="clearIframeOrbit">
            关闭轨迹
          </el-button>
        </div>
      </div>
    </transition>

    <el-dialog v-model="showAllStatus" title="卫星状态" width="420px" append-to-body>
      <div class="status-dialog-list">
        <button
          v-for="sat in satelliteStore.satellites"
          :key="sat.id"
          class="status-chip"
          :class="sat.status"
          @click="focusSatellite(sat)"
        >
          <div class="status-chip-main">
            <strong>{{ sat.name }}</strong>
            <span>{{ sat.instanceId }}</span>
          </div>
          <div class="status-chip-meta">
            <span class="status-badge" :class="sat.status">{{ getStatusLabel(sat.status) }}</span>
            <span>{{ sat.cpu.toFixed(1) }}%</span>
          </div>
        </button>
      </div>
    </el-dialog>

    

    <el-dialog
      v-model="showEditDialog"
      :title="editForm.id ? '编辑卫星' : '添加卫星'"
      width="760px"
      append-to-body
    >
      <div class="edit-dialog">
        <div class="edit-dialog-list">
          <div class="edit-dialog-actions">
            <el-button type="primary" size="small" @click="openAddDialog">
              + 添加自定义卫星
            </el-button>
          </div>

          <button
            v-for="sat in satelliteStore.satellites"
            :key="sat.id"
            class="edit-list-item"
            :class="{ active: editForm.id === sat.id }"
            @click="openEditDialog(sat)"
          >
            <div class="edit-item-info">
              <strong>{{ sat.name }}</strong>
              <span>{{ sat.instanceId }}</span>
            </div>
            <span class="status-badge" :class="sat.status">{{ getStatusLabel(sat.status) }}</span>
          </button>
        </div>

        <div class="edit-dialog-form">
          <el-form :model="editForm" label-width="80px">
            <el-form-item label="名称">
              <el-input v-model="editForm.name" />
            </el-form-item>
            <el-form-item label="高度(m)">
              <el-input-number v-model="editForm.alt" :step="1000" style="width: 100%" />
            </el-form-item>
            <el-form-item label="倾角(°)">
              <el-input-number v-model="editForm.inclination" :step="1" style="width: 100%" />
            </el-form-item>
            <el-form-item label="基准经度">
              <el-input-number v-model="editForm.baseLon" :step="1" style="width: 100%" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="editForm.status" style="width: 100%">
                <el-option label="正常" value="normal" />
                <el-option label="告警" value="warning" />
                <el-option label="严重" value="danger" />
                <el-option label="离线" value="offline" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <template #footer>
        <el-button v-if="editForm.id" type="danger" plain @click="deleteSat(editForm.id)">
          删除
        </el-button>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="showInfoDialog"
      title="卫星信息"
      width="640px"
      append-to-body
    >
      <div v-if="selectedSatellite" class="satellite-info-dialog">
        <div class="info-hero">
          <div>
            <strong>{{ selectedSatellite.name }}</strong>
            <span>NORAD {{ selectedSatellite.id }} · {{ selectedSatellite.instanceId }}</span>
          </div>
          <span class="detail-status" :class="selectedSatellite.status">
            {{ getStatusLabel(selectedSatellite.status) }}
          </span>
        </div>

        <div class="info-section">
          <div class="section-title">轨道与运行信息</div>
        </div>

        <div class="info-grid">
          <div class="info-card emphasis">
            <label>卫星编号</label>
            <strong>#{{ selectedSatellite.id }}</strong>
          </div>
          <div class="info-card emphasis">
            <label>卫星类型</label>
            <strong>{{ getOrbitClass(selectedSatellite.alt) }}</strong>
          </div>
          <div class="info-card">
            <label>轨道高度</label>
            <strong>{{ Math.round((selectedSatellite.alt || 0) / 1000) }} km</strong>
          </div>
          <div class="info-card">
            <label>轨道倾角</label>
            <strong>{{ Number(selectedSatellite.inclination || 0).toFixed(1) }}°</strong>
          </div>
          <div class="info-card">
            <label>基准经度</label>
            <strong>{{ Number(selectedSatellite.baseLon || 0).toFixed(1) }}°</strong>
          </div>
          <div class="info-card">
            <label>轨道周期</label>
            <strong>{{ selectedOrbitMetrics.periodMinutes.toFixed(1) }} 分钟</strong>
          </div>
          <div class="info-card">
            <label>轨道速度</label>
            <strong>{{ selectedOrbitMetrics.speedKps.toFixed(2) }} km/s</strong>
          </div>
          <div class="info-card emphasis">
            <label>运行状态</label>
            <strong>{{ getStatusLabel(selectedSatellite.status) }}</strong>
          </div>
          <div class="info-card">
            <label>CPU</label>
            <strong>{{ selectedSatellite.cpu.toFixed(1) }}%</strong>
          </div>
          <div class="info-card">
            <label>温度</label>
            <strong>{{ selectedSatellite.temp.toFixed(1) }}°C</strong>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useSatelliteStore } from '../../stores/satellite'

const props = withDefaults(
  defineProps<{
    showAllStatus?: boolean
  }>(),
  {
    showAllStatus: false
  }
)

const satelliteStore = useSatelliteStore()
const containerRef = ref<HTMLElement | null>(null)
const iframeRef = ref<HTMLIFrameElement | null>(null)
const iframeReady = ref(false)
const iframeSrc = './satellitemap/index.html?embed=c4&v=21'
const showAllStatus = ref(props.showAllStatus)
const isEditMode = ref(false)
const showEditDialog = ref(false)
const showInfoDialog = ref(false)
const iframeSetupRuns = ref(0)
const targetEyeDistance = 3.4
const EARTH_RADIUS_METERS = 6378137
const EARTH_MU = 3.986004418e14
let bordersKeepAliveTimer: ReturnType<typeof setInterval> | null = null
const selectedSatellite = computed(() => satelliteStore.selectedSatellite)
const selectedOrbitMetrics = computed(() => getOrbitMetrics(selectedSatellite.value?.alt || 500000))
const editForm = ref({
  id: 0,
  name: '',
  alt: 550000,
  inclination: 53,
  baseLon: 0,
  status: 'normal' as 'normal' | 'warning' | 'danger' | 'offline'
})

function getStatusLabel(status: string) {
  if (status === 'warning') return '告警'
  if (status === 'danger') return '严重'
  if (status === 'offline') return '离线'
  return '正常'
}

function focusSatellite(sat: any) {
  satelliteStore.selectedSatelliteId = sat.id
  showAllStatus.value = true
  sendToIframe({ type: 'focus-satellite', norad_id: sat.id })
}

function getOrbitClass(altitudeMeters: number) {
  const altitudeKm = Number(altitudeMeters || 0) / 1000
  if (altitudeKm >= 30000) return 'GEO'
  if (altitudeKm >= 10000) return 'MEO'
  return 'LEO'
}

function getOrbitMetrics(altitudeMeters: number) {
  const altitude = Math.max(Number(altitudeMeters || 0), 0)
  const orbitalRadius = EARTH_RADIUS_METERS + altitude
  const speedMps = Math.sqrt(EARTH_MU / orbitalRadius)
  const periodSeconds = 2 * Math.PI * Math.sqrt((orbitalRadius ** 3) / EARTH_MU)

  return {
    speedKps: speedMps / 1000,
    periodMinutes: periodSeconds / 60
  }
}

function resetEditForm() {
  editForm.value = {
    id: 0,
    name: '',
    alt: 550000,
    inclination: 53,
    baseLon: 0,
    status: 'normal'
  }
}

function openAddDialog() {
  resetEditForm()
  showEditDialog.value = true
  isEditMode.value = true
}

function openEditDialog(sat: any) {
  if (!sat) return
  editForm.value = {
    id: sat.id || 0,
    name: sat.name || '',
    alt: sat.alt || 550000,
    inclination: sat.inclination || 0,
    baseLon: sat.baseLon || 0,
    status: sat.status || 'normal'
  }
  showEditDialog.value = true
  isEditMode.value = true
}

function toggleEditDialog() {
  if (showEditDialog.value) {
    showEditDialog.value = false
    isEditMode.value = false
    return
  }
  openAddDialog()
}

function saveEdit() {
  const payload = {
    name: editForm.value.name,
    alt: editForm.value.alt,
    inclination: editForm.value.inclination,
    baseLon: editForm.value.baseLon,
    status: editForm.value.status
  }

  if (editForm.value.id) {
    satelliteStore.updateSatellite(editForm.value.id, payload)
  } else {
    satelliteStore.addSatellite(payload)
  }

  showEditDialog.value = false
  isEditMode.value = false
}

function deleteSat(id: number) {
  satelliteStore.deleteSatellite(id)
  if (editForm.value.id === id) {
    resetEditForm()
  }
}

function clearIframeOrbit() {
  sendToIframe({ type: 'clear-orbit' })
  satelliteStore.selectedSatelliteId = null
  showInfoDialog.value = false
}

function sendToIframe(msg: Record<string, unknown>) {
  try {
    iframeRef.value?.contentWindow?.postMessage({ source: 'c4-parent', ...msg }, '*')
  } catch {
    // Ignore cross-frame timing issues while the embed boots.
  }
}

function hideIframeChrome() {
  const win = iframeRef.value?.contentWindow
  const doc = iframeRef.value?.contentDocument
  if (!win || !doc) return false

  doc.documentElement.style.overflow = 'hidden'
  doc.documentElement.style.background = '#020811'
  doc.documentElement.classList.remove('preload')
  doc.body.style.margin = '0'
  doc.body.style.overflow = 'hidden'
  doc.body.style.background = '#020811'
  doc.body.style.opacity = '1'
  doc.body.classList.remove('splash-active')
  doc.body.classList.add('css-loaded')

  const styleId = 'c4-embed-overrides'
  let styleEl = doc.getElementById(styleId) as HTMLStyleElement | null
  if (!styleEl) {
    styleEl = doc.createElement('style')
    styleEl.id = styleId
    doc.head.appendChild(styleEl)
  }

  styleEl.textContent = `
    html, body { width: 100%; height: 100%; overflow: hidden !important; margin: 0; padding: 0; }
    #glCanvas { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important; display: block !important; z-index: 0; }
    #navbar-desktop,
    #mobile-menu-overlay,
    #mobile-menu,
    #about_modal,
    #starlink-welcome,
    #splash-screen,
    #search-trigger-icon,
    #lv_info,
    #pov_info,
    #pov_reentry_info,
    #vis_help_icon,
    #helpModal,
    #bgtitle {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
    #dropdownMore,
    #dropdownTypes,
    #dropdownFunctions,
    #dropdownCalculators,
    #dropdownShare,
    #dropdownSettings,
    #dropdownInfo,
    #dropdownConstellationData,
    #types_menu_items,
    #constellation_menu_items,
    #mobile-constellation-menu,
    #mobile-more-menu,
    #mobile_types_menu_items,
    #desktop-constellation-data-item,
    #timeline-tab-list,
    #growth-panel,
    #launches-panel,
    #decays-panel,
    #events-panel,
    #bottom-bar,
    #controls,
    #control-panel,
    .navbar-dropdown-menu,
    .navbar-dropdown-list,
    .navbar-desktop-dropdown-item,
    .navbar-mobile-dropdown-item,
    .bottom-panel,
    .right-panel,
    .side-panel,
    .overlay-panel,
    .draggable-window,
    .lv-info-window,
    .sat-info-panel,
    .info-panel {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
  `

  const removeSelectors = [
    'nav',
    '#navbar-desktop',
    '#mobile-menu-overlay',
    '#mobile-menu',
    '#timeline_chart_modal',
    '#credits_modal',
    '#about_modal',
    '#starlink-welcome',
    '#splash-screen',
    '#dropdownNews',
    '#dropdownNavbar',
    '#dropdownTypes',
    '#dropdownFunctions',
    '#dropdownMore',
    '#timeline-tab-content',
    '#timeline-tab-list',
    '#growth-panel',
    '#launches-panel',
    '#decays-panel',
    '#orbits-panel',
    '#ground-stations-panel',
    '#events-panel',
    '#desktop-constellation-data-item',
    '.navbar-dropdown-menu',
    '.navbar-dropdown-list',
    '.navbar-mobile-menu',
    '.bottom-panel',
    '.right-panel',
    '.side-panel',
    '.overlay-panel',
    '.draggable-window',
    '.lv-info-window',
    '.sat-info-panel',
    '.info-panel'
  ]
  removeSelectors.forEach((selector) => {
    doc.querySelectorAll(selector).forEach((node) => node.remove())
  })
  Array.from(doc.body.children).forEach((node) => {
    const el = node as HTMLElement
    const id = el.id || ''
    if (id === 'glCanvas' || id === 'c4-link-overlay') return
    el.remove()
  })

  const canvas = doc.getElementById('glCanvas') as HTMLCanvasElement | null
  if (canvas) {
    canvas.style.position = 'fixed'
    canvas.style.inset = '0'
    canvas.style.width = '100vw'
    canvas.style.height = '100vh'
    canvas.style.display = 'block'
  }

  const globe = (win as any).globe
  if (globe) {
    if ('show_borders' in globe) globe.show_borders = 2
    if ('show_texstyle' in globe) globe.show_texstyle = 2
    if ('show_dotlighting' in globe) globe.show_dotlighting = 1
    if ('show_skybox' in globe) globe.show_skybox = 2
    if ('show_sun' in globe) globe.show_sun = 1
    if ('show_clouds' in globe) globe.show_clouds = 0
    if ('show_rotating' in globe) globe.show_rotating = 1
    if ('show_labels' in globe) globe.show_labels = 1
    if ('requestOptimalZoom' in globe) globe.requestOptimalZoom = false
    if (typeof (globe as any).calculateOptimalZoom === 'function') {
      ;(globe as any).calculateOptimalZoom = () => null
    }
    if ('cameraPath' in globe) globe.cameraPath = null
    if ('eyeDistance' in globe) globe.eyeDistance = targetEyeDistance
    if (Array.isArray(globe.eye)) globe.eye = [0, 0, targetEyeDistance]
  }

  return true
}

function forceReferenceEarthVisuals() {
  const win = iframeRef.value?.contentWindow as any
  if (!win) return
  const g = win.globe || win.blueGlobe
  if (!g) return
  if ('show_borders' in g) g.show_borders = 2
  if ('show_texstyle' in g) g.show_texstyle = 2
  if ('show_dotlighting' in g) g.show_dotlighting = 1
    if ('show_skybox' in g) g.show_skybox = 2
  if ('show_sun' in g) g.show_sun = 1
  if ('show_clouds' in g) g.show_clouds = 0
  if ('show_rotating' in g) g.show_rotating = 1
  if ('show_labels' in g) g.show_labels = 1
}

function scheduleIframeSetup() {
  const ok = hideIframeChrome()
  forceReferenceEarthVisuals()
  iframeSetupRuns.value += 1
  if (iframeSetupRuns.value < 40) {
    window.setTimeout(scheduleIframeSetup, 300)
  } else {
    if (ok) iframeReady.value = true
    // Keep the reference globe styling alive in case the underlying map resets it later.
    if (!bordersKeepAliveTimer) {
      bordersKeepAliveTimer = setInterval(() => {
        forceReferenceEarthVisuals()
      }, 250)
    }
  }
  if (ok && iframeSetupRuns.value === 5) iframeReady.value = true
}

function onIframeLoad() {
  iframeReady.value = false
  iframeSetupRuns.value = 0
  if (bordersKeepAliveTimer) {
    clearInterval(bordersKeepAliveTimer)
    bordersKeepAliveTimer = null
  }
  window.setTimeout(scheduleIframeSetup, 0)
}

function onMessage(event: MessageEvent) {
  const data = event.data
  if (!data) return

  if (data.source === 'c4-satellitemap' && data.type === 'c4-selection') {
    const id: number | null = data.payload?.selectedId ?? null
    if (id == null) {
      satelliteStore.selectedSatelliteId = null
    } else {
      const sat = satelliteStore.satellites.find((item) => item.id === id)
      if (sat) {
        satelliteStore.selectedSatelliteId = sat.id
      }
    }
    return
  }

  if (data.source !== 'c4-bridge') return

  if (data.type === 'satellite-deselected') {
    satelliteStore.selectedSatelliteId = null
    showInfoDialog.value = false
  }
}

onMounted(() => {
  window.addEventListener('message', onMessage)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', onMessage)
  if (bordersKeepAliveTimer) {
    clearInterval(bordersKeepAliveTimer)
    bordersKeepAliveTimer = null
  }
})
</script>

<style scoped>
:scope {
  --sat-panel-text: #f5f9fd;
  --sat-panel-muted: #9cb3c7;
  --sat-panel-soft: #89a3bb;
  --sat-dialog-text: #f5f9fd;
  --sat-dialog-muted: #9cb3c7;
  --sat-dialog-title: #d8e7f5;
  --sat-dialog-card-bg: rgba(255, 255, 255, 0.035);
  --sat-dialog-card-border: rgba(255, 255, 255, 0.06);
  --sat-dialog-hero-bg: linear-gradient(180deg, rgba(10, 22, 37, 0.95), rgba(7, 14, 23, 0.9));
  --sat-dialog-hero-border: rgba(136, 170, 208, 0.14);
  --sat-dialog-emphasis-bg: linear-gradient(180deg, rgba(20, 39, 61, 0.58), rgba(13, 23, 35, 0.48));
  --sat-dialog-emphasis-border: rgba(94, 153, 214, 0.24);
}

:global(html:not(.dark)) #satmap-container {
  --sat-dialog-text: #1f2937;
  --sat-dialog-muted: #5b6b7f;
  --sat-dialog-title: #1f3652;
  --sat-dialog-card-bg: rgba(241, 245, 249, 0.92);
  --sat-dialog-card-border: rgba(148, 163, 184, 0.3);
  --sat-dialog-hero-bg: linear-gradient(180deg, rgba(248, 250, 252, 0.98), rgba(236, 242, 248, 0.96));
  --sat-dialog-hero-border: rgba(148, 163, 184, 0.32);
  --sat-dialog-emphasis-bg: linear-gradient(180deg, rgba(226, 239, 251, 0.96), rgba(236, 244, 252, 0.92));
  --sat-dialog-emphasis-border: rgba(96, 165, 250, 0.3);
}

#satmap-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: radial-gradient(circle at center, #09131f 0%, #020811 58%, #01040a 100%);
}

.satmap-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
  background: #020811;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.satmap-iframe.ready {
  opacity: 1;
}

.action-btns {
  position: absolute;
  top: 20px;
  right: 24px;
  z-index: 12;
  display: flex;
  gap: 8px;
  pointer-events: auto;
}

.action-btns .el-button {
  background: rgba(14, 25, 43, 0.85) !important;
  backdrop-filter: blur(16px);
  border-color: rgba(64, 158, 255, 0.4) !important;
  color: #eaf3fb !important;
}

.status-dialog-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: min(60vh, 560px);
  overflow: auto;
  padding-right: 4px;
}

.status-chip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  text-align: left;
  cursor: pointer;
}

.status-chip.normal { box-shadow: inset 0 0 0 1px rgba(0, 210, 255, 0.16); }
.status-chip.warning { box-shadow: inset 0 0 0 1px rgba(255, 208, 75, 0.14); background: rgba(255, 208, 75, 0.08); }
.status-chip.danger { box-shadow: inset 0 0 0 1px rgba(255, 107, 107, 0.14); background: rgba(255, 107, 107, 0.1); }
.status-chip.offline { box-shadow: inset 0 0 0 1px rgba(123, 135, 148, 0.14); background: rgba(123, 135, 148, 0.1); }

.status-chip-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.status-chip-main strong,
.status-chip-meta span,
.float-card-head strong,
.float-item strong,
.edit-item-info strong {
  color: var(--sat-panel-text);
}

.status-chip-main span,
.float-card-head span,
.float-item label,
.edit-item-info span {
  color: var(--sat-panel-muted);
}

.status-chip-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.status-badge,
.detail-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.normal, .detail-status.normal { color: #00d2ff; background: rgba(0, 210, 255, 0.15); }
.status-badge.warning, .detail-status.warning { color: #ffd04b; background: rgba(255, 208, 75, 0.14); }
.status-badge.danger, .detail-status.danger { color: #ff8c8c; background: rgba(255, 107, 107, 0.16); }
.status-badge.offline, .detail-status.offline { color: #b6c2cf; background: rgba(123, 135, 148, 0.18); }

.satellite-side-panel {
  position: absolute;
  top: 86px;
  right: 24px;
  z-index: 12;
  width: min(340px, calc(100% - 32px));
  border: 1px solid rgba(136, 170, 208, 0.18);
  border-radius: 16px;
  padding: 12px;
  background: rgba(9, 16, 26, 0.88);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(12px);
  pointer-events: auto;
}

.side-panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.side-panel-head > div,
.info-hero > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.side-panel-subtitle {
  color: var(--sat-panel-soft);
  font-size: 12px;
  line-height: 1.5;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.collapse-btn {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #eaf3fb;
}

.side-panel-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 8px;
}

.float-item {
  padding: 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
}

.float-item label,
.float-item strong {
  display: block;
}

.float-item strong {
  margin-top: 6px;
}

.anomaly-box {
  margin-top: 10px;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.2);
}

.float-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.float-actions .el-button {
  flex: 1;
}

.side-panel-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.side-panel-actions .el-button {
  flex: 1;
  min-height: 34px;
  border-radius: 10px;
}

.satellite-info-dialog {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid var(--sat-dialog-hero-border);
  background: var(--sat-dialog-hero-bg);
}

.info-hero strong,
.info-card strong {
  color: var(--sat-dialog-text);
}

.info-hero span,
.info-card label {
  color: var(--sat-dialog-muted);
}

.info-section {
  display: flex;
  align-items: center;
}

.section-title {
  color: var(--sat-dialog-title);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.info-card {
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--sat-dialog-card-bg);
  border: 1px solid var(--sat-dialog-card-border);
}

.info-card label,
.info-card strong {
  display: block;
}

.info-card strong {
  margin-top: 5px;
}

.info-card.emphasis {
  background: var(--sat-dialog-emphasis-bg);
  border-color: var(--sat-dialog-emphasis-border);
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 2px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.info-row:last-child {
  border-bottom: none;
}

.info-row label {
  color: var(--sat-dialog-muted);
  font-size: 12px;
}

.info-row strong {
  color: var(--sat-dialog-text);
  font-size: 13px;
  font-weight: 600;
}

.edit-dialog {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 16px;
}

.edit-dialog-list {
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 60vh;
  overflow: auto;
  padding-right: 4px;
}

.edit-dialog-actions {
  margin-bottom: 2px;
}

.edit-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  cursor: pointer;
  text-align: left;
}

.edit-list-item.active {
  border-color: rgba(64, 158, 255, 0.45);
  box-shadow: inset 0 0 0 1px rgba(64, 158, 255, 0.18);
}

.edit-item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.edit-dialog-form {
  padding: 4px 0 0;
}

.fade-panel-enter-active,
.fade-panel-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.fade-panel-enter-from,
.fade-panel-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}

.side-panel-enter-active,
.side-panel-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.side-panel-enter-from,
.side-panel-leave-to {
  opacity: 0;
  transform: translateX(18px);
}

@media (max-width: 960px) {
  .action-btns {
    top: 16px;
    right: 16px;
    left: 16px;
    justify-content: flex-end;
  }

  .satellite-side-panel {
    top: auto;
    right: 16px;
    left: 16px;
    bottom: 16px;
    width: auto;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .edit-dialog {
    grid-template-columns: 1fr;
  }
}
</style>
