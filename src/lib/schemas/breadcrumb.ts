// Breadcrumb Schema for structured navigation

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

// Common breadcrumb patterns
export function getHomeBreadcrumb(): BreadcrumbItem[] {
  return [
    { name: "Home", url: "https://zecurx.com" }
  ];
}

export function getAcademyBreadcrumb(): BreadcrumbItem[] {
  return [
    { name: "Home", url: "https://zecurx.com" },
    { name: "Academy", url: "https://zecurx.com/academy" }
  ];
}

export function getServicesBreadcrumb(serviceName?: string, serviceUrl?: string): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { name: "Home", url: "https://zecurx.com" },
    { name: "Services", url: "https://zecurx.com/services" }
  ];
  
  if (serviceName && serviceUrl) {
    items.push({ name: serviceName, url: serviceUrl });
  }
  
  return items;
}

export function getPlatformBreadcrumb(platformName?: string, platformUrl?: string): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { name: "Home", url: "https://zecurx.com" },
    { name: "Platform", url: "https://zecurx.com/platform" }
  ];
  
  if (platformName && platformUrl) {
    items.push({ name: platformName, url: platformUrl });
  }
  
  return items;
}

export function getSolutionsBreadcrumb(solutionName?: string, solutionUrl?: string): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { name: "Home", url: "https://zecurx.com" },
    { name: "Solutions", url: "https://zecurx.com/solutions" }
  ];
  
  if (solutionName && solutionUrl) {
    items.push({ name: solutionName, url: solutionUrl });
  }
  
  return items;
}

export function getToolsBreadcrumb(toolName?: string, toolUrl?: string): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { name: "Home", url: "https://zecurx.com" },
    { name: "Tools", url: "https://zecurx.com/tools" }
  ];
  
  if (toolName && toolUrl) {
    items.push({ name: toolName, url: toolUrl });
  }
  
  return items;
}

export function getResourcesBreadcrumb(resourceName?: string, resourceUrl?: string): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { name: "Home", url: "https://zecurx.com" },
    { name: "Resources", url: "https://zecurx.com/resources" }
  ];
  
  if (resourceName && resourceUrl) {
    items.push({ name: resourceName, url: resourceUrl });
  }
  
  return items;
}
