import { useState, useEffect } from "react";
import { Users, FolderKanban, Ticket, IndianRupee, Activity, ArrowUpRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "../lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, projects: 0, tickets: 0, revenue: 0 });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [newStudents, setNewStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, projectsRes, ticketsRes, paymentsRes] = await Promise.all([
          api.get("students/"),
          api.get("projects/"),
          api.get("tickets/"),
          api.get("payments/")
        ]);
        
        const projects = projectsRes.data;
        const payments = paymentsRes.data;
        const students = studentsRes.data;

        // Calculate Revenue
        const totalPayments = payments.filter((p:any) => p.status === 'PAID').reduce((sum:number, p:any) => sum + parseFloat(p.amount), 0);
        const totalAdvance = projects.reduce((sum:number, p:any) => sum + parseFloat(p.advance_payment || 0), 0);
        const totalRevenue = totalPayments + totalAdvance;

        setStats({
          students: students.length,
          projects: projects.length,
          tickets: ticketsRes.data.length,
          revenue: totalRevenue
        });

        // Set Recent Projects (last 5)
        setRecentProjects(projects.slice(-5).reverse().map((p:any) => ({
          title: p.title,
          action: `Currently in ${p.status.replace('_', ' ')} phase`,
          time: "Recently active",
          alert: p.status === 'DELAYED'
        })));

        // Set New Students (last 5)
        setNewStudents(students.slice(-5).reverse().map((s:any) => ({
          name: s.user?.first_name || s.user?.username || 'Unknown',
          group: s.department || 'General',
          college: s.college_name || 'N/A'
        })));

      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-8xl mx-auto">
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
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : (
              <>
                <div className="text-3xl font-bold">₹{stats.revenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">Total collected</p>
              </>
            )}
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
                  {isLoading ? (
                    <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                  ) : recentProjects.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">No active projects found.</div>
                  ) : recentProjects.map((act, i) => (
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
                  {isLoading ? (
                    <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                  ) : newStudents.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">No students registered yet.</div>
                  ) : newStudents.map((student, i) => (
                    <div key={i} className="p-4 hover:bg-secondary/20 transition-colors flex justify-between items-center">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold uppercase">
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
