import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { InstanceResource, LinkResource } from '../api/types'

export interface Anomaly {
  id: string
  instance_id: string
  instance_name: string
  type: 'cpu' | 'memory' | 'network' | 'link'
  severity: 'warning' | 'critical'
  description: string
  timestamp: string
  status: 'pending' | 'acknowledged' | 'resolved'
  value: number
  threshold: number
}

const CPU_WARNING_THRESHOLD = 75
const CPU_CRITICAL_THRESHOLD = 90
const MEMORY_WARNING_THRESHOLD = 6 * 1024 * 1024 * 1024
const MEMORY_CRITICAL_THRESHOLD = 8 * 1024 * 1024 * 1024
const NETWORK_ERROR_THRESHOLD = 10
const NETWORK_CRITICAL_THRESHOLD = 100

export const useAnomalyStore = defineStore('anomaly', () => {
  const anomalies = ref<Anomaly[]>([])
  const acknowledgedIds = ref<Set<string>>(new Set())

  const detectInstanceAnomalies = (
    instanceId: string,
    instanceName: string,
    resource: InstanceResource | undefined
  ) => {
    if (!resource) return

    const now = new Date().toISOString()

    if (resource.cpu_usage >= CPU_CRITICAL_THRESHOLD) {
      addAnomaly({
        id: `${instanceId}-cpu-critical-${Date.now()}`,
        instance_id: instanceId,
        instance_name: instanceName,
        type: 'cpu',
        severity: 'critical',
        description: `CPU使用率过高: ${resource.cpu_usage.toFixed(1)}%`,
        timestamp: now,
        status: 'pending',
        value: resource.cpu_usage,
        threshold: CPU_CRITICAL_THRESHOLD
      })
    } else if (resource.cpu_usage >= CPU_WARNING_THRESHOLD) {
      addAnomaly({
        id: `${instanceId}-cpu-warning-${Date.now()}`,
        instance_id: instanceId,
        instance_name: instanceName,
        type: 'cpu',
        severity: 'warning',
        description: `CPU使用率偏高: ${resource.cpu_usage.toFixed(1)}%`,
        timestamp: now,
        status: 'pending',
        value: resource.cpu_usage,
        threshold: CPU_WARNING_THRESHOLD
      })
    }

    if (resource.mem_byte >= MEMORY_CRITICAL_THRESHOLD) {
      addAnomaly({
        id: `${instanceId}-mem-critical-${Date.now()}`,
        instance_id: instanceId,
        instance_name: instanceName,
        type: 'memory',
        severity: 'critical',
        description: `内存使用过高: ${(resource.mem_byte / 1024 / 1024 / 1024).toFixed(2)}GB`,
        timestamp: now,
        status: 'pending',
        value: resource.mem_byte,
        threshold: MEMORY_CRITICAL_THRESHOLD
      })
    } else if (resource.mem_byte >= MEMORY_WARNING_THRESHOLD) {
      addAnomaly({
        id: `${instanceId}-mem-warning-${Date.now()}`,
        instance_id: instanceId,
        instance_name: instanceName,
        type: 'memory',
        severity: 'warning',
        description: `内存使用偏高: ${(resource.mem_byte / 1024 / 1024 / 1024).toFixed(2)}GB`,
        timestamp: now,
        status: 'pending',
        value: resource.mem_byte,
        threshold: MEMORY_WARNING_THRESHOLD
      })
    }
  }

  const detectLinkAnomalies = (
    linkId: string,
    resource: LinkResource | undefined
  ) => {
    if (!resource) return

    const now = new Date().toISOString()
    const totalErr = (resource.recv_err_pps || 0) + (resource.send_err_pps || 0)
    const totalDrop = (resource.recv_drop_pps || 0) + (resource.send_drop_pps || 0)

    if (totalErr >= NETWORK_CRITICAL_THRESHOLD || totalDrop >= NETWORK_CRITICAL_THRESHOLD) {
      addAnomaly({
        id: `${linkId}-network-critical-${Date.now()}`,
        instance_id: linkId,
        instance_name: `链路 ${linkId}`,
        type: 'network',
        severity: 'critical',
        description: `网络错误/丢包严重: 错误${totalErr}/s, 丢包${totalDrop}/s`,
        timestamp: now,
        status: 'pending',
        value: Math.max(totalErr, totalDrop),
        threshold: NETWORK_CRITICAL_THRESHOLD
      })
    } else if (totalErr >= NETWORK_ERROR_THRESHOLD || totalDrop >= NETWORK_ERROR_THRESHOLD) {
      addAnomaly({
        id: `${linkId}-network-warning-${Date.now()}`,
        instance_id: linkId,
        instance_name: `链路 ${linkId}`,
        type: 'network',
        severity: 'warning',
        description: `网络错误/丢包: 错误${totalErr}/s, 丢包${totalDrop}/s`,
        timestamp: now,
        status: 'pending',
        value: Math.max(totalErr, totalDrop),
        threshold: NETWORK_ERROR_THRESHOLD
      })
    }
  }

  const addAnomaly = (anomaly: Anomaly) => {
    const existing = anomalies.value.find(
      a => a.instance_id === anomaly.instance_id && 
           a.type === anomaly.type && 
           a.status === 'pending'
    )
    if (!existing) {
      anomalies.value.unshift(anomaly)
      if (anomalies.value.length > 100) {
        anomalies.value = anomalies.value.slice(0, 100)
      }
    }
  }

  const acknowledge = (id: string) => {
    const anomaly = anomalies.value.find(a => a.id === id)
    if (anomaly) {
      anomaly.status = 'acknowledged'
      acknowledgedIds.value.add(id)
    }
  }

  const resolve = (id: string) => {
    const anomaly = anomalies.value.find(a => a.id === id)
    if (anomaly) {
      anomaly.status = 'resolved'
    }
  }

  const clearResolved = () => {
    anomalies.value = anomalies.value.filter(a => a.status !== 'resolved')
  }

  // 手动注入异常（用于测试）
  const injectTestAnomalies = () => {
    const now = new Date().toISOString()
    const testAnomalies: Anomaly[] = [
      {
        id: `test-cpu-critical-${Date.now()}`,
        instance_id: 'test-instance-1',
        instance_name: '银河-1',
        type: 'cpu',
        severity: 'critical',
        description: 'CPU使用率过高: 95.5%',
        timestamp: now,
        status: 'pending',
        value: 95.5,
        threshold: 90
      },
      {
        id: `test-cpu-warning-${Date.now() + 1}`,
        instance_id: 'test-instance-2',
        instance_name: '银河-3',
        type: 'cpu',
        severity: 'warning',
        description: 'CPU使用率偏高: 82.3%',
        timestamp: now,
        status: 'pending',
        value: 82.3,
        threshold: 75
      },
      {
        id: `test-memory-critical-${Date.now() + 2}`,
        instance_id: 'test-instance-3',
        instance_name: '银河-5',
        type: 'memory',
        severity: 'critical',
        description: '内存使用过高: 8.5GB',
        timestamp: now,
        status: 'pending',
        value: 8.5 * 1024 * 1024 * 1024,
        threshold: 8 * 1024 * 1024 * 1024
      },
      {
        id: `test-network-warning-${Date.now() + 3}`,
        instance_id: 'test-instance-4',
        instance_name: '银河-7',
        type: 'network',
        severity: 'warning',
        description: '网络丢包: 15/s',
        timestamp: now,
        status: 'pending',
        value: 15,
        threshold: 10
      },
      {
        id: `test-memory-warning-${Date.now() + 4}`,
        instance_id: 'test-instance-5',
        instance_name: '银河-9',
        type: 'memory',
        severity: 'warning',
        description: '内存使用偏高: 6.8GB',
        timestamp: now,
        status: 'pending',
        value: 6.8 * 1024 * 1024 * 1024,
        threshold: 6 * 1024 * 1024 * 1024
      }
    ]
    
    testAnomalies.forEach(anomaly => {
      const existing = anomalies.value.find(
        a => a.instance_id === anomaly.instance_id && 
             a.type === anomaly.type && 
             a.status === 'pending'
      )
      if (!existing) {
        anomalies.value.unshift(anomaly)
      }
    })
    
    // 限制异常数量
    if (anomalies.value.length > 100) {
      anomalies.value = anomalies.value.slice(0, 100)
    }
  }

  // 清除所有测试异常
  const clearTestAnomalies = () => {
    anomalies.value = anomalies.value.filter(a => !a.id.startsWith('test-'))
  }

  const pendingAnomalies = computed(() => 
    anomalies.value.filter(a => a.status === 'pending')
  )

  const criticalAnomalies = computed(() => 
    anomalies.value.filter(a => a.severity === 'critical' && a.status === 'pending')
  )

  const warningAnomalies = computed(() => 
    anomalies.value.filter(a => a.severity === 'warning' && a.status === 'pending')
  )

  const anomalyCount = computed(() => pendingAnomalies.value.length)
  const criticalCount = computed(() => criticalAnomalies.value.length)

  return {
    anomalies,
    detectInstanceAnomalies,
    detectLinkAnomalies,
    acknowledge,
    resolve,
    clearResolved,
    injectTestAnomalies,
    clearTestAnomalies,
    pendingAnomalies,
    criticalAnomalies,
    warningAnomalies,
    anomalyCount,
    criticalCount
  }
})
