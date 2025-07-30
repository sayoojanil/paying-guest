  // Configure Axios with base URL
        axios.defaults.baseURL = 'https://api-hammadii-6.onrender.com/';

        // Hamburger Menu
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');

        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.querySelector('i').classList.toggle('fa-bars');
            hamburger.querySelector('i').classList.toggle('fa-times');
        });

        // Profile and Logout Functionality
        function updateNavbar() {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            const loginLink = document.getElementById('loginLink');
            const profileLink = document.getElementById('profileLink');
            const logoutLink = document.getElementById('logoutLink');
            const signupLink = document.getElementById('signupLink');
            const accountInfo = document.getElementById('accountInfo');
            const userNameSpan = document.getElementById('userName');

            if (isLoggedIn) {
                loginLink.style.display = 'none';
                signupLink.style.display = 'none';
                profileLink.style.display = 'block';
                logoutLink.style.display = 'block';
                accountInfo.classList.add('show');
                const userName = localStorage.getItem('userName') || 'User';
                userNameSpan.textContent = userName;
            } else {
                loginLink.style.display = 'block';
                signupLink.style.display = 'inline-block';
                profileLink.style.display = 'none';
                logoutLink.style.display = 'none';
                accountInfo.classList.remove('show');
                userNameSpan.textContent = '';
            }
        }

        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            updateNavbar();
            window.location.href = 'index.html';
        });

        // Function to show error message
        function showError(message) {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = message;
            errorMessage.classList.add('show');
            setTimeout(() => {
                errorMessage.classList.remove('show');
                errorMessage.textContent = '';
            }, 5000); // Hide after 5 seconds
        }

        // Reviews Functionality
        async function fetchReviews() {
            const loadingMessage = document.getElementById('loadingMessage');
            loadingMessage.style.display = 'block';
            try {
                const response = await axios.get('/reviews');
                const reviewsGrid = document.getElementById('reviewsGrid');
                const reviewCount = document.getElementById('reviewCount');
                const currentUser = localStorage.getItem('userName') || '';
                reviewsGrid.innerHTML = '';
                response.data.forEach(review => {
                    const reviewCard = document.createElement('div');
                    reviewCard.className = 'review-card';
                    const formattedDate = new Date(review.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    });

                    console.log('Review:', review);
                    
                    const firstLetter = review.name.charAt(0).toUpperCase();
                    reviewCard.innerHTML = `
                        <div class="review-header">
                            <div class="profile-avatar">${firstLetter}</div>
                            <h3>${review.name}</h3>
                        </div>
                        <div class="rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                        <div class="timestamp">${formattedDate}</div>
                        <div class="review-comment">
                            <p>${review.comment}</p>
                            ${currentUser === review.name ? `
                                <div class="ellipsis-menu" data-id="${review.id}"><i class="fas fa-ellipsis-v"></i></div>
                                <div class="dropdown-menu" data-id="${review.id}">
                                    <button class="delete-btn" data-id="${review.id}">Delete Review</button>
                                </div>
                            ` : ''}
                        </div>
                    `;
                    reviewsGrid.appendChild(reviewCard);
                });

                // Update review count
                reviewCount.textContent = `Review count: ${response.data.length}`;

                // Add event listeners to ellipsis menus
                document.querySelectorAll('.ellipsis-menu').forEach(menu => {
                    menu.addEventListener('click', () => {
                        const reviewId = menu.getAttribute('data-id');
                        const dropdown = document.querySelector(`.dropdown-menu[data-id="${reviewId}"]`);
                        dropdown.classList.toggle('active');
                    });
                });

                // Add event listeners to delete buttons
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', async () => {
                        const reviewId = button.getAttribute('data-id');
                        if (confirm('Are you sure you want to delete this review?')) {
                            try {
                                await axios.delete(`/reviews/${reviewId}`, {
                                    data: { name: currentUser }
                                });
                                showError('Review deleted successfully!');
                                fetchReviews();
                            } catch (error) {
                                console.error('Error deleting review:', error);
                                showError('Failed to delete review. Please try again later.');
                            }
                        }
                    });
                });

                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.ellipsis-menu')) {
                        document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
                            dropdown.classList.remove('active');
                        });
                    }
                });
            } catch (error) {
                console.error('Error fetching reviews:', error);
                showError('Failed to load reviews. Please try again later.');
            } finally {
                loadingMessage.style.display = 'none';
            }
        }

        const reviewForm = document.getElementById('reviewForm');
        const ratingStars = document.querySelectorAll('#ratingStars i');
        const ratingInput = document.getElementById('rating');

        ratingStars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = star.getAttribute('data-value');
                ratingInput.value = rating;
                ratingStars.forEach(s => s.classList.remove('active'));
                for (let i = 0; i < rating; i++) {
                    ratingStars[i].classList.add('active');
                }
            });
        });

        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const rating = document.getElementById('rating').value;
            const comment = document.getElementById('comment').value.trim();

            if (!name || !rating || !comment) {
                showError('Please fill in all fields.');
                return;
            }

            try {
                await axios.post('/reviews', {
                    name,
                    rating: parseInt(rating),
                    comment
                });
                showError('Review submitted successfully!');
                reviewForm.reset();
                ratingStars.forEach(star => star.classList.remove('active'));
                ratingInput.value = '';
                fetchReviews();
            } catch (error) {
                console.error('Error submitting review:', error);
                showError('Failed to submit review. Please try again later.');
            }
        });

        window.addEventListener('load', () => {
            updateNavbar();
            fetchReviews();
        });