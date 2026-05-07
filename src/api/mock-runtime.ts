import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { Anomaly } from '../types/anomaly'
import {
  mockInstanceResources,
  mockInstances,
  mockLinkResources,
  mockLinks,
  mockPositions
} from './mock-data'
import type {
  ApiResponse,
  EmulationConfig,
  EndInfo,
  HostResource,
  Instance,
  InstanceDetail,
  InstanceResource,
  Link,
  LinkDetail,
  LinkResource,
  Node,
  PositionMap,
  TimedHostResource,
  TimedInstanceResource,
  TimedLinkResource
} from './types'

export type ApiMode = 'proxy' | 'remote' | 'mock'

interface MockAdapterOptions {
  wrapApiResponse: boolean
}

interface MockState {
  instances: Instance[]
  links: Link[]
  instanceResources: Record<string, InstanceResource>
  linkResources: Record<string, LinkResource>
  positions: PositionMap
  nodes: Node[]
  nodeResources: Record<number, HostResource>
  anomalies: Anomaly[]
  emulationConfig: EmulationConfig
  databaseItems: Record<string, string>
}

interface RawTypeConfig {
  image?: string
  container_envs?: Record<string, string>
  envs?: Record<string, string>
  resource_limit?: {
    nano_cpu?: number
    memory_byte?: number
  }
}

interface RawEmulationInfo {
  running?: boolean
  type_config?: Record<string, RawTypeConfig>
  instance_type_config?: EmulationConfig['instance_type_config']
}

const mockNodesSeed: Node[] = [
  {
    node_index: 0,
    free_instance: 256,
    is_master_node: true,
    l_3_addr_v_4: '172.30.106.121',
    l_3_addr_v_6: 'fe80::1',
    l_2_addr: '02:42:ac:1e:6a:79'
  }
]

const mockNodeResourcesSeed: Record<number, HostResource> = {
  0: {
    cpu_usage: 24,
    mem_byte: 7.5 * 1024 * 1024 * 1024,
    swap_mem_byte: 0.5 * 1024 * 1024 * 1024
  }
}

const mockAnomaliesSeed: Anomaly[] = [
  {
    id: 1,
    satellite_id: 'sat-003',
    anomaly_type: 'hardware',
    description: '姿态控制单元温度短时升高',
    timestamp: new Date(Date.now() - 45 * 60_000).toISOString(),
    status: 'pending'
  },
  {
    id: 2,
    satellite_id: 'geo-002',
    anomaly_type: 'software',
    description: '链路调度服务发生一次自动重启',
    timestamp: new Date(Date.now() - 18 * 60_000).toISOString(),
    status: 'fixed'
  }
]

