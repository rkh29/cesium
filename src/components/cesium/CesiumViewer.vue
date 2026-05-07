<template>
  <div id="cesium-container" ref="cesiumContainer">
    <div v-if="showOverlay" class="cinematic-overlay">
      <div class="overlay-top">
        <div class="theater-badge">卫星群视图</div>
        <div class="legend">
          <span><i class="dot leo"></i>低轨卫星</span>
          <span><i class="dot meo"></i>中轨卫星</span>
          <span><i class="dot geo"></i>高轨卫星</span>
          <span><i class="dot ground"></i>地面站</span>
          <span><i class="dot warn"></i>告警链路</span>
          <span><i class="dot path"></i>通信路径</span>
          <span><i class="dot uplink"></i>地面站链路</span>
        </div>
      </div>

      <div class="overlay-bottom">
        <div class="hud-card">
          <span class="hud-label">可视卫星</span>
          <strong>{{ satelliteCount }}</strong>
          <small>当前三维场景卫星数量</small>
        </div>
        <div class="hud-card">
          <span class="hud-label">当前焦点</span>
          <strong>{{ focusedSatelliteName }}</strong>
          <small>{{ focusedSatelliteStatus }}</small>
        </div>
        <div class="hud-card">
          <span class="hud-label">场景模式</span>
          <strong>{{ sceneMode }}</strong>
          <small>自动巡航与手动查看切换</small>
        </div>
      </div>
    </div>

    <transition name="fade-panel">
      <div
        v-if="showAllStatus"
        class="status-drawer"
        @wheel.stop
        @mousedown.stop
        @touchmove.stop
      >
        <div class="status-drawer-head">
          <strong>卫星状态</strong>
          <span>{{ satelliteStore.satellites.length }} 颗</span>
        </div>
        <div
          class="status-drawer-list"
          @wheel.stop
          @mousedown.stop
          @touchmove.stop
          @pointerdown.stop
        >
          <button
            v-for="sat in satelliteStore.satellites"
            :key="sat.id"
            class="status-chip"
            :class="sat.status"
            @click="focusSatelliteFromPanel(sat.id)"
          >
            <div>
              <strong>{{ sat.name }}</strong>
              <span>{{ sat.instanceId }}</span>
            </div>
            <div class="status-chip-meta">
              <span class="status-badge" :class="sat.status">{{ getStatusLabel(sat.status) }}</span>
              <span>{{ sat.cpu.toFixed(1) }}%</span>
            </div>
          </button>
        </div>
      </div>
    </transition>

    <transition name="fade-panel">
      <div v-if="selectedSatelliteCard" class="satellite-float-card">
        <div class="float-card-head">
          <div>
            <strong>{{ selectedSatelliteCard.name }}</strong>
            <span>{{ selectedSatelliteCard.instanceId }}</span>
          </div>
          <el-button class="collapse-btn" plain @click="clearSelection">收起状态</el-button>
        </div>
        <div class="float-card-grid">
          <div class="float-item">
            <label>状态</label>
            <strong class="detail-status" :class="selectedSatelliteCard.status">{{ getStatusLabel(selectedSatelliteCard.status) }}</strong>
          </div>
          <div class="float-item">
            <label>CPU</label>
            <strong>{{ selectedSatelliteCard.cpu.toFixed(1) }}%</strong>
          </div>
          <div class="float-item">
            <label>温度</label>
            <strong>{{ selectedSatelliteCard.temp.toFixed(1) }}°C</strong>
          </div>
          <div class="float-item">
            <label>高度</label>
            <strong>{{ Math.round((selectedSatelliteCard.alt || 0) / 1000) }} km</strong>
          </div>
          <div v-if="selectedOrbitMetrics" class="float-item">
            <label>閫熷害</label>
            <strong>{{ selectedOrbitMetrics.speedKps.toFixed(2) }} km/s</strong>
          </div>
          <div v-if="selectedOrbitMetrics" class="float-item">
            <label>鍛ㄦ湡</label>
            <strong>{{ selectedOrbitMetrics.periodMinutes.toFixed(1) }} min</strong>
          </div>
        </div>
        <div v-if="selectedSatelliteCard.status !== 'normal'" class="float-item anomaly-box" style="margin-top: 10px; background: rgba(255, 107, 107, 0.1); border: 1px solid rgba(255, 107, 107, 0.2);">
          <label style="color: #ff8c8c">异常情况</label>
          <strong style="color: #fff; font-size: 13px; font-weight: normal; margin-top: 4px;">
            {{ selectedSatelliteCard.status === 'danger' ? '严重故障：链路断开或组件离线' : '告警：性能指标超限' }}
          </strong>
        </div>
        <div style="margin-top: 12px; display: flex; gap: 8px;">
           <el-button type="primary" size="small" style="flex: 1;" @click="openEditDialog(selectedSatelliteCard)">编辑此卫星</el-button>
        </div>
      </div>
    </transition>

    <el-button 
      v-if="showOverlay && !isEditMode && !selectedSatelliteCard" 
      class="floating-edit-btn" 
      type="primary" 
      plain
      @click="isEditMode = true"
    >
      编辑卫星菜单
    </el-button>

    <!-- 通信路径控制面板 -->
    <transition name="fade-panel">
      <div
        v-if="showOverlay && showPathPanel"
        class="comm-path-panel"
        @wheel.stop
        @mousedown.stop
        @touchmove.stop
      >
        <div class="comm-path-head">
          <strong>通信传输链路</strong>
          <el-button size="small" plain @click="showPathPanel = false">收起</el-button>
        </div>
        <div class="comm-path-row">
          <label>源端</label>
          <el-select v-model="pathSourceId" size="small" placeholder="选择地面站" style="width: 100%">
            <el-option
              v-for="g in groundStationOptions"
              :key="g.id"
              :label="g.name"
              :value="g.id"
            />
          </el-select>
        </div>
        <div class="comm-path-row">
          <label>目的端</label>
          <el-select v-model="pathTargetId" size="small" placeholder="选择地面站" style="width: 100%">
            <el-option
              v-for="g in groundStationOptions"
              :key="g.id"
              :label="g.name"
              :value="g.id"
            />
          </el-select>
        </div>
        <div class="comm-path-actions">
          <el-button type="primary" size="small" :disabled="!canRoute" @click="computeAndShowPath">
            自动寻路并高亮
          </el-button>
          <el-button size="small" @click="showDemoPath">演示</el-button>
          <el-button size="small" plain :disabled="activePath.length === 0" @click="clearActivePath">
            清除
          </el-button>
        </div>
        <div class="comm-path-row uplink-toggle-row">
          <el-switch
            v-model="highlightUplinks"
            size="small"
            inline-prompt
            active-text="高亮地面站↔卫星上下行"
            inactive-text="不高亮地面站链路"
            @change="rebuildScene"
          />
          <span class="uplink-hint">共 {{ uplinkLinkCount }} 条地面站上下行链路（按经纬度自动接入最近 LEO）</span>
        </div>
        <div v-if="pathHopsLabel" class="comm-path-info">
          <span>路径: {{ pathHopsLabel }}</span>
          <span>跳数: {{ Math.max(activePath.length - 1, 0) }}</span>
        </div>
        <div v-else-if="pathError" class="comm-path-error">{{ pathError }}</div>
      </div>
    </transition>

    <el-button
      v-if="showOverlay && !showPathPanel"
      class="floating-path-btn"
      type="success"
      plain
      @click="showPathPanel = true"
    >
      通信链路
    </el-button>

    <el-button
      v-if="showOverlay"
      class="floating-ground-btn"
      type="warning"
      plain
      @click="showGroundDialog = true"
    >
      地面站管理
    </el-button>

    <el-dialog
      v-model="showGroundDialog"
      title="地面站管理"
      width="640px"
      append-to-body
      class="ground-dialog"
    >
      <el-tabs v-model="groundActiveTab">
        <el-tab-pane label="导入预设全球基站" name="preset">
          <div class="ground-tip">
            选中需要导入的全球地面站，点击「导入选中」会同步在 3D 地图上落点，并自动生成与最近 2 颗 LEO 卫星的上下行链路。
          </div>
          <el-table
            :data="presetTableData"
            height="320"
            size="small"
            @selection-change="onPresetSelectionChange"
          >
            <el-table-column type="selection" width="44" />
            <el-table-column prop="name" label="名称" min-width="160" />
            <el-table-column prop="latitude" label="纬度" width="90" />
            <el-table-column prop="longitude" label="经度" width="90" />
            <el-table-column label="状态" width="90">
              <template #default="{ row }">
                <el-tag v-if="row.imported" type="success" size="small">已导入</el-tag>
                <el-tag v-else type="info" size="small">未导入</el-tag>
              </template>
            </el-table-column>
          </el-table>
          <div class="ground-actions">
            <el-button size="small" @click="importPresets(false)">导入选中</el-button>
            <el-button type="primary" size="small" @click="importPresets(true)">全部导入</el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="手动添加地面站" name="manual">
          <el-form :model="manualForm" label-width="80px" size="small" @submit.prevent>
            <el-form-item label="名称">
              <el-input v-model="manualForm.name" placeholder="例：北京主控站" maxlength="32" />
            </el-form-item>
            <el-form-item label="纬度">
              <el-input-number
                v-model="manualForm.latitude"
                :min="-90"
                :max="90"
                :precision="4"
                :step="0.5"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item label="经度">
              <el-input-number
                v-model="manualForm.longitude"
                :min="-180"
                :max="180"
                :precision="4"
                :step="0.5"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="submitManual">添加到地图</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane :label="`已添加自定义 (${customGroundStations.length})`" name="list">
          <div v-if="customGroundStations.length === 0" class="ground-empty">
            还没有用户添加的地面站
          </div>
          <div v-else class="custom-ground-list">
            <div v-for="g in customGroundStations" :key="g.id" class="custom-ground-item">
              <div>
                <strong>{{ g.name }}</strong>
                <span>{{ g.latitude.toFixed(2) }}, {{ g.longitude.toFixed(2) }}</span>
                <em v-if="g.preset">（预设）</em>
              </div>
              <el-button size="small" link type="danger" @click="removeCustomGroundStation(g.id)">
                删除
              </el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>


    <transition name="fade-panel">
      <div v-if="isEditMode" class="edit-drawer" @wheel.stop @mousedown.stop @touchmove.stop>
        <div class="edit-drawer-head">
          <strong>卫星编辑</strong>
          <el-button size="small" plain @click="isEditMode = false">关闭</el-button>
        </div>
        <div style="margin-bottom: 12px;">
          <el-button type="primary" size="small" style="width: 100%;" @click="openAddDialog">
            + 添加自定义卫星
          </el-button>
        </div>
        <div class="edit-drawer-list">
          <div v-for="sat in satelliteStore.satellites" :key="sat.id" class="edit-list-item">
            <div class="edit-item-info">
              <strong>{{ sat.name }}</strong>
              <span class="status-badge" :class="sat.status" style="transform: scale(0.8); transform-origin: left center;">{{ getStatusLabel(sat.status) }}</span>
            </div>
            <div class="edit-item-actions">
              <el-button size="small" link type="primary" @click="openEditDialog(sat)">编辑</el-button>
              <el-button size="small" link type="danger" @click="deleteSat(sat.id)">删除</el-button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <el-dialog v-model="showEditDialog" :title="editForm.id ? '编辑卫星' : '添加卫星'" width="400px" append-to-body>
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="高度 (m)">
          <el-input-number v-model="editForm.alt" :step="1000" style="width: 100%" />
        </el-form-item>
        <el-form-item label="倾角 (°)">
          <el-input-number v-model="editForm.inclination" :step="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="基础经度">
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
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">确定</el-button>
      </template>
    </el-dialog>

    <div v-if="webglUnavailable" class="cesium-placeholder">
      <div class="placeholder-content">
        <div class="placeholder-icon">3D</div>
        <div class="placeholder-title">三维场景暂不可用</div>
        <div class="placeholder-message">
          当前环境没有可用的 WebGL，系统已切换到降级展示模式，其余功能仍可继续使用。
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { useCesium } from '../../composables/useCesium'
import { useInstanceStore } from '../../stores/instance'
import { useLinkStore } from '../../stores/link'
import { useSatelliteStore } from '../../stores/satellite'
import { useUIStore } from '../../stores/ui'

