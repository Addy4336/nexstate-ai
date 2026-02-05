/**
 * Image utility functions for handling Google Drive URLs and image processing
 */

/**
 * Converts Google Drive URLs to a format that can be used as image sources
 * Uses weserv.nl proxy to serve Google Drive images reliably
 * 
 * @param url - The original image URL (can be Google Drive or any other URL)
 * @returns Converted URL optimized for web display
 */
export function convertGoogleDriveUrl(url: string): string {
    // Validate input
    if (!url || typeof url !== 'string' || url.trim() === '') {
        return '';
    }
    
    // Only process Google Drive URLs
    if (!url.includes('drive.google.com')) {
        return url;
    }
    
    let fileId = '';
    
    // Try different Google Drive URL formats to extract file ID
    // Format 1: https://drive.google.com/uc?id=FILE_ID or ?id=FILE_ID
    const ucMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (ucMatch) {
        fileId = ucMatch[1];
    }
    
    // Format 2: https://drive.google.com/file/d/FILE_ID/view
    if (!fileId) {
        const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (fileMatch) {
            fileId = fileMatch[1];
        }
    }
    
    // Format 3: https://drive.google.com/open?id=FILE_ID
    if (!fileId) {
        const openMatch = url.match(/open\?id=([a-zA-Z0-9_-]+)/);
        if (openMatch) {
            fileId = openMatch[1];
        }
    }
    
    // If we found a file ID, convert to weserv.nl proxy URL
    if (fileId) {
        const driveUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
        // Use weserv.nl for reliable image serving with optimization
        // w=1200: max width of 1200px for good quality
        // output=webp: convert to WebP for better compression
        return `https://images.weserv.nl/?url=${encodeURIComponent(driveUrl)}&w=1200&output=webp`;
    }
    
    // If we couldn't extract file ID, return original URL
    return url;
}

/**
 * Process an array of image URLs:
 * - Filter out empty/invalid URLs
 * - Convert Google Drive URLs to proxy format
 * - Remove duplicates
 * 
 * @param urls - Array of image URLs
 * @returns Processed and deduplicated array of valid image URLs
 */
export function processImageUrls(urls: string[]): string[] {
    if (!Array.isArray(urls)) {
        return [];
    }
    
    return urls
        // Filter out empty, null, or whitespace-only URLs
        .filter(url => url && typeof url === 'string' && url.trim() !== '')
        // Convert Google Drive URLs to proxy format
        .map(url => convertGoogleDriveUrl(url))
        // Remove duplicates (keep first occurrence)
        .filter((url, index, self) => self.indexOf(url) === index);
}

/**
 * Get a fallback image URL for when image loading fails
 * 
 * @param category - Optional category to get category-specific fallback
 * @returns Fallback image URL
 */
export function getFallbackImageUrl(category?: string): string {
    // Use a reliable Unsplash image as fallback
    return 'https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?w=800&auto=format&fit=crop';
}

/**
 * Validate if a URL is likely to be a valid image URL
 * 
 * @param url - URL to validate
 * @returns true if URL appears to be valid
 */
export function isValidImageUrl(url: string): boolean {
    if (!url || typeof url !== 'string') {
        return false;
    }
    
    try {
        const urlObj = new URL(url);
        // Check if it's http or https
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            return false;
        }
        return true;
    } catch {
        return false;
    }
}
