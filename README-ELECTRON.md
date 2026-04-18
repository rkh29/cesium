# 桌面客户端使用说明

## 概述

本项目已改造为 Electron 桌面客户端，可以直接打包成 Windows 安装包或 ZIP 压缩包供用户下载安装。

## 功能特性

- ✅ 用户登录系统（支持记住登录状态）
- ✅ Cesium 3D 地球可视化
- ✅ 完整的监控和管理功能
- ✅ 与 Web 前端一致的界面和功能
- ✅ 可打包为 Windows 安装程序或 ZIP 压缩包

## 开发环境

### 安装依赖

```bash
npm install
```

### 开发模式运行

**方式 1：仅运行 Web 前端（浏览器访问）**
```bash
npm run dev
```
访问：http://localhost:3000

**方式 2：运行 Electron 桌面客户端**
```bash
npm run dev:electron
```
这会同时启动 Vite 开发服务器和 Electron 窗口。

## 打包发布

### 打包为 ZIP 压缩包（推荐）

```bash
npm run build:zip
```

打包完成后，在 `dist-electron` 目录下会生成：
- `卫星异常检测系统-1.0.0-win.zip` - 可直接分发的 ZIP 压缩包

### 打包为安装程序

```bash
npm run build:win
```

打包完成后，在 `dist-electron` 目录下会生成：
- `卫星异常检测系统 Setup 1.0.0.exe` - Windows 安装程序

## 登录账号

### 测试账号

- **管理员**: `admin` / `admin`
- **操作员**: `operator` / `ops`
- **观察员**: `viewer` / `viewer`

点击登录页面的标签可以快速登录。

## 项目结构

```
Frontend/
├── electron/              # Electron 主进程
│   ├── main.js           # 主进程入口
│   └── preload.js        # 预加载脚本
├── src/
│   ├── views/
│   │   └── Login.vue     # 登录页面
│   ├── stores/
│   │   └── auth.ts       # 认证状态管理
│   ├── router/
│   │   └── index.ts       # 路由配置（含登录路由守卫）
│   └── App.vue            # 根组件（含 Electron 标题栏）
├── package.json           # 项目配置（含 Electron 脚本）
└── vite.config.ts         # Vite 配置（base: './'）
```

## 注意事项

1. **API 地址配置**：通过 `.env.development` 配置 `VITE_API_BASE_URL`
2. **首次打包**：需要下载 Electron 二进制文件，可能需要较长时间
3. **打包后的文件**：在 `dist-electron` 目录下

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **UI 组件**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router
- **3D 可视化**: Cesium
- **桌面框架**: Electron
- **构建工具**: Vite + Electron Builder
