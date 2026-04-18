<template>
  <div class="earth-view">
    <CesiumViewer :show-all-status="false" class="cesium-bg" />
  </div>
</template>

<script setup lang="ts">
import CesiumViewer from '../components/cesium/CesiumViewer.vue'
</script>

<style scoped>
.earth-view {
  position: relative;
  width: calc(100% + 48px);
  height: calc(100% + 48px);
  margin: -24px;
  overflow: hidden;
}

.cesium-bg {
  position: absolute;
  inset: 0;
}
</style>
