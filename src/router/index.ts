import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import AnomalyList from '../views/AnomalyList.vue'
import AnomalyDetail from '../views/AnomalyDetail.vue'

// 实时监控页面
const SatelliteStatus = () => import('../views/real-time/SatelliteStatus.vue')
const KeyMetrics = () => import('../views/real-time/KeyMetrics.vue')
const RealTimeAlerts = () => import('../views/real-time/RealTimeAlerts.vue')

// 异常分析页面
const AnomalyTrace = () => import('../views/anomalies/AnomalyTrace.vue')
const AnomalyTrend = () => import('../views/anomalies/AnomalyTrend.vue')

// 数据管理页面
const HistoryData = () => import('../views/data/HistoryData.vue')
const DataExport = () => import('../views/data/DataExport.vue')
const DataBackup = () => import('../views/data/DataBackup.vue')

// 系统配置页面
const SatelliteManagement = () => import('../views/config/SatelliteManagement.vue')
const DetectionRules = () => import('../views/config/DetectionRules.vue')
const AlertThresholds = () => import('../views/config/AlertThresholds.vue')

// 帮助中心页面
const HelpCenter = () => import('../views/help/HelpCenter.vue')
const QuickStart = () => import('../views/help/QuickStart.vue')
const FeatureManual = () => import('../views/help/FeatureManual.vue')
const AnomalyGuide = () => import('../views/help/AnomalyGuide.vue')
const FAQ = () => import('../views/help/FAQ.vue')
const VideoTutorials = () => import('../views/help/VideoTutorials.vue')
const Feedback = () => import('../views/help/Feedback.vue')

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  // 实时监控路由
  {
    path: '/real-time/status',
    name: 'SatelliteStatus',
    component: SatelliteStatus
  },
  {
    path: '/real-time/metrics',
    name: 'KeyMetrics',
    component: KeyMetrics
  },
  {
    path: '/real-time/alerts',
    name: 'RealTimeAlerts',
    component: RealTimeAlerts
  },
  // 异常分析路由
  {
    path: '/anomalies',
    name: 'AnomalyList',
    component: AnomalyList
  },
  {
    path: '/anomalies/:id',
    name: 'AnomalyDetail',
    component: AnomalyDetail
  },
  {
    path: '/anomalies/trace',
    name: 'AnomalyTrace',
    component: AnomalyTrace
  },
  {
    path: '/anomalies/trend',
    name: 'AnomalyTrend',
    component: AnomalyTrend
  },
  // 数据管理路由
  {
    path: '/data/history',
    name: 'HistoryData',
    component: HistoryData
  },
  {
    path: '/data/export',
    name: 'DataExport',
    component: DataExport
  },
  {
    path: '/data/backup',
    name: 'DataBackup',
    component: DataBackup
  },
  // 系统配置路由
  {
    path: '/config/satellites',
    name: 'SatelliteManagement',
    component: SatelliteManagement
  },
  {
    path: '/config/rules',
    name: 'DetectionRules',
    component: DetectionRules
  },
  {
    path: '/config/thresholds',
    name: 'AlertThresholds',
    component: AlertThresholds
  },
  // 帮助中心路由
  {
    path: '/help',
    name: 'HelpCenter',
    component: HelpCenter,
    redirect: '/help/quick-start',
    children: [
      {
        path: 'quick-start',
        name: 'QuickStart',
        component: QuickStart
      },
      {
        path: 'feature-manual',
        name: 'FeatureManual',
        component: FeatureManual
      },
      {
        path: 'anomaly-guide',
        name: 'AnomalyGuide',
        component: AnomalyGuide
      },
      {
        path: 'faq',
        name: 'FAQ',
        component: FAQ
      },
      {
        path: 'video-tutorials',
        name: 'VideoTutorials',
        component: VideoTutorials
      },
      {
        path: 'feedback',
        name: 'Feedback',
        component: Feedback
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router