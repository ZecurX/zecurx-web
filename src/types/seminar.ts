// ============================================
// SEMINAR SYSTEM TYPES
// ============================================

export type SeminarStatus = 'pending' | 'approved' | 'rejected' | 'completed';
export type LocationType = 'online' | 'onsite';
export type OtpPurpose = 'registration' | 'certificate';

export type CareerInterest = 
  | 'Ethical Hacking & Offensive Security'
  | 'Software Development'
  | 'AI & Machine Learning'
  | 'Data Science'
  | 'Cloud Security'
  | 'Other';

export const CAREER_INTERESTS: CareerInterest[] = [
  'Ethical Hacking & Offensive Security',
  'Software Development',
  'AI & Machine Learning',
  'Data Science',
  'Cloud Security',
  'Other'
];

// Specific career interest constant for validation
export const OFFENSIVE_SECURITY_INTEREST: CareerInterest = 'Ethical Hacking & Offensive Security';

export const DURATION_OPTIONS = [
  '60 min',
  '90 min',
  '2 hrs',
  '3 hrs',
  'Half Day',
  'Full Day'
] as const;

export const SEMINAR_TYPES = [
  'Threat Briefing',
  'Technical Workshop',
  'Deep Dive',
  'Hands-on Lab',
  'Guest Lecture',
  'Keynote',
  'Panel Discussion'
] as const;

export const YEAR_OPTIONS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Post Graduate',
  'Faculty',
  'Other'
] as const;

// ============================================
// DATABASE MODELS
// ============================================

export interface Seminar {
  id: string;
  title: string;
  description: string | null;
  date: string; // ISO timestamp
  time: string;
  duration: string;
  speaker_name: string;
  speaker_title: string | null;
  seminar_type: string | null;
  topic: string | null;
  location_type: LocationType;
  venue_address: string | null;
  image_url: string | null;
  brochure_url: string | null;
  max_attendees: number | null;
  
  // College info
  organization_name: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string | null;
  additional_notes: string | null;
  
  // Admin controls
  status: SeminarStatus;
  registration_enabled: boolean;
  certificate_enabled: boolean;
  rejection_reason: string | null;
  
  // Metadata
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  approved_by: string | null;
  
  // Computed (from joins)
  registration_count?: number;
  attended_count?: number;
}

export interface SeminarRegistration {
  id: string;
  seminar_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  college_name: string | null;
  year: string | null;
  city_state: string | null;
  email_verified: boolean;
  attended: boolean;
  is_retroactive: boolean;
  registered_at: string;
  verified_at: string | null;
  
  // Joined data
  seminar?: Seminar;
}

export interface SeminarFeedback {
  id: string;
  registration_id: string | null;
  seminar_id: string;
  
  // Step 1
  full_name: string;
  email: string;
  college_name: string | null;
  year: string | null;
  city_state: string | null;
  reminder_contact: string | null;
  
  // Step 2
  career_interest: string | null;
  offensive_security_reason: string | null;
  
  // Step 3
  seminar_rating: number | null;
  most_valuable_part: string | null;
  future_suggestions: string | null;
  join_zecurx: boolean | null;
  
  // Step 4
  certificate_name: string;
  
  submitted_at: string;
}

export interface Certificate {
  id: string;
  registration_id: string | null;
  feedback_id: string | null;
  seminar_id: string;
  certificate_id: string; // ZX-SEM-2025-ABC123
  recipient_name: string;
  recipient_email: string;
  seminar_title: string;
  seminar_date: string;
  speaker_name: string | null;
  organization: string | null;
  pdf_url: string | null;
  generated_at: string;
  download_count: number;
  last_downloaded_at: string | null;
}

export interface OtpVerification {
  id: string;
  email: string;
  otp_code: string;
  purpose: OtpPurpose;
  seminar_id: string | null;
  expires_at: string;
  verified: boolean;
  attempts: number;
  created_at: string;
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

// Public seminar (limited fields)
export interface PublicSeminar {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  duration: string;
  speaker_name: string;
  speaker_title: string | null;
  seminar_type: string | null;
  location_type: LocationType;
  venue_address: string | null;
  image_url: string | null;
  brochure_url: string | null;
  organization_name: string;
  registration_enabled: boolean;
  certificate_enabled: boolean;
  registration_count?: number;
  max_attendees: number | null;
}

// Booking form submission (creates pending seminar)
export interface SeminarBookingRequest {
  // Contact info
  name: string;
  email: string;
  phone?: string;
  organization: string;
  
  // Seminar details
  title: string;
  description: string;
  seminarType: string;
  topic: string;
  speakerName: string;
  speakerTitle?: string;
  duration: string;
  locationType: LocationType;
  venueAddress?: string;
  attendees: number;
  preferredDate: string;
  
  // Optional
  brochureUrl?: string;
  message?: string;
  privacyPolicy: boolean;
  marketingConsent?: boolean;
}

// Student registration
export interface RegistrationRequest {
  fullName: string;
  email: string;
  phone?: string;
  collegeName?: string;
  year?: string;
  cityState?: string;
}

export interface OtpRequest {
  email: string;
  seminarId: string;
  purpose: OtpPurpose;
}

export interface OtpVerifyRequest {
  email: string;
  otp: string;
  seminarId: string;
  purpose: OtpPurpose;
  registrationData?: RegistrationRequest;
}

// Feedback form steps
export interface FeedbackStep1 {
  fullName: string;
  email: string;
  collegeName: string;
  year: string;
  cityState: string;
  reminderContact: string;
}

export interface FeedbackStep2 {
  careerInterest: CareerInterest;
  offensiveSecurityReason: string;
}

export interface FeedbackStep3 {
  seminarRating: number;
  mostValuablePart: string;
  futureSuggestions: string;
  joinZecurx: boolean;
}

export interface FeedbackStep4 {
  certificateName: string;
}

export interface FeedbackSubmission {
  step1: FeedbackStep1;
  step2: FeedbackStep2;
  step3: FeedbackStep3;
  step4: FeedbackStep4;
  seminarId: string;
  registrationId?: string;
}

// Admin actions
export interface ApproveRequest {
  registrationLink?: string; // Custom link to include in email
}

export interface RejectRequest {
  reason: string;
}

export interface UpdateSeminarRequest {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  duration?: string;
  speaker_name?: string;
  speaker_title?: string;
  seminar_type?: string;
  location_type?: LocationType;
  venue_address?: string;
  image_url?: string;
  brochure_url?: string;
  max_attendees?: number;
  registration_enabled?: boolean;
  certificate_enabled?: boolean;
  status?: SeminarStatus;
}

export interface MarkAttendanceRequest {
  attended: boolean;
}

// Certificate verification response
export interface CertificateVerification {
  valid: boolean;
  certificate: {
    certificateId: string;
    recipientName: string;
    seminarTitle: string;
    seminarDate: string;
    speakerName: string | null;
    organization: string | null;
    issuedAt: string;
  } | null;
}
