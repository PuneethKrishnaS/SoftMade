import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, CheckCircle2, MessageSquare } from "lucide-react";
import { useOutletContext } from "react-router-dom";

export default function Overview() {
  const { activeProject } = useOutletContext<{ activeProject: any }>();

  if (!activeProject) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground border border-dashed rounded-2xl">
        No project assigned yet. Please contact admin.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-card border rounded-2xl shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-2">
           <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
           <p className="text-muted-foreground">Your project <span className="font-medium text-foreground">{activeProject.title}</span> is currently on track.</p>
        </div>
        <div className="relative z-10">
           <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-4 py-1.5 text-sm">
             Phase: {activeProject.status.replace('_', ' ')}
           </Badge>
        </div>
        {/* Decorative background element */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-2xl border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Progress</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProject.progress_percentage || 0}%</div>
            <Progress value={activeProject.progress_percentage || 0} className="h-2 mt-3" />
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Milestone</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">API Integration</div>
            <p className="text-xs text-muted-foreground mt-1">Due in 4 days</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Tasks</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12/18</div>
            <p className="text-xs text-muted-foreground mt-1">+2 completed this week</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Support Messages</CardTitle>
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 Unread</div>
            <p className="text-xs text-muted-foreground mt-1">From Admin Support</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="rounded-2xl border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="space-y-6">
              {[
                { title: 'Backend code uploaded', time: '2 hours ago', type: 'upload' },
                { title: 'UI Design approved by Admin', time: '1 day ago', type: 'status' },
                { title: 'Synopsis Document accepted', time: '3 days ago', type: 'status' },
              ].map((activity, i) => (
                <div key={i} className="flex gap-4 items-start">
                   <div className="w-2 h-2 mt-2 rounded-full bg-primary ring-4 ring-primary/10" />
                   <div>
                     <p className="text-sm font-medium">{activity.title}</p>
                     <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                   </div>
                </div>
              ))}
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
