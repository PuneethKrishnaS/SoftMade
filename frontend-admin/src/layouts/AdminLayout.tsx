import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { LayoutDashboard, Users, FolderKanban, Ticket, CreditCard, BarChart3, Bell, Settings, Search, LogOut, Moon, Sun, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/auth";

const SIDEBAR_ITEMS = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Students", path: "/admin/students", icon: Users },
  { name: "Projects", path: "/admin/projects", icon: FolderKanban },
  { name: "Tickets", path: "/admin/tickets", icon: Ticket },
  { name: "Payments", path: "/admin/payments", icon: CreditCard },
  { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
];

const BOTTOM_ITEMS = [
  { name: "Notifications", path: "/admin/notifications", icon: Bell },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-secondary/10 text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background flex flex-col transition-all">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="font-bold text-lg tracking-tight">Softmade<span className="text-primary"> Admin</span></span>
        </div>
        <div className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
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
                    layoutId="admin-sidebar-active"
                    className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            )
          })}
        </div>
        <div className="p-3 border-t">
          {BOTTOM_ITEMS.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b bg-background/50 backdrop-blur-sm flex items-center justify-between px-8 z-10">
           <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input 
                 type="text" 
                 placeholder="Search students, projects..." 
                 className="w-full h-9 pl-9 pr-4 rounded-full bg-secondary/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
           </div>
           <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className="relative p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors">
                 {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className="relative" ref={profileDropdownRef}>
                 <div 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm cursor-pointer shadow-sm"
                 >
                    {user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'A'}
                 </div>

                 <AnimatePresence>
                    {isProfileDropdownOpen && (
                       <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-48 bg-popover text-popover-foreground border shadow-lg rounded-xl overflow-hidden z-50"
                       >
                          <div className="px-4 py-3 border-b border-border/50">
                             <p className="text-sm font-medium">{user?.first_name || 'Admin User'}</p>
                             <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                          </div>
                          <div className="p-1">
                             <Link 
                                to="/admin/settings"
                                onClick={() => setIsProfileDropdownOpen(false)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors text-left"
                             >
                                <Settings className="w-4 h-4" /> Settings
                             </Link>
                             <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive rounded-md hover:bg-destructive/10 transition-colors text-left"
                             >
                                <LogOut className="w-4 h-4" /> Logout
                             </button>
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8">
           <Outlet />
        </main>
      </div>
    </div>
  );
}
