const { createToolRegistry } = require('./tool-registry.cjs')
const { createQueryEngine } = require('./query-engine.cjs')

function round(value, digits = 2) {
  return Number(Number(value || 0).toFixed(digits))
}

function summarizeToolResult(tool, result) {
  if (tool === 'current_time') {
    return `${result.beijing_datetime} ${result.weekday_zh}`
  }
  if (tool === 'topology_summary') {
    return `${result.leo_satellites} LEO / ${result.geo_satellites} GEO / ${result.ground_stations} ground`
  }
  if (tool === 'active_faults') {
    return `${result.count} active faults`
  }
  if (tool === 'pending_approvals') {
    return `${result.count} pending approvals`
  }
  if (tool === 'llm_status') {
    return `${result.coordinator.model} @ ${result.coordinator.endpoint}`
  }
  if (tool === 'weakest_link') {
    if (!result.found) return 'no link data'
    return `${result.link_id} loss ${result.loss_rate_pct}% latency ${result.latency_ms} ms`
  }
  if (tool === 'hot_instances') {
    if (!Array.isArray(result) || !result.length) return 'no hot instances'
    return `${result[0].instance_id} cpu ${result[0].cpu_usage_pct}%`
  }
  if (tool === 'entity_lookup') {
    if (!result.found) return `not found: ${result.query}`
    return result.entity_type === 'link'
      ? `${result.link_id} ${result.enabled ? 'online' : 'offline'}`
      : `${result.instance_id} ${result.start ? 'running' : 'stopped'}`
  }
  return JSON.stringify(result)
}

