export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

export interface PageRequest {
  page_index?: number
  page_size?: number
  key_word?: string
}

export interface Instance {
  instance_id: string
  name: string
  type: string
  start: boolean
  node_index: number
  extra: Record<string, string>
}

export interface ResourceLimit {
  nano_cpu: number
  memory_byte: number
}

export interface ConnectionInfo {
  link_id: string
  instance_id: string
  instance_type: string
  end_node_index: number
}

export interface InstanceDetail extends Instance {
  image: string
  resource_limit: ResourceLimit
  connections: Record<string, ConnectionInfo>
}

export interface InstanceResource {
  cpu_usage: number
  mem_byte: number
  swap_mem_byte: number
}

export interface LinkResource {
  recv_bps: number
  send_bps: number
  recv_pps: number
  send_pps: number
  recv_err_pps: number
  send_err_pps: number
  recv_drop_pps: number
  send_drop_pps: number
}

export interface HostResource {
  cpu_usage: number
  mem_byte: number
  swap_mem_byte: number
}

export interface TimedInstanceResource extends InstanceResource {
  time: string
}

export interface TimedLinkResource extends LinkResource {
  time: string
}

export interface TimedHostResource extends HostResource {
  time: string
}

export interface Link {
  link_id: string
  type: string
  enable: boolean
  connect_instance: [string, string]
  node_index: number
}

export interface LinkDetail extends Link {
  address_infos: [Record<string, string>, Record<string, string>]
  end_infos: [EndInfo, EndInfo]
  extra: Record<string, string>
}

export interface EndInfo {
  instance_id: string
  instance_type: string
  end_node_index: number
}

export interface Node {
  node_index: number
  free_instance: number
  is_master_node: boolean
  l_3_addr_v_4: string
  l_3_addr_v_6: string
  l_2_addr: string
}

export interface InstanceTypeConfig {
  image: string
  envs: Record<string, string>
  resource_limit: ResourceLimit
}

export interface EmulationConfig {
  instance_type_config: Record<string, InstanceTypeConfig>
  running: boolean
}

export interface TopologyInstance {
  type: string
  extra?: Record<string, string>
  device_need?: Record<string, DeviceRequireInfo>
}

export interface DeviceRequireInfo {
  dev_name: string
  need_num: number
  is_mutex: boolean
}

export interface TopologyLink {
  end_indexes: [number, number]
  type: string
  init_parameter?: Record<string, number>
  address_infos?: [Record<string, string>, Record<string, string>]
  extra?: Record<string, string>
}

export interface TopologyRequest {
  instances: TopologyInstance[]
  links: TopologyLink[]
}

export interface TypeConfigRequest {
  image: string
  container_envs?: Record<string, string>
  resource_limit: {
    nano_cpu: string
    memory_byte: string
  }
}

export type ConfigEmulationRequest = Record<string, TypeConfigRequest>

export interface Position {
  latitude: number
  longitude: number
  altitude: number
}

export type PositionMap = Record<string, Position>

export interface FileInfo {
  name: string
  size: number
  modify_time: string
  is_dir: boolean
}
