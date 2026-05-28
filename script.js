// Mukova AI - Premium Interactive Client Engine

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Define DOM Elements
  const header = document.getElementById('navbar-header');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu-drawer');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  // --- 1. Sticky Header & Scroll Effects ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('shadow-md', 'backdrop-blur-lg', 'bg-white/95');
      header.classList.remove('bg-white/80', 'border-transparent');
    } else {
      header.classList.remove('shadow-md', 'backdrop-blur-lg', 'bg-white/95');
      header.classList.add('bg-white/80');
    }
  });

  // --- 2. Mobile Drawer Navigation ---
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      
      // Toggle menu classes
      mobileMenu.classList.toggle('hidden');
      mobileMenu.classList.toggle('flex');
      document.body.classList.toggle('overflow-hidden');
      
      // Toggle menu button visual representation
      const iconMenu = mobileMenuBtn.querySelector('.icon-menu');
      const iconClose = mobileMenuBtn.querySelector('.icon-close');
      
      if (iconMenu && iconClose) {
        iconMenu.classList.toggle('hidden');
        iconClose.classList.toggle('hidden');
      }
    });

    // Close mobile drawer on link click
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        document.body.classList.remove('overflow-hidden');
        const iconMenu = mobileMenuBtn.querySelector('.icon-menu');
        const iconClose = mobileMenuBtn.querySelector('.icon-close');
        if (iconMenu && iconClose) {
          iconMenu.classList.remove('hidden');
          iconClose.classList.add('hidden');
        }
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- 3. Scroll Reveal Entrance Animations ---
  const scrollRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optional: stop observing once triggered to make it permanent
        // scrollRevealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is in full view
  });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    scrollRevealObserver.observe(el);
  });

  // --- 4. Active Nav Link Highlighting on Scroll ---
  const activeSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Desktop Highlight
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('text-green-600', 'font-semibold');
            link.classList.remove('text-gray-600');
            link.querySelector('.nav-dot')?.classList.remove('scale-0');
            link.querySelector('.nav-dot')?.classList.add('scale-100');
          } else {
            link.classList.remove('text-green-600', 'font-semibold');
            link.classList.add('text-gray-600');
            link.querySelector('.nav-dot')?.classList.remove('scale-100');
            link.querySelector('.nav-dot')?.classList.add('scale-0');
          }
        });

        // Mobile Highlight
        mobileMenuLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('text-green-600', 'bg-green-50/50');
            link.classList.remove('text-gray-700');
          } else {
            link.classList.remove('text-green-600', 'bg-green-50/50');
            link.classList.add('text-gray-700');
          }
        });
      }
    });
  }, {
    threshold: 0.3, // Trigger when 30% of the section is visible
    rootMargin: '-10% 0px -60% 0px' // Adjust scroll boundingbox
  });

  sections.forEach(section => {
    activeSectionObserver.observe(section);
  });

  // Immediate Highlight on Click
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      // Remove active state from all
      navLinks.forEach(l => {
        l.classList.remove('text-green-600', 'font-semibold');
        l.classList.add('text-gray-600');
        l.querySelector('.nav-dot')?.classList.remove('scale-100');
        l.querySelector('.nav-dot')?.classList.add('scale-0');
      });
      
      // Add active state to clicked
      this.classList.add('text-green-600', 'font-semibold');
      this.classList.remove('text-gray-600');
      this.querySelector('.nav-dot')?.classList.remove('scale-0');
      this.querySelector('.nav-dot')?.classList.add('scale-100');
    });
  });

  // --- 5. Interactive Testimonial Slider/Carousel ---
  const testimonialTrack = document.getElementById('testimonial-track');
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const dotsContainer = document.getElementById('slider-dots');

  if (testimonialTrack && testimonialSlides.length > 0) {
    let currentIndex = 0;
    const totalSlides = testimonialSlides.length;
    let autoPlayInterval;

    // Create Carousel Indicator Dots
    dotsContainer.innerHTML = '';
    testimonialSlides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `w-3 h-3 rounded-full transition-all duration-300 ${
        idx === 0 ? 'bg-green-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
      }`;
      dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    });

    const updateDots = () => {
      const dots = dotsContainer.querySelectorAll('button');
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.className = 'w-3 h-3 rounded-full transition-all duration-300 bg-green-600 w-6';
        } else {
          dot.className = 'w-3 h-3 rounded-full transition-all duration-300 bg-gray-300 hover:bg-gray-400';
        }
      });
    };

    const goToSlide = (index) => {
      currentIndex = (index + totalSlides) % totalSlides;
      const offset = -currentIndex * 100;
      testimonialTrack.style.transform = `translateX(${offset}%)`;
      updateDots();
    };

    const nextSlide = () => {
      goToSlide(currentIndex + 1);
    };

    const prevSlide = () => {
      goToSlide(currentIndex - 1);
    };

    // Attach Click Events
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
      });
    }

    // Auto-Play Feature
    const startAutoPlay = () => {
      autoPlayInterval = setInterval(nextSlide, 6000);
    };

    const resetAutoPlay = () => {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    };

    startAutoPlay();

    // Pause autoplay on hover
    const carouselContainer = document.getElementById('testimonials-carousel');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
      carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }
  }

  // --- 6. Custom Elegant Toast Notifications ---
  const toast = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');

  const showToast = (message, isError = false) => {
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    
    // Set colors
    const toastBody = toast.querySelector('.toast-body');
    if (toastBody) {
      if (isError) {
        toastBody.className = 'toast-body flex items-center gap-3 p-4 bg-red-50 text-red-900 border-l-4 border-red-500 rounded-lg shadow-lg';
      } else {
        toastBody.className = 'toast-body flex items-center gap-3 p-4 bg-green-50 text-green-950 border-l-4 border-green-500 rounded-lg shadow-lg';
      }
    }

    toast.classList.remove('hidden');
    // Force a small reflow to ensure animation triggers
    void toast.offsetWidth;
    toast.classList.add('show');

    // Automatically hide after 4 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 400); // Wait for transition out
    }, 4000);
  };

  // --- 7. Search & Input Interaction (Hero Section) ---
  const heroSearchBtn = document.getElementById('hero-search-btn');
  const heroSearchInput = document.getElementById('hero-search-input');

  if (heroSearchBtn && heroSearchInput) {
    heroSearchBtn.addEventListener('click', () => {
      const val = heroSearchInput.value.trim();
      if (!val) {
        showToast('Please type your AI project request or question first!', true);
      } else {
        showToast(`Analyzing request: "${val}". We are redirecting you to customized options...`);
        heroSearchInput.value = '';
      }
    });
    
    // Allow pressing enter key
    heroSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        heroSearchBtn.click();
      }
    });
  }

  // --- 8. File Upload Interactions (Hero & Provider Signup) ---
  const setupDragAndDrop = (dropZoneId, fileInputId, feedbackId, clearBtnId) => {
    const dropZone = document.getElementById(dropZoneId);
    const fileInput = document.getElementById(fileInputId);
    const feedback = document.getElementById(feedbackId);
    const clearBtn = document.getElementById(clearBtnId);

    if (!dropZone || !fileInput || !feedback) return;

    // Trigger file dialog
    dropZone.addEventListener('click', () => fileInput.click());

    // Drag-over styling
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('border-green-500', 'bg-green-50/30');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('border-green-500', 'bg-green-50/30');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-green-500', 'bg-green-50/30');
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        fileInput.files = files;
        handleFileSelect(files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        handleFileSelect(fileInput.files[0]);
      }
    });

    const handleFileSelect = (file) => {
      // Dynamic feedback UI
      feedback.classList.remove('text-gray-500');
      feedback.classList.add('text-green-600', 'font-semibold');
      feedback.innerHTML = `
        <div class="flex items-center justify-center gap-2">
          <i data-lucide="file-check" class="w-5 h-5"></i>
          <span>${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>
        </div>
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons();

      if (clearBtn) {
        clearBtn.classList.remove('hidden');
      }
    };

    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid triggering file selection window
        fileInput.value = '';
        clearBtn.classList.add('hidden');
        feedback.classList.add('text-gray-500');
        feedback.classList.remove('text-green-600', 'font-semibold');
        feedback.innerHTML = `
          <span>Drag and drop project details or resume here, or <span class="text-green-600 font-medium">browse</span></span>
        `;
        if (typeof lucide !== 'undefined') lucide.createIcons();
      });
    }
  };

  // Setup uploader in Hero
  setupDragAndDrop('hero-upload-zone', 'hero-file-input', 'hero-upload-feedback', 'hero-upload-clear');
  // Setup uploader in Provider Signup
  setupDragAndDrop('provider-upload-zone', 'provider-file-input', 'provider-upload-feedback', 'provider-upload-clear');

  // --- 9. Provider Signup Form Validation & Submission Mock ---
  const providerForm = document.getElementById('provider-signup-form');
  if (providerForm) {
    providerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('provider-name').value.trim();
      const email = document.getElementById('provider-email').value.trim();
      const phone = document.getElementById('provider-phone').value.trim();
      const expertise = document.getElementById('provider-expertise').value;
      const message = document.getElementById('provider-message').value.trim();

      // Basic Validations
      if (!name || !email || !phone || !expertise || !message) {
        showToast('Please fill out all required fields before submitting!', true);
        return;
      }

      if (!validateEmail(email)) {
        showToast('Please enter a valid email address!', true);
        return;
      }

      // Success
      showToast('Registration Successful! Our executive will contact you via WhatsApp & Email in 24 hours.');
      providerForm.reset();
      
      // Reset Uploader Label
      const uploaderFeedback = document.getElementById('provider-upload-feedback');
      const uploaderClear = document.getElementById('provider-upload-clear');
      if (uploaderFeedback) {
        uploaderFeedback.className = 'text-sm text-gray-500';
        uploaderFeedback.innerHTML = 'Drag and drop project details or resume here, or <span class="text-green-600 font-medium">browse</span>';
      }
      if (uploaderClear) {
        uploaderClear.classList.add('hidden');
      }
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  }

  // --- 10. Contact Form Validation & Submission Mock ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !subject || !message) {
        showToast('Please fill out all contact fields!', true);
        return;
      }

      if (!validateEmail(email)) {
        showToast('Please enter a valid email address!', true);
        return;
      }

      showToast(`Thank you, ${name}! Your message regarding "${subject}" has been successfully sent. We'll reply shortly.`);
      contactForm.reset();
    });
  }

  // Helper Email Validator
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
});
