import hashlib
import time
import json
from urllib.parse import urlparse, parse_qs
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

SECRET = "Vm8Lk7Uj2JmsjCPVPVjrLa7zgfx3uz9E"

def build_response(user_key: str, serial: str) -> dict:
    # 1. Bersihkan spasi atau karakter enter (\n) tak terlihat dari input
    user_key = user_key.strip()
    serial = serial.strip()

    raw = f"MLBB-{serial}-{user_key}-{SECRET}"
    token = hashlib.md5(raw.encode()).hexdigest()
    
    # 2. OPSI: Banyak aplikasi C++/Android mewajibkan hash MD5 dalam huruf besar.
    # Jika setelah script ini dijalankan masih error, hilangkan tanda '#' di bawah ini:
    token = token.upper()

    now = int(time.time())
    return {
        "status": 1,
        "data": "999999",
        "token": token,
        "rng": now,
        "server_time": now,
        "reason": "",
    }


class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/connect":
            self.send_response(404)
            self.end_headers()
            return
        
        length = int(self.headers.get("Content-Length") or 0)
        body = self.rfile.read(length).decode(errors="replace")
        
        # 3. PERBAIKAN: Gunakan parse_qs alih-alih split manual
        # Ini mengatasi masalah URL-encoding dan karakter tersembunyi
        params = parse_qs(body)
        user_key = params.get("user_key", [""])[0]
        serial = params.get("serial", [""])[0]
        
        resp = build_response(user_key, serial)
        payload = json.dumps(resp).encode()
        
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self):
        if self.path.split("?")[0] != "/connect":
            self.send_response(404)
            self.end_headers()
            return
        
        q = parse_qs(urlparse(self.path).query)
        user_key = q.get("user_key", [""])[0]
        serial = q.get("serial", [""])[0]
        
        resp = build_response(user_key, serial)
        payload = json.dumps(resp).encode()
        
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    print("Server berjalan di port 3000...")
    ThreadingHTTPServer(("0.0.0.0", 3000), Handler).serve_forever()
