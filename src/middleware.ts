import { defineMiddleware } from 'astro:middleware';
import { resolveRedirect } from './data/promoRedirects.js';

/**
 * Middleware to handle link shortener redirects
 * 
 * This middleware intercepts requests and checks if they match
 * any configured redirect paths. If a match is found, it routes
 * through an interstitial page that tracks analytics before redirecting.
 * 
 * Checks promo redirects (from campaigns/coupons) first, then static redirects.
 * 
 * To add new redirects:
 * - Static redirects: edit src/data/redirects.ts
 * - Promo redirects: add shortUrl to campaign or coupon content files
 */
export const onRequest = defineMiddleware(async (context, next) => {
	const pathname = context.url.pathname;
	
	// Skip the redirect interstitial page itself to avoid infinite loops
	// Handle both with and without trailing slash
	const normalizedPathname = pathname.endsWith('/') && pathname !== '/' 
		? pathname.slice(0, -1) 
		: pathname;
	if (normalizedPathname === '/redirect') {
		if (import.meta.env.DEV) {
			console.log('[Redirect Middleware] Skipping redirect page:', pathname);
		}
		return next();
	}
	
	// Debug logging (remove in production if desired)
	if (import.meta.env.DEV) {
		console.log('[Redirect Middleware] Checking path:', pathname);
	}
	
	// Check promo redirects (from campaigns/coupons), then static redirects
	const redirect = await resolveRedirect(pathname);
	
	if (redirect) {
		if (import.meta.env.DEV) {
			console.log('[Redirect Middleware] Found redirect:', pathname, '->', redirect.destination);
		}
		
		// Build redirect interstitial URL. Only the source path is passed; the
		// interstitial resolves destination/type/category from the redirect config itself.
		// Use trailing slash to match Astro's default behavior
		const redirectUrl = new URL('/redirect/', context.url.origin);
		redirectUrl.searchParams.set('source', pathname);
		
		// Add hardcoded UTM parameters from redirect config (if any)
		// These will be merged with any user-provided UTM params
		if (redirect.utmParams) {
			Object.entries(redirect.utmParams).forEach(([key, value]) => {
				if (value) {
					// Only set if not already present (user-provided params take precedence)
					if (!redirectUrl.searchParams.has(key)) {
						redirectUrl.searchParams.set(key, value);
					}
				}
			});
		}
		
		// Preserve all original query parameters (UTM params, etc.)
		// User-provided params will override hardcoded ones
		context.url.searchParams.forEach((value, key) => {
			// Don't duplicate our tracking params
			if (!['source', 'dest', 'type', 'category'].includes(key)) {
				redirectUrl.searchParams.set(key, value);
			}
		});
		
		if (import.meta.env.DEV) {
			console.log('[Redirect Middleware] Redirect URL:', redirectUrl.toString());
			console.log('[Redirect Middleware] Query params:', Array.from(redirectUrl.searchParams.entries()));
		}
		
		// Redirect to interstitial page (which will track and then redirect)
		// Use 307 (temporary) so browser doesn't cache the interstitial
		return context.redirect(redirectUrl.toString(), 307);
	}
	
	// No redirect found, continue with normal request handling
	return next();
});
