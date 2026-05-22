import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Receipt, ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function Payments() {
  const totalCost = 15000;
  const paidAmount = 5000;
  const pendingAmount = totalCost - paidAmount;
  const paymentProgress = (paidAmount / totalCost) * 100;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Payments & Invoices</h2>
          <p className="text-muted-foreground">Manage your project milestones and payment history.</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Project Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{totalCost.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Amount Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">₹{paidAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm border-border/50 bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary">Pending Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">₹{pendingAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment History */}
        <div className="lg:col-span-2 space-y-6">
           <Card className="rounded-2xl shadow-sm border-border/50">
             <CardHeader className="bg-secondary/30 border-b">
                <CardTitle>Transaction History</CardTitle>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y divide-border/40">
                   {/* Mock Transaction 1 */}
                   <div className="flex items-center justify-between p-6 hover:bg-secondary/20 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="p-3 rounded-full bg-green-500/10 text-green-500">
                            <CheckCircle2 className="w-5 h-5" />
                         </div>
                         <div>
                           <h4 className="font-medium">Initial Booking Advance</h4>
                           <p className="text-sm text-muted-foreground mt-0.5">Oct 05, 2026 • UPI Transfer</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="font-bold">₹5,000</div>
                         <Button variant="link" className="h-auto p-0 text-primary mt-1 text-xs" size="sm">
                            <Receipt className="w-3 h-3 mr-1" /> View Invoice
                         </Button>
                      </div>
                   </div>

                   {/* Mock Transaction 2 (Pending) */}
                   <div className="flex items-center justify-between p-6 hover:bg-secondary/20 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="p-3 rounded-full bg-orange-500/10 text-orange-500">
                            <CreditCard className="w-5 h-5" />
                         </div>
                         <div>
                           <h4 className="font-medium">Mid-Term Milestone</h4>
                           <p className="text-sm text-muted-foreground mt-0.5">Due: Nov 15, 2026</p>
                         </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                         <div className="font-bold text-orange-500">₹5,000</div>
                         <Button size="sm" className="rounded-lg h-9">Pay Now</Button>
                      </div>
                   </div>
                </div>
             </CardContent>
           </Card>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
           <Card className="rounded-2xl shadow-sm border-border/50">
              <CardHeader>
                 <CardTitle>Payment Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div>
                    <div className="flex justify-between text-sm font-medium mb-2">
                       <span>{Math.round(paymentProgress)}% Paid</span>
                       <span className="text-muted-foreground">₹{totalCost.toLocaleString()}</span>
                    </div>
                    <Progress value={paymentProgress} className="h-2" />
                 </div>
                 
                 <div className="p-4 bg-secondary/50 rounded-xl space-y-3">
                    <h4 className="font-semibold text-sm">Next Milestone Details</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Your next payment of ₹5,000 is required before the backend integration phase begins. 
                    </p>
                    <Button variant="outline" className="w-full rounded-xl gap-2 mt-2 bg-background">
                       View Payment Schedule <ArrowUpRight className="w-4 h-4" />
                    </Button>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
