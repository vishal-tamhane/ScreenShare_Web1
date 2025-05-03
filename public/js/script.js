document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle - Available on all pages
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (hamburger && navLinks) {
        // Toggle mobile menu
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.classList.toggle('menu-open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });

        // Close menu when clicking a link
        const navItems = navLinks.querySelectorAll('li');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    }

    // Home Page Specific Code
    if (document.querySelector('.hero')) {
        // Room Navigation Buttons
        const generateBtn = document.getElementById('generateBtn');
        const joinBtn = document.getElementById('joinBtn');

        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                window.location.href = '/generate';
            });
        }

        if (joinBtn) {
            joinBtn.addEventListener('click', () => {
                window.location.href = '/join';
            });
        }

        // Vault Door and Locks Effects
        const vaultDoor = document.querySelector('.vault-door');
        const locks = document.querySelectorAll('.lock');

        if (vaultDoor && locks.length > 0) {
            locks.forEach(lock => {
                lock.addEventListener('mouseenter', () => {
                    const shadow = lock.getAttribute('data-shadow');
                    vaultDoor.style.setProperty('--vault-shadow', shadow);
                });

                lock.addEventListener('mouseleave', () => {
                    vaultDoor.style.setProperty('--vault-shadow', 'inset 0 0px 10px rgba(6, 6, 6, 0.5)');
                });
            });
        }

        // Intersection Observer for Steps
        const steps = document.querySelectorAll('.step');
        if (steps.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('step-visible');
                    }
                });
            }, { threshold: 0.5 });

            steps.forEach(step => observer.observe(step));
        }
    }

    // Create Room Page Specific Code
    if (document.querySelector('.create-room-page')) {
        // Screen Sharing Functionality
        let mediaStream = null;
        const startButton = document.getElementById('startSharing');
        const stopButton = document.getElementById('stopSharing');
        const videoElement = document.getElementById('screenShare');

        if (startButton && stopButton && videoElement) {
            startButton.addEventListener('click', async () => {
                try {
                    mediaStream = await navigator.mediaDevices.getDisplayMedia({
                        video: {
                            cursor: "always"
                        },
                        audio: false
                    });
                    
                    videoElement.srcObject = mediaStream;
                    videoElement.play();
                    
                    startButton.style.display = 'none';
                    stopButton.style.display = 'block';
                    
                    showMessage('Screen sharing started successfully!', 'success');
                } catch (err) {
                    console.error('Error accessing screen:', err);
                    showMessage('Failed to start screen sharing. Please try again.', 'error');
                }
            });

            stopButton.addEventListener('click', () => {
                if (mediaStream) {
                    mediaStream.getTracks().forEach(track => track.stop());
                    videoElement.srcObject = null;
                    
                    startButton.style.display = 'block';
                    stopButton.style.display = 'none';
                    
                    showMessage('Screen sharing stopped.', 'info');
                }
            });
        }
    }

    // Lazy Loading Images - Available on all pages
    const lazyImages = document.querySelectorAll('img.lazy');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
});

// Animation Observer - Available on all pages
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
});

function startSharing() {
    let roomID = localStorage.getItem("roomID");
    if (!roomID) {
        showNotification("Please generate a Room ID first!", "error");
        return;
    }
    localStorage.setItem("isSender", "true");
    window.location.href = `/room/${roomID}?isSender=true`;
}
