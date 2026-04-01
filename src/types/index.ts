export interface User {
  id: number;
  full_name?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone_number?: string;
  phone?: string;
  profile_picture?: string;
  avatarUrl?: string;
  bio?: string;
  role?: string;
}

export interface CompanyProfile {
  id: number;
  user_id?: number;
  industry?: string;
  website?: string;
  description?: string;
  user?: User;
}

export interface Opportunity {
  id: number;
  title?: string;
  type?: string;
  description?: string;
  requirements?: string;
  amount_of_money?: number;
  deadline?: string;
  duration?: number;
  company_id?: number;
  is_paid?: boolean;
  company_profile?: CompanyProfile;
}

export interface Application {
  id: number;
  status?: string;
  created_at?: string;
  proposal?: string;
  cv?: string;
  notes?: string;
  opportunity_id?: number;
  student_profile_id?: number;
  opportunity?: Opportunity;
  student_profile?: StudentProfile;
}

export interface StudentProfile {
  id: number;
  user_id?: number;
  major?: string;
  university?: string;
  grad_year?: string;
  cv_url?: string;
  github_url?: string;
  user?: User;
}

export type UserInsert = Partial<User>;
export type UserUpdate = Partial<User>;
export type CompanyProfileUpdate = Partial<CompanyProfile>;
