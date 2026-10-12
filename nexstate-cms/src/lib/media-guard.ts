export function isAllowedMediaType(mime: string | null | undefined): mime is string {
    return !!mime && /^(image/(jpeg|png|webp|gif|avif)|video/(mp4|webm|quicktime|ogg))$/.test(mime);
}

export const SAFE_FILE_ID = /^[A-Za-z0-9_-]{10,100}$/;
