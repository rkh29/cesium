<template>
  <div class="agent-console">
    <section class="hero-panel">
      <div class="hero-copy">
        <p class="eyebrow">Satellite AIOps Console</p>
        <h2>卫星智能运维 Agent</h2>
        <p class="hero-text">
          面向卫星网络智能运维的统一控制台，整合协调器、专家代理、审批、黑板和联邦诊断。
        </p>
      </div>
      <div class="hero-actions">
        <el-button type="primary" @click="refreshAll" :loading="bootstrapping">
          刷新态势
        </el-button>
        <el-tag :type="llmOnline ? 'success' : 'warning'" effect="dark">
          {{ llmOnline ? 'LLM 已接入' : 'Mock 模式' }}
        </el-tag>
      </div>
    </section>

    <section class="summary-grid">
      <el-card class="summary-card" shadow="hover">
        <p class="summary-label">Coordinator</p>
        <div class="summary-main">
          <span class="summary-value">{{ status?.coordinator.model || '-' }}</span>
          <el-tag size="small" :type="status?.coordinator.status === 'online' ? 'success' : 'info'">
            {{ status?.coordinator.status || 'unknown' }}
          </el-tag>
        </div>
        <p class="summary-sub">活跃任务 {{ status?.coordinator.active_tasks ?? 0 }}</p>
      </el-card>

      <el-card class="summary-card" shadow="hover">
        <p class="summary-label">Specialists</p>
        <div class="summary-main">
          <span class="summary-value">{{ status?.specialists.length ?? 0 }}</span>
          <el-tag size="small" type="primary">地面专家</el-tag>
        </div>
        <p class="summary-sub">
          在线 {{ onlineSpecialists }}/{{ status?.specialists.length ?? 0 }}
        </p>
      </el-card>

      <el-card class="summary-card" shadow="hover">
        <p class="summary-label">Edge Agents</p>
        <div class="summary-main">
          <span class="summary-value">{{ status?.edge_agents.length ?? 0 }}</span>
          <el-tag size="small" type="success">星上心跳</el-tag>
        </div>
        <p class="summary-sub">最近轮询 {{ refreshTime }}</p>
      </el-card>

      <el-card class="summary-card" shadow="hover">
        <p class="summary-label">Pending Approval</p>
        <div class="summary-main">
          <span class="summary-value">{{ approvals.length }}</span>
          <el-tag size="small" :type="criticalApprovalCount > 0 ? 'danger' : 'warning'">
            {{ criticalApprovalCount > 0 ? '高风险' : '待处理' }}
          </el-tag>
        </div>
        <p class="summary-sub">联邦协商 {{ negotiations.length }} 条</p>
      </el-card>
    </section>

    <section class="content-grid">
      <div class="chat-column">
        <el-card class="panel-card" shadow="never">
          <template #header>
            <div class="panel-head">
              <div>
                <h3>任务输入</h3>
                <p>通过协调器或专家代理发起排障与运维任务</p>
              </div>
              <el-select v-model="agentType" class="agent-select">
                <el-option label="协调器" value="coordinator" />
                <el-option label="网络专家" value="network" />
                <el-option label="健康专家" value="health" />
                <el-option label="运维专家" value="ops" />
                <el-option label="安全专家" value="security" />
              </el-select>
            </div>
          </template>

          <div class="quick-actions">
            <el-button
              v-for="prompt in quickPrompts"
              :key="prompt"
              plain
              size="small"
              @click="message = prompt"
            >
              {{ prompt }}
            </el-button>
          </div>

          <el-input
            v-model="message"
            type="textarea"
            :rows="4"
            resize="none"
            placeholder="例如：排查 GEO 骨干链路丢包异常，并给出处置建议"
          />

          <div class="composer-actions">
            <el-checkbox v-model="continueTrace" :disabled="!currentTraceId">
              续接当前 Trace
            </el-checkbox>
            <div class="composer-buttons">
              <el-button @click="message = ''">清空</el-button>
              <el-button type="primary" :loading="sending" @click="sendMessage">
                发送任务
              </el-button>
            </div>
          </div>
        </el-card>

        <el-card class="panel-card message-card" shadow="never">
          <template #header>
            <div class="panel-head">
              <div>
                <h3>消息流</h3>
                <p>展示智能运维 Agent 的回复、建议和动作摘要</p>
              </div>
              <el-tag v-if="currentTraceId" type="info">Trace {{ currentTraceId }}</el-tag>
            </div>
          </template>

          <div class="message-list">
            <div
              v-for="item in messages"
              :key="item.id"
              class="message-item"
              :class="item.role === 'user' ? 'is-user' : 'is-assistant'"
            >
              <div class="message-meta">
                <span>{{ item.role === 'user' ? '用户' : item.agentLabel }}</span>
                <span>{{ item.time }}</span>
              </div>
              <div class="message-body">{{ item.content }}</div>
              <div v-if="item.suggestions?.length" class="message-extra">
                <span class="extra-title">建议动作</span>
                <el-tag
                  v-for="suggestion in item.suggestions"
                  :key="suggestion"
                  size="small"
                  class="extra-tag"
                >
                  {{ suggestion }}
                </el-tag>
              </div>
              <div v-if="item.actions?.length" class="message-extra">
                <span class="extra-title">执行摘要</span>
                <div
                  v-for="action in item.actions"
                  :key="`${item.id}-${action.tool}`"
                  class="action-row"
                >
                  <span>{{ action.tool }}</span>
                  <span>{{ action.result }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <div class="context-column">
        <el-card class="panel-card" shadow="never">
          <template #header>
            <div class="panel-head">
              <div>
                <h3>Trace 与执行计划</h3>
                <p>协调器拆解后的排障流程</p>
              </div>
              <el-tag :type="tracePhaseType">{{ trace?.current_phase || 'idle' }}</el-tag>
            </div>
          </template>

          <div v-if="trace?.plan?.length" class="plan-list">
            <div v-for="item in trace.plan" :key="`${item.assignee}-${item.task}`" class="plan-item">
              <div class="plan-main">
                <strong>{{ item.task }}</strong>
                <span>{{ item.assignee }}</span>
              </div>
              <el-tag size="small" :type="statusTagType(item.status)">
                {{ item.status }}
              </el-tag>
            </div>
          </div>
          <el-empty v-else description="等待任务创建 Trace" />
        </el-card>

        <el-card class="panel-card" shadow="never">
          <template #header>
            <div class="panel-head">
              <div>
                <h3>Blackboard</h3>
                <p>跨代理共享的结构化状态快照</p>
              </div>
              <span class="muted">{{ blackboard?.updated_at ? formatTime(blackboard.updated_at) : '-' }}</span>
            </div>
          </template>

          <div v-if="blackboardEntries.length" class="blackboard-list">
            <div v-for="entry in blackboardEntries" :key="entry.key" class="blackboard-row">
              <span class="blackboard-key">{{ entry.key }}</span>
              <span class="blackboard-value">{{ entry.value }}</span>
            </div>
          </div>
          <el-empty v-else description="暂无黑板数据" />
        </el-card>

        <el-card class="panel-card" shadow="never">
          <template #header>
            <div class="panel-head">
              <div>
                <h3>审批与联邦协商</h3>
                <p>高风险动作审批和 A2A 共识结果</p>
              </div>
              <el-button text @click="refreshApprovals">刷新</el-button>
            </div>
          </template>

          <div class="approval-list">
            <div v-for="approval in approvals" :key="approval.request_id" class="approval-card">
              <div class="approval-top">
                <strong>{{ approval.action }}</strong>
                <el-tag size="small" :type="approval.security_level === 'critical' ? 'danger' : 'warning'">
                  {{ approval.security_level }}
                </el-tag>
              </div>
              <p>目标：{{ approval.target }}</p>
              <p>原因：{{ approval.reason || '未说明' }}</p>
              <div class="approval-actions">
                <el-button size="small" @click="decideApproval(approval.request_id, 'reject')">驳回</el-button>
                <el-button size="small" type="primary" @click="decideApproval(approval.request_id, 'approve')">
                  通过
                </el-button>
              </div>
            </div>
          </div>

          <el-divider />

          <div class="negotiation-list">
            <div v-for="item in negotiations" :key="item.negotiation_id" class="negotiation-card">
              <div class="approval-top">
                <strong>{{ item.type }}</strong>
                <el-tag size="small" type="success">{{ item.status }}</el-tag>
              </div>
              <p>参与节点：{{ item.participating_agents.join(', ') }}</p>
              <p>{{ item.result }}</p>
            </div>
          </div>
        </el-card>

        <el-card class="panel-card" shadow="never">
          <template #header>
            <div class="panel-head">
              <div>
                <h3>千问模型配置</h3>
                <p>用于协调器与网络专家的 OpenAI 兼容模式接入</p>
              </div>
              <el-button text @click="loadLlmConfig">重载</el-button>
            </div>
          </template>

          <div class="config-stack">
            <div class="config-block">
              <span class="config-title">协调器</span>
              <el-input v-model="coordinatorModel" placeholder="qwen-plus" />
              <el-input v-model="coordinatorEndpoint" placeholder="https://dashscope.aliyuncs.com/compatible-mode/v1" />
            </div>
            <div class="config-block">
              <span class="config-title">网络专家</span>
              <el-input v-model="specialistModel" placeholder="qwen-turbo" />
              <el-input v-model="specialistEndpoint" placeholder="https://dashscope.aliyuncs.com/compatible-mode/v1" />
            </div>
            <div class="config-actions">
              <el-button :loading="testing" @click="testLlm('specialist_network')">测试网络专家</el-button>
              <el-button :loading="testing" @click="testLlm('coordinator')">测试协调器</el-button>
              <el-button type="primary" :loading="savingConfig" @click="saveLlmConfig">保存配置</el-button>
            </div>
            <el-alert
              :title="llmTip"
              type="info"
              :closable="false"
              show-icon
            />
          </div>
        </el-card>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { agentApi, llmApi, satopsApi } from '../api'
import type {
  AgentStatus,
  ApprovalRequest,
  A2ANegotiation,
  BlackboardState,
  TraceDetail
} from '../api/types'
import { usePolling } from '../composables/usePolling'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  agentLabel: string
  content: string
  time: string
  suggestions?: string[]
  actions?: Array<{ tool: string; result: string }>
}

