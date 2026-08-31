import hashlib
import time
import json
from urllib.parse import urlparse, parse_qs
from http.server import BaseHTTPRequestHandler

SECRET = "Vm8Lk7Uj2JmsjCPVPVjrLa7zgfx3uz9E"

def build_response(user_key: str, serial: str) -> dict:
    user_key = user_key.strip()
    serial = serial.strip()

    raw = f"MLBB-{serial}-{user_key}-{SECRET}"
    token = hashlib.md5(raw.encode()).hexdigest()
    
    now = int(time.time())
    return {
        "status": 1,
        "data": "999999",
        "token": token,
        "rng": now,
        "server_time": now,
        "reason": "",
    }

# VERCEL WAJIB MENGGUNAKAN NAMA CLASS 'handler' (HURUF KECIL)
class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get("Content-Length") or 0)
        body = self.rfile.read(length).decode(errors="replace")
        
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
