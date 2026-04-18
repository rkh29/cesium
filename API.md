# SatOps 前后端交互 API 设计

> 版本: 2.0  
> 日期: 2026-03-01  
> 基础路径: `/api`

---

## 一、前端页面结构

### 1.1 现有页面（保留）

| 页面 | 路由 | 说明 |
|------|------|------|
| 概览 | `/` | 3D可视化、仿真控制、运行状态 |
| 节点 | `/instances` | 卫星/地面站实例列表 |
| 节点详情 | `/instance/:node/:id` | 实例详情、资源监控、WebShell |
| 链路 | `/links` | 链路列表 |
| 链路详情 | `/link/:node/:id` | 链路详情、QoS配置 |
| 运行配置器 | `/topo-conf` | 拓扑配置 |
| 文件管理 | `/files` | 文件上传下载 |
| 部署机器 | `/cluster` | 集群节点管理 |
| 数据库 | `/database` | InfluxDB 数据查询 |

### 1.2 新增页面

| 页面 | 路由 | 说明 |
|------|------|------|
| Agent 对话 | `/agent` | 与 AI Agent 交互对话框 |
| 故障注入 | `/faults` | 故障注入管理（仅仿真） |
| 卫星操作 | `/satellite/:id` | 卫星姿态、电源、频段控制 |
| 工作流 | `/workflows` | 工作流编排与执行 |
| 安全审计 | `/security` | 审计日志、权限管理 |
| LLM 状态 | `/llm` | LLM 服务监控 |

---

## 二、通用规范

### 2.1 响应格式

**成功响应**:
```json
{ "code": 0, "msg": "success", "data": { ... } }
```

**错误响应**:
```json
{ "code": 1001, "msg": "Instance not found", "data": null }
```

### 2.2 错误码

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 1001 | 资源不存在 |
| 1002 | 参数错误 |
| 1003 | 权限不足 |
| 1004 | 操作超时 |
| 2001 | 仿真系统错误 |
| 2002 | 卫星通信错误 |
| 3001 | Agent 未就绪 |
| 3002 | LLM 推理错误 |

### 2.3 安全等级

| 等级 | 说明 | 前端处理 |
|------|------|----------|
| L0 | 只读 | 直接调用 |
| L1 | 低风险 | 调用+日志 |
| L2 | 中风险 | 弹窗确认 |
| L3 | 高风险 | 审批流程 |

### 2.4 适用范围

| 标识 | 说明 |
|------|------|
| 仿真 | 仅 OpenSN 数字孪生 |
| 真实 | 仅真实卫星集群 |
| 双向 | 仿真和真实均可 |

---

## 三、平台与仿真 API

### 3.1 平台状态

```
GET /api/platform/status
```
**响应**: `{ status, version, uptime }`

```
GET /api/platform/time
```
**响应**: 时间戳字符串

### 3.2 仿真控制

```
GET /api/emulation/
```
**响应**: `{ running, instance_type_config }`

```
POST /api/emulation/start     # L1 启动仿真
POST /api/emulation/stop      # L1 停止仿真
POST /api/emulation/reset     # L2 重置仿真
POST /api/emulation/topology  # L2 添加拓扑
```

**拓扑请求体**:
```json
{
  "instances": [{ "type": "satellite", "extra": {} }],
  "links": [{ "end_indexes": [0, 1], "type": "gsl" }]
}
```

### 3.3 位置数据

```
GET /api/position/all
```
**响应**: `{ "sat-001": { latitude, longitude, altitude }, ... }`

---

## 四、实例管理 API

### 4.1 实例列表

```
GET /api/instances
```
**查询参数**: `filter=all|active`, `type=satellite|ground-station`

**响应**:
```json
{
  "code": 0,
  "data": [
    {
      "instance_id": "sat-001",
      "name": "卫星节点-001",
      "type": "satellite",
      "start": true,
      "node_index": 0,
      "status": "online"
    }
  ]
}
```

### 4.2 实例详情

```
GET /api/instances/:id
GET /api/instance/:nodeIndex/:instanceId
```
**响应**:
```json
{
  "instance_id": "sat-001",
  "name": "卫星节点-001",
  "type": "satellite",
  "image": "opensn/satellite-router:latest",
  "start": true,
  "node_index": 0,
  "resource_limit": { "nano_cpu": 1000000000, "memory_byte": 536870912 },
  "connections": {
    "link-001": { "link_id": "link-001", "instance_id": "sat-002", "instance_type": "satellite" }
  }
}
```

### 4.3 实例操作

```
POST /api/instances           # L2 创建实例
DELETE /api/instances/:id     # L3 销毁实例
POST /api/instances/:id/start # L1 启动
POST /api/instances/:id/stop  # L2 停止
```

