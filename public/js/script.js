document.addEventListener('DOMContentLoaded', () => {
  // --- Room Navigation Buttons ---
  const generateBtn = document.getElementById('generateBtn');
  const joinBtn = document.getElementById('joinBtn');

  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      // Navigate to the generate page
      window.location.href = '/generate';
    });
  } else {
    console.warn('generateBtn not found in the DOM.');
  }

  if (joinBtn) {
    joinBtn.addEventListener('click', () => {
      // Prompt for room code and navigate to join page
      const roomId = prompt('Enter room code:');
      if (roomId) {
        window.location.href = `/join/${roomId}`;
      }
    });
  } else {
    console.warn('joinBtn not found in the DOM.');
  }

  // --- Vault Door and Locks Effects ---
  const vaultDoor = document.querySelector('.vault-door');
  const locks = document.querySelectorAll('.lock');

  if (vaultDoor && locks.length > 0) {
    locks.forEach(lock => {
      lock.addEventListener('mouseenter', () => {
        const shadow = lock.getAttribute('data-shadow');
        vaultDoor.style.setProperty('--vault-shadow', shadow);
      });

      lock.addEventListener('mouseleave', () => {
        // Reset to default shadow
        vaultDoor.style.setProperty('--vault-shadow', 'inset 0 0px 10px rgba(6, 6, 6, 0.5)');
      });
    });
  } else {
    console.warn('Vault door or lock elements not found.');
  }

  // --- Intersection Observer for Steps ---
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
  } else {
    console.warn('No elements with class "step" found.');
  }
});


/* Add this to your existing animations.js file */
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
