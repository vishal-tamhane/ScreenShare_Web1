document.addEventListener('DOMContentLoaded', () => {
    // Initialize Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1, // Trigger when at least 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before the element comes into view
    });

    // Observe all elements that need scroll animations
    const scrollElements = document.querySelectorAll('.scroll-animate');
    scrollElements.forEach(element => {
        observer.observe(element);
    });

    // Observe specific sections
    const observeSections = () => {
        // Why section elements
        const whyTitle = document.querySelector('.why-section h2');
        const whyDesc = document.querySelector('.why-section p');
        const vault = document.querySelector('.vault-container');
        const locks = document.querySelectorAll('.lock');
        
        // How to use section elements
        const steps = document.querySelectorAll('.step');
        
        // Add scroll-animate class to all elements
        [whyTitle, whyDesc, vault].forEach(el => {
            if (el) {
                el.classList.add('scroll-animate');
                observer.observe(el);
            }
        });

        locks.forEach(lock => {
            lock.classList.add('scroll-animate');
            observer.observe(lock);
        });

        steps.forEach(step => {
            step.classList.add('scroll-animate');
            observer.observe(step);
        });
    };

    // Initialize animations
    observeSections();

    // Add smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}); 