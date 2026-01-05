/**
 * Date helper utilities for handling Pacific timezone dates
 * When a date like 2026-01-31 is specified in markdown, it means Jan 31, 2026 in Pacific timezone
 */

/**
 * Get "today" in Pacific timezone for comparisons
 * Returns a Date object representing the start of today in Pacific timezone
 * This date can be used for comparisons with other Pacific timezone dates
 */
export function getTodayPacific(): Date {
	const now = new Date();
	
	// Get current date components in Pacific timezone
	const pacificDateStr = now.toLocaleDateString('en-US', { 
		timeZone: 'America/Los_Angeles',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
	
	// Parse the date string (format: MM/DD/YYYY)
	const [month, day, year] = pacificDateStr.split('/').map(Number);
	
	// Create a date at noon UTC on today's date to determine timezone offset
	// This avoids DST issues by using a time in the middle of the day
	const testUTC = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
	
	// Get what this UTC time is in Pacific timezone
	const pacificTestStr = testUTC.toLocaleString('en-US', {
		timeZone: 'America/Los_Angeles',
		hour: '2-digit',
		hour12: false,
	});
	const pacificHour = parseInt(pacificTestStr.split(':')[0]);
	
	// Calculate the offset in hours
	// If UTC noon (12:00) is 4:00 AM Pacific, offset is -8 hours (PST)
	// If UTC noon (12:00) is 5:00 AM Pacific, offset is -7 hours (PDT)
	const offsetHours = pacificHour - 12;
	
	// Create midnight Pacific as UTC
	// Midnight Pacific = UTC time that when converted to Pacific is 00:00:00
	// UTC time = Pacific time - offset
	let utcHour = 0 - offsetHours;
	
	let utcYear = year;
	let utcMonth = month - 1;
	let utcDay = day;
	
	if (utcHour < 0) {
		utcHour += 24;
		utcDay -= 1;
		if (utcDay < 1) {
			utcMonth -= 1;
			if (utcMonth < 0) {
				utcMonth = 11;
				utcYear -= 1;
			}
			utcDay = new Date(utcYear, utcMonth + 1, 0).getDate();
		}
	} else if (utcHour >= 24) {
		utcHour -= 24;
		utcDay += 1;
		const daysInMonth = new Date(utcYear, utcMonth + 1, 0).getDate();
		if (utcDay > daysInMonth) {
			utcDay = 1;
			utcMonth += 1;
			if (utcMonth >= 12) {
				utcMonth = 0;
				utcYear += 1;
			}
		}
	}
	
	return new Date(Date.UTC(utcYear, utcMonth, utcDay, utcHour, 0, 0, 0));
}

/**
 * Get date components from a date as if it was specified in Pacific timezone
 * Extracts year/month/day from UTC date (since YAML parses as UTC)
 */
export function getPacificDateComponents(date: Date): {
	year: number;
	month: number;
	day: number;
} {
	// Extract UTC components (since YAML dates are parsed as UTC)
	// These represent the date as written in the markdown file
	const year = date.getUTCFullYear();
	const month = date.getUTCMonth();
	const day = date.getUTCDate();
	
	return { year, month, day };
}

/**
 * Create a date representing end of day in Pacific timezone for comparison
 * Takes date components and creates a date at 23:59:59.999 Pacific time
 * This ensures the coupon is valid through the entire expiration date in Pacific timezone
 * 
 * The date components represent a date in Pacific timezone (e.g., Jan 31, 2025)
 * We need to create a Date object that represents 23:59:59.999 on that date in Pacific time
 */
export function createPacificEndOfDay(year: number, month: number, day: number): Date {
	// Create a date at noon UTC on the target date to determine timezone offset
	// This avoids DST issues by using a time in the middle of the day
	const testUTC = new Date(Date.UTC(year, month, day, 12, 0, 0));
	
	// Get what this UTC time is in Pacific timezone
	const pacificTimeStr = testUTC.toLocaleString('en-US', {
		timeZone: 'America/Los_Angeles',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});
	
	// Parse the Pacific time string (format: "MM/DD/YYYY, HH:mm")
	const parts = pacificTimeStr.split(', ');
	const datePart = parts[0].split('/');
	const timePart = parts[1].split(':');
	const pacificHour = parseInt(timePart[0]);
	
	// Calculate the offset in hours
	// If UTC noon (12:00) is 4:00 AM Pacific, offset is -8 hours (PST)
	// If UTC noon (12:00) is 5:00 AM Pacific, offset is -7 hours (PDT)
	const offsetHours = pacificHour - 12;
	
	// Now create the end of day (23:59:59.999) in Pacific timezone
	// End of day Pacific = UTC time that when converted to Pacific is 23:59:59.999
	// UTC time = Pacific time - offset
	// So: UTC hour = 23 - offsetHours
	let utcHour = 23 - offsetHours;
	
	// Handle day rollover if needed
	let utcYear = year;
	let utcMonth = month;
	let utcDay = day;
	
	if (utcHour >= 24) {
		utcHour -= 24;
		utcDay += 1;
		// Handle month/year rollover if needed
		const daysInMonth = new Date(utcYear, utcMonth + 1, 0).getDate();
		if (utcDay > daysInMonth) {
			utcDay = 1;
			utcMonth += 1;
			if (utcMonth >= 12) {
				utcMonth = 0;
				utcYear += 1;
			}
		}
	} else if (utcHour < 0) {
		utcHour += 24;
		utcDay -= 1;
		if (utcDay < 1) {
			utcMonth -= 1;
			if (utcMonth < 0) {
				utcMonth = 11;
				utcYear -= 1;
			}
			utcDay = new Date(utcYear, utcMonth + 1, 0).getDate();
		}
	}
	
	// Create the UTC date representing end of day in Pacific
	return new Date(Date.UTC(utcYear, utcMonth, utcDay, utcHour, 59, 59, 999));
}

/**
 * Format date components for display
 */
export function formatPacificDate(year: number, month: number, day: number): string {
	const date = new Date(year, month, day);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}
