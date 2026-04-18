const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const { createSatOpsAgentRuntime } = require('./agent-runtime/runtime.cjs')

const app = express()
app.use(cors())
app.use(express.json())

function loadEnvFile(fileName) {
  const filePath = path.join(__dirname, fileName)
  if (!fs.existsSync(filePath)) return
  const content = fs.readFileSync(filePath, 'utf8')
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const index = trimmed.indexOf('=')
    if (index < 0) return
    const key = trimmed.slice(0, index).trim()
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, '')
    if (!(key in process.env)) process.env[key] = value
  })
}

loadEnvFile('.env.mock')

const leoLatitudes = [-46, -22, 0, 22, 46]
const leoPlaneLongitudes = [0, 120, -120]
const groundStations = [
  { id: 'ground-boundary-west', name: '边界监测站-西', latitude: 75.2, longitude: 39.1 },
  { id: 'ground-boundary-east', name: '边界监测站-东', latitude: 134.8, longitude: 35.4 },
  { id: 'ground-boundary-south', name: '边界监测站-南', latitude: 110.3, longitude: 18.3 },
  { id: 'ground-boundary-north', name: '边界监测站-北', latitude: 123.5, longitude: 53.2 },
  { id: 'ground-mcs-001', name: '中心主控站', latitude: 104.1, longitude: 35.8 }
]

function createInstances() {
  const result = []

  for (let plane = 0; plane < 3; plane += 1) {
    for (let index = 0; index < 5; index += 1) {
      const serial = plane * 5 + index + 1
      result.push({
        instance_id: `sat-${String(serial).padStart(3, '0')}`,
        name: `低轨卫星-${String(serial).padStart(2, '0')}`,
        type: 'satellite',
        start: true,
        node_index: 0,
        extra: {
          orbit_layer: 'LEO',
          orbit_plane: String(plane + 1),
          physical_mapping: 'Raspberry Pi'
        }
      })
    }
  }

  for (let index = 0; index < 3; index += 1) {
    result.push({
      instance_id: `geo-${String(index + 1).padStart(3, '0')}`,
      name: `高轨管控星-${index + 1}`,
      type: 'satellite',
      start: true,
      node_index: 0,
      extra: {
        orbit_layer: 'GEO',
        physical_mapping: 'Jetson',
        role: 'AIOps Coordinator'
      }
    })
  }

  groundStations.forEach((station) => {
    result.push({
      instance_id: station.id,
      name: station.name,
      type: 'ground-station',
      start: true,
      node_index: 0,
      extra: {}
    })
  })

  return result
}

function createLinks() {
  const result = []
  let serial = 1

  for (let plane = 0; plane < 3; plane += 1) {
    const base = plane * 5 + 1
    for (let index = 0; index < 5; index += 1) {
      const start = `sat-${String(base + index).padStart(3, '0')}`
      const end = `sat-${String(base + ((index + 1) % 5)).padStart(3, '0')}`
      result.push({
        link_id: `link-${String(serial++).padStart(3, '0')}`,
        type: 'isl',
        enable: true,
        connect_instance: [start, end],
        node_index: 0
      })
    }
  }

  result.push(
    {
      link_id: `link-${String(serial++).padStart(3, '0')}`,
      type: 'geo-backbone',
      enable: true,
      connect_instance: ['geo-001', 'geo-002'],
      node_index: 0
    },
    {
      link_id: `link-${String(serial++).padStart(3, '0')}`,
      type: 'geo-backbone',
      enable: true,
      connect_instance: ['geo-002', 'geo-003'],
      node_index: 0
    },
    {
      link_id: `link-${String(serial++).padStart(3, '0')}`,
      type: 'geo-backbone',
      enable: true,
      connect_instance: ['geo-003', 'geo-001'],
      node_index: 0
    }
  )

  groundStations
    .filter((station) => station.id !== 'ground-mcs-001')
    .forEach((station) => {
      result.push({
        link_id: `link-${String(serial++).padStart(3, '0')}`,
        type: 'ground-backhaul',
        enable: true,
        connect_instance: [station.id, 'ground-mcs-001'],
        node_index: 0
      })
    })

  return result
}

function createPositions() {
  const result = {}

  for (let plane = 0; plane < 3; plane += 1) {
    for (let index = 0; index < 5; index += 1) {
      const serial = plane * 5 + index + 1
      result[`sat-${String(serial).padStart(3, '0')}`] = {
        latitude: leoLatitudes[index],
        longitude: leoPlaneLongitudes[plane] + index * 14,
        altitude: 1650000
      }
    }
  }

  result['geo-001'] = { latitude: 0, longitude: 0, altitude: 35786000 }
  result['geo-002'] = { latitude: 0, longitude: 120, altitude: 35786000 }
  result['geo-003'] = { latitude: 0, longitude: -120, altitude: 35786000 }

  groundStations.forEach((station) => {
    result[station.id] = {
      latitude: station.latitude,
      longitude: station.longitude,
      altitude: 50
    }
  })

  return result
}

const instances = createInstances()
const links = createLinks()
const positions = createPositions()

const nodes = [
  {
    node_index: 0,
    free_instance: 512,
    is_master_node: true,
    l_3_addr_v_4: '192.168.1.100',
    l_3_addr_v_6: '::1',
    l_2_addr: '00:00:00:00:00:01'
  }
]

