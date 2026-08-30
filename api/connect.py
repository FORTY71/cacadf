import json


def handler(request):
    # Ambil parameter dari query
    user_key = request.query.get("user_key", "")
    serial = request.query.get("serial", "")

    if user_key == "caca":
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "status": "OK",
                "message": "Key diterima",
                "data": {
                    "user_key": user_key,
                    "serial": serial
                }
            })
        }

    return {
        "statusCode": 401,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps({
            "status": "ERROR",
            "message": "Invalid key"
        })
    }
