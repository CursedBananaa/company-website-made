import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationDropdown } from "@/components/NotificationDropdown";

export function Header() {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search"
          className="pl-10 bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationDropdown />
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors ml-2">
          English
          <ChevronDown className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 ml-2">
          <div className="grid grid-cols-2 gap-0.5">
            <div className="w-2 h-2 bg-destructive rounded-sm" />
            <div className="w-2 h-2 bg-success rounded-sm" />
            <div className="w-2 h-2 bg-chart-blue rounded-sm" />
            <div className="w-2 h-2 bg-pending rounded-sm" />
          </div>
          <span className="font-medium text-sm text-foreground">MicroSoft</span>
        </div>
      </div>
    </header>
  );
}
