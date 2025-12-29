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

function generateQR() {
    const canvas = document.getElementById('qrcode');
    const sessionId = 'ME_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const qrData = `https://musicengine.com/mobile-auth?session=${sessionId}`;
    
    if (typeof QRCode === 'undefined') {
        document.getElementById('qrStatus').textContent = 'Loading QR Code...';
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
}

function startAuthPolling(sessionId) {
    // Simulate authentication polling
    let attempts = 0;
    pollInterval = setInterval(() => {
        attempts++;
        
        // Simulate successful authentication after 8 seconds
        if (attempts >= 8) {
            clearInterval(pollInterval);
            handleSuccessfulAuth(sessionId);
        }
    }, 1000);
}

function handleSuccessfulAuth(sessionId) {
    document.getElementById('qrStatus').textContent = 'Authentication successful! Redirecting...';
    
    // Simulate user data
    const userData = {
        id: sessionId,
        name: 'Music Artist',
        email: 'artist@example.com',
        plan: 'Creator'
    };
    
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