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

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const suggestedSkills = [
  "UI&UX", "Back-End", "AI", "Front-End", "Big Data", "Flutter", "Web Dev",
  "Social", "Photo Shop", "cyber sec", "Marketing", "Testing"
];

export function AddProjectDialog({ open, onOpenChange }: AddProjectDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // ... existing code ...

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to add a project");
        return;
      }

      // 2. Get company profile
      const { data: companyProfile, error: profileError } = await supabase
        .from('company_profile')
        .select('id')
        .eq('user_id', user.id as any) // Casting as any to avoid type mismatch if needed
        .single();

      if (profileError || !companyProfile) {
        // If no company profile, maybe try to create one or error out? 
        // For now, let's assume they might be a student or just didn't set it up.
        // We can create a dummy company profile or just fail.
        // Let's create one if missing for smoother UX, or just fail.
        // Fail is safer for now.
        toast.error("Please complete your company profile first.");
        return;
      }

      // 3. Insert opportunity
      const { error } = await supabase.from('opportunity').insert({
        title,
        description,
        requirements: selectedSkills.join(", "),
        amount_of_money: parseFloat(budget) || 0,
        deadline: deadline, // Assuming format matches or is just text. DB says date/string.
        company_id: (companyProfile as any).id,
        is_paid: !!budget,
      } as any);

      if (error) throw error;

      toast.success("Project added successfully!");
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onOpenChange(false);
      
      // Reset form
      setTitle("");
      setDescription("");
      setSelectedSkills([]);
      setBudget("");
      setDeadline("");
    } catch (error: any) {
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
          {/* Project Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">Project Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-border"
              placeholder=""
            />
            <p className="text-xs text-muted-foreground italic">
              Include a brief title that accurately describes your project.
            </p>
          </div>

          {/* Project Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Project description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] border-border resize-none"
              placeholder=""
            />
            <p className="text-xs text-muted-foreground italic">
              Enter a detailed description of your project and attach examples of what you want, if possible.
            </p>
          </div>

          {/* Required Skills */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Required skills</Label>
            <Select>
              <SelectTrigger className="border-border">
                <SelectValue placeholder="Select skills..." />
              </SelectTrigger>
              <SelectContent>
                {suggestedSkills.map((skill) => (
                  <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Suggested Skills */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Suggested skills</Label>
            <div className="flex flex-wrap gap-2">
              {suggestedSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant={selectedSkills.includes(skill) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedSkills.includes(skill) 
                      ? "bg-primary text-primary-foreground" 
                      : "border-border hover:bg-muted"
                  }`}
                  onClick={() => handleSkillToggle(skill)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Budget and Deadline */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-sm font-medium">The expected budget</Label>
              <div className="relative">
                <Input
                  id="budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="border-border pr-10"
                  placeholder=""
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-sm font-medium">Expected Deadline</Label>
              <div className="relative">
                <Input
                  id="deadline"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="border-border"
                  placeholder="day"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 px-8"
            >
              Add Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
