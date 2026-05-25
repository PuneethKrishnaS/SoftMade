import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { LayoutDashboard, Download, Ticket, CreditCard, Bell, User, Settings, ChevronsUpDown, Check, Loader2, Menu, LogOut, Moon, Sun } from "lucide-react";
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
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();
  const [activeProject, setActiveProject] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative selection:bg-primary selection:text-primary-foreground font-sans">
      
      {/* Universal Ambient Background for Dashboard */}
      <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500 blur-[150px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-500 blur-[150px] rounded-full mix-blend-screen" />
      </div>
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
            />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-border/40 bg-background/60 backdrop-blur-2xl flex flex-col transition-transform duration-500 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        
        {/* Project Switcher */}
        <div className="h-20 px-4 flex items-center border-b border-border/40 relative shrink-0" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-secondary/60 transition-all text-left border border-transparent hover:border-border/50 group"
          >
            {isLoading ? (
               <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
            ) : activeProject ? (
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0 shadow-md group-hover:shadow-primary/20 transition-all">
                  {activeProject.title.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-sm font-bold truncate text-foreground/90">{activeProject.title}</span>
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Active Workspace</span>
                </div>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground font-medium">No Project Assigned</span>
            )}
            <ChevronsUpDown className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-[85px] left-4 right-4 mt-1 bg-card/90 backdrop-blur-xl text-card-foreground border border-border/50 shadow-2xl rounded-2xl overflow-hidden z-50"
              >
                <div className="p-1.5 max-h-64 overflow-y-auto custom-scrollbar">
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          setActiveProject(project);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-xl hover:bg-secondary/80 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors flex items-center justify-center font-bold text-xs shrink-0">
                             {project.title.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="truncate font-medium">{project.title}</span>
                        </div>
                        {activeProject?.id === project.id && (
                          <Check className="w-4 h-4 text-primary shrink-0" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-2 py-4 text-sm text-muted-foreground text-center font-medium">
                      No projects found.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Links scoped to project */}
        <div className="flex-1 py-6 px-4 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
          <div className="px-3 pb-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">
             {activeProject ? activeProject.title : "Workspace"}
          </div>
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`relative flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`w-4.5 h-4.5 transition-transform ${isActive ? '' : 'group-hover:scale-110'}`} />
                {item.name}
              </Link>
            )
          })}
        </div>

        {/* Bottom Profile/Settings */}
        <div className="p-4 border-t border-border/40 bg-background/20">
          <div className="space-y-1">
            {BOTTOM_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
                    isActive ? "bg-secondary text-primary border border-border/50" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  }`}
                >
                  <item.icon className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        
        {/* Top Navbar */}
        <header className="h-20 border-b border-border/40 bg-background/40 backdrop-blur-2xl flex items-center justify-between px-6 md:px-10 z-10 shrink-0">
           <div className="flex items-center gap-4">
              <button 
                 className="md:hidden p-2 rounded-xl hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border/50"
                 onClick={() => setIsMobileMenuOpen(true)}
              >
                 <Menu className="w-5 h-5" />
              </button>
              <h1 className="font-bold text-xl tracking-tight capitalize text-foreground/90">
                 {location.pathname.split('/').pop() || 'Overview'}
              </h1>
           </div>
           <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className="relative p-2.5 rounded-xl bg-secondary/30 hover:bg-secondary/80 border border-border/30 hover:border-border/60 text-muted-foreground hover:text-foreground transition-all group">
                 {isDarkMode ? <Sun className="w-4.5 h-4.5 group-hover:rotate-45 transition-transform" /> : <Moon className="w-4.5 h-4.5 group-hover:-rotate-12 transition-transform" />}
              </button>
              <button className="relative p-2.5 rounded-xl bg-secondary/30 hover:bg-secondary/80 border border-border/30 hover:border-border/60 text-muted-foreground hover:text-foreground transition-all group">
                 <Bell className="w-4.5 h-4.5 group-hover:animate-bounce" />
                 <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary ring-2 ring-background" />
              </button>
              
              <div className="relative" ref={profileDropdownRef}>
                 <div 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-sm cursor-pointer shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all border border-primary/20"
                 >
                    {user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
                 </div>

                 <AnimatePresence>
                    {isProfileDropdownOpen && (
                       <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute right-0 mt-3 w-56 bg-card/90 backdrop-blur-xl text-card-foreground border border-border/50 shadow-2xl rounded-2xl overflow-hidden z-50"
                       >
                          <div className="px-5 py-4 border-b border-border/40 bg-muted/20">
                             <p className="text-sm font-bold truncate">{user?.first_name || 'User'}</p>
                             <p className="text-[11px] font-medium text-muted-foreground truncate mt-0.5">{user?.email}</p>
                          </div>
                          <div className="p-1.5">
                             <Link 
                                to="/dashboard/profile"
                                onClick={() => setIsProfileDropdownOpen(false)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl hover:bg-secondary/80 transition-colors text-left"
                             >
                                <User className="w-4 h-4 text-muted-foreground" /> Profile
                             </Link>
                             <Link 
                                to="/dashboard/settings"
                                onClick={() => setIsProfileDropdownOpen(false)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl hover:bg-secondary/80 transition-colors text-left"
                             >
                                <Settings className="w-4 h-4 text-muted-foreground" /> Settings
                             </Link>
                             <div className="h-px bg-border/40 my-1 mx-2" />
                             <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-destructive rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors text-left"
                             >
                                <LogOut className="w-4 h-4" /> Sign Out
                             </button>
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           </div>
        </header>
        
        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 scroll-smooth">
           <Outlet context={{ activeProject }} />
        </main>
      </div>
    </div>
  );
}