const instanceResources = {}
const linkResources = {}
const nodeResources = {}
let emulationRunning = true
const faults = []
const llmConfig = {
  coordinator: { model: 'qwen-plus', endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1' },
  specialist_network: { model: 'qwen-turbo', endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1' }
}

const approvals = [
  {
    request_id: 'apr-1001',
    action: 'restart_satellite',
    target: 'geo-001',
    security_level: 'critical',
    reason: '高风险控制操作需要人工确认',
    created_at: new Date().toISOString(),
    status: 'pending'
  }
]

const defaultInstanceStartMap = Object.fromEntries(instances.map((item) => [item.instance_id, item.start]))
const defaultLinkEnableMap = Object.fromEntries(links.map((item) => [item.link_id, item.enable]))

function response(data) {
  return { code: 0, msg: 'success', data }
}

function resolveEndpoint(endpoint) {
  const base = String(endpoint || '').trim()
  if (!base) return ''
  if (base.endsWith('/chat/completions')) return base
  return `${base.replace(/\/+$/, '')}/chat/completions`
}

function getApiKey(role) {
  return (
    process.env[`SATOPS_${role.toUpperCase()}_API_KEY`] ||
    process.env.SATOPS_LLM_API_KEY ||
    process.env.DASHSCOPE_API_KEY ||
    ''
  ).trim()
}

async function callOpenAICompatible(role, message, history = [], systemPrompt = '') {
  const roleConfig = llmConfig[role]
  const endpoint = resolveEndpoint(roleConfig?.endpoint)
  const model = roleConfig?.model
  const apiKey = getApiKey(role)

  if (!endpoint || !model || !apiKey || endpoint.includes('example')) {
    return null
  }

  const messages = []
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt })
  }

  history.slice(-8).forEach((item) => {
    if (!item?.content) return
    messages.push({
      role: item.role === 'assistant' ? 'assistant' : 'user',
      content: item.content
    })
  })

  if (!history.length || history[history.length - 1]?.content !== message) {
    messages.push({ role: 'user', content: message })
  }

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      messages
    })
  })

  if (!resp.ok) {
    const text = await resp.text()
    throw new Error(`LLM request failed: ${resp.status} ${text}`)
  }

  const data = await resp.json()
  const content = data?.choices?.[0]?.message?.content
  if (!content) throw new Error('LLM response missing content')
  return String(content).trim()
}

function generateRandomResources() {
  instances.forEach((instance) => {
    instance.start = defaultInstanceStartMap[instance.instance_id]
  })
  links.forEach((link) => {
    link.enable = defaultLinkEnableMap[link.link_id]
  })

  instances.forEach((instance, index) => {
    const isGround = instance.type === 'ground-station'
    const isGeo = instance.instance_id.startsWith('geo-')
    const cpu = isGround ? 18 + (index % 4) * 2 + Math.random() * 3 : isGeo ? 28 + (index % 3) * 4 + Math.random() * 4 : 34 + (index % 5) * 5 + Math.random() * 5
    const memGb = isGround ? 1.5 : isGeo ? 3.6 : 2.4
    instanceResources[instance.instance_id] = {
      cpu_usage: cpu,
      mem_byte: (memGb + Math.random() * 0.25) * 1024 * 1024 * 1024,
      swap_mem_byte: (0.2 + Math.random() * 0.08) * 1024 * 1024 * 1024
    }
  })

  links.forEach((link, index) => {
    const isGroundBackhaul = link.type === 'ground-backhaul'
    const isGeoBackbone = link.type === 'geo-backbone'
    const baseBps = isGroundBackhaul ? 420000000 : isGeoBackbone ? 260000000 : 120000000
    linkResources[link.link_id] = {
      recv_bps: baseBps + index * 320000 + Math.random() * 2000000,
      send_bps: baseBps - 6000000 + index * 280000 + Math.random() * 1500000,
      recv_pps: isGroundBackhaul ? 94000 : 58000,
      send_pps: isGroundBackhaul ? 88000 : 54000,
      recv_err_pps: 0,
      send_err_pps: 0,
      recv_drop_pps: 1,
      send_drop_pps: 1
    }
  })

  nodes.forEach((node) => {
    nodeResources[node.node_index] = {
      cpu_usage: 24 + Math.random() * 8,
      mem_byte: (6 + Math.random() * 1.2) * 1024 * 1024 * 1024,
      swap_mem_byte: (0.3 + Math.random() * 0.2) * 1024 * 1024 * 1024
    }
  })

  applyActiveFaultEffects()
}

