/**
 * Redirect Analytics Tracking for Google Analytics 4
 * Tracks redirect events with comprehensive metadata including source, destination,
 * referrer, UTM parameters, and user context
 */

/**
 * Redirect event parameters interface
 */
export interface RedirectEventParams {
	// Core redirect data
	source_path: string; // /go
	destination_url: string; // /contact-us/
	redirect_type: 'temporary' | 'permanent';
	is_external: boolean;
	external_domain?: string;

	// Traffic source
	referrer: string; // document.referrer
	referrer_domain: string; // parsed domain

	// UTM parameters (if present)
	utm_source?: string;
	utm_medium?: string;
	utm_campaign?: string;
	utm_term?: string;
	utm_content?: string;

	// Additional context
	user_agent: string;
	screen_resolution: string;
	redirect_category?: string; // From redirect config
	timestamp: string;
	time_on_redirect_page?: number; // Milliseconds spent on redirect page
}

/**
 * Extract UTM parameters from URL
 */
function extractUTMParams(url: URL): Partial<Pick<RedirectEventParams, 'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_term' | 'utm_content'>> {
	const params: Partial<Pick<RedirectEventParams, 'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_term' | 'utm_content'>> = {};

	const utmSource = url.searchParams.get('utm_source');
	const utmMedium = url.searchParams.get('utm_medium');
	const utmCampaign = url.searchParams.get('utm_campaign');
	const utmTerm = url.searchParams.get('utm_term');
	const utmContent = url.searchParams.get('utm_content');

	if (utmSource) params.utm_source = utmSource;
	if (utmMedium) params.utm_medium = utmMedium;
	if (utmCampaign) params.utm_campaign = utmCampaign;
	if (utmTerm) params.utm_term = utmTerm;
	if (utmContent) params.utm_content = utmContent;

	return params;
}

/**
 * Parse referrer domain from referrer URL
 */
function parseReferrerDomain(referrer: string): string {
	if (!referrer) return 'direct';

	try {
		const url = new URL(referrer);
		return url.hostname.replace('www.', '');
	} catch {
		return 'direct';
	}
}

/**
 * Extract domain from external URL
 */
function extractDomain(url: string): string {
	try {
		const urlObj = new URL(url);
		return urlObj.hostname.replace('www.', '');
	} catch {
		return 'unknown';
	}
}

/**
 * Get screen resolution as string
 */
function getScreenResolution(): string {
	if (typeof window === 'undefined') return 'unknown';
	return `${window.screen.width}x${window.screen.height}`;
}

/**
 * Check if development mode
 */
function isDevelopment(): boolean {
	if (typeof window === 'undefined') return true;

	return (
		window.location.hostname === 'localhost' ||
		window.location.hostname === '127.0.0.1' ||
		window.location.hostname.endsWith('.local') ||
		!window.gtag // gtag won't exist if Analytics component didn't load (dev mode)
	);
}

/**
 * Track redirect initiated event
 * Fires when a redirect is detected and about to happen
 */
