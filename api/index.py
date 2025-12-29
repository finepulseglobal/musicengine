from http.server import BaseHTTPRequestHandler
import json
import sys
import os

# Add the parent directory to the path to import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from copyright_core import CopyrightRegistry, CopyrightWork, CopyrightHolder, RightType, Territory
from cwr_forms import CWRFormBuilder, CWRFormValidator
from blockchain_integration import BlockchainCopyrightAPI

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response = {
            "message": "Copyright Management API",
            "version": "1.0.0",
            "endpoints": {
                "POST /api/works": "Register a new copyright work",
                "POST /api/licenses": "Create a license",
                "POST /api/cwr": "Submit CWR form",
                "POST /api/blockchain/register": "Register work on blockchain",
                "GET /api/works/{id}": "Get work details"
            }
        }
        
        self.wfile.write(json.dumps(response).encode())
    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
        except:
            self._send_error(400, "Invalid JSON")
            return
        
        path = self.path
        
        if path == '/api/works':
            self._handle_create_work(data)
        elif path == '/api/cwr':
            self._handle_cwr_form(data)
        elif path == '/api/blockchain/register':
            self._handle_blockchain_register(data)
        else:
            self._send_error(404, "Endpoint not found")
    
    def _handle_create_work(self, data):
        try:
            registry = CopyrightRegistry()
            
            # Create copyright holder
            creator = CopyrightHolder(
                name=data.get('creator_name', ''),
                entity_type=data.get('entity_type', 'individual')
            )
            registry.register_holder(creator)
            
            # Create work
            work = CopyrightWork(
                title=data.get('title', ''),
                creators=[creator],
                work_type=data.get('work_type', 'literary'),
                iswc=data.get('iswc', ''),
                description=data.get('description', '')
            )
            
            work_id = registry.register_work(work)
            
            self._send_success({
                "work_id": work_id,
                "title": work.title,
                "creator": creator.name,
                "message": "Work registered successfully"
            })
            
        except Exception as e:
            self._send_error(500, str(e))
    
    def _handle_cwr_form(self, data):
        try:
            # Build CWR form from data
            cwr_form = CWRFormBuilder.from_dict(data)
            
            # Validate form
            validation = CWRFormValidator.validate_form(cwr_form)
            
            if not validation.is_valid:
                self._send_error(400, f"Validation failed: {', '.join(validation.errors)}")
                return
            
            self._send_success({
                "message": "CWR form validated successfully",
                "work_title": cwr_form.work_title,
                "creators": len(cwr_form.interested_parties),
                "credits": len(cwr_form.work_credits)
            })
            
        except Exception as e:
            self._send_error(500, str(e))
    
    def _handle_blockchain_register(self, data):
        try:
            api = BlockchainCopyrightAPI()
            
            work_data = {
                "title": data.get('title', ''),
                "iswc": data.get('iswc', ''),
                "creators": data.get('creators', []),
                "shares": data.get('shares', []),
                "metadata_uri": data.get('metadata_uri', '')
            }
            
            result = api.register_work_on_blockchain(work_data)
            
            self._send_success({
                "blockchain_registration": result,
                "message": "Work registered on blockchain"
            })
            
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
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()