import json
import time
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs

SECRET = "SKYBAGSDISTRICTB7"
GAME = "PUBG"


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length).decode("utf-8", "replace")
        params = parse_qs(body)
        user_key = params.get("user_key", [""])[0]
        serial = params.get("serial", [""])[0]
        now = int(time.time())
        token = f"{GAME}-{user_key}-{serial}-{SECRET}"
        resp = json.dumps({
            "status": "OK",
            "data": {
                "token": token,
                "rng": now + 300,
                "EXP": now + 2592000
            }
        })
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(resp)))
        self.end_headers()
        self.wfile.write(resp.encode())
