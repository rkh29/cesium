# SatOps Mock 数据设计

> 版本: 1.0  
> 日期: 2026-03-01  
> 用途: 前端独立开发、接口测试

---

## 一、快速开始

### 1.1 启动 Mock 服务器

```bash
# 方式一：Node.js
cd frontend
npm install express cors ws
node mock-server.cjs

# 方式二：使用 msw (Mock Service Worker)
npm install msw --save-dev
npx msw init public/
```

### 1.2 Mock 服务器配置

```javascript
// mock.config.js
module.exports = {
  port: 8080,
  host: 'localhost',
  wsPort: 8080,
  updateInterval: 3000,  // 资源数据刷新间隔
  latency: 50,          // 模拟网络延迟(ms)
  errorRate: 0.01       // 错误率
}
```

---

## 二、基础 Mock 数据

### 2.1 实例数据 (instances)

```javascript
const instances = [
  {
    instance_id: 'sat-001',
    name: '卫星节点-001',
    type: 'satellite',
    start: true,
    node_index: 0,
    status: 'online',
    mode: 'normal'
  },
  {
    instance_id: 'sat-002',
    name: '卫星节点-002',
    type: 'satellite',
    start: true,
    node_index: 0,
    status: 'online',
    mode: 'normal'
  },
  {
    instance_id: 'sat-003',
    name: '卫星节点-003',
    type: 'satellite',
    start: true,
    node_index: 0,
    status: 'warning',
    mode: 'eco'
  },
  {
    instance_id: 'ground-001',
    name: '地面站-北京',
    type: 'ground-station',
    start: true,
    node_index: 0,
    status: 'online',
    mode: 'normal'
  },
  {
    instance_id: 'ground-002',
    name: '地面站-上海',
    type: 'ground-station',
    start: true,
    node_index: 0,
    status: 'online',
    mode: 'normal'
  }
]
```

### 2.2 实例详情数据 (instanceDetail)

```javascript
const instanceDetail = {
  'sat-001': {
    instance_id: 'sat-001',
    name: '卫星节点-001',
    type: 'satellite',
    image: 'opensn/satellite-router:v1.2.0',
    start: true,
    node_index: 0,
    resource_limit: {
      nano_cpu: 1000000000,
      memory_byte: 536870912
    },
    connections: {
      'link-001': {
        link_id: 'link-001',
        instance_id: 'sat-002',
        instance_type: 'satellite',
        end_node_index: 0
      },
      'link-003': {
        link_id: 'link-003',
        instance_id: 'ground-001',
        instance_type: 'ground-station',
        end_node_index: 0
      }
    },
    position: {
      latitude: 39.9042,
      longitude: 116.4074,
      altitude: 550000
    }
  }
}
```

### 2.3 链路数据 (links)

```javascript
const links = [
  {
    link_id: 'link-001',
    type: 'isl',
    enable: true,
    connect_instance: ['sat-001', 'sat-002'],
    node_index: 0
  },
  {
    link_id: 'link-002',
    type: 'isl',
    enable: true,
    connect_instance: ['sat-002', 'sat-003'],
    node_index: 0
  },
  {
    link_id: 'link-003',
    type: 'gsl',
    enable: true,
    connect_instance: ['sat-001', 'ground-001'],
    node_index: 0
  },
  {
    link_id: 'link-004',
    type: 'gsl',
    enable: false,
    connect_instance: ['sat-002', 'ground-002'],
    node_index: 0
  }
]
```

### 2.4 链路参数 (linkParameters)

```javascript
const linkParameters = {
  'link-001': {
    connect: 1,
    latency_ms: 12,
    jitter_ms: 2,
    loss_rate: 0.001,
    bandwidth_mbps: 100
  },
  'link-002': {
    connect: 1,
    latency_ms: 15,
    jitter_ms: 3,
    loss_rate: 0.002,
    bandwidth_mbps: 80
  },
  'link-003': {
    connect: 1,
    latency_ms: 8,
    jitter_ms: 1,
    loss_rate: 0.0005,
    bandwidth_mbps: 200
  },
  'link-004': {
    connect: 0,
    latency_ms: 0,
    jitter_ms: 0,
    loss_rate: 1,
    bandwidth_mbps: 0
  }
}
```

### 2.5 节点数据 (nodes)

