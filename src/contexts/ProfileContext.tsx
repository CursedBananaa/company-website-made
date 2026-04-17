import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { authApi, companiesApi } from "@/lib/api";

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
  description?: string;
  websiteUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
}

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
  saveCompanyProfile: () => Promise<void>;
  loading: boolean;
  signOut: () => Promise<void>;
  hasCompanyProfile: boolean;
}

const defaultProfile: ProfileData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
  role: "company",
  bio: "",
  avatarUrl: "",
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [hasCompanyProfile, setHasCompanyProfile] = useState(false);

  const fetchProfile = async () => {
    try {
      const userData = await authApi.getMe();
      if (!userData) { setLoading(false); return; }

      const firstName = userData.firstName || userData.first_name || (userData.full_name || "").split(' ')[0] || "";
      const lastName  = userData.lastName  || userData.last_name  || (userData.full_name || "").split(' ').slice(1).join(' ') || "";

      let companyProfileData: any = {};
      let isCompanyProfilePresent = false;

      try {
        const cProfile = await companiesApi.getProfile();
        if (cProfile) {
          isCompanyProfilePresent = true;
          companyProfileData = cProfile;
        }
      } catch {
        // no company profile yet — that's fine
      }

      setHasCompanyProfile(isCompanyProfilePresent);
      setProfile({
        userId: userData.id,
        firstName,
        lastName,
        email: userData.email || "",
        phone: userData.phone_number || userData.phone || "",
        location: userData.location || "",
        role: userData.role || "company",
        bio: userData.bio || "",
        avatarUrl: userData.profile_picture || userData.avatarUrl || "",
        companyName: companyProfileData.companyName || `${firstName} ${lastName}`.trim(),
        industry: companyProfileData.industry || "",
        description: companyProfileData.description || "",
        websiteUrl: companyProfileData.websiteUrl || "",
        address: companyProfileData.address || "",
        city: companyProfileData.city || "",
        state: companyProfileData.state || "",
        country: companyProfileData.country || "",
        contactEmail: companyProfileData.contactEmail || userData.email || "",
        contactPhone: companyProfileData.contactPhone || userData.phone_number || "",
        logoUrl: companyProfileData.logoUrl || userData.profile_picture || "",
      });
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
        address: profile.address || "",
        city: profile.city || "",
        country: profile.country || "",
        contactEmail: profile.contactEmail || profile.email || "",
        contactPhone: profile.contactPhone || profile.phone || "",
        logoUrl: profile.logoUrl || profile.avatarUrl || "",
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
      console.error("Error saving company profile:", error);
      toast.error("Failed to save changes to server");
    }
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    setProfile(defaultProfile);
    toast.success("Signed out successfully");
    window.location.href = "/auth";
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, saveCompanyProfile, loading, signOut, hasCompanyProfile }}>
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