const defaultEmulationConfig: EmulationConfig = {
  running: false,
  instance_type_config: {
    satellite: {
      image: 'satellite:mock',
      envs: {
        MODE: 'mock'
      },
      resource_limit: {
        nano_cpu: 2_000_000_000,
        memory_byte: 2 * 1024 * 1024 * 1024
      }
    },
    'ground-station': {
      image: 'ground-station:mock',
      envs: {
        MODE: 'mock'
      },
      resource_limit: {
        nano_cpu: 1_000_000_000,
        memory_byte: 1024 * 1024 * 1024
      }
    }
  }
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function toRawEmulationInfo(config: EmulationConfig): RawEmulationInfo {
  return {
    running: config.running,
    type_config: Object.fromEntries(
      Object.entries(config.instance_type_config).map(([typeName, typeConfig]) => [
        typeName,
        {
          image: typeConfig.image,
          container_envs: typeConfig.envs,
          resource_limit: {
            nano_cpu: typeConfig.resource_limit.nano_cpu,
            memory_byte: typeConfig.resource_limit.memory_byte
          }
        }
      ])
    )
  }
}

function createInitialState(): MockState {
  return {
    instances: clone(mockInstances),
    links: clone(mockLinks),
    instanceResources: clone(mockInstanceResources),
    linkResources: clone(mockLinkResources),
    positions: clone(mockPositions),
    nodes: clone(mockNodesSeed),
    nodeResources: clone(mockNodeResourcesSeed),
    anomalies: clone(mockAnomaliesSeed),
    emulationConfig: clone(defaultEmulationConfig),
    databaseItems: {
      '/emulation_config': JSON.stringify(toRawEmulationInfo(defaultEmulationConfig))
    }
  }
}

const mockState = createInitialState()

export function resolveApiMode(
  env: Pick<ImportMetaEnv, 'VITE_API_MODE' | 'VITE_API_BASE_URL'>
): ApiMode {
  if (env.VITE_API_MODE === 'mock') {
    return 'mock'
  }

  if (typeof env.VITE_API_BASE_URL === 'string' && env.VITE_API_BASE_URL.trim() !== '') {
    return 'remote'
  }

  return 'proxy'
}

function syncEmulationConfigToDatabase() {
  mockState.databaseItems['/emulation_config'] = JSON.stringify(
    toRawEmulationInfo(mockState.emulationConfig)
  )
}

function resetMockState() {
  const next = createInitialState()
  mockState.instances = next.instances
  mockState.links = next.links
  mockState.instanceResources = next.instanceResources
  mockState.linkResources = next.linkResources
  mockState.positions = next.positions
  mockState.nodes = next.nodes
  mockState.nodeResources = next.nodeResources
  mockState.anomalies = next.anomalies
  mockState.emulationConfig = next.emulationConfig
  mockState.databaseItems = next.databaseItems
}

function normalizePath(url?: string): string {
  const raw = url || '/'
  const parsed = raw.startsWith('http://') || raw.startsWith('https://')
    ? new URL(raw)
    : new URL(raw, 'http://localhost')
  const normalized = parsed.pathname.replace(/^\/api(?=\/|$)/, '').replace(/\/+$/, '')
  return normalized === '' ? '/' : normalized
}

function getPayload<T>(config: InternalAxiosRequestConfig): T | undefined {
  if (typeof config.data === 'string' && config.data.trim() !== '') {
    try {
      return JSON.parse(config.data) as T
    } catch {
      return undefined
    }
  }

  if (config.data && typeof config.data === 'object') {
    return config.data as T
  }

  return undefined
}

function buildResponse<T>(config: InternalAxiosRequestConfig, data: T): AxiosResponse<T> {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
    request: undefined
  }
}

function hashString(input: string) {
  let hash = 0
  for (const ch of input) {
    hash = (hash << 5) - hash + ch.charCodeAt(0)
    hash |= 0
  }
  return Math.abs(hash)
}

function findInstance(instanceId: string) {
  return mockState.instances.find((item) => item.instance_id === instanceId)
}

function requireInstance(instanceId: string) {
  const instance = findInstance(instanceId)
  if (!instance) {
    throw new Error(`[mock-api] 未找到实例：${instanceId}`)
  }
  return instance
}

function findLink(linkId: string) {
  return mockState.links.find((item) => item.link_id === linkId)
}

function requireLink(linkId: string) {
  const link = findLink(linkId)
  if (!link) {
    throw new Error(`[mock-api] 未找到链路：${linkId}`)
  }
  return link
}

function ensureInstanceResource(instanceId: string): InstanceResource {
  if (!mockState.instanceResources[instanceId]) {
    mockState.instanceResources[instanceId] = {
      cpu_usage: 18,
      mem_byte: 2 * 1024 * 1024 * 1024,
      swap_mem_byte: 0.25 * 1024 * 1024 * 1024
    }
  }
  return mockState.instanceResources[instanceId]
}

function ensureLinkResource(linkId: string): LinkResource {
  if (!mockState.linkResources[linkId]) {
    mockState.linkResources[linkId] = {
      recv_bps: 120_000_000,
      send_bps: 110_000_000,
      recv_pps: 58_000,
      send_pps: 54_000,
      recv_err_pps: 0,
      send_err_pps: 0,
      recv_drop_pps: 0,
      send_drop_pps: 0
    }
  }
  return mockState.linkResources[linkId]
}

function ensureNodeResource(nodeIndex: number): HostResource {
  if (!mockState.nodeResources[nodeIndex]) {
    mockState.nodeResources[nodeIndex] = {
      cpu_usage: 22,
      mem_byte: 6 * 1024 * 1024 * 1024,
      swap_mem_byte: 0.5 * 1024 * 1024 * 1024
    }
  }
  return mockState.nodeResources[nodeIndex]
}

