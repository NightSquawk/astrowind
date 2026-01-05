/**
 * Custom Google Analytics 4 Event Tracking
 * Tracks user interactions to maximize data collection
 */

/**
 * Initialize analytics event tracking
 * Should be called after DOM is loaded
 * Only runs in production to avoid tracking development
 */
export function initAnalyticsEvents() {
	// Safety check: Don't track in development
	if (typeof window === 'undefined') {
		return;
	}

	// Check if we're in development mode
	const isDevelopment = 
		window.location.hostname === 'localhost' ||
		window.location.hostname === '127.0.0.1' ||
		window.location.hostname.endsWith('.local') ||
		!window.gtag; // gtag won't exist if Analytics component didn't load (dev mode)

	if (isDevelopment) {
		console.log('[Analytics] Skipping event tracking in development mode');
		return;
	}

	// Track CTA button clicks
	document.addEventListener('click', (e) => {
		const target = e.target as HTMLElement;
		const button = target.closest('a.btn, button.btn, .btn, [class*="cta"], [class*="button"]');
		
		if (button) {
			const buttonText = button.textContent?.trim() || '';
			const href = (button as HTMLAnchorElement).href || '';
			
			window.gtag('event', 'cta_click', {
				button_text: buttonText,
				destination_url: href || window.location.href,
				event_category: 'engagement',
				event_label: buttonText,
			});
		}
	});

	// Track phone number clicks
	document.addEventListener('click', (e) => {
		const target = e.target as HTMLElement;
		const link = target.closest('a[href^="tel:"]');
		
		if (link) {
			const phoneNumber = (link as HTMLAnchorElement).href.replace('tel:', '');
			const linkText = link.textContent?.trim() || phoneNumber;
			
			window.gtag('event', 'phone_click', {
				phone_number: phoneNumber,
				link_text: linkText,
				event_category: 'contact',
				event_label: phoneNumber,
			});
		}
	});

	// Track email clicks
	document.addEventListener('click', (e) => {
		const target = e.target as HTMLElement;
		const link = target.closest('a[href^="mailto:"]');
		
		if (link) {
			const emailAddress = (link as HTMLAnchorElement).href.replace('mailto:', '');
			const linkText = link.textContent?.trim() || emailAddress;
			
			window.gtag('event', 'email_click', {
				email_address: emailAddress,
				link_text: linkText,
				event_category: 'contact',
				event_label: emailAddress,
			});
		}
	});

	// Track form submissions
	document.addEventListener('submit', (e) => {
		const form = e.target as HTMLFormElement;
		if (!form) return;

		const formId = form.id || form.name || 'unknown';
		const formName = form.getAttribute('name') || formId;
		const formAction = form.action || window.location.href;

		window.gtag('event', 'form_submit', {
			form_id: formId,
			form_name: formName,
			form_action: formAction,
			event_category: 'engagement',
			event_label: formName,
		});
	});

	// Track scroll depth
	let scrollDepthTracked = {
		'25': false,
		'50': false,
		'75': false,
		'100': false,
	};

	const trackScrollDepth = () => {
		const windowHeight = window.innerHeight;
		const documentHeight = document.documentElement.scrollHeight;
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		const scrollPercent = Math.round(((scrollTop + windowHeight) / documentHeight) * 100);

		(['25', '50', '75', '100'] as const).forEach((threshold) => {
			if (!scrollDepthTracked[threshold] && scrollPercent >= parseInt(threshold)) {
				scrollDepthTracked[threshold] = true;
				
				window.gtag('event', 'scroll_depth', {
					percent_scrolled: threshold,
					page_path: window.location.pathname,
					event_category: 'engagement',
					event_label: `${threshold}%`,
				});
			}
		});
	};

	// Throttle scroll tracking
	let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
	window.addEventListener('scroll', () => {
		if (scrollTimeout) return;
		scrollTimeout = setTimeout(() => {
			trackScrollDepth();
			scrollTimeout = null;
		}, 100);
	});

	// Track element visibility for key sections
	const trackElementVisibility = () => {
		const sections = document.querySelectorAll('section[id], [class*="section"], [class*="hero"], [class*="feature"]');
		
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
						const sectionName = entry.target.id || 
							entry.target.className || 
							entry.target.getAttribute('data-section') || 
							'unknown';
						
						// Only track once per page load
						if (!entry.target.hasAttribute('data-ga-tracked')) {
							entry.target.setAttribute('data-ga-tracked', 'true');
							
							window.gtag('event', 'element_visibility', {
								section_name: sectionName,
								page_path: window.location.pathname,
								event_category: 'engagement',
								event_label: sectionName,
							});
						}
					}
				});
			},
			{
				threshold: 0.5,
			}
		);

		sections.forEach((section) => {
			observer.observe(section);
		});
	};

	// Initialize visibility tracking after a short delay to ensure DOM is ready
	setTimeout(trackElementVisibility, 500);
}

// Auto-initialize when DOM is ready (only in production)
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
	// Check if we're in development mode before auto-initializing
	const isDevelopment = 
		window.location.hostname === 'localhost' ||
		window.location.hostname === '127.0.0.1' ||
		window.location.hostname.endsWith('.local');

	if (!isDevelopment) {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', initAnalyticsEvents);
		} else {
			initAnalyticsEvents();
		}
	}
}
