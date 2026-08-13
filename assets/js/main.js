/**
 * Jason the Barber - Official Client-Side JavaScript
 * Pure Vanilla JavaScript - No dependencies required
 * Compatible with static GitHub Pages hosting
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initStickyHeader();
    initCurrentYear();
    initGallery();
    initFaqAccordion();
    initSmoothScrolling();
  });

  /* --------------------------------------------------------------------------
     Navigation & Mobile Menu
     -------------------------------------------------------------------------- */
  function initNavigation() {
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const navDrawer = document.getElementById('mobileNavDrawer');
    const closeBtn = document.getElementById('mobileMenuClose');

    if (!toggleBtn || !navDrawer) return;

    function openMenu() {
      navDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
      toggleBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      navDrawer.classList.remove('open');
      document.body.style.overflow = '';
      toggleBtn.setAttribute('aria-expanded', 'false');
    }

    toggleBtn.addEventListener('click', function () {
      if (navDrawer.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    // Close when clicking outside on links
    const mobileLinks = navDrawer.querySelectorAll('.mobile-nav-link, .btn');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  /* --------------------------------------------------------------------------
     Sticky Header on Scroll
     -------------------------------------------------------------------------- */
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    function checkScroll() {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  /* --------------------------------------------------------------------------
     Dynamic Copyright Year
     -------------------------------------------------------------------------- */
  function initCurrentYear() {
    const yearEls = document.querySelectorAll('.current-year');
    const year = new Date().getFullYear();
    yearEls.forEach(function (el) {
      el.textContent = year;
    });
  }

  /* --------------------------------------------------------------------------
     Gallery Filter & Accessible Lightbox
     -------------------------------------------------------------------------- */
  function initGallery() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('galleryLightbox');

    // Filter Functionality
    if (filterButtons.length && galleryItems.length) {
      filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          filterButtons.forEach(function (b) { b.classList.remove('active'); });
          this.classList.add('active');

          const filter = this.getAttribute('data-filter');

          galleryItems.forEach(function (item) {
            const category = item.getAttribute('data-category');
            if (filter === 'all' || category === filter || (filter === 'fades' && category.includes('fade'))) {
              item.style.display = 'block';
            } else {
              item.style.display = 'none';
            }
          });
        });
      });
    }

    // Lightbox Functionality
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const closeBtn = lightbox.querySelector('.lightbox-close-btn');
    const prevBtn = lightbox.querySelector('.lightbox-prev-btn');
    const nextBtn = lightbox.querySelector('.lightbox-next-btn');

    let currentIndex = 0;
    const visibleItems = function () {
      return Array.from(galleryItems).filter(function (item) {
        return item.style.display !== 'none';
      });
    };

    function showItem(index) {
      const items = visibleItems();
      if (!items.length) return;

      if (index < 0) index = items.length - 1;
      if (index >= items.length) index = 0;

      currentIndex = index;
      const targetItem = items[currentIndex];
      const img = targetItem.querySelector('img');
      const title = targetItem.querySelector('.gallery-caption-title');

      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Jason the Barber Haircut Portfolio';
      }

      if (title && lightboxTitle) {
        lightboxTitle.textContent = title.textContent;
      }

      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    galleryItems.forEach(function (item, index) {
      item.addEventListener('click', function () {
        const items = visibleItems();
        const currentVisibleIndex = items.indexOf(item);
        showItem(currentVisibleIndex !== -1 ? currentVisibleIndex : index);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', function () { showItem(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { showItem(currentIndex + 1); });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showItem(currentIndex - 1);
      if (e.key === 'ArrowRight') showItem(currentIndex + 1);
    });
  }

  /* --------------------------------------------------------------------------
     FAQ Accordions
     -------------------------------------------------------------------------- */
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
      const questionBtn = item.querySelector('.faq-question');
      if (!questionBtn) return;

      questionBtn.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');

        // Close other FAQs for accordion behavior
        faqItems.forEach(function (otherItem) {
          otherItem.classList.remove('open');
          const btn = otherItem.querySelector('.faq-question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('open');
          questionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     Smooth Scrolling for In-Page Anchors
     -------------------------------------------------------------------------- */
  function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    anchorLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
})();