const props = withDefaults(
  defineProps<{
    showAllStatus?: boolean
    showFloatCard?: boolean
    showOverlay?: boolean
  }>(),
  {
    showAllStatus: false,
    showFloatCard: true,
    showOverlay: true
  }
)

const cesiumContainer = ref<HTMLElement | null>(null)
const { initCesium, viewer } = useCesium()
const instanceStore = useInstanceStore()
const linkStore = useLinkStore()
const satelliteStore = useSatelliteStore()
const uiStore = useUIStore()

const isPaused = ref(false)
const webglUnavailable = ref(false)
const sceneMode = ref('自动巡航')
let interactionTimeout: number | null = null
let selectionHandler: Cesium.ScreenSpaceEventHandler | null = null

const EARTH_RADIUS_METERS = 6378137
const EARTH_MU = 3.986004418e14
const EARTH_ROTATION_RAD_PER_SEC = (2 * Math.PI) / 86164.0905

const satelliteCount = computed(() => satelliteStore.satellites.length)
const focusedSatelliteName = computed(() => satelliteStore.selectedSatellite?.name || '未选择')
const focusedSatelliteStatus = computed(() =>
  satelliteStore.selectedSatellite ? getStatusLabel(satelliteStore.selectedSatellite.status) : '全局自由视角'
)
const showAllStatus = computed(() => props.showAllStatus)
const selectedSatelliteCard = computed(() => satelliteStore.selectedSatellite)
const selectedOrbitMetrics = computed(() =>
  selectedSatelliteCard.value ? getOrbitMetrics(selectedSatelliteCard.value.alt || 500000) : null
)
const isEditMode = ref(false)
const showEditDialog = ref(false)

// ===== 地面站管理 (导入预设 / 手动添加) =====
interface GroundPreset {
  id: string
  name: string
  latitude: number
  longitude: number
}
interface CustomGroundRecord extends GroundPreset {
  preset?: boolean
}