```javascript
const nodes = [
  {
    node_index: 0,
    free_instance: 395,
    is_master_node: true,
    l_3_addr_v_4: '192.168.1.100',
    l_3_addr_v_6: '::1',
    l_2_addr: '00:00:00:00:00:01'
  },
  {
    node_index: 1,
    free_instance: 498,
    is_master_node: false,
    l_3_addr_v_4: '192.168.1.101',
    l_3_addr_v_6: '::2',
    l_2_addr: '00:00:00:00:00:02'
  }
]
```

### 2.6 位置数据 (positions)

```javascript
const positions = {
  'sat-001': {
    latitude: 39.9042,
    longitude: 116.4074,
    altitude: 550000
  },
  'sat-002': {
    latitude: 35.8617,
    longitude: 119.4556,
    altitude: 550000
  },
  'sat-003': {
    latitude: 31.2304,
    longitude: 121.4737,
    altitude: 550000
  },
  'ground-001': {
    latitude: 39.9042,
    longitude: 116.4074,
    altitude: 50
  },
  'ground-002': {
    latitude: 31.2304,
    longitude: 121.4737,
    altitude: 50
  }
}
```

---

## 三、动态 Mock 数据

### 3.1 实例资源 (instanceResources)

```javascript
// 生成函数
function generateInstanceResource(instanceId) {
  return {
    cpu_usage: Math.random() * 100,
    mem_byte: Math.random() * 4 * 1024 * 1024 * 1024,
    swap_mem_byte: Math.random() * 512 * 1024 * 1024
  }
}

// 示例数据
const instanceResources = {
  'sat-001': { cpu_usage: 45.2, mem_byte: 2147483648, swap_mem_byte: 536870912 },
  'sat-002': { cpu_usage: 32.8, mem_byte: 1879048192, swap_mem_byte: 268435456 },
  'sat-003': { cpu_usage: 78.5, mem_byte: 3221225472, swap_mem_byte: 805306368 }
}
```

### 3.2 链路资源 (linkResources)

```javascript
// 生成函数
function generateLinkResource(linkId) {
  const baseBps = 50_000_000 + Math.random() * 100_000_000
  return {
    recv_bps: baseBps,
    send_bps: baseBps * (0.8 + Math.random() * 0.4),
    recv_pps: Math.floor(50_000 + Math.random() * 50_000),
    send_pps: Math.floor(45_000 + Math.random() * 45_000),
    recv_err_pps: Math.floor(Math.random() * 5),
    send_err_pps: Math.floor(Math.random() * 5),
    recv_drop_pps: Math.floor(Math.random() * 10),
    send_drop_pps: Math.floor(Math.random() * 10)
  }
}

// 示例数据
const linkResources = {
  'link-001': {
    recv_bps: 85000000,
    send_bps: 78000000,
    recv_pps: 65000,
    send_pps: 58000,
    recv_err_pps: 2,
    send_err_pps: 1,
    recv_drop_pps: 5,
    send_drop_pps: 3
  }
}
```

### 3.3 节点资源 (nodeResources)

```javascript
const nodeResources = {
  0: {
    cpu_usage: 35.5,
    mem_byte: 8589934592,
    swap_mem_byte: 1073741824
  },
  1: {
    cpu_usage: 28.3,
    mem_byte: 6442450944,
    swap_mem_byte: 536870912
  }
}
```

### 3.4 历史资源数据

```javascript
function generatePeriodResource(instanceId, minutes = 10) {
  const now = Date.now()
  const data = []
  for (let i = minutes; i >= 0; i--) {
    data.push({
      Time: new Date(now - i * 60000).toISOString(),
      cpu_usage: 30 + Math.random() * 40,
      mem_byte: 2_000_000_000 + Math.random() * 2_000_000_000,
      swap_mem_byte: 200_000_000 + Math.random() * 400_000_000
    })
  }
  return data
}
```

---

## 四、故障注入 Mock

### 4.1 故障列表

```javascript
const faults = [
  {
    fault_id: 'fault-001',
    type: 'link_loss',
    target: 'link-001',
    status: 'active',
    parameters: { loss_rate: 5, duration_seconds: 600 },
    created_at: '2026-03-01T10:00:00Z'
  },
  {
    fault_id: 'fault-002',
    type: 'link_delay',
    target: 'link-002',
    status: 'resolved',
    parameters: { delay_ms: 50, jitter_ms: 10 },
    created_at: '2026-03-01T09:30:00Z',
    resolved_at: '2026-03-01T09:45:00Z'
  }
]
```

