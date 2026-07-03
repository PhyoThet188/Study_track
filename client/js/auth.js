const API_URL = 'http://localhost:5000/api';

// 获取存储的用户信息
function getStoredUser() {
    const user = localStorage.getItem('user');
    if (user) {
        try {
            return JSON.parse(user);
        } catch {
            return null;
        }
    }
    return null;
}

// 获取存储的 token
function getToken() {
    return localStorage.getItem('token');
}

// 检查是否已登录
function isAuthenticated() {
    return !!getToken();
}

// 更新导航栏显示
function updateNav() {
    const navLinks = document.getElementById('navLinks');
    const navAuth = document.getElementById('navAuth');
    
    if (isAuthenticated()) {
        if (navLinks) navLinks.style.display = 'flex';
        if (navAuth) navAuth.style.display = 'none';
        
        // 更新个人中心信息
        const user = getStoredUser();
        if (user) {
            document.getElementById('profileUsername').textContent = user.username;
            document.getElementById('profileEmail').textContent = user.email;
            document.getElementById('profileCreatedAt').textContent = user.createdAt ? new Date(user.createdAt).toLocaleString() : '-';
        }
    } else {
        if (navLinks) navLinks.style.display = 'none';
        if (navAuth) navAuth.style.display = 'flex';
    }
}

// 页面切换
function showPage(pageName) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageName + 'Page');
    if (target) target.classList.add('active');
}

// 退出登录
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateNav();
    window.location.href = 'index.html';
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    updateNav();
    
    // 如果未登录，显示首页
    if (!isAuthenticated()) {
        showPage('dashboard');
    }
});