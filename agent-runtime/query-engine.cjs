function createQueryEngine({ toolRegistry }) {
  function inferIntent(message) {
    const text = String(message || '').toLowerCase()
    if (/(时间|几点|几号|日期|星期|周几|weekday|time|date)/i.test(text)) return 'time'
    if (/(异常|故障|告警|失联|中断|有没有异常|状态怎么样)/i.test(text)) return 'status'
    if (/(模型|llm|千问|qwen|api key|dashscope|配置)/i.test(text)) return 'llm'
    if (/(链路|topology|拓扑|丢包|时延|jitter|latency)/i.test(text)) return 'link'
    return 'general'
  }

  function buildToolContext(toolExecutions) {
    const payload = {}
    toolExecutions.forEach((execution) => {
      if (execution.tool === 'entity_lookup') {
        const key = `entity_lookup:${execution.input.query}`
        payload[key] = execution.result
        return
      }
      payload[execution.tool] = execution.result
    })
    return payload
  }

  function buildSystemPrompt({ message, toolExecutions }) {
    const toolContext = JSON.stringify(buildToolContext(toolExecutions), null, 2)
    return [
      '你是 SatOps 卫星智能运维 Agent。',
      '你必须只根据给定工具结果回答，不得编造时间、日期、星期、卫星数量、链路状态、故障数量、审批数量或模型配置。',
      '如果工具结果里没有某项信息，就明确说“当前工具上下文没有该信息”。',
      '如果用户询问当前时间或星期，必须逐字使用工具 current_time 提供的北京时间、UTC 时间和星期。',
      '回答使用中文，面向运维人员，优先给结论，再给依据，再给建议。',
      `用户问题：${message}`,
      '以下是本轮已经真实执行过的工具结果 JSON：',
      toolContext
    ].join('\n')
  }

  function createTurn({ message, history = [] }) {
    const toolExecutions = toolRegistry.runTools(message)
    return {
      message,
      history,
      intent: inferIntent(message),
      toolExecutions,
      toolContext: buildToolContext(toolExecutions),
      systemPrompt: buildSystemPrompt({ message, toolExecutions })
    }
  }

  return {
    createTurn
  }
}

module.exports = {
  createQueryEngine
}
