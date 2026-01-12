import { MetadataRoute } from 'next';

const BASE_URL = 'https://zecurx.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // Main pages
  const mainRoutes = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/academy`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/book-demo`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/why-zecurx`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/industries`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/internships`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
  ];

  // Platform pages
  const platformRoutes = [
    '',
    '/endpoint-security',
    '/cloud-security',
    '/identity-security',
    '/application-security',
    '/ai-detection',
    '/threat-intelligence',
    '/security-automation',
    '/data-protection',
  ].map((route) => ({
    url: `${BASE_URL}/platform${route}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 0.9 : 0.8,
  }));

  // Solutions pages
  const solutionsRoutes = [
    '',
    '/digital-transformation',
    '/ai-powered-soc',
    '/zero-trust',
    '/ransomware-defense',
    '/cloud-security',
    '/compliance',
  ].map((route) => ({
    url: `${BASE_URL}/solutions${route}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 0.9 : 0.8,
  }));

  // Services pages - Offensive Security
  const offensiveSecurityRoutes = [
    '/penetration-testing',
    '/vulnerability-management',
  ].map((route) => ({
    url: `${BASE_URL}/services/offensive${route}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Services pages - Security Engineering
  const engineeringRoutes = [
    '/secure-development',
    '/web-app-security',
    '/devsecops',
    '/consulting',
  ].map((route) => ({
    url: `${BASE_URL}/services/engineering${route}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // Resources pages
  const resourcesRoutes = [
    '',
    '/blog',
    '/whitepapers',
    '/research',
    '/guides',
    '/webinars',
  ].map((route) => ({
    url: `${BASE_URL}/resources${route}`,
    lastModified: currentDate,
    changeFrequency: route === '/blog' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 0.8 : 0.7,
  }));

  // Tools pages (VulnHunter Suite)
  const toolsRoutes = [
    '',
    '/subdomain-finder',
    '/port-radar',
    '/directory-scanner',
    '/ssl-analyzer',
    '/header-scanner',
    '/param-finder',
  ].map((route) => ({
    url: `${BASE_URL}/tools${route}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 0.8 : 0.75,
  }));

  // Legal pages
  const legalRoutes = [
    '/privacy-policy',
    '/terms-of-service',
    '/cookie-policy',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: currentDate,
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }));

  return [
    ...mainRoutes,
    ...platformRoutes,
    ...solutionsRoutes,
    ...offensiveSecurityRoutes,
    ...engineeringRoutes,
    ...resourcesRoutes,
    ...toolsRoutes,
    ...legalRoutes,
  ];
}
