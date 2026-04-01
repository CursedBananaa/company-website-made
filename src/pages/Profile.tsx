import { useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Mail, Phone, MapPin, Briefcase, Save, Globe } from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/contexts/ProfileContext";

export default function Profile() {
  const { profile, updateProfile, saveCompanyProfile } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    toast.success("Personal details updated locally.");
  };

  const handleCompanySave = async () => {
    await saveCompanyProfile();
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        updateProfile({ avatarUrl: event.target?.result as string, logoUrl: event.target?.result as string });
        toast.success("Profile image updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <Card className="lg:col-span-1 bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                    <AvatarImage src={profile.role === 'company' ? (profile.logoUrl || profile.avatarUrl) : profile.avatarUrl} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {profile.firstName[0]}{profile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                    onClick={handleAvatarClick}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-foreground">
                  {profile.role === 'company' 
                    ? (profile.companyName || `${profile.firstName} ${profile.lastName}`)
                    : `${profile.firstName} ${profile.lastName}`
                  }
                </h2>
                <p className="text-sm text-muted-foreground">
                  {profile.role === 'company' ? (profile.industry || "Company") : profile.role}
                </p>

                <div className="mt-6 w-full text-left space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{profile.role === 'company' ? (profile.contactEmail || profile.email) : profile.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span className="truncate">{profile.role === 'company' ? (profile.contactPhone || profile.phone) : profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {profile.role === 'company' 
                        ? (
                            [profile.city, profile.state, profile.country].filter(Boolean).join(', ') || 
                            profile.address || 
                            profile.location || 
                            "Location not set"
                          ) 
                        : (profile.location || "Location not set")
                      }
                    </span>
                  </div>
                  {profile.role === 'company' && profile.websiteUrl && (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Globe className="h-4 w-4 shrink-0" />
                      <a href={profile.websiteUrl.startsWith('http') ? profile.websiteUrl : `https://${profile.websiteUrl}`} target="_blank" rel="noopener noreferrer" className="truncate hover:underline text-primary">
                        {profile.websiteUrl.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  {profile.role !== 'company' && (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4 shrink-0" />
                      <span className="capitalize">{profile.role}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Company Profile Form */}

          <Card className="lg:col-span-2 bg-card border-border">
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
                <CardDescription>Manage your company information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {profile.role === 'company' && (!profile.websiteUrl || !profile.industry || !profile.description) && (
                  <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md flex items-center gap-3 border border-destructive/20">
                    <div className="h-4 w-4 shrink-0 rounded-full bg-destructive/20 flex items-center justify-center">!</div>
                    <div className="text-sm font-medium">Please complete your company profile details (Industry, Website, Description) to access all features.</div>
                  </div>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={profile.companyName || ""}
                      onChange={(e) => updateProfile({ companyName: e.target.value })}
                      className="bg-muted border-input"
                      placeholder="Adham Net"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={profile.industry || ""}
                      onChange={(e) => updateProfile({ industry: e.target.value })}
                      className="bg-muted border-input"
                      placeholder=".NET Services"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Website URL</Label>
                    <Input
                      id="websiteUrl"
                      value={profile.websiteUrl || ""}
                      onChange={(e) => updateProfile({ websiteUrl: e.target.value })}
                      className="bg-muted border-input"
                      placeholder="https://Net.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      value={profile.contactEmail || ""}
                      onChange={(e) => updateProfile({ contactEmail: e.target.value })}
                      className="bg-muted border-input"
                      placeholder="hr@Net.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      value={profile.contactPhone || ""}
                      onChange={(e) => updateProfile({ contactPhone: e.target.value })}
                      className="bg-muted border-input"
                      placeholder="011112221"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profile.address || ""}
                      onChange={(e) => updateProfile({ address: e.target.value })}
                      className="bg-muted border-input"
                      placeholder="123 Net Park"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={profile.city || ""}
                      onChange={(e) => updateProfile({ city: e.target.value })}
                      className="bg-muted border-input"
                      placeholder="Alexandria"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={profile.country || ""}
                      onChange={(e) => updateProfile({ country: e.target.value })}
                      className="bg-muted border-input"
                      placeholder="Egypt"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    value={profile.description || ""}
                    onChange={(e) => updateProfile({ description: e.target.value })}
                    className="bg-muted border-input min-h-[100px]"
                    placeholder="Leading software development firm."
                  />
                </div>

                <Button onClick={handleCompanySave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Company Details
                </Button>
              </CardContent>
            </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
