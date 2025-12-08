import http.server
import socketserver
import os

PORT = 8081
DIRECTORY = os.getcwd()

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()

    extensions_map = {
        '.manifest': 'text/cache-manifest',
        '.html': 'text/html',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.svg': 'image/svg+xml',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '': 'application/octet-stream', # Default
    }

print(f"Serving {DIRECTORY} on port {PORT}")
print(f"Access at http://localhost:{PORT}/web-pwa/")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()