function applyActiveFaultEffects() {
  faults
    .filter((item) => item.status === 'active')
    .forEach((fault) => {
      const linkedNodes =
        links.find((item) => item.link_id === fault.target)?.connect_instance || []

      if (fault.type === 'link_loss') {
        const resource = linkResources[fault.target]
        if (resource) {
          const lossRate = Number(fault.parameters?.loss_rate || 10)
          resource.recv_drop_pps = Math.max(resource.recv_drop_pps, lossRate * 6)
          resource.send_drop_pps = Math.max(resource.send_drop_pps, lossRate * 5)
          resource.recv_err_pps = Math.max(resource.recv_err_pps, Math.round(lossRate * 1.5))
          resource.send_err_pps = Math.max(resource.send_err_pps, Math.round(lossRate * 1.2))
        }

        linkedNodes.forEach((nodeId) => {
          const instance = instanceResources[nodeId]
          if (!instance) return
          instance.cpu_usage = Math.max(instance.cpu_usage, 82)
          instance.mem_byte = Math.max(instance.mem_byte, 6.4 * 1024 * 1024 * 1024)
        })
      }

      if (fault.type === 'link_delay') {
        const resource = linkResources[fault.target]
        if (resource) {
          resource.recv_err_pps = Math.max(resource.recv_err_pps, 18)
          resource.send_err_pps = Math.max(resource.send_err_pps, 16)
        }

        linkedNodes.forEach((nodeId) => {
          const instance = instanceResources[nodeId]
          if (!instance) return
          instance.cpu_usage = Math.max(instance.cpu_usage, 78)
          instance.mem_byte = Math.max(instance.mem_byte, 6.2 * 1024 * 1024 * 1024)
        })
      }

      if (fault.type === 'link_down') {
        const link = links.find((item) => item.link_id === fault.target)
        if (link) link.enable = false
        if (linkResources[fault.target]) {
          linkResources[fault.target].recv_bps = 0
          linkResources[fault.target].send_bps = 0
          linkResources[fault.target].recv_drop_pps = 220
          linkResources[fault.target].send_drop_pps = 220
          linkResources[fault.target].recv_err_pps = 120
          linkResources[fault.target].send_err_pps = 120
        }

        linkedNodes.forEach((nodeId) => {
          const instance = instanceResources[nodeId]
          if (!instance) return
          instance.cpu_usage = Math.max(instance.cpu_usage, 96)
          instance.mem_byte = Math.max(instance.mem_byte, 8.2 * 1024 * 1024 * 1024)
        })
      }

      if (fault.type === 'node_offline') {
        const instance = instances.find((item) => item.instance_id === fault.target)
        if (instance) instance.start = false
        delete instanceResources[fault.target]
      }

      if (fault.type === 'resource_exhaustion') {
        instanceResources[fault.target] = {
          cpu_usage: 98,
          mem_byte: 8.5 * 1024 * 1024 * 1024,
          swap_mem_byte: 1.2 * 1024 * 1024 * 1024
        }
      }
    })
}

function generatePeriodData() {
  return Array.from({ length: 10 }, (_, index) => ({
    Time: new Date(Date.now() - (10 - index) * 60000).toISOString(),
    cpu_usage: 30 + Math.random() * 18,
    mem_byte: (2 + Math.random() * 1.2) * 1024 * 1024 * 1024,
    swap_mem_byte: (0.2 + Math.random() * 0.08) * 1024 * 1024 * 1024
  }))
}

function getLinkParametersMap() {
  const params = {}
  links.forEach((link) => {
    params[link.link_id] = {
      connect: link.enable ? 1 : 0,
      latency_ms: link.type === 'ground-backhaul' ? 3 + Math.random() * 3 : link.type === 'geo-backbone' ? 90 + Math.random() * 12 : 12 + Math.random() * 6,
      jitter_ms: link.type === 'ground-backhaul' ? 0.8 + Math.random() * 0.4 : link.type === 'geo-backbone' ? 2 + Math.random() * 1.5 : 1.2 + Math.random() * 0.8,
      loss_rate: Math.random() * 0.002,
      bandwidth_mbps: link.type === 'ground-backhaul' ? 900 + Math.random() * 100 : link.type === 'geo-backbone' ? 520 + Math.random() * 80 : 160 + Math.random() * 40
    }
  })

  faults
    .filter((item) => item.status === 'active')
    .forEach((fault) => {
      const target = params[fault.target]
      if (!target) return
      if (fault.type === 'link_loss') {
        target.loss_rate = Math.max(target.loss_rate, Number(fault.parameters?.loss_rate || 10) / 100)
      }
      if (fault.type === 'link_delay') {
        target.latency_ms = Math.max(target.latency_ms, Number(fault.parameters?.delay_ms || 50))
        target.jitter_ms = Math.max(target.jitter_ms, Number(fault.parameters?.jitter_ms || 10))
      }
      if (fault.type === 'link_down') {
        target.connect = 0
        target.loss_rate = 1
        target.bandwidth_mbps = 0
      }
    })

  return params
}

function summarizeSystem() {
  const runningInstances = instances.filter((item) => item.start).length
  const abnormalInstances = Object.values(instanceResources).filter(
    (item) => item.cpu_usage > 75 || item.mem_byte > 6 * 1024 * 1024 * 1024
  ).length
  const enabledLinks = links.filter((item) => item.enable).length
  return { runningInstances, abnormalInstances, enabledLinks }
}

const satOpsAgentRuntime = createSatOpsAgentRuntime({
  instances,
  links,
  positions,
  instanceResources,
  approvals,
  faults,
  llmConfig,
  getApiKey,
  getLinkParametersMap,
  callOpenAICompatible
})

