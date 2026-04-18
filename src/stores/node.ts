import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { nodeApi, resourceApi } from '../api'
import type { Node, HostResource } from '../api/types'

export const useNodeStore = defineStore('node', () => {
  const nodes = ref<Node[]>([])
  const resources = ref<Record<number, HostResource>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchNodes = async () => {
    loading.value = true
    error.value = null
    try {
      nodes.value = await nodeApi.getList()
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const fetchAllResources = async () => {
    try {
      resources.value = await resourceApi.getNodeResource('all')
    } catch (e: any) {
      console.error('Failed to fetch node resources:', e)
    }
  }

  const fetchNodeResource = async (nodeIndex: number) => {
    try {
      const res = await resourceApi.getNodeResource(nodeIndex)
      if (res[nodeIndex]) {
        resources.value[nodeIndex] = res[nodeIndex]
      }
    } catch (e: any) {
      console.error('Failed to fetch node resource:', e)
    }
  }

  const masterNode = computed(() => nodes.value.find(n => n.is_master_node))
  const nodeCount = computed(() => nodes.value.length)

  const getNodeById = (index: number) => {
    return nodes.value.find(n => n.node_index === index)
  }

  return {
    nodes,
    resources,
    loading,
    error,
    fetchNodes,
    fetchAllResources,
    fetchNodeResource,
    masterNode,
    nodeCount,
    getNodeById
  }
})
