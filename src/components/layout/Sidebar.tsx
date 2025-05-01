
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  MessageSquare,
  MessagesSquare,
  User,
  Settings,
  Send,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    {
      name: "Dashboard",
      icon: Home,
      path: "/dashboard",
    },
    {
      name: "Discussion",
      icon: MessagesSquare,
      path: "/discussion",
    },
    {
      name: "Messages",
      icon: MessageSquare,
      path: "/messages",
    },
    {
      name: "Profile",
      icon: User,
      path: "/profile",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
    {
      name: "Feedback",
      icon: Send,
      path: "/feedback",
    },
  ];

  return (
    <div className="hidden border-r bg-card lg:block lg:w-64">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <span className="text-xs font-bold text-primary-foreground">CFC</span>
            </div>
            <span className="text-lg">COMMUNITY FEEDBACK COLLECTOR</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <div className="px-3">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? "secondary" : "ghost"}
                  className={cn(
                    "justify-start",
                    location.pathname === item.path && "bg-secondary"
                  )}
                  asChild
                >
                  <Link to={item.path}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
