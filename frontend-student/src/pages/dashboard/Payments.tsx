import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Receipt, ArrowUpRight, CheckCircle2, Clock, Activity, IndianRupee } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Payments() {
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

  const totalCost = parseFloat(activeProject.total_price) || 0;
  const advancePaid = parseFloat(activeProject.advance_payment) || 0;
  const payments = activeProject.payments || [];
  
  const additionalPaid = payments.filter((p: any) => p.status === 'PAID').reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0);
  const totalPaid = advancePaid + additionalPaid;
  const pendingAmount = totalCost - totalPaid;
  const paymentPercentage = totalCost > 0 ? (totalPaid / totalCost) * 100 : 0;

  // Build the unified transaction history
  let transactions: any[] = [];
  if (advancePaid > 0) {
    transactions.push({
      id: 'advance',
      title: 'Initial Booking Advance',
      amount: advancePaid,
      status: 'PAID',
      date: new Date(activeProject.start_date || new Date()),
    });
  }
  
  payments.forEach((p: any) => {
    transactions.push({
      id: p.id,
      title: `Milestone Payment`,
      amount: parseFloat(p.amount),
      status: p.status, // 'PAID', 'PENDING', 'OVERDUE'
      date: new Date(p.created_at || p.due_date),
      dueDate: p.due_date ? new Date(p.due_date) : null,
    });
  });

  transactions.sort((a, b) => b.date.getTime() - a.date.getTime());

  // Find next pending payment
  const nextPayment = transactions.find(t => t.status !== 'PAID');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full pb-8">
      
      {/* HEADER SECTION (Monochrome, compact) */}
      <div className="flex items-center justify-between p-4 bg-card/60 border border-border/40 rounded-xl shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-4">
           <div>
             <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">Payments & Invoices</h2>
             <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{activeProject.title}</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <Badge variant="outline" className="bg-background text-[10px] font-bold uppercase tracking-widest border-border px-3 py-1 shadow-sm">
             {Math.round(paymentPercentage)}% Paid
           </Badge>
        </div>
      </div>

      {/* STATS ROW (Monochrome, compact) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-xl shadow-sm border-border/40 bg-card/60 backdrop-blur-sm">
          <CardHeader className="px-5 py-3 border-b border-border/40">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Cost</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="text-xl font-bold tracking-tight text-foreground">₹{totalCost.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="rounded-xl shadow-sm border-border/40 bg-card/60 backdrop-blur-sm">
          <CardHeader className="px-5 py-3 border-b border-border/40">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-foreground">Amount Paid</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="text-xl font-bold tracking-tight text-foreground">₹{totalPaid.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="rounded-xl shadow-sm border-foreground/20 bg-secondary/30 backdrop-blur-sm">
          <CardHeader className="px-5 py-3 border-b border-border/40">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-foreground">Pending Balance</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="text-xl font-bold tracking-tight text-foreground">₹{pendingAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* MAIN BENTO GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        
        {/* Left Col (8/12): Transaction History */}
        <div className="xl:col-span-8 space-y-4">
           <Card className="rounded-xl border-border/40 shadow-sm bg-card/60 backdrop-blur-sm overflow-hidden h-full">
             <CardHeader className="px-5 py-3 border-b border-border/40 bg-background/50 flex flex-row items-center justify-between">
                <CardTitle className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-foreground">
                   <Receipt className="w-3.5 h-3.5" /> Transaction History
                </CardTitle>
                <Badge variant="secondary" className="font-bold text-[9px] uppercase tracking-wider">{transactions.length} Records</Badge>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y divide-border/40">
                   {transactions.length > 0 ? (
                      transactions.map((tx) => (
                         <div key={tx.id} className="flex items-center justify-between p-5 hover:bg-secondary/20 transition-colors">
                            <div className="flex items-center gap-4">
                               <div className={cn("p-2.5 rounded-lg border shadow-sm shrink-0 flex items-center justify-center", tx.status === 'PAID' ? 'bg-foreground text-background border-foreground' : 'bg-background text-muted-foreground border-border/60')}>
                                  {tx.status === 'PAID' ? <CheckCircle2 className="w-3.5 h-3.5" /> : tx.status === 'OVERDUE' ? <Clock className="w-3.5 h-3.5" /> : <CreditCard className="w-3.5 h-3.5" />}
                               </div>
                               <div>
                                 <div className="flex items-center gap-2.5 mb-1">
                                    <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">{tx.title}</h4>
                                    <Badge variant="outline" className={cn("text-[9px] uppercase tracking-widest px-1.5 py-0 h-4 border", tx.status === 'PAID' ? 'text-foreground border-foreground bg-foreground/5' : 'text-muted-foreground border-border bg-secondary/50')}>
                                       {tx.status}
                                    </Badge>
                                 </div>
                                 <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                    {tx.status === 'PAID' ? `Completed ${formatDate(tx.date)}` : `Due: ${tx.dueDate ? formatDate(tx.dueDate) : 'Pending'}`}
                                 </p>
                               </div>
                            </div>
                            <div className="text-right flex items-center gap-4">
                               <div className={cn("text-sm font-bold tracking-tight", tx.status === 'PAID' ? 'text-foreground' : 'text-muted-foreground')}>
                                  ₹{tx.amount.toLocaleString()}
                               </div>
                               {tx.status === 'PAID' ? (
                                  <Button variant="outline" size="sm" className="h-7 px-3 text-[9px] font-bold uppercase tracking-widest hidden sm:flex border-border/60">
                                     <Receipt className="w-3 h-3 mr-1.5" /> Invoice
                                  </Button>
                               ) : (
                                  <Button size="sm" className="rounded-lg h-7 px-4 text-[9px] uppercase tracking-widest font-bold shadow-sm bg-foreground text-background hover:bg-foreground/90">Pay</Button>
                               )}
                            </div>
                         </div>
                      ))
                   ) : (
                      <div className="p-8 text-center text-muted-foreground text-[10px] uppercase tracking-widest">No transactions found.</div>
                   )}
                </div>
             </CardContent>
           </Card>
        </div>

        {/* Right Col (4/12): Action Panel */}
        <div className="xl:col-span-4 space-y-4">
           <Card className="rounded-xl border-border/40 shadow-sm bg-card/60 backdrop-blur-sm overflow-hidden">
              <CardHeader className="px-5 py-3 border-b border-border/40 bg-background/50">
                 <CardTitle className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-foreground">
                    <Activity className="w-3.5 h-3.5" /> Progress
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-6">
                 <div>
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Paid</span>
                       <div className="text-right">
                          <span className="text-base font-bold tracking-tight text-foreground">{Math.round(paymentPercentage)}%</span>
                          <span className="text-[10px] text-muted-foreground ml-1">/ ₹{totalCost.toLocaleString()}</span>
                       </div>
                    </div>
                    <Progress value={paymentPercentage} className="h-1.5 bg-secondary [&>div]:bg-foreground" />
                 </div>
                 
                 {nextPayment ? (
                    <div className="p-5 bg-secondary/30 border border-border/50 rounded-xl space-y-4 shadow-sm">
                       <h4 className="font-bold text-[10px] text-foreground uppercase tracking-widest">Next Milestone</h4>
                       <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                         Your next payment of <span className="font-bold text-foreground">₹{nextPayment.amount.toLocaleString()}</span> is required. 
                       </p>
                       <Button className="w-full rounded-lg h-9 text-[10px] uppercase tracking-widest font-bold bg-foreground text-background hover:bg-foreground/90 shadow-sm flex items-center justify-center gap-2">
                          Pay ₹{nextPayment.amount.toLocaleString()} <ArrowUpRight className="w-3 h-3" />
                       </Button>
                    </div>
                 ) : (
                    <div className="p-5 bg-secondary/30 border border-border/50 rounded-xl space-y-3 text-center shadow-sm">
                       <div className="w-10 h-10 bg-background border border-border/60 rounded-full flex items-center justify-center mx-auto mb-3">
                          <CheckCircle2 className="w-4 h-4 text-foreground" />
                       </div>
                       <h4 className="font-bold text-[10px] text-foreground uppercase tracking-widest">All Caught Up!</h4>
                       <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                         No pending payments.
                       </p>
                    </div>
                 )}
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