function generateAgentReply(message) {
  const text = String(message || '').toLowerCase()
  const overview = summarizeSystem()
  const linkParams = getLinkParametersMap()
  const hottestInstance = Object.entries(instanceResources).sort((a, b) => b[1].cpu_usage - a[1].cpu_usage)[0]
  const weakestLink = Object.entries(linkParams).sort((a, b) => b[1].loss_rate - a[1].loss_rate)[0]
  const weakestEndpoints = links.find((item) => item.link_id === weakestLink[0])?.connect_instance || []

  let responseText = `当前共有 ${instances.length} 个实例，运行中 ${overview.runningInstances} 个，异常实例 ${overview.abnormalInstances} 个，可用链路 ${overview.enabledLinks} 条。`
  const suggestions = []

  if (text.includes('失联') || text.includes('排查') || text.includes('异常')) {
    responseText =
      `当前仿真拓扑为 15 颗低轨卫星、3 颗高轨管控星、5 个地面站。建议先检查 GEO 骨干与中心主控站的路由同步，再查看边界站回传链路与低轨骨干环。`
    suggestions.push('先进入链路拓扑查看 GEO Backbone 和 Ground Backhaul 链路状态')
    suggestions.push('再进入黑板审计查看日志指针和全局上下文')
  } else if (text.includes('链路')) {
    responseText =
      `当前最需要关注的链路是 ${weakestLink[0]}，连接 ${weakestEndpoints.join(' -> ')}，估算丢包率 ${(weakestLink[1].loss_rate * 100).toFixed(2)}%，时延约 ${weakestLink[1].latency_ms.toFixed(1)} ms。`
    suggestions.push('进入链路拓扑页面查看该链路详细指标')
  } else if (text.includes('实例') || text.includes('卫星')) {
    responseText =
      `当前负载最高的实例是 ${hottestInstance[0]}，CPU 约 ${hottestInstance[1].cpu_usage.toFixed(1)}%，内存约 ${(hottestInstance[1].mem_byte / 1024 / 1024 / 1024).toFixed(2)} GB。`
    suggestions.push('进入节点实例页面查看该实例详情')
    suggestions.push('如需空间视角观察，切到三维地球页面')
  } else if (text.includes('故障')) {
    responseText = faults.length
      ? `当前活动故障数量为 ${faults.length}。`
      : '当前没有活动故障，系统处于标准 Walker Delta 与 GEO 管控演示状态。'
    suggestions.push('进入故障注入页面可以手动注入链路丢包、延迟或中断')
  } else if (text.includes('怎么') || text.includes('下一步') || text.includes('如何')) {
    responseText =
      '推荐顺序是：先在仪表盘确认实例与链路总体状态，再到三维地球查看空间构型，随后进入节点实例或链路拓扑做细查，最后在协调控制台发起排障任务。'
  }

  return {
    response: responseText,
    actions_taken: [
      { tool: 'instances', result: `${instances.length} 个实例` },
      { tool: 'links', result: `${links.length} 条链路` }
    ],
    suggestions,
    pending_approvals: approvals
      .filter((item) => item.status === 'pending')
      .map((item) => ({
        id: item.request_id,
        action: item.action,
        target: item.target,
        parameters: {},
        security_level: item.security_level
      }))
  }
}

function buildSystemPrompt() {
  return [
    '你是 SatOps 协调控制台助手。',
    '当前仿真拓扑为 15 颗低轨卫星、3 颗高轨管控星、5 个地面站。',
    '低轨采用 Walker Delta 55°: 15/3/f 构型，高度 1650km。',
    '高轨位于 0°、120°、240°，三者形成 GEO 骨干网。',
    '地面为 4 个边界监测站和 1 个中心主控站，边界站通过地面回传直连主控站。',
    '回答要求：简洁、明确、偏运维操作视角。'
  ].join(' ')
}

generateRandomResources()
setInterval(generateRandomResources, 3000)

const traces = {
  'tr-12345': {
    trace_id: 'tr-12345',
    current_phase: 'execute',
    plan: [
      { task: '检查 GEO 骨干链路', assignee: '网络专家', status: 'completed' },
      { task: '分析边界站日志', assignee: '运维专家', status: 'running' },
      { task: '复核中心主控站策略', assignee: '协调器', status: 'pending' }
    ],
    final_review: null
  }
}

const blackboards = {
  'tr-12345': {
    trace_id: 'tr-12345',
    findings: {
      network_status: '全网稳定',
      leo_constellation: 'Walker Delta 55°: 15/3/f',
      geo_backbone: '0° / 120° / 240°',
      log_pointer: '/tmp/trace_tr-12345.csv'
    },
    updated_at: new Date().toISOString()
  }
}

const sandboxFiles = {
  '/tmp/trace_tr-12345.csv': {
    path: '/tmp/trace_tr-12345.csv',
    mime_type: 'text/csv',
    content:
      'timestamp,node,event,severity\n2026-03-21T10:00:00Z,ground-mcs-001,route_sync,info\n2026-03-21T10:00:12Z,geo-001,heartbeat_ok,info'
  }
}

