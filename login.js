let qrCodeGenerated = false;
let loginTimeout;
let pollInterval;

function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    // Wait for QRCode library to load
    if (typeof QRCode !== 'undefined') {
        generateQR();
    } else {
        setTimeout(() => {
            if (typeof QRCode !== 'undefined') {
                generateQR();
            } else {
                document.getElementById('qrStatus').textContent = 'QR Code library loading...';
                setTimeout(generateQR, 1000);
            }
        }, 500);
    }
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    if (loginTimeout) clearTimeout(loginTimeout);
    if (pollInterval) clearInterval(pollInterval);
}

let qrCodeGenerated = false;
let loginTimeout;
let pollInterval;
let currentSessionId = null;

function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    generateQR();
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    if (loginTimeout) clearTimeout(loginTimeout);
    if (pollInterval) clearInterval(pollInterval);
    currentSessionId = null;
}

async function generateQR() {
    try {
        document.getElementById('qrStatus').textContent = 'Generating QR code...';
        
        // Create new session
        const response = await fetch('/api/auth-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error('Failed to create session');
        }
        
        const { sessionId } = await response.json();
        currentSessionId = sessionId;
        
        const canvas = document.getElementById('qrcode');
        const qrData = `${window.location.origin}/api/mobile-auth?sessionId=${sessionId}`;
        
        if (typeof QRCode === 'undefined') {
            document.getElementById('qrStatus').textContent = 'Loading QR Code library...';
            setTimeout(generateQR, 1000);
            return;
        }
        
        // Clear previous QR code
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        QRCode.toCanvas(canvas, qrData, {
            width: 200,
            margin: 2,
            color: {
                dark: '#007cba',
                light: '#ffffff'
            }
        }, function (error) {
            if (error) {
                console.error('QR Code Error:', error);
                document.getElementById('qrStatus').textContent = 'Error generating QR code';
            } else {
                qrCodeGenerated = true;
                document.getElementById('qrStatus').textContent = 'Scan with your mobile device';
                startAuthPolling(sessionId);
            }
        });
        
    } catch (error) {
        console.error('Session creation error:', error);
        document.getElementById('qrStatus').textContent = 'Error creating session. Please try again.';
    }
}

async function startAuthPolling(sessionId) {
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes
    
    pollInterval = setInterval(async () => {
        attempts++;
        
        try {
            const response = await fetch(`/api/auth-session?sessionId=${sessionId}`);
            
            if (response.status === 404 || response.status === 410) {
                clearInterval(pollInterval);
                document.getElementById('qrStatus').textContent = 'Session expired. Please generate a new QR code.';
                return;
            }
            
            if (response.ok) {
                const session = await response.json();
                
                if (session.status === 'authenticated' && session.userData) {
                    clearInterval(pollInterval);
                    handleSuccessfulAuth(session.userData);
                    return;
                }
            }
            
            // Update status
            document.getElementById('qrStatus').textContent = `Waiting for scan... (${Math.floor((maxAttempts - attempts) * 5 / 60)}:${String((maxAttempts - attempts) * 5 % 60).padStart(2, '0')})`;
            
        } catch (error) {
            console.error('Polling error:', error);
        }
        
        // Timeout after max attempts
        if (attempts >= maxAttempts) {
            clearInterval(pollInterval);
            document.getElementById('qrStatus').textContent = 'Session expired. Please generate a new QR code.';
        }
    }, 5000); // Poll every 5 seconds
}

function handleSuccessfulAuth(userData) {
    document.getElementById('qrStatus').textContent = 'Authentication successful! Redirecting...';
    
    // Use auth.js login function
    login(userData);
    
    setTimeout(() => {
        closeLoginModal();
        window.location.href = 'profile.html';
    }, 2000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target == modal) {
        closeLoginModal();
    }
}