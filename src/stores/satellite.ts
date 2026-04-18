import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { positionApi } from '../api'
import { mockPositions } from '../api/mock-data'
import { useInstanceStore } from './instance'
import { useLinkStore } from './link'

export interface Satellite {
  id: number
  name: string
  code: string
  instanceId: string
  status: 'normal' | 'warning' | 'danger' | 'offline'
  alt: number
  cpu: number
  temp: number
  inclination: number
  baseLon: number
  phase: number
}

function generateArchitecture(): Satellite[] {
  const sats: Satellite[] = [];
  let idCounter = 1;

  // LEO Shell A: 200 sats, 550km, 53° incl, 20 planes x 10
  for (let p = 0; p < 20; p++) {
    const planeLon = (p / 20) * 360 - 180;
    for (let s = 0; s < 10; s++) {
      const phase = (s / 10) * 360;
      sats.push({
        id: idCounter,
        name: `LEO-A-${p + 1}-${s + 1}`,
        code: `LEO-A-${idCounter}`,
        instanceId: `sat-leo-a-${idCounter}`,
        status: 'normal',
        alt: 550000,
        inclination: 53,
        baseLon: planeLon,
        phase: phase,
        cpu: 20,
        temp: 35
      });
      idCounter++;
    }
  }

  // LEO Shell B: 220 sats, 530km, 97.6° incl, 10 planes x 22
  for (let p = 0; p < 10; p++) {
    const planeLon = (p / 10) * 360 - 180;
    for (let s = 0; s < 22; s++) {
      const phase = (s / 22) * 360;
      sats.push({
        id: idCounter,
        name: `LEO-B-${p + 1}-${s + 1}`,
        code: `LEO-B-${idCounter}`,
        instanceId: `sat-leo-b-${idCounter}`,
        status: 'normal',
        alt: 530000,
        inclination: 97.6,
        baseLon: planeLon,
        phase: phase,
        cpu: 20,
        temp: 35
      });
      idCounter++;
    }
  }

  // MEO: 24 sats, 21500km, 55° incl, 3 planes x 8
  for (let p = 0; p < 3; p++) {
    const planeLon = (p / 3) * 360 - 180;
    for (let s = 0; s < 8; s++) {
      const phase = (s / 8) * 360;
      sats.push({
        id: idCounter,
        name: `MEO-${p + 1}-${s + 1}`,
        code: `MEO-${idCounter}`,
        instanceId: `sat-meo-${idCounter}`,
        status: 'normal',
        alt: 21500000,
        inclination: 55,
        baseLon: planeLon,
        phase: phase,
        cpu: 20,
        temp: 35
      });
      idCounter++;
    }
  }

  // GEO: 6 sats, 35786km, 0° incl, longitudes: 0, 60, 120, 180, 240, 300
  const geoLons = [0, 60, 120, 180, 240, 300];
  geoLons.forEach((lon, i) => {
    sats.push({
      id: idCounter,
      name: `GEO-${i + 1}`,
      code: `GEO-${idCounter}`,
      instanceId: `sat-geo-${idCounter}`,
      status: 'normal',
      alt: 35786000,
      inclination: 0,
      baseLon: lon,
      phase: 0,
      cpu: 20,
      temp: 35
    });
    idCounter++;
  });

  return sats;
}

