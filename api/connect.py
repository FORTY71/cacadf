import hashlib
import time
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

SECRET = "Vm8Lk7Uj2JmsjCPVPVjrLa7zgfx3uz9E"


def build_response(user_key: str, serial: str) -> dict:
    # client computes: MD5("MLBB" + "-" + serial + "-" + user_key + "-" + SECRET)
    # order per disasm: sp+0x30 (serial arg) appended before sp+8 (user_key arg)
    raw = f"MLBB-{serial}-{user_key}-{SECRET}"
    token = hashlib.md5(raw.encode()).hexdigest()
    now = int(time.time())
    return {
        "status": 1,
        "data": "999999",          # EXP credited (string)
        "token": token,            # must match client-side MD5 or login rejected
        "rng": now,                # freshness value
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
        params = {}
        for part in body.split("&"):
            if "=" in part:
                k, v = part.split("=", 1)
                params[k] = v
        user_key = params.get("user_key", "")
        serial = params.get("serial", "")
        resp = build_response(user_key, serial)
        payload = json.dumps(resp).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self):
        # convenience: /connect via GET returns the same shape (params in query)
        from urllib.parse import urlparse, parse_qs
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
    ThreadingHTTPServer(("0.0.0.0", 3000), Handler).serve_forever()
