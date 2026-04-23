<template>
  <div class="earth-view">
    <SatelliteMapViewer :show-all-status="false" class="satmap-bg" />
  </div>
</template>

<script setup lang="ts">
import SatelliteMapViewer from '../components/cesium/SatelliteMapViewer.vue'
</script>

<style scoped>
.earth-view {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
}

.cesium-bg,
.satmap-bg {
  position: absolute;
  inset: 0;
}
</style>
