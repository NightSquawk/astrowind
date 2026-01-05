/**
 * Datadog Real User Monitoring (RUM) Event Tracking
 * Extends Datadog RUM with custom event tracking for user interactions
 * Works alongside Google Analytics for comprehensive monitoring
 */

import { datadogRum } from '@datadog/browser-rum';

/**
 * Initialize Datadog RUM custom event tracking
 * Should be called after Datadog RUM is initialized
 * Works in both development and production (env is set to 'development' in dev)
 */
export function initDatadogRUMEvents() {
	// Safety check
	if (typeof window === 'undefined') {
		return;
	}

	// Check if Datadog RUM is initialized
	try {
		// This will throw if RUM is not initialized
		datadogRum.getInternalContext();
	} catch (e) {
		console.warn('[Datadog RUM] RUM not initialized, skipping custom event tracking');
		return;
	}

	// Track CTA button clicks
	document.addEventListener('click', (e) => {
		const target = e.target as HTMLElement;
		const button = target.closest('a.btn, button.btn, .btn, [class*="cta"], [class*="button"]');

		if (button) {
			const buttonText = button.textContent?.trim() || '';
			const href = (button as HTMLAnchorElement).href || '';

			datadogRum.addAction('cta_click', {
				button_text: buttonText,
				destination_url: href || window.location.href,
				category: 'engagement',
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

			datadogRum.addAction('phone_click', {
				phone_number: phoneNumber,
				link_text: linkText,
				category: 'contact',
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

			datadogRum.addAction('email_click', {
				email_address: emailAddress,
				link_text: linkText,
				category: 'contact',
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

		datadogRum.addAction('form_submit', {
			form_id: formId,
			form_name: formName,
			form_action: formAction,
			category: 'engagement',
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

				datadogRum.addAction('scroll_depth', {
					percent_scrolled: threshold,
					page_path: window.location.pathname,
					category: 'engagement',
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
		const sections = document.querySelectorAll(
			'section[id], [class*="section"], [class*="hero"], [class*="feature"]'
		);

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
						const sectionName =
							entry.target.id ||
							entry.target.className ||
							entry.target.getAttribute('data-section') ||
							'unknown';

						// Only track once per page load
						if (!entry.target.hasAttribute('data-datadog-tracked')) {
							entry.target.setAttribute('data-datadog-tracked', 'true');

							datadogRum.addAction('element_visibility', {
								section_name: sectionName,
								page_path: window.location.pathname,
								category: 'engagement',
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

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initDatadogRUMEvents);
	} else {
		initDatadogRUMEvents();
	}
}
