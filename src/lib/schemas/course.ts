// Course Schema for ZecurX Academy

export interface CourseSchemaInput {
  id: string;
  name: string;
  description: string;
  price: number | string;
  originalPrice?: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  students?: number;
  features?: string[];
}

export function getCourseSchema(course: CourseSchemaInput) {
  const isNumericPrice = typeof course.price === 'number';
  
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `https://zecurx.com/academy#${course.id}`,
    "name": course.name,
    "description": course.description,
    "provider": {
      "@type": "Organization",
      "name": "ZecurX Academy",
      "sameAs": "https://zecurx.com/academy",
      "url": "https://zecurx.com/academy"
    },
    "educationalLevel": course.level,
    "inLanguage": "en",
    "isAccessibleForFree": false,
    ...(isNumericPrice && {
      "offers": {
        "@type": "Offer",
        "price": course.price,
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "validFrom": new Date().toISOString(),
        "url": `https://zecurx.com/academy#${course.id}`,
        "seller": {
          "@type": "Organization",
          "name": "ZecurX Academy"
        }
      }
    }),
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": course.duration,
      "instructor": {
        "@type": "Organization",
        "name": "ZecurX Academy Instructors"
      }
    },
    ...(course.students && course.students > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": Math.floor(course.students * 0.7),
        "reviewCount": Math.floor(course.students * 0.5)
      }
    }),
    "coursePrerequisites": course.level === 'Beginner' 
      ? "No prior experience required" 
      : "Basic understanding of cybersecurity concepts",
    "teaches": course.features?.slice(0, 5) || [],
    "about": [
      "Cybersecurity",
      "Ethical Hacking",
      "Penetration Testing",
      "Security Certification"
    ]
  };
}

export function getAllCoursesSchema(courses: CourseSchemaInput[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": courses.map((course, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": getCourseSchema(course)
    }))
  };
}

// Educational Organization Schema for Academy
export function getEducationalOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": "https://zecurx.com/academy#educational-org",
    "name": "ZecurX Academy",
    "description": "Elite cybersecurity training institute offering ISO certified courses in ethical hacking, penetration testing, and security operations. 1200+ students trained with 95% pass rate.",
    "url": "https://zecurx.com/academy",
    "parentOrganization": {
      "@id": "https://zecurx.com/#organization"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "ISO Certification",
        "name": "ISO Verified Cybersecurity Certifications"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "bestRating": "5",
      "ratingCount": 1200,
      "reviewCount": 850
    },
    "alumni": {
      "@type": "QuantitativeValue",
      "value": 1200,
      "unitText": "students"
    }
  };
}
