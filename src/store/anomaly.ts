import { defineStore } from 'pinia'
import { anomalyApi } from '../api'
import type { Anomaly } from '../types/anomaly'

export const useAnomalyStore = defineStore('anomaly', {
  state: () => ({
    anomalies: [] as Anomaly[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    pendingAnomalies: (state) => state.anomalies.filter(a => a.status === 'pending'),
    fixedAnomalies: (state) => state.anomalies.filter(a => a.status === 'fixed'),
    softwareAnomalies: (state) => state.anomalies.filter(a => a.anomaly_type === 'software'),
    hardwareAnomalies: (state) => state.anomalies.filter(a => a.anomaly_type === 'hardware'),
    totalAnomalies: (state) => state.anomalies.length
  },

  actions: {
    async fetchAnomalies() {
      this.loading = true
      this.error = null
      try {
        this.anomalies = await anomalyApi.getList()
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async updateAnomalyStatus(id: number, status: 'pending' | 'fixed') {
      try {
        const updated = await anomalyApi.updateStatus(id, status)
        const index = this.anomalies.findIndex(a => a.id === id)
        if (index !== -1) {
          this.anomalies[index] = updated
        }
      } catch (err: any) {
        this.error = err.message
        throw err
      }
    },

    getAnomalyById(id: number) {
      return this.anomalies.find(a => a.id === id)
    }
  }
})