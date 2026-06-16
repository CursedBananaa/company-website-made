import { useState, useEffect, useRef, useCallback } from "react";
import { Search, User, Briefcase, Building2, X, MessageSquare, Eye, Users, Megaphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { StudentDetailsDialog } from "@/components/StudentDetailsDialog";
import { useProfile } from "@/contexts/ProfileContext";

interface SearchResult {
  id: string;
  rawId: string;       // student_profile.id or opportunity.id
  userId?: string;     // user.id for messaging
  type: "student" | "opportunity" | "company" | "announcement";
  title: string;
  subtitle: string;
  raw?: any;           // full data for dialogs
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [viewStudent, setViewStudent] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { profile } = useProfile();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const term = `%${q}%`;

    try {
      const [studentsRes, opportunitiesRes, companiesRes, announcementsRes] = await Promise.all([
        supabase
          .from("student_profile")
          .select("id, major, user(id, full_name, email)")
          .ilike("major", term)
          .limit(4),

        supabase
          .from("opportunity")
          .select("id, title, description, company_profile(user(full_name))")
          .or(`title.ilike.${term},description.ilike.${term}`)
          .limit(4),

        supabase
          .from("company_profile")
          .select("id, industry, user(id, full_name, email)")
          .limit(4),

        supabase
          .from("announcement")
          .select("id, title, description, image_url, link")
          .or(`title.ilike.${term},description.ilike.${term}`)
          .limit(4),
      ]);

      const studentsByName = await supabase
        .from("student_profile")
        .select("id, major, user(id, full_name, email)")
        .limit(4);

      const allResults: SearchResult[] = [];

      // Students — fetch full profile for dialog
      const studentData = [
        ...(studentsRes.data || []),
        ...(studentsByName.data || []),
      ];
      const seenStudents = new Set<string>();
      studentData.forEach((s: any) => {
        const name = s.user?.full_name || "";
        if (
          !seenStudents.has(s.id) &&
          (name.toLowerCase().includes(q.toLowerCase()) ||
            (s.major || "").toLowerCase().includes(q.toLowerCase()))
        ) {
          seenStudents.add(s.id);
          allResults.push({
            id: `student-${s.id}`,
            rawId: s.id,
            userId: s.user?.id?.toString(),
            type: "student",
            title: name || "Unknown Student",
            subtitle: s.major || "No major",
            raw: s,
          });
        }
      });

      // Opportunities
      (opportunitiesRes.data || []).forEach((o: any) => {
        allResults.push({
          id: `opp-${o.id}`,
          rawId: o.id,
          type: "opportunity",
          title: o.title || "Untitled",
          subtitle: (o.company_profile as any)?.user?.full_name || "No company",
          raw: o,
        });
      });

      // Companies
      (companiesRes.data || []).forEach((c: any) => {
        const name = c.user?.full_name || "";
        if (name.toLowerCase().includes(q.toLowerCase())) {
          allResults.push({
            id: `company-${c.id}`,
            rawId: c.id,
            userId: c.user?.id?.toString(),
            type: "company",
            title: name,
            subtitle: c.industry || "No industry",
            raw: c,
          });
        }
      });

      // Announcements
      (announcementsRes.data || []).forEach((a: any) => {
        allResults.push({
          id: `announcement-${a.id}`,
          rawId: a.id,
          type: "announcement",
          title: a.title || "Untitled",
          subtitle: a.description || "",
          raw: a,
        });
      });

      setResults(allResults.slice(0, 10));
      setIsOpen(true);
      setActiveIndex(-1);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleDefaultNav(results[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const close = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const handleDefaultNav = (result: SearchResult) => {
    close();
    const isAdmin = profile?.role === 'admin';
    if (result.type === "announcement") {
      if (isAdmin) {
        navigate(`/admin/announcement?highlight=${result.rawId}`);
      } else if (result.raw?.link) {
        window.open(result.raw.link, "_blank");
      }
    } else if (result.type === "student" || result.type === "company") {
      navigate(isAdmin ? `/admin/table?highlight=${result.rawId}` : `/students?highlight=${result.rawId}`);
    } else {
      navigate(isAdmin ? `/admin/opportunities?highlight=${result.rawId}` : `/projects?highlight=${result.rawId}`);
    }
  };

  const handleMessage = (result: SearchResult) => {
    close();
    const uid = result.userId || result.rawId;
    const isAdmin = profile?.role === 'admin';
    navigate(isAdmin ? `/admin/inbox?userId=${uid}` : `/messages?userId=${uid}`);
  };

  const handleViewStudent = (result: SearchResult) => {
    close();
    setViewStudent(result.raw);
  };

  const typeIcon = (type: SearchResult["type"]) => {
    if (type === "student") return <User className="h-4 w-4 text-blue-500" />;
    if (type === "opportunity") return <Briefcase className="h-4 w-4 text-violet-500" />;
    if (type === "announcement") return <Megaphone className="h-4 w-4 text-amber-500" />;
    return <Building2 className="h-4 w-4 text-emerald-500" />;
  };

  const typeLabel = (type: SearchResult["type"]) => {
    if (type === "student") return "Student";
    if (type === "opportunity") return "Opportunity";
    if (type === "announcement") return "Announcement";
    return "Company";
  };

  const groupedResults = {
    student: results.filter((r) => r.type === "student"),
    opportunity: results.filter((r) => r.type === "opportunity"),
    company: results.filter((r) => r.type === "company"),
    announcement: results.filter((r) => r.type === "announcement"),
  };

  // Action button component
  const ActionBtn = ({
    icon: Icon,
    label,
    onClick,
    color,
  }: {
    icon: any;
    label: string;
    onClick: (e: React.MouseEvent) => void;
    color: string;
  }) => (
    <button
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        close();
        onClick(e);
      }}
      className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border transition-all opacity-0 group-hover:opacity-100 ${color}`}
    >
      <Icon className="h-3 w-3" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="relative w-80" ref={containerRef}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
      <Input
        ref={inputRef}
        placeholder="Search students, opportunities..."
        className="pl-10 pr-8 bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => query && setIsOpen(true)}
      />
      {query && (
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={() => { setQuery(""); setResults([]); setIsOpen(false); inputRef.current?.focus(); }}
        >
          <X className="h-3 w-3" />
        </button>
      )}

      {/* Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[480px] bg-popover border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
          {isLoading ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Searching...
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No results found for "<span className="font-medium text-foreground">{query}</span>"
            </div>
          ) : (
            <div className="py-2 max-h-[460px] overflow-y-auto">
              {(["student", "opportunity", "company", "announcement"] as const).map((type) => {
                const group = groupedResults[type];
                if (group.length === 0) return null;
                return (
                  <div key={type}>
                    {/* Section header */}
                    <div className="px-3 py-1.5 flex items-center gap-2">
                      {typeIcon(type)}
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {typeLabel(type)}s
                      </span>
                    </div>

                    {group.map((result) => {
                      const globalIndex = results.indexOf(result);
                      const isActive = activeIndex === globalIndex;

                      return (
                        <div
                          key={result.id}
                          className={`group px-4 py-2.5 flex items-center gap-3 hover:bg-muted/70 transition-colors cursor-pointer ${isActive ? "bg-muted" : ""}`}
                          onClick={() => handleDefaultNav(result)}
                          onMouseEnter={() => setActiveIndex(globalIndex)}
                        >
                          {/* Avatar icon */}
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                            type === "student" ? "bg-blue-500/10" :
                            type === "opportunity" ? "bg-violet-500/10" :
                            type === "announcement" ? "bg-amber-500/10" : "bg-emerald-500/10"
                          }`}>
                            {typeIcon(type)}
                          </div>

                          {/* Title + subtitle */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{result.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                          </div>

                          {/* Action buttons — shown on hover */}
                          <div className="flex items-center gap-1 shrink-0">
                            {(type === "student" || type === "company") && (
                              <>
                                <ActionBtn
                                  icon={MessageSquare}
                                  label="Message"
                                  color="border-blue-200 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                  onClick={() => handleMessage(result)}
                                />
                                <ActionBtn
                                  icon={Eye}
                                  label="Profile"
                                  color="border-muted text-muted-foreground hover:bg-muted hover:text-foreground"
                                  onClick={() => handleViewStudent(result)}
                                />
                              </>
                            )}

                            {type === "opportunity" && (
                              <>
                                <ActionBtn
                                  icon={Eye}
                                  label="View"
                                  color="border-violet-200 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                                  onClick={() => { 
                                    close(); 
                                    navigate(profile?.role === 'admin' ? `/admin/opportunities?highlight=${result.rawId}` : `/projects?highlight=${result.rawId}`); 
                                  }}
                                />
                                <ActionBtn
                                  icon={Users}
                                  label="Applicants"
                                  color="border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                  onClick={() => { close(); navigate(`/admin/opportunities/${result.rawId}/applicants`); }}
                                />
                              </>
                            )}

                            {type === "announcement" && (
                              <>
                                <ActionBtn
                                  icon={Eye}
                                  label="View"
                                  color="border-amber-200 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                                  onClick={() => {
                                    close();
                                    const isAdmin = profile?.role === 'admin';
                                    if (isAdmin) {
                                      navigate(`/admin/announcement?highlight=${result.rawId}`);
                                    } else if (result.raw?.link) {
                                      window.open(result.raw.link, "_blank");
                                    }
                                  }}
                                />
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    <div className="border-b border-border/50 mx-3 my-1" />
                  </div>
                );
              })}

              <div className="px-4 py-2 bg-muted/30">
                <p className="text-xs text-muted-foreground text-center">
                  {results.length} result{results.length !== 1 ? "s" : ""} · <kbd className="bg-muted border border-border rounded px-1">↑↓</kbd> navigate · <kbd className="bg-muted border border-border rounded px-1">Enter</kbd> select · <kbd className="bg-muted border border-border rounded px-1">Esc</kbd> close
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Student profile dialog opened from search */}
      {viewStudent && (
        <StudentDetailsDialog
          open={!!viewStudent}
          onOpenChange={(open) => !open && setViewStudent(null)}
          student={viewStudent}
        />
      )}
    </div>
  );
}
