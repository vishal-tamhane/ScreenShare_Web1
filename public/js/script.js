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

  // Navbar Toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
    }
  });

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
        
        // Show success message
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

  // Message Display Function
  function showMessage(message, type = 'info') {
    const messageContainer = document.createElement('div');
    messageContainer.className = `screen-share-message ${type}`;
    messageContainer.textContent = message;
    
    const container = document.querySelector('.screen-share-container');
    if (container) {
      container.insertBefore(messageContainer, container.firstChild);
      
      // Remove message after 5 seconds
      setTimeout(() => {
        messageContainer.remove();
      }, 5000);
    }
  }

  // Lazy Loading Images
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
    // Fallback for browsers that don't support IntersectionObserver
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.classList.add('loaded');
    });
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