function buildInstanceDetail(instance: Instance): InstanceDetail {
  const connections = Object.fromEntries(
    mockState.links
      .filter((link) => link.connect_instance.includes(instance.instance_id))
      .map((link) => {
        const peerId =
          link.connect_instance[0] === instance.instance_id
            ? link.connect_instance[1]
            : link.connect_instance[0]
        const peer = findInstance(peerId)
        return [
          link.link_id,
          {
            link_id: link.link_id,
            instance_id: peerId,
            instance_type: peer?.type ?? 'unknown',
            end_node_index: peer?.node_index ?? 0
          }
        ]
      })
  )

  return {
    ...instance,
    image: instance.type.toLowerCase().includes('ground') ? 'ground-station:mock' : 'satellite:mock',
    resource_limit: {
      nano_cpu: instance.type.toLowerCase().includes('ground') ? 1_000_000_000 : 2_000_000_000,
      memory_byte: instance.type.toLowerCase().includes('ground')
        ? 1024 * 1024 * 1024
        : 2 * 1024 * 1024 * 1024
    },
    connections
  }
}

function buildLinkDetail(link: Link): LinkDetail {
  const [startId, endId] = link.connect_instance
  const startInstance = findInstance(startId)
  const endInstance = findInstance(endId)
  const serial = (hashString(link.link_id) % 200) + 1
  const hexSerial = serial.toString(16)
  const addressInfos: [Record<string, string>, Record<string, string>] = [
    {
      ipv4: `10.${serial}.0.1/30`,
      ipv6: `fd00:${hexSerial}::1/64`
    },
    {
      ipv4: `10.${serial}.0.2/30`,
      ipv6: `fd00:${hexSerial}::2/64`
    }
  ]
  const endInfos: [EndInfo, EndInfo] = [
    {
      instance_id: startId,
      instance_type: startInstance?.type ?? 'unknown',
      end_node_index: startInstance?.node_index ?? 0
    },
    {
      instance_id: endId,
      instance_type: endInstance?.type ?? 'unknown',
      end_node_index: endInstance?.node_index ?? 0
    }
  ]

  return {
    ...link,
    address_infos: addressInfos,
    end_infos: endInfos,
    extra: {}
  }
}

function buildInstanceHistory(resource: InstanceResource): TimedInstanceResource[] {
  return Array.from({ length: 6 }, (_, index) => {
    const factor = 1 + (index - 2) * 0.04
    return {
      time: new Date(Date.now() - (5 - index) * 5 * 60_000).toISOString(),
      cpu_usage: Number((resource.cpu_usage * factor).toFixed(2)),
      mem_byte: Math.round(resource.mem_byte * factor),
      swap_mem_byte: Math.round(resource.swap_mem_byte * factor)
    }
  })
}

function buildLinkHistory(resource: LinkResource): TimedLinkResource[] {
  return Array.from({ length: 6 }, (_, index) => {
    const factor = 1 + (index - 2) * 0.05
    return {
      time: new Date(Date.now() - (5 - index) * 5 * 60_000).toISOString(),
      recv_bps: Math.round(resource.recv_bps * factor),
      send_bps: Math.round(resource.send_bps * factor),
      recv_pps: Math.round(resource.recv_pps * factor),
      send_pps: Math.round(resource.send_pps * factor),
      recv_err_pps: resource.recv_err_pps,
      send_err_pps: resource.send_err_pps,
      recv_drop_pps: resource.recv_drop_pps,
      send_drop_pps: resource.send_drop_pps
    }
  })
}

function buildNodeHistory(resource: HostResource): TimedHostResource[] {
  return Array.from({ length: 6 }, (_, index) => {
    const factor = 1 + (index - 2) * 0.03
    return {
      time: new Date(Date.now() - (5 - index) * 5 * 60_000).toISOString(),
      cpu_usage: Number((resource.cpu_usage * factor).toFixed(2)),
      mem_byte: Math.round(resource.mem_byte * factor),
      swap_mem_byte: Math.round(resource.swap_mem_byte * factor)
    }
  })
}

function normalizeEmulationConfig(value: unknown): EmulationConfig | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const raw = value as RawEmulationInfo

  if (raw.instance_type_config && typeof raw.instance_type_config === 'object') {
    const normalized = Object.fromEntries(
      Object.entries(raw.instance_type_config).map(([typeName, typeConfig]) => [
        typeName,
        {
          image: typeConfig.image,
          envs: typeConfig.envs,
          resource_limit: {
            nano_cpu: typeConfig.resource_limit.nano_cpu,
            memory_byte: typeConfig.resource_limit.memory_byte
          }
        }
      ])
    )

    return {
      running: Boolean(raw.running),
      instance_type_config: normalized
    }
  }

  if (!raw.type_config || typeof raw.type_config !== 'object') {
    return null
  }

  const normalized = Object.fromEntries(
    Object.entries(raw.type_config).map(([typeName, typeConfig]) => [
      typeName,
      {
        image: typeConfig.image ?? `${typeName}:mock`,
        envs: typeConfig.container_envs ?? typeConfig.envs ?? {},
        resource_limit: {
          nano_cpu: typeConfig.resource_limit?.nano_cpu ?? 1_000_000_000,
          memory_byte: typeConfig.resource_limit?.memory_byte ?? 512 * 1024 * 1024
        }
      }
    ])
  )

  return {
    running: Boolean(raw.running),
    instance_type_config: normalized
  }
}

