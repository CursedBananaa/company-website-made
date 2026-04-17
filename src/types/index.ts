// Standalone types — Supabase removed

export interface User {
  id: number;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  profile_picture?: string;
  bio?: string;
  location?: string;
  phone?: string;
}

export interface CompanyProfile {
  id: number;
  userId: number;
  companyName: string;
  description?: string;
  industry?: string;
  websiteUrl?: string;
  address?: string;
  city?: string;
  country?: string;
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
}

export interface Opportunity {
  id: number;
  companyId: number;
  title: string;
  description?: string;
  status?: string;
  createdAt?: string;
}

export interface Application {
  id: number;
  opportunityId: number;
  studentId: number;
  status?: string;
  createdAt?: string;
}

export interface StudentProfile {
  id: number;
  userId: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  skills?: string[];
  bio?: string;
}

export type UserInsert = Partial<User>;
export type UserUpdate = Partial<User>;
export type CompanyProfileUpdate = Partial<CompanyProfile>;