export const useSatelliteStore = defineStore('satellite', () => {
  const instanceStore = useInstanceStore()
  const linkStore = useLinkStore()
  
  const defaultArchitecture = generateArchitecture()
  const satellites = ref<Satellite[]>([])
  
  const positions = ref<Record<string, { latitude: number; longitude: number; altitude: number }>>({})
  const positionSource = ref<'mock-server' | 'local-fallback'>('mock-server')

  const saveToStorage = () => {
    const edits: Record<number, Partial<Satellite>> = {}
    const customs: Satellite[] = []
    
    satellites.value.forEach(sat => {
      const def = defaultArchitecture.find(d => d.id === sat.id)
      if (def) {
        // Find changes
        let hasChanges = false
        const changes: any = {}
        for (const k of ['name', 'status', 'alt', 'inclination', 'baseLon', 'phase'] as const) {
          if (sat[k] !== def[k]) {
            hasChanges = true
            changes[k] = sat[k]
          }
        }
        if (hasChanges) edits[sat.id] = changes
      } else {
        customs.push(sat)
      }
    })
    
    localStorage.setItem('satellite-edits-v2', JSON.stringify(edits))
    localStorage.setItem('satellite-customs-v2', JSON.stringify(customs))
  }

  const initSatellites = () => {
    const savedEditsStr = localStorage.getItem('satellite-edits-v2')
    const savedEdits = savedEditsStr ? JSON.parse(savedEditsStr) : {}

    const savedCustomsStr = localStorage.getItem('satellite-customs-v2')
    const savedCustoms = savedCustomsStr ? JSON.parse(savedCustomsStr) : []

    const list = defaultArchitecture.map(sat => {
      if (savedEdits[sat.id]) {
        return { ...sat, ...savedEdits[sat.id] }
      }
      return sat
    })
    
    list.push(...savedCustoms)
    satellites.value = list
  }
  
  // Call initialization
  initSatellites()

  // Update real-time hardware status without blowing away architecture
  const updateSatellitesFromInstances = () => {
    const satelliteInstances = instanceStore.instancesForDisplay.filter((inst) =>
      inst.type.toLowerCase().includes('satellite')
    )

    satellites.value.forEach((sat) => {
      const inst = satelliteInstances.find((i) => i.id === sat.instanceId)
      if (inst) {
        const relatedLinks = linkStore.linksForDisplay.filter((link) => link.endpoints.includes(inst.id))
        const hasDangerLink = relatedLinks.some((link) => link.status === 'danger' || !link.enabled)
        const hasWarningLink = relatedLinks.some((link) => link.status === 'warning')
        const derivedStatus: Satellite['status'] =
          inst.status === 'offline'
            ? 'offline'
            : inst.status === 'danger' || hasDangerLink
              ? 'danger'
              : inst.status === 'warning' || hasWarningLink
                ? 'warning'
                : 'normal'

        // Only override if the user didn't hardcode a warning/danger state manually?
        // Let's just always sync runtime state here, except we preserve user manual states if they edited it?
        // Actually, just update dynamic fields:
        sat.cpu = inst.cpu
        sat.temp = 30 + (Math.max(inst.cpu, derivedStatus === 'danger' ? 96 : derivedStatus === 'warning' ? 78 : inst.cpu) / 100) * 30
      }
    })
  }

  watch(
    () => [instanceStore.instancesForDisplay, linkStore.linksForDisplay],
    () => {
      updateSatellitesFromInstances()
    },
    { deep: true, immediate: true }
  )

  const fetchPositions = async () => {
    try {
      positions.value = await positionApi.getAll()
      positionSource.value = 'mock-server'
    } catch {
      positions.value = mockPositions
      positionSource.value = 'local-fallback'
    } finally {
      updateSatellitesFromInstances()
    }
  }

  const selectedSatelliteId = ref<number | null>(null)

  const selectedSatellite = computed(() =>
    satellites.value.find((item) => item.id === selectedSatelliteId.value)
  )

  const addSatellite = (sat: Partial<Satellite>) => {
    const newId = satellites.value.length > 0 ? Math.max(...satellites.value.map(s => s.id)) + 1 : 1
    const newSat: Satellite = {
      id: newId,
      name: sat.name || `自定义卫星-${newId}`,
      code: sat.code || `CUSTOM-${newId}`,
      instanceId: `custom-sat-${newId}`,
      status: sat.status || 'normal',
      inclination: sat.inclination || 0,
      baseLon: sat.baseLon || 0,
      phase: sat.phase || 0,
      alt: sat.alt || 500000,
      cpu: sat.cpu || 20,
      temp: sat.temp || 30
    }
    satellites.value.push(newSat)
    saveToStorage()
    return newSat
  }

  const updateSatellite = (id: number, data: Partial<Satellite>) => {
    const idx = satellites.value.findIndex(s => s.id === id)
    if (idx !== -1) {
      satellites.value[idx] = { ...satellites.value[idx], ...data }
      saveToStorage()
    }
  }

  const deleteSatellite = (id: number) => {
    const idx = satellites.value.findIndex(s => s.id === id)
    if (idx !== -1) {
      satellites.value.splice(idx, 1)
      if (selectedSatelliteId.value === id) {
        selectedSatelliteId.value = null
      }
      saveToStorage()
    }
  }

  const restoreSatellite = (id: number) => {
    const def = defaultArchitecture.find(d => d.id === id)
    if (def) {
      const idx = satellites.value.findIndex(s => s.id === id)
      if (idx !== -1) {
        satellites.value[idx] = { ...def }
        saveToStorage()
      }
    }
  }

  return {
    satellites,
    positions,
    positionSource,
    selectedSatelliteId,
    selectedSatellite,
    addSatellite,
    updateSatellite,
    deleteSatellite,
    restoreSatellite,
    updateSatellitesFromInstances,
    fetchPositions
  }
})
