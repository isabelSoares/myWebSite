const publicBase = process.env.PUBLIC_URL || '';

export const publicPhotoUrl = (src: string): string => `${publicBase}/${src}`;