### 4.2 故障类型模板

```javascript
const faultTemplates = {
  link_loss: {
    name: '链路丢包',
    parameters: [
      { key: 'loss_rate', label: '丢包率(%)', type: 'number', min: 0, max: 100, default: 5 },
      { key: 'duration_seconds', label: '持续时间(秒)', type: 'number', default: 300 }
    ]
  },
  link_delay: {
    name: '链路延迟',
    parameters: [
      { key: 'delay_ms', label: '延迟(ms)', type: 'number', default: 50 },
      { key: 'jitter_ms', label: '抖动(ms)', type: 'number', default: 10 }
    ]
  },
  link_down: {
    name: '链路中断',
    parameters: []
  },
  node_offline: {
    name: '节点离线',
    parameters: []
  },
  resource_exhaustion: {
    name: '资源耗尽',
    parameters: [
      { key: 'resource_type', label: '资源类型', type: 'select', options: ['cpu', 'memory', 'bandwidth'] },
      { key: 'percentage', label: '占用率(%)', type: 'number', min: 0, max: 100, default: 95 }
    ]
  }
}
```

---

## 五、卫星操作 Mock

### 5.1 卫星状态

```javascript
const satelliteStatus = {
  'sat-001': {
    satellite_id: 'sat-001',
    status: 'online',
    mode: 'normal',
    attitude: {
      pitch: 0.5,
      yaw: 1.2,
      roll: -0.3
    },
    power: {
      battery_percent: 85,
      solar_panel_active: true,
      power_mode: 'full',
      consumption_watts: 150
    },
    communication: {
      band: 'Ka',
      frequency_ghz: 26.5,
      power_dbm: 30,
      antenna_pointing: {
        target_lat: 39.9,
        target_lon: 116.4
      }
    },
    payloads: [
      { id: 'payload-001', name: '主载荷', status: 'on' },
      { id: 'payload-002', name: '备用载荷', status: 'standby' }
    ],
    thermal: {
      internal_temp_c: 25,
      external_temp_c: -50
    }
  }
}
```

### 5.2 运行模式

```javascript
const modes = ['normal', 'eco', 'safe', 'emergency']

const modeDescriptions = {
  normal: '正常运行，全功能开启',
  eco: '节能模式，降低功耗',
  safe: '安全模式，基本通信和姿态控制',
  emergency: '紧急模式，最小化能耗'
}
```

---

## 六、Agent 系统 Mock

### 6.1 Agent 状态

```javascript
const agentStatus = {
  coordinator: {
    status: 'online',
    model: 'Qwen2.5-72B',
    provider: 'vllm',
    last_activity: '2026-03-01T10:30:00Z',
    active_tasks: 2
  },
  specialists: [
    { name: 'network', status: 'online', model: 'shared', pending_actions: 0 },
    { name: 'health', status: 'online', model: 'shared', pending_actions: 1 },
    { name: 'data', status: 'online', model: 'shared', pending_actions: 0 },
    { name: 'ops', status: 'online', model: 'shared', pending_actions: 0 },
    { name: 'security', status: 'online', model: 'shared', pending_actions: 0 }
  ],
  edge_agents: [
    { satellite_id: 'sat-001', status: 'online', model: 'ExecuTorch', last_heartbeat: '2026-03-01T10:30:00Z' },
    { satellite_id: 'sat-002', status: 'online', model: 'ExecuTorch', last_heartbeat: '2026-03-01T10:29:55Z' },
    { satellite_id: 'sat-003', status: 'warning', model: 'ExecuTorch', last_heartbeat: '2026-03-01T10:28:00Z' }
  ]
}
```

### 6.2 Agent 对话响应

```javascript
const agentChatResponses = {
  network_query: {
    response: '当前网络状态良好。共检测到 3 个卫星节点和 2 个地面站。所有 4 条链路中，3 条正常工作，1 条已断开。建议检查 link-004 的连接状态。',
    actions_taken: [
      { tool: 'link_list', result: 'success' }
    ],
    suggestions: [
      '建议检查 link-004 的连接状态',
      '建议定期监控链路质量指标'
    ],
    pending_approvals: []
  },
  fault_scenario: {
    response: '我理解您想在 link-001 上注入 5% 的丢包故障。这需要您的确认才能执行。',
    actions_taken: [],
    suggestions: [],
    pending_approvals: [
      {
        id: 'approval-001',
        action: 'fault_inject',
        target: 'link-001',
        parameters: { type: 'link_loss', loss_rate: 5 },
        security_level: 'L2'
      }
    ]
  }
}
```

