const properties = [
    {
        id: 1,
        title: "ShyamaPrabha ",
        description: "A comfortable house is a peaceful retreat where warmth, love, and calm surround every corner.",
        price: "₹5499",
        period: "per month",
        images: [
            "./IMAGES/WhatsApp Image 2025-04-18 at 13.24.30_c406b3f1.jpg",
            "./IMAGES/WhatsApp Image 2025-04-12 at 23.42.33_4bdbb4cd.jpg",
            "./IMAGES/WhatsApp Image 2025-04-12 at 23.42.34_3b9910ed.jpg",
            "./IMAGES/WhatsApp Image 2025-04-19 at 02.39.02_e79d3eba.jpg",
            "./IMAGES/WhatsApp Image 2025-07-11 at 00.29.30_87c07a00.jpg",
            "./IMAGES/WhatsApp Image 2025-07-11 at 00.31.47_1e596f6d.jpg",
           " ./IMAGES/WhatsApp Image 2025-07-21 at 14.55.01_a7a16c8a.jpg",
           "./IMAGES/WhatsApp Image 2025-07-21 at 14.55.01_f8e8f9c1.jpg"
        ],
        features: [
            { icon: "fas fa-wifi", text: "High-speed WiFi" },
            { icon: "fas fa-shower", text: "Attached Bathroom" },
            { icon: "fas fa-tv", text: "Smart TV" },
            { icon: "fas fa-utensils", text: "Breakfast to Dinner" },
            { icon: "fa-solid fa-basket-shopping", text: "Laundary Access" },
            { icon: "fas fa-users", text: "Friendly Roommates" },
        ],
        about: "Shyamaprabha PG was founded with a simple goal to create a safe, comfortable, and welcoming space for girls who are away from home. Whether you’re a student, intern, or working professional, our PG offers an environment where you can focus, relax, and feel supported.",
        location: "Hotel Copper Folia, Cyber Park, Near, Nellikkode, Kozhikode, Kerala 673016"
    },
];

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.querySelector('i').classList.toggle('fa-bars');
    hamburger.querySelector('i').classList.toggle('fa-times');
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        navLinks.classList.remove('active');
        hamburger.querySelector('i').classList.add('fa-bars');
        hamburger.querySelector('i').classList.remove('fa-times');
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .testimonial-card').forEach(card => {
    observer.observe(card);
});

let propertySwiper = null;

function showPropertyDetails(id) {
    const property = properties.find(p => p.id == id);
    if (!property) {
        console.error('Property not found for ID:', id);
        return;
    }

    const imagesContainer = document.getElementById('detailImages');
    imagesContainer.innerHTML = '';

    if (property.images && property.images.length > 0) {
        const uniqueImages = [...new Set(property.images)];
        uniqueImages.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `<img src="${image}" alt="${property.title} - Image ${index + 1}" onerror="this.src='https://via.placeholder.com/800x600?text=Image+Not+Found'; this.alt='Image not available';">`;
            imagesContainer.appendChild(slide);
        });
    } else {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `<img src="https://via.placeholder.com/800x600?text=No+Image+Available" alt="No image available">`;
        imagesContainer.appendChild(slide);
    }

    document.getElementById('detailTitle').textContent = property.title || 'Property';
    document.getElementById('detailLocation').textContent = property.location || 'Location not specified';
    document.getElementById('detailDescription').textContent = property.description || 'No description available';
    document.getElementById('detailPrice').textContent = property.price && property.period ? `${property.price}/${property.period}` : 'Price not available';
    document.getElementById('sidebarPrice').textContent = property.price || 'N/A';
    document.getElementById('sidebarPeriod').textContent = property.period || '';
    document.getElementById('detailAbout').textContent = property.about || 'No additional information available';

    const featuresContainer = document.getElementById('detailFeatures');
    featuresContainer.innerHTML = '';
    if (property.features && property.features.length > 0) {
        property.features.forEach(feature => {
            const featureItem = document.createElement('div');
            featureItem.className = 'feature-item';
            featureItem.innerHTML = `
                <i class="${feature.icon || 'fas fa-info-circle'}"></i>
                <span>${feature.text || 'Feature not specified'}</span>
            `;
            featuresContainer.appendChild(featureItem);
        });
    } else {
        const featureItem = document.createElement('div');
        featureItem.className = 'feature-item';
        featureItem.innerHTML = `<span>No features listed</span>`;
        featuresContainer.appendChild(featureItem);
    }

    if (propertySwiper) {
        propertySwiper.destroy(true, true);
        propertySwiper = null;
    }

    propertySwiper = new Swiper('#propertySwiper', {
        loop: property.images && property.images.length > 1,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
            renderBullet: function (index, className) {
                return `<span class="${className}" aria-label="Go to slide ${index + 1}"></span>`;
            }
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            disabledClass: 'swiper-button-disabled'
        },
        slidesPerView: 1,
        spaceBetween: 10,
        touchRatio: 1.5,
        grabCursor: true,
        speed: 500,
        observer: true,
        observeParents: true,
        watchSlidesProgress: true,
        preloadImages: true,
        updateOnImagesReady: true
    });

    const propertyDetails = document.getElementById('propertyDetails');
    propertyDetails.style.display = 'block';
    document.body.classList.add('blur-background');

    setTimeout(() => {
        if (propertySwiper) {
            propertySwiper.update();
        }
    }, 100);
}

