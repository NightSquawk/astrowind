/**
 * Link Shortener / Redirect Configuration
 * 
 * Add your redirects here. Format:
 * - key: The short path (e.g., "go" → /go)
 * - value: The destination URL (can be relative or absolute)
 * 
 * Examples:
 * - "/go": "/contact-us/" → Redirects /go to /contact-us/
 * - "/yt": "https://youtube.com/channel/..." → External redirect
 * - "/book": "/contact-us/?action=book" → Redirect with query params
 * - "/campaign": "/contact-us/" with utm_source=instagram → Campaign redirect with UTM tracking
 * 
 * Analytics Tracking:
 * - All redirects are automatically tracked with Google Analytics 4
 * - Events include: source_path, destination_url, referrer, UTM parameters, and more
 * - Use the optional `category` field to group related redirects (e.g., 'marketing', 'social', 'internal')
 * - Use `utmParams` to hardcode UTM parameters for campaign tracking (e.g., Instagram campaigns)
 */

export interface Redirect {
	destination: string;
	permanent?: boolean; // true = 308, false = 307 (default: false for temporary redirects)
	category?: string; // Optional category for analytics grouping (e.g., 'marketing', 'social', 'internal')
	utmParams?: {
		utm_source?: string;
		utm_medium?: string;
		utm_campaign?: string;
		utm_term?: string;
		utm_content?: string;
	}; // Optional hardcoded UTM parameters for campaign tracking
}

export const REDIRECTS: Record<string, Redirect> = {
	// Example redirects - customize these
	"/go": {
		destination: "/contact-us/",
		permanent: false,
	},
	"/book": {
		destination: "/contact-us/?action=book",
		permanent: false,
	},
	// Campaign redirects with hardcoded UTM parameters
	"/test": {
		destination: "/contact-us/",
		permanent: false,
		category: "example-category",
		utmParams: {
			utm_source: "example-source",
			utm_medium: "example-medium",
			utm_campaign: "example-campaign",
		},
	},
	// Add more redirects here...
};

/**
 * Get redirect destination for a given path
 */
export function getRedirect(path: string): Redirect | null {
	if (!path) return null;
	
	// Normalize path (remove trailing slash, ensure leading slash)
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	const cleanPath = normalizedPath.endsWith("/") && normalizedPath !== "/" 
		? normalizedPath.slice(0, -1) 
		: normalizedPath;
	
	// Direct lookup
	const redirect = REDIRECTS[cleanPath];
	if (redirect) return redirect;
	
	// Also try with trailing slash (in case redirect was defined with it)
	const redirectWithSlash = REDIRECTS[cleanPath + "/"];
	if (redirectWithSlash) return redirectWithSlash;
	
	return null;
}
