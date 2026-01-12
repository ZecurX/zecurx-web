// Organization Schema for ZecurX
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://zecurx.com/#organization",
    "name": "ZecurX",
    "url": "https://zecurx.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://zecurx.com/logo.png",
      "width": 512,
      "height": 512
    },
    "description": "ZecurX provides advanced cybersecurity solutions, penetration testing services, vulnerability assessment, and professional security training in India. ISO certified courses with hands-on labs.",
    "foundingDate": "2023",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN",
      "addressLocality": "India"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "Sales",
        "availableLanguage": ["English", "Hindi"],
        "url": "https://zecurx.com/contact"
      },
      {
        "@type": "ContactPoint",
        "contactType": "Customer Support",
        "availableLanguage": ["English", "Hindi"],
        "url": "https://zecurx.com/contact"
      }
    ],
    "sameAs": [
      "https://linkedin.com/company/zecurx",
      "https://twitter.com/zecurx",
      "https://github.com/zecurx"
    ],
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
    "knowsAbout": [
      "Cybersecurity",
      "Penetration Testing",
      "Vulnerability Assessment",
      "Ethical Hacking",
      "Security Training",
      "Cloud Security",
      "Application Security",
      "Red Team Operations",
      "DevSecOps"
    ],
    "slogan": "Advanced Cybersecurity Solutions & Training",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "minValue": 10,
      "maxValue": 50
    }
  };
}

// Website Schema
export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://zecurx.com/#website",
    "url": "https://zecurx.com",
    "name": "ZecurX",
    "description": "Advanced cybersecurity solutions, VAPT services, and professional security training",
    "publisher": {
      "@id": "https://zecurx.com/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://zecurx.com/resources/blog?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "en-IN"
  };
}
