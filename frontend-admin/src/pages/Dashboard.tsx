import { useState, useEffect } from "react";
import { Users, FolderKanban, Ticket, IndianRupee, Activity, ArrowUpRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "../lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, projects: 0, tickets: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, projectsRes, ticketsRes] = await Promise.all([
          api.get("students/"),
          api.get("projects/"),
          api.get("tickets/")
        ]);
        setStats({
          students: studentsRes.data.length,
          projects: projectsRes.data.length,
          tickets: ticketsRes.data.length
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">Monitor platform activity, revenue, and active projects.</p>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : (
              <>
                <div className="text-3xl font-bold">{stats.students}</div>
                <p className="text-xs text-green-500 mt-1 flex items-center"><ArrowUpRight className="w-3 h-3 mr-1"/>Live</p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
            <FolderKanban className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : (
              <>
                <div className="text-3xl font-bold">{stats.projects}</div>
                <p className="text-xs text-muted-foreground mt-1">Ongoing</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Tickets</CardTitle>
            <Ticket className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : (
              <>
                <div className="text-3xl font-bold text-orange-500">{stats.tickets}</div>
                <p className="text-xs text-muted-foreground mt-1">Require action</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
            <IndianRupee className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹0</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">Awaiting payments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Recent Projects Activity */}
         <Card className="rounded-2xl shadow-sm border-border/50">
            <CardHeader className="border-b bg-secondary/30">
               <CardTitle className="flex items-center gap-2 text-lg">
                 <Activity className="w-5 h-5 text-primary" />
                 Recent Project Activity
               </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-border/40">
                  {[
                    { title: "IoT Smart Home", action: "Milestone updated to Database Integration", time: "2 hours ago" },
                    { title: "AI Medical Bot", action: "Synopsis rejected by Guide", time: "5 hours ago", alert: true },
                    { title: "E-Commerce App", action: "Final Payment Received", time: "1 day ago" }
                  ].map((act, i) => (
                    <div key={i} className="p-4 hover:bg-secondary/20 transition-colors flex justify-between items-center">
                       <div>
                         <p className="font-medium text-sm">{act.title}</p>
                         <p className={`text-xs mt-0.5 ${act.alert ? 'text-red-500' : 'text-muted-foreground'}`}>{act.action}</p>
                       </div>
                       <span className="text-xs text-muted-foreground">{act.time}</span>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         {/* New Registrations */}
         <Card className="rounded-2xl shadow-sm border-border/50">
            <CardHeader className="border-b bg-secondary/30">
               <CardTitle className="flex items-center gap-2 text-lg">
                 <Users className="w-5 h-5 text-primary" />
                 New Registrations
               </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-border/40">
                  {[
                    { name: "Rahul Sharma", group: "Team Alpha", college: "RVCE" },
                    { name: "Sneha Reddy", group: "Code Crafters", college: "BMSCE" },
                    { name: "Vikram Singh", group: "Data Miners", college: "PESU" }
                  ].map((student, i) => (
                    <div key={i} className="p-4 hover:bg-secondary/20 transition-colors flex justify-between items-center">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                           {student.name.charAt(0)}
                         </div>
                         <div>
                           <p className="font-medium text-sm">{student.name}</p>
                           <p className="text-xs text-muted-foreground mt-0.5">{student.group}</p>
                         </div>
                       </div>
                       <Badge variant="secondary" className="font-mono text-[10px]">{student.college}</Badge>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
