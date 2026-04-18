const fs = require('fs');
const path = require('path');

const missingFiles = [
  'src/views/EarthView.vue',
  'src/views/topology/InstanceManagement.vue',
  'src/views/topology/LinkManagement.vue',
  'src/views/AgentChat.vue',
  'src/views/Workflows.vue',
  'src/views/Blackboard.vue',
  'src/views/Faults.vue',
  'src/views/SatelliteDetail.vue',
  'src/views/SecurityAudit.vue',
  'src/views/LlmStatus.vue'
];

missingFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(fullPath)) {
    const name = path.basename(file, '.vue');
    const content = `<template>
  <div class="page-container">
    <h2>${name}</h2>
    <p>页面正在开发中...</p>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.page-container {
  padding: 24px;
  background-color: var(--vscode-bg);
  color: var(--vscode-text);
  border-radius: 8px;
  height: 100%;
}
</style>
`;
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Created missing file:', file);
  }
});