export function trackRedirectInitiated(params: {
	sourcePath: string;
	destinationUrl: string;
	redirectType: 'temporary' | 'permanent';
	redirectCategory?: string;
	referrer?: string;
	utmParams?: URLSearchParams;
}): void {
	if (isDevelopment()) {
		console.log('[Redirect Analytics] Would track redirect_initiated:', params);
		return;
	}

	if (!window.gtag) {
		console.warn('[Redirect Analytics] gtag not available');
		return;
	}

	const currentUrl = new URL(window.location.href);
	const referrer = params.referrer || document.referrer || '';
	const referrerDomain = parseReferrerDomain(referrer);
	const isExternal = params.destinationUrl.startsWith('http://') || params.destinationUrl.startsWith('https://');
	const externalDomain = isExternal ? extractDomain(params.destinationUrl) : undefined;

	// Extract UTM params from current URL or provided params
	const utmParams = params.utmParams || currentUrl.searchParams;
	const utmData = extractUTMParams(currentUrl);

	// Build destination URL for page_location
	const destUrlObj = new URL(params.destinationUrl, window.location.origin);
	const fullDestinationUrl = destUrlObj.toString();

	// Fire the redirect_initiated event using GA4 standard parameters
	window.gtag('event', 'redirect_initiated', {
		// Standard GA4 parameters that map to built-in dimensions
		source: utmData.utm_source || referrerDomain || 'direct', // Maps to "Source" dimension
		medium: utmData.utm_medium || 'referral', // Maps to "Medium" dimension
		campaign: utmData.utm_campaign, // Maps to "Campaign" dimension
		term: utmData.utm_term, // Maps to "Manual term" dimension
		content: utmData.utm_content, // Maps to "Manual ad content" dimension
		page_location: fullDestinationUrl, // Maps to "Page location" dimension
		page_referrer: referrer, // Maps to "Page referrer" dimension
		page_title: `Redirect: ${params.sourcePath}`, // Maps to "Page title" dimension
		link_url: fullDestinationUrl, // Maps to "Link URL" dimension
		link_domain: isExternal ? externalDomain : window.location.hostname, // Maps to "Link domain" dimension
		outbound: isExternal, // Maps to "Outbound" dimension
		
		// Custom parameters for redirect-specific data (will need custom dimensions if you want to view them)
		source_path: params.sourcePath,
		destination_url: params.destinationUrl,
		redirect_type: params.redirectType,
		redirect_category: params.redirectCategory,
		external_domain: externalDomain,
	});

	// If external, also fire outbound_redirect event
	if (isExternal) {
		window.gtag('event', 'outbound_redirect', {
			// Standard GA4 parameters
			source: utmData.utm_source || referrerDomain || 'direct',
			medium: utmData.utm_medium || 'referral',
			campaign: utmData.utm_campaign,
			term: utmData.utm_term,
			content: utmData.utm_content,
			page_location: fullDestinationUrl,
			page_referrer: referrer,
			link_url: fullDestinationUrl,
			link_domain: externalDomain,
			outbound: true,
			
			// Custom parameters
			source_path: params.sourcePath,
			destination_url: params.destinationUrl,
			redirect_type: params.redirectType,
			redirect_category: params.redirectCategory,
			external_domain: externalDomain,
		});
	}
}

/**
 * Track redirect click event
 * Fires when user manually clicks through (if manual redirect button is used)
 */
export function trackRedirectClick(params: {
	sourcePath: string;
	destinationUrl: string;
	redirectType: 'temporary' | 'permanent';
	timeOnPage: number;
	redirectCategory?: string;
}): void {
	if (isDevelopment()) {
		console.log('[Redirect Analytics] Would track redirect_click:', params);
		return;
	}

	if (!window.gtag) {
		console.warn('[Redirect Analytics] gtag not available');
		return;
	}

	const referrer = document.referrer || '';
	const referrerDomain = parseReferrerDomain(referrer);
	const currentUrl = new URL(window.location.href);
	const utmData = extractUTMParams(currentUrl);
	const isExternal = params.destinationUrl.startsWith('http://') || params.destinationUrl.startsWith('https://');
	const externalDomain = isExternal ? extractDomain(params.destinationUrl) : undefined;

	// Build destination URL for page_location
	const destUrlObj = new URL(params.destinationUrl, window.location.origin);
	const fullDestinationUrl = destUrlObj.toString();

	window.gtag('event', 'redirect_click', {
		// Standard GA4 parameters
		source: utmData.utm_source || referrerDomain || 'direct',
		medium: utmData.utm_medium || 'referral',
		campaign: utmData.utm_campaign,
		term: utmData.utm_term,
		content: utmData.utm_content,
		page_location: fullDestinationUrl,
		page_referrer: referrer,
		link_url: fullDestinationUrl,
		link_domain: isExternal ? externalDomain : window.location.hostname,
		outbound: isExternal,
		
		// Custom parameters
		source_path: params.sourcePath,
		destination_url: params.destinationUrl,
		redirect_type: params.redirectType,
		redirect_category: params.redirectCategory,
		external_domain: externalDomain,
		time_on_redirect_page: params.timeOnPage,
	});
}

/**
 * Store redirect data in session storage for chain tracking
 */
export function storeRedirectInSession(params: {
	sourcePath: string;
	destinationUrl: string;
	timestamp: string;
}): void {
	if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return;

	try {
		const redirectChain = JSON.parse(sessionStorage.getItem('redirect_chain') || '[]');
		redirectChain.push({
			source: params.sourcePath,
			destination: params.destinationUrl,
			timestamp: params.timestamp,
		});

		// Keep only last 5 redirects to avoid storage bloat
		if (redirectChain.length > 5) {
			redirectChain.shift();
		}

		sessionStorage.setItem('redirect_chain', JSON.stringify(redirectChain));
	} catch (e) {
		console.warn('[Redirect Analytics] Failed to store redirect in session:', e);
	}
}

/**
 * Get redirect chain from session storage
 */
export function getRedirectChain(): Array<{ source: string; destination: string; timestamp: string }> {
	if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return [];

	try {
		return JSON.parse(sessionStorage.getItem('redirect_chain') || '[]');
	} catch {
		return [];
	}
}