function getSatelliteTelemetry(id) {
  const position = positions[id] || { latitude: 0, longitude: 0, altitude: 0 }
  const isGeo = id.startsWith('geo-')
  return {
    satellite_id: id,
    status: 'online',
    mode: isGeo ? 'control' : 'normal',
    attitude: { pitch: 0.3, yaw: 0.6, roll: -0.2 },
    power: {
      battery_percent: isGeo ? 91 : 84,
      solar_panel_active: true,
      power_mode: 'full',
      consumption_watts: isGeo ? 220 : 150
    },
    communication: {
      band: isGeo ? 'Ka' : 'Ku',
      frequency_ghz: isGeo ? 26.5 : 14.2,
      power_dbm: 30,
      antenna_pointing: {
        target_lat: groundStations[4].latitude,
        target_lon: groundStations[4].longitude
      }
    },
    thermal: { internal_temp_c: isGeo ? 29 : 24, external_temp_c: -45 },
    payloads: [
      { id: 'payload-001', name: '主载荷', status: 'on' },
      { id: 'payload-002', name: '诊断载荷', status: 'standby' }
    ],
    position
  }
}

function getGodNodeState(id) {
  const position = positions[id] || { altitude: 0 }
  const isGeo = id.startsWith('geo-')
  return {
    satellite_id: id,
    mode: isGeo ? 'control' : 'normal',
    orbital: {
      altitude_km: Number((position.altitude / 1000).toFixed(0)),
      velocity_kmps: isGeo ? 3.07 : 7.12,
      inclination_deg: isGeo ? 0 : 55,
      eccentricity: 0.001,
      semi_major_axis_km: isGeo ? 42164 : 8028
    },
    attitude: { pitch: 0.3, yaw: 0.6, roll: -0.2 },
    power: {
      battery_percent: isGeo ? 91 : 84,
      solar_panel_active: true,
      power_mode: 'full',
      consumption_watts: isGeo ? 220 : 150
    },
    timestamp: new Date().toISOString()
  }
}

function queryGodNodeLinks(body = {}) {
  const satelliteIds =
    Array.isArray(body.satellite_ids) && body.satellite_ids.length ? body.satellite_ids : null
  const linkType = body.link_type
  const linkParams = getLinkParametersMap()

  return links
    .filter((item) => !linkType || item.type === linkType)
    .filter((item) => !satelliteIds || item.connect_instance.some((id) => satelliteIds.includes(id)))
    .map((item) => ({
      link_id: item.link_id,
      source: item.connect_instance[0],
      target: item.connect_instance[1],
      status: item.enable ? 'online' : 'offline',
      link_type: item.type,
      latency_ms: Number(linkParams[item.link_id]?.latency_ms || 0),
      bandwidth_mbps: Number(linkParams[item.link_id]?.bandwidth_mbps || 0)
    }))
}

app.get('/api/platform/status', (_req, res) => res.json(response({ status: '正常' })))
app.get('/api/platform/time', (_req, res) => res.json(response(satOpsAgentRuntime.getNowInfo())))
app.get('/api/platform/address/etcd', (_req, res) => res.json(response({ address: 'localhost', port: 2379 })))
app.get('/api/platform/address/influxdb', (_req, res) =>
  res.json(
    response({
      enable: true,
      address: 'localhost',
      port: 8086,
      org: 'satellite_emulator',
      bucket: 'monitor',
      token: '1145141919810'
    })
  )
)

app.get('/api/node/', (_req, res) => res.json(response(nodes)))
app.get('/api/node/:index', (_req, res) => res.json(response(nodes[0])))

app.get('/api/instance/', (_req, res) => res.json(response(instances)))
app.get('/api/instance/:nodeIndex/:instanceId', (req, res) => {
  const inst = instances.find((item) => item.instance_id === req.params.instanceId)
  res.json(
    response(
      inst
        ? {
            ...inst,
            image: inst.type === 'ground-station' ? 'opensn/ground-station:latest' : 'opensn/satellite-router:latest',
            resource_limit: {
              nano_cpu: inst.instance_id.startsWith('geo-') ? 2000000000 : 1000000000,
              memory_byte: inst.instance_id.startsWith('geo-') ? 2147483648 : 536870912
            },
            connections: {}
          }
        : null
    )
  )
})
app.post('/api/instance/start', (req, res) => {
  const inst = instances.find((item) => item.instance_id === req.body.instance_id)
  if (inst) inst.start = true
  res.json(response(null))
})
app.post('/api/instance/stop', (req, res) => {
  const inst = instances.find((item) => item.instance_id === req.body.instance_id)
  if (inst) inst.start = false
  res.json(response(null))
})

app.get('/api/instances', (_req, res) => res.json(response(instances)))
app.get('/api/instances/:id', (req, res) => {
  const inst = instances.find((item) => item.instance_id === req.params.id)
  res.json(
    response(
      inst
        ? {
            ...inst,
            image: inst.type === 'ground-station' ? 'opensn/ground-station:latest' : 'opensn/satellite-router:latest',
            resource_limit: {
              nano_cpu: inst.instance_id.startsWith('geo-') ? 2000000000 : 1000000000,
              memory_byte: inst.instance_id.startsWith('geo-') ? 2147483648 : 536870912
            },
            connections: {}
          }
        : null
    )
  )
})
app.post('/api/instances', (_req, res) => res.json(response(null)))
app.post('/api/instances/:id/start', (req, res) => {
  const inst = instances.find((item) => item.instance_id === req.params.id)
  if (inst) inst.start = true
  res.json(response(null))
})
app.post('/api/instances/:id/stop', (req, res) => {
  const inst = instances.find((item) => item.instance_id === req.params.id)
  if (inst) inst.start = false
  res.json(response(null))
})
app.delete('/api/instances/:id', (_req, res) => res.json(response(null)))