### 6.3 Agent 任务

```javascript
const agentTasks = [
  {
    task_id: 'task-001',
    agent_type: 'coordinator',
    description: '分析链路质量并优化路由',
    status: 'running',
    created_at: '2026-03-01T10:00:00Z',
    progress: 0.6,
    actions: [
      { tool: 'link_list', status: 'completed', result: {} },
      { tool: 'qos_get', status: 'completed', result: {} },
      { tool: 'route_optimize', status: 'running', result: null }
    ]
  },
  {
    task_id: 'task-002',
    agent_type: 'health',
    description: '检测 sat-003 异常状态',
    status: 'pending',
    created_at: '2026-03-01T10:15:00Z',
    progress: 0,
    actions: []
  }
]
```

---

## 七、工作流 Mock

### 7.1 工作流列表

```javascript
const workflows = [
  {
    workflow_id: 'wf-001',
    name: '链路故障恢复流程',
    status: 'ready',
    steps_count: 5,
    created_at: '2026-03-01T09:00:00Z'
  },
  {
    workflow_id: 'wf-002',
    name: '卫星节能模式切换',
    status: 'ready',
    steps_count: 3,
    created_at: '2026-03-01T09:30:00Z'
  }
]
```

### 7.2 工作流详情

```javascript
const workflowDetail = {
  'wf-001': {
    workflow_id: 'wf-001',
    name: '链路故障恢复流程',
    description: '自动检测并恢复链路故障',
    status: 'ready',
    steps: [
      {
        id: 'step-1',
        name: '检测链路状态',
        tool: 'link_list',
        params: {}
      },
      {
        id: 'step-2',
        name: '识别异常链路',
        tool: 'link_analyze',
        params: {},
        condition: 'link.loss_rate > 5'
      },
      {
        id: 'step-3',
        name: '切换频段',
        tool: 'sat_band_switch',
        params: { band: 'Ku' },
        condition: 'link.loss_rate > 10'
      },
      {
        id: 'step-4',
        name: '重启链路',
        tool: 'link_restart',
        params: {},
        condition: 'link.status == "down"'
      },
      {
        id: 'step-5',
        name: '验证恢复',
        tool: 'link_test',
        params: { duration_seconds: 10 }
      }
    ],
    created_at: '2026-03-01T09:00:00Z'
  }
}
```

### 7.3 工作流模板

```javascript
const workflowTemplates = [
  {
    template_id: 'tpl-001',
    name: '标准故障恢复模板',
    description: '自动检测并恢复常见故障',
    category: 'recovery'
  },
  {
    template_id: 'tpl-002',
    name: '节能模式模板',
    description: '在电力不足时自动切换节能模式',
    category: 'optimization'
  },
  {
    template_id: 'tpl-003',
    name: '数据下传模板',
    description: '定时数据收集和下传流程',
    category: 'data'
  }
]
```

---

## 八、LLM 服务 Mock

### 8.1 LLM 状态

```javascript
const llmStatus = {
  vllm: {
    status: 'online',
    model: 'Qwen/Qwen2.5-72B-Instruct',
    gpu_memory_used_gb: 45,
    gpu_memory_total_gb: 80,
    requests_per_minute: 15,
    avg_latency_ms: 120
  },
  llamacpp: {
    status: 'online',
    model: 'Qwen/Qwen2.5-3B-Instruct-GGUF',
    instances: [
      { satellite_id: 'sat-group-geo-001', status: 'online', memory_mb: 1800 }
    ]
  },
  executorch: {
    status: 'online',
    model: 'anomaly-v1',
    instances: 5,
    avg_inference_ms: 15
  }
}
```

---

## 九、安全审计 Mock

### 9.1 审计日志

```javascript
const auditLogs = [
  {
    log_id: 'audit-001',
    timestamp: '2026-03-01T10:00:00Z',
    user: 'admin',
    action: 'sat_band_switch',
    target: 'sat-001',
    result: 'success',
    details: { from_band: 'Ka', to_band: 'Ku' },
    ip_address: '192.168.1.100'
  },
  {
    log_id: 'audit-002',
    timestamp: '2026-03-01T10:05:00Z',
    user: 'operator',
    action: 'fault_inject',
    target: 'link-001',
    result: 'success',
    details: { type: 'link_loss', loss_rate: 5 },
    ip_address: '192.168.1.101'
  },
  {
    log_id: 'audit-003',
    timestamp: '2026-03-01T10:10:00Z',
    user: 'agent',
    action: 'sat_mode_change',
    target: 'sat-003',
    result: 'success',
    details: { from_mode: 'normal', to_mode: 'eco' },
    ip_address: 'system'
  }
]
```

