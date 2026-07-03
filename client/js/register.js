const API_URL = 'http://localhost:5000/api';

async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const messageEl = document.getElementById('registerMessage');

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            messageEl.className = 'message success';
            messageEl.textContent = '✅ 注册成功！正在跳转到登录...';
            messageEl.style.display = 'block';
            
            document.getElementById('registerForm').reset();
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            messageEl.className = 'message error';
            messageEl.textContent = '❌ ' + data.message;
            messageEl.style.display = 'block';
        }
    } catch (error) {
        messageEl.className = 'message error';
        messageEl.textContent = '❌ 网络错误，请稍后重试';
        messageEl.style.display = 'block';
        console.error('Register error:', error);
    }
}