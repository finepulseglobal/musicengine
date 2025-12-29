import json
from urllib.parse import parse_qs

def handler(request):
    if request.get('method') == 'POST':
        try:
            # Parse form data
            if hasattr(request, 'body'):
                data = json.loads(request.body)
            else:
                data = json.loads(request.get('body', '{}'))
            
            # Prepare row data for Google Sheets
            row_data = [
                data.get('title', ''),
                data.get('work_type', ''),
                data.get('iswc', ''),
                data.get('isrc', ''),
                data.get('duration', ''),
                data.get('description', ''),
                ', '.join(data.get('territories', [])),
                data.get('primary_artist', ''),
                ', '.join(data.get('featured_artists', [])),
                data.get('label_name', ''),
                # Writers data (flatten first writer)
                data.get('writers', [{}])[0].get('name', '') if data.get('writers') else '',
                data.get('writers', [{}])[0].get('ipi', '') if data.get('writers') else '',
                data.get('writers', [{}])[0].get('isni', '') if data.get('writers') else '',
                str(data.get('writers', [{}])[0].get('share', '')) if data.get('writers') else '',
                data.get('writers', [{}])[0].get('role', '') if data.get('writers') else '',
                # Publishers data (flatten first publisher)
                data.get('publishers', [{}])[0].get('name', '') if data.get('publishers') else '',
                data.get('publishers', [{}])[0].get('ipi', '') if data.get('publishers') else '',
                data.get('publishers', [{}])[0].get('isni', '') if data.get('publishers') else '',
                str(data.get('publishers', [{}])[0].get('share', '')) if data.get('publishers') else '',
                # Files
                data.get('files', {}).get('audio', ''),
                data.get('files', {}).get('artwork', ''),
                data.get('files', {}).get('lyrics', ''),
                # Additional writers/publishers as JSON
                json.dumps(data.get('writers', [])[1:]) if len(data.get('writers', [])) > 1 else '',
                json.dumps(data.get('publishers', [])[1:]) if len(data.get('publishers', [])) > 1 else ''
            ]
            
            # Google Sheets Web App URL (you'll need to create this)
            sheets_url = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
            
            # For now, return success with the data that would be sent
            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({
                    "success": True,
                    "message": "Data prepared for Google Sheets",
                    "data": {
                        "work_id": f"WRK_{hash(data.get('title', ''))%10000:04d}",
                        "title": data.get('title'),
                        "writers_count": len(data.get('writers', [])),
                        "publishers_count": len(data.get('publishers', [])),
                        "territories": len(data.get('territories', [])),
                        "row_data": row_data
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
        "statusCode": 405,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({"error": "Method not allowed"})
    }