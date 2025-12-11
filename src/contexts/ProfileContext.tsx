import { createContext, useContext, useState, ReactNode } from "react";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  bio: string;
  avatarUrl: string;
}

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
}

const defaultProfile: ProfileData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 234 567 890",
  location: "New York, USA",
  role: "Administrator",
  bio: "Passionate about technology and education. Managing teams and building great products.",
  avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);

  const updateProfile = (data: Partial<ProfileData>) => {
    setProfile((prev) => ({ ...prev, ...data }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
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
