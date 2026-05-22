import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { LayoutDashboard, Activity, Download, Ticket, CreditCard, Bell, User, Settings, ChevronsUpDown, Check, PlusCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/api";
import { useAuthStore } from "../store/auth";

const SIDEBAR_ITEMS = [
  { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { name: "Downloads", path: "/dashboard/downloads", icon: Download },
  { name: "Tickets", path: "/dashboard/tickets", icon: Ticket },
  { name: "Payments", path: "/dashboard/payments", icon: CreditCard },
  { name: "Notifications", path: "/dashboard/notifications", icon: Bell },
];

const BOTTOM_ITEMS = [
  { name: "Profile", path: "/dashboard/profile", icon: User },
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout() {
  const location = useLocation();
  const user = useAuthStore(state => state.user);
  const [activeProject, setActiveProject] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get("projects/");
        if (res.data && res.data.length > 0) {
          setProjects(res.data);
          setActiveProject(res.data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch project", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-secondary/20 text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background flex flex-col transition-all">
        {/* Project Switcher */}
        <div className="h-16 px-4 flex items-center border-b relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-secondary transition-colors text-left"
          >
            {isLoading ? (
               <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
            ) : activeProject ? (
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                  {activeProject.title.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-sm font-semibold truncate">{activeProject.title}</span>
                  <span className="text-xs text-muted-foreground">Team Member</span>
                </div>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">No Project Assigned</span>
            )}
            <ChevronsUpDown className="w-4 h-4 text-muted-foreground shrink-0" />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-16 left-4 right-4 mt-1 bg-popover text-popover-foreground border shadow-lg rounded-xl overflow-hidden z-50"
              >
                <div className="p-1 max-h-64 overflow-y-auto">
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          setActiveProject(project);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-2 py-2 text-sm rounded-lg hover:bg-secondary transition-colors text-left"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center font-medium text-xs shrink-0">
                             {project.title.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="truncate">{project.title}</span>
                        </div>
                        {activeProject?.id === project.id && (
                          <Check className="w-4 h-4 text-primary shrink-0" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-2 py-2 text-sm text-muted-foreground text-center">
                      No projects found.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Links scoped to project */}
        <div className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
          <div className="px-3 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
             {activeProject ? activeProject.title : "Workspace"}
          </div>
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-secondary rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            )
          })}
        </div>

        {/* Bottom Profile/Settings */}
        <div className="p-3 border-t">
          {BOTTOM_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-secondary text-primary" : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b bg-background/50 backdrop-blur-sm flex items-center justify-between px-8 z-10">
           <h1 className="font-semibold text-lg capitalize">
              {location.pathname.split('/').pop() || 'Overview'}
           </h1>
           <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background" />
              </button>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm cursor-pointer shadow-sm">
                 {user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
              </div>
           </div>
        </header>
        
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8">
           <Outlet context={{ activeProject }} />
        </main>
      </div>
    </div>
  );
}
