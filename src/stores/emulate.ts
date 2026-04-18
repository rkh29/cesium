import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { emulateApi } from '../api'
import type { EmulationConfig, TopologyRequest, ConfigEmulationRequest } from '../api/types'

export const useEmulateStore = defineStore('emulate', () => {
  const config = ref<EmulationConfig | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isRunning = computed(() => config.value?.running ?? false)
  const instanceTypes = computed(() => 
    config.value ? Object.keys(config.value.instance_type_config) : []
  )

  const fetchConfig = async () => {
    loading.value = true
    error.value = null
    try {
      config.value = await emulateApi.getConfig()
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const start = async () => {
    loading.value = true
    error.value = null
    try {
      await emulateApi.start()
      if (config.value) {
        config.value.running = true
      }
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const stop = async () => {
    loading.value = true
    error.value = null
    try {
      await emulateApi.stop()
      if (config.value) {
        config.value.running = false
      }
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const reset = async () => {
    loading.value = true
    error.value = null
    try {
      await emulateApi.reset()
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateConfig = async (newConfig: ConfigEmulationRequest) => {
    loading.value = true
    error.value = null
    try {
      await emulateApi.updateConfig(newConfig)
      await fetchConfig()
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const addTopology = async (topology: TopologyRequest) => {
    loading.value = true
    error.value = null
    try {
      await emulateApi.addTopology(topology)
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    config,
    loading,
    error,
    isRunning,
    instanceTypes,
    fetchConfig,
    start,
    stop,
    reset,
    updateConfig,
    addTopology
  }
})
