import time
from urllib.parse import parse_qs


SECRET = "SKYBAGSDISTRICTB7"
GAME = "PUBG"


def handler(request):
    # Ambil body POST
    body = request.body.decode("utf-8") if request.body else ""

    params = parse_qs(body)

    user_key = params.get("user_key", [""])[0]
    serial = params.get("serial", [""])[0]

    now = int(time.time())

    token = f"{GAME}-{user_key}-{serial}-{SECRET}"

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": {
            "status": "OK",
            "data": {
                "token": token,
                "rng": now + 300,
                "EXP": now + 2592000
            }
        }
    }
