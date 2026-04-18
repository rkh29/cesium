# OpenSN 卫星网络仿真监控系统 - 完整部署指南

## 项目说明

本项目是一个卫星网络仿真监控系统，包含：
- **前端**：Vue3 + Vite + Cesium 可视化界面
- **后端**：Go语言编写的NodeDaemon监控服务
- **依赖**：Docker容器运行卫星节点、InfluxDB时序数据库、etcd配置中心

---

## 文件说明

- `backend_backup_YYYYMMDD_HHMMSS.tar.gz` - 后端代码备份（WSL环境）
- `frontend_backup_1.tar.gz` - 前端代码备份
- `x.md` - 本部署文档

---

## 系统架构

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Windows主机    │     │   WSL2 (Ubuntu)  │     │   Docker容器    │
│                 │     │                 │     │                 │
│  ┌───────────┐  │     │  ┌───────────┐  │     │  ┌───────────┐  │
│  │ 前端(3000)│  │◄────┼──┤NodeDaemon │  │◄────┼──┤卫星容器    │  │
│  │ Vue3+Vite │  │     │  │  (8080)   │  │     │  │(Satellite)│  │
│  └───────────┘  │     │  └───────────┘  │     │  └───────────┘  │
│                 │     │        │        │     │        │        │
│  浏览器访问      │     │        ▼        │     │        ▼        │
│  localhost:3000 │     │  ┌───────────┐  │     │  ┌───────────┐  │
│                 │     │  │ InfluxDB  │  │     │  │ 路由器容器 │  │
│                 │     │  │ (8086)    │  │     │  │ (Router)  │  │
│                 │     │  └───────────┘  │     │  └───────────┘  │
│                 │     │        │        │     │                 │
│                 │     │        ▼        │     │                 │
│                 │     │  ┌───────────┐  │     │                 │
│                 │     │  │   etcd    │  │     │                 │
│                 │     │  │ (2379)    │  │     │                 │
│                 │     │  └───────────┘  │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## 一、环境准备

### 1.1 Windows主机要求

- Windows 10/11 (推荐Windows 11)
- 已安装 WSL2 (Windows Subsystem for Linux)
- 已安装 Docker Desktop for Windows
- 已安装 Node.js 16+ 和 npm

### 1.2 安装WSL2

如果还没有安装WSL2，以管理员身份运行PowerShell：

```powershell
# 安装WSL2
wsl --install

# 安装完成后重启电脑，然后设置默认WSL版本为2
wsl --set-default-version 2

# 安装Ubuntu (如果还没有安装)
wsl --install -d Ubuntu
```

### 1.3 安装Docker Desktop

1. 下载安装包：https://www.docker.com/products/docker-desktop/
2. 安装时勾选 "Use WSL 2 instead of Hyper-V"
3. 安装完成后，在Docker Desktop设置中：
   - Settings → General → 勾选 "Use the WSL 2 based engine"
   - Settings → Resources → WSL Integration → 启用Ubuntu集成

### 1.4 验证Docker安装

在WSL中执行：

```bash
# 打开WSL终端
wsl

# 验证Docker可用
docker --version
# 应该显示类似：Docker version 24.0.7, build afdd53b

# 验证Docker Compose可用
docker-compose --version

# 测试Docker运行
docker run hello-world
```

---

## 二、Docker环境准备

### 2.1 拉取必要的Docker镜像

在WSL中执行以下命令准备Docker环境：

```bash
# 进入WSL
wsl

# 创建目录
cd ~
mkdir -p c4/backend
cd c4/backend

# 解压后端代码（假设备份文件在E盘）
# 注意：先不要解压，等后面步骤一起处理
```

### 2.2 准备Docker镜像文件

后端备份中应该包含以下Docker镜像tar包，需要导入：

```bash
# 在WSL中执行，假设后端已解压到 ~/c4/backend

# 导入基础镜像
cd ~/c4/backend/dependencies
sudo docker load -i opensn_influxdb.tar.gz
sudo docker load -i opensn_etcd.tar.gz
sudo docker load -i opensn_codeserver.tar.gz

# 导入节点镜像
cd ~/c4/backend/opensn_build/node-images
sudo docker load -i node-image-base.tar.gz
sudo docker load -i satellite-router-node.tar.gz
sudo docker load -i ground-station-node.tar.gz

# 验证镜像已导入
docker images | grep opensn
```

