import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquarePlus, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const TICKETS = [
  { id: "#TKT-092", title: "Update Login Page UI", date: "Oct 15", status: "Resolved", priority: "Medium" },
  { id: "#TKT-104", title: "API Integration Error", date: "Oct 18", status: "In Progress", priority: "High" },
  { id: "#TKT-112", title: "Change Database Schema", date: "Today", status: "Open", priority: "Medium" },
];

export default function Tickets() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Support Tickets</h2>
          <p className="text-muted-foreground">Raise changes, report bugs, or get help directly from the developers.</p>
        </div>
        <Button className="rounded-xl h-12 px-6 gap-2">
          <MessageSquarePlus className="w-4 h-4" />
          Raise New Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Tickets List */}
        <div className="lg:col-span-2 space-y-4">
           <Card className="rounded-2xl shadow-sm border-border/50">
             <CardHeader className="bg-secondary/30 border-b">
                <CardTitle>Recent Tickets</CardTitle>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y divide-border/40">
                  {TICKETS.map((ticket) => (
                     <div key={ticket.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 hover:bg-secondary/20 transition-colors gap-4">
                        <div className="flex items-start gap-4">
                           <div className="mt-1">
                             {ticket.status === 'Resolved' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : 
                              ticket.status === 'In Progress' ? <Clock className="w-5 h-5 text-blue-500" /> : 
                              <AlertCircle className="w-5 h-5 text-orange-500" />}
                           </div>
                           <div>
                             <h4 className="font-medium text-lg">{ticket.title}</h4>
                             <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                               <span className="font-mono text-xs bg-secondary px-2 py-0.5 rounded-md">{ticket.id}</span>
                               <span>{ticket.date}</span>
                             </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-3 self-start sm:self-center pl-9 sm:pl-0">
                           <Badge variant="outline" className={`
                             ${ticket.priority === 'High' ? 'text-red-500 border-red-500/20 bg-red-500/10' : ''}
                             ${ticket.priority === 'Medium' ? 'text-orange-500 border-orange-500/20 bg-orange-500/10' : ''}
                           `}>
                             {ticket.priority}
                           </Badge>
                           <Badge className={`
                             ${ticket.status === 'Resolved' ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20' : ''}
                             ${ticket.status === 'In Progress' ? 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20' : ''}
                             ${ticket.status === 'Open' ? 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20' : ''}
                           `} variant="secondary">
                             {ticket.status}
                           </Badge>
                        </div>
                     </div>
                  ))}
                </div>
             </CardContent>
           </Card>
        </div>

        {/* Quick Help / Stats */}
        <div className="space-y-6">
           <Card className="rounded-2xl shadow-sm border-border/50">
              <CardHeader>
                 <CardTitle>Ticket Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-xl">
                    <span className="text-muted-foreground">Open Tickets</span>
                    <span className="text-xl font-bold text-orange-500">1</span>
                 </div>
                 <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-xl">
                    <span className="text-muted-foreground">In Progress</span>
                    <span className="text-xl font-bold text-blue-500">1</span>
                 </div>
                 <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-xl">
                    <span className="text-muted-foreground">Resolved</span>
                    <span className="text-xl font-bold text-green-500">1</span>
                 </div>
              </CardContent>
           </Card>

           <Card className="rounded-2xl shadow-sm border-border/50 bg-primary text-primary-foreground border-transparent">
              <CardContent className="p-6">
                 <h3 className="font-semibold text-lg mb-2">Need immediate help?</h3>
                 <p className="text-primary-foreground/80 text-sm mb-6">
                   For critical deployment issues or payment failures, contact your assigned developer directly.
                 </p>
                 <Button variant="secondary" className="w-full rounded-xl bg-background text-foreground hover:bg-background/90">
                   Contact Developer
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
