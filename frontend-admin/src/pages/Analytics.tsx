import { useState, useEffect } from "react";
import { Loader2, TrendingUp, PieChart, BarChart2, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../lib/api";

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#f97316'];

export default function Analytics() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Data States
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [financialHealth, setFinancialHealth] = useState<any[]>([]);
  const [demographics, setDemographics] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [projectsRes, paymentsRes, studentsRes] = await Promise.all([
          api.get("projects/"),
          api.get("payments/"),
          api.get("students/")
        ]);

        const projects = projectsRes.data;
        const payments = paymentsRes.data;
        const students = studentsRes.data;

        // 1. Revenue Over Time
        const revenueMap: Record<string, number> = {};
        payments.forEach((p: any) => {
          if (p.status === 'PAID' && p.paid_date) {
             // Group by YYYY-MM
             const month = p.paid_date.substring(0, 7);
             revenueMap[month] = (revenueMap[month] || 0) + parseFloat(p.amount);
          }
        });
        // Include advance payments based on project start date (or assume they happened on start_date)
        projects.forEach((p: any) => {
           if (p.advance_payment && parseFloat(p.advance_payment) > 0) {
              const month = (p.start_date || new Date().toISOString().substring(0, 10)).substring(0, 7);
              revenueMap[month] = (revenueMap[month] || 0) + parseFloat(p.advance_payment);
           }
        });

        const sortedMonths = Object.keys(revenueMap).sort();
        const formattedRevenue = sortedMonths.map(month => ({
           month,
           revenue: revenueMap[month]
        }));
        setRevenueData(formattedRevenue);

        // 2. Project Status Distribution
        const statusMap: Record<string, number> = {};
        projects.forEach((p: any) => {
          const status = p.status.replace('_', ' ');
          statusMap[status] = (statusMap[status] || 0) + 1;
        });
        setStatusData(Object.entries(statusMap).map(([name, value]) => ({ name, value })));

        // 3. Financial Health (Top 5 Active Projects by Price)
        const health = projects
           .sort((a: any, b: any) => parseFloat(b.total_price) - parseFloat(a.total_price))
           .slice(0, 5)
           .map((p: any) => {
              const totalPrice = parseFloat(p.total_price || 0);
              const advance = parseFloat(p.advance_payment || 0);
              const installments = (p.payments || [])
                 .filter((pay: any) => pay.status === 'PAID')
                 .reduce((sum: number, pay: any) => sum + parseFloat(pay.amount), 0);
              const collected = advance + installments;
              return {
                 name: p.title.substring(0, 15) + (p.title.length > 15 ? "..." : ""),
                 Expected: totalPrice,
                 Collected: collected,
                 Pending: totalPrice - collected
              };
           });
        setFinancialHealth(health);

        // 4. Demographics
        const demoMap: Record<string, number> = {};
        students.forEach((s: any) => {
           const college = s.college_name || "Unknown";
           demoMap[college] = (demoMap[college] || 0) + 1;
        });
        setDemographics(Object.entries(demoMap).map(([name, value]) => ({ name, value })));

      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <div className="flex flex-col mb-8 border-b pb-6">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-sm">Actionable insights into your platform's performance, revenue, and active demographics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Revenue Area Chart */}
        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Revenue Over Time
             </CardTitle>
             <CardDescription>Monthly collected revenue across all projects</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {revenueData.length === 0 ? (
               <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No revenue data available</div>
            ) : (
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="month" tick={{fontSize: 12}} stroke="#888888" tickMargin={10} />
                   <YAxis tickFormatter={(val) => `₹${val}`} tick={{fontSize: 12}} stroke="#888888" />
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                   <Tooltip 
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   />
                   <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                 </AreaChart>
               </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Project Status Pie Chart */}
        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                Project Pipeline
             </CardTitle>
             <CardDescription>Distribution of active projects by their current phase</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
             {statusData.length === 0 ? (
               <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No projects available</div>
            ) : (
               <ResponsiveContainer width="100%" height="100%">
                 <RechartsPieChart>
                   <Pie
                     data={statusData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={100}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {statusData.map((_, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   />
                   <Legend verticalAlign="bottom" height={36} iconType="circle" />
                 </RechartsPieChart>
               </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
         {/* Financial Health Bar Chart */}
         <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-primary" />
                Financial Health (Top Projects)
             </CardTitle>
             <CardDescription>Expected vs Collected Revenue for highest value projects</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
             {financialHealth.length === 0 ? (
               <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No financial data available</div>
            ) : (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={financialHealth} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                   <XAxis dataKey="name" tick={{fontSize: 11}} stroke="#888888" tickMargin={10} />
                   <YAxis tickFormatter={(val) => `₹${val}`} tick={{fontSize: 12}} stroke="#888888" />
                   <Tooltip 
                      formatter={(value: number) => `₹${value.toLocaleString()}`}
                      cursor={{fill: '#f3f4f6'}}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   />
                   <Legend verticalAlign="top" height={36} iconType="circle" />
                   <Bar dataKey="Collected" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                   <Bar dataKey="Pending" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Demographics Bar Chart */}
        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Student Demographics
             </CardTitle>
             <CardDescription>Number of registered students per university/college</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
             {demographics.length === 0 ? (
               <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No student data available</div>
            ) : (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={demographics} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                   <XAxis type="number" tick={{fontSize: 12}} stroke="#888888" />
                   <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11}} stroke="#888888" />
                   <Tooltip 
                      cursor={{fill: '#f3f4f6'}}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   />
                   <Bar dataKey="value" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={20} name="Students" />
                 </BarChart>
               </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