app.get('/api/link/', (_req, res) => res.json(response(links)))
app.get('/api/link/:nodeIndex/:linkId', (req, res) => {
  const link = links.find((item) => item.link_id === req.params.linkId)
  res.json(response(link))
})
app.get('/api/links', (_req, res) => res.json(response(links)))
app.get('/api/links/:nodeIndex', (_req, res) => res.json(response(links)))
app.post('/api/links', (_req, res) => res.json(response(null)))
app.delete('/api/links/:id', (_req, res) => res.json(response(null)))
app.get('/api/link/parameter', (_req, res) => res.json(response(getLinkParametersMap())))

app.get('/api/resource/last/instance/all', (_req, res) => res.json(response(instanceResources)))
app.get('/api/resource/last/instance/:instanceId', (req, res) =>
  res.json(response({ [req.params.instanceId]: instanceResources[req.params.instanceId] }))
)
app.get('/api/resource/last/link/all', (_req, res) => res.json(response(linkResources)))
app.get('/api/resource/last/link/:linkId', (req, res) =>
  res.json(response({ [req.params.linkId]: linkResources[req.params.linkId] }))
)
app.get('/api/resource/last/node/all', (_req, res) => res.json(response(nodeResources)))
app.get('/api/resource/last/node/:nodeIndex', (req, res) =>
  res.json(response({ [req.params.nodeIndex]: nodeResources[0] }))
)

app.get('/api/resource/period/instance/all', (_req, res) => {
  const data = {}
  instances.forEach((inst) => {
    data[inst.instance_id] = generatePeriodData()
  })
  res.json(response(data))
})
app.get('/api/resource/period/instance/:instanceId', (req, res) => {
  res.json(response({ [req.params.instanceId]: generatePeriodData() }))
})

app.get('/api/position/all', (_req, res) => res.json(response(positions)))

app.get('/api/emulation/', (_req, res) =>
  res.json(
    response({
      instance_type_config: {
        satellite: {
          image: 'opensn/satellite-router:latest',
          envs: {},
          resource_limit: { nano_cpu: 1000000000, memory_byte: 536870912 }
        },
        'ground-station': {
          image: 'opensn/ground-station:latest',
          envs: {},
          resource_limit: { nano_cpu: 2000000000, memory_byte: 1073741824 }
        }
      },
      running: emulationRunning
    })
  )
)
app.post('/api/emulation/start', (_req, res) => {
  emulationRunning = true
  res.json(response({ running: emulationRunning }))
})
app.post('/api/emulation/stop', (_req, res) => {
  emulationRunning = false
  res.json(response({ running: emulationRunning }))
})
app.post('/api/emulation/reset', (_req, res) => {
  emulationRunning = false
  res.json(response({ running: emulationRunning }))
})
app.post('/api/emulation/topology', (_req, res) => res.json(response(null)))

app.get('/api/faults', (req, res) => {
  const status = req.query.status
  const filtered = status ? faults.filter((item) => item.status === status) : faults
  res.json(response(filtered))
})
app.get('/api/faults/history', (_req, res) => res.json(response(faults)))
app.post('/api/faults/inject', (req, res) => {
  const fault = {
    fault_id: `fault-${Date.now()}`,
    ...req.body,
    status: 'active',
    created_at: new Date().toISOString()
  }
  faults.push(fault)
  generateRandomResources()
  res.json(response(fault))
})
app.post('/api/faults/:id/resolve', (req, res) => {
  const fault = faults.find((item) => item.fault_id === req.params.id)
  if (fault) {
    fault.status = 'resolved'
    fault.resolved_at = new Date().toISOString()
  }
  generateRandomResources()
  res.json(response(fault))
})

app.get('/api/satellites/:id/status', (req, res) => {
  const position = positions[req.params.id]
  res.json(
    response({
      satellite_id: req.params.id,
      status: 'online',
      mode: req.params.id.startsWith('geo-') ? 'control' : 'normal',
      attitude: { pitch: 0.3, yaw: 0.6, roll: -0.2 },
      power: { battery_percent: req.params.id.startsWith('geo-') ? 91 : 84, solar_panel_active: true, power_mode: 'full' },
      communication: { band: req.params.id.startsWith('geo-') ? 'Ka' : 'Ku', frequency_ghz: req.params.id.startsWith('geo-') ? 26.5 : 14.2, power_dbm: 30 },
      thermal: { internal_temp_c: req.params.id.startsWith('geo-') ? 29 : 24, external_temp_c: -45 },
      payloads: [
        { id: 'payload-001', name: '主载荷', status: 'on' },
        { id: 'payload-002', name: '诊断载荷', status: 'standby' }
      ],
      position
    })
  )
})
app.put('/api/satellites/:id/mode', (req, res) => res.json(response({ mode: req.body.mode })))
app.put('/api/satellites/:id/attitude', (_req, res) => res.json(response(null)))
app.put('/api/satellites/:id/power', (_req, res) => res.json(response(null)))
app.put('/api/satellites/:id/band', (_req, res) => res.json(response(null)))
app.put('/api/satellites/:id/antenna', (_req, res) => res.json(response(null)))
app.put('/api/satellites/:id/payloads/:pid', (_req, res) => res.json(response(null)))
app.post('/api/satellites/:id/thrust', (_req, res) => res.json(response(null)))
app.post('/api/satellites/:id/reset', (_req, res) => res.json(response(null)))
app.get('/api/v1/state/:id', (req, res) => res.json(response(getGodNodeState(req.params.id))))
app.post('/api/v1/actions', (req, res) => {
  res.json(
    response({
      action_id: `act-${Date.now()}`,
      status: 'accepted',
      message: `已受理 ${req.body?.satellite_id || 'unknown'} 的 ${req.body?.action_type || 'unknown'} 指令`
    })
  )
})
app.post('/api/v1/links', (req, res) => res.json(response(queryGodNodeLinks(req.body || {}))))

