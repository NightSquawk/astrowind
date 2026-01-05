/**
 * Photo Carousel - Gallery and Lightbox with Swiper
 *
 * Features:
 * - Responsive gallery carousel
 * - Full-screen lightbox with zoom
 * - Touch gestures and keyboard navigation
 * - Thumbnail navigation
 * - Analytics tracking
 */

import Swiper from 'swiper';
import { Navigation, Pagination, Keyboard, Thumbs, Zoom, FreeMode, A11y } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import 'swiper/css/free-mode';

/**
 * Track gallery event in Google Analytics
 */
function trackGalleryEvent(
  action: string,
  imageIndex: number,
  galleryId: string,
  totalImages: number
) {
  const isDevelopment =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.endsWith('.local');

  if (isDevelopment || typeof window.gtag === 'undefined') {
    console.log('[PhotoCarousel]', action, { imageIndex, galleryId, totalImages });
    return;
  }

  window.gtag('event', 'photo_gallery_interaction', {
    event_category: 'engagement',
    event_label: galleryId,
    gallery_action: action,
    image_index: imageIndex,
    image_number: imageIndex + 1,
    total_images: totalImages,
  });
}

/**
 * Initialize a single photo carousel with lightbox
 */
function initPhotoCarousel(element: HTMLElement) {
  const galleryId = element.id || 'photo-carousel';
  const lightboxEnabled = element.dataset.lightbox === 'true';
  const autoplay = element.dataset.autoplay === 'true';
  const columns = parseInt(element.dataset.columns || '4', 10);

  // Determine slides per view based on columns
  const slidesPerView = {
    2: { mobile: 1, tablet: 2, desktop: 2 },
    3: { mobile: 1, tablet: 2, desktop: 3 },
    4: { mobile: 1, tablet: 2, desktop: 4 },
  }[columns] || { mobile: 1, tablet: 2, desktop: 4 };

  // Initialize main gallery swiper
  const gallerySwiper = new Swiper(`#${galleryId} .photo-carousel-swiper`, {
    modules: [Navigation, Pagination, Keyboard, FreeMode, A11y],

    slidesPerView: slidesPerView.mobile,
    spaceBetween: 16,
    freeMode: true,

    breakpoints: {
      640: {
        slidesPerView: slidesPerView.tablet,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: slidesPerView.desktop,
        spaceBetween: 24,
      },
    },

    navigation: {
      nextEl: `#${galleryId} .photo-carousel-next`,
      prevEl: `#${galleryId} .photo-carousel-prev`,
    },

    pagination: {
      el: `#${galleryId} .photo-carousel-pagination`,
      clickable: true,
      dynamicBullets: true,
    },

    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },

    a11y: {
      prevSlideMessage: 'Previous image',
      nextSlideMessage: 'Next image',
    },

    on: {
      init: function (swiper) {
        trackGalleryEvent('gallery_viewed', 0, galleryId, swiper.slides.length);
      },
    },
  });

  // Lightbox functionality
  if (lightboxEnabled) {
    const lightboxEl = document.getElementById(`${galleryId}-lightbox`);
    if (!lightboxEl) return;

    // Initialize lightbox swiper
    const lightboxSwiper = new Swiper(`#${galleryId}-lightbox .photo-lightbox-swiper`, {
      modules: [Navigation, Keyboard, Zoom, A11y],

      zoom: {
        maxRatio: 3,
        minRatio: 1,
      },

      navigation: {
        nextEl: `#${galleryId}-lightbox .lightbox-next`,
        prevEl: `#${galleryId}-lightbox .lightbox-prev`,
      },

      keyboard: {
        enabled: true,
      },

      a11y: {
        prevSlideMessage: 'Previous image',
        nextSlideMessage: 'Next image',
      },

      on: {
        slideChange: function (swiper) {
          // Update counter
          const counterEl = lightboxEl.querySelector('.lightbox-counter');
          if (counterEl) {
            counterEl.textContent = `${swiper.activeIndex + 1} / ${swiper.slides.length}`;
          }

          trackGalleryEvent('lightbox_navigate', swiper.activeIndex, galleryId, swiper.slides.length);
        },
      },
    });

    // Open lightbox on image click
    const slides = gallerySwiper.slides;
    slides.forEach((slide, index) => {
      slide.addEventListener('click', () => {
        lightboxSwiper.slideTo(index);
        openLightbox(lightboxEl, galleryId, index, slides.length);
      });
    });

    // Close lightbox handlers
    const closeBtn = lightboxEl.querySelector('.lightbox-close');
    closeBtn?.addEventListener('click', () => {
      closeLightbox(lightboxEl);
    });

    // Close on background click
    lightboxEl.addEventListener('click', (e) => {
      if (e.target === lightboxEl || (e.target as HTMLElement).classList.contains('swiper-slide')) {
        closeLightbox(lightboxEl);
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lightboxEl.classList.contains('hidden')) {
        closeLightbox(lightboxEl);
      }
    });
  }

  return gallerySwiper;
}

/**
 * Open lightbox
 */
function openLightbox(lightboxEl: HTMLElement, galleryId: string, imageIndex: number, totalImages: number) {
  lightboxEl.classList.remove('hidden');
  lightboxEl.classList.add('flex');
  document.body.style.overflow = 'hidden';

  // Update counter
  const counterEl = lightboxEl.querySelector('.lightbox-counter');
  if (counterEl) {
    counterEl.textContent = `${imageIndex + 1} / ${totalImages}`;
  }

  trackGalleryEvent('lightbox_opened', imageIndex, galleryId, totalImages);
}

/**
 * Close lightbox
 */
function closeLightbox(lightboxEl: HTMLElement) {
  lightboxEl.classList.add('hidden');
  lightboxEl.classList.remove('flex');
  document.body.style.overflow = '';
}

/**
 * Initialize all photo carousels on the page
 */
function initAllPhotoCarousels() {
  const carousels = document.querySelectorAll<HTMLElement>('.photo-carousel');
  carousels.forEach(initPhotoCarousel);
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllPhotoCarousels);
} else {
  initAllPhotoCarousels();
}

// Re-initialize after Astro view transitions
document.addEventListener('astro:after-swap', initAllPhotoCarousels);
