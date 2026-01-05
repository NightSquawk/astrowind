/**
 * Google Tag Manager (GTM) Event Helpers
 *
 * Type-safe helpers for pushing events to the GTM dataLayer.
 * Works in parallel with Google Analytics 4 (GA4) tracking.
 *
 * Usage:
 * import { pushToDataLayer, trackGTMEvent } from '~/scripts/gtm-events';
 *
 * pushToDataLayer('custom_event', { key: 'value' });
 * trackGTMEvent('button_click', 'engagement', 'Subscribe Button');
 */

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

/**
 * Initialize dataLayer if it doesn't exist
 */
function ensureDataLayer() {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
  }
}

/**
 * Push an event to the GTM dataLayer
 *
 * @param event - Event name (required)
 * @param params - Additional event parameters (optional)
 */
export function pushToDataLayer(event: string, params?: Record<string, any>) {
  ensureDataLayer();

  if (typeof window === 'undefined') {
    console.warn('[GTM] Cannot push to dataLayer: window is undefined');
    return;
  }

  const eventData = {
    event,
    timestamp: new Date().toISOString(),
    ...params,
  };

  window.dataLayer.push(eventData);

  // Log in development
  const isDevelopment =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.endsWith('.local');

  if (isDevelopment) {
    console.log('[GTM] dataLayer.push:', eventData);
  }
}

/**
 * Track a custom event in GTM with standard structure
 *
 * @param eventName - Name of the event
 * @param category - Event category (e.g., 'engagement', 'ecommerce')
 * @param label - Event label (optional)
 * @param value - Event value (optional)
 */
export function trackGTMEvent(
  eventName: string,
  category: string,
  label?: string,
  value?: number
) {
  pushToDataLayer('custom_event', {
    event_name: eventName,
    event_category: category,
    event_label: label,
    event_value: value,
  });
}

/**
 * Track page view (useful for SPAs or manual tracking)
 *
 * @param pagePath - Page path (e.g., '/about')
 * @param pageTitle - Page title (optional)
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
  pushToDataLayer('page_view', {
    page_path: pagePath,
    page_title: pageTitle || document.title,
    page_location: window.location.href,
  });
}

/**
 * Track CTA/button clicks
 *
 * @param buttonText - Text on the button
 * @param buttonLocation - Where the button is located (e.g., 'header', 'hero')
 * @param buttonUrl - URL the button links to (optional)
 */
export function trackButtonClick(
  buttonText: string,
  buttonLocation?: string,
  buttonUrl?: string
) {
  pushToDataLayer('button_click', {
    button_text: buttonText,
    button_location: buttonLocation,
    button_url: buttonUrl,
  });
}

/**
 * Track form submissions
 *
 * @param formId - ID of the form
 * @param formName - Name of the form
 * @param formAction - Form action URL (optional)
 */
export function trackFormSubmit(formId: string, formName?: string, formAction?: string) {
  pushToDataLayer('form_submit', {
    form_id: formId,
    form_name: formName,
    form_action: formAction,
  });
}

/**
 * Track video interactions
 *
 * @param action - Video action (e.g., 'play', 'pause', 'complete')
 * @param videoTitle - Title of the video
 * @param videoUrl - URL of the video (optional)
 * @param videoProgress - Progress percentage (optional)
 */
export function trackVideoInteraction(
  action: string,
  videoTitle: string,
  videoUrl?: string,
  videoProgress?: number
) {
  pushToDataLayer('video_interaction', {
    video_action: action,
    video_title: videoTitle,
    video_url: videoUrl,
    video_progress: videoProgress,
  });
}

/**
 * Track scroll depth milestones
 *
 * @param depth - Scroll depth percentage (e.g., 25, 50, 75, 100)
 */
export function trackScrollDepth(depth: number) {
  pushToDataLayer('scroll_depth', {
    scroll_depth: depth,
  });
}

/**
 * Track file downloads
 *
 * @param fileName - Name of the downloaded file
 * @param fileUrl - URL of the file
 * @param fileType - Type of file (e.g., 'pdf', 'zip')
 */
export function trackFileDownload(fileName: string, fileUrl: string, fileType?: string) {
  pushToDataLayer('file_download', {
    file_name: fileName,
    file_url: fileUrl,
    file_type: fileType,
  });
}

/**
 * Track outbound link clicks
 *
 * @param linkUrl - Destination URL
 * @param linkText - Link text (optional)
 */
export function trackOutboundLink(linkUrl: string, linkText?: string) {
  pushToDataLayer('outbound_click', {
    link_url: linkUrl,
    link_text: linkText,
    link_domain: new URL(linkUrl).hostname,
  });
}

/**
 * Track search queries
 *
 * @param searchTerm - Search query
 * @param searchResults - Number of results (optional)
 */
export function trackSearch(searchTerm: string, searchResults?: number) {
  pushToDataLayer('search', {
    search_term: searchTerm,
    search_results: searchResults,
  });
}

/**
 * Track user login
 *
 * @param method - Login method (e.g., 'email', 'google', 'facebook')
 */
export function trackLogin(method: string) {
  pushToDataLayer('login', {
    login_method: method,
  });
}

/**
 * Track user signup
 *
 * @param method - Signup method (e.g., 'email', 'google', 'facebook')
 */
export function trackSignup(method: string) {
  pushToDataLayer('sign_up', {
    signup_method: method,
  });
}

/**
 * Set user properties in dataLayer
 *
 * @param userId - User ID
 * @param properties - Additional user properties
 */
export function setUserProperties(userId: string, properties?: Record<string, any>) {
  pushToDataLayer('set_user_properties', {
    user_id: userId,
    ...properties,
  });
}

/**
 * Track ecommerce events (add to cart, purchase, etc.)
 *
 * @param event - Ecommerce event name (e.g., 'add_to_cart', 'purchase')
 * @param ecommerceData - Ecommerce data object
 */
export function trackEcommerce(event: string, ecommerceData: Record<string, any>) {
  pushToDataLayer(event, {
    ecommerce: ecommerceData,
  });
}

// Initialize dataLayer on load
ensureDataLayer();