app.get('/api/agents', (_req, res) => {
  res.json(
    response({
      coordinator: {
        status: 'online',
        model: llmConfig.coordinator.model,
        provider: getApiKey('coordinator') ? 'real-llm' : 'mock',
        active_tasks: 1
      },
      specialists: [
        { name: '网络专家', status: 'online', pending_actions: 0, model: llmConfig.specialist_network.model },
        { name: '健康专家', status: 'online', pending_actions: 0 },
        { name: '运维专家', status: 'online', pending_actions: 0 }
      ],
      edge_agents: instances
        .filter((item) => item.type === 'satellite')
        .slice(0, 6)
        .map((item) => ({ satellite_id: item.instance_id, status: 'online', last_heartbeat: new Date().toISOString() }))
    })
  )
})

app.post('/api/agents/chat', async (req, res) => {
  try {
    const result = await satOpsAgentRuntime.chat({
      message: req.body.message,
      history: req.body.history || []
    })
    res.json(response(result))
    return
  } catch (error) {
    console.error('[LLM] /api/agents/chat fallback:', error.message)
  }

  res.json(response(generateAgentReply(req.body.message)))
})
app.get('/api/agents/tasks', (_req, res) => res.json(response([])))
app.get('/api/agents/tasks/:id', (req, res) => res.json(response({ task_id: req.params.id, status: 'running' })))
app.post('/api/agents/tasks/:id/approve', (_req, res) => res.json(response(null)))
app.post('/api/agents/tasks/:id/cancel', (_req, res) => res.json(response(null)))
app.get('/api/agents/config', (_req, res) => res.json(response({})))
app.put('/api/agents/config', (_req, res) => res.json(response(null)))

app.post('/api/agents/coordinator/chat', async (req, res) => {
  const traceId = req.body.trace_id || `tr-${Date.now()}`
  let planHint = ''

  try {
    const llmText = await callOpenAICompatible(
      'coordinator',
      req.body.message,
      [],
      `${buildSystemPrompt()} 请把用户任务拆成一句简短的排障意图总结。`
    )
    if (llmText) {
      planHint = llmText.slice(0, 240)
    }
  } catch (error) {
    console.error('[LLM] /api/agents/coordinator/chat fallback:', error.message)
  }

  if (!traces[traceId]) {
    traces[traceId] = {
      trace_id: traceId,
      current_phase: 'plan',
      plan: [
        { task: '解析用户问题', assignee: '协调器', status: 'completed' },
        { task: '查询 GEO 骨干链路', assignee: '网络专家', status: 'running' },
        { task: '收集边界站日志', assignee: '运维专家', status: 'pending' }
      ],
      final_review: null
    }
    blackboards[traceId] = {
      trace_id: traceId,
      findings: {
        accepted_message: req.body.message,
        llm_plan_hint: planHint || '等待协调器进一步规划',
        network_status: 'collecting',
        leo_constellation: 'Walker Delta 55°: 15/3/f',
        log_pointer: '/tmp/trace_tr-12345.csv'
      },
      updated_at: new Date().toISOString()
    }
  }
  res.json(
    response({
      trace_id: traceId,
      status: 'planning',
      message: '已受理，正在拆解子任务...'
    })
  )
})

app.get('/api/agents/trace/:traceId', (req, res) =>
  res.json(response(traces[req.params.traceId] || traces['tr-12345']))
)
app.get('/api/blackboard/:traceId', (req, res) =>
  res.json(response(blackboards[req.params.traceId] || blackboards['tr-12345']))
)
app.get('/api/sandbox/files', (req, res) => {
  const path = req.query.path
  res.json(response(sandboxFiles[path] || { path, mime_type: 'text/plain', content: 'No content' }))
})
app.get('/api/approval/pending', (_req, res) =>
  res.json(response(approvals.filter((item) => item.status === 'pending')))
)
app.post('/api/approval/:requestId/decision', (req, res) => {
  const approval = approvals.find((item) => item.request_id === req.params.requestId)
  if (approval) approval.status = req.body.decision === 'approve' ? 'approved' : 'rejected'
  res.json(response(null))
})

