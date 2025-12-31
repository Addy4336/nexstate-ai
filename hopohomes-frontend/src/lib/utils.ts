import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Google Drive image URL helper
export function getDriveImageUrl(fileIdOrUrl: string): string {
  if (!fileIdOrUrl) {
    return "https://placehold.co/600x400/1a1a2e/ffffff?text=No+Image";
  }
  
  // If already a full URL with Google Drive
  if (fileIdOrUrl.startsWith("http") && fileIdOrUrl.includes("drive.google.com")) {
    // Extract file ID from various Google Drive URL formats
    let fileId = null;
    
    // Format: https://drive.google.com/uc?export=view&id=FILE_ID
    if (fileIdOrUrl.includes("id=")) {
      const match = fileIdOrUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (match) fileId = match[1];
    }
    
    // Format: https://drive.google.com/file/d/FILE_ID/view
    if (!fileId) {
      const match = fileIdOrUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match) fileId = match[1];
    }
    
    // If we extracted an ID, use thumbnail format for better performance
    if (fileId) {
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
    }
    
    // Return the original URL if we can't parse it
    return fileIdOrUrl;
  }
  
  // If it's another type of URL, return as-is
  if (fileIdOrUrl.startsWith("http")) {
    return fileIdOrUrl;
  }
  
  // If just a file ID, construct the thumbnail URL
  return `https://drive.google.com/thumbnail?id=${fileIdOrUrl}&sz=w800`;
}

// Format price for display
export function formatPrice(price: number): string {
  return price.toLocaleString();
}
