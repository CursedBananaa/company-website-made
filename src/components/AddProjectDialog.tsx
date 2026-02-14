import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/contexts/ProfileContext";

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function AddProjectDialog({ open, onOpenChange }: AddProjectDialogProps) {
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

  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!profile.companyId) {
      toast.error("Company profile not found. Please complete your profile.");
      return;
    }

    setIsLoading(true);
    try {
      // Insert opportunity
      const { error } = await supabase.from('opportunity').insert({
        title,
        type: `${type} ${location}`.trim(),
        description,
        requirements: selectedSkills.join(" "),
        amount_of_money: parseFloat(budget) || 0,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        duration: parseFloat(duration) || 0, // This is now treated as days by the user, saved as number
        company_id: profile.companyId,
        is_paid: (parseFloat(budget) || 0) > 0,
      });

      if (error) throw error;

      toast.success("Project added successfully!");
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onOpenChange(false);
      
      // Reset form
      setTitle("");
      setType("");
      setLocation("");
      setDescription("");
      setSelectedSkills([]);
      setBudget("");
      setDeadline("");
      setDuration("");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to add project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold italic">Add Project</DialogTitle>
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
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 px-8"
            >
              {isLoading ? "Adding..." : "Add Project"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
