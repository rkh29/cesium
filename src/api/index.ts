import axios from 'axios'
import type {
  ApiResponse,
  PageRequest,
  Instance,
  InstanceDetail,
  Link,
  LinkDetail,
  Node,
  InstanceResource,
  LinkResource,
  HostResource,
  TimedInstanceResource,
  TimedLinkResource,
  TimedHostResource,
  EmulationConfig,
  TopologyRequest,
  ConfigEmulationRequest,
  Position,
  PositionMap,
  FileInfo
} from './types'

// Vite 环境变量：import.meta.env.VITE_API_BASE_URL
// 如果设置了完整 URL（如 http://localhost:8080），需要添加 /api 前缀
// 如果使用代理（'/api'），则直接使用
let baseURL = '/api'
const envObj = (import.meta as any).env || {}
if (envObj.VITE_API_BASE_URL && envObj.VITE_API_BASE_URL !== '') {
  const envURL = envObj.VITE_API_BASE_URL as string
  // 如果是完整 URL（包含 http:// 或 https://），添加 /api 前缀
  if (envURL.startsWith('http://') || envURL.startsWith('https://')) {
    baseURL = `${envURL}/api`
  } else {
    baseURL = envURL
  }
}

// 开发时打印 baseURL 以便调试
if (envObj.DEV) {
  console.log('[API] baseURL:', baseURL)
}

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse
    if (data.code !== 0) {
      console.error('API Error:', data.msg)
      return Promise.reject(new Error(data.msg))
    }
    return data.data as any
  },
  (error) => {
    console.error('Network Error:', error.message)
    return Promise.reject(error)
  }
)

export const instanceApi = {
  /**
   * 实例列表：对应 API.md 中的 GET /api/instances
   */
  getList: (params?: Partial<PageRequest> & { filter?: string; type?: string }): Promise<Instance[]> =>
    api.get('/instances', { params }),

  /**
   * 实例详情：优先使用 REST 风格 `/instances/:id`，必要时也可走 `/instance/:nodeIndex/:instanceId`
   */
  getDetail: (nodeIndex: number | undefined, instanceId: string): Promise<InstanceDetail> => {
    if (typeof nodeIndex === 'number') {
      return api.get(`/instance/${nodeIndex}/${instanceId}`)
    }
    return api.get(`/instances/${instanceId}`)
  },

  /**
   * 启动/停止实例：使用 `/instances/:id/start|stop`，与 API.md 一致
   * 目前前端不再依赖 body 中的 node_index
   */
  start: (_nodeIndex: number, instanceId: string): Promise<void> =>
    api.post(`/instances/${instanceId}/start`),

  stop: (_nodeIndex: number, instanceId: string): Promise<void> =>
    api.post(`/instances/${instanceId}/stop`),

  add: (_nodeIndex: number, instance: any): Promise<void> =>
    api.post('/instances', instance),

  remove: (_nodeIndex: number, instanceId: string): Promise<void> =>
    api.delete(`/instances/${instanceId}`)
}

export const linkApi = {
  /**
   * 链路列表：GET /api/links 或 /api/links/:nodeIndex
   */
  getList: (nodeIndex?: number): Promise<Link[]> =>
    typeof nodeIndex === 'number' ? api.get(`/links/${nodeIndex}`) : api.get('/links'),

  /**
   * 链路详情：GET /api/link/:nodeIndex/:linkId
   */
  getDetail: (nodeIndex: number, linkId: string): Promise<LinkDetail> =>
    api.get(`/link/${nodeIndex}/${linkId}`),

  add: (link: any): Promise<void> =>
    api.post('/links', link),

  remove: (_nodeIndex: number, linkId: string): Promise<void> =>
    api.delete(`/links/${linkId}`),

  /**
   * 链路参数：GET /api/link/parameter
   */
  getParameters: (): Promise<Record<string, Record<string, number>>> =>
    api.get('/link/parameter'),

  updateParameter: (nodeIndex: number, linkId: string, params: Record<string, number>): Promise<void> =>
    api.post(`/link/parameter/${nodeIndex}/${linkId}`, params)
}

export const nodeApi = {
  getList: (): Promise<Node[]> => 
    api.get('/node/'),
  
  getDetail: (nodeIndex: number): Promise<Node> => 
    api.get(`/node/${nodeIndex}`)
}

export const resourceApi = {
  getInstanceResource: (instanceId: string): Promise<Record<string, InstanceResource>> => 
    api.get(`/resource/last/instance/${instanceId}`),
  
  getAllInstanceResources: (): Promise<Record<string, InstanceResource>> => 
    api.get('/resource/last/instance/all'),
  
  getInstanceResourceHistory: (instanceId: string, period: string): Promise<Record<string, TimedInstanceResource[]>> => 
    api.get(`/resource/period/instance/${instanceId}`, { params: { period } }),
  
  getAllInstanceResourceHistory: (period: string): Promise<Record<string, TimedInstanceResource[]>> => 
    api.get('/resource/period/instance/all', { params: { period } }),
  
  getLinkResource: (linkId: string): Promise<Record<string, LinkResource>> => 
    api.get(`/resource/last/link/${linkId}`),
  
  getAllLinkResources: (): Promise<Record<string, LinkResource>> => 
    api.get('/resource/last/link/all'),
  
  getLinkResourceHistory: (linkId: string, period: string): Promise<Record<string, TimedLinkResource[]>> => 
    api.get(`/resource/period/link/${linkId}`, { params: { period } }),
  
  getAllLinkResourceHistory: (period: string): Promise<Record<string, TimedLinkResource[]>> => 
    api.get('/resource/period/link/all', { params: { period } }),
  
  getNodeResource: (nodeIndex: number | 'all'): Promise<Record<number, HostResource>> => 
    api.get(`/resource/last/node/${nodeIndex}`),
  
  getNodeResourceHistory: (nodeIndex: number | 'all', period: string): Promise<Record<number, TimedHostResource[]>> => 
    api.get(`/resource/period/node/${nodeIndex}`, { params: { period } })
}

