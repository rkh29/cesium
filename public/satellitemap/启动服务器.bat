@echo off
echo 正在启动本地服务器...
echo 请在浏览器中打开: http://localhost:8080/satellitemap.html
echo.
echo 按 Ctrl+C 可以停止服务器
echo.
cd /d "%~dp0"
python -m http.server 8080
pause