app.get('/api/workflows', (_req, res) => res.json(response([])))
app.post('/api/workflows', (_req, res) => res.json(response({ workflow_id: `wf-${Date.now()}` })))
app.get('/api/workflows/:id', (req, res) =>
  res.json(response({ workflow_id: req.params.id, name: '示例工作流', status: 'ready', steps: [] }))
)
app.delete('/api/workflows/:id', (_req, res) => res.json(response(null)))
app.post('/api/workflows/:id/execute', (_req, res) =>
  res.json(response({ execution_id: `exec-${Date.now()}`, status: 'running' }))
)
app.get('/api/workflows/executions/:execId', (req, res) =>
  res.json(response({ execution_id: req.params.execId, status: 'running' }))
)
app.post('/api/workflows/executions/:execId/cancel', (_req, res) => res.json(response(null)))
app.get('/api/workflows/templates', (_req, res) => res.json(response([])))
app.post('/api/workflows/templates/:id/instantiate', (_req, res) =>
  res.json(response({ workflow_id: `wf-${Date.now()}` }))
)

app.get('/api/llm/status', (_req, res) => {
  res.json(
    response({
      vllm: {
        status: getApiKey('coordinator') ? 'online' : 'mock',
        model: llmConfig.coordinator.model,
        endpoint: llmConfig.coordinator.endpoint,
        provider: getApiKey('coordinator') ? 'real-llm' : 'mock'
      },
      llamacpp: { status: 'online', model: 'Qwen2.5-3B', instances: 3 },
      executorch: { status: 'online', model: 'anomaly-v1', instances: 18 }
    })
  )
})
app.get('/api/llm/config', (_req, res) => res.json(response(llmConfig)))
app.put('/api/llm/config', (req, res) => {
  Object.assign(llmConfig, req.body || {})
  res.json(response(null))
})
app.post('/api/llm/test', async (req, res) => {
  const role = req.body?.role === 'specialist_network' ? 'specialist_network' : 'coordinator'
  const roleConfig = llmConfig[role] || {}

  try {
    const reply = await callOpenAICompatible(
      role,
      '请用一句中文确认你已成功接入 SatOps 模型探针。',
      [],
      '你是 SatOps 的模型连通性检测助手，只返回简短中文确认。'
    )

    if (reply) {
      return res.json(
        response({
          connected: true,
          provider: getApiKey(role) ? 'real-llm' : 'mock',
          model: roleConfig.model || '',
          endpoint: roleConfig.endpoint || '',
          reply
        })
      )
    }
  } catch (error) {
    console.error('[LLM] /api/llm/test fallback:', error.message)
  }

  return res.json(
    response({
      connected: false,
      provider: 'mock',
      model: roleConfig.model || '',
      endpoint: roleConfig.endpoint || '',
      reply: '当前未连到真实模型，已切换为本地模拟响应。'
    })
  )
})
app.post('/api/llm/generate', (_req, res) => res.json(response({ output: '生成的文本内容' })))

app.post('/api/applications/remote-sensing/task', (req, res) =>
  res.json(response({ task_id: `rs-${Date.now()}`, status: 'accepted', ...req.body }))
)
app.post('/api/applications/fast-line', (req, res) =>
  res.json(response({ line_id: `fl-${Date.now()}`, status: 'provisioning', ...req.body }))
)
app.get('/api/applications/a2a/negotiations', (_req, res) => {
  res.json(
    response([
      {
        negotiation_id: 'a2a-neg-001',
        type: 'federated_diagnosis',
        status: 'consensus_reached',
        participating_agents: ['geo-001', 'geo-002', 'geo-003'],
        result: '已确认 GEO 骨干状态稳定，中心主控站继续维持全局路由策略。'
      }
    ])
  )
})

app.get('/api/security/audit', (_req, res) => {
  res.json(
    response([
      {
        log_id: 'audit-001',
        timestamp: new Date().toISOString(),
        user: 'admin',
        action: 'topology_review',
        target: 'walker-delta-15-3-f',
        result: 'success',
        details: {},
        ip_address: '192.168.1.100'
      }
    ])
  )
})
app.get('/api/security/access', (_req, res) => res.json(response({ allowed: true })))
app.post('/api/security/credentials/rotate', (_req, res) => res.json(response(null)))
app.post('/api/security/scan', (_req, res) => res.json(response({ vulnerabilities: [] })))

app.post('/api/data/collect', (_req, res) => res.json(response(null)))
app.post('/api/data/compress', (_req, res) => res.json(response(null)))
app.post('/api/data/downlink', (_req, res) => res.json(response(null)))
app.get('/api/models', (_req, res) => res.json(response([])))
app.post('/api/models/upload', (_req, res) => res.json(response(null)))
app.post('/api/models/deploy', (_req, res) => res.json(response(null)))

app.get('/api/files', (_req, res) => res.json(response([])))
app.post('/api/files/upload', (_req, res) => res.json(response(null)))
app.get('/api/files/:id', (_req, res) => res.json(response(null)))
app.delete('/api/files/:id', (_req, res) => res.json(response(null)))

app.get('/api/database/items', (_req, res) => res.json(response({})))
app.post('/api/database/update', (_req, res) => res.json(response(null)))
app.post('/api/database/delete', (_req, res) => res.json(response(null)))

app.listen(8080, () => console.log('Mock API server running on http://localhost:8080'))
