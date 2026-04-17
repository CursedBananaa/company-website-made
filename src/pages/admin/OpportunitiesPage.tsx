import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/admin/DashboardLayout";
import { FileText, Clock, Edit, Plus } from "lucide-react";

interface Opportunity {
  id: string;
  title: string;
  company: string;
  tags: string[];
  duration: string;
  postedDays: number;
}

const opportunities: Opportunity[] = [
  { id: "1", title: "Big Data Analyst at WE", company: "WE", tags: ["Computer Engineer", "Communication"], duration: "1-4 weeks", postedDays: 3 },
  { id: "2", title: "Big Data Analyst at WE", company: "WE", tags: ["Mobile Design", "3D Design"], duration: "1-4 weeks", postedDays: 3 },
  { id: "3", title: "Big Data Analyst at WE", company: "WE", tags: ["Mobile Design", "3D Design"], duration: "1-4 weeks", postedDays: 3 },
  { id: "4", title: "Big Data Analyst at WE", company: "WE", tags: ["Mobile Design", "3D Design"], duration: "1-4 weeks", postedDays: 3 },
  { id: "5", title: "Big Data Analyst at WE", company: "WE", tags: ["Mobile Design", "3D Design"], duration: "1-4 weeks", postedDays: 3 },
  { id: "6", title: "Big Data Analyst at WE", company: "WE", tags: ["Mobile Design", "3D Design"], duration: "1-4 weeks", postedDays: 3 },
  { id: "7", title: "Big Data Analyst at WE", company: "WE", tags: ["Mobile Design", "3D Design"], duration: "1-4 weeks", postedDays: 3 },
  { id: "8", title: "Big Data Analyst at WE", company: "WE", tags: ["Mobile Design", "3D Design"], duration: "1-4 weeks", postedDays: 3 },
  { id: "9", title: "Big Data Analyst at WE", company: "WE", tags: ["Mobile Design", "3D Design"], duration: "1-4 weeks", postedDays: 3 },
];

const OpportunitiesPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Opportunities</h1>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {opportunities.map((opp) => (
            <div key={opp.id} className="opportunity-card animate-fade-in">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  Posted {opp.postedDays} days ago
                </span>
                <Link
                  to={`/opportunities/edit/${opp.id}`}
                  className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Link>
              </div>

              {/* Title */}
              <div className="flex items-start gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground leading-tight">{opp.title}</h3>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {opp.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Duration */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Clock className="h-4 w-4" />
                <span>{opp.duration}</span>
              </div>

              {/* Action */}
              <Link
                to={`/opportunities/${opp.id}/applicants`}
                className="block w-full text-center py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                View Applicant
              </Link>
            </div>
          ))}
        </div>

        {/* Floating Add Button */}
        <Link
          to="/admin/opportunities/add"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
        >
          <Plus className="h-6 w-6 text-foreground" />
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default OpportunitiesPage;