### 2.3 启动基础服务容器

```bash
# 启动InfluxDB (时序数据库)
docker run -d \
  --name opensn_influxdb \
  -p 8086:8086 \
  -v influxdb-data:/var/lib/influxdb2 \
  opensn_influxdb:latest

# 启动etcd (配置中心)
docker run -d \
  --name opensn_etcd3 \
  -p 2379:2379 \
  -p 2380:2380 \
  realssd/opensn_etcd:latest \
  etcd --listen-client-urls http://0.0.0.0:2379 \
       --advertise-client-urls http://0.0.0.0:2379

# 验证容器运行状态
docker ps
```

---

## 三、后端部署（WSL环境）

### 3.1 解压后端代码

将 `backend_backup_YYYYMMDD_HHMMSS.tar.gz` 复制到Windows桌面，然后在WSL中解压：

```bash
# 在WSL中执行
cd ~

# 从Windows桌面复制并解压
sudo tar -xzf /mnt/e/Desktop/backend_backup_20260225_075554.tar.gz

# 验证目录结构
ls -la ~/c4/backend/
# 应该看到：container-base, daemon, dependencies, opensn_build 等目录
```

### 3.2 配置NodeDaemon

```bash
# 进入NodeDaemon目录
cd ~/c4/backend/daemon/opensn-daemon

# 查看配置文件
cat config/config.json
```

配置文件示例：
```json
{
  "node_name": "node-1",
  "node_ip": "172.30.106.121",
  "interface": "eth0",
  "port": 8080,
  "is_master": true,
  "etcd_endpoints": ["172.30.106.121:2379"],
  "influxdb_url": "http://172.30.106.121:8086",
  "docker_endpoint": "unix:///var/run/docker.sock"
}
```

**重要**：根据你的WSL IP地址修改配置：

```bash
# 获取WSL IP地址
wsl hostname -I
# 输出类似：172.30.106.121

# 修改配置文件中的IP地址
sed -i 's/172.30.106.121/你的WSL_IP/g' ~/c4/backend/daemon/opensn-daemon/config/config.json
```

### 3.3 启动NodeDaemon

```bash
# 进入NodeDaemon目录
cd ~/c4/backend/daemon/opensn-daemon

# 清理runtime目录（首次启动或重启时建议执行）
sudo rm -rf ~/c4/backend/daemon/opensn-daemon/runtime
sudo mkdir -p ~/c4/backend/daemon/opensn-daemon/runtime/share
sudo chown -R $USER:$USER ~/c4/backend/daemon/opensn-daemon/runtime

# 使用nohup启动NodeDaemon（防止终端关闭后进程退出）
nohup ./NodeDaemon > /tmp/nodedaemon.log 2>&1 &

# 查看启动日志
tail -f /tmp/nodedaemon.log
```

看到以下日志表示启动成功：
```
[INFO] Init Config Success, Config is {...}
[INFO] Run InstanceManage Module.
[INFO] Run MonitorModule Module.
[GIN-debug] Listening and serving HTTP on :8080
```

### 3.4 验证后端API

```bash
# 测试实例列表API
curl -s http://127.0.0.1:8080/api/instance/list

# 测试监控数据API
curl -s http://127.0.0.1:8080/api/resource/last/instance/all

# 查看NodeDaemon进程
ps aux | grep NodeDaemon
```

---

## 四、前端部署（Windows主机）

### 4.1 解压前端代码

将 `frontend_backup_1.tar.gz` 复制到Windows任意目录，例如 `E:\projects\`：

```powershell
# 在PowerShell中执行
# 创建项目目录
mkdir E:\projects\opensn
cd E:\projects\opensn

# 解压前端代码（使用7-Zip或tar命令）
tar -xzf E:\Desktop\frontend_backup_1.tar.gz

# 验证目录结构
dir E:\projects\opensn\1
# 应该看到：src, public, package.json, vite.config.ts 等文件
```

### 4.2 安装前端依赖

```powershell
# 进入前端目录
cd E:\projects\opensn\1

# 安装依赖（首次需要较长时间）
npm install

