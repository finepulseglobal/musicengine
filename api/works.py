from http.server import BaseHTTPRequestHandler
import json
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from copyright_core import CopyrightRegistry, CopyrightWork, CopyrightHolder

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Extract work ID from path like /api/works/123
        path_parts = self.path.strip('/').split('/')
        
        if len(path_parts) >= 3 and path_parts[1] == 'works':
            work_id = path_parts[2]
            self._handle_get_work(work_id)
        else:
            self._send_error(404, "Work not found")
    
    def _handle_get_work(self, work_id):
        try:
            # Mock work data - in real app, would fetch from database
            work_data = {
                "work_id": work_id,
                "title": "Sample Work",
                "creator": "Sample Creator",
                "work_type": "musical",
                "creation_date": "2024-01-01",
                "iswc": "T-123456789-0",
                "status": "registered"
            }
            
            self._send_success(work_data)
            
        except Exception as e:
            self._send_error(500, str(e))
    
    def _send_success(self, data):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response = {
            "success": True,
            "data": data
        }
        
        self.wfile.write(json.dumps(response).encode())
    
    def _send_error(self, code, message):
        self.send_response(code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response = {
            "success": False,
            "error": message
        }
        
        self.wfile.write(json.dumps(response).encode())