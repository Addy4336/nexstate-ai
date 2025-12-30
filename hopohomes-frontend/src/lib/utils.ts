import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Google Drive image URL helper
export function getDriveImageUrl(fileIdOrUrl: string): string {
  if (!fileIdOrUrl) return "";
  
  // If already a full URL, return as is
  if (fileIdOrUrl.startsWith("http")) {
    // Convert Google Drive URLs to thumbnail format
    if (fileIdOrUrl.includes("drive.google.com")) {
      const match = fileIdOrUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match) {
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
      }
    }
    return fileIdOrUrl;
  }
  
  // If just a file ID, construct the URL
  return `https://drive.google.com/thumbnail?id=${fileIdOrUrl}&sz=w800`;
}

// Format price for display
export function formatPrice(price: number): string {
  return price.toLocaleString();
}
