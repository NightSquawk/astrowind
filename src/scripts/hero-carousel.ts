/**
 * Hero Carousel - Swiper initialization and analytics tracking
 *
 * Features:
 * - Auto-advance with configurable interval
 * - Keyboard navigation (arrow keys)
 * - Pause on hover
 * - Navigation arrows and pagination dots
 * - Analytics tracking (slide changes, navigation clicks)
 * - Responsive controls
 */

import Swiper from 'swiper';
import { Navigation, Pagination, Keyboard, Autoplay, A11y } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '~/styles/hero-carousel.css';

/**
 * Track carousel event in Google Analytics
 */
function trackCarouselEvent(
  action: string,
  slideIndex: number,
  carouselId: string,
  totalSlides: number
) {
  // Skip tracking in development
  const isDevelopment =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.endsWith('.local');

  if (isDevelopment || typeof window.gtag === 'undefined') {
    console.log('[HeroCarousel]', action, { slideIndex, carouselId, totalSlides });
    return;
  }

  window.gtag('event', 'hero_carousel_interaction', {
    event_category: 'engagement',
    event_label: carouselId,
    carousel_action: action,
    slide_index: slideIndex,
    slide_number: slideIndex + 1, // Human-readable (1-based)
    total_slides: totalSlides,
  });
}

/**
 * Initialize a single hero carousel
 */
function initCarousel(element: HTMLElement) {
  const autoplay = element.dataset.autoplay === 'true';
  const interval = parseInt(element.dataset.interval || '5000', 10);
  const speed = parseInt(element.dataset.speed || '600', 10);
  const carouselId = element.id || 'hero-carousel';

  const swiper = new Swiper(element, {
    modules: [Navigation, Pagination, Keyboard, Autoplay, A11y],

    // Slides
    loop: true,
    speed: speed,

    // Autoplay
    autoplay: autoplay
      ? {
          delay: interval,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }
      : false,

    // Navigation
    navigation: {
      nextEl: `#${carouselId} .hero-carousel-next`,
      prevEl: `#${carouselId} .hero-carousel-prev`,
    },

    // Pagination
    pagination: {
      el: `#${carouselId} .hero-carousel-pagination`,
      clickable: true,
      bulletClass: 'hero-carousel-bullet',
      bulletActiveClass: 'hero-carousel-bullet-active',
    },

    // Keyboard
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },

    // Accessibility
    a11y: {
      prevSlideMessage: 'Previous slide',
      nextSlideMessage: 'Next slide',
      paginationBulletMessage: 'Go to slide {{index}}',
    },

    // Events
    on: {
      init: function (swiper) {
        // Track initial view
        trackCarouselEvent('carousel_viewed', swiper.realIndex, carouselId, swiper.slides.length);
      },

      slideChange: function (swiper) {
        trackCarouselEvent('slide_changed', swiper.realIndex, carouselId, swiper.slides.length);
      },

      navigationNext: function (swiper) {
        trackCarouselEvent('next_clicked', swiper.realIndex, carouselId, swiper.slides.length);
      },

      navigationPrev: function (swiper) {
        trackCarouselEvent('prev_clicked', swiper.realIndex, carouselId, swiper.slides.length);
      },

      paginationRender: function (swiper, paginationEl) {
        // Add click tracking to pagination bullets
        paginationEl.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          if (target.classList.contains('hero-carousel-bullet')) {
            trackCarouselEvent('dot_clicked', swiper.realIndex, carouselId, swiper.slides.length);
          }
        });
      },
    },
  });

  // Track CTA clicks within slides
  const ctaButtons = element.querySelectorAll('.swiper-slide a, .swiper-slide button');
  ctaButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const slideIndex = swiper.realIndex;
      const ctaText = target.textContent?.trim() || 'CTA';

      trackCarouselEvent(`cta_clicked_${ctaText}`, slideIndex, carouselId, swiper.slides.length);
    });
  });

  return swiper;
}

/**
 * Initialize all hero carousels on the page
 */
function initAllCarousels() {
  const carousels = document.querySelectorAll<HTMLElement>('.hero-carousel');
  carousels.forEach(initCarousel);
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllCarousels);
} else {
  initAllCarousels();
}

// Re-initialize after Astro view transitions
document.addEventListener('astro:after-swap', initAllCarousels);
