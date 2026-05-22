import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, FolderKanban, Ticket, UploadCloud, CreditCard, BarChart3, Bell, Settings, Search } from "lucide-react";
import { motion } from "framer-motion";

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
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm cursor-pointer shadow-sm">
                 SA
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
