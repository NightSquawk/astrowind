/**
 * Promo Analytics Tracking for Google Analytics 4
 * Enhanced tracking for campaigns and coupons with specific events and dimensions
 * 
 * Extends the base redirect analytics with campaign/coupon-specific tracking
 */

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
 * Track coupon viewed event
 * Fires when a coupon page is viewed
 */
export function trackCouponViewed(params: {
	couponCode: string;
	couponSlug: string;
	discountType: 'percent' | 'fixed' | 'bogo' | 'free';
	discountValue: number;
	campaignId?: string;
}): void {
	if (isDevelopment()) {
		console.log('[Promo Analytics] Would track coupon_viewed:', params);
		return;
	}

	if (!window.gtag) {
		console.warn('[Promo Analytics] gtag not available');
		return;
	}

	const currentUrl = new URL(window.location.href);
	const referrer = document.referrer || '';
	
	window.gtag('event', 'coupon_viewed', {
		// Standard GA4 parameters
		page_location: window.location.href,
		page_referrer: referrer,
		page_title: document.title,
		
		// Custom parameters for coupon tracking
		coupon_code: params.couponCode,
		coupon_slug: params.couponSlug,
		discount_type: params.discountType,
		discount_value: params.discountValue,
		campaign_id: params.campaignId || '',
		promo_type: 'coupon',
	});
}

/**
 * Track coupon copied event
 * Fires when a user copies a coupon code
 */
export function trackCouponCopied(params: {
	couponCode: string;
	couponSlug?: string;
}): void {
	if (isDevelopment()) {
		console.log('[Promo Analytics] Would track coupon_copied:', params);
		return;
	}

	if (!window.gtag) {
		console.warn('[Promo Analytics] gtag not available');
		return;
	}

	window.gtag('event', 'coupon_copied', {
		// Standard GA4 parameters
		page_location: window.location.href,
		page_referrer: document.referrer || '',
		page_title: document.title,
		
		// Custom parameters
		coupon_code: params.couponCode,
		coupon_slug: params.couponSlug || '',
		promo_type: 'coupon',
	});
}

/**
 * Track campaign viewed event
 * Fires when a campaign page is viewed
 */
export function trackCampaignViewed(params: {
	campaignId: string;
	campaignSlug: string;
}): void {
	if (isDevelopment()) {
		console.log('[Promo Analytics] Would track campaign_viewed:', params);
		return;
	}

	if (!window.gtag) {
		console.warn('[Promo Analytics] gtag not available');
		return;
	}

	const currentUrl = new URL(window.location.href);
	const referrer = document.referrer || '';
	
	window.gtag('event', 'campaign_viewed', {
		// Standard GA4 parameters
		page_location: window.location.href,
		page_referrer: referrer,
		page_title: document.title,
		
		// Custom parameters for campaign tracking
		campaign_id: params.campaignId,
		campaign_slug: params.campaignSlug,
		promo_type: 'campaign',
	});
}

/**
 * Track campaign clicked event
 * Fires when a user clicks on a campaign link
 */
export function trackCampaignClicked(params: {
	campaignId: string;
	campaignSlug: string;
	source?: string;
}): void {
	if (isDevelopment()) {
		console.log('[Promo Analytics] Would track campaign_clicked:', params);
		return;
	}

	if (!window.gtag) {
		console.warn('[Promo Analytics] gtag not available');
		return;
	}

	window.gtag('event', 'campaign_clicked', {
		// Standard GA4 parameters
		page_location: window.location.href,
		page_referrer: document.referrer || '',
		link_url: window.location.href,
		
		// Custom parameters
		campaign_id: params.campaignId,
		campaign_slug: params.campaignSlug,
		source: params.source || 'unknown',
		promo_type: 'campaign',
	});
}

/**
 * Track promo redirect event
 * Enhanced version for promo redirects with campaign/coupon context
 */
export function trackPromoRedirect(params: {
	sourcePath: string;
	destinationUrl: string;
	redirectType: 'temporary' | 'permanent';
	couponCode?: string;
	campaignId?: string;
	promoType: 'campaign' | 'coupon';
	referrer?: string;
	utmParams?: URLSearchParams;
}): void {
	if (isDevelopment()) {
		console.log('[Promo Analytics] Would track promo_redirect:', params);
		return;
	}

	if (!window.gtag) {
		console.warn('[Promo Analytics] gtag not available');
		return;
	}

	const currentUrl = new URL(window.location.href);
	const referrer = params.referrer || document.referrer || '';
	
	// Extract UTM params
	const utmParams = params.utmParams || currentUrl.searchParams;
	const utmSource = utmParams.get('utm_source') || '';
	const utmMedium = utmParams.get('utm_medium') || '';
	const utmCampaign = utmParams.get('utm_campaign') || '';
	
	window.gtag('event', 'promo_redirect', {
		// Standard GA4 parameters
		source: utmSource || 'direct',
		medium: utmMedium || 'promo',
		campaign: utmCampaign || params.campaignId || '',
		page_location: params.destinationUrl,
		page_referrer: referrer,
		link_url: params.destinationUrl,
		
		// Custom parameters for promo tracking
		source_path: params.sourcePath,
		destination_url: params.destinationUrl,
		redirect_type: params.redirectType,
		coupon_code: params.couponCode || '',
		campaign_id: params.campaignId || '',
		promo_type: params.promoType,
	});
}
