const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

// 为了避免 GPU 进程频繁崩溃，这里尽量使用「默认」的 Electron GPU 配置
// 不再强行修改大量 GPU / WebGL 相关开关，先保证客户端稳定运行
//
// 如需进一步排查 GPU 问题，可以按需、逐个开启下面这些调试开关：
// app.commandLine.appendSwitch('ignore-gpu-blacklist')
// app.commandLine.appendSwitch('enable-gpu-rasterization')
// app.commandLine.appendSwitch('enable-gpu-debugging')

let mainWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    frame: true,
    titleBarStyle: 'default',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      webgl: true, // 启用 WebGL 支持
      enableRemoteModule: false,
      // 一些通用的性能 / 行为设置
      backgroundThrottling: false, // 防止后台节流
      offscreen: false // 确保使用屏幕渲染
    }
  })

  // 开发环境加载 Vite 开发服务器，生产环境加载打包后的文件
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // 监听 WebGL 上下文创建事件
  mainWindow.webContents.on('did-finish-load', () => {
    // 延迟检查，确保上下文稳定
    setTimeout(() => {
      // 注入脚本检查 WebGL 支持（更详细的检测）
      mainWindow.webContents.executeJavaScript(`
        (function() {
          try {
            const canvas = document.createElement('canvas');
            const contextOptions = {
              antialias: true,
              depth: true,
              stencil: false,
              alpha: false,
              premultipliedAlpha: false,
              preserveDrawingBuffer: false,
              failIfMajorPerformanceCaveat: false,
              powerPreference: 'high-performance'
            };
            
            // 先尝试 WebGL 1.0（更兼容 Electron）
            let gl = canvas.getContext('webgl', contextOptions) || 
                     canvas.getContext('experimental-webgl', contextOptions) ||
                     canvas.getContext('webgl2', contextOptions);
            
            if (gl) {
              // 测试上下文是否真的可用
              try {
                const version = gl.getParameter(gl.VERSION);
                const vendor = gl.getParameter(gl.VENDOR);
                const renderer = gl.getParameter(gl.RENDERER);
                
                console.log('[Electron] WebGL is supported');
                console.log('[Electron] WebGL Version:', version);
                console.log('[Electron] WebGL Vendor:', vendor);
                console.log('[Electron] WebGL Renderer:', renderer);
                
                // 检查扩展支持
                const extensions = gl.getSupportedExtensions();
                console.log('[Electron] WebGL Extensions count:', extensions ? extensions.length : 0);
                
                return true;
              } catch (e) {
                console.error('[Electron] WebGL context created but not usable:', e);
                return false;
              }
            } else {
              console.error('[Electron] WebGL is NOT supported - cannot create context');
              return false;
            }
          } catch (e) {
            console.error('[Electron] WebGL check error:', e);
            return false;
          }
        })();
      `).catch(err => console.error('[Electron] WebGL check error:', err))
    }, 500)
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC 通信处理
ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})

ipcMain.handle('minimize-window', () => {
  if (mainWindow) mainWindow.minimize()
})

ipcMain.handle('maximize-window', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  }
})

ipcMain.handle('close-window', () => {
  if (mainWindow) mainWindow.close()
})
