import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, X, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/contexts/ProfileContext";

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectToEdit?: any; // Pass the project object if editing
}

const suggestedSkills = [
  "UI&UX", "Back-End", "AI", "Front-End", "Big Data", "Flutter", "Web Dev",
  "Social", "Photo Shop", "cyber sec", "Marketing", "Testing"
];

const projectTypes = [
  "Internship", "Contract", "Part-Time", "Full-Time", "Freelance"
];

const locationTypes = [
  "On-site", "Remote", "Hybrid"
];

export function AddProjectDialog({ open, onOpenChange, projectToEdit }: AddProjectDialogProps) {
  const { profile } = useProfile();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [duration, setDuration] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (projectToEdit) {
        // Edit mode: Populate form
        setTitle(projectToEdit.title || "");
        setDescription(projectToEdit.description || "");

        // Parse Type and Location
        const fullType = projectToEdit.type || "";
        const parts = fullType.split(" ");
        // Heuristic: Check if the last part is a location type
        const lastPart = parts[parts.length - 1];
        if (locationTypes.includes(lastPart)) {
          setLocation(lastPart);
          setType(parts.slice(0, -1).join(" "));
        } else {
          // Default fallback if parsing fails or old data
          setType(fullType);
          setLocation("");
        }

        // Parse Skills
        const reqs = projectToEdit.requirements || "";
        setSelectedSkills(reqs.split(" ").filter((s: string) => s.length > 0));

        setBudget(projectToEdit.amount_of_money?.toString() || "");
        setDeadline(projectToEdit.deadline ? projectToEdit.deadline.split('T')[0] : "");
        setDuration(projectToEdit.duration?.toString() || "");
        setImageUrl(projectToEdit.image_url || "");
      } else {
        // Add mode: Reset form
        setTitle("");
        setType("");
        setLocation("");
        setDescription("");
        setSelectedSkills([]);
        setBudget("");
        setDeadline("");
        setDuration("");
        setCurrentSkill("");
        setImageUrl("");
      }
    }
  }, [open, projectToEdit]);


  const handleSkillAdd = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !selectedSkills.includes(trimmedSkill)) {
      setSelectedSkills([...selectedSkills, trimmedSkill]);
    }
    setCurrentSkill("");
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSkillAdd(currentSkill);
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `project-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile_pictures')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('profile_pictures')
        .getPublicUrl(fileName);

      setImageUrl(data.publicUrl);
      toast.success("Image uploaded!");
    } catch (error: any) {
      toast.error(error.message || "Error uploading image");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };


  const handleSubmit = async () => {
    if (!profile.companyId && profile.role !== 'admin') {
      toast.error("Company profile not found. Please complete your profile.");
      return;
    }

    setIsLoading(true);
    try {
      const projectData = {
        title,
        type: `${type} ${location}`.trim(),
        description,
        requirements: selectedSkills.join(" "),
        amount_of_money: parseFloat(budget) || 0,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        duration: parseFloat(duration) || 0,
        image_url: imageUrl || "https://dfxghnjkyzsxdnrezoxf.supabase.co/storage/v1/object/public/profile_pictures/project-1780572092978-6ki9p6dxpt6.png",
        company_id: profile.companyId || null,
        is_paid: (parseFloat(budget) || 0) > 0,
      };

      if (projectToEdit) {
        // Update
        const { error } = await supabase
          .from('opportunity')
          // @ts-ignore
          .update(projectData)
          .eq('id', projectToEdit.id);

        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('opportunity')
          // @ts-ignore
          .insert(projectData);

        if (error) throw error;
      }

      toast.success(projectToEdit ? "Project updated successfully!" : "Project added successfully!");
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onOpenChange(false);

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to save project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold italic">
            {projectToEdit ? "Edit Project" : "Add Project"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Project Title */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="title" className="text-sm font-medium">Project Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-border"
                placeholder="e.g. Website Redesign"
              />
            </div>

            {/* Project Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="border-border">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Project Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="border-border">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locationTypes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Project Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Project description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] border-border resize-none"
              placeholder="Describe the project details..."
            />
          </div>

          {/* Project Image */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Project Image (Optional)</Label>
            <div className="flex flex-col gap-4">
              {imageUrl && (
                <div className="relative w-full h-40 rounded-md overflow-hidden border border-border">
                  <img src={imageUrl} alt="Project preview" className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => setImageUrl("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="border-border flex-1"
                  placeholder="https://example.com/image.jpg"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0 gap-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    "Uploading..."
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Required Skills (Tags) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Required skills (Type and press Enter)</Label>
            <div className="flex flex-wrap gap-2 mb-2 p-2 border rounded-md min-h-[42px] bg-background">
              {selectedSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="px-2 py-1 flex items-center gap-1"
                >
                  {skill}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => handleSkillRemove(skill)}
                  />
                </Badge>
              ))}
              <input
                type="text"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground min-w-[120px]"
                placeholder={selectedSkills.length === 0 ? "Type a skill..." : ""}
              />
            </div>

            {/* Suggested Skills */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Suggested skills:</Label>
              <div className="flex flex-wrap gap-2">
                {suggestedSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary transition-colors"
                    onClick={() => handleSkillAdd(skill)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Budget, Duration, Deadline */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-sm font-medium">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="border-border"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">Duration (Days)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="border-border"
                placeholder="e.g. 30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-sm font-medium">Deadline</Label>
              <div className="relative">
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="border-border"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 px-8"
            >
              {isLoading ? "Saving..." : (projectToEdit ? "Save Changes" : "Add Project")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