const propertyDetails = document.getElementById('propertyDetails');
const closeDetails = document.querySelector('.close-details');
const viewDetailBtns = document.querySelectorAll('.view-details');

viewDetailBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const propertyCard = this.closest('.property-card');
        if (propertyCard) {
            const propertyId = propertyCard.dataset.id;
            showPropertyDetails(propertyId);
            console.log("showing propery details for id ", propertyId);
        } else {
            console.error('Property card not found for button:', btn);
        }
    });
});

function closePropertyDetails() {
    const propertyDetails = document.getElementById('propertyDetails');
    propertyDetails.style.display = 'none';
    document.body.classList.remove('blur-background');
    if (propertySwiper) {
        propertySwiper.destroy(true, true);
        propertySwiper = null;
    }
}

closeDetails.addEventListener('click', closePropertyDetails);

propertyDetails.addEventListener('click', function(e) {
    if (e.target === propertyDetails) {
        closePropertyDetails();
    }
});

const offerPopup = document.getElementById('offerPopup');
const closePopup = document.getElementById('closePopup');
const popupCloseBtn = document.getElementById('popupCloseBtn');

window.addEventListener('load', () => {
    setTimeout(() => {
        offerPopup.classList.add('propertswiper');
        document.body.classList.add('blur-background');
    }, 3000);
});

function closeOfferPopup() {
    offerPopup.classList.remove('show');
    document.body.classList.remove('blur-background');
}

closePopup.addEventListener('click', closeOfferPopup);
popupCloseBtn.addEventListener('click', closeOfferPopup);

offerPopup.addEventListener('click', function(e) {
    if (e.target === offerPopup) {
        closeOfferPopup();
    }
});

const bookingForm = document.getElementById('bookingForm');
bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = bookingForm.querySelector('input[name="name"]').value.trim();
    const phone = bookingForm.querySelector('input[name="phone"]').value.trim();
    const members = bookingForm.querySelector('input[name="members"]').value.trim();
    const dateFrom = bookingForm.querySelector('input[name="date_from"]').value.trim();
    const dateTo = bookingForm.querySelector('input[name="date_to"]').value.trim();
    const message = bookingForm.querySelector('textarea[name="message"]').value.trim();
    
    if (name && phone && members && dateFrom && dateTo && message) {
        const whatsappMessage = `PG Enquiry\n\nName: ${name}\nPhone: ${phone}\nNumber of Members: ${members}\nExpected Date From: ${dateFrom}\nExpected Date To: ${dateTo}\nMessage: ${message}`;
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappNumber = '+918606777363';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        try {
            const whatsappWindow = window.open(whatsappUrl, '_blank');
            if (whatsappWindow) {
                bookingForm.reset();
                closePropertyDetails();
                console.log('WhatsApp opened successfully:', whatsappUrl);
            } else {
                alert('Unable to open WhatsApp. Please allow pop-ups and try again.');
            }
        } catch (error) {
            console.error('Error opening WhatsApp:', error);
            alert('An error occurred while opening WhatsApp. Please check your browser settings or try again.');
        }
    } else {
        alert('Please fill in all required fields.');
    }
});

// EmailJS SDK v4 Initialization and Form Submission
(function() {
    // No explicit initialization required for SDK v4
    // The SDK is loaded via npm import or script tag, and credentials are handled per request
})();

const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    const name = contactForm.querySelector('input[name="name"]').value.trim();
    const email = contactForm.querySelector('input[name="email"]').value.trim();
    const phone = contactForm.querySelector('input[name="phone"]').value.trim();
    const message = contactForm.querySelector('textarea[name="message"]').value.trim();
    
    if (name && email && phone && message) {
        const templateParams = {
            from_name: name,
            from_email: email,
            phone: phone,
            message: message,
            to_email: "sayoojanil977@gmail.com"
        };

        try {
            const response = await emailjs.send(
                'service_yrge7og', // Your EmailJS Service ID
                'template_ndc90nc', // Your EmailJS Template ID
                templateParams,
                {
                    publicKey: 'wGLn-tJ1O2G9maSvc' // Your EmailJS Public Key
                }
            );
            console.log('Email sent successfully:', response.status, response.text);
            alert('Your message has been sent successfully!');
            contactForm.reset();
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        } catch (error) {
            console.error('Failed to send email:', error);
            alert('Failed to send your message. Please try again later or contact us directly at sreelakshmiprasad76.');
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    } else {
        alert('Please fill in all required fields.');
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
    }
});

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

window.addEventListener('load', updateNavbar);