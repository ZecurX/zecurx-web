const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || 'https://zecurx-web.fsn1.your-objectstorage.com';

/**
 * Constructs a CDN URL for a given local path.
 * If the path is already an absolute URL, it returns it as is.
 * Otherwise, it prepends the CDN base URL.
 */
export function getCdnUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;

  // Ensure we don't have double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${CDN_URL}/${cleanPath}`;
}

/**
 * Common CDN Asset Paths for consistent usage across the app.
 */
export const CDN_ASSETS = {
  brand: {
    logo: getCdnUrl('images/zecurx-logo.png'),
    logoWhite: getCdnUrl('images/zecurx-logo.png'), // Fallback to main logo if white version not found
  },
  courses: {
    // Used by email template system to resolve course logos
    'ethical-hacking': getCdnUrl('images/courses/ethical-hacking.png'),
    'cyber-security': getCdnUrl('images/courses/cyber-security.png'),
    'network-security': getCdnUrl('images/courses/network-security.png'),
    'cloud-security': getCdnUrl('images/courses/cloud-security.png'),
    // Used by CoursePromoCard on certificate page
    cppt: getCdnUrl('images/courses/zxCPPT.png'),
    cpeh: getCdnUrl('images/courses/zxCPEH.png'),
    gaip: getCdnUrl('images/courses/zxGAIP.png'),
    'bundle-ai': getCdnUrl('images/courses/bundle-ai.png'),
  }
};

/**
 * Fetches a file from the CDN and returns it as a Buffer.
 * Useful for server-side operations like PDF generation or email attachments.
 */
export async function fetchFromCdn(path: string): Promise<Buffer> {
  try {
    const url = getCdnUrl(path);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch from CDN: ${response.statusText} (${url})`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error(`CDN Fetch Error [${path}]:`, error);
    throw error;
  }
}