# 如果安装失败，可以尝试使用淘宝镜像
npm install --registry=https://registry.npmmirror.com
```

### 4.3 配置前端代理

编辑 `vite.config.ts` 文件，修改WSL IP地址：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium'

export default defineConfig({
  plugins: [vue(), cesium()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://172.30.106.121:8080',  // 修改为你的WSL IP
        changeOrigin: true
      }
    }
  }
})
```

**获取WSL IP的方法**：
```powershell
# 在PowerShell中执行
wsl hostname -I
```

### 4.4 启动前端

```powershell
# 在前端目录中执行
cd E:\projects\opensn\1
npm run dev
```

启动成功后显示：
```
VITE v6.4.1  ready in 2535 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
➜  press h + enter to show help
```

### 4.5 访问系统

打开浏览器访问：**http://localhost:3000**

---

## 五、完整启动流程总结

### 5.1 每次开机后的启动顺序

**第一步：启动WSL**
```powershell
# 在PowerShell中执行
wsl
```

**第二步：启动Docker基础服务（如果未自动启动）**
```bash
# 在WSL中执行
docker start opensn_influxdb
docker start opensn_etcd

# 验证
docker ps
```

**第三步：启动NodeDaemon**
```bash
# 在WSL中执行
cd ~/c4/backend/daemon/opensn-daemon
nohup ./NodeDaemon > /tmp/nodedaemon.log 2>&1 &

# 验证
curl -s http://127.0.0.1:8080/api/instance/list | wc -c
```

**第四步：启动前端**
```powershell
# 在PowerShell中执行（新开一个窗口）
cd E:\projects\opensn\1
npm run dev
```

**第五步：浏览器访问**
打开 http://localhost:3000

---

## 六、后端代码改动说明

### 6.1 修改 `utils/monitor.go`

**改动目的**：添加docker stats支持，兼容WSL2环境

**主要改动**：
1. 添加 `context`、`os/exec`、`time` 包导入
2. 添加 `parseMemString()` 函数用于解析内存字符串
3. 修改 `GetInstanceResourceInfo()` 函数：
   - 添加 `containerName` 参数
   - 优先使用 `docker stats` 命令获取CPU和内存数据
   - 添加10秒超时控制
   - 如果docker stats失败，回退到cgroup方式

**关键代码**：
```go
// 首先尝试使用 Docker Stats 命令行工具（兼容 WSL2）
if containerName != "" {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    cmd := exec.CommandContext(ctx, "docker", "stats", containerName, "--no-stream", "--format", "{{.CPUPerc}}|{{.MemUsage}}")
    output, err := cmd.CombinedOutput()
    if err == nil {
        // 解析输出
        parts := strings.Split(strings.TrimSpace(string(output)), "|")
        if len(parts) == 2 {
            // 解析 CPU 使用率
            cpuStr := strings.TrimSuffix(strings.TrimSpace(parts[0]), "%")
            cpuPercent, err := strconv.ParseFloat(cpuStr, 64)
            if err == nil {
                // 解析内存使用
                memParts := strings.Split(parts[1], "/")
                if len(memParts) >= 1 {
                    memStr := strings.TrimSpace(memParts[0])
                    memBytes := parseMemString(memStr)
                    return &InstanceResouceRaw{
                        CPUBusy:     cpuPercent,
                        MemByte:     memBytes,
                        SwapMemByte: 0,
                    }, nil
                }
            }
        }
    }
    // Docker stats 失败，记录日志但继续尝试 cgroup 方法
    if err != nil {
        logrus.Warnf("Docker stats failed for %s, falling back to cgroup: %v", instanceID, err)
    }
}
```

### 6.2 修改 `pkg/module/monitor_module.go`

**改动目的**：修复CPU数据计算逻辑，直接使用docker stats返回的百分比

**原版代码**：
```go
structs.Map(utils.InstanceResouce{
    CPUUsage:    (thisInfo.CPUBusy - prevInfo.CPUBusy) / (totalTimeMs),
    MemByte:     (thisInfo.MemByte + prevInfo.MemByte) / 2,
    SwapMemByte: (thisInfo.SwapMemByte + prevInfo.SwapMemByte) / 2,
})
```

**修改后代码**：
```go
structs.Map(utils.InstanceResouce{
    CPUUsage:    thisInfo.CPUBusy,
    MemByte:     thisInfo.MemByte,
    SwapMemByte: thisInfo.SwapMemByte,
})
```