async function handleMockRequest(config: InternalAxiosRequestConfig): Promise<unknown> {
  const method = (config.method || 'get').toLowerCase()
  const path = normalizePath(config.url)
  const prefix = typeof config.params?.prefix === 'string' ? config.params.prefix : undefined

  if (method === 'get' && path === '/instances') {
    return clone(mockState.instances)
  }

  const restInstanceDetailMatch = path.match(/^\/instances\/([^/]+)$/)
  if (method === 'get' && restInstanceDetailMatch) {
    return buildInstanceDetail(requireInstance(restInstanceDetailMatch[1]))
  }

  const legacyInstanceDetailMatch = path.match(/^\/instance\/\d+\/([^/]+)$/)
  if (method === 'get' && legacyInstanceDetailMatch) {
    return buildInstanceDetail(requireInstance(legacyInstanceDetailMatch[1]))
  }

  const instanceStartMatch = path.match(/^\/instances\/([^/]+)\/(start|stop)$/)
  if (method === 'post' && instanceStartMatch) {
    const instance = requireInstance(instanceStartMatch[1])
    instance.start = instanceStartMatch[2] === 'start'
    return null
  }

  if (method === 'post' && path === '/instances') {
    const payload = getPayload<Partial<Instance>>(config)
    if (payload?.instance_id) {
      const nextInstance: Instance = {
        instance_id: payload.instance_id,
        name: payload.name ?? payload.instance_id,
        type: payload.type ?? 'custom-instance',
        start: payload.start ?? true,
        node_index: payload.node_index ?? 0,
        extra: payload.extra ?? {}
      }
      const index = mockState.instances.findIndex((item) => item.instance_id === nextInstance.instance_id)
      if (index >= 0) {
        mockState.instances[index] = nextInstance
      } else {
        mockState.instances.push(nextInstance)
      }
      ensureInstanceResource(nextInstance.instance_id)
    }
    return null
  }

  const instanceDeleteMatch = path.match(/^\/instances\/([^/]+)$/)
  if (method === 'delete' && instanceDeleteMatch) {
    const instanceId = instanceDeleteMatch[1]
    mockState.instances = mockState.instances.filter((item) => item.instance_id !== instanceId)
    delete mockState.instanceResources[instanceId]
    delete mockState.positions[instanceId]
    const removedLinks = mockState.links
      .filter((link) => link.connect_instance.includes(instanceId))
      .map((link) => link.link_id)
    mockState.links = mockState.links.filter((link) => !link.connect_instance.includes(instanceId))
    removedLinks.forEach((linkId) => {
      delete mockState.linkResources[linkId]
    })
    return null
  }

  if (method === 'get' && path === '/links') {
    return clone(mockState.links)
  }

  const nodeLinksMatch = path.match(/^\/links\/(\d+)$/)
  if (method === 'get' && nodeLinksMatch) {
    const nodeIndex = Number(nodeLinksMatch[1])
    return clone(mockState.links.filter((link) => link.node_index === nodeIndex))
  }

  const linkDetailMatch = path.match(/^\/link\/\d+\/([^/]+)$/)
  if (method === 'get' && linkDetailMatch) {
    return buildLinkDetail(requireLink(linkDetailMatch[1]))
  }

  if (method === 'post' && path === '/links') {
    const payload = getPayload<Partial<Link>>(config)
    if (payload?.link_id && Array.isArray(payload.connect_instance) && payload.connect_instance.length === 2) {
      const nextLink: Link = {
        link_id: payload.link_id,
        type: payload.type ?? 'custom-link',
        enable: payload.enable ?? true,
        connect_instance: [payload.connect_instance[0], payload.connect_instance[1]],
        node_index: payload.node_index ?? 0
      }
      const index = mockState.links.findIndex((item) => item.link_id === nextLink.link_id)
      if (index >= 0) {
        mockState.links[index] = nextLink
      } else {
        mockState.links.push(nextLink)
      }
      ensureLinkResource(nextLink.link_id)
    }
    return null
  }

  const linkDeleteMatch = path.match(/^\/links\/([^/]+)$/)
  if (method === 'delete' && linkDeleteMatch) {
    const linkId = linkDeleteMatch[1]
    mockState.links = mockState.links.filter((item) => item.link_id !== linkId)
    delete mockState.linkResources[linkId]
    return null
  }

  if (method === 'get' && path === '/link/parameter') {
    return {
      isl: {
        latency_ms: 12,
        jitter_ms: 1,
        loss_rate: 0.01
      },
      'ground-uplink': {
        latency_ms: 24,
        jitter_ms: 3,
        loss_rate: 0.03
      },
      'ground-backhaul': {
        latency_ms: 8,
        jitter_ms: 1,
        loss_rate: 0.005
      }
    }
  }

  const linkParameterMatch = path.match(/^\/link\/parameter\/\d+\/([^/]+)$/)
  if (method === 'post' && linkParameterMatch) {
    requireLink(linkParameterMatch[1])
    return null
  }

  if (method === 'get' && path === '/node') {
    return clone(mockState.nodes)
  }

  const nodeDetailMatch = path.match(/^\/node\/(\d+)$/)
  if (method === 'get' && nodeDetailMatch) {
    const nodeIndex = Number(nodeDetailMatch[1])
    const node = mockState.nodes.find((item) => item.node_index === nodeIndex)
    if (!node) {
      throw new Error(`[mock-api] 未找到节点：${nodeIndex}`)
    }
    return clone(node)
  }

  if (method === 'get' && path === '/resource/last/instance/all') {
    return clone(mockState.instanceResources)
  }

  const instanceResourceMatch = path.match(/^\/resource\/last\/instance\/([^/]+)$/)
  if (method === 'get' && instanceResourceMatch) {
    const instanceId = instanceResourceMatch[1]
    return {
      [instanceId]: clone(ensureInstanceResource(instanceId))
    }
  }

  if (method === 'get' && path === '/resource/period/instance/all') {
    return Object.fromEntries(
      Object.entries(mockState.instanceResources).map(([instanceId, resource]) => [
        instanceId,
        buildInstanceHistory(resource)
      ])
    )
  }

  const instancePeriodMatch = path.match(/^\/resource\/period\/instance\/([^/]+)$/)
  if (method === 'get' && instancePeriodMatch) {
    const instanceId = instancePeriodMatch[1]
    return {
      [instanceId]: buildInstanceHistory(ensureInstanceResource(instanceId))
    }
  }

  if (method === 'get' && path === '/resource/last/link/all') {
    return clone(mockState.linkResources)
  }

  const linkResourceMatch = path.match(/^\/resource\/last\/link\/([^/]+)$/)
  if (method === 'get' && linkResourceMatch) {
    const linkId = linkResourceMatch[1]
    return {
      [linkId]: clone(ensureLinkResource(linkId))
    }
  }

  if (method === 'get' && path === '/resource/period/link/all') {
    return Object.fromEntries(
      Object.entries(mockState.linkResources).map(([linkId, resource]) => [linkId, buildLinkHistory(resource)])
    )
  }

  const linkPeriodMatch = path.match(/^\/resource\/period\/link\/([^/]+)$/)
  if (method === 'get' && linkPeriodMatch) {
    const linkId = linkPeriodMatch[1]
    return {
      [linkId]: buildLinkHistory(ensureLinkResource(linkId))
    }
  }

  if (method === 'get' && path === '/resource/last/node/all') {
    return clone(mockState.nodeResources)
  }

  const nodeResourceMatch = path.match(/^\/resource\/last\/node\/(all|\d+)$/)
  if (method === 'get' && nodeResourceMatch) {
    if (nodeResourceMatch[1] === 'all') {
      return clone(mockState.nodeResources)
    }
    const nodeIndex = Number(nodeResourceMatch[1])
    return {
      [nodeIndex]: clone(ensureNodeResource(nodeIndex))
    }
  }

  if (method === 'get' && path === '/resource/period/node/all') {
    return Object.fromEntries(
      Object.entries(mockState.nodeResources).map(([nodeIndex, resource]) => [
        Number(nodeIndex),
        buildNodeHistory(resource)
      ])
    )
  }

  const nodePeriodMatch = path.match(/^\/resource\/period\/node\/(all|\d+)$/)
  if (method === 'get' && nodePeriodMatch) {
    if (nodePeriodMatch[1] === 'all') {
      return Object.fromEntries(
        Object.entries(mockState.nodeResources).map(([nodeIndex, resource]) => [
          Number(nodeIndex),
          buildNodeHistory(resource)
        ])
      )
    }

    const nodeIndex = Number(nodePeriodMatch[1])
    return {
      [nodeIndex]: buildNodeHistory(ensureNodeResource(nodeIndex))
    }
  }

  if (method === 'get' && path === '/emulation') {
    return clone(mockState.emulationConfig)
  }

  if (method === 'post' && path === '/emulation/start') {
    mockState.emulationConfig.running = true
    syncEmulationConfigToDatabase()
    return null
  }

  if (method === 'post' && path === '/emulation/stop') {
    mockState.emulationConfig.running = false
    syncEmulationConfigToDatabase()
    return null
  }

  if (method === 'post' && path === '/emulation/reset') {
    mockState.emulationConfig = clone(defaultEmulationConfig)
    syncEmulationConfigToDatabase()
    return null
  }

  if (method === 'post' && path === '/emulation/topology') {
    return null
  }

  if (method === 'get' && path === '/platform/status') {
    return {
      status: 'mock',
      version: 'local-mock',
      uptime: 3600
    }
  }

  if (method === 'get' && path === '/platform/time') {
    return new Date().toISOString()
  }

  if (method === 'get' && path === '/platform/address/etcd') {
    return {
      address: '127.0.0.1',
      port: 2379
    }
  }

  if (method === 'get' && path === '/platform/address/influxdb') {
    return {
      enable: false,
      address: '127.0.0.1',
      port: 8086,
      org: 'mock-org',
      bucket: 'mock-bucket',
      token: 'mock-token'
    }
  }

  if (method === 'get' && path === '/position/all') {
    return clone(mockState.positions)
  }

  if (method === 'get' && path === '/file/list') {
    return []
  }

  if (method === 'post' && path === '/file') {
    return null
  }

  if (method === 'delete' && path === '/file') {
    return null
  }

  if (method === 'get' && path === '/file/preview') {
    return '本地 mock 模式下未接入文件预览接口。'
  }

  if (method === 'get' && path === '/database/items') {
    return Object.fromEntries(
      Object.entries(mockState.databaseItems).filter(([key]) => !prefix || key.startsWith(prefix))
    )
  }

  if (method === 'post' && path === '/database/update') {
    const payload = getPayload<{ key: string; item: string }>(config)
    if (payload?.key) {
      mockState.databaseItems[payload.key] = payload.item
      if (payload.key === '/emulation_config') {
        try {
          const parsed = JSON.parse(payload.item) as unknown
          const normalized = normalizeEmulationConfig(parsed)
          if (normalized) {
            mockState.emulationConfig = normalized
            syncEmulationConfigToDatabase()
          }
        } catch {
          // ignore invalid mock payload
        }
      }
    }
    return null
  }

  if (method === 'post' && path === '/database/delete') {
    const payload = getPayload<{ key: string }>(config)
    if (payload?.key) {
      delete mockState.databaseItems[payload.key]
    }
    return null
  }

  if (method === 'get' && path === '/anomalies') {
    return clone(mockState.anomalies)
  }

  const anomalyUpdateMatch = path.match(/^\/anomalies\/(\d+)$/)
  if (method === 'put' && anomalyUpdateMatch) {
    const anomalyId = Number(anomalyUpdateMatch[1])
    const payload = getPayload<{ status?: Anomaly['status'] }>(config)
    const index = mockState.anomalies.findIndex((item) => item.id === anomalyId)
    if (index < 0) {
      throw new Error(`[mock-api] 未找到异常记录：${anomalyId}`)
    }
    mockState.anomalies[index] = {
      ...mockState.anomalies[index],
      status: payload?.status ?? mockState.anomalies[index].status
    }
    return clone(mockState.anomalies[index])
  }

  if (method === 'post' && path === '/mock/reset') {
    resetMockState()
    return null
  }

  throw new Error(`[mock-api] 未实现的接口：${method.toUpperCase()} ${path}`)
}

export function createMockAdapter(options: MockAdapterOptions): AxiosAdapter {
  return async (config) => {
    const data = await handleMockRequest(config)
    const responseData = options.wrapApiResponse
      ? ({ code: 0, msg: 'mock', data } as ApiResponse)
      : data

    return buildResponse(config, responseData)
  }
}