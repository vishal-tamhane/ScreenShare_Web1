document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const joinBtn = document.getElementById('joinBtn');

    generateBtn.addEventListener('click', () => {
        // Generate unique code logic
        window.location.href = '/generate';
    });

    joinBtn.addEventListener('click', () => {
        // Join room logic
        const roomId = prompt('Enter room code:');
        if (roomId) {
            window.location.href = `/join/${roomId}`;
        }
    });
});

const vaultDoor = document.querySelector('.vault-door');
const locks = document.querySelectorAll('.lock');

locks.forEach(lock => {
  lock.addEventListener('mouseenter', () => {
    const shadow = lock.getAttribute('data-shadow');
    vaultDoor.style.setProperty('--vault-shadow', shadow);
  });

  lock.addEventListener('mouseleave', () => {
    vaultDoor.style.setProperty('--vault-shadow', 'inset 0 0px 10px rgba(6, 6, 6, 0.5)'); // Reset to default
  });
});

const steps = document.querySelectorAll('.step');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('step-visible');
    }
  });
}, { threshold: 0.5 });

steps.forEach(step => observer.observe(step));