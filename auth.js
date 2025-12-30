// Authentication state management
let isAuthenticated = false;
let currentUser = null;

// Check authentication status on page load
function checkAuth() {
    const authToken = localStorage.getItem('musicEngineAuth');
    const userData = localStorage.getItem('musicEngineUser');
    
    if (authToken && userData) {
        isAuthenticated = true;
        currentUser = JSON.parse(userData);
        updateNavigation();
    } else {
        hideProfileLink();
    }
}

// Update navigation based on auth status
function updateNavigation() {
    const profileLinks = document.querySelectorAll('a[href="profile.html"]');
    const loginButtons = document.querySelectorAll('[onclick="openLoginModal()"]');
    
    if (isAuthenticated) {
        profileLinks.forEach(link => link.style.display = 'block');
        loginButtons.forEach(btn => {
            btn.textContent = 'Logout';
            btn.onclick = logout;
        });
    } else {
        hideProfileLink();
    }
}

// Hide profile link for unauthenticated users
function hideProfileLink() {
    const profileLinks = document.querySelectorAll('a[href="profile.html"]');
    profileLinks.forEach(link => link.style.display = 'none');
}

// Login function
function login(userData) {
    const authToken = 'ME_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    localStorage.setItem('musicEngineAuth', authToken);
    localStorage.setItem('musicEngineUser', JSON.stringify(userData));
    
    isAuthenticated = true;
    currentUser = userData;
    updateNavigation();
}

// Logout function
function logout() {
    localStorage.removeItem('musicEngineAuth');
    localStorage.removeItem('musicEngineUser');
    
    isAuthenticated = false;
    currentUser = null;
    
    // Redirect to home if on profile page
    if (window.location.pathname.includes('profile.html')) {
        window.location.href = 'index.html';
    }
    
    updateNavigation();
}

// Protect profile page
function protectProfilePage() {
    if (window.location.pathname.includes('profile.html')) {
        const authToken = localStorage.getItem('musicEngineAuth');
        if (!authToken) {
            alert('Please login to access your profile.');
            window.location.href = 'index.html';
        }
    }
}

// Initialize auth check on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    protectProfilePage();
});

// Login modal functions
let qrCodeGenerated = false;
let loginTimeout;
let pollInterval;

function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    generateQR();
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
    
    // Use login function
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

// Check authentication before allowing registration
function checkAuthAndRegister() {
    const authToken = localStorage.getItem('musicEngineAuth');
    
    if (authToken) {
        window.location.href = 'register.html';
    } else {
        alert('Please login first to register your music.');
        openLoginModal();
    }
}