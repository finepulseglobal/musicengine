def handler(request):
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": '{"success": true, "data": {"work_id": "12345", "message": "Work registered"}}'
    }