import { Organization, WebSite, WithContext, Course, EducationalOrganization } from 'schema-dts'

export function getOrganizationSchema(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ZecurX',
    url: 'https://zecurx.com',
    logo: 'https://zecurx.com/logo.png',
    description: 'Advanced cybersecurity solutions including threat intelligence, endpoint security, cloud protection, zero-trust architecture, and professional security training with ISO-verified certifications.',
    email: 'official@zecurx.com',
    sameAs: [
      'https://twitter.com/zecurx',
      'https://linkedin.com/company/zecurx',
      'https://github.com/zecurx',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'official@zecurx.com',
      url: 'https://zecurx.com/contact',
    },
  }
}

export function getWebSiteSchema(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ZecurX',
    url: 'https://zecurx.com',
    description: 'Advanced cybersecurity solutions including threat intelligence, endpoint security, cloud protection, and zero-trust architecture.',
    publisher: {
      '@type': 'Organization',
      name: 'ZecurX',
      logo: {
        '@type': 'ImageObject',
        url: 'https://zecurx.com/logo.png',
      },
    },
  }
}

export interface CourseData {
  name: string;
  description: string;
  price: number | string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export function getCourseSchema(course: CourseData): WithContext<Course> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'ZecurX Academy',
      sameAs: 'https://zecurx.com/academy',
    },
    educationalLevel: course.level,
    timeRequired: course.duration,
    offers: typeof course.price === 'number' ? {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    } : undefined,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: course.duration,
    },
  }
}

export function getEducationalOrganizationSchema(): WithContext<EducationalOrganization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'ZecurX Academy',
    url: 'https://zecurx.com/academy',
    description: 'Professional cybersecurity training academy offering ISO-verified certifications in ethical hacking, penetration testing, and AI security.',
    parentOrganization: {
      '@type': 'Organization',
      name: 'ZecurX',
      url: 'https://zecurx.com',
    },
  }
}

type SchemaType = WithContext<Organization> | WithContext<WebSite> | WithContext<Course> | WithContext<EducationalOrganization>;

export function StructuredData({ data }: { data: SchemaType }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
