document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li');
    const body = document.body;

    function toggleMenu() {
        // Toggle hamburger animation
        hamburger.classList.toggle('active');
        
        // Toggle menu
        navLinks.classList.toggle('active');
        
        // Toggle body scroll
        body.classList.toggle('menu-open');
        
        // Animate links
        navLinksItems.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    }

    // Toggle mobile menu
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Close menu when clicking on a link
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Prevent clicks within the menu from closing it
    navLinks.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').split('#')[1];
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    toggleMenu();
                }

                // Smooth scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add active state to nav links based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href*="#${sectionId}"]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active-link');
                } else {
                    navLink.classList.remove('active-link');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);
}); 