import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Calendar } from "lucide-react";

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

  const handleSubmit = () => {
    // Handle form submission
    console.log({ title, description, selectedSkills, budget, deadline });
    onOpenChange(false);
    // Reset form
    setTitle("");
    setDescription("");
    setSelectedSkills([]);
    setBudget("");
    setDeadline("");
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
