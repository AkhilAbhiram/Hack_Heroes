// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';
let currentUser = null;
let authToken = null;

// ==================== Authentication ====================
function toggleForms(event) {
    event.preventDefault();
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
    registerForm.style.display = registerForm.style.display === 'none' ? 'block' : 'none';
}

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const user = await response.json();
            currentUser = user;
            authToken = `user_${user.id}`;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', authToken);
            
            showMessage('Login successful!', 'success');
            setTimeout(() => {
                // Redirect based on role
                if (user.role === 'ADMIN') {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'customer-dashboard.html';
                }
            }, 500);
        } else {
            showMessage('Invalid email or password', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Login failed. Please try again.', 'error');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, role })
        });
        
        if (response.ok) {
            showMessage('Registration successful! Please login.', 'success');
            setTimeout(() => {
                document.getElementById('registerFormElement').reset();
                toggleForms({ preventDefault: () => {} });
            }, 500);
        } else {
            showMessage('Registration failed. Email might already exist.', 'error');
        }
    } catch (error) {
        console.error('Register error:', error);
        showMessage('Registration failed. Please try again.', 'error');
    }
}

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

// ==================== Utility Functions ====================
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the selected section
    document.getElementById(sectionId).classList.add('active');
}

function showMessage(message, type = 'info') {
    const messageEl = document.getElementById('message');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `message show ${type}`;
        
        setTimeout(() => {
            messageEl.classList.remove('show');
        }, 3000);
    }
}

// ==================== Authentication Check ====================
function checkAuth() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!user || !token) {
        window.location.href = 'index.html';
        return null;
    }
    
    return JSON.parse(user);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on auth page
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        // Auth page - no additional setup needed
    }
});

