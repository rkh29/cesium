# 卫星互联网运维系统 - 前端重构设计方案 (Design-3)

## 1. 设计概述

本方案结合了 `Design-1` 的视觉风格与功能需求，以及 `Design-2` 的架构设计与 Cesium.js 深度集成方案。目标是构建一个**现代化、高科技感、高性能**的卫星互联网运维系统前端。

## 2. 技术栈

-   **核心框架**: Vue 3 (Composition API) + TypeScript
-   **构建工具**: Vite
-   **状态管理**: Pinia
-   **路由管理**: Vue Router
-   **UI 组件库**: Element Plus (定制深色主题)
-   **3D 可视化**: Cesium.js (核心地球引擎)
-   **数据可视化**: ECharts (2D 图表)
-   **样式处理**: SCSS + CSS Variables (实现霓虹/玻璃拟态风格)

## 3. 视觉风格设计

采用**“赛博朋克 / 未来科技”**风格：

-   **背景**: 深空蓝/黑 (`#0A0E27`)，强调宇宙深邃感。
-   **主色调**: 
    -   核心蓝: `#00D4FF` (科技、正常)
    -   荧光绿: `#00FF88` (成功、在线)
    -   警示红: `#FF6B6B` (异常、告警)
-   **质感**: 
    -   **玻璃拟态 (Glassmorphism)**: 侧边栏和悬浮面板采用半透明磨砂效果，背景模糊 (`backdrop-filter: blur(10px)`).
    -   **霓虹光晕**: 关键元素（如选中状态、告警图标）增加外发光效果 (`box-shadow`).
    -   **细边框**: 1px 极细边框，配合高亮色。

## 4. 系统架构 (基于 Design-2)

```mermaid
graph TD
    A[表现层 (View)] -->|数据驱动| B[状态层 (Pinia)]
    B -->|状态同步| C[业务逻辑层 (Composables)]
    C -->|指令/数据| D[可视化层 (Cesium/ECharts)]
    
    subgraph 可视化层
    E[Cesium Viewer]
    F[ECharts Panels]
    end
```

### 4.1 目录结构规划

```
src/
├── assets/             # 静态资源 (图片、样式)
├── components/         # 公共组件
│   ├── cesium/         # Cesium 相关组件 (Viewer, Entities)
│   ├── charts/         # ECharts 封装组件
│   └── common/         # 通用 UI 组件 (Card, Panel)
├── composables/        # 组合式函数 (useCesium, useSatellite)
├── layout/             # 布局组件 (Header, Sidebar)
├── stores/             # Pinia 状态库
├── views/              # 页面视图
│   ├── dashboard/      # 总览大屏
│   ├── monitor/        # 实时监控
│   └── config/         # 系统配置
└── App.vue             # 根组件
```

## 5. 核心模块设计

### 5.1 Cesium 集成 (Core Engine)

创建一个全局单例的 Cesium Viewer，通过 `useCesium` composable 进行管理。

-   **初始化优化**:
    -   禁用默认 UI (BaseLayerPicker, Geocoder, etc.)
    -   开启 `requestRenderMode` 降低 GPU 占用。
    -   加载深色/科技感底图 (或纯色星空背景)。
-   **卫星渲染**:
    -   使用 `PointPrimitiveCollection` 或 `BillboardCollection` 渲染大量卫星节点。
    -   使用 `PolylineCollection` 渲染轨道和链路。
    -   支持点击拾取卫星，展示详情弹窗。

### 5.2 布局与交互

-   **Z-Index 分层**:
    -   底层: Cesium Canvas (全屏)
    -   中层: 2D 业务面板 (Dashboard, Charts) - 悬浮在地球之上
    -   顶层: 全局告警、Dialog、Tooltip
-   **交互模式**:
    -   **漫游模式**: 自由缩放、旋转地球。
    -   **跟踪模式**: 锁定特定卫星视角。

### 5.3 数据流

1.  **WebSocket/API** 获取卫星 TLE 数据和遥测数据。
2.  **Pinia Store** 更新卫星位置和状态。
3.  **Cesium Watcher** 监听 Store 变化，更新 3D 场景中的 Entity 属性。

## 6. 开发计划

1.  **环境准备**: 安装 `cesium`, `vite-plugin-cesium`。
2.  **基础建设**: 配置全局样式变量，搭建 Layout 框架。
3.  **Cesium 接入**: 实现 `CesiumViewer.vue` 和 `useCesium.ts`。
4.  **业务迁移**: 将现有 Dashboard 和监控页面重构为悬浮面板形式。
5.  **细节打磨**: 添加玻璃拟态样式和过渡动画。