---

## 五、链路管理 API

### 5.1 链路列表

```
GET /api/links
GET /api/links/:nodeIndex
```
**响应**:
```json
[
  {
    "link_id": "link-001",
    "type": "isl",
    "enable": true,
    "connect_instance": ["sat-001", "sat-002"],
    "node_index": 0
  }
]
```

### 5.2 链路详情

```
GET /api/link/:nodeIndex/:linkId
```

### 5.3 链路参数

```
GET /api/link/parameter  # 获取所有链路参数
```
**响应**: `{ "link-001": { "connect": 1, ... }, ... }`

---

## 六、资源监控 API

### 6.1 实时资源

```
GET /api/resource/last/instance/all    # 所有实例资源
GET /api/resource/last/instance/:id    # 单实例资源
GET /api/resource/last/link/all        # 所有链路资源
GET /api/resource/last/node/all        # 所有节点资源
```

**实例资源响应**:
```json
{
  "sat-001": {
    "cpu_usage": 45.2,
    "mem_byte": 2147483648,
    "swap_mem_byte": 536870912
  }
}
```

**链路资源响应**:
```json
{
  "link-001": {
    "recv_bps": 50000000,
    "send_bps": 45000000,
    "recv_pps": 50000,
    "send_pps": 45000,
    "recv_err_pps": 0,
    "send_err_pps": 0
  }
}
```

### 6.2 历史资源

```
GET /api/resource/period/instance/:id?period=1h
```
**period**: `1m | 5m | 10m | 30m | 1h | 3h | 6h | 12h | 24h`

---

## 七、节点管理 API

```
GET /api/node/           # 节点列表
GET /api/node/:index     # 节点详情
GET /api/node/:index/ws  # WebShell 端点
```

---

## 八、故障注入 API（仅仿真）

> ⚠️ 仅限 OpenSN 仿真系统，禁止对真实卫星执行

### 8.1 故障列表

```
GET /api/faults?status=active|resolved
```
**响应**:
```json
[
  {
    "fault_id": "fault-001",
    "type": "link_loss",
    "target": "link-001",
    "status": "active",
    "parameters": { "loss_rate": 5 },
    "created_at": "2026-03-01T10:00:00Z"
  }
]
```

### 8.2 故障操作

```
POST /api/faults/inject      # L2 注入故障
POST /api/faults/:id/resolve # L1 解除故障
GET /api/faults/history      # 历史记录
```

**注入请求体**:
```json
{
  "type": "link_loss",
  "target": "link-001",
  "parameters": { "loss_rate": 5, "duration_seconds": 600 }
}
```

### 8.3 故障类型

| 类型 | 参数 | 说明 |
|------|------|------|
| `link_loss` | `loss_rate` (0-100) | 链路丢包 |
| `link_delay` | `delay_ms`, `jitter_ms` | 链路延迟 |
| `link_down` | - | 链路中断 |
| `node_offline` | - | 节点离线 |
| `resource_exhaustion` | `resource_type`, `percentage` | 资源耗尽 |

---

## 九、卫星操作 API

### 9.1 卫星状态

```
GET /api/satellites/:id/status
```
**响应**:
```json
{
  "satellite_id": "sat-001",
  "status": "online",
  "mode": "normal",
  "attitude": { "pitch": 0.5, "yaw": 1.2, "roll": -0.3 },
  "power": {
    "battery_percent": 85,
    "solar_panel_active": true,
    "power_mode": "full"
  },
  "communication": {
    "band": "Ka",
    "frequency_ghz": 26.5,
    "power_dbm": 30
  },
  "thermal": { "internal_temp_c": 25, "external_temp_c": -50 }
}
```

### 9.2 操作接口

| 接口 | 方法 | 安全等级 | 说明 |
|------|------|----------|------|
| `/api/satellites/:id/mode` | PUT | L2 | 设置运行模式 |
| `/api/satellites/:id/attitude` | PUT | L2 | 调整姿态 |
| `/api/satellites/:id/power` | PUT | L2 | 电源模式 |
| `/api/satellites/:id/band` | PUT | L1 | 频段切换 |
| `/api/satellites/:id/antenna` | PUT | L2 | 天线指向 |
| `/api/satellites/:id/payloads/:pid` | PUT | L2 | 载荷控制 |
| `/api/satellites/:id/thrust` | POST | L3 | 轨道机动 |
| `/api/satellites/:id/reset` | POST | L2 | 卫星复位 |

---

## 十、Agent 系统 API

### 10.1 Agent 状态

