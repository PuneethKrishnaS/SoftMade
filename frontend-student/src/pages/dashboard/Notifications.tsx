import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check, Info, FileUp, AlertCircle } from "lucide-react";

const NOTIFICATIONS = [
  { id: 1, type: 'info', message: 'Admin replied to your ticket #TKT-092.', time: '2 hours ago', read: false, icon: Info },
  { id: 2, type: 'upload', message: 'Mid-term report format has been uploaded to your downloads.', time: '1 day ago', read: false, icon: FileUp },
  { id: 3, type: 'success', message: 'Payment of ₹5,000 received successfully.', time: '3 days ago', read: true, icon: Check },
  { id: 4, type: 'alert', message: 'Project Synopsis submission is pending. Please upload immediately.', time: '1 week ago', read: true, icon: AlertCircle },
];

export default function Notifications() {
  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-200 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-5 sm:p-6 bg-card/40 border border-border/40 rounded-md shadow-xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="flex flex-col gap-2 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Notifications</h2>
          <p className="text-muted-foreground font-medium text-sm sm:text-base">Stay updated on your project's progress and important alerts.</p>
        </div>
        <Button variant="outline" className="rounded-xl h-12 px-6 shadow-sm hover:shadow-primary/20 transition-colors hover:-translate-y-0.5 relative z-10 font-bold uppercase tracking-widest text-xs">
          Mark all as read
        </Button>
      </div>

      <Card className="rounded-md border-border/40 shadow-xl bg-card/40 backdrop-blur-sm overflow-hidden hover:border-foreground/20 transition-colors duration-200 hover:-translate-y-1">
        <CardHeader className="px-6 py-4 border-b border-border/30 bg-background/20">
          <CardTitle className="flex items-center gap-2.5 text-xs uppercase tracking-widest font-bold text-muted-foreground">
            <Bell className="w-4 h-4 text-primary" />
            Recent Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/30">
            {NOTIFICATIONS.map((notif) => (
              <div key={notif.id} className={`flex items-start gap-5 p-5 hover:bg-secondary/40 transition-colors group cursor-pointer ${!notif.read ? 'bg-primary/5' : ''}`}>
                <div className={`mt-0.5 p-3 rounded-2xl border shadow-sm group-hover:scale-110 transition-transform ${notif.type === 'info' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                    notif.type === 'upload' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                      notif.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        'bg-orange-500/10 text-orange-500 border-orange-500/20'
                  }`}>
                  <notif.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm md:text-base leading-relaxed ${!notif.read ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>
                    {notif.message}
                  </p>
                  <p className="text-[11px] font-semibold text-muted-foreground mt-2 uppercase tracking-widest">{notif.time}</p>
                </div>
                {!notif.read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 flex-shrink-0 shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
