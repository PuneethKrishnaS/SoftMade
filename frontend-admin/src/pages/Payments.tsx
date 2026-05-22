import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Loader2, CreditCard, ExternalLink, IndianRupee, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function Payments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ totalExpected: 0, totalCollected: 0, pending: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const [projectsRes, paymentsRes] = await Promise.all([
          api.get("projects/"),
          api.get("payments/")
        ]);
        
        const projects = projectsRes.data;
        const pays = paymentsRes.data;

        // Sort payments by date descending
        const sorted = pays.sort((a: any, b: any) => new Date(b.paid_date || b.due_date).getTime() - new Date(a.paid_date || a.due_date).getTime());
        setPayments(sorted);

        // Calculate Metrics
        const expected = projects.reduce((sum: number, p: any) => sum + parseFloat(p.total_price || 0), 0);
        const collectedAdvances = projects.reduce((sum: number, p: any) => sum + parseFloat(p.advance_payment || 0), 0);
        const collectedInstallments = pays.filter((p: any) => p.status === 'PAID').reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0);
        
        const collected = collectedAdvances + collectedInstallments;
        const pending = expected - collected;

        setMetrics({ totalExpected: expected, totalCollected: collected, pending: pending });

      } catch (err) {
        console.error("Failed to fetch payments", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((p: any) => 
    (p.project_title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.transaction_id || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-8xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-primary">Global Payments</h1>
          <p className="text-muted-foreground mt-2 text-sm">View all incoming payments and transactions across all projects.</p>
        </div>
        <div className="flex items-center gap-4 mt-6 md:mt-0">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input 
              placeholder="Search by project or transaction ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-md border-border bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-primary/20" 
            />
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expected</CardTitle>
            <IndianRupee className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : (
              <div className="text-3xl font-bold">₹{metrics.totalExpected.toLocaleString()}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Total value of all projects</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Collected Money</CardTitle>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : (
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">₹{metrics.totalCollected.toLocaleString()}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Advances + Paid Installments</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Need to Collect</CardTitle>
            <Clock className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : (
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">₹{metrics.pending.toLocaleString()}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Outstanding pending balance</p>
          </CardContent>
        </Card>
      </div>

      {/* List View */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="text-center py-24 bg-card border border-dashed border-border rounded-xl">
          <CreditCard className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-foreground">No payments found</h3>
          <p className="text-muted-foreground text-sm mt-1">No payment records match your search criteria.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-medium">
                <tr>
                  <th className="px-6 py-4 font-medium">Project</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Dates</th>
                  <th className="px-6 py-4 font-medium">Transaction ID</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {payment.project_title || "Unknown Project"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {payment.description || "Payment Installment"}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      ₹{parseFloat(payment.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={`font-normal rounded-sm text-[11px] uppercase tracking-wider border-transparent ${payment.status === 'PAID' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      <div className="flex flex-col gap-1 text-[13px]">
                        {payment.paid_date ? (
                          <span className="text-foreground"><span className="text-muted-foreground">Paid:</span> {payment.paid_date}</span>
                        ) : (
                          <span><span className="text-muted-foreground">Due:</span> {payment.due_date || "-"}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      {payment.transaction_id || "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Link to={`/admin/projects/${payment.project}`} className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-transparent hover:bg-secondary text-muted-foreground transition-colors">
                          <ExternalLink className="w-4 h-4" />
                       </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
