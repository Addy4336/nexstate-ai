import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const PLACEHOLDER_IMAGE = "https://placehold.co/600x400/1a1a2e/ffffff?text=No+Image";

/**
 * Get the Supabase project URL from environment
 */
function getSupabaseUrl(): string {
    return process.env.NEXT_PUBLIC_SUPABASE_URL || "";
}

/**
 * Converts an image URL to a direct displayable link
 * Handles: Supabase Storage URLs, Google Drive URLs (via drive.slaab.ai proxy), and direct URLs
 * @param url The original image URL
 * @returns A direct link to the image
 */
export function getImageUrl(url: string | null | undefined): string {
    if (!url) return PLACEHOLDER_IMAGE;

    // If it's already a drive.slaab.ai URL, return as-is (optimized proxy)
    if (url.includes('drive.slaab.ai')) {
        return url;
    }

    // Check if it's already a Supabase Storage URL (new format)
    const supabaseUrl = getSupabaseUrl();
    if (supabaseUrl && url.includes(supabaseUrl)) {
        // Already a valid Supabase Storage URL
        return url;
    }

    // Check if it's a Supabase Storage path (without full URL)
    if (url.startsWith("property-images/")) {
        return `${supabaseUrl}/storage/v1/object/public/${url}`;
    }

    // Check if it's a Google Drive URL with file ID
    // Supports multiple formats: uc?export=view&id=, /file/d/{id}/, thumbnail?id=, etc.
    // Convert ALL Google Drive URLs to use drive.slaab.ai proxy for faster loading
    const driveMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)|\/d\/([a-zA-Z0-9_-]+)|\/content\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
        const fileId = driveMatch[1] || driveMatch[2] || driveMatch[3];
        // Use drive.slaab.ai proxy with inline parameter to display (not download)
        return `https://drive.slaab.ai/api/drive/content/${fileId}?inline=true`;
    }

    // Return original if no match (could be already valid or different provider)
    return url;
}

/**
 * @deprecated Use getImageUrl instead - handles both Supabase and Google Drive
 * Converts a Google Drive share URL to a direct image link
 * @param url The original Google Drive URL
 * @returns A direct link to the image (thumbnail)
 */
export function getDriveImageUrl(url: string | null | undefined): string {
    return getImageUrl(url);
}
