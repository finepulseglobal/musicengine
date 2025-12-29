// In-memory storage for demo (use Redis/Database in production)
const sessions = new Map();

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const { method } = req;
    const { sessionId } = req.query;
    
    if (method === 'POST') {
        // Create new session
        const newSessionId = 'ME_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessions.set(newSessionId, {
            id: newSessionId,
            status: 'pending',
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
        });
        
        return res.status(200).json({ sessionId: newSessionId });
    }
    
    if (method === 'GET' && sessionId) {
        // Check session status
        const session = sessions.get(sessionId);
        
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        // Check if expired
        if (new Date() > new Date(session.expiresAt)) {
            sessions.delete(sessionId);
            return res.status(410).json({ error: 'Session expired' });
        }
        
        return res.status(200).json(session);
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}