const GLOBAL_GROUND_STATION_PRESETS: GroundPreset[] = [
  { id: 'ground-preset-beijing', name: '北京地面站', latitude: 39.9042, longitude: 116.4074 },
  { id: 'ground-preset-kashgar', name: '喀什地面站', latitude: 39.4677, longitude: 75.9898 },
  { id: 'ground-preset-sanya', name: '三亚地面站', latitude: 18.2528, longitude: 109.5119 },
  { id: 'ground-preset-mohe', name: '漠河地面站', latitude: 53.4836, longitude: 122.3653 },
  { id: 'ground-preset-lijiang', name: '丽江地面站', latitude: 26.8721, longitude: 100.2299 },
  { id: 'ground-preset-svalbard', name: 'Svalbard SvalSat', latitude: 78.2298, longitude: 15.4075 },
  { id: 'ground-preset-kourou', name: 'Kourou (法属圭亚那)', latitude: 5.166, longitude: -52.683 },
  { id: 'ground-preset-goldstone', name: 'Goldstone DSN', latitude: 35.4267, longitude: -116.89 },
  { id: 'ground-preset-madrid', name: 'Madrid DSN', latitude: 40.4314, longitude: -4.2481 },
  { id: 'ground-preset-canberra', name: 'Canberra DSN', latitude: -35.4014, longitude: 148.9819 },
  { id: 'ground-preset-houston', name: 'Houston Mission Control', latitude: 29.5586, longitude: -95.0894 },
  { id: 'ground-preset-cape', name: 'Cape Canaveral', latitude: 28.3922, longitude: -80.6077 },
  { id: 'ground-preset-wallops', name: 'Wallops Flight Facility', latitude: 37.9402, longitude: -75.4664 },
  { id: 'ground-preset-tokyo', name: 'Tokyo Tracking Station', latitude: 35.6762, longitude: 139.6503 },
  { id: 'ground-preset-sydney', name: 'Sydney Tracking Station', latitude: -33.8688, longitude: 151.2093 },
  { id: 'ground-preset-redu', name: 'Redu (ESA, Belgium)', latitude: 50.0019, longitude: 5.1453 },
  { id: 'ground-preset-malindi', name: 'Malindi (Kenya)', latitude: -2.9956, longitude: 40.1944 }
]

const CUSTOM_GROUND_STORAGE_KEY = 'custom-ground-stations-v1'

const showGroundDialog = ref(false)
const groundActiveTab = ref<'preset' | 'manual' | 'list'>('preset')
const presetSelection = ref<GroundPreset[]>([])
const manualForm = ref<{ name: string; latitude: number; longitude: number }>({
  name: '',
  latitude: 30,
  longitude: 110
})
const customGroundStations = ref<CustomGroundRecord[]>([])

const presetTableData = computed(() =>
  GLOBAL_GROUND_STATION_PRESETS.map((p) => ({
    ...p,
    imported: customGroundStations.value.some((c) => c.id === p.id)
  }))
)

function onPresetSelectionChange(rows: GroundPreset[]) {
  presetSelection.value = rows
}

function loadCustomGroundStations() {
  try {
    const raw = localStorage.getItem(CUSTOM_GROUND_STORAGE_KEY)
    if (!raw) return
    const list = JSON.parse(raw) as CustomGroundRecord[]
    if (Array.isArray(list)) customGroundStations.value = list
  } catch {
    /* ignore */
  }
}

function persistCustomGroundStations() {
  localStorage.setItem(CUSTOM_GROUND_STORAGE_KEY, JSON.stringify(customGroundStations.value))
}

// 在 stores 中物化一个地面站：写 instance + position
function materializeGroundStation(record: CustomGroundRecord) {
  if (!instanceStore.instances.find((i) => i.instance_id === record.id)) {
    instanceStore.instances.push({
      instance_id: record.id,
      name: record.name,
      type: 'ground-station',
      start: true,
      node_index: 0,
      extra: { custom: String(!record.preset) }
    })
  }
  satelliteStore.positions[record.id] = {
    latitude: record.latitude,
    longitude: record.longitude,
    altitude: 50
  }
  // 自动建 2 条与最近 LEO 卫星的 ground-uplink
  ensureUplinkLinksFor(record)
}

