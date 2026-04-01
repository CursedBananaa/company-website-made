import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, companiesApi } from "@/lib/api";
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
  companyName?: string;
  industry?: string;
  websiteUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
  description?: string;
}

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
  saveCompanyProfile: () => Promise<void>;
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
  const [hasCompanyProfile, setHasCompanyProfile] = useState(false);

  const fetchProfile = async () => {
    try {
      const userData = await authApi.getMe();

      if (userData) {
        let isCompanyProfilePresent = false;
        let companyProfileData: any = {};

        try {
          const cProfile = await companiesApi.getProfile();
          if (cProfile) {
            isCompanyProfilePresent = true;
            companyProfileData = {
              companyName: cProfile.companyName || "",
              industry: cProfile.industry || "",
              websiteUrl: cProfile.websiteUrl || "",
              address: cProfile.address || cProfile.location || "",
              city: cProfile.city || "",
              country: cProfile.country || "",
              contactEmail: cProfile.contactEmail || "",
              logoUrl: cProfile.logoUrl || "",
              description: cProfile.description || ""
            };
          }
        } catch (error: any) {
          console.warn("Company profile not currently set or error fetching.");
        }
        
        setHasCompanyProfile(isCompanyProfilePresent);

        const names = (userData.full_name || userData.fullName || userData.name || "").split(' ');
        const firstName = names[0] || "";
        const lastName = names.slice(1).join(' ') || "";

        setProfile({
          userId: userData.id,
          companyId: userData.companyId || undefined,
          firstName,
          lastName,
          email: userData.email,
          phone: userData.phone_number || userData.phone || "",
          location: userData.location || "Not set", 
          role: userData.role || "student",
          bio: userData.bio || "",
          avatarUrl: userData.profile_picture || userData.avatarUrl || "",
          // Merge in explicit company fields if available
          companyName: companyProfileData.companyName || `${firstName} ${lastName}`.trim(),
          websiteUrl: companyProfileData.websiteUrl || "",
          industry: companyProfileData.industry || "",
          description: companyProfileData.description || "",
          address: companyProfileData.address || userData.location || "",
          city: companyProfileData.city || "",
          country: companyProfileData.country || "",
          contactEmail: companyProfileData.contactEmail || userData.email || "",
          contactPhone: companyProfileData.contactPhone || userData.phone || "",
          logoUrl: companyProfileData.logoUrl || userData.profile_picture || userData.avatarUrl || "",
        });
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      localStorage.removeItem('token');
      setProfile(defaultProfile);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const updateProfile = (data: Partial<ProfileData>) => {
    setProfile((prev) => ({ ...prev, ...data }));
  };

  const saveCompanyProfile = async () => {
    try {
      const payload = {
        companyName: profile.companyName || `${profile.firstName} ${profile.lastName}`.trim() || undefined,
        description: profile.description || "",
        industry: profile.industry || "",
        websiteUrl: profile.websiteUrl || "",
        address: profile.address || profile.location || "",
        city: profile.city || "",
        country: profile.country || "",
        contactEmail: profile.contactEmail || profile.email || "",
        contactPhone: profile.contactPhone || profile.phone || "",
        logoUrl: profile.logoUrl || profile.avatarUrl || ""
      };
      
      if (hasCompanyProfile) {
        await companiesApi.updateProfile(payload);
        toast.success("Company profile updated successfully!");
      } else {
        await companiesApi.createProfile(payload);
        setHasCompanyProfile(true);
        toast.success("Company profile created successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to save changes to server");
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('token');
      setProfile(defaultProfile);
      toast.success("Signed out successfully");
      window.location.href = '/';
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, saveCompanyProfile, loading, signOut }}>
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
