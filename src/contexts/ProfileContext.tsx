import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, CompanyProfile, UserUpdate, CompanyProfileUpdate } from "@/types";

interface ProfileData {
  userId?: number;
  companyId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  bio: string;
  avatarUrl: string;
  // Company specific fields
  website?: string;
  industry?: string;
  description?: string;
}

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
  loading: boolean;
  signOut: () => Promise<void>;
}

const defaultProfile: ProfileData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 234 567 890",
  location: "Not set",
  role: "Administrator",
  bio: "Passionate about technology and education. Managing teams and building great products.",
  avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: userData, error } = await supabase
        .from('user')
        .select(`
          *,
          company_profile (
            id,
            website,
            industry,
            description
          )
        `)
        .eq('auth_id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (userData) {
        const safeUserData = userData as User & { company_profile: CompanyProfile[] | CompanyProfile | null };
        const names = (safeUserData.full_name || "").split(' ');
        const firstName = names[0] || "";
        const lastName = names.slice(1).join(' ') || "";

        const companyProfiles = safeUserData.company_profile || [];
        const companyData = Array.isArray(companyProfiles) ? companyProfiles[0] : companyProfiles;
        

        setProfile({
          userId: safeUserData.id,
          companyId: companyData?.id,
          firstName,
          lastName,
          email: safeUserData.email,
          phone: safeUserData.phone_number || "",
          location: "Not set", 
          role: safeUserData.role || "student",
          bio: safeUserData.bio || "",
          avatarUrl: safeUserData.profile_picture || "",
          website: companyData?.website || "",
          industry: companyData?.industry || "",
          description: companyData?.description || "",
        });
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Only fetch if we don't have a profile or if the ID mismatch (though replacing profile is safer)
        if (profile.userId === undefined) { 
             fetchProfile(session.user.id);
        }
      } else {
        setProfile(defaultProfile);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateProfile = async (data: Partial<ProfileData>) => {
    setProfile((prev) => ({ ...prev, ...data }));

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      // Prepare user table updates
      const userUpdates: UserUpdate = {};
      
      if (data.firstName || data.lastName) {
        const fName = data.firstName !== undefined ? data.firstName : profile.firstName;
        const lName = data.lastName !== undefined ? data.lastName : profile.lastName;
        userUpdates.full_name = `${fName} ${lName}`.trim();
      }

      if (data.email) userUpdates.email = data.email;
      if (data.phone) userUpdates.phone_number = data.phone;
      if (data.bio) userUpdates.bio = data.bio;
      if (data.avatarUrl) userUpdates.profile_picture = data.avatarUrl;
      
      if (Object.keys(userUpdates).length > 0) {
        const { error } = await supabase
          .from('user')
          .update(userUpdates)
          .eq('auth_id', authUser.id);
        
        if (error) throw error;
      }

      // Prepare company_profile updates
      const companyUpdates: CompanyProfileUpdate = {};
      if (data.website !== undefined) companyUpdates.website = data.website;
      if (data.industry !== undefined) companyUpdates.industry = data.industry;
      if (data.description !== undefined) companyUpdates.description = data.description;

      if (Object.keys(companyUpdates).length > 0 && profile.role === 'company') {
         const { data: userData } = await supabase
           .from('user')
           .select(`
             id,
             company_profile(id)
           `)
           .eq('auth_id', authUser.id)
           .single();

         if (userData) {
             const companyProfiles = (userData as any).company_profile as any[];
            const existingCompanyProfile = companyProfiles && companyProfiles.length > 0 ? companyProfiles[0] : null;

            if (existingCompanyProfile) {
              const { error: companyError } = await supabase
                .from('company_profile')
                // @ts-ignore
                .update(companyUpdates)
                .eq('id', existingCompanyProfile.id);
              
              if (companyError) throw companyError;
            } else {
              // Insert new company profile
              const { error: companyError } = await supabase
                .from('company_profile')
                // @ts-ignore
                .insert({
                  ...companyUpdates,
                  user_id: (userData as any).id
                });
              
              if (companyError) throw companyError;
            }
         }
      }

    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to save changes to server");
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(defaultProfile);
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, loading, signOut }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