function ensureUplinkLinksFor(record: CustomGroundRecord) {
  const leoSats = satelliteStore.satellites.filter((s) => (s.alt || 0) <= 10000000)
  const positionMap = satelliteStore.positions
  const candidates = leoSats
    .map((s) => {
      const pos = positionMap[s.instanceId]
      if (!pos) {
        // 如果没有运行时位置，用轨道基础经度近似
        return { id: s.instanceId, lat: 0, lon: s.baseLon || 0 }
      }
      return { id: s.instanceId, lat: pos.latitude, lon: pos.longitude }
    })
    .map((c) => ({
      id: c.id,
      d: greatCircleDeg(record.latitude, record.longitude, c.lat, c.lon)
    }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 2)

  candidates.forEach((c, idx) => {
    const linkId = `link-uplink-${record.id}-${idx}`
    if (linkStore.links.find((l) => l.link_id === linkId)) return
    linkStore.links.push({
      link_id: linkId,
      type: 'ground-uplink',
      enable: true,
      connect_instance: [record.id, c.id],
      node_index: 0
    })
  })
}

function greatCircleDeg(aLat: number, aLon: number, bLat: number, bLon: number) {
  const toRad = (d: number) => (d * Math.PI) / 180
  const la1 = toRad(aLat)
  const la2 = toRad(bLat)
  const dLa = la2 - la1
  const dLo = toRad(bLon - aLon)
  const h = Math.sin(dLa / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLo / 2) ** 2
  return 2 * Math.asin(Math.min(1, Math.sqrt(h)))
}

function addGroundStation(record: CustomGroundRecord) {
  if (customGroundStations.value.some((c) => c.id === record.id)) return
  customGroundStations.value.push(record)
  materializeGroundStation(record)
  persistCustomGroundStations()
  rebuildScene()
}

function importPresets(all: boolean) {
  const list = all ? GLOBAL_GROUND_STATION_PRESETS : presetSelection.value
  if (!list || list.length === 0) return
  list.forEach((p) => {
    addGroundStation({ ...p, preset: true })
  })
}

function submitManual() {
  const name = manualForm.value.name.trim()
  if (!name) return
  const lat = Number(manualForm.value.latitude)
  const lon = Number(manualForm.value.longitude)
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return
  const id = `ground-custom-${Date.now()}`
  addGroundStation({ id, name, latitude: lat, longitude: lon, preset: false })
  manualForm.value = { name: '', latitude: 30, longitude: 110 }
  groundActiveTab.value = 'list'
}

function removeCustomGroundStation(id: string) {
  customGroundStations.value = customGroundStations.value.filter((g) => g.id !== id)
  // 移除 instance
  const ii = instanceStore.instances.findIndex((i) => i.instance_id === id)
  if (ii >= 0) instanceStore.instances.splice(ii, 1)
  // 删除 position
  delete satelliteStore.positions[id]
  // 删除关联的 ground-uplink 链路
  linkStore.links = linkStore.links.filter(
    (l) => !(l.type === 'ground-uplink' && l.connect_instance.includes(id))
  )
  persistCustomGroundStations()
  rebuildScene()
}

function restoreCustomGroundStations() {
  if (customGroundStations.value.length === 0) return
  customGroundStations.value.forEach((g) => materializeGroundStation(g))
}


// ===== 通信传输路径 (业务路径) 高亮 =====
const showPathPanel = ref(false)
const pathSourceId = ref<string>('')
const pathTargetId = ref<string>('')
const activePath = ref<string[]>([]) // 节点 instance_id 序列：源 -> 中转(卫星/GEO) -> 目的
const activePathLinkIds = ref<string[]>([]) // 路径上对应的 link.id 顺序集合
const pathError = ref<string>('')
const highlightUplinks = ref<boolean>(true) // 是否额外高亮所有"地面基站↔卫星"上下行链路

const groundStationOptions = computed(() =>
  instanceStore.instancesForDisplay.filter((item) =>
    item.type.toLowerCase().includes('ground')
  )
)

const canRoute = computed(
  () => !!pathSourceId.value && !!pathTargetId.value && pathSourceId.value !== pathTargetId.value
)

// 地面站↔卫星上下行链路条数（仅统计 ground-uplink 类型）
const uplinkLinkCount = computed(
  () => linkStore.linksForDisplay.filter((link) => link.type === 'ground-uplink').length
)

function rebuildScene() {
  if (viewer.value && !viewer.value.isDestroyed()) buildScene(viewer.value)
}

const pathHopsLabel = computed(() => {
  if (activePath.value.length === 0) return ''
  return activePath.value
    .map((id) => {
      const inst = instanceStore.instancesForDisplay.find((i) => i.id === id)
      if (inst) return inst.name
      const sat = satelliteStore.satellites.find((s) => s.instanceId === id)
      if (sat) return sat.name
      return id
    })
    .join(' → ')
})

// 用启用的链路构造无向图，BFS 找最短跳数路径
function findRoute(srcId: string, dstId: string): { nodes: string[]; linkIds: string[] } | null {
  const adj = new Map<string, Array<{ to: string; linkId: string }>>()
  linkStore.linksForDisplay.forEach((link) => {
    if (!link.enabled) return
    if (link.status === 'danger') return // 跳过故障链路
    const [a, b] = link.endpoints
    if (!adj.has(a)) adj.set(a, [])
    if (!adj.has(b)) adj.set(b, [])
    adj.get(a)!.push({ to: b, linkId: link.id })
    adj.get(b)!.push({ to: a, linkId: link.id })
  })

  if (!adj.has(srcId) || !adj.has(dstId)) return null

  const prev = new Map<string, { from: string; linkId: string }>()
  const visited = new Set<string>([srcId])
  const queue: string[] = [srcId]
  while (queue.length) {
    const cur = queue.shift()!
    if (cur === dstId) break
    const nb = adj.get(cur) || []
    for (const { to, linkId } of nb) {
      if (visited.has(to)) continue
      visited.add(to)
      prev.set(to, { from: cur, linkId })
      queue.push(to)
    }
  }

  if (!prev.has(dstId) && srcId !== dstId) return null

  const nodes: string[] = []
  const linkIds: string[] = []
  let cur = dstId
  while (cur !== srcId) {
    const p = prev.get(cur)
    if (!p) return null
    nodes.unshift(cur)
    linkIds.unshift(p.linkId)
    cur = p.from
  }
  nodes.unshift(srcId)
  return { nodes, linkIds }
}

function computeAndShowPath() {
  if (!canRoute.value) return
  pathError.value = ''
  const route = findRoute(pathSourceId.value, pathTargetId.value)
  if (!route) {
    activePath.value = []
    activePathLinkIds.value = []
    pathError.value = '无法在当前可用链路中找到从源端到目的端的通路'
    if (viewer.value && !viewer.value.isDestroyed()) buildScene(viewer.value)
    return
  }
  activePath.value = route.nodes
  activePathLinkIds.value = route.linkIds
  if (viewer.value && !viewer.value.isDestroyed()) buildScene(viewer.value)
}

function showDemoPath() {
  // 演示：选择两个边界监测站作为源/目的；如不存在则取前两个地面站
  const grounds = groundStationOptions.value
  if (grounds.length < 2) {
    pathError.value = '地面站不足，无法演示'
    return
  }
  const src = grounds.find((g) => g.id === 'ground-boundary-west') || grounds[0]
  const dst = grounds.find((g) => g.id === 'ground-boundary-east') || grounds[grounds.length - 1]
  pathSourceId.value = src.id
  pathTargetId.value = dst.id
  computeAndShowPath()
}

function clearActivePath() {
  activePath.value = []
  activePathLinkIds.value = []
  pathError.value = ''
  if (viewer.value && !viewer.value.isDestroyed()) buildScene(viewer.value)
}

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

function statusColor(status: string) {
  if (status === 'warning') return Cesium.Color.fromCssColorString('#ffd04b')
  if (status === 'danger') return Cesium.Color.fromCssColorString('#ff6b6b')
  if (status === 'offline') return Cesium.Color.fromCssColorString('#7b8794')
  return Cesium.Color.fromCssColorString('#00d2ff')
}

function clearSelection() {
  satelliteStore.selectedSatelliteId = null
  isPaused.value = false
  sceneMode.value = '自动巡航'
  if (viewer.value && !viewer.value.isDestroyed()) {
    viewer.value.trackedEntity = undefined
    viewer.value.clock.shouldAnimate = true
    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(108, 24, 18500000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: 0
      },
      duration: 1.2
    })
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
    if (satelliteStore.selectedSatelliteId === editForm.value.id) {
      satelliteStore.selectedSatelliteId = editForm.value.id
    }
  } else {
    satelliteStore.addSatellite(payload)
  }

  showEditDialog.value = false
}

function deleteSat(id: number) {
  satelliteStore.deleteSatellite(id)
  if (selectedSatelliteCard.value?.id === id) {
    clearSelection()
  }
}

function getOrbitMetrics(altitudeMeters: number) {
  const altitude = Math.max(Number(altitudeMeters || 0), 0)
  const orbitalRadius = EARTH_RADIUS_METERS + altitude
  const speedMps = Math.sqrt(EARTH_MU / orbitalRadius)
  const periodSeconds = 2 * Math.PI * Math.sqrt((orbitalRadius ** 3) / EARTH_MU)

  return {
    altitudeMeters: altitude,
    orbitalRadius,
    speedMps,
    speedKps: speedMps / 1000,
    periodSeconds,
    periodMinutes: periodSeconds / 60
  }
}