function createSatOpsAgentRuntime(deps) {
  function getNowInfo() {
    const now = new Date()
    const formatter = new Intl.DateTimeFormat('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      weekday: 'long'
    })
    const parts = Object.fromEntries(
      formatter.formatToParts(now).map((item) => [item.type, item.value])
    )
    return {
      epoch_ms: now.getTime(),
      utc_iso: now.toISOString(),
      beijing_datetime: `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`,
      beijing_date: `${parts.year}-${parts.month}-${parts.day}`,
      beijing_time: `${parts.hour}:${parts.minute}:${parts.second}`,
      weekday_zh: parts.weekday,
      timezone: 'Asia/Shanghai',
      utc_offset: '+08:00'
    }
  }

  function getContext() {
    return {
      instances: deps.instances,
      links: deps.links,
      positions: deps.positions,
      instanceResources: deps.instanceResources,
      linkParameters: deps.getLinkParametersMap(),
      approvals: deps.approvals,
      faults: deps.faults,
      llmConfig: deps.llmConfig,
      apiKeys: {
        coordinator: deps.getApiKey('coordinator'),
        specialist_network: deps.getApiKey('specialist_network')
      }
    }
  }

  const toolRegistry = createToolRegistry({
    getNowInfo,
    getContext
  })
  const queryEngine = createQueryEngine({ toolRegistry })

  function renderTimeAnswer(nowInfo) {
    return [
      `北京时间：${nowInfo.beijing_datetime}（${nowInfo.timezone}）`,
      `UTC 时间：${nowInfo.utc_iso.replace('T', ' ').replace('Z', '')}`,
      `今天是：${nowInfo.weekday_zh}`
    ].join('\n')
  }

  function renderStatusAnswer(context, toolContext) {
    const topology = toolContext.topology_summary
    const faults = toolContext.active_faults
    const weakestLink = toolContext.weakest_link
    const hotInstances = toolContext.hot_instances || []
    const abnormalInstances = hotInstances.filter((item) => item.cpu_usage_pct > 75 || item.memory_gb > 6)

    const lines = []
    lines.push(
      `当前拓扑：${topology.leo_satellites} 颗 LEO、${topology.geo_satellites} 颗 GEO、${topology.ground_stations} 个地面站；运行实例 ${topology.running_instances}/${topology.instance_count}，可用链路 ${topology.enabled_links}/${topology.link_count}。`
    )

    if (faults.count > 0) {
      lines.push(`当前存在 ${faults.count} 个活动故障：${faults.faults.map((item) => `${item.target}(${item.type})`).join('，')}。`)
    } else {
      lines.push('当前没有注入中的活动故障。')
    }

    if (weakestLink?.found) {
      lines.push(
        `当前最弱链路是 ${weakestLink.link_id}（${weakestLink.endpoints.join(' -> ')}），丢包 ${weakestLink.loss_rate_pct}% ，时延 ${weakestLink.latency_ms} ms。`
      )
    }

    if (abnormalInstances.length) {
      lines.push(
        `资源侧需要关注 ${abnormalInstances.length} 个实例，最高负载为 ${abnormalInstances[0].instance_id}，CPU ${abnormalInstances[0].cpu_usage_pct}% ，内存 ${abnormalInstances[0].memory_gb} GB。`
      )
    } else if (hotInstances[0]) {
      lines.push(
        `当前资源最高负载实例为 ${hotInstances[0].instance_id}，CPU ${hotInstances[0].cpu_usage_pct}% ，内存 ${hotInstances[0].memory_gb} GB，尚未达到当前阈值。`
      )
    }

    if (!context.approvals.filter((item) => item.status === 'pending').length) {
      lines.push('当前没有待审批高风险动作。')
    }

    return lines.join('\n')
  }

  function renderLlmAnswer(toolContext) {
    const coordinator = toolContext.llm_status.coordinator
    const specialist = toolContext.llm_status.specialist_network
    return [
      `当前 coordinator 模型：${coordinator.model}`,
      `Endpoint：${coordinator.endpoint}`,
      `API Key 已配置：${coordinator.api_key_configured ? '是' : '否'}`,
      `当前 network specialist 模型：${specialist.model}`,
      `Specialist Endpoint：${specialist.endpoint}`,
      `Specialist API Key 已配置：${specialist.api_key_configured ? '是' : '否'}`
    ].join('\n')
  }

  function renderGeneralFallback(turn) {
    const context = turn.toolContext
    const lines = []
    lines.push(
      `我已经基于真实工具上下文完成检索：当前系统共有 ${context.topology_summary.leo_satellites} 颗 LEO、${context.topology_summary.geo_satellites} 颗 GEO，活动故障 ${context.active_faults.count} 个，待审批 ${context.pending_approvals.count} 项。`
    )

    if (context.weakest_link?.found) {
      lines.push(
        `链路侧首先建议检查 ${context.weakest_link.link_id}，它当前丢包 ${context.weakest_link.loss_rate_pct}% ，时延 ${context.weakest_link.latency_ms} ms。`
      )
    }

    const entityLookups = Object.entries(context).filter(([key]) => key.startsWith('entity_lookup:'))
    if (entityLookups.length) {
      entityLookups.forEach(([, value]) => {
        if (value.found && value.entity_type === 'instance') {
          lines.push(
            `${value.instance_id} 当前${value.start ? '在线' : '离线'}，CPU ${round(value.cpu_usage_pct, 1)}% ，内存 ${round(value.memory_gb, 2)} GB。`
          )
        }
        if (value.found && value.entity_type === 'link') {
          lines.push(
            `${value.link_id} 当前${value.enabled ? '启用' : '停用'}，两端为 ${value.endpoints.join(' -> ')}，时延 ${value.latency_ms} ms。`
          )
        }
      })
    }

    lines.push('如果你要继续排障，我建议下一步指定目标对象，例如 `sat-003`、`geo-001` 或某条 `link-xxx`。')
    return lines.join('\n')
  }

  function buildSuggestions(turn) {
    const suggestions = []
    if (turn.toolContext.weakest_link?.found) {
      suggestions.push(`查看链路拓扑中的 ${turn.toolContext.weakest_link.link_id}`)
    }
    const hottest = turn.toolContext.hot_instances?.[0]
    if (hottest) {
      suggestions.push(`查看节点实例中的 ${hottest.instance_id}`)
    }
    if (turn.toolContext.pending_approvals?.count) {
      suggestions.push('检查审批面板中的高风险动作')
    }
    if (turn.intent === 'llm') {
      suggestions.push('在 LLM 配置页执行连通性测试')
    }
    return suggestions.slice(0, 4)
  }

  async function chat({ message, history = [] }) {
    const turn = queryEngine.createTurn({ message, history })
    const context = getContext()
    let responseText = ''
    let llmUsed = false

    if (turn.intent === 'time') {
      responseText = renderTimeAnswer(turn.toolContext.current_time)
    } else if (turn.intent === 'status') {
      responseText = renderStatusAnswer(context, turn.toolContext)
    } else if (turn.intent === 'llm') {
      responseText = renderLlmAnswer(turn.toolContext)
    } else {
      try {
        const llmText = await deps.callOpenAICompatible(
          'coordinator',
          message,
          history,
          turn.systemPrompt
        )
        if (llmText) {
          responseText = llmText
          llmUsed = true
        }
      } catch (error) {
        responseText = ''
      }
    }

    if (!responseText) {
      responseText = renderGeneralFallback(turn)
    }

    return {
      response: responseText,
      actions_taken: turn.toolExecutions.map((execution) => ({
        tool: execution.input?.query ? `${execution.tool}(${execution.input.query})` : execution.tool,
        result: summarizeToolResult(execution.tool, execution.result)
      })),
      suggestions: buildSuggestions(turn),
      pending_approvals: context.approvals
        .filter((item) => item.status === 'pending')
        .map((item) => ({
          id: item.request_id,
          action: item.action,
          target: item.target,
          parameters: {},
          security_level: item.security_level
        })),
      grounding: {
        llm_used: llmUsed,
        tool_count: turn.toolExecutions.length,
        generated_at: turn.toolContext.current_time.beijing_datetime
      }
    }
  }

  return {
    chat,
    getNowInfo,
    getContext
  }
}

module.exports = {
  createSatOpsAgentRuntime
}