**改动原因**：
- 原版代码假设 `CPUBusy` 是cgroup的CPU累计时间（纳秒），需要计算差值和除法得到使用率
- docker stats 直接返回的是即时的CPU使用率百分比（如5.06%），不需要再计算
- 因此直接使用 `thisInfo.CPUBusy` 即可

### 6.3 配置文件修改

**`opensn-daemon/config/config.json`**：
- 将网络接口从 `ens160` 改为 `eth0`（WSL默认网卡）

---

## 七、常见问题排查

### 7.1 NodeDaemon启动后立即退出

**现象**：执行 `./NodeDaemon` 后进程消失

**原因**：终端关闭时发送SIGHUP信号

**解决**：使用 `nohup` 启动
```bash
nohup ./NodeDaemon > /tmp/nodedaemon.log 2>&1 &
```

### 7.2 CPU数据显示为0

**现象**：前端显示CPU使用率为0%

**原因**：WSL2不支持cgroup，原版代码无法获取CPU数据

**解决**：已添加docker stats支持，直接使用docker命令获取

**验证**：
```bash
# 检查docker stats是否正常工作
docker stats Satellite_e508cd1a --no-stream

# 检查NodeDaemon日志
grep "Docker stats" /tmp/nodedaemon.log
```

### 7.3 前端无法连接后端

**现象**：前端页面显示连接错误

**原因**：WSL IP地址变化或NodeDaemon未启动

**解决步骤**：
1. 检查WSL IP地址
   ```powershell
   wsl hostname -I
   ```

2. 检查NodeDaemon是否运行
   ```bash
   wsl ps aux | grep NodeDaemon
   ```

3. 检查API是否可访问
   ```bash
   wsl curl -s http://127.0.0.1:8080/api/instance/list
   ```

4. 更新前端代理配置
   修改 `vite.config.ts` 中的 `target` 为当前WSL IP

### 7.4 docker stats命令超时

**现象**：日志显示 `Docker stats failed: signal: killed`

**原因**：默认超时时间太短

**解决**：已将超时时间从3秒增加到10秒

### 7.5 端口被占用

**现象**：启动NodeDaemon或前端时提示端口已被占用

**解决**：
```bash
# 查找占用8080端口的进程
wsl lsof -i :8080

# 杀死进程
wsl kill -9 <PID>

# 或者修改NodeDaemon配置使用其他端口
```

---

## 八、技术要点

### 8.1 WSL2兼容性问题

WSL2使用轻量级虚拟机，与原生Linux有以下区别：
1. **cgroup支持不完整**：无法通过 `/sys/fs/cgroup` 读取容器资源
2. **PID命名空间隔离**：容器PID在主机上不可见
3. **网络架构不同**：使用虚拟网卡 `eth0` 而非物理网卡

### 8.2 解决方案

使用 `docker stats` 命令行工具替代cgroup读取：
- ✅ 不依赖cgroup文件系统
- ✅ 通过Docker API获取数据，与WSL2兼容
- ✅ 直接返回CPU使用率百分比，无需计算

### 8.3 数据流向

```
docker stats → monitor.go → monitor_module.go → InfluxDB → API → 前端
     5.06%    →  5.06     →      5.06         →  存储   → 5.06% → 显示
```

---

## 九、备份和恢复

### 9.1 备份当前状态

```bash
# 在WSL中备份后端
cd ~
sudo tar -czf /mnt/e/desktop/backend_backup_$(date +%Y%m%d_%H%M%S).tar.gz c4/backend

# 在Windows中备份前端
cd E:\projects\opensn
tar -czf E:\desktop\frontend_backup_$(Get-Date -Format "yyyyMMdd_HHmmss").tar.gz 1
```

### 9.2 从备份恢复

按照本指南第三、四章节的步骤操作即可。

---

## 十、联系和支持

如有问题，请检查：
1. NodeDaemon日志：`/tmp/nodedaemon.log`
2. Docker容器状态：`docker ps -a`
3. 前端控制台日志（浏览器F12）

---

**文档版本**：v1.0  
**最后更新**：2026-02-25  
**适用系统**：Windows 10/11 + WSL2 + Docker Desktop
