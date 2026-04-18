import { onMounted, onUnmounted, ref } from 'vue'

export function usePolling(
  fetchFn: () => Promise<void>,
  interval: number = 5000,
  immediate: boolean = true
) {
  let timer: number | null = null
  const isPolling = ref(false)
  const error = ref<Error | null>(null)

  const start = () => {
    if (isPolling.value) return
    isPolling.value = true
    if (immediate) {
      fetchFn().catch(e => { error.value = e })
    }
    timer = window.setInterval(() => {
      fetchFn().catch(e => { error.value = e })
    }, interval)
  }

  const stop = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    isPolling.value = false
  }

  const restart = () => {
    stop()
    start()
  }

  onMounted(start)
  onUnmounted(stop)

  return { isPolling, error, start, stop, restart }
}

export function useInterval(callback: () => void, interval: number = 1000) {
  let timer: number | null = null

  const start = () => {
    stop()
    timer = window.setInterval(callback, interval)
  }

  const stop = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  onMounted(start)
  onUnmounted(stop)

  return { start, stop }
}
