# 客户端连接 Mock 服务器配置说明

## 一、创建环境变量文件

在项目根目录 `F:\一些日常\C4\Frontend\` 下创建 `.env.development` 文件，内容如下：

```
VITE_API_BASE_URL=http://localhost:8080
```

## 二、启动 Mock 服务器

在**第一个终端窗口**中运行：

```powershell
cd "F:\一些日常\C4\Frontend"
node mock-server.cjs
```

看到以下输出表示启动成功：
```
Mock API server running on http://localhost:8080
```

## 三、启动 Electron 客户端

在**第二个终端窗口**中运行：

```powershell
cd "F:\一些日常\C4\Frontend"
npm run dev:electron
```

这会：
1. 启动 Vite 开发服务器（http://localhost:3000）
2. 自动打开 Electron 桌面窗口
3. 客户端会自动连接到 http://localhost:8080 的 Mock 服务器

## 四、连接原理

### 配置流程：

1. **`.env.development`** 文件设置 `VITE_API_BASE_URL=http://localhost:8080`
2. **`src/api/index.ts`** 读取环境变量，自动构建 API 基础 URL：
   - 如果设置了 `VITE_API_BASE_URL`，会使用 `${VITE_API_BASE_URL}/api`
   - 例如：`http://localhost:8080/api`
3. **`vite.config.ts`** 中的代理配置：
   - 如果设置了 `VITE_API_BASE_URL`，**不使用代理**
   - 如果没有设置，会使用代理到 `http://172.30.106.121:8080`

### 连接方式：

- **方式 1（推荐）**：使用 `.env.development` 配置
  - 设置 `VITE_API_BASE_URL=http://localhost:8080`
  - 客户端直接请求 `http://localhost:8080/api/*`
  - 适用于 Electron 客户端和浏览器访问

- **方式 2**：使用 Vite 代理（不推荐用于 Electron）
  - 删除或注释 `.env.development` 中的 `VITE_API_BASE_URL`
  - 客户端请求 `/api/*`，Vite 代理到 `http://172.30.106.121:8080`
  - 仅适用于浏览器访问，Electron 可能无法使用代理

## 五、切换到真实后端

如果需要连接真实后端（WSL），修改 `.env.development`：

```
VITE_API_BASE_URL=http://172.24.164.68:8080
```

然后重启 Electron 客户端。

## 六、验证连接

1. 打开 Electron 客户端
2. 登录后，查看浏览器开发者工具（Electron 中按 F12）
3. 在 Network 标签中，应该看到请求发送到 `http://localhost:8080/api/*`
4. 如果看到数据返回，说明连接成功

## 七、常见问题

### Q: 客户端无法连接到 Mock 服务器？
A: 检查：
1. Mock 服务器是否已启动（`node mock-server.cjs`）
2. `.env.development` 文件是否存在且配置正确
3. 重启 Electron 客户端（环境变量需要重启才能生效）

### Q: 如何确认使用的是 Mock 还是真实后端？
A: 查看浏览器开发者工具的 Network 标签，请求的 URL 会显示：
- Mock: `http://localhost:8080/api/*`
- 真实后端: `http://172.24.164.68:8080/api/*`

### Q: 修改 `.env.development` 后没有生效？
A: 需要重启 Vite 开发服务器和 Electron 客户端。
