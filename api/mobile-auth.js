// In-memory storage (same as auth-session.js)
const sessions = new Map();

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const { sessionId } = req.query;
    
    if (req.method === 'GET') {
        // Mobile auth page
        const session = sessions.get(sessionId);
        
        if (!session) {
            return res.status(200).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Music Engine - Mobile Auth</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 2rem; text-align: center; background: #f8f9fa; }
                        .container { max-width: 400px; margin: 0 auto; background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
                        .btn { background: #007cba; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; width: 100%; margin: 10px 0; }
                        .error { color: #dc3545; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>🎵 Music Engine</h2>
                        <p class="error">Invalid or expired session</p>
                        <a href="https://musicengine.vercel.app" class="btn">Go to Music Engine</a>
                    </div>
                </body>
                </html>
            `);
        }
        
        return res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Music Engine - Mobile Auth</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 2rem; text-align: center; background: #f8f9fa; }
                    .container { max-width: 400px; margin: 0 auto; background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
                    .btn { background: #007cba; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; width: 100%; margin: 10px 0; }
                    .form-group { margin: 1rem 0; text-align: left; }
                    .form-group label { display: block; margin-bottom: 0.5rem; }
                    .form-group input { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>🎵 Music Engine Login</h2>
                    <p>Complete your login to Music Engine</p>
                    <form id="mobileAuthForm">
                        <div class="form-group">
                            <label>Artist Name:</label>
                            <input type="text" id="artistName" required>
                        </div>
                        <div class="form-group">
                            <label>Email:</label>
                            <input type="email" id="email" required>
                        </div>
                        <button type="submit" class="btn">Complete Login</button>
                    </form>
                </div>
                
                <script>
                    document.getElementById('mobileAuthForm').addEventListener('submit', async function(e) {
                        e.preventDefault();
                        
                        const artistName = document.getElementById('artistName').value;
                        const email = document.getElementById('email').value;
                        
                        try {
                            const response = await fetch('/api/mobile-auth?sessionId=${sessionId}', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ artistName, email })
                            });
                            
                            if (response.ok) {
                                document.body.innerHTML = '<div class="container"><h2>✅ Login Successful!</h2><p>You can now close this window and return to Music Engine.</p></div>';
                            }
                        } catch (error) {
                            alert('Login failed. Please try again.');
                        }
                    });
                </script>
            </body>
            </html>
        `);
    }
    
    if (req.method === 'POST') {
        // Complete authentication
        const { artistName, email } = req.body;
        const session = sessions.get(sessionId);
        
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        // Update session with user data
        sessions.set(sessionId, {
            ...session,
            status: 'authenticated',
            userData: {
                id: sessionId,
                name: artistName,
                email: email,
                plan: 'Creator',
                loginTime: new Date().toISOString()
            }
        });
        
        return res.status(200).json({ success: true });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}