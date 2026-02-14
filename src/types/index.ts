import { Database } from "@/integrations/supabase/types";

export type User = Database['public']['Tables']['user']['Row'];
export type CompanyProfile = Database['public']['Tables']['company_profile']['Row'];
export type Opportunity = Database['public']['Tables']['opportunity']['Row'];
export type Application = Database['public']['Tables']['application']['Row'];
export type StudentProfile = Database['public']['Tables']['student_profile']['Row'];

export type UserInsert = Database['public']['Tables']['user']['Insert'];
export type UserUpdate = Database['public']['Tables']['user']['Update'];
export type CompanyProfileUpdate = Database['public']['Tables']['company_profile']['Update'];