const quickPrompts = [
  '排查 GEO 骨干链路丢包异常',
  '检查边界站与中心主控站的回传健康度',
  '给出当前网络最脆弱链路及处置建议',
  '生成一份针对卫星异常的排障计划'
]

const bootstrapping = ref(false)
const sending = ref(false)
const savingConfig = ref(false)
const testing = ref(false)
const continueTrace = ref(true)
const agentType = ref('coordinator')
const message = ref('')
const currentTraceId = ref('')
const refreshTime = ref('--')

const status = ref<AgentStatus | null>(null)
const trace = ref<TraceDetail | null>(null)
const blackboard = ref<BlackboardState | null>(null)
const approvals = ref<ApprovalRequest[]>([])
const negotiations = ref<A2ANegotiation[]>([])
const llmStatus = ref<Record<string, any>>({})
const llmConfig = ref<Record<string, any>>({})

const coordinatorModel = ref('')
const coordinatorEndpoint = ref('')
const specialistModel = ref('')
const specialistEndpoint = ref('')

const messages = ref<ChatMessage[]>([
  {
    id: 'welcome',
    role: 'assistant',
    agentLabel: 'Coordinator',
    content:
      '已进入卫星智能运维控制台。你可以直接发起排障任务，我会同时创建 Trace、拉取 Blackboard，并展示审批与联邦协商状态。',
    time: dayjs().format('HH:mm:ss')
  }
])

