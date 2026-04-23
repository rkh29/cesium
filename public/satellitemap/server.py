#!/usr/bin/env python3
"""Simple HTTP server for satellitemap local files"""
import http.server
import socketserver
import os
import webbrowser
import threading

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, format, *args):
        pass  # Suppress request logs

def open_browser():
    import time
    time.sleep(1)
    webbrowser.open(f'http://localhost:{PORT}/satellitemap.html')

print(f"启动本地服务器...")
print(f"目录: {DIRECTORY}")
print(f"地址: http://localhost:{PORT}/satellitemap.html")
print(f"按 Ctrl+C 停止服务器")
print()

threading.Thread(target=open_browser, daemon=True).start()

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n服务器已停止")
