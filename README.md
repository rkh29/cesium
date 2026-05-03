# 天马星通控制台

卫星-地面站-手机通信前端平台。基于 CesiumJS 的 3D 地球可视化，Element Plus 组件库，Linear 风格暗色系统。

## 技术栈

- **框架**: Vue 3 + TypeScript + Vite
- **3D**: CesiumJS (`vite-plugin-cesium`, Cesium World Terrain)
- **UI**: Element Plus, Linear design system
- **图表**: ECharts
- **状态**: Pinia
- **路由**: Vue Router (hash history)

## 快速开始

```bash
# 安装依赖
npm install

# 复制环境变量文件并填入 Cesium Ion Token（https://ion.cesium.com）
cp .env.example .env

# 启动开发服务器
npm run dev

# 构建（typecheck + build）
npm run build
```

## 环境变量

| 变量 | 用途 | 获取方式 |
|------|------|----------|
| `VITE_CESIUM_ION_TOKEN` | Cesium 地形与底图认证 | [ion.cesium.com](https://ion.cesium.com)（需 `assets:read` 权限） |

## 路由

| 路径 | 页面 | 描述 |
|------|------|------|
| `/` | 仪表盘 | 网络运行指标与 ECharts 监控图 |
| `/earth` | 卫星群视图 | Cesium 3D 地球（卫星 / 地面站 / 地形） |
| `/editor` | 卫星可视编辑 | 3D 地球 + 卫星列表与参数编辑面板 |
| `/instances` | 节点实例 | 节点资源管理 |
| `/links` | 链路拓扑 | 链路管理 |

## 设计系统

基于 [Linear](https://linear.app) 暗色风格：
- 画布: `#08090a`（暗色）/ `#f7f8f8`（浅色）
- 主色: `#5e6ad2`（靛蓝）
- 表面: `rgba(255,255,255,0.02)` 半透明层级
- 字体: 系统原生（-apple-system / PingFang SC / Microsoft YaHei）
- 支持浅色/深色切换（侧栏底部按钮）

## 架构要点

- **Cesium 初始化**: `src/composables/useCesium.ts` — 地形 + ArcGIS 影像 + 相机限制
- **卫星着色**: 按轨道高度（LEO ≤10,000km / MEO 10,000-30,000km / GEO >30,000km）分色
- **认证**: 本地 localStorage，测试账户 `admin/admin`、`operator/ops`、`viewer/viewer`
- **构建验证**: `npm run build`（vue-tsc 类型检查 + vite 构建，无测试框架）