const onlineSpecialists = computed(
  () => status.value?.specialists.filter((item) => item.status === 'online').length ?? 0
)

const criticalApprovalCount = computed(
  () => approvals.value.filter((item) => item.security_level === 'critical').length
)

const llmOnline = computed(() =>
  Object.values(llmStatus.value || {}).some((item: any) => item?.provider === 'real-llm' || item?.status === 'online')
)

const blackboardEntries = computed(() => {
  const findings = blackboard.value?.findings || {}
  return Object.entries(findings).map(([key, value]) => ({
    key,
    value: typeof value === 'string' ? value : JSON.stringify(value)
  }))
})

const tracePhaseType = computed(() => {
  switch (trace.value?.current_phase) {
    case 'completed':
      return 'success'
    case 'review':
      return 'warning'
    case 'execute':
      return 'primary'
    case 'plan':
      return 'info'
    default:
      return 'info'
  }
})

const llmTip = computed(() => {
  return `当前默认使用 DashScope OpenAI 兼容模式。若要启用真实千问，请在 .env.mock 中设置 DASHSCOPE_API_KEY 或 SATOPS_LLM_API_KEY。`
})

function formatTime(value: string) {
  return dayjs(value).format('MM-DD HH:mm:ss')
}

function statusTagType(status: string) {
  if (status === 'completed') return 'success'
  if (status === 'running') return 'primary'
  if (status === 'failed') return 'danger'
  return 'info'
}

function syncLlmForm() {
  const coordinator = llmConfig.value?.coordinator || {}
  const specialist = llmConfig.value?.specialist_network || {}
  coordinatorModel.value = coordinator.model || ''
  coordinatorEndpoint.value = coordinator.endpoint || ''
  specialistModel.value = specialist.model || ''
  specialistEndpoint.value = specialist.endpoint || ''
}

async function loadStatus() {
  status.value = await agentApi.getStatus()
}

async function loadApprovals() {
  approvals.value = await satopsApi.getPendingApprovals()
}

async function loadNegotiations() {
  negotiations.value = await satopsApi.getA2ANegotiations()
}

async function loadLlmStatus() {
  llmStatus.value = await llmApi.getStatus()
}

async function loadLlmConfig() {
  llmConfig.value = await llmApi.getConfig()
  syncLlmForm()
}

async function loadTraceArtifacts(traceId: string) {
  currentTraceId.value = traceId
  const [traceData, blackboardData] = await Promise.all([
    satopsApi.getTrace(traceId),
    satopsApi.getBlackboard(traceId)
  ])
  trace.value = traceData
  blackboard.value = blackboardData
}

async function refreshAll() {
  try {
    bootstrapping.value = true
    await Promise.all([loadStatus(), loadApprovals(), loadNegotiations(), loadLlmStatus(), loadLlmConfig()])
    if (currentTraceId.value) {
      await loadTraceArtifacts(currentTraceId.value)
    }
    refreshTime.value = dayjs().format('HH:mm:ss')
  } catch (error: any) {
    ElMessage.error(error?.message || '刷新失败')
  } finally {
    bootstrapping.value = false
  }
}

async function refreshApprovals() {
  try {
    await Promise.all([loadApprovals(), loadNegotiations()])
    ElMessage.success('审批与联邦协商状态已刷新')
  } catch (error: any) {
    ElMessage.error(error?.message || '刷新失败')
  }
}

async function sendMessage() {
  const content = message.value.trim()
  if (!content) {
    ElMessage.warning('请输入任务内容')
    return
  }

  const time = dayjs().format('HH:mm:ss')
  messages.value.unshift({
    id: `user-${Date.now()}`,
    role: 'user',
    agentLabel: 'User',
    content,
    time
  })

  sending.value = true
  try {
    const [chatReply, traceAcceptance] = await Promise.all([
      agentApi.chat({
        agent_type: agentType.value,
        message: content,
        history: messages.value
          .slice(0, 8)
          .reverse()
          .map((item) => ({ role: item.role, content: item.content }))
      }),
      satopsApi.coordinatorChat({
        message: content,
        trace_id: continueTrace.value ? currentTraceId.value || undefined : undefined
      })
    ])

    if (traceAcceptance.trace_id) {
      await loadTraceArtifacts(traceAcceptance.trace_id)
    }

    messages.value.unshift({
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      agentLabel: agentType.value === 'coordinator' ? 'Coordinator' : 'Specialist',
      content: chatReply.response,
      time: dayjs().format('HH:mm:ss'),
      suggestions: chatReply.suggestions,
      actions: (chatReply.actions_taken || []).map((item: any) => ({
        tool: item.tool,
        result: String(item.result)
      }))
    })

    await Promise.all([loadApprovals(), loadNegotiations()])
    message.value = ''
  } catch (error: any) {
    ElMessage.error(error?.message || '任务发送失败')
  } finally {
    sending.value = false
  }
}

async function decideApproval(requestId: string, decision: 'approve' | 'reject') {
  try {
    await satopsApi.submitApprovalDecision(requestId, {
      decision,
      reason: decision === 'approve' ? '控制台操作员确认通过' : '控制台操作员驳回'
    })
    await loadApprovals()
    ElMessage.success(decision === 'approve' ? '审批已通过' : '审批已驳回')
  } catch (error: any) {
    ElMessage.error(error?.message || '审批操作失败')
  }
}

async function saveLlmConfig() {
  try {
    savingConfig.value = true
    const nextConfig = {
      ...llmConfig.value,
      coordinator: {
        ...(llmConfig.value?.coordinator || {}),
        model: coordinatorModel.value,
        endpoint: coordinatorEndpoint.value
      },
      specialist_network: {
        ...(llmConfig.value?.specialist_network || {}),
        model: specialistModel.value,
        endpoint: specialistEndpoint.value
      }
    }
    await llmApi.updateConfig(nextConfig)
    await loadLlmConfig()
    ElMessage.success('模型配置已保存')
  } catch (error: any) {
    ElMessage.error(error?.message || '模型配置保存失败')
  } finally {
    savingConfig.value = false
  }
}

async function testLlm(role: 'coordinator' | 'specialist_network') {
  try {
    testing.value = true
    const result = await llmApi.testConnection(role)
    if (result.connected) {
      ElMessage.success(`${role} 连通成功：${result.reply}`)
    } else {
      ElMessage.warning(`${role} 当前未连到真实模型：${result.reply}`)
    }
    await loadLlmStatus()
  } catch (error: any) {
    ElMessage.error(error?.message || '模型测试失败')
  } finally {
    testing.value = false
  }
}

usePolling(refreshAll, 20000, true)
</script>

<style scoped>
.agent-console {
  padding: 24px;
  min-height: 100%;
  background:
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.12), transparent 28%),
    radial-gradient(circle at left bottom, rgba(16, 185, 129, 0.1), transparent 32%),
    var(--vscode-bg);
}

.hero-panel,
.summary-card,
.panel-card {
  border: 1px solid var(--vscode-border);
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(10px);
}

html.dark .hero-panel,
html.dark .summary-card,
html.dark .panel-card {
  background: rgba(15, 23, 42, 0.72);
}

.hero-panel {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 28px;
  border-radius: 24px;
  margin-bottom: 20px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--vscode-primary);
}

.hero-copy h2 {
  margin: 0;
  font-size: 28px;
}

.hero-text {
  max-width: 720px;
  margin: 12px 0 0;
  color: var(--vscode-text-muted);
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.summary-card {
  border-radius: 20px;
}

.summary-label {
  margin: 0 0 10px;
  color: var(--vscode-text-muted);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.summary-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.summary-value {
  font-size: 26px;
  font-weight: 700;
}

.summary-sub {
  margin: 12px 0 0;
  color: var(--vscode-text-muted);
  font-size: 13px;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(360px, 0.8fr);
  gap: 16px;
}

.chat-column,
.context-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.panel-card {
  border-radius: 22px;
}

.panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.panel-head h3 {
  margin: 0;
  font-size: 18px;
}

.panel-head p,
.muted {
  margin: 6px 0 0;
  color: var(--vscode-text-muted);
  font-size: 13px;
}

.agent-select {
  width: 140px;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.composer-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
}

.composer-buttons {
  display: flex;
  gap: 8px;
}

.message-card {
  min-height: 620px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 820px;
  overflow: auto;
}

.message-item {
  padding: 16px;
  border-radius: 18px;
  border: 1px solid var(--vscode-border);
}

.message-item.is-user {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.14), rgba(59, 130, 246, 0.04));
}

.message-item.is-assistant {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(16, 185, 129, 0.04));
}

.message-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  font-size: 12px;
  color: var(--vscode-text-muted);
}

.message-body {
  white-space: pre-wrap;
  line-height: 1.75;
}

.message-extra {
  margin-top: 14px;
}

.extra-title {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--vscode-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.extra-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.action-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  border-top: 1px dashed var(--vscode-border);
  font-size: 13px;
}

.action-row:first-of-type {
  border-top: none;
}

.plan-list,
.approval-list,
.negotiation-list,
.config-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.plan-item,
.approval-card,
.negotiation-card {
  border: 1px solid var(--vscode-border);
  border-radius: 16px;
  padding: 14px 16px;
}

.plan-main {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.approval-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.approval-card p,
.negotiation-card p {
  margin: 10px 0 0;
  line-height: 1.65;
  color: var(--vscode-text-muted);
}

.approval-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}

.blackboard-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.blackboard-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px dashed var(--vscode-border);
}

.blackboard-row:last-child {
  border-bottom: none;
}

.blackboard-key {
  color: var(--vscode-text-muted);
  font-size: 13px;
}

.blackboard-value {
  line-height: 1.65;
}

.config-block {
  display: grid;
  gap: 10px;
}

.config-title {
  font-size: 13px;
  color: var(--vscode-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.config-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (max-width: 1280px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .agent-console {
    padding: 16px;
  }

  .hero-panel {
    flex-direction: column;
    padding: 20px;
  }

  .hero-actions {
    align-items: stretch;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .composer-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .composer-buttons,
  .config-actions {
    width: 100%;
  }

  .composer-buttons :deep(.el-button),
  .config-actions :deep(.el-button) {
    flex: 1;
  }

  .blackboard-row {
    grid-template-columns: 1fr;
  }
}
</style>
