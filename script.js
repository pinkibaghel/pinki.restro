/**
 * AURELIA — Fine Dining & Wood-Fired Gastronomy
 * Interactive Master Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMenuFilters();
  initGalleryFilters();
  initLightbox();
  initReservationEngine();
  initScrollReveal();
  initQuickReserveButtons();
  initFooterYear();
});

/* ==========================================================================
   Navigation & Mobile Menu
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const navItems = document.querySelectorAll('.nav-item');

  // Sticky navbar with blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightCurrentSection();
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }

  // Active section indicator
  function highlightCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-links a[href="#${id}"]`);

      if (matchingLink) {
        if (scrollPos >= top && scrollPos < top + height) {
          navItems.forEach(item => item.classList.remove('active'));
          matchingLink.classList.add('active');
        }
      }
    });
  }
}

/* ==========================================================================
   Special Menu Filter
   ========================================================================== */
function initMenuFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards with smooth fade
      menuCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   Gallery Filter
   ========================================================================== */
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.gallery-btn');
  const items = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      items.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   Gallery Lightbox Modal
   ========================================================================== */
function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const backdrop = document.getElementById('lightboxBackdrop');
  const closeBtn = document.getElementById('lightboxClose');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('h4') ? item.querySelector('h4').textContent : '';
      const tag = item.querySelector('.gallery-tag') ? item.querySelector('.gallery-tag').textContent : '';

      if (img && modal && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || title;
        if (lightboxCaption) {
          lightboxCaption.innerHTML = `<strong>${title}</strong> &bull; <span style="color:var(--color-gold); font-size: 0.9em;">${tag}</span>`;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   Quick Reserve Dishes from Menu
   ========================================================================== */
function initQuickReserveButtons() {
  const quickBtns = document.querySelectorAll('.quick-order-btn');
  const dietaryInput = document.getElementById('dietaryNotes');

  quickBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dish = btn.getAttribute('data-dish');
      const price = btn.getAttribute('data-price');

      if (dietaryInput) {
        const currentVal = dietaryInput.value.trim();
        const addition = `Interested in tasting: ${dish} ($${price})`;
        if (!currentVal.includes(dish)) {
          dietaryInput.value = currentVal ? `${currentVal}; ${addition}` : addition;
        }
      }

      showToast(`Added "${dish}" to your reservation notes!`, 'fa-solid fa-utensils');

      // Smooth scroll to reservation form
      const resSection = document.getElementById('reservations');
      if (resSection) {
        resSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Global helper for Experience selection
window.selectExperience = function(experienceKey) {
  const seatingSelect = document.getElementById('seatingArea');
  if (seatingSelect) {
    seatingSelect.value = experienceKey;
  }
  const resSection = document.getElementById('reservations');
  if (resSection) {
    resSection.scrollIntoView({ behavior: 'smooth' });
  }
  showToast("Selected Chef's Hearth Counter experience!", 'fa-solid fa-fire');
};

/* ==========================================================================
   Reservation Engine
   ========================================================================== */
function initReservationEngine() {
  const dateInput = document.getElementById('resDate');
  const timeBtns = document.querySelectorAll('.time-btn');
  const selectedTimeInput = document.getElementById('selectedTime');
  const resModal = document.getElementById('resModal');
  const resModalClose = document.getElementById('resModalClose');
  const resModalBackdrop = document.getElementById('resModalBackdrop');
  const resModalDone = document.getElementById('resModalDone');

  // Set minimum date to today
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
    
    // Default to tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tYyyy = tomorrow.getFullYear();
    const tMm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const tDd = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.value = `${tYyyy}-${tMm}-${tDd}`;
  }

  // Time slot selection
  timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (selectedTimeInput) {
        selectedTimeInput.value = btn.getAttribute('data-time');
      }
    });
  });

  // Modal close handlers
  const closeResModal = () => {
    if (resModal) {
      resModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (resModalClose) resModalClose.addEventListener('click', closeResModal);
  if (resModalBackdrop) resModalBackdrop.addEventListener('click', closeResModal);
  if (resModalDone) {
    resModalDone.addEventListener('click', () => {
      closeResModal();
      showToast('Reservation reminder saved to your schedule.', 'fa-regular fa-bell');
    });
  }
}

// Reservation Form Submission
window.handleReservationSubmit = function(event) {
  event.preventDefault();

  const partySize = document.getElementById('partySize').value;
  const resDate = document.getElementById('resDate').value;
  const seatingArea = document.getElementById('seatingArea');
  const seatingText = seatingArea.options[seatingArea.selectedIndex].text;
  const occasion = document.getElementById('occasion');
  const occasionText = occasion.options[occasion.selectedIndex].text;
  const selectedTimeBtn = document.querySelector('.time-btn.active');
  const timeText = selectedTimeBtn ? selectedTimeBtn.textContent : '7:00 PM';
  
  const guestName = document.getElementById('guestName').value;
  const guestEmail = document.getElementById('guestEmail').value;
  const guestPhone = document.getElementById('guestPhone').value;
  const dietaryNotes = document.getElementById('dietaryNotes').value;

  // Generate Reference Number
  const randomRef = 'AUR-' + Math.floor(1000 + Math.random() * 9000);

  // Format Date Nicely
  let formattedDate = resDate;
  try {
    const parts = resDate.split('-');
    const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    formattedDate = resDate;
  }

  // Inject into Modal
  const modalBody = document.getElementById('resModalBody');
  if (modalBody) {
    modalBody.innerHTML = `
      <div class="res-ticket">
        <div class="ticket-ref">
          <span class="ticket-label">Reservation Reference</span>
          <span class="ticket-ref-num">${randomRef}</span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Primary Guest</span>
          <span class="ticket-val">${escapeHtml(guestName)}</span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Party Size</span>
          <span class="ticket-val">${partySize} ${partySize === '1' ? 'Guest' : 'Guests'}</span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Date & Time</span>
          <span class="ticket-val">${formattedDate} &bull; ${timeText}</span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Seating</span>
          <span class="ticket-val">${seatingText}</span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Occasion</span>
          <span class="ticket-val">${occasionText}</span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Confirmation Sent To</span>
          <span class="ticket-val">${escapeHtml(guestEmail)}</span>
        </div>
        ${dietaryNotes ? `
        <div class="ticket-row" style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed var(--color-border-subtle);">
          <span class="ticket-label">Culinary Notes</span>
          <span class="ticket-val" style="font-size: 0.82rem; font-weight: 400; text-align: right; max-width: 60%;">${escapeHtml(dietaryNotes)}</span>
        </div>` : ''}
      </div>
      <p style="font-size: 0.78rem; color: var(--color-text-muted); text-align: center; margin-top: 1.2rem;">
        A confirmation SMS has also been dispatched to <strong>${escapeHtml(guestPhone)}</strong>.
      </p>
    `;
  }

  const resModal = document.getElementById('resModal');
  if (resModal) {
    resModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  showToast('Table Reserved! A confirmation email is on its way.', 'fa-solid fa-circle-check');
};

// Private Dining Inquiry Submission
window.handleInquirySubmit = function(event) {
  event.preventDefault();
  const nameInput = document.getElementById('inqName');
  const name = nameInput ? nameInput.value : 'Guest';
  
  showToast(`Thank you, ${name}! Your private dining inquiry has been received. Our concierge will contact you within 24 hours.`, 'fa-solid fa-champagne-glasses');
  event.target.reset();
};

// Newsletter Form Submission
window.handleNewsletterSubmit = function(event) {
  event.preventDefault();
  showToast('Welcome to The Aurelia Gazette. You have been added to our private cellar release list.', 'fa-solid fa-envelope-circle-check');
  event.target.reset();
};

/* ==========================================================================
   Scroll Reveal Animations
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver not available
    revealElements.forEach(el => el.classList.add('active'));
  }
}

/* ==========================================================================
   Toast Notification Utility
   ========================================================================== */
let toastTimeout;
function showToast(message, iconClass = 'fa-solid fa-circle-info') {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;

  toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4200);
}

/* ==========================================================================
   Utilities
   ========================================================================== */
function escapeHtml(string) {
  const div = document.createElement('div');
  div.innerText = string;
  return div.innerHTML;
}

function initFooterYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
