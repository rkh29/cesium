import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { linkApi, resourceApi } from '../api'
import type { Link, LinkDetail, LinkResource } from '../api/types'
import { mockLinkResources, mockLinks } from '../api/mock-data'

export interface LinkDisplay {
  id: string
  type: string
  status: 'normal' | 'warning' | 'danger' | 'offline'
  enabled: boolean
  endpoints: [string, string]
  recvBps: number
  sendBps: number
  nodeIndex: number
}

export const useLinkStore = defineStore('link', () => {
  const links = ref<Link[]>([])
  const linkDetails = ref<Record<string, LinkDetail>>({})
  const resources = ref<Record<string, LinkResource>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)
  const dataSource = ref<'mock-server' | 'local-fallback'>('mock-server')

  const fetchLinks = async () => {
    loading.value = true
    error.value = null
    try {
      links.value = await linkApi.getList()
      dataSource.value = 'mock-server'
    } catch (e: any) {
      error.value = e.message
      links.value = mockLinks
      dataSource.value = 'local-fallback'
    } finally {
      loading.value = false
    }
  }

  const fetchLinkDetail = async (nodeIndex: number, linkId: string) => {
    try {
      const detail = await linkApi.getDetail(nodeIndex, linkId)
      linkDetails.value[linkId] = detail
      return detail
    } catch (e: any) {
      console.error('Failed to fetch link detail:', e)
      return null
    }
  }

  const fetchAllResources = async () => {
    try {
      resources.value = await resourceApi.getAllLinkResources()
    } catch (e: any) {
      console.error('Failed to fetch link resources:', e)
      resources.value = mockLinkResources
      dataSource.value = 'local-fallback'
    }
  }

  const getLinkStatus = (resource?: LinkResource): 'normal' | 'warning' | 'danger' | 'offline' => {
    if (!resource) return 'offline'
    const totalErr = (resource.recv_err_pps || 0) + (resource.send_err_pps || 0)
    const totalDrop = (resource.recv_drop_pps || 0) + (resource.send_drop_pps || 0)
    if (totalErr > 100 || totalDrop > 100) return 'danger'
    if (totalErr > 10 || totalDrop > 10) return 'warning'
    return 'normal'
  }

  const linksForDisplay = computed<LinkDisplay[]>(() => {
    return links.value.map(link => {
      const res = resources.value[link.link_id]
      return {
        id: link.link_id,
        type: link.type,
        status: getLinkStatus(res),
        enabled: link.enable,
        endpoints: link.connect_instance,
        recvBps: res?.recv_bps ?? 0,
        sendBps: res?.send_bps ?? 0,
        nodeIndex: link.node_index
      }
    })
  })

  const enabledCount = computed(() => links.value.filter(l => l.enable).length)
  const totalCount = computed(() => links.value.length)

  const getLinkById = (id: string) => {
    return links.value.find(l => l.link_id === id)
  }

  return {
    links,
    linkDetails,
    resources,
    loading,
    error,
    dataSource,
    fetchLinks,
    fetchLinkDetail,
    fetchAllResources,
    linksForDisplay,
    enabledCount,
    totalCount,
    getLinkById
  }
})
