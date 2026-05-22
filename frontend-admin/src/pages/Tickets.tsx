import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, MessageSquare, CheckCircle2, Clock } from "lucide-react";

export default function Tickets() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight">Support Tickets</h2>
          <p className="text-muted-foreground">Respond to student queries, bugs, and modification requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input placeholder="Search ticket ID..." className="pl-9 h-10 rounded-xl" />
          </div>
          <Button variant="outline" className="rounded-xl h-10 gap-2 bg-background">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ticket List */}
        <div className="lg:col-span-1 space-y-4">
           <div className="flex justify-between items-center px-1">
              <h3 className="font-semibold text-sm">Inbox (18)</h3>
           </div>
           <div className="space-y-3">
              {[
                { id: "#TKT-092", group: "Team Alpha", subject: "Login Bug", status: "Open", time: "2m ago" },
                { id: "#TKT-093", group: "Code Crafters", subject: "Database Error", status: "In Progress", time: "1h ago" },
                { id: "#TKT-094", group: "Data Miners", subject: "Requesting PPT Format", status: "Resolved", time: "1d ago" },
              ].map((ticket, i) => (
                <div key={i} className={`p-4 rounded-xl border cursor-pointer transition-colors ${i === 0 ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-card hover:bg-secondary/20'}`}>
                   <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-xs text-muted-foreground">{ticket.id}</span>
                      <span className="text-xs text-muted-foreground">{ticket.time}</span>
                   </div>
                   <h4 className="font-semibold text-sm mb-1">{ticket.subject}</h4>
                   <p className="text-xs text-muted-foreground mb-3">{ticket.group}</p>
                   <Badge variant="secondary" className={`text-[10px] ${
                      ticket.status === 'Open' ? 'bg-orange-500/10 text-orange-600' :
                      ticket.status === 'In Progress' ? 'bg-blue-500/10 text-blue-600' :
                      'bg-green-500/10 text-green-600'
                   }`}>{ticket.status}</Badge>
                </div>
              ))}
           </div>
        </div>

        {/* Ticket Detail / Chat */}
        <div className="lg:col-span-2">
           <Card className="rounded-2xl shadow-sm border-border/50 h-[600px] flex flex-col">
              <CardHeader className="border-b bg-secondary/20 py-4 flex flex-row items-center justify-between">
                 <div>
                    <CardTitle className="text-lg">Login Bug</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">#TKT-092 • Team Alpha</p>
                 </div>
                 <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-lg h-8 gap-2">
                      <Clock className="w-3.5 h-3.5" /> Mark In Progress
                    </Button>
                    <Button size="sm" className="rounded-lg h-8 gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                    </Button>
                 </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 bg-secondary/5">
                 {/* Student Message */}
                 <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-1">R</div>
                    <div className="bg-background border rounded-2xl rounded-tl-none p-4 shadow-sm max-w-[80%]">
                       <p className="text-sm">Hi, we are unable to log into the student portal using the credentials provided yesterday. It throws a 500 server error.</p>
                       <span className="text-[10px] text-muted-foreground mt-2 block">Rahul Sharma • 10:30 AM</span>
                    </div>
                 </div>

                 {/* Admin Reply */}
                 <div className="flex gap-4 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0 mt-1">SA</div>
                    <div className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tr-none p-4 shadow-sm max-w-[80%]">
                       <p className="text-sm text-foreground">Looking into this right now. I will reset your group's password and send the new credentials here shortly.</p>
                       <span className="text-[10px] text-muted-foreground mt-2 block text-right">You • 10:32 AM</span>
                    </div>
                 </div>
              </CardContent>
              <div className="p-4 border-t bg-background flex items-center gap-3">
                 <Input placeholder="Type your reply here..." className="rounded-xl h-12 bg-secondary/50" />
                 <Button className="h-12 w-12 rounded-xl shrink-0" size="icon">
                    <MessageSquare className="w-5 h-5" />
                 </Button>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
