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
}); 