// Google Analytics 4 Helper Functions
// Replace GA_MEASUREMENT_ID with your actual GA4 Measurement ID (e.g., G-XXXXXXXXXX)

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Check if GA is available
export const isGAEnabled = () => {
  return typeof window !== 'undefined' && GA_MEASUREMENT_ID;
};

// Page view tracking
export const pageview = (url: string) => {
  if (!isGAEnabled()) return;
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Event tracking
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (!isGAEnabled()) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Course enrollment tracking
export const trackCourseEnrollment = (courseId: string, courseName: string, price: number) => {
  event({
    action: 'begin_checkout',
    category: 'ecommerce',
    label: courseName,
    value: price,
  });
  
  // Also track as custom event
  event({
    action: 'course_enrollment_click',
    category: 'academy',
    label: courseId,
    value: price,
  });
};

// Brochure download tracking
export const trackBrochureDownload = (courseId: string, courseName: string) => {
  event({
    action: 'brochure_download',
    category: 'academy',
    label: courseName,
  });
};

// Contact form submission tracking
export const trackContactSubmission = (source: string) => {
  event({
    action: 'form_submission',
    category: 'contact',
    label: source,
  });
};

// Demo booking tracking
export const trackDemoBooking = () => {
  event({
    action: 'demo_booking',
    category: 'leads',
    label: 'book_demo_page',
  });
};

// Tool usage tracking
export const trackToolUsage = (toolName: string) => {
  event({
    action: 'tool_usage',
    category: 'vulnhunter',
    label: toolName,
  });
};

// CTA click tracking
export const trackCTAClick = (ctaName: string, page: string) => {
  event({
    action: 'cta_click',
    category: 'engagement',
    label: `${ctaName} - ${page}`,
  });
};

// Scroll depth tracking
export const trackScrollDepth = (depth: number) => {
  event({
    action: 'scroll',
    category: 'engagement',
    label: `${depth}%`,
    value: depth,
  });
};

// Type declaration for gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}
