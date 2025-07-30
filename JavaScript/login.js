 // API Configuration
        const API_CONFIG = {
            BASE_URL: 'https://api-hammadii-6.onrender.com/',
            LOGIN_ENDPOINT: '/loginWithEmail'
        };

        // Utility to show messages
        function showMessage(text, type) {
            const existingMsg = document.querySelector('.message');
            if (existingMsg) existingMsg.remove();

            const msg = document.createElement('div');
            msg.textContent = text;
            msg.className = `message ${type}`;
            document.querySelector('.login-container').appendChild(msg);
            
            setTimeout(() => msg.remove(), 3000);
        }

        // Form submission with API call
        const form = document.getElementById('loginForm');
        const loginButton = document.getElementById('loginButton');

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Basic validation
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showMessage('Invalid email address', 'error');
                return;
            }
            if (password.length < 8) {
                showMessage('Password must be at least 8 characters', 'error');
                return;
            }

            // Set loading state
            loginButton.disabled = true;
            loginButton.classList.add('loading');
            loginButton.textContent = 'Logging In...';

            // Form data
            const formData = { email, password };

            try {
                // API call
                const response = await axios.post(
                    `${API_CONFIG.BASE_URL}${API_CONFIG.LOGIN_ENDPOINT}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                // Success
                showMessage(response.data.message || 'Login successful!', 'success');
                form.reset();
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userName', response.data.name || 'User');
                setTimeout(() => {
                    window.location.href = 'reviews.html';
                }, 3000);
                console.log('Login successful:', response.data);
            } catch (error) {
                const message = error.response?.data?.message || 
                    error.response?.status === 401 ? 'Invalid credentials' :
                    error.response?.status === 400 ? 'Invalid input data' :
                    'Error logging in. Please try again.';
                showMessage(message, 'error');
            } finally {
                loginButton.disabled = false;
                loginButton.classList.remove('loading');
                loginButton.textContent = 'Login';
            }
        });