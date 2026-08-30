import json
import time
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs

SECRET = "SKYBAGSDISTRICTB7"
GAME = "PUBG"

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # 1. Baca ukuran data yang masuk
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length).decode("utf-8", "replace")
        
        user_key = ""
        serial = ""
        
        # 2. Deteksi otomatis format pengiriman data (JSON vs URL-encoded)
        try:
            # Coba parsing sebagai JSON
            data = json.loads(body)
            user_key = data.get("user_key", "")
            serial = data.get("serial", "")
        except json.JSONDecodeError:
            # Jika gagal, fallback ke parsing form data standar
            params = parse_qs(body)
            user_key = params.get("user_key", [""])[0]
            serial = params.get("serial", [""])[0]

        # 3. Rakit token
        now = int(time.time())
        token = f"{GAME}-{user_key}-{serial}-{SECRET}"
        
        # Log terminal untuk memastikan data "caca" benar-benar masuk
        print(f"[DEBUG] Terima POST -> body mentah: {body}")
        print(f"[DEBUG] Terbaca -> user_key: {user_key} | serial: {serial}")
        
        # 4. Siapkan respons
        resp = json.dumps({
            "data": {
                "token": token,
                "rng": now + 300,
                "EXP": now + 2592000
            }
        })

        # 5. Kirim balasan ke klien (Typo diperbaiki)
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(resp)))
        self.end_headers()
        self.wfile.write(resp.encode("utf-8"))

# Tambahan: Blok untuk menjalankan server secara langsung
if __name__ == "__main__":
    port = 8080
    server = HTTPServer(("0.0.0.0", port), handler)
    print(f"Server berjalan di http://0.0.0.0:{port}...")
    server.serve_forever()
