import { defineStore } from 'pinia'
import { Anomaly } from '../types/anomaly'
import axios from 'axios'

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
        const response = await axios.get('/api/anomalies')
        this.anomalies = response.data
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async updateAnomalyStatus(id: number, status: 'pending' | 'fixed') {
      try {
        const response = await axios.put(`/api/anomalies/${id}`, { status })
        const index = this.anomalies.findIndex(a => a.id === id)
        if (index !== -1) {
          this.anomalies[index] = response.data
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