import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Receipt, ArrowUpRight, CheckCircle2, Clock, Activity } from "lucide-react";
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
    <div className="space-y-5 max-w-[1600px] mx-auto pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-5 sm:p-6 bg-card/40 border border-border/40 rounded-[32px] shadow-xl backdrop-blur-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 p-32 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
         <div className="flex flex-col gap-2 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Payments & Invoices</h2>
          <p className="text-muted-foreground font-medium text-sm sm:text-base">Track your financial milestones and pending balances.</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
           <Badge variant="outline" className="bg-background/50 text-xs font-bold uppercase tracking-widest border-border/50 px-4 py-1.5 shadow-sm rounded-xl">
             {Math.round(paymentPercentage)}% Paid
           </Badge>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="rounded-[32px] border-border/40 shadow-sm bg-card/40">
          <CardHeader className="px-6 py-4 border-b border-border/30 bg-background/20">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Cost</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-2xl font-extrabold tracking-tight text-foreground">₹{totalCost.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="rounded-[32px] border-border/40 shadow-sm bg-card/40">
          <CardHeader className="px-6 py-4 border-b border-border/30 bg-background/20">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-emerald-500">Amount Paid</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-2xl font-extrabold tracking-tight text-foreground">₹{totalPaid.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="rounded-[32px] border-orange-500/20 shadow-xl shadow-orange-500/5 bg-gradient-to-br from-orange-500/5 to-transparent backdrop-blur-sm hover:border-orange-500/40 transition-colors duration-200 hover:-translate-y-1">
          <CardHeader className="px-6 py-4 border-b border-orange-500/20 bg-background/20">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-orange-500">Pending Balance</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-2xl font-extrabold tracking-tight text-foreground">₹{pendingAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* MAIN BENTO GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        
        {/* Left Col (8/12): Transaction History */}
        <div className="xl:col-span-8 space-y-5">
           <Card className="rounded-[32px] border-border/40 shadow-xl bg-card/40 backdrop-blur-sm overflow-hidden h-full hover:border-foreground/20 transition-colors duration-200">
             <CardHeader className="px-6 py-4 border-b border-border/30 bg-background/20 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2.5 text-muted-foreground">
                   <Receipt className="w-4 h-4 text-primary" /> Transaction History
                </CardTitle>
                <Badge variant="secondary" className="font-bold text-[10px] uppercase tracking-widest bg-secondary/80 border border-border/50 px-3 py-1">{transactions.length} Records</Badge>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y divide-border/30">
                   {transactions.length > 0 ? (
                      transactions.map((tx) => (
                         <div key={tx.id} className="flex items-center justify-between p-5 hover:bg-secondary/40 transition-colors group cursor-pointer">
                            <div className="flex items-center gap-5">
                               <div className={cn("w-10 h-10 rounded-xl border shadow-sm shrink-0 flex items-center justify-center transition-transform group-hover:scale-110", tx.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-background text-muted-foreground border-border')}>
                                  {tx.status === 'PAID' ? <CheckCircle2 className="w-4 h-4" /> : tx.status === 'OVERDUE' ? <Clock className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                               </div>
                               <div>
                                 <div className="flex items-center gap-3 mb-1.5">
                                    <h4 className="font-bold text-sm uppercase tracking-wider text-foreground/90 group-hover:text-foreground transition-colors">{tx.title}</h4>
                                    <Badge variant="outline" className={cn("text-[9px] uppercase tracking-widest px-2 py-0.5 border font-bold", tx.status === 'PAID' ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5' : 'text-muted-foreground border-border/50 bg-secondary/50')}>
                                       {tx.status}
                                    </Badge>
                                 </div>
                                 <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-widest">
                                    {tx.status === 'PAID' ? `Completed ${formatDate(tx.date)}` : `Due: ${tx.dueDate ? formatDate(tx.dueDate) : 'Pending'}`}
                                 </p>
                               </div>
                            </div>
                            <div className="text-right flex items-center gap-5">
                               <div className={cn("text-lg font-extrabold tracking-tight", tx.status === 'PAID' ? 'text-foreground' : 'text-muted-foreground')}>
                                  ₹{tx.amount.toLocaleString()}
                               </div>
                               {tx.status === 'PAID' ? (
                                  <Button variant="outline" size="sm" className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest hidden sm:flex border-border/50 hover:bg-secondary/80 rounded-xl">
                                     <Receipt className="w-3.5 h-3.5 mr-2" /> Invoice
                                  </Button>
                               ) : (
                                  <Button size="sm" className="rounded-xl h-9 px-6 text-[11px] uppercase tracking-widest font-bold shadow-lg hover:shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors hover:-translate-y-0.5">Pay</Button>
                               )}
                            </div>
                         </div>
                      ))
                   ) : (
                      <div className="p-8 text-center text-muted-foreground text-xs uppercase tracking-widest font-semibold border border-dashed border-border/50 m-6 rounded-2xl bg-background/30">No transactions found.</div>
                   )}
                </div>
             </CardContent>
           </Card>
        </div>

        {/* Right Col (4/12): Action Panel */}
        <div className="xl:col-span-4 space-y-5">
           <Card className="rounded-[32px] border-border/40 shadow-xl bg-card/40 backdrop-blur-sm overflow-hidden hover:border-foreground/20 transition-colors duration-200 hover:-translate-y-1">
              <CardHeader className="px-6 py-4 border-b border-border/30 bg-background/20">
                 <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2.5 text-muted-foreground">
                    <Activity className="w-4 h-4 text-primary" /> Progress
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                 <div className="bg-background/50 p-5 rounded-2xl border border-border/50 shadow-sm">
                    <div className="flex justify-between items-end mb-3">
                       <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Paid</span>
                       <div className="text-right">
                          <span className="text-lg font-extrabold tracking-tight text-foreground">{Math.round(paymentPercentage)}%</span>
                          <span className="text-[11px] font-bold text-muted-foreground ml-1.5">/ ₹{totalCost.toLocaleString()}</span>
                       </div>
                    </div>
                    <Progress value={paymentPercentage} className="h-2.5 bg-secondary/80 [&>div]:bg-primary" />
                 </div>
                 
                 {nextPayment ? (
                    <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl space-y-5 shadow-inner">
                       <h4 className="font-bold text-[11px] text-primary uppercase tracking-widest">Next Milestone</h4>
                       <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                         Your next payment of <span className="font-extrabold text-foreground">₹{nextPayment.amount.toLocaleString()}</span> is required. 
                       </p>
                       <Button className="w-full rounded-xl h-12 text-xs uppercase tracking-widest font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-primary/20 transition-colors hover:-translate-y-0.5 flex items-center justify-center gap-2">
                          Pay ₹{nextPayment.amount.toLocaleString()} <ArrowUpRight className="w-4 h-4" />
                       </Button>
                    </div>
                 ) : (
                    <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl space-y-4 text-center shadow-inner">
                       <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-[24px] flex items-center justify-center mx-auto mb-2 text-emerald-500">
                          <CheckCircle2 className="w-8 h-8" />
                       </div>
                       <h4 className="font-extrabold text-sm text-emerald-600 uppercase tracking-widest">All Caught Up!</h4>
                       <p className="text-[11px] text-emerald-600/70 uppercase tracking-widest font-bold">
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