```
GET /api/agents
```
**响应**:
```json
{
  "coordinator": {
    "status": "online",
    "model": "Qwen2.5-72B",
    "provider": "vllm",
    "active_tasks": 2
  },
  "specialists": [
    { "name": "network", "status": "online", "pending_actions": 0 },
    { "name": "health", "status": "online", "pending_actions": 1 }
  ],
  "edge_agents": [
    { "satellite_id": "sat-001", "status": "online", "last_heartbeat": "..." }
  ]
}
```

### 10.2 Agent 对话

```
POST /api/agents/chat
```
**请求体**:
```json
{
  "agent_type": "coordinator",
  "message": "当前网络状态如何？",
  "context": { "target": "simulation" },
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```
**响应**:
```json
{
  "response": "当前网络状态良好，所有链路正常...",
  "actions_taken": [],
  "suggestions": ["建议定期检查链路质量"],
  "pending_approvals": []
}
```

### 10.3 Agent 任务

```
GET /api/agents/tasks?status=running
GET /api/agents/tasks/:id
POST /api/agents/tasks/:id/approve  # L2 审批
POST /api/agents/tasks/:id/cancel   # L1 取消
```

### 10.4 Agent 配置

```
GET /api/agents/config
PUT /api/agents/config  # L2
```

---

## 十一、工作流 API

### 11.1 工作流管理

```
GET /api/workflows
POST /api/workflows      # L1 创建
GET /api/workflows/:id
DELETE /api/workflows/:id
```

### 11.2 工作流执行

```
POST /api/workflows/:id/execute          # L1 执行
GET /api/workflows/executions/:execId    # 执行状态
POST /api/workflows/executions/:execId/cancel  # L2 取消
```

### 11.3 工作流模板

```
GET /api/workflows/templates
POST /api/workflows/templates/:id/instantiate
```

---

## 十二、LLM 服务 API

```
GET /api/llm/status   # LLM 服务状态
GET /api/llm/config   # LLM 配置
PUT /api/llm/config   # L2 更新配置
POST /api/llm/generate  # 推理
```

---

## 十三、数据传输 API

```
POST /api/data/collect    # L1 数据收集
POST /api/data/compress   # L1 数据压缩
POST /api/data/downlink   # L1 数据下传
GET /api/models           # 模型列表
POST /api/models/upload   # L2 上传模型
POST /api/models/deploy   # L2 部署模型
```

---

## 十四、安全管理 API

```
GET /api/security/audit   # 审计日志
GET /api/security/access  # 权限检查
POST /api/security/credentials/rotate  # L3 凭证轮换
POST /api/security/scan   # L2 安全扫描
```

---

## 十五、文件与数据库 API

### 15.1 文件管理

```
GET /api/files            # 文件列表
POST /api/files/upload    # 上传文件
GET /api/files/:id        # 下载文件
DELETE /api/files/:id     # 删除文件
```

### 15.2 数据库

```
GET /api/database/databases      # 数据库列表
GET /api/database/:db/measurements  # 测量列表
GET /api/database/:db/:measurement  # 查询数据
```

---

## 十六、WebSocket 实时推送

### 16.1 连接

```
ws://host:port/api/ws
```

### 16.2 订阅

```json
{ "action": "subscribe", "channels": ["resources", "alerts", "tasks"] }
```

### 16.3 消息格式

**资源更新**:
```json
{
  "channel": "resources",
  "type": "instance",
  "data": { "sat-001": { "cpu_usage": 45.2, ... } },
  "timestamp": "2026-03-01T10:00:00Z"
}
```

**告警通知**:
```json
{
  "channel": "alerts",
  "type": "new",
  "data": { "alert_id": "...", "severity": "warning", "message": "..." },
  "timestamp": "..."
}
```

**任务状态**:
```json
{
  "channel": "tasks",
  "type": "status_change",
  "data": { "task_id": "...", "status": "completed" },
  "timestamp": "..."
}
```

---

## 附录：接口汇总

| 模块 | 接口数 | 说明 |
|------|--------|------|
| 平台与仿真 | 6 | 平台状态、仿真控制 |
| 实例管理 | 6 | CRUD + 生命周期 |
| 链路管理 | 4 | 列表、详情、参数 |
| 资源监控 | 6 | 实时 + 历史 |
| 故障注入 | 4 | 仅仿真 |
| 卫星操作 | 9 | 姿态、电源、频段等 |
| Agent 系统 | 8 | 对话、任务、配置 |
| 工作流 | 7 | 编排与执行 |
| LLM 服务 | 4 | 状态与推理 |
| 数据传输 | 6 | 收集与模型管理 |
| 安全管理 | 4 | 审计与权限 |
| 文件数据库 | 6 | 文件与数据存储 |
| **总计** | **70+** | - |