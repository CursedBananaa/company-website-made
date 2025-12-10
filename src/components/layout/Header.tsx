import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

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
        <Link to="/profile" className="flex items-center gap-3 ml-3 hover:opacity-80 transition-opacity cursor-pointer">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">JD</AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm text-foreground">John Doe</span>
        </Link>
      </div>
    </header>
  );
}