---

## 十、WebSocket Mock

### 10.1 连接模拟

```javascript
// 模拟 WebSocket 连接
const mockWs = {
  send: (message) => console.log('WS Send:', message),
  onmessage: null,
  onopen: null,
  onclose: null,
  onerror: null
}

// 模拟服务器推送
function simulatePush(channel, type, data) {
  const message = JSON.stringify({
    channel,
    type,
    data,
    timestamp: new Date().toISOString()
  })
  if (mockWs.onmessage) {
    mockWs.onmessage({ data: message })
  }
}
```

### 10.2 定时推送

```javascript
// 资源更新推送 (每 3 秒)
setInterval(() => {
  simulatePush('resources', 'instance', generateAllInstanceResources())
  simulatePush('resources', 'link', generateAllLinkResources())
}, 3000)

// 告警推送 (随机)
setInterval(() => {
  if (Math.random() > 0.9) {
    simulatePush('alerts', 'new', {
      alert_id: `alert-${Date.now()}`,
      severity: ['info', 'warning', 'error'][Math.floor(Math.random() * 3)],
      message: '示例告警消息',
      source: instances[Math.floor(Math.random() * instances.length)].instance_id
    })
  }
}, 10000)
```

---

## 十一、前端开发指南

### 11.1 使用 Mock 数据

```typescript
// src/api/mock.ts
import { instances, links, agentStatus } from './mock-data'

export const mockApi = {
  getInstances: () => Promise.resolve({ code: 0, data: instances }),
  getLinks: () => Promise.resolve({ code: 0, data: links }),
  getAgentStatus: () => Promise.resolve({ code: 0, data: agentStatus })
}
```

### 11.2 环境切换

```typescript
// src/api/index.ts
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export const api = USE_MOCK ? mockApi : realApi
```

### 11.3 .env 配置

```bash
# .env.development
VITE_USE_MOCK=true
VITE_API_BASE_URL=http://localhost:8080

# .env.production
VITE_USE_MOCK=false
VITE_API_BASE_URL=https://api.satops.example.com
```

---

## 十二、Mock Server 完整代码

```javascript
// mock-server.cjs
const express = require('express')
const cors = require('cors')
const { WebSocketServer } = require('ws')

const app = express()
app.use(cors())
app.use(express.json())

// ===== 数据定义 (使用上述 Mock 数据) =====
const instances = [ /* ... */ ]
const links = [ /* ... */ ]
const nodes = [ /* ... */ ]
const faults = [ /* ... */ ]
const agentStatus = { /* ... */ }
// ... 其他数据

// ===== 辅助函数 =====
const response = (data) => ({ code: 0, msg: 'success', data })
const errorResponse = (code, msg) => ({ code, msg, data: null })

// ===== 平台 API =====
app.get('/api/platform/status', (req, res) => 
  res.json(response({ status: 'ok', version: '1.0.0', uptime: 86400 })))
app.get('/api/platform/time', (req, res) => 
  res.json(response(Date.now().toString())))

// ===== 仿真控制 =====
app.get('/api/emulation/', (req, res) => res.json(response({
  running: true,
  instance_type_config: {
    satellite: { image: 'opensn/satellite-router:latest', resource_limit: { nano_cpu: 1e9, memory_byte: 512 * 1024 * 1024 } },
    'ground-station': { image: 'opensn/ground-station:latest', resource_limit: { nano_cpu: 2e9, memory_byte: 1024 * 1024 * 1024 } }
  }
})))
app.post('/api/emulation/start', (req, res) => res.json(response(null)))
app.post('/api/emulation/stop', (req, res) => res.json(response(null)))
app.post('/api/emulation/reset', (req, res) => res.json(response(null)))

// ===== 实例 API =====
app.get('/api/instances', (req, res) => res.json(response(instances)))
app.get('/api/instances/:id', (req, res) => {
  const inst = instances.find(i => i.instance_id === req.params.id)
  res.json(response(inst || null))
})
app.post('/api/instances/:id/start', (req, res) => res.json(response(null)))
app.post('/api/instances/:id/stop', (req, res) => res.json(response(null)))

// ===== 链路 API =====
app.get('/api/links', (req, res) => res.json(response(links)))
app.get('/api/link/parameter', (req, res) => res.json(response(linkParameters)))

// ===== 节点 API =====
app.get('/api/node/', (req, res) => res.json(response(nodes)))

// ===== 位置 API =====
app.get('/api/position/all', (req, res) => res.json(response(positions)))

// ===== 资源 API =====
app.get('/api/resource/last/instance/all', (req, res) => res.json(response(instanceResources)))
app.get('/api/resource/last/link/all', (req, res) => res.json(response(linkResources)))
app.get('/api/resource/last/node/all', (req, res) => res.json(response(nodeResources)))

// ===== 故障 API =====
app.get('/api/faults', (req, res) => res.json(response(faults)))
app.post('/api/faults/inject', (req, res) => {
  const fault = { fault_id: `fault-${Date.now()}`, ...req.body, status: 'active' }
  faults.push(fault)
  res.json(response(fault))
})
app.post('/api/faults/:id/resolve', (req, res) => {
  const fault = faults.find(f => f.fault_id === req.params.id)
  if (fault) fault.status = 'resolved'
  res.json(response(fault))
})

// ===== Agent API =====
app.get('/api/agents', (req, res) => res.json(response(agentStatus)))
app.get('/api/agents/tasks', (req, res) => res.json(response(agentTasks)))
app.post('/api/agents/chat', (req, res) => {
  const msg = req.body.message.toLowerCase()
  let reply = '收到您的指令。'
  if (msg.includes('网络') || msg.includes('状态')) {
    reply = agentChatResponses.network_query
  } else if (msg.includes('故障')) {
    reply = agentChatResponses.fault_scenario
  }
  res.json(response(reply))
})

// ===== 卫星操作 API =====
app.get('/api/satellites/:id/status', (req, res) => {
  res.json(response(satelliteStatus[req.params.id] || null))
})
app.put('/api/satellites/:id/mode', (req, res) => res.json(response({ mode: req.body.mode })))

// ===== 工作流 API =====
app.get('/api/workflows', (req, res) => res.json(response(workflows)))
app.post('/api/workflows/:id/execute', (req, res) => 
  res.json(response({ execution_id: `exec-${Date.now()}`, status: 'running' })))

// ===== LLM API =====
app.get('/api/llm/status', (req, res) => res.json(response(llmStatus)))

// ===== 安全 API =====
app.get('/api/security/audit', (req, res) => res.json(response(auditLogs)))

// ===== 启动服务器 =====
const server = app.listen(8080, () => {
  console.log('Mock API Server running at http://localhost:8080')
})

// WebSocket
const wss = new WebSocketServer({ server })
wss.on('connection', (ws) => {
  console.log('WebSocket connected')
  
  // 定时推送资源更新
  const interval = setInterval(() => {
    ws.send(JSON.stringify({
      channel: 'resources',
      type: 'instance',
      data: generateAllInstanceResources(),
      timestamp: new Date().toISOString()
    }))
  }, 3000)
  
  ws.on('close', () => clearInterval(interval))
  ws.on('message', (msg) => {
    const data = JSON.parse(msg)
    if (data.action === 'subscribe') {
      ws.send(JSON.stringify({ channel: 'system', type: 'subscribed', data: data.channels }))
    }
  })
})

function generateAllInstanceResources() {
  const resources = {}
  instances.forEach(inst => {
    resources[inst.instance_id] = {
      cpu_usage: Math.random() * 100,
      mem_byte: Math.random() * 4 * 1024 * 1024 * 1024,
      swap_mem_byte: Math.random() * 512 * 1024 * 1024
    }
  })
  return resources
}
```

---

## 附录：Mock 数据快速参考

| 数据类型 | 变量名 | 更新频率 |
|----------|--------|----------|
| 实例列表 | `instances` | 手动更新 |
| 链路列表 | `links` | 手动更新 |
| 节点列表 | `nodes` | 手动更新 |
| 实例资源 | `instanceResources` | 3秒 |
| 链路资源 | `linkResources` | 3秒 |
| 位置数据 | `positions` | 10秒 |
| Agent状态 | `agentStatus` | 手动更新 |
| 故障列表 | `faults` | 手动更新 |
| 审计日志 | `auditLogs` | 手动更新 |
