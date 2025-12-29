// Authentication state management
let isAuthenticated = false;
let currentUser = null;

// Check authentication status on page load
function checkAuth() {
    const authToken = localStorage.getItem('musicEngineAuth');
    const userData = localStorage.getItem('musicEngineUser');
    const adminAuth = localStorage.getItem('musicEngineAdmin');
    const adminUser = localStorage.getItem('adminUser');
    
    if (authToken && userData) {
        isAuthenticated = true;
        currentUser = JSON.parse(userData);
        updateNavigation();
    } else if (adminAuth === 'true' && adminUser) {
        isAuthenticated = true;
        currentUser = JSON.parse(adminUser);
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
    localStorage.removeItem('musicEngineAdmin');
    localStorage.removeItem('adminUser');
    
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
        const adminAuth = localStorage.getItem('musicEngineAdmin');
        if (!authToken && adminAuth !== 'true') {
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