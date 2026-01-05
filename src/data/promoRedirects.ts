/**
 * Dynamic Promo Redirects Generator
 * 
 * This module dynamically generates redirects from campaign and coupon content collections.
 * Short URLs defined in campaigns and coupons are automatically registered as redirects
 * that go through the analytics tracking system.
 * 
 * Usage: Import getPromoRedirect() and use it in middleware to check for promo redirects
 * before checking static redirects.
 */

import { getCollection } from 'astro:content';
import type { Redirect } from './redirects';
import { getTodayPacific, getPacificDateComponents, createPacificEndOfDay } from '../utils/date-helpers';

/**
 * Get all promo redirects from campaigns and coupons
 * This function should be called at build time or server-side
 */
export async function getPromoRedirects(): Promise<Record<string, Redirect>> {
	const redirects: Record<string, Redirect> = {};

	try {
		// Get all campaigns
		const campaigns = await getCollection('campaigns');
		
		for (const campaign of campaigns) {
			// Only include active campaigns (between startDate and endDate inclusive, in Pacific timezone)
			const nowPacific = getTodayPacific();
			const todayStartPacific = new Date(nowPacific.getFullYear(), nowPacific.getMonth(), nowPacific.getDate());
			// Parse dates: extract UTC components and treat as Pacific timezone
			const startComponents = getPacificDateComponents(campaign.data.startDate);
			const startDate = new Date(startComponents.year, startComponents.month, startComponents.day, 0, 0, 0, 0);
			const endComponents = getPacificDateComponents(campaign.data.endDate);
			const endDate = createPacificEndOfDay(endComponents.year, endComponents.month, endComponents.day);
			
			if (
				campaign.data.shortUrl &&
				startDate <= todayStartPacific &&
				endDate >= todayStartPacific
			) {
				const shortUrl = campaign.data.shortUrl.startsWith('/')
					? campaign.data.shortUrl
					: `/${campaign.data.shortUrl}`;
				
				redirects[shortUrl] = {
					destination: `/campaigns/${campaign.slug}/`,
					permanent: false,
					category: 'promo',
					utmParams: campaign.data.utmParams || {
						utm_source: 'website',
						utm_medium: 'promo',
						utm_campaign: campaign.data.id || campaign.slug,
					},
				};
			}
		}

		// Get all coupons
		const coupons = await getCollection('coupons');
		
		for (const coupon of coupons) {
			// Only include non-expired coupons (expirationDate >= today inclusive, in Pacific timezone)
			const nowPacific = getTodayPacific();
			const todayStartPacific = new Date(nowPacific.getFullYear(), nowPacific.getMonth(), nowPacific.getDate());
			// Get expiration date components (treating as Pacific timezone)
			const expComponents = getPacificDateComponents(coupon.data.expirationDate);
			const expirationDate = createPacificEndOfDay(expComponents.year, expComponents.month, expComponents.day);
			
			if (
				coupon.data.shortUrl &&
				expirationDate >= todayStartPacific
			) {
				const shortUrl = coupon.data.shortUrl.startsWith('/')
					? coupon.data.shortUrl
					: `/${coupon.data.shortUrl}`;
				
				// Determine destination based on destinationType
				let destination = `/coupon/${coupon.slug}/`;
				if (coupon.data.destinationType === 'contact') {
					destination = `/contact-us/?coupon=${encodeURIComponent(coupon.data.code)}`;
				} else if (coupon.data.destinationType === 'custom' && coupon.data.ctaUrl) {
					destination = coupon.data.ctaUrl;
				}

				// Build UTM params - use coupon's utmParams if provided, otherwise use defaults
				const utmParams: Redirect['utmParams'] = coupon.data.utmParams || {
					utm_source: 'social',
					utm_medium: 'promo',
					utm_campaign: coupon.data.campaignId || 'new-year-special-2026',
					utm_content: coupon.data.code,
				};

				redirects[shortUrl] = {
					destination,
					permanent: false,
					category: 'promo',
					utmParams,
				};
			}

			// Process campaign links (SMS, email, social, QR code, etc.)
			if (coupon.data.campaignLinks && expirationDate >= todayStartPacific) {
				// Determine destination based on destinationType (same as above)
				let destination = `/coupon/${coupon.slug}/`;
				if (coupon.data.destinationType === 'contact') {
					destination = `/contact-us/?coupon=${encodeURIComponent(coupon.data.code)}`;
				} else if (coupon.data.destinationType === 'custom' && coupon.data.ctaUrl) {
					destination = coupon.data.ctaUrl;
				}

				// Process each campaign link
				for (const [campaignType, campaignLink] of Object.entries(coupon.data.campaignLinks)) {
					if (campaignLink.shortUrl) {
						const campaignShortUrl = campaignLink.shortUrl.startsWith('/')
							? campaignLink.shortUrl
							: `/${campaignLink.shortUrl}`;
						
						// Build UTM params - use campaign link's utmParams, with fallback to coupon defaults
						const campaignUtmParams: Redirect['utmParams'] = campaignLink.utmParams || {
							utm_source: campaignType === 'qr' ? 'qr_code' : campaignType,
							utm_medium: campaignType === 'qr' ? 'offline' : campaignType,
							utm_campaign: coupon.data.campaignId || 'new-year-special-2026',
							utm_content: coupon.data.code,
						};

						redirects[campaignShortUrl] = {
							destination,
							permanent: false,
							category: `promo-${campaignType}`,
							utmParams: campaignUtmParams,
						};
					}
				}
			}
		}
	} catch (error) {
		// In case content collections aren't available (e.g., during build)
		console.warn('[Promo Redirects] Could not load content collections:', error);
	}

	return redirects;
}

/**
 * Get a single promo redirect by path
 * This is a helper function for middleware use
 */
export async function getPromoRedirect(path: string): Promise<Redirect | null> {
	if (!path) return null;
	
	// Normalize path (remove trailing slash, ensure leading slash)
	const normalizedPath = path.startsWith('/') ? path : `/${path}`;
	const cleanPath = normalizedPath.endsWith('/') && normalizedPath !== '/'
		? normalizedPath.slice(0, -1)
		: normalizedPath;
	
	const promoRedirects = await getPromoRedirects();
	
	// Direct lookup
	const redirect = promoRedirects[cleanPath];
	if (redirect) return redirect;
	
	// Also try with trailing slash
	const redirectWithSlash = promoRedirects[cleanPath + '/'];
	if (redirectWithSlash) return redirectWithSlash;
	
	return null;
}
