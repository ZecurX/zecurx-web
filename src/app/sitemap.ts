import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://zecurx.com'
  
  // Static routes with priorities and change frequencies
  const staticRoutes = [
    { url: '', priority: 1.0, changeFrequency: 'daily' as const },
    { url: '/services', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/platform', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/solutions', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/why-zecurx', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/resources', priority: 0.8, changeFrequency: 'daily' as const },
    { url: '/academy', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/industries', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/tools', priority: 0.7, changeFrequency: 'weekly' as const },
    { url: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
    { url: '/contact', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/book-demo', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/shop', priority: 0.6, changeFrequency: 'weekly' as const },
    { url: '/internships', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' as const },
    { url: '/terms-of-service', priority: 0.3, changeFrequency: 'yearly' as const },
    { url: '/cookie-policy', priority: 0.3, changeFrequency: 'yearly' as const },
    
    // Platform pages
    { url: '/platform/threat-intelligence', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/platform/endpoint-security', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/platform/cloud-security', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/platform/identity-security', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/platform/data-protection', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/platform/application-security', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/platform/security-automation', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/platform/ai-detection', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // Solutions pages
    { url: '/solutions/zero-trust', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/solutions/ransomware-defense', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/solutions/cloud-security', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/solutions/ai-powered-soc', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/solutions/compliance', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/solutions/digital-transformation', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // Services pages
    { url: '/services/offensive/penetration-testing', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/services/offensive/vulnerability-management', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/services/engineering/web-app-security', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/services/engineering/secure-development', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/services/engineering/devsecops', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/services/engineering/consulting', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // Resources pages
    { url: '/resources/blog', priority: 0.7, changeFrequency: 'daily' as const },
    { url: '/resources/whitepapers', priority: 0.7, changeFrequency: 'weekly' as const },
    { url: '/resources/guides', priority: 0.7, changeFrequency: 'weekly' as const },
    { url: '/resources/seminars', priority: 0.7, changeFrequency: 'weekly' as const },
    { url: '/resources/research', priority: 0.7, changeFrequency: 'weekly' as const },
    
    // Tools pages
    { url: '/tools/port-radar', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/tools/ssl-analyzer', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/tools/subdomain-finder', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/tools/header-scanner', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/tools/directory-scanner', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/tools/param-finder', priority: 0.6, changeFrequency: 'monthly' as const },
  ]

  return staticRoutes.map(route => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
