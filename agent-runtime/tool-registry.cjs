function formatBytesToGb(bytes) {
  return Number(bytes || 0) / 1024 / 1024 / 1024
}

function round(value, digits = 2) {
  return Number(Number(value || 0).toFixed(digits))
}

function createToolRegistry(deps) {
  function getContext() {
    return deps.getContext()
  }

  function getNowInfo() {
    return deps.getNowInfo()
  }

  const tools = {
    current_time: {
      description: 'Return the real current time in Asia/Shanghai and UTC.',
      run() {
        return getNowInfo()
      }
    },
    topology_summary: {
      description: 'Summarize live topology and running state.',
      run() {
        const context = getContext()
        const runningInstances = context.instances.filter((item) => item.start).length
        const enabledLinks = context.links.filter((item) => item.enable).length
        const satellites = context.instances.filter((item) => item.type === 'satellite')
        const leo = satellites.filter((item) => item.instance_id.startsWith('sat-')).length
        const geo = satellites.filter((item) => item.instance_id.startsWith('geo-')).length
        const groundStations = context.instances.filter((item) => item.type === 'ground-station').length
        return {
          instance_count: context.instances.length,
          running_instances: runningInstances,
          link_count: context.links.length,
          enabled_links: enabledLinks,
          leo_satellites: leo,
          geo_satellites: geo,
          ground_stations: groundStations
        }
      }
    },
    active_faults: {
      description: 'List currently injected faults and impacted targets.',
      run() {
        const context = getContext()
        return {
          count: context.faults.length,
          faults: context.faults.map((fault) => ({
            target: fault.target,
            type: fault.type,
            status: fault.status || 'active',
            parameters: fault.parameters || {}
          }))
        }
      }
    },
    pending_approvals: {
      description: 'List pending high risk operations awaiting approval.',
      run() {
        const context = getContext()
        return {
          count: context.approvals.filter((item) => item.status === 'pending').length,
          approvals: context.approvals
            .filter((item) => item.status === 'pending')
            .map((item) => ({
              request_id: item.request_id,
              action: item.action,
              target: item.target,
              security_level: item.security_level
            }))
        }
      }
    },
    llm_status: {
      description: 'Return live LLM endpoint and key wiring state.',
      run() {
        const context = getContext()
        return {
          coordinator: {
            model: context.llmConfig.coordinator.model,
            endpoint: context.llmConfig.coordinator.endpoint,
            api_key_configured: Boolean(context.apiKeys.coordinator)
          },
          specialist_network: {
            model: context.llmConfig.specialist_network.model,
            endpoint: context.llmConfig.specialist_network.endpoint,
            api_key_configured: Boolean(context.apiKeys.specialist_network)
          }
        }
      }
    },
    weakest_link: {
      description: 'Return the most degraded link according to live loss and latency.',
      run() {
        const context = getContext()
        const linkEntries = Object.entries(context.linkParameters || {})
        if (!linkEntries.length) {
          return { found: false }
        }

        const [linkId, params] = linkEntries.sort((a, b) => {
          const scoreA = Number(a[1].loss_rate || 0) * 1000 + Number(a[1].latency_ms || 0)
          const scoreB = Number(b[1].loss_rate || 0) * 1000 + Number(b[1].latency_ms || 0)
          return scoreB - scoreA
        })[0]

        const link = context.links.find((item) => item.link_id === linkId)
        return {
          found: true,
          link_id: linkId,
          link_type: link?.type || 'unknown',
          endpoints: link?.connect_instance || [],
          enabled: Boolean(link?.enable),
          loss_rate_pct: round(Number(params.loss_rate || 0) * 100, 2),
          latency_ms: round(params.latency_ms || 0, 1),
          jitter_ms: round(params.jitter_ms || 0, 1),
          bandwidth_mbps: round(params.bandwidth_mbps || 0, 1)
        }
      }
    },
    hot_instances: {
      description: 'Return busiest instances by current CPU and memory.',
      run() {
        const context = getContext()
        return Object.entries(context.instanceResources)
          .sort((a, b) => Number(b[1].cpu_usage || 0) - Number(a[1].cpu_usage || 0))
          .slice(0, 5)
          .map(([instanceId, metrics]) => ({
            instance_id: instanceId,
            cpu_usage_pct: round(metrics.cpu_usage || 0, 1),
            memory_gb: round(formatBytesToGb(metrics.mem_byte), 2),
            swap_gb: round(formatBytesToGb(metrics.swap_mem_byte), 2)
          }))
      }
    },
    entity_lookup: {
      description: 'Look up live state for a specific satellite, ground station, or link.',
      run(input = {}) {
        const context = getContext()
        const query = String(input.query || '').toLowerCase()
        const instance = context.instances.find((item) => item.instance_id.toLowerCase() === query)
        if (instance) {
          const metrics = context.instanceResources[instance.instance_id] || {}
          const position = context.positions[instance.instance_id] || null
          return {
            found: true,
            entity_type: 'instance',
            instance_id: instance.instance_id,
            start: Boolean(instance.start),
            cpu_usage_pct: round(metrics.cpu_usage || 0, 1),
            memory_gb: round(formatBytesToGb(metrics.mem_byte), 2),
            position
          }
        }

        const link = context.links.find((item) => item.link_id.toLowerCase() === query)
        if (link) {
          const params = context.linkParameters[link.link_id] || {}
          return {
            found: true,
            entity_type: 'link',
            link_id: link.link_id,
            enabled: Boolean(link.enable),
            endpoints: link.connect_instance,
            link_type: link.type,
            loss_rate_pct: round(Number(params.loss_rate || 0) * 100, 2),
            latency_ms: round(params.latency_ms || 0, 1)
          }
        }

        return {
          found: false,
          query
        }
      }
    }
  }

  function extractEntityIds(message) {
    const text = String(message || '').toLowerCase()
    const matches = text.match(/\b(?:sat|geo)-\d{3}\b|\blink-\d{3}\b|\bground-[a-z0-9-]+\b/g) || []
    return [...new Set(matches)]
  }

  function selectTools(message) {
    const text = String(message || '').toLowerCase()
    const selected = new Set(['current_time', 'topology_summary', 'active_faults', 'pending_approvals', 'llm_status'])

    if (/(时间|几点|几号|日期|星期|周几|weekday|time|date)/i.test(text)) {
      selected.add('current_time')
    }
    if (/(链路|link|拓扑|topology|丢包|时延|latency|jitter)/i.test(text)) {
      selected.add('weakest_link')
    }
    if (/(实例|卫星|节点|sat-|geo-|ground-|cpu|内存|负载|资源)/i.test(text)) {
      selected.add('hot_instances')
    }
    if (/(异常|故障|告警|fault|alarm|失联|中断)/i.test(text)) {
      selected.add('weakest_link')
      selected.add('hot_instances')
    }
    if (/(模型|llm|千问|qwen|api key|dashscope|配置)/i.test(text)) {
      selected.add('llm_status')
    }

    extractEntityIds(message).forEach(() => selected.add('entity_lookup'))

    return [...selected]
  }

  function runTools(message) {
    const names = selectTools(message)
    const entityIds = extractEntityIds(message)
    const executions = []

    names.forEach((name) => {
      if (name === 'entity_lookup' && entityIds.length) {
        entityIds.forEach((entityId) => {
          executions.push({
            tool: name,
            input: { query: entityId },
            result: tools[name].run({ query: entityId })
          })
        })
        return
      }

      executions.push({
        tool: name,
        input: null,
        result: tools[name].run()
      })
    })

    return executions
  }

  return {
    tools,
    selectTools,
    runTools
  }
}

module.exports = {
  createToolRegistry
}
