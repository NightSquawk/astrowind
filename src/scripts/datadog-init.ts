/**
 * Datadog RUM Initialization Script
 * This file is bundled by Astro and can import npm packages
 */

import { datadogRum } from '@datadog/browser-rum';

/**
 * Initialize Datadog RUM with configuration from window.__DATADOG_CONFIG__
 */
/**
 * Initialize Datadog RUM with configuration from window.__DATADOG_CONFIG__
 */
export function initDatadogRUM() {
	const config = (window as any).__DATADOG_CONFIG__;
	
	if (!config || !config.applicationId || !config.clientToken) {
		console.warn('[Datadog RUM] Missing configuration, skipping initialization');
		return;
	}

	// TODO: Update allowedTracingUrls with your domain(s)
	const allowedTracingUrls = [
		// Add your production domains here
		// /^https:\/\/www\.yourdomain\.com/,
		// /^https:\/\/yourdomain\.com/,
		// Localhost for development
		/^http:\/\/localhost/,
		/^http:\/\/127\.0\.0\.1/,
		/^http:\/\/localhost:\d+/,
		/^http:\/\/127\.0\.0\.1:\d+/,
	];

	// Initialize Datadog RUM with Session Replay enabled
	datadogRum.init({
		applicationId: config.applicationId,
		clientToken: config.clientToken,
		site: config.site,
		service: config.service,
		env: config.env,
		// Specify a version number to identify the deployed version of your application in Datadog
		...(config.version && { version: config.version }),
		
		// Session sampling: 100% of sessions will be tracked for RUM
		sessionSampleRate: 100,
		
		// Session Replay: 100% of sessions will have replay enabled
		// This records user interactions, page views, and allows visual replay of sessions
		// Adjust this value (0-100) based on your needs and Datadog plan limits
		sessionReplaySampleRate: 100,
		
		// Performance tracking
		trackBfcacheViews: true, // Track back/forward cache navigations
		trackResources: true, // Track resource loading performance
		trackLongTasks: true, // Track long-running tasks
		trackUserInteractions: true, // Track user interactions (clicks, etc.)
		
		// Privacy settings for Session Replay
		// 'allow': Records all content (default, most detailed)
		// 'mask': Masks sensitive elements (text inputs, etc.)
		// 'mask-user-input': Masks user input fields only
		defaultPrivacyLevel: 'allow',
		
		// Enable tracing for first-party resources
		allowedTracingUrls,
	});

	// Set user context if available (optional)
	// datadogRum.setUser({
	// 	id: 'user-id',
	// 	name: 'User Name',
	// 	email: 'user@example.com',
	// });

	// Track custom actions
	datadogRum.addAction('page_view', {
		page: window.location.pathname,
	});
}

// Auto-initialize when DOM is ready and config is available
function tryInit() {
	const config = (window as any).__DATADOG_CONFIG__;
	if (!config || !config.applicationId || !config.clientToken) {
		// Config not ready yet, try again after a short delay
		setTimeout(tryInit, 50);
		return;
	}
	initDatadogRUM();
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', tryInit);
	} else {
		// DOM already loaded, try to init (will retry if config not ready)
		tryInit();
	}
}
