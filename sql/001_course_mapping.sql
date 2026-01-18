SET search_path TO zecurx_admin, public;

CREATE TABLE IF NOT EXISTS course_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  web_plan_name TEXT NOT NULL UNIQUE,
  lms_course_id UUID,
  is_internship BOOLEAN DEFAULT false,
  internship_duration_months INT,
  internship_program_type TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_course_mapping_plan_name ON course_mapping(web_plan_name);
CREATE INDEX IF NOT EXISTS idx_course_mapping_is_internship ON course_mapping(is_internship);

INSERT INTO course_mapping (web_plan_name, is_internship, internship_duration_months, internship_program_type) VALUES
  ('Penetration Tester Internship - 3 Months', TRUE, 3, 'penetration_tester'),
  ('Penetration Tester Internship - 6 Months', TRUE, 6, 'penetration_tester'),
  ('App Developer Internship - 3 Months', TRUE, 3, 'app_developer'),
  ('App Developer Internship - 6 Months', TRUE, 6, 'app_developer'),
  ('Website Developer Internship - 3 Months', TRUE, 3, 'website_developer'),
  ('Website Developer Internship - 6 Months', TRUE, 6, 'website_developer'),
  ('Cybersecurity AI Developer Internship - 3 Months', TRUE, 3, 'cybersecurity_ai'),
  ('Cybersecurity AI Developer Internship - 6 Months', TRUE, 6, 'cybersecurity_ai')
ON CONFLICT (web_plan_name) DO NOTHING;
