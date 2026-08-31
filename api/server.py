import hashlib
import time
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

SECRET = "Vm8Lk7Uj2JmsjCPVPVjrLa7zgfx3uz9E"
# reverse: MD5("MLBB" + "-" + user_key + "-" + serial + "-" + SECRET)


def build_response(user_key: str, serial: str) -> dict:
    raw = f"MLBB-{user_key}-{serial}-{SECRET}"
    token = hashlib.md5(raw.encode()).hexdigest()
    now = int(time.time())
    return {
        "status": True,                  # JSON boolean — client compares == true
        "reason": "",
        "data": {                        # nested object — client reads data.token, data.rng, data.EXP
            "token": token,
            "rng": now,                  # server epoch; client requires >= now-30 else "Server timestamp expired"
            "EXP": "99999",              # EXP credited (string)
        },
    }


class Handler(BaseHTTPRequestHandler):
    def _send(self, resp: dict):
        payload = json.dumps(resp).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def _params(self, qs: str) -> dict:
        params = {}
        for part in qs.split("&"):
            if "=" in part:
                k, v = part.split("=", 1)
                from urllib.parse import unquote_plus
                params[k] = unquote_plus(v)
        return params

    def do_POST(self):
        if self.path.split("?")[0] != "/connect":
            self.send_response(404); self.end_headers(); return
        length = int(self.headers.get("Content-Length") or 0)
        body = self.rfile.read(length).decode(errors="replace")
        p = self._params(body)
        self._send(build_response(p.get("user_key", ""), p.get("serial", "")))

    def do_GET(self):
        from urllib.parse import urlparse
        if self.path.split("?")[0] != "/connect":
            self.send_response(404); self.end_headers(); return
        p = self._params(urlparse(self.path).query)
        self._send(build_response(p.get("user_key", ""), p.get("serial", "")))

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0", 3000), Handler).serve_forever()
