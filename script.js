document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('supportForm');
    const statusMessage = document.getElementById('statusMessage');

    // Form Handling
    const submitBtn = form.querySelector('.submit-btn');
    const emailInput = form.email;
    const phoneInput = form.phone;

    // Initial state: Disabled
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';
    submitBtn.style.cursor = 'not-allowed';

    function validateForm() {
        const isEmailValid = emailInput.value.includes('@') && emailInput.value.includes('.');
        const isPhoneValid = phoneInput.value.trim().length >= 10; // Basic length check for now

        if (isEmailValid && isPhoneValid) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        } else {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.5';
            submitBtn.style.cursor = 'not-allowed';
        }
    }

    emailInput.addEventListener('input', validateForm);
    phoneInput.addEventListener('input', validateForm);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Visual feedback immediately
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending warmth...';
        submitBtn.disabled = true;

        const formData = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            age: form.age.value,
            feeling: form.feeling.value
        };

        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                statusMessage.textContent = "Thank you. We have received your message and will reach out soon.";
                statusMessage.style.color = '#556B2F'; // Dark Olive Green
                form.reset();
                validateForm(); // Reset button state
            } else {
                statusMessage.textContent = result.message || 'Something went wrong.';
                statusMessage.style.color = '#A0522D'; // Sienna for error
            }
        } catch (error) {
            console.error('Error:', error);
            statusMessage.textContent = 'Unable to connect right now. Please try again later.';
            statusMessage.style.color = '#A0522D';
        } finally {
            submitBtn.textContent = originalBtnText;
            if (form.reportValidity()) {
                /* Keep disabled if reset, check validity */
                validateForm();
            }
        }
    });

    // Scroll Animation Logic
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Section becomes visible when 15% is in view
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Target all sections that need to be revealed
    const revealElements = document.querySelectorAll('.section, .scroll-reveal');
    revealElements.forEach(el => {
        observer.observe(el);
    });

    // Cursor Heart Trail Effect
    let lastHeartTime = 0;
    document.addEventListener('mousemove', (e) => {
        const currentTime = Date.now();
        if (currentTime - lastHeartTime > 100) { // Throttle: 1 heart every 100ms
            createHeart(e.clientX, e.clientY);
            lastHeartTime = currentTime;
        }
    });

    function createHeart(x, y) {
        const heart = document.createElement('i');
        heart.classList.add('fas', 'fa-heart', 'heart-trail');

        // Randomize slight position offset to mimic natural floating
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;

        heart.style.left = `${x + offsetX}px`;
        heart.style.top = `${y + offsetY}px`;

        // Random size variation
        const size = Math.random() * 0.5 + 0.8; // 0.8 to 1.3 scale
        heart.style.transform = `scale(${size})`;

        document.body.appendChild(heart);

        // Remove after animation completes
        setTimeout(() => {
            heart.remove();
        }, 1500);
    }
});
