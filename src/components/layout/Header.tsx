import { ChevronDown, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { useProfile } from "@/contexts/ProfileContext";
import { GlobalSearch } from "./GlobalSearch";

export function Header() {
  const { profile, signOut } = useProfile();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <GlobalSearch />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationDropdown />
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors ml-2">
          English
          <ChevronDown className="h-4 w-4" />
        </button>
        <Link to="/profile" className="flex items-center gap-3 ml-3 hover:opacity-80 transition-opacity cursor-pointer">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile.avatarUrl} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {profile.firstName[0]}{profile.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm text-foreground">
            {profile.firstName} {profile.lastName}
          </span>
        </Link>
        <button onClick={handleLogout} className="ml-2 p-2 text-muted-foreground hover:text-destructive transition-colors" title="Logout">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