export const emulateApi = {
  getConfig: (): Promise<EmulationConfig> => 
    api.get('/emulation/'),
  
  updateConfig: async (config: ConfigEmulationRequest): Promise<void> => {
    // 先获取当前配置
    const currentConfig = await api.get('/emulation/') as EmulationConfig
    
    // 构建新的配置对象，符合后端 EmulationInfo 结构
    const emulationInfo = {
      running: currentConfig?.running || false,
      type_config: {} as Record<string, {
        image: string
        container_envs: Record<string, string>
        resource_limit: {
          nano_cpu: number
          memory_byte: number
        }
      }>
    }
    
    // 转换配置格式
    Object.entries(config).forEach(([typeName, typeConfig]) => {
      // 解析资源限制字符串（如 "50M" -> 50000000）
      const nanoCpu = parseResourceLimit(typeConfig.resource_limit.nano_cpu, 'dec')
      const memoryByte = parseResourceLimit(typeConfig.resource_limit.memory_byte, 'bin')
      
      emulationInfo.type_config[typeName] = {
        image: typeConfig.image,
        container_envs: typeConfig.container_envs || {},
        resource_limit: {
          nano_cpu: nanoCpu,
          memory_byte: memoryByte
        }
      }
    })
    
    // 使用数据库 API 直接写入 etcd
    return databaseApi.update('/emulation_config', JSON.stringify(emulationInfo))
  },
  
  start: (): Promise<void> => 
    api.post('/emulation/start'),
  
  stop: (): Promise<void> => 
    api.post('/emulation/stop'),
  
  addTopology: (topology: TopologyRequest): Promise<void> => 
    api.post('/emulation/topology', topology),
  
  reset: (): Promise<void> => 
    api.post('/emulation/reset')
}

// 辅助函数：解析资源限制字符串
function parseResourceLimit(value: string, type: 'dec' | 'bin'): number {
  const match = value.match(/^([1-9][0-9]*)([KMGT]?)$/i)
  if (!match) return 0
  
  const base = parseInt(match[1], 10)
  const unit = match[2].toUpperCase()
  
  let multiplier = 1
  if (type === 'dec') {
    // 十进制单位 (K=1e3, M=1e6, G=1e9, T=1e12)
    switch (unit) {
      case 'K': multiplier = 1e3; break
      case 'M': multiplier = 1e6; break
      case 'G': multiplier = 1e9; break
      case 'T': multiplier = 1e12; break
    }
  } else {
    // 二进制单位 (K=2^10, M=2^20, G=2^30, T=2^40)
    switch (unit) {
      case 'K': multiplier = 1 << 10; break
      case 'M': multiplier = 1 << 20; break
      case 'G': multiplier = 1 << 30; break
      case 'T': multiplier = 1 << 40; break
    }
  }
  
  return base * multiplier
}

export const platformApi = {
  getStatus: (): Promise<{ status: string; version: string; uptime: number }> =>
    api.get('/platform/status'),
  
  getTime: (): Promise<string> => 
    api.get('/platform/time'),
  
  getEtcdConfig: (): Promise<{ address: string; port: number }> => 
    api.get('/platform/address/etcd'),
  
  getInfluxDBConfig: (): Promise<{ 
    enable: boolean
    address: string
    port: number
    org: string
    bucket: string
    token: string 
  }> => api.get('/platform/address/influxdb')
}

export const positionApi = {
  /**
   * 获取所有实例/卫星位置：GET /api/position/all
   */
  getAll: (): Promise<PositionMap> =>
    api.get('/position/all'),

  /**
   * 获取单个实例位置：前端在 getAll 结果中查找
   */
  async getInstancePosition(instanceId: string): Promise<Position | undefined> {
    const all = await positionApi.getAll()
    return all[instanceId]
  }
}

export const fileApi = {
  getList: (path?: string): Promise<FileInfo[]> => 
    api.get('/file/list', { params: { path } }),
  
  upload: (file: File, path?: string): Promise<void> => {
    const formData = new FormData()
    formData.append('file', file)
    if (path) formData.append('path', path)
    return api.post('/file/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  delete: (path: string): Promise<void> => 
    api.delete('/file/', { data: { path } }),
  
  preview: (path: string): Promise<string> => 
    api.get('/file/preview', { params: { path } }),
  
  download: (fileName: string): string => 
    `/api/file/download/${fileName}`
}

export const databaseApi = {
  getItems: (prefix: string): Promise<Record<string, string>> => 
    api.get('/database/items', { params: { prefix } }),
  
  update: (key: string, value: string): Promise<void> => 
    api.post('/database/update', { key, item: value }),
  
  delete: (key: string): Promise<void> => 
    api.post('/database/delete', { key })
}

// WebSocket 地址构造：ws(s)://host/api/ws
export const wsUrl = (() => {
  try {
    const envBase = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined
    if (envBase) {
      const url = new URL(envBase)
      url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
      url.pathname = '/api/ws'
      return url.toString()
    }
    if (typeof window !== 'undefined') {
      const { protocol, host } = window.location
      const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:'
      return `${wsProtocol}//${host}/api/ws`
    }
  } catch {
    // ignore and fallback
  }
  return '/api/ws'
})()

export default api
