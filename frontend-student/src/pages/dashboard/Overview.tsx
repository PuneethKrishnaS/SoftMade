import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Ticket as TicketIcon, IndianRupee, Users, ShieldCheck, Code, Calendar, Clock, Activity, ArrowRight } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";

const PIPELINE_PHASES = [
   { id: 'REQUIREMENT', label: 'Requirement' },
   { id: 'TOPIC', label: 'Topic' },
   { id: 'SYNOPSIS', label: 'Synopsis' },
   { id: 'DESIGN', label: 'Design' },
   { id: 'FRONTEND', label: 'Frontend' },
   { id: 'BACKEND', label: 'Backend' },
   { id: 'DATABASE', label: 'Database' },
   { id: 'TESTING', label: 'Testing' },
   { id: 'REPORT', label: 'Report' },
   { id: 'DEPLOYMENT', label: 'Deployment' },
   { id: 'DELIVERED', label: 'Delivered' }
];

export default function Overview() {
   const { activeProject } = useOutletContext<{ activeProject: any }>();

   if (!activeProject) {
      return (
         <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-2xl bg-card/50">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
               <Activity className="w-6 h-6 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-base font-medium text-foreground">No Active Project</h3>
            <p className="text-muted-foreground text-sm mt-1 max-w-sm">You haven't been assigned to a project yet. Please contact your administrator.</p>
         </div>
      );
   }

   // 1. Calculations
   const currentPhaseIndex = Math.max(0, PIPELINE_PHASES.findIndex(p => p.id === activeProject.status));
   const currentPhaseLabel = PIPELINE_PHASES[currentPhaseIndex]?.label || activeProject.status;

   const daysUntilDeadline = activeProject.deadline
      ? Math.ceil((new Date(activeProject.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
      : null;

   // Financial Calculations
   const totalCost = parseFloat(activeProject.total_price) || 0;
   const advancePaid = parseFloat(activeProject.advance_payment) || 0;
   const otherPayments = activeProject.payments?.filter((p: any) => p.status === 'PAID').reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0) || 0;
   const totalPaid = advancePaid + otherPayments;
   const pendingBalance = totalCost - totalPaid;
   const paymentPercentage = totalCost > 0 ? (totalPaid / totalCost) * 100 : 0;

   // 2. Synthesize Activity Feed
   let activities: any[] = [];
   if (activeProject.start_date) {
      activities.push({ title: 'Project Initiated', time: new Date(activeProject.start_date), type: 'status', icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10' });
   }
   activeProject.tickets?.forEach((t: any) => {
      activities.push({ title: `Ticket: ${t.title}`, time: new Date(t.created_at), type: 'ticket', icon: TicketIcon, color: 'text-orange-500', bg: 'bg-orange-500/10' });
   });
   activeProject.payments?.forEach((p: any) => {
      activities.push({ title: `Payment ${p.status.toLowerCase()}: ₹${p.amount}`, time: new Date(p.created_at || p.due_date || activeProject.start_date || new Date()), type: 'payment', icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-500/10' });
   });

   activities.sort((a, b) => b.time.getTime() - a.time.getTime());
   const recentActivities = activities.slice(0, 5);

   const formatTimeAgo = (date: Date) => {
      const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
      if (seconds < 60) return "Just now";
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
      return `${Math.floor(seconds / 86400)}d ago`;
   };

   const formatDate = (dateString: string) => {
      if (!dateString) return "Not set";
      return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
   };

   return (
      <div className="space-y-5 max-w-[1600px] mx-auto pb-10">

         {/* 1. HERO SECTION */}
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <Card className="xl:col-span-2 rounded-md border-border/40 shadow-xl bg-card/40 backdrop-blur-sm overflow-hidden relative group hover:border-foreground/20 transition-colors duration-200">
               <div className="absolute top-0 right-0 p-32 bg-primary/10 blur-[120px] rounded-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-60" />
               <CardContent className="p-6 sm:p-8 relative z-10 flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-4">
                     <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                           <Badge variant="outline" className="mb-3 bg-background/50 backdrop-blur-md border-border/50 text-xs font-bold uppercase tracking-widest px-3 py-1 shadow-sm">
                              {activeProject.category || "General"}
                           </Badge>
                           <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-[1.1]">{activeProject.title}</h1>
                        </div>
                        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 border px-4 py-1.5 shadow-none text-sm font-bold whitespace-nowrap rounded-xl">
                           {activeProject.progress_percentage || 0}% Completed
                        </Badge>
                     </div>
                     <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-3xl line-clamp-3">
                        {activeProject.description || "No detailed description provided for this project."}
                     </p>
                  </div>

                  <div className="pt-6 border-t border-border/40 flex flex-wrap items-center justify-between gap-6">
                     <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><Code className="w-3.5 h-3.5" /> Tech Stack</span>
                        <div className="flex flex-wrap gap-2 pt-1">
                           {activeProject.technology ? activeProject.technology.split(',').map((tech: string, i: number) => (
                              <Badge key={i} variant="secondary" className="px-3 py-1 text-xs font-semibold bg-secondary/50 text-foreground/90 hover:bg-secondary/80 transition-colors border border-border/50">{tech.trim()}</Badge>
                           )) : <span className="text-sm text-muted-foreground font-medium">Not specified</span>}
                        </div>
                     </div>
                     <div className="flex gap-8">
                        <div className="space-y-1.5">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Start</span>
                           <p className="text-sm font-bold">{formatDate(activeProject.start_date)}</p>
                        </div>
                        <div className="space-y-1.5">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Deadline</span>
                           <p className="text-sm font-bold">{formatDate(activeProject.deadline)}</p>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Hero Sidebar: Milestone & Action */}
            <Card className="rounded-md border-border/40 shadow-xl bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-colors duration-200 hover:-translate-y-1">
               <CardContent className="p-6 sm:p-8 flex flex-col justify-center h-full space-y-8">
                  <div>
                     <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary/80 mb-2">Current Phase</h3>
                     <div className="text-2xl font-extrabold text-foreground mb-1 tracking-tight">{currentPhaseLabel}</div>
                     <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                        Stage {currentPhaseIndex + 1} of {PIPELINE_PHASES.length}
                        <ArrowRight className="w-3.5 h-3.5 text-primary" />
                     </p>
                  </div>

                  <div className="space-y-2.5 bg-background/50 p-5 rounded-2xl border border-border/50">
                     <div className="flex justify-between text-sm font-bold">
                        <span className="text-muted-foreground">Overall Progress</span>
                        <span className="text-foreground">{activeProject.progress_percentage || 0}%</span>
                     </div>
                     <Progress value={activeProject.progress_percentage || 0} className="h-2.5 bg-primary/20" />
                  </div>

                  {daysUntilDeadline !== null && (
                     <div className={cn("p-4 rounded-2xl border flex items-start gap-3 transition-colors", daysUntilDeadline > 7 ? "bg-background/60 border-border/50 text-muted-foreground" : daysUntilDeadline >= 0 ? "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400" : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400")}>
                        <Clock className="w-5 h-5 mt-0.5 shrink-0" />
                        <div>
                           <p className="font-bold text-sm">
                              {daysUntilDeadline > 0 ? `${daysUntilDeadline} Days Remaining` : daysUntilDeadline === 0 ? "Deadline is Today!" : `${Math.abs(daysUntilDeadline)} Days Overdue`}
                           </p>
                        </div>
                     </div>
                  )}
               </CardContent>
            </Card>
         </div>

         {/* 2. PIPELINE STEPPER (Clean, readable horizontal timeline) */}
         <Card className="rounded-md border-border/40 shadow-xl bg-card/40 backdrop-blur-sm overflow-hidden hover:border-foreground/20 transition-colors duration-200">
            <CardContent className="p-6 overflow-x-auto custom-scrollbar">
               <div className="flex items-start justify-between min-w-[900px] max-w-full">
                  {PIPELINE_PHASES.map((phase, idx) => {
                     const isCompleted = idx < currentPhaseIndex;
                     const isCurrent = idx === currentPhaseIndex;
                     return (
                        <div key={phase.id} className="flex flex-col items-center relative flex-1 group">
                           {/* Connecting Line */}
                           {idx !== 0 && (
                              <div className={cn("absolute top-3 left-[-50%] right-[50%] h-[3px] -z-10 rounded-full transition-colors duration-700", isCompleted || isCurrent ? "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" : "bg-secondary/50")} />
                           )}
                           {/* Node */}
                           <div className={cn("w-6 h-6 rounded-full flex items-center justify-center z-10 transition-colors duration-200 shadow-lg mb-3",
                              isCompleted ? "bg-primary text-primary-foreground border-none ring-4 ring-primary/20 shadow-primary/40" :
                                 isCurrent ? "bg-background border-2 border-primary ring-4 ring-primary/30 scale-125 shadow-primary/20" : "bg-background border-2 border-secondary text-muted-foreground group-hover:border-primary/50")}>
                              {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="text-[10px] font-bold opacity-50">{idx + 1}</span>}
                           </div>
                           {/* Label */}
                           <span className={cn("text-xs font-bold text-center px-2 transition-colors tracking-wide", isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/70")}>
                              {phase.label}
                           </span>
                        </div>
                     )
                  })}
               </div>
            </CardContent>
         </Card>

         {/* 3. BENTO GRID (Activity, Team, Finances) */}
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

            {/* Left Col: Recent Activity */}
            <Card className="xl:col-span-2 rounded-md border-border/40 shadow-xl bg-card/40 backdrop-blur-sm hover:border-foreground/20 transition-colors duration-200">
               <CardHeader className="px-6 py-4 border-b border-border/30 flex flex-row items-center justify-between bg-background/20 rounded-t-[32px]">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Activity Log</CardTitle>
                  <Badge variant="secondary" className="font-bold text-[10px] uppercase tracking-widest bg-secondary/80 border border-border/50 px-3 py-1">{recentActivities.length} Recent Events</Badge>
               </CardHeader>
               <CardContent className="p-6">
                  <div className="space-y-5 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-border/50 before:via-border/20 before:to-transparent">
                     {recentActivities.length > 0 ? (
                        recentActivities.map((activity, i) => {
                           const Icon = activity.icon;
                           return (
                              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                 <div className={`flex items-center justify-center w-10 h-10 rounded-2xl border-2 border-background ${activity.bg} ${activity.color} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10 transition-transform duration-300 group-hover:scale-125`}>
                                    <Icon className="w-4 h-4" />
                                 </div>
                                 <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-5 rounded-2xl border border-border/40 bg-background/60 backdrop-blur-md shadow-sm group-hover:bg-card/80 group-hover:shadow-xl group-hover:border-foreground/20 transition-colors duration-300 group-hover:-translate-y-1">
                                    <div className="font-bold text-sm text-foreground mb-1.5">{activity.title}</div>
                                    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{formatTimeAgo(activity.time)}</div>
                                 </div>
                              </div>
                           );
                        })
                     ) : (
                        <div className="text-sm font-medium text-center py-12 text-muted-foreground relative z-10 bg-background/50 rounded-2xl border border-dashed border-border/60">No recent activity found.</div>
                     )}
                  </div>
               </CardContent>
            </Card>

            {/* Right Col: Stacked Cards (Finances & Team) */}
            <div className="space-y-5">

               {/* Finances */}
               <Card className="rounded-md border-border/40 shadow-sm bg-card/40">
                  <CardHeader className="px-6 py-4 border-b border-border/30 bg-background/20">
                     <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2.5 text-muted-foreground">
                        <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-500"><IndianRupee className="w-4 h-4" /></div> Financial Overview
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-5">
                     <div className="bg-background/50 p-4 rounded-2xl border border-border/50">
                        <div className="flex justify-between items-end mb-3">
                           <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Amount Paid</span>
                           <div className="text-right">
                              <span className="text-xl font-extrabold text-foreground tracking-tight">₹{totalPaid.toLocaleString()}</span>
                              <span className="text-[11px] font-bold text-muted-foreground ml-1.5">/ ₹{totalCost.toLocaleString()}</span>
                           </div>
                        </div>
                        <Progress value={paymentPercentage} className="h-2 bg-secondary" />
                     </div>

                     <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/30">
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Cost</p>
                           <p className="text-base font-bold text-foreground">₹{totalCost.toLocaleString()}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Pending</p>
                           <p className="text-base font-bold text-destructive">₹{pendingBalance.toLocaleString()}</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Team */}
               <Card className="rounded-md border-border/40 shadow-sm bg-card/40">
                  <CardHeader className="px-6 py-4 border-b border-border/30 bg-background/20">
                     <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2.5 text-muted-foreground">
                        <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-500"><Users className="w-4 h-4" /></div> Team Workspace
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                     {/* Guide */}
                     <div className="px-6 py-5 bg-blue-500/5 border-b border-border/30 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-inner">
                           <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-0.5">Project Guide</p>
                           <p className="text-sm font-bold text-foreground">
                              {activeProject.assigned_developer ? (activeProject.assigned_developer.first_name || activeProject.assigned_developer.username) : "Not Assigned"}
                           </p>
                        </div>
                     </div>

                     {/* Students */}
                     <div className="p-6">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Group Members</p>
                        <div className="space-y-4">
                           {activeProject.students && activeProject.students.length > 0 ? (
                              activeProject.students.map((student: any) => (
                                 <div key={student.id} className="flex items-center gap-3.5 group">
                                    <div className="w-9 h-9 rounded-xl bg-secondary/80 text-secondary-foreground flex items-center justify-center font-bold text-xs shrink-0 border border-border/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                       {student.user?.first_name ? student.user.first_name.charAt(0).toUpperCase() : 'S'}
                                    </div>
                                    <div className="flex flex-col">
                                       <span className="text-sm font-bold text-foreground/90 group-hover:text-foreground transition-colors">{student.user?.first_name || student.user?.username || 'Unknown'}</span>
                                       <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">{student.usn}</span>
                                    </div>
                                 </div>
                              ))
                           ) : (
                              <p className="text-xs font-medium text-muted-foreground italic border border-dashed border-border/60 rounded-xl p-4 text-center bg-background/30">No students assigned.</p>
                           )}
                        </div>
                     </div>
                  </CardContent>
               </Card>

            </div>
         </div>
      </div>
   );
}
