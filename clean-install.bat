@echo off
echo 正在清理 node_modules 和 package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /q package-lock.json
echo 清理完成！
echo.
echo 正在清理 npm 缓存...
call npm cache clean --force
echo.
echo 正在重新安装依赖...
call npm install
echo.
echo 安装完成！
pause
