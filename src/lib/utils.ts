import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Converts a Google Drive share URL to a direct image link
 * @param url The original Google Drive URL
 * @returns A direct link to the image (thumbnail)
 */
export function getDriveImageUrl(url: string | null | undefined): string {
    const PLACEHOLDER_IMAGE = "https://placehold.co/600x400/1a1a2e/ffffff?text=No+Image";

    if (!url) return PLACEHOLDER_IMAGE;

    // Check if it's a Google Drive URL with file ID
    // Format: https://drive.google.com/uc?export=view&id=FILE_ID
    const driveMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
        const fileId = driveMatch[1];
        // Use local image proxy which fetches from Drive server-side
        // This avoids CORS and permission issues with direct links
        return `/api/images/${fileId}`;
    }

    // Return original if no match (could be already valid or different provider)
    return url;
}
