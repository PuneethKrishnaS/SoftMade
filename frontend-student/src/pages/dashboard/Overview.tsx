import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Ticket as TicketIcon, IndianRupee, Users, Tag, ShieldCheck, Mail, Code, Calendar, Clock, Activity, ArrowRight, ArrowUpRight } from "lucide-react";
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
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-8xl mx-auto pb-8">

         {/* 1. HERO SECTION (Tighter Gaps) */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 rounded-2xl border-border/40 shadow-sm bg-card/60 backdrop-blur-xl overflow-hidden relative">
               <div className="absolute top-0 right-0 p-32 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
               <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-3">
                     <div className="flex items-start justify-between gap-4">
                        <div>
                           <Badge variant="outline" className="mb-2 bg-background/50 backdrop-blur-sm border-border/50 text-sm font-medium px-3 py-0.5">
                              {activeProject.category || "General"}
                           </Badge>
                           <h1 className="text-2xl font-bold tracking-tight text-foreground">{activeProject.title}</h1>
                        </div>
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1 shadow-none text-sm whitespace-nowrap">
                           {activeProject.progress_percentage || 0}% Completed
                        </Badge>
                     </div>
                     <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl line-clamp-2">
                        {activeProject.description || "No detailed description provided for this project."}
                     </p>
                  </div>

                  <div className="pt-4 border-t border-border/50 flex flex-wrap items-center justify-between gap-4">
                     <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Code className="w-3 h-3" /> Tech Stack</span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                           {activeProject.technology ? activeProject.technology.split(',').map((tech: string, i: number) => (
                              <Badge key={i} variant="secondary" className="px-2 py-0.5 text-md font-medium bg-secondary/40 text-foreground/80 hover:bg-secondary/60 transition-colors">{tech.trim()}</Badge>
                           )) : <span className="text-md text-muted-foreground">Not specified</span>}
                        </div>
                     </div>
                     <div className="flex gap-6">
                        <div className="space-y-1">
                           <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Start</span>
                           <p className="text-sm font-semibold">{formatDate(activeProject.start_date)}</p>
                        </div>
                        <div className="space-y-1">
                           <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Clock className="w-3 h-3" /> Deadline</span>
                           <p className="text-sm font-semibold">{formatDate(activeProject.deadline)}</p>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Hero Sidebar: Milestone & Action */}
            <Card className="rounded-2xl border-border/40 shadow-sm bg-primary/5 border-primary/10">
               <CardContent className="p-6 flex flex-col justify-center h-full space-y-5">
                  <div>
                     <h3 className="text-[12px] font-bold uppercase tracking-wider text-primary/80 mb-1">Current Phase</h3>
                     <div className="text-xl font-bold text-foreground mb-1">{currentPhaseLabel}</div>
                     <p className="text-md text-muted-foreground flex items-center gap-1.5">
                        Stage {currentPhaseIndex + 1} of {PIPELINE_PHASES.length}
                        <ArrowRight className="w-3 h-3" />
                     </p>
                  </div>

                  <div className="space-y-1.5">
                     <div className="flex justify-between text-md">
                        <span className="text-muted-foreground">Overall Progress</span>
                        <span className="font-medium">{activeProject.progress_percentage || 0}%</span>
                     </div>
                     <Progress value={activeProject.progress_percentage || 0} className="h-2 bg-primary/10" />
                  </div>

                  {daysUntilDeadline !== null && (
                     <div className={cn("p-3 rounded-xl border flex items-start gap-2.5", daysUntilDeadline > 7 ? "bg-background/50 border-border/50 text-muted-foreground" : daysUntilDeadline >= 0 ? "bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400" : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400")}>
                        <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                        <div>
                           <p className="font-semibold text-md">
                              {daysUntilDeadline > 0 ? `${daysUntilDeadline} Days Remaining` : daysUntilDeadline === 0 ? "Deadline is Today!" : `${Math.abs(daysUntilDeadline)} Days Overdue`}
                           </p>
                        </div>
                     </div>
                  )}
               </CardContent>
            </Card>
         </div>

         {/* 2. PIPELINE STEPPER (Clean, readable horizontal timeline) */}
         <Card className="rounded-2xl border-border/40 shadow-sm bg-card/60 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-6 overflow-x-auto">
               <div className="flex items-start justify-between min-w-[800px] max-w-full">
                  {PIPELINE_PHASES.map((phase, idx) => {
                     const isCompleted = idx < currentPhaseIndex;
                     const isCurrent = idx === currentPhaseIndex;
                     return (
                        <div key={phase.id} className="flex flex-col items-center relative flex-1 group">
                           {/* Connecting Line */}
                           {idx !== 0 && (
                              <div className={cn("absolute top-2.5 left-[-50%] right-[50%] h-[2px] -z-10 rounded-full transition-all duration-500", isCompleted || isCurrent ? "bg-primary" : "bg-secondary")} />
                           )}
                           {/* Node */}
                           <div className={cn("w-5 h-5 rounded-full flex items-center justify-center z-10 transition-all duration-300 shadow-sm mb-2",
                              isCompleted ? "bg-primary text-primary-foreground border border-primary" :
                                 isCurrent ? "bg-background border-2 border-primary ring-2 ring-primary/20" : "bg-background border border-secondary text-muted-foreground")}>
                              {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <span className="text-[9px] font-bold opacity-50">{idx + 1}</span>}
                           </div>
                           {/* Label */}
                           <span className={cn("text-sm font-medium text-center px-1 transition-colors", isCurrent ? "text-primary font-bold" : isCompleted ? "text-foreground" : "text-muted-foreground")}>
                              {phase.label}
                           </span>
                        </div>
                     )
                  })}
               </div>
            </CardContent>
         </Card>

         {/* 3. BENTO GRID (Activity, Team, Finances) */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Left Col: Recent Activity */}
            <Card className="lg:col-span-2 rounded-2xl border-border/40 shadow-sm bg-card/60 backdrop-blur-sm">
               <CardHeader className="px-6 py-4 border-b border-border/40 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Activity Log</CardTitle>
                  <Badge variant="secondary" className="font-normal text-[10px]">{recentActivities.length} Recent Events</Badge>
               </CardHeader>
               <CardContent className="p-6">
                  <div className="space-y-5 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-border/50 before:via-border/20 before:to-transparent">
                     {recentActivities.length > 0 ? (
                        recentActivities.map((activity, i) => {
                           const Icon = activity.icon;
                           return (
                              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                 <div className={`flex items-center justify-center w-8 h-8 rounded-xl border-2 border-background ${activity.bg} ${activity.color} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 transition-transform hover:scale-110`}>
                                    <Icon className="w-3 h-3" />
                                 </div>
                                 <div className="w-[calc(100%-3.5rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border/40 bg-background/50 shadow-sm hover:bg-card transition-colors">
                                    <div className="font-semibold text-md text-foreground mb-1">{activity.title}</div>
                                    <div className="text-[10px] text-muted-foreground font-medium">{formatTimeAgo(activity.time)}</div>
                                 </div>
                              </div>
                           );
                        })
                     ) : (
                        <div className="text-md text-center py-8 text-muted-foreground relative z-10 bg-background/50 rounded-xl border border-dashed">No recent activity found.</div>
                     )}
                  </div>
               </CardContent>
            </Card>

            {/* Right Col: Stacked Cards (Finances & Team) */}
            <div className="space-y-4">

               {/* Finances */}
               <Card className="rounded-2xl border-border/40 shadow-sm bg-card/60 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="px-5 py-3 border-b border-border/40 bg-background/50">
                     <CardTitle className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-emerald-500" /> Financial Overview
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4">
                     <div>
                        <div className="flex justify-between items-end mb-1.5">
                           <span className="text-[11px] font-medium text-muted-foreground">Amount Paid</span>
                           <div className="text-right">
                              <span className="text-base font-bold text-foreground">₹{totalPaid.toLocaleString()}</span>
                              <span className="text-[10px] text-muted-foreground ml-1">/ ₹{totalCost.toLocaleString()}</span>
                           </div>
                        </div>
                        <Progress value={paymentPercentage} className="h-1.5 bg-secondary" />
                     </div>

                     <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40">
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Total Cost</p>
                           <p className="text-md font-semibold text-foreground">₹{totalCost.toLocaleString()}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Pending</p>
                           <p className="text-md font-bold text-destructive">₹{pendingBalance.toLocaleString()}</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Team */}
               <Card className="rounded-2xl border-border/40 shadow-sm bg-card/60 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="px-5 py-3 border-b border-border/40 bg-background/50 flex flex-row items-center justify-between">
                     <CardTitle className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-blue-500" /> Team Workspace
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                     {/* Guide */}
                     <div className="p-5 bg-blue-500/5 border-b border-border/40 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                           <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                           <p className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-0.5">Project Guide</p>
                           <p className="text-md font-bold text-foreground">
                              {activeProject.assigned_developer ? (activeProject.assigned_developer.first_name || activeProject.assigned_developer.username) : "Not Assigned"}
                           </p>
                        </div>
                     </div>

                     {/* Students */}
                     <div className="p-5">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Group Members</p>
                        <div className="space-y-3">
                           {activeProject.students && activeProject.students.length > 0 ? (
                              activeProject.students.map((student: any) => (
                                 <div key={student.id} className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-[10px] shrink-0 border border-border/50">
                                       {student.user?.first_name ? student.user.first_name.charAt(0).toUpperCase() : 'S'}
                                    </div>
                                    <div className="flex flex-col">
                                       <span className="text-md font-semibold text-foreground">{student.user?.first_name || student.user?.username || 'Unknown'}</span>
                                       <span className="text-[9px] text-muted-foreground">{student.usn}</span>
                                    </div>
                                 </div>
                              ))
                           ) : (
                              <p className="text-md text-muted-foreground italic border border-dashed rounded-lg p-3 text-center">No students assigned.</p>
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
