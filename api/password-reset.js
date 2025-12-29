// Password reset tokens storage
const resetTokens = new Map();

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const { method } = req;
    const { token } = req.query;
    
    if (method === 'POST' && !token) {
        // Request password reset
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        
        // Generate reset token
        const resetToken = 'reset_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        resetTokens.set(resetToken, {
            email,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
            used: false
        });
        
        // In production, send email here
        console.log(`Password reset link: ${req.headers.origin || 'http://localhost:3000'}/api/password-reset?token=${resetToken}`);
        
        return res.status(200).json({ 
            message: 'Password reset link sent',
            resetLink: `/api/password-reset?token=${resetToken}` // For demo purposes
        });
    }
    
    if (method === 'GET' && token) {
        // Show password reset form
        const resetData = resetTokens.get(token);
        
        if (!resetData) {
            return res.status(404).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Music Engine - Password Reset</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 2rem; text-align: center; background: #f8f9fa; }
                        .container { max-width: 400px; margin: 0 auto; background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
                        .error { color: #dc3545; }
                        .btn { background: #007cba; color: white; padding: 12px 24px; border: none; border-radius: 5px; text-decoration: none; display: inline-block; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>🎵 Music Engine</h2>
                        <p class="error">Invalid or expired reset link</p>
                        <a href="/" class="btn">Go to Music Engine</a>
                    </div>
                </body>
                </html>
            `);
        }
        
        if (new Date() > new Date(resetData.expiresAt) || resetData.used) {
            return res.status(410).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Music Engine - Password Reset</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 2rem; text-align: center; background: #f8f9fa; }
                        .container { max-width: 400px; margin: 0 auto; background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
                        .error { color: #dc3545; }
                        .btn { background: #007cba; color: white; padding: 12px 24px; border: none; border-radius: 5px; text-decoration: none; display: inline-block; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>🎵 Music Engine</h2>
                        <p class="error">Reset link has expired</p>
                        <a href="/" class="btn">Go to Music Engine</a>
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
                <title>Music Engine - Password Reset</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 2rem; text-align: center; background: #f8f9fa; }
                    .container { max-width: 400px; margin: 0 auto; background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
                    .btn { background: #007cba; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; width: 100%; margin: 10px 0; }
                    .form-group { margin: 1rem 0; text-align: left; }
                    .form-group label { display: block; margin-bottom: 0.5rem; }
                    .form-group input { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; }
                    .success { color: #28a745; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>🎵 Music Engine</h2>
                    <h3>Reset Your Access</h3>
                    <p>Email: <strong>${resetData.email}</strong></p>
                    
                    <form id="resetForm">
                        <div class="form-group">
                            <label>New Artist Name:</label>
                            <input type="text" id="newName" required>
                        </div>
                        <button type="submit" class="btn">Reset & Login</button>
                    </form>
                    
                    <div id="message" style="margin-top: 1rem;"></div>
                </div>
                
                <script>
                    document.getElementById('resetForm').addEventListener('submit', async function(e) {
                        e.preventDefault();
                        
                        const newName = document.getElementById('newName').value;
                        const messageDiv = document.getElementById('message');
                        
                        try {
                            const response = await fetch('/api/password-reset?token=${token}', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ newName })
                            });
                            
                            const result = await response.json();
                            
                            if (response.ok) {
                                messageDiv.innerHTML = '<p class="success">✅ Access reset successful! You can now close this window.</p>';
                                document.getElementById('resetForm').style.display = 'none';
                                
                                // Auto-close after 3 seconds
                                setTimeout(() => {
                                    window.close();
                                }, 3000);
                            } else {
                                messageDiv.innerHTML = '<p class="error">❌ ' + result.error + '</p>';
                            }
                        } catch (error) {
                            messageDiv.innerHTML = '<p class="error">❌ Reset failed. Please try again.</p>';
                        }
                    });
                </script>
            </body>
            </html>
        `);
    }
    
    if (method === 'POST' && token) {
        // Complete password reset
        const { newName } = req.body;
        const resetData = resetTokens.get(token);
        
        if (!resetData || resetData.used) {
            return res.status(404).json({ error: 'Invalid reset token' });
        }
        
        if (new Date() > new Date(resetData.expiresAt)) {
            return res.status(410).json({ error: 'Reset token expired' });
        }
        
        // Mark token as used
        resetTokens.set(token, { ...resetData, used: true });
        
        // Create temporary login session
        const userData = {
            id: 'reset_' + Date.now(),
            name: newName,
            email: resetData.email,
            plan: 'Creator',
            resetLogin: true
        };
        
        return res.status(200).json({ 
            success: true, 
            message: 'Access reset successful',
            userData 
        });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}