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
  const sats: Satellite[] = []
  const orbitPhases = [0, 45, 90, 135, 180, 225, 270, 315]

  orbitPhases.forEach((phase, index) => {
    sats.push({
      id: index + 1,
      name: `演示卫星-${index + 1}`,
      code: `DEMO-LEO-${index + 1}`,
      instanceId: `sat-demo-${index + 1}`,
      status: 'normal',
      alt: 550000,
      inclination: 53,
      baseLon: 105,
      phase,
      cpu: 20,
      temp: 35
    })
  })

  return sats
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
