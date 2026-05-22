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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">Stay updated on your project's progress and important alerts.</p>
        </div>
        <Button variant="outline" className="rounded-xl h-10 px-4">
          Mark all as read
        </Button>
      </div>

      <Card className="rounded-2xl shadow-sm border-border/50">
        <CardHeader className="bg-secondary/30 border-b pb-4">
           <CardTitle className="flex items-center gap-2">
             <Bell className="w-5 h-5 text-primary" />
             Recent Alerts
           </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/40">
             {NOTIFICATIONS.map((notif) => (
                <div key={notif.id} className={`flex items-start gap-4 p-5 hover:bg-secondary/20 transition-colors ${!notif.read ? 'bg-primary/5' : ''}`}>
                   <div className={`mt-1 p-2 rounded-full ${
                      notif.type === 'info' ? 'bg-blue-500/10 text-blue-500' :
                      notif.type === 'upload' ? 'bg-purple-500/10 text-purple-500' :
                      notif.type === 'success' ? 'bg-green-500/10 text-green-500' :
                      'bg-orange-500/10 text-orange-500'
                   }`}>
                     <notif.icon className="w-4 h-4" />
                   </div>
                   <div className="flex-1">
                     <p className={`text-sm ${!notif.read ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                        {notif.message}
                     </p>
                     <p className="text-xs text-muted-foreground mt-1.5">{notif.time}</p>
                   </div>
                   {!notif.read && (
                     <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0 shadow-sm shadow-primary/40" />
                   )}
                </div>
             ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
