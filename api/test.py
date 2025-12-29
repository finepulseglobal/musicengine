import json

def handler(request):
    if request.get('method') == 'POST':
        try:
            # Parse form data
            if hasattr(request, 'body'):
                data = json.loads(request.body)
            else:
                data = json.loads(request.get('body', '{}'))
            
            # Return success with submitted data for testing
            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({
                    "success": True,
                    "message": "Test submission successful",
                    "submitted_data": {
                        "workcode": data.get('workcode'),
                        "title": data.get('title'),
                        "primary_artist": data.get('primary_artist'),
                        "songwriters_count": len(data.get('songwriters', [])),
                        "publishers_count": len(data.get('publishers', [])),
                        "territories": data.get('territory'),
                        "all_fields": data
                    }
                })
            }
            
        except Exception as e:
            return {
                "statusCode": 500,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({
                    "success": False,
                    "error": str(e)
                })
            }
    
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({
            "status": "ok",
            "message": "Test API ready"
        })
    }