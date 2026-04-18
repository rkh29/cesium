import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { instanceApi, resourceApi } from '../api'
import { mockInstanceResources, mockInstances } from '../api/mock-data'
import type { Instance, InstanceDetail, InstanceResource } from '../api/types'

export interface InstanceDisplay {
  id: string
  name: string
  type: string
  typeLabel: string
  status: 'normal' | 'warning' | 'danger' | 'offline'
  statusLabel: string
  cpu: number
  memory: number
  running: boolean
  nodeIndex: number
}

function getTypeLabel(type: string) {
  const normalized = type.toLowerCase()
  if (normalized.includes('satellite')) return '卫星'
  if (normalized.includes('ground')) return '地面站'
  return type
}

function getStatusLabel(status: InstanceDisplay['status']) {
  if (status === 'normal') return '正常'
  if (status === 'warning') return '告警'
  if (status === 'danger') return '严重'
  return '离线'
}

export const useInstanceStore = defineStore('instance', () => {
  const instances = ref<Instance[]>([])
  const instanceDetails = ref<Record<string, InstanceDetail>>({})
  const resources = ref<Record<string, InstanceResource>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)
  const dataSource = ref<'mock-server' | 'local-fallback'>('mock-server')

  const fetchInstances = async () => {
    loading.value = true
    error.value = null
    try {
      instances.value = await instanceApi.getList()
      dataSource.value = 'mock-server'
    } catch (e: any) {
      error.value = e.message
      instances.value = mockInstances
      dataSource.value = 'local-fallback'
    } finally {
      loading.value = false
    }
  }

  const fetchInstanceDetail = async (nodeIndex: number, instanceId: string) => {
    try {
      const detail = await instanceApi.getDetail(nodeIndex, instanceId)
      instanceDetails.value[instanceId] = detail
      return detail
    } catch (e: any) {
      console.error('Failed to fetch instance detail:', e)
      return null
    }
  }

  const fetchAllResources = async () => {
    try {
      resources.value = await resourceApi.getAllInstanceResources()
    } catch (e: any) {
      console.error('Failed to fetch resources:', e)
      resources.value = mockInstanceResources
      dataSource.value = 'local-fallback'
    }
  }

  const fetchInstanceResource = async (instanceId: string) => {
    try {
      const res = await resourceApi.getInstanceResource(instanceId)
      if (res[instanceId]) {
        resources.value[instanceId] = res[instanceId]
      }
    } catch (e: any) {
      console.error('Failed to fetch instance resource:', e)
    }
  }

  const startInstance = async (nodeIndex: number, instanceId: string) => {
    await instanceApi.start(nodeIndex, instanceId)
    const inst = instances.value.find((item) => item.instance_id === instanceId)
    if (inst) inst.start = true
  }

  const stopInstance = async (nodeIndex: number, instanceId: string) => {
    await instanceApi.stop(nodeIndex, instanceId)
    const inst = instances.value.find((item) => item.instance_id === instanceId)
    if (inst) inst.start = false
  }

  const getInstanceStatus = (resource?: InstanceResource): InstanceDisplay['status'] => {
    if (!resource) return 'offline'
    if (resource.cpu_usage > 90 || resource.mem_byte > 8 * 1024 * 1024 * 1024) return 'danger'
    if (resource.cpu_usage > 75 || resource.mem_byte > 6 * 1024 * 1024 * 1024) return 'warning'
    return 'normal'
  }

  const instancesForDisplay = computed<InstanceDisplay[]>(() =>
    instances.value
      .filter((inst) => inst.instance_id && inst.instance_id.trim() !== '')
      .map((inst) => {
        const res = resources.value[inst.instance_id]
        const status = getInstanceStatus(res)
        return {
          id: inst.instance_id,
          name: inst.name || inst.instance_id,
          type: inst.type,
          typeLabel: getTypeLabel(inst.type),
          status,
          statusLabel: getStatusLabel(status),
          cpu: res?.cpu_usage ?? 0,
          memory: res?.mem_byte ?? 0,
          running: inst.start,
          nodeIndex: inst.node_index
        }
      })
  )

  const runningCount = computed(() => instances.value.filter((item) => item.start).length)
  const totalCount = computed(() => instances.value.length)

  const getInstanceById = (id: string) => instances.value.find((item) => item.instance_id === id)

  return {
    instances,
    instanceDetails,
    resources,
    loading,
    error,
    dataSource,
    fetchInstances,
    fetchInstanceDetail,
    fetchAllResources,
    fetchInstanceResource,
    startInstance,
    stopInstance,
    instancesForDisplay,
    runningCount,
    totalCount,
    getInstanceById
  }
})
