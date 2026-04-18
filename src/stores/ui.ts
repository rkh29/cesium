
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // 沉浸式模式：如果为 true，仪表盘隐藏，Cesium 占据主导
  const isImmersiveMode = ref(false)
  
  // 切换模式
  function setImmersive(value: boolean) {
    isImmersiveMode.value = value
  }

  function toggleImmersive() {
    isImmersiveMode.value = !isImmersiveMode.value
  }

  return {
    isImmersiveMode,
    setImmersive,
    toggleImmersive
  }
})