function getSatellitePosition(sat: any, time: Cesium.JulianDate, startTime: Cesium.JulianDate) {
  const seconds = Cesium.JulianDate.secondsDifference(time, startTime)
  const orbit = getOrbitMetrics(sat.alt || 500000)
  const phase0 = Cesium.Math.toRadians(sat.phase || 0)
  const inclination = Cesium.Math.toRadians(sat.inclination || 0)
  const raan = Cesium.Math.toRadians(sat.baseLon || 0)
  const trueAnomaly = phase0 + (seconds / orbit.periodSeconds) * 2 * Math.PI

  const xOrbital = orbit.orbitalRadius * Math.cos(trueAnomaly)
  const yOrbital = orbit.orbitalRadius * Math.sin(trueAnomaly)

  const cosRaan = Math.cos(raan)
  const sinRaan = Math.sin(raan)
  const cosInclination = Math.cos(inclination)
  const sinInclination = Math.sin(inclination)

  const xEci = cosRaan * xOrbital - sinRaan * cosInclination * yOrbital
  const yEci = sinRaan * xOrbital + cosRaan * cosInclination * yOrbital
  const zEci = sinInclination * yOrbital

  const earthRotation = EARTH_ROTATION_RAD_PER_SEC * seconds
  const cosEarthRotation = Math.cos(earthRotation)
  const sinEarthRotation = Math.sin(earthRotation)

  const xEcef = cosEarthRotation * xEci + sinEarthRotation * yEci
  const yEcef = -sinEarthRotation * xEci + cosEarthRotation * yEci
  const zEcef = zEci

  const longitude = Math.atan2(yEcef, xEcef)
  const latitude = Math.atan2(zEcef, Math.sqrt(xEcef ** 2 + yEcef ** 2))

  return Cesium.Cartesian3.fromRadians(longitude, latitude, sat.alt || 500000)
}

function makeOrbitPositions(inclination: number, baseLon: number, altitude: number) {
  const points: Cesium.Cartesian3[] = []
  const orbit = getOrbitMetrics(altitude || 500000)
  const inclRad = Cesium.Math.toRadians(inclination || 0)
  const raan = Cesium.Math.toRadians(baseLon || 0)
  const cosRaan = Math.cos(raan)
  const sinRaan = Math.sin(raan)
  const cosInclination = Math.cos(inclRad)
  const sinInclination = Math.sin(inclRad)
  for (let i = 0; i <= 360; i += 2) {
    const trueAnomaly = Cesium.Math.toRadians(i)
    const xOrbital = orbit.orbitalRadius * Math.cos(trueAnomaly)
    const yOrbital = orbit.orbitalRadius * Math.sin(trueAnomaly)

    const xEcef = cosRaan * xOrbital - sinRaan * cosInclination * yOrbital
    const yEcef = sinRaan * xOrbital + cosRaan * cosInclination * yOrbital
    const zEcef = sinInclination * yOrbital

    const longitude = Math.atan2(yEcef, xEcef)
    const latitude = Math.atan2(zEcef, Math.sqrt(xEcef ** 2 + yEcef ** 2))

    points.push(Cesium.Cartesian3.fromRadians(longitude, latitude, altitude))
  }
  return points
}

function focusSatellite(id: number) {
  const v = viewer.value
  if (!v || v.isDestroyed()) return

  const sat = satelliteStore.satellites.find((item) => item.id === id)
  if (!sat) return

  satelliteStore.selectedSatelliteId = id
  isPaused.value = false
  sceneMode.value = '聚焦查看'
  v.clock.shouldAnimate = true
  const entity = v.entities.getById(String(id))
  if (!entity) return
  const followDistance = Math.max((sat.alt || 500000) * 2.4, 1800000)
  entity.viewFrom = new Cesium.ConstantPositionProperty(
    new Cesium.Cartesian3(0, -followDistance, followDistance * 0.42)
  ) as any
  v.trackedEntity = entity

  v.flyTo(entity, {
    duration: 1.2,
    offset: new Cesium.HeadingPitchRange(
      Cesium.Math.toRadians(0),
      Cesium.Math.toRadians(-20),
      followDistance
    )
  })
}

function focusSatelliteFromPanel(id: number) {
  focusSatellite(id)
}

function buildScene(v: Cesium.Viewer) {
  if (!v || !v.entities || v.isDestroyed()) return

  v.entities.removeAll()

  const startTime = v.clock.startTime
  const positionMap = satelliteStore.positions
  const satellites = satelliteStore.satellites
  const groundInstances = instanceStore.instancesForDisplay.filter(
    (item) => !item.type.toLowerCase().includes('satellite')
  )

  satellites.forEach((sat) => {
    const isGeo = (sat.alt || 0) > 30000000
    const isMeo = (sat.alt || 0) > 10000000 && (sat.alt || 0) <= 30000000
    const isAbnormal = sat.status === 'warning' || sat.status === 'danger' || sat.status === 'offline'
    const color = isAbnormal
      ? statusColor(sat.status)
      : isGeo
        ? Cesium.Color.fromCssColorString('#ff6b6b')
        : isMeo
          ? Cesium.Color.fromCssColorString('#ff9f43')
          : Cesium.Color.fromCssColorString('#2ecc71')

    v.entities.add({
      id: String(sat.id),
      name: sat.name,
      position: new Cesium.CallbackPositionProperty(
        () => getSatellitePosition(sat, v.clock.currentTime, startTime),
        false
      ),
      point: {
        pixelSize: isAbnormal ? (isGeo ? 12 : isMeo ? 10 : 9) : isGeo ? 5 : isMeo ? 4 : 3.5,
        color: color,
        outlineColor: isAbnormal ? color.withAlpha(0.95) : color.withAlpha(0.6),
        outlineWidth: isAbnormal ? 2 : 1,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      },
      path: {
        show: isAbnormal || satelliteStore.selectedSatelliteId === sat.id,
        leadTime: 0,
        trailTime: isGeo ? 3600 : 1800,
        width: isAbnormal ? (isGeo ? 2.4 : 2) : 1.2,
        material: color.withAlpha(isAbnormal ? 0.72 : 0.45)
      },
      label: {
        text: `${isAbnormal ? '异常 · ' : ''}${sat.name}`,
        font: '600 11px "Microsoft YaHei", sans-serif',
        style: Cesium.LabelStyle.FILL,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        pixelOffset: new Cesium.Cartesian2(0, -10),
        fillColor: isAbnormal ? color.withAlpha(0.98) : Cesium.Color.WHITE.withAlpha(0.85),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        show: isAbnormal || satelliteStore.selectedSatelliteId === sat.id
      }
    })

    if (isAbnormal) {
      v.entities.add({
        id: `sat-halo-${sat.instanceId}`,
        position: new Cesium.CallbackPositionProperty(
          () => getSatellitePosition(sat, v.clock.currentTime, startTime),
          false
        ),
        ellipsoid: {
          radii: new Cesium.Cartesian3(
            isGeo ? 700000 : 240000,
            isGeo ? 700000 : 240000,
            isGeo ? 700000 : 240000
          ),
          material: color.withAlpha(sat.status === 'danger' ? 0.18 : 0.1),
          outline: false
        }
      })
    }

    v.entities.add({
      id: `orbit-${sat.instanceId}`,
      polyline: {
        positions: makeOrbitPositions(sat.inclination || 0, sat.baseLon || 0, sat.alt || 500000),
        width: isAbnormal ? 1.5 : 0.8,
        material: color.withAlpha(isAbnormal ? 0.35 : 0.05)
      }
    })
  })

  if (satelliteStore.selectedSatelliteId !== null) {
    const tracked = v.entities.getById(String(satelliteStore.selectedSatelliteId))
    if (tracked) {
      v.trackedEntity = tracked
    }
  }

  groundInstances.forEach((ground) => {
    const position = positionMap[ground.id]
    if (!position) return

    const groundCartesian = Cesium.Cartesian3.fromDegrees(
      position.longitude,
      position.latitude,
      position.altitude || 30
    )

    v.entities.add({
      id: `ground-${ground.id}`,
      name: ground.name,
      position: groundCartesian,
      cylinder: {
        length: 180000,
        topRadius: 0,
        bottomRadius: 45000,
        material: Cesium.Color.fromCssColorString('#f1c40f').withAlpha(0.7)
      },
      label: {
        text: ground.name,
        font: '600 12px "Microsoft YaHei", sans-serif',
        pixelOffset: new Cesium.Cartesian2(0, -24),
        fillColor: Cesium.Color.WHITE,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    })
  })

  const pathLinkSet = new Set(activePathLinkIds.value)
  const pathNodeSet = new Set(activePath.value)

  linkStore.linksForDisplay.forEach((link) => {
    const [startId, endId] = link.endpoints
    const startSatellite = satellites.find((item) => item.instanceId === startId)
    const endSatellite = satellites.find((item) => item.instanceId === endId)
    const startGround = positionMap[startId]
    const endGround = positionMap[endId]

    const isOnPath = pathLinkSet.has(link.id)
    const isUplink = link.type === 'ground-uplink'
    const isUplinkHighlighted = isUplink && highlightUplinks.value && !isOnPath

    const lineColor = isOnPath
      ? Cesium.Color.fromCssColorString('#00f5ff')
      : link.status === 'danger'
        ? Cesium.Color.fromCssColorString('#ff6b6b')
        : link.status === 'warning'
          ? Cesium.Color.fromCssColorString('#ffd04b')
          : isUplink
            ? Cesium.Color.fromCssColorString('#ffb84d')
            : link.enabled
              ? Cesium.Color.fromCssColorString('#7dcfff')
              : Cesium.Color.fromCssColorString('#6b7480')
    const isAbnormalLink = link.status === 'danger' || link.status === 'warning' || !link.enabled


    v.entities.add({
      id: `link-${link.id}`,
      polyline: {
        positions: new Cesium.CallbackProperty(() => {
          const positions: Cesium.Cartesian3[] = []

          if (startSatellite) positions.push(getSatellitePosition(startSatellite, v.clock.currentTime, startTime))
          else if (startGround) {
            positions.push(Cesium.Cartesian3.fromDegrees(startGround.longitude, startGround.latitude, startGround.altitude))
          }

          if (endSatellite) positions.push(getSatellitePosition(endSatellite, v.clock.currentTime, startTime))
          else if (endGround) {
            positions.push(Cesium.Cartesian3.fromDegrees(endGround.longitude, endGround.latitude, endGround.altitude))
          }

          return positions
        }, false),
        width: isOnPath
          ? 8
          : isUplinkHighlighted
            ? 5
            : link.status === 'danger'
              ? 3.8
              : link.status === 'warning'
                ? 3
                : 1.5,
        material: isOnPath
          ? (new Cesium.PolylineGlowMaterialProperty({
              glowPower: 0.55,
              taperPower: 1.0,
              color: lineColor.withAlpha(0.98)
            }) as any)
          : isUplinkHighlighted
            ? (new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.4,
                taperPower: 0.8,
                color: lineColor.withAlpha(0.95)
              }) as any)
            : (new Cesium.PolylineGlowMaterialProperty({
                glowPower: isAbnormalLink ? 0.32 : 0.15,
                taperPower: 0.35,
                color: lineColor.withAlpha(link.enabled ? (isAbnormalLink ? 0.95 : 0.68) : 0.55)
              }) as any),

        arcType: Cesium.ArcType.NONE
      }
    })
  })

  // 为路径上每个节点添加高亮 halo
  if (pathNodeSet.size > 0) {
    activePath.value.forEach((nodeId, idx) => {
      const sat = satellites.find((s) => s.instanceId === nodeId)
      const ground = positionMap[nodeId]
      const isEndpoint = idx === 0 || idx === activePath.value.length - 1
      const haloColor = isEndpoint
        ? Cesium.Color.fromCssColorString('#00ffd1')
        : Cesium.Color.fromCssColorString('#00f5ff')
      if (sat) {
        v.entities.add({
          id: `path-halo-${nodeId}`,
          position: new Cesium.CallbackPositionProperty(
            () => getSatellitePosition(sat, v.clock.currentTime, startTime),
            false
          ),
          point: {
            pixelSize: 18,
            color: haloColor.withAlpha(0.0),
            outlineColor: haloColor.withAlpha(0.95),
            outlineWidth: 3,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          },
          label: {
            text: `[第${idx + 1}跳] ${sat.name}`,
            font: '600 12px "Microsoft YaHei", sans-serif',
            fillColor: haloColor,
            pixelOffset: new Cesium.Cartesian2(0, 18),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          }
        })
      } else if (ground) {
        const cart = Cesium.Cartesian3.fromDegrees(ground.longitude, ground.latitude, ground.altitude || 30)
        v.entities.add({
          id: `path-halo-${nodeId}`,
          position: cart,
          ellipsoid: {
            radii: new Cesium.Cartesian3(220000, 220000, 220000),
            material: haloColor.withAlpha(0.18),
            outline: true,
            outlineColor: haloColor.withAlpha(0.9)
          },
          label: {
            text: idx === 0 ? `源端: ${nodeId}` : `目的: ${nodeId}`,
            font: '700 13px "Microsoft YaHei", sans-serif',
            fillColor: haloColor,
            pixelOffset: new Cesium.Cartesian2(0, -42),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          }
        })
      }
    })
  }
}

onMounted(() => {
  if (!cesiumContainer.value) return
  const isElectron = typeof window !== 'undefined' && (window as any).electronAPI

  setTimeout(async () => {
    try {
      await Promise.all([
        instanceStore.fetchInstances(),
        instanceStore.fetchAllResources(),
        linkStore.fetchLinks(),
        linkStore.fetchAllResources(),
        satelliteStore.fetchPositions()
      ])

      loadCustomGroundStations()
      restoreCustomGroundStations()

      const v = await initCesium(cesiumContainer.value as HTMLElement)
      const canvasElement = v.canvas

      if (canvasElement) {
        canvasElement.addEventListener('webglcontextlost', (event: Event) => {
          event.preventDefault()
        })
        canvasElement.addEventListener('webglcontextrestored', () => {
          location.reload()
        })
      }

      v.scene.globe.show = true
      v.scene.globe.enableLighting = false
      v.scene.globe.showGroundAtmosphere = true
      v.scene.globe.atmosphereLightIntensity = 18
      v.scene.globe.baseColor = Cesium.Color.fromCssColorString('#10253f')
      v.scene.backgroundColor = Cesium.Color.fromCssColorString('#020811')
      v.scene.postProcessStages.fxaa.enabled = true
      v.shadowMap.enabled = false

      const earthCenter = Cesium.Cartesian3.fromDegrees(108, 24, 0)
      v.camera.lookAt(
        earthCenter,
        new Cesium.HeadingPitchRange(Cesium.Math.toRadians(0), Cesium.Math.toRadians(-90), 18500000)
      )
      v.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
      v.clock.shouldAnimate = true
      v.clock.multiplier = 1

      selectionHandler = new Cesium.ScreenSpaceEventHandler(v.scene.canvas)
      selectionHandler.setInputAction((movement: any) => {
        const pickedObject = v.scene.pick(movement.position)
        if (Cesium.defined(pickedObject) && pickedObject.id) {
          const entity = pickedObject.id
          if (entity instanceof Cesium.Entity && entity.id && /^\d+$/.test(entity.id)) {
            focusSatellite(parseInt(entity.id, 10))
            return
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

      v.camera.moveStart.addEventListener(() => {
        if (interactionTimeout) clearTimeout(interactionTimeout)
        sceneMode.value = '手动控制'
        if (!v.trackedEntity && !isPaused.value) v.clock.shouldAnimate = false
      })

      v.camera.moveEnd.addEventListener(() => {
        if (interactionTimeout) clearTimeout(interactionTimeout)
        interactionTimeout = window.setTimeout(() => {
          if (!v.trackedEntity && !isPaused.value) {
            v.clock.shouldAnimate = true
            sceneMode.value = '自动巡航'
          }
        }, 2200)
      })

      buildScene(v)

      watch(
        () => [
          satelliteStore.satellites,
          satelliteStore.positions,
          instanceStore.instancesForDisplay,
          linkStore.linksForDisplay
        ],
        () => buildScene(v),
        { deep: true }
      )
    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || 'unknown error'
      const isWebGLError =
        errorMessage.includes('WebGL') ||
        errorMessage.includes('webgl') ||
        errorMessage.includes('context') ||
        errorMessage.includes('initialization failed')
      if (isWebGLError) webglUnavailable.value = true
      else if (cesiumContainer.value) {
        cesiumContainer.value.innerHTML = `
          <div style="color:#8B92B9;padding:20px;text-align:center;font-size:14px;">
            <p style="color:#FFD04B;margin-bottom:12px;">三维场景初始化失败</p>
            <p style="font-size:12px;margin-top:8px;color:#5A6178;">${errorMessage}</p>
          </div>
        `
      }
    }
  }, isElectron ? 1500 : 500)
})

watch(
  () => uiStore.isImmersiveMode,
  (isImmersive) => {
    if (!isImmersive && viewer.value && !viewer.value.isDestroyed() && !webglUnavailable.value) {
      clearSelection()
    }
  }
)

onBeforeUnmount(() => {
  if (interactionTimeout) clearTimeout(interactionTimeout)
  if (selectionHandler) {
    selectionHandler.destroy()
    selectionHandler = null
  }
  if (viewer.value && !viewer.value.isDestroyed()) {
    viewer.value.trackedEntity = undefined
    viewer.value.destroy()
    viewer.value = null
  }
})
</script>

<style scoped>
#cesium-container {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 0;
  background:
    radial-gradient(circle at 50% 50%, rgba(125, 207, 255, 0.08), transparent 28%),
    linear-gradient(180deg, #020712 0%, #07101c 100%);
}

.cinematic-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px 28px;
  pointer-events: none;
}

.overlay-top,
.overlay-bottom {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.theater-badge,
.legend,
.hud-card,
.status-drawer,
.satellite-float-card {
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(15, 16, 17, 0.7);
  backdrop-filter: blur(16px);
}

.theater-badge,
.legend {
  padding: 10px 14px;
  border-radius: 999px;
  color: #d0d6e0;
  font-size: 12px;
  letter-spacing: 0.04em;
}

.legend {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.legend span {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #8a8f98;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.dot.leo { background: #2ecc71; }
.dot.meo { background: #ff9f43; }
.dot.geo { background: #ff6b6b; }
.dot.ground { background: #f1c40f; }

.overlay-bottom {
  align-items: flex-end;
}

.hud-card {
  min-width: 180px;
  padding: 14px 16px;
  border-radius: 8px;
  pointer-events: none;
}

.hud-label,
.hud-card small {
  display: block;
  color: #62666d;
}

.hud-card strong {
  display: block;
  margin: 6px 0;
  color: #f7f8f8;
  font-size: 1.4rem;
  font-weight: 600;
}

.overlay-top,
.overlay-bottom {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.theater-badge,
.legend,
.hud-card,
.status-drawer,
.satellite-float-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(7, 14, 23, 0.58);
  backdrop-filter: blur(16px);
}

.theater-badge,
.legend {
  padding: 10px 14px;
  border-radius: 999px;
  color: #d0d6e0;
  font-size: 12px;
  letter-spacing: 0.04em;
}

.legend {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.legend span {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #8a8f98;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.dot.leo { background: #2ecc71; }
.dot.meo { background: #ff9f43; }
.dot.geo { background: #ff6b6b; }
.dot.ground { background: #f1c40f; }
.dot.warn { background: #ffd04b; box-shadow: 0 0 6px rgba(255,208,75,0.7); }
.dot.path { background: #00f5ff; box-shadow: 0 0 8px rgba(0,245,255,0.85); }
.dot.uplink { background: #ffb84d; box-shadow: 0 0 6px rgba(255,184,77,0.85); }

.uplink-toggle-row {
  flex-direction: row !important;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding-top: 4px;
  border-top: 1px dashed rgba(255, 184, 77, 0.25);
  margin-top: 2px;
}
.uplink-hint {
  font-size: 11px;
  color: #d0a06b;
  line-height: 1.4;
}


.overlay-bottom {
  align-items: flex-end;
}

.hud-card {
  min-width: 180px;
  padding: 14px 16px;
  border-radius: 8px;
  pointer-events: none;
}

.hud-label,
.hud-card small {
  display: block;
  color: #99b0c5;
}

/* 通信路径面板 */
.comm-path-panel {
  position: absolute;
  left: 24px;
  bottom: 140px;
  z-index: 13;
  width: 320px;
  border-radius: 10px;
  padding: 14px 16px;
  border: 1px solid rgba(0, 245, 255, 0.25);
  background: rgba(7, 14, 23, 0.85);
  backdrop-filter: blur(16px);
  box-shadow: 0 0 24px rgba(0, 245, 255, 0.15);
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.comm-path-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #00f5ff;
  font-size: 14px;
}
.comm-path-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.comm-path-row label {
  font-size: 12px;
  color: #8a9aac;
}
.comm-path-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.comm-path-info {
  font-size: 12px;
  color: #00f5ff;
  background: rgba(0, 245, 255, 0.08);
  padding: 8px 10px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  word-break: break-all;
}
.comm-path-error {
  font-size: 12px;
  color: #ff8e8e;
  background: rgba(255, 107, 107, 0.1);
  padding: 8px 10px;
  border-radius: 6px;
}
.floating-path-btn {
  position: absolute !important;
  left: 24px;
  bottom: 100px;
  z-index: 12;
  pointer-events: auto;
  background: rgba(0, 245, 255, 0.08) !important;
  border-color: rgba(0, 245, 255, 0.45) !important;
  color: #00f5ff !important;
  backdrop-filter: blur(16px);
}

.floating-ground-btn {
  position: absolute !important;
  left: 24px;
  bottom: 48px;
  z-index: 12;
  pointer-events: auto;
  background: rgba(255, 176, 32, 0.08) !important;
  border-color: rgba(255, 176, 32, 0.45) !important;
  color: #ffb020 !important;
  backdrop-filter: blur(16px);
}

.ground-tip {
  margin-bottom: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(255, 176, 32, 0.08);
  border: 1px solid rgba(255, 176, 32, 0.16);
  color: #d0d6e0;
  line-height: 1.6;
  font-size: 12px;
}

.ground-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}

.ground-empty {
  padding: 28px 12px;
  text-align: center;
  color: #8a8f98;
  border: 1px dashed rgba(138, 143, 152, 0.26);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
}

.custom-ground-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
}

.custom-ground-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
}

.custom-ground-item > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.custom-ground-item strong {
  color: #f7f8f8;
}

.custom-ground-item span,
.custom-ground-item em {
  color: #8a8f98;
  font-size: 12px;
}

:deep(.ground-dialog .el-dialog) {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 16, 17, 0.92);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(20px);
}

:deep(.ground-dialog .el-dialog__header) {
  margin-right: 0;
  padding-bottom: 8px;
}

:deep(.ground-dialog .el-dialog__title) {
  color: #f7f8f8;
  font-weight: 600;
}

:deep(.ground-dialog .el-dialog__body) {
  padding-top: 8px;
}

:deep(.ground-dialog .el-tabs__item) {
  color: #8a8f98;
}

:deep(.ground-dialog .el-tabs__item.is-active) {
  color: #ffb020;
}

:deep(.ground-dialog .el-tabs__active-bar) {
  background-color: #ffb020;
}


.hud-card strong {
  display: block;
  margin: 6px 0;
  color: #f6fbff;
  font-size: 1.5rem;
}

.status-drawer {
  position: absolute;
  top: 92px;
  bottom: 24px;
  left: 24px;
  z-index: 12;
  width: 320px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 16px;
  overflow: hidden;
  pointer-events: auto;
  touch-action: pan-y;
}

.status-drawer-head,
.float-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.collapse-btn {
  border-color: rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
  color: #d0d6e0;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.status-drawer-head strong,
.float-card-head strong,
.status-chip strong,
.float-item strong {
  color: #f7f8f8;
}

.status-drawer-head span,
.float-card-head span,
.status-chip span,
.float-item label {
  color: #62666d;
}

.status-drawer-list {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
  pointer-events: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  scrollbar-width: thin;
  scrollbar-color: rgba(138, 143, 152, 0.25) transparent;
}

.status-drawer-list::-webkit-scrollbar {
  width: 8px;
}

.status-drawer-list::-webkit-scrollbar-track {
  background: transparent;
}

.status-drawer-list::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(138, 143, 152, 0.15);
}

.status-chip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  text-align: left;
  cursor: pointer;
}

.status-chip.normal { box-shadow: inset 0 0 0 1px rgba(16, 185, 129, 0.15); }
.status-chip.warning { box-shadow: inset 0 0 0 1px rgba(245, 158, 11, 0.14); background: rgba(245, 158, 11, 0.06); }
.status-chip.danger { box-shadow: inset 0 0 0 1px rgba(239, 68, 68, 0.14); background: rgba(239, 68, 68, 0.08); }
.status-chip.offline { box-shadow: inset 0 0 0 1px rgba(138, 143, 152, 0.14); background: rgba(138, 143, 152, 0.06); }

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

.status-badge.normal,
.detail-status.normal {
  color: #10b981;
  background: rgba(16, 185, 129, 0.15);
}

.status-badge.warning,
.detail-status.warning {
  color: #F59E0B;
  background: rgba(245, 158, 11, 0.14);
}

.status-badge.danger,
.detail-status.danger {
  color: #EF4444;
  background: rgba(239, 68, 68, 0.16);
}

.status-badge.offline,
.detail-status.offline {
  color: #8a8f98;
  background: rgba(138, 143, 152, 0.18);
}

.satellite-float-card {
  position: absolute;
  right: 24px;
  bottom: 126px;
  z-index: 12;
  width: 340px;
  border-radius: 8px;
  padding: 16px;
  pointer-events: auto;
}

.float-card-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.float-item {
  padding: 14px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
}

.float-item label,
.float-item strong {
  display: block;
}

.float-item strong {
  margin-top: 6px;
}

.float-item label {
  color: #62666d;
  margin-bottom: 6px;
  font-size: 13px;
}

.float-item strong {
  color: #f7f8f8;
  font-size: 14px;
  font-weight: 500;
}

.float-item label,
.float-item strong {
  display: block;
}

.float-item strong {
  margin-top: 6px;
}

.cesium-placeholder {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(8, 9, 10, 0.85);
}

.placeholder-content {
  width: min(420px, calc(100% - 32px));
  padding: 28px;
  border-radius: 8px;
  text-align: center;
  background: rgba(15, 16, 17, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.placeholder-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
  font-size: 1.3rem;
  font-weight: 600;
}

.placeholder-title {
  color: #f7f8f8;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 10px;
}

.placeholder-message {
  color: #62666d;
  line-height: 1.7;
}

.fade-panel-enter-active,
.fade-panel-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.fade-panel-enter-from,
.fade-panel-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.floating-edit-btn {
  position: absolute;
  top: 80px;
  right: 24px;
  z-index: 12;
  pointer-events: auto;
  background: rgba(255,255,255,0.02) !important;
  backdrop-filter: blur(16px);
  border-color: rgba(255,255,255,0.06) !important;
  color: #d0d6e0 !important;
}

.edit-drawer {
  position: absolute;
  top: 80px;
  right: 24px;
  bottom: 24px;
  z-index: 12;
  width: 320px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(15, 16, 17, 0.75);
  backdrop-filter: blur(16px);
  pointer-events: auto;
}

.edit-drawer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  color: #f7f8f8;
  font-size: 15px;
  font-weight: 500;
}

.edit-drawer-list {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
  pointer-events: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(138, 143, 152, 0.25) transparent;
}

.edit-drawer-list::-webkit-scrollbar { width: 8px; }
.edit-drawer-list::-webkit-scrollbar-track { background: transparent; }
.edit-drawer-list::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(138, 143, 152, 0.15); }

.edit-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
}

.edit-item-info strong {
  display: block;
  color: #d0d6e0;
  font-weight: 500;
  margin-bottom: 4px;
}

@media (max-width: 960px) {
  .cinematic-overlay {
    padding: 16px;
  }

  .overlay-top,
  .overlay-bottom {
    flex-direction: column;
    align-items: flex-start;
  }

  .status-drawer,
  .satellite-float-card {
    left: 16px;
    right: 16px;
    width: auto;
  }

  .status-drawer {
    top: 120px;
    max-height: 260px;
  }

  .satellite-float-card {
    bottom: 96px;
  }

  .floating-path-btn,
  .floating-ground-btn {
    left: 16px;
  }

  .floating-path-btn {
    bottom: 88px;
  }

  .floating-ground-btn {
    bottom: 36px;
  }
}
</style>
