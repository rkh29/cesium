<template>
  <div class="video-tutorials">
    <div class="content-header">
      <h2>视频教程</h2>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a href="/help">帮助中心</a></el-breadcrumb-item>
        <el-breadcrumb-item>视频教程</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div class="video-content">
      <!-- 视频教程卡片列表 -->
      <el-row :gutter="[20, 20]">
        <el-col :xs="24" :sm="12" :md="8" v-for="(video, index) in videos" :key="index">
          <el-card class="video-card" @click="openVideoDialog(video)">
            <div class="video-cover">
              <div class="placeholder-cover">
                <el-empty description="视频封面" />
              </div>
              <div class="play-button">
                <el-icon class="play-icon"><VideoPlay /></el-icon>
              </div>
              <div class="video-duration">{{ video.duration }}</div>
            </div>
            <div class="video-info">
              <h5>{{ video.title }}</h5>
              <p>{{ video.description }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 视频播放弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentVideo.title"
      width="80%"
      :before-close="handleClose"
    >
      <div class="video-player-container">
        <div class="video-player">
          <!-- 视频播放器 -->
          <el-empty description="视频播放器" style="height: 400px; display: flex; align-items: center; justify-content: center;" />
        </div>
        <div class="video-description">
          <h4>{{ currentVideo.title }}</h4>
          <p>{{ currentVideo.description }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { VideoPlay } from '@element-plus/icons-vue'

// 视频数据
const videos = reactive([
  {
    id: 1,
    title: '系统整体操作演示',
    description: '系统核心功能和操作流程的全面介绍',
    duration: '15:30',
    url: ''
  },
  {
    id: 2,
    title: '异常溯源分析实操',
    description: '详细讲解如何进行异常溯源分析，找出问题根源',
    duration: '08:45',
    url: ''
  },
  {
    id: 3,
    title: '检测规则配置教程',
    description: '分步指导如何配置异常检测规则和告警阈值',
    duration: '12:15',
    url: ''
  },
  {
    id: 4,
    title: '实时监控模块操作',
    description: '实时监控功能的详细操作说明',
    duration: '09:20',
    url: ''
  },
  {
    id: 5,
    title: '数据管理与导出',
    description: '如何管理和导出卫星数据',
    duration: '10:50',
    url: ''
  },
  {
    id: 6,
    title: '系统配置最佳实践',
    description: '系统配置的最佳实践和优化建议',
    duration: '14:35',
    url: ''
  }
])

// 视频播放弹窗
const dialogVisible = ref(false)
const currentVideo = ref(videos[0])

// 打开视频播放弹窗
const openVideoDialog = (video: any) => {
  currentVideo.value = video
  dialogVisible.value = true
}

// 关闭视频播放弹窗
const handleClose = () => {
  dialogVisible.value = false
}
</script>

<style scoped>
.video-tutorials {
  height: 100%;
}

.content-header {
  margin-bottom: 30px;
}

.content-header h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: bold;
  color: #1d2129;
}

.video-content {
  margin-top: 30px;
}

.video-card {
  height: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
}

.video-card:hover {
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.2);
  border-color: #165DFF;
  transform: translateY(-2px);
}

.video-cover {
  position: relative;
  height: 180px;
  overflow: hidden;
  background-color: #f8f9fa;
  border-radius: 8px 8px 0 0;
}

.placeholder-cover {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background-color: rgba(22, 93, 255, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  opacity: 0;
}

.video-card:hover .play-button {
  opacity: 1;
}

.play-button:hover {
  background-color: #165DFF;
  transform: translate(-50%, -50%) scale(1.1);
}

.play-icon {
  color: white;
  font-size: 24px;
  margin-left: 5px;
}

.video-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.video-info {
  padding: 15px;
}

.video-info h5 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: bold;
  color: #1d2129;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.video-info p {
  margin: 0;
  font-size: 14px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 40px;
}

/* 视频播放器弹窗样式 */
.video-player-container {
  width: 100%;
}

.video-player {
  width: 100%;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.video-description {
  padding: 0 10px;
}

.video-description h4 {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: bold;
  color: #1d2129;
}

.video-description p {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}
</style>