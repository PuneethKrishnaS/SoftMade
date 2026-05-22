import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Clock } from "lucide-react";

const STAGES = [
  { id: 'REQUIREMENT', label: 'Requirement Collection', status: 'completed' },
  { id: 'TOPIC', label: 'Topic Finalization', status: 'completed' },
  { id: 'SYNOPSIS', label: 'Synopsis Preparation', status: 'completed' },
  { id: 'DESIGN', label: 'UI/UX Design', status: 'completed' },
  { id: 'FRONTEND', label: 'Frontend Development', status: 'completed' },
  { id: 'BACKEND', label: 'Backend Development', status: 'in-progress' },
  { id: 'DATABASE', label: 'Database Integration', status: 'upcoming' },
  { id: 'TESTING', label: 'Testing Phase', status: 'upcoming' },
  { id: 'REPORT', label: 'Report Preparation', status: 'upcoming' },
  { id: 'DEPLOYMENT', label: 'Deployment', status: 'upcoming' },
  { id: 'DELIVERED', label: 'Final Delivery', status: 'upcoming' },
];

export default function Tracking() {
  const completedCount = STAGES.filter(s => s.status === 'completed').length;
  const progressPercent = Math.round((completedCount / STAGES.length) * 100);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Project Tracking</h2>
        <p className="text-muted-foreground">Monitor your project's development lifecycle.</p>
      </div>

      <Card className="rounded-2xl shadow-sm border-border/50">
        <CardHeader>
           <CardTitle className="flex justify-between items-center">
             <span>Overall Progress</span>
             <span className="text-primary text-2xl">{progressPercent}%</span>
           </CardTitle>
        </CardHeader>
        <CardContent>
           <Progress value={progressPercent} className="h-3" />
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm border-border/50 overflow-hidden">
        <CardHeader className="bg-secondary/30 border-b">
           <CardTitle>Development Stages</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/40">
            {STAGES.map((stage, index) => (
              <div 
                key={stage.id} 
                className={`flex items-center gap-4 p-4 md:p-6 transition-colors ${
                  stage.status === 'in-progress' ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex-shrink-0">
                  {stage.status === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  ) : stage.status === 'in-progress' ? (
                    <Clock className="w-6 h-6 text-primary animate-pulse" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    stage.status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'
                  }`}>
                    {index + 1}. {stage.label}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stage.status === 'completed' && 'Completed successfully.'}
                    {stage.status === 'in-progress' && 'Currently being worked on.'}
                    {stage.status === 'upcoming' && 'Pending initiation.'}
                  </p>
                </div>
                {stage.status === 'in-progress' && (
                   <div className="px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                      Active
                   </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
