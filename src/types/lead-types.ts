// Lead Management Types

// Status enums
export const LEAD_STATUS = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUALIFIED: 'QUALIFIED',
  PROPOSAL: 'PROPOSAL',
  NEGOTIATION: 'NEGOTIATION',
  CONVERTED: 'CONVERTED',
  LOST: 'LOST',
  ON_HOLD: 'ON_HOLD',
} as const;

export type LeadStatus = (typeof LEAD_STATUS)[keyof typeof LEAD_STATUS];

export const LEAD_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

export type LeadPriority = (typeof LEAD_PRIORITY)[keyof typeof LEAD_PRIORITY];

// Student Lead
export interface StudentLead {
  id: string;
  
  // Personal Information
  full_name: string;
  email: string;
  phone: string;
  alternate_phone: string | null;
  date_of_birth: string | null;
  
  // Academic Information
  current_education: string;
  field_of_interest: string;
  preferred_course: string | null;
  intake_year: string | null;
  intake_season: string | null;
  
  // Lead Details
  lead_source: string;
  source_page: string;
  enquiry_type: string;
  message: string | null;
  
  // Status & Assignment
  status: LeadStatus;
  priority: LeadPriority;
  assigned_to: string | null;
  
  // Tracking
  last_contacted_at: string | null;
  next_followup_at: string | null;
  conversion_date: string | null;
  
  // Metadata
  created_at: string;
  updated_at: string;
  ip_address: string | null;
  user_agent: string | null;
  
  // Joined data
  assigned_user?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  notes?: LeadNote[];
  activities?: LeadActivity[];
  emails?: LeadEmail[];
}

// Enterprise Lead
export interface EnterpriseLead {
  id: string;
  
  // Contact Information
  contact_person_name: string;
  email: string;
  phone: string;
  alternate_phone: string | null;
  
  // Company Information
  company_name: string;
  company_website: string | null;
  company_size: string;
  industry: string;
  designation: string;
  
  // Service Requirements
  service_type: string;
  budget_range: string | null;
  team_size: number | null;
  start_date: string | null;
  urgency: string;
  
  // Lead Details
  lead_source: string;
  source_page: string;
  enquiry_type: string;
  requirements: string | null;
  
  // Status & Assignment
  status: LeadStatus;
  priority: LeadPriority;
  assigned_to: string | null;
  
  // Sales Pipeline
  deal_value: number | null;
  probability: number | null;
  expected_close_date: string | null;
  
  // Tracking
  last_contacted_at: string | null;
  next_followup_at: string | null;
  conversion_date: string | null;
  
  // Metadata
  created_at: string;
  updated_at: string;
  ip_address: string | null;
  user_agent: string | null;
  
  // Joined data
  assigned_user?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  notes?: LeadNote[];
  activities?: LeadActivity[];
  emails?: LeadEmail[];
}

// Lead Note
export interface LeadNote {
  id: string;
  lead_id: string;
  content: string;
  created_by: string | null;
  created_at: string;
  
  // Joined
  created_by_user?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

// Lead Activity
export interface LeadActivity {
  id: string;
  lead_id: string;
  activity_type: string;
  description: string;
  performed_by: string | null;
  old_value: string | null;
  new_value: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  
  // Joined
  performed_by_user?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

// Lead Email
export interface LeadEmail {
  id: string;
  lead_id: string;
  subject: string;
  body: string;
  sent_by: string | null;
  email_type: string;
  status: string;
  sent_at: string;
  opened_at: string | null;
  clicked_at: string | null;
  from_email: string;
  to_email: string;
  cc_email: string[] | null;
  attachments: unknown | null;
  
  // Joined
  sent_by_user?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

// Email Template
export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  body: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Form Data Types (for public forms)
export interface StudentLeadFormData {
  full_name: string;
  email: string;
  phone: string;
  alternate_phone?: string;
  current_education: string;
  field_of_interest: string;
  preferred_course?: string;
  intake_year?: string;
  intake_season?: string;
  message?: string;
}

export interface EnterpriseLeadFormData {
  contact_person_name: string;
  email: string;
  phone: string;
  alternate_phone?: string;
  company_name: string;
  company_website?: string;
  company_size: string;
  industry: string;
  designation: string;
  service_type: string;
  budget_range?: string;
  team_size?: number;
  start_date?: string;
  urgency?: string;
  requirements?: string;
}

// Constants for dropdowns
export const EDUCATION_LEVELS = [
  '10th Pass',
  '12th Pass',
  'Diploma',
  'Undergraduate',
  'Graduate',
  'Post Graduate',
  'Working Professional',
] as const;

export const FIELDS_OF_INTEREST = [
  'Cybersecurity',
  'Web Development',
  'App Development',
  'AI/ML',
  'Data Science',
  'Cloud Computing',
  'DevOps',
  'Networking',
  'Other',
] as const;

export const COMPANY_SIZES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+',
] as const;

export const INDUSTRIES = [
  'Technology',
  'Finance & Banking',
  'Healthcare',
  'E-commerce',
  'Education',
  'Manufacturing',
  'Government',
  'Consulting',
  'Other',
] as const;

export const SERVICE_TYPES = [
  'Security Assessment',
  'Penetration Testing',
  'Security Training',
  'Compliance Audit',
  'Incident Response',
  'Managed Security',
  'Custom Development',
  'Consulting',
  'Other',
] as const;

export const BUDGET_RANGES = [
  'Below ₹50,000',
  '₹50,000 - ₹1,00,000',
  '₹1,00,000 - ₹5,00,000',
  '₹5,00,000 - ₹10,00,000',
  'Above ₹10,00,000',
] as const;

export const URGENCY_LEVELS = [
  'LOW',
  'MEDIUM',
  'HIGH',
  'IMMEDIATE',
] as const;
