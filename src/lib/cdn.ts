/**
 * CDN Helper for ZecurX Assets
 * 
 * Large assets are stored in Hetzner Object Storage (S3-compatible)
 * This helper provides consistent URL generation for CDN assets
 */

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || 'https://zecurx-web.fsn1.your-objectstorage.com';

/**
 * Get CDN URL for an asset
 * @param path - Asset path (e.g., 'brochures/zxCPPT_Brochure_v3.pdf')
 * @returns Full CDN URL
 */
export function getCdnUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${CDN_URL}/${cleanPath}`;
}

/**
 * Fetch a file from CDN as a Buffer (for server-side use like email attachments)
 * @param path - Asset path (e.g., 'brochures/zxCPPT_Brochure_v3.pdf')
 * @returns Buffer of file contents or null if failed
 */
export async function fetchFromCdn(path: string): Promise<Buffer | null> {
  try {
    const url = getCdnUrl(path);
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to fetch from CDN: ${url} - ${response.status}`);
      return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error(`Error fetching from CDN: ${path}`, error);
    return null;
  }
}

/**
 * Asset paths for common resources
 */
export const CDN_ASSETS = {
  brochures: {
    zxCPEH: getCdnUrl('brochures/zxCPEH_Brochure_v3.pdf'),
    zxCPPT: getCdnUrl('brochures/zxCPPT_Brochure_v3.pdf'),
    zxCCP: getCdnUrl('brochures/Course_Brochure_zxCCP.pdf'),
    zxCCF: getCdnUrl('brochures/Course_Brochure_zxCCF.pdf'),
    zxCCE: getCdnUrl('brochures/Course_Brochure_zxCCE.pdf'),
    services: {
      penetrationTesting: getCdnUrl('brochures/services/compressed/penetration-testing.pdf'),
      redTeaming: getCdnUrl('brochures/services/compressed/red-teaming.pdf'),
      riskAudit: getCdnUrl('brochures/services/compressed/risk-audit.pdf'),
      securityOps: getCdnUrl('brochures/services/compressed/security-ops.pdf'),
    }
  },
  pages: {
    aiDetection: getCdnUrl('images/pages/ai-detection.jpeg'),
    aiPoweredSoc: getCdnUrl('images/pages/ai-powered-soc.jpeg'),
    applicationSecurity: getCdnUrl('images/pages/application-security.jpeg'),
    cloudSecurity: getCdnUrl('images/pages/cloud-security.jpeg'),
    cloudSecuritySolution: getCdnUrl('images/pages/cloud-security-solution.jpeg'),
    compliance: getCdnUrl('images/pages/compliance.jpeg'),
    dataProtection: getCdnUrl('images/pages/data-protection.jpeg'),
    digitalTransformation: getCdnUrl('images/pages/digital-transformation.jpeg'),
    endpointSecurity: getCdnUrl('images/pages/endpoint-security.jpeg'),
    identitySecurity: getCdnUrl('images/pages/identity-security.jpeg'),
    ransomwareDefense: getCdnUrl('images/pages/ransomware-defense.jpeg'),
    securityAutomation: getCdnUrl('images/pages/security-automation.jpeg'),
    threatIntelligence: getCdnUrl('images/pages/threat-intelligence.jpeg'),
    zeroTrust: getCdnUrl('images/pages/zero-trust.jpeg'),
  },
  services: {
    applicationSecurity: getCdnUrl('images/services/application-security.png'),
    cloudDevsecops: getCdnUrl('images/services/cloud-devsecops.png'),
    complianceReadiness: getCdnUrl('images/services/compliance-readiness.png'),
    secureAiDevelopment: getCdnUrl('images/services/secure-ai-development.png'),
  },
  backgrounds: {
    dark: getCdnUrl('assets/dark-bg.png'),
    light: getCdnUrl('assets/light-bg.png'),
    readyDark: getCdnUrl('assets/ready-bg-dark.png'),
    readyLight: getCdnUrl('assets/ready-bg-light.png'),
  },
  certificates: {
    background: getCdnUrl('images/certificate-bg.png'),
    templatePdf: getCdnUrl('templates/certificate-template.pdf'),
    templateBg: getCdnUrl('templates/certificate-template-bg.png'),
    signature: getCdnUrl('images/signature-harsh-priyam.png'),
    emailLogo: getCdnUrl('images/zecurx-email-logo.png'),
  },
  brand: {
    logo: getCdnUrl('images/zecurx-logo.png'),
  },
  courses: {
    'bundle-ai': getCdnUrl('images/courses/bundle-ai.png'),
    'cpeh': getCdnUrl('images/courses/cpeh.png'),
    'cppt': getCdnUrl('images/courses/cppt.png'),
    'gaip': getCdnUrl('images/courses/gaip.png'),
    'zxCCP': getCdnUrl('images/courses/zxCCP.png'),
    'zxCCE': getCdnUrl('images/courses/zxCCE.png'),
    'zxCCF': getCdnUrl('images/courses/zxCCF.png'),
    'zxCFD': getCdnUrl('images/courses/zxCFD.png'),
    'zxCPEH': getCdnUrl('images/courses/zxCPEH.png'),
    'zxCPPT': getCdnUrl('images/courses/zxCPPT.png'),
    'zxGAIP': getCdnUrl('images/courses/zxGAIP.png'),
  },
} as const;

/**
 * Check if a path should use CDN (large file) or local (small file)
 * Small files like icons, SVGs stay local for performance
 */
export function getAssetUrl(path: string): string {
  const localPatterns = ['/icons/', '.svg', '.ico'];
  const isLocal = localPatterns.some(pattern => path.includes(pattern));

  if (isLocal) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return getCdnUrl(cleanPath);
}
