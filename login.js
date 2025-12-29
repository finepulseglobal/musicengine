let qrCodeGenerated = false;
let loginTimeout;

function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    generateQR();
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    if (loginTimeout) clearTimeout(loginTimeout);
}

function generateQR() {
    const canvas = document.getElementById('qrcode');
    const sessionId = 'ME_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const qrData = `https://musicengine.com/mobile-login?session=${sessionId}`;
    
    QRCode.toCanvas(canvas, qrData, {
        width: 200,
        margin: 2,
        color: {
            dark: '#007cba',
            light: '#ffffff'
        }
    }, function (error) {
        if (error) {
            console.error(error);
            document.getElementById('qrStatus').textContent = 'Error generating QR code';
        } else {
            qrCodeGenerated = true;
            document.getElementById('qrStatus').textContent = 'Scan with your mobile device';
            simulateQRLogin();
        }
    });
}

function simulateQRLogin() {
    loginTimeout = setTimeout(() => {
        document.getElementById('qrStatus').textContent = 'Login successful! Redirecting...';
        setTimeout(() => {
            closeLoginModal();
            window.location.href = 'profile.html';
        }, 2000);
    }, 8000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target == modal) {
        closeLoginModal();
    }
}