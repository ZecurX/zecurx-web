// Service Schema for VAPT and other services

export interface ServiceSchemaInput {
  name: string;
  description: string;
  url: string;
  serviceType: string;
  features?: string[];
}

export function getServiceSchema(service: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "url": service.url,
    "serviceType": service.serviceType,
    "provider": {
      "@type": "Organization",
      "name": "ZecurX",
      "@id": "https://zecurx.com/#organization"
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "India"
      },
      {
        "@type": "Place",
        "name": "Worldwide"
      }
    ],
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://zecurx.com/contact",
      "serviceSmsNumber": null,
      "servicePhone": null,
      "availableLanguage": ["English", "Hindi"]
    },
    "termsOfService": "https://zecurx.com/terms-of-service",
    "hasOfferCatalog": service.features ? {
      "@type": "OfferCatalog",
      "name": `${service.name} Features`,
      "itemListElement": service.features.map((feature, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": feature
        }
      }))
    } : undefined
  };
}

// Penetration Testing Service Schema
export function getPenetrationTestingSchema() {
  return getServiceSchema({
    name: "Penetration Testing & Adversary Emulation",
    description: "Advanced penetration testing services simulating real-world attacks to identify exploitable vulnerabilities. Includes external/internal testing, red team operations, web/mobile app testing, and compliance validation for PCI-DSS, HIPAA, SOC2, ISO 27001.",
    url: "https://zecurx.com/services/offensive/penetration-testing",
    serviceType: "Cybersecurity Penetration Testing",
    features: [
      "External Penetration Testing",
      "Internal Penetration Testing",
      "Red Team Operations",
      "Wireless Security Assessment",
      "Web & Mobile App Testing",
      "Compliance Validation (PCI-DSS, HIPAA, SOC2, ISO 27001)"
    ]
  });
}

// Vulnerability Management Service Schema
export function getVulnerabilityManagementSchema() {
  return getServiceSchema({
    name: "Vulnerability Management",
    description: "Continuous vulnerability scanning and management services including asset discovery, infrastructure scanning, AI-driven risk prioritization, cloud security posture management (CSPM), and remediation validation.",
    url: "https://zecurx.com/services/offensive/vulnerability-management",
    serviceType: "Vulnerability Assessment and Management",
    features: [
      "Asset Discovery",
      "Infrastructure Scanning",
      "Risk Prioritization",
      "Cloud Security Posture Management",
      "Trend Analysis",
      "Remediation Validation"
    ]
  });
}

// All Services Catalog Schema
export function getServicesCatalogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "name": "ZecurX Cybersecurity Services",
    "description": "Comprehensive cybersecurity services including penetration testing, vulnerability management, secure development, DevSecOps, and security consulting.",
    "url": "https://zecurx.com/services",
    "provider": {
      "@id": "https://zecurx.com/#organization"
    },
    "itemListElement": [
      {
        "@type": "OfferCatalog",
        "name": "Offensive Security",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Penetration Testing",
              "url": "https://zecurx.com/services/offensive/penetration-testing"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Vulnerability Management",
              "url": "https://zecurx.com/services/offensive/vulnerability-management"
            }
          }
        ]
      },
      {
        "@type": "OfferCatalog",
        "name": "Security Engineering",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Secure Development",
              "url": "https://zecurx.com/services/engineering/secure-development"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Web Application Security",
              "url": "https://zecurx.com/services/engineering/web-app-security"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "DevSecOps",
              "url": "https://zecurx.com/services/engineering/devsecops"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Security Consulting",
              "url": "https://zecurx.com/services/engineering/consulting"
            }
          }
        ]
      }
    ]
  };
}
