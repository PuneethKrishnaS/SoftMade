import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Package, FileText, Loader2, Download, Users, Edit, GraduationCap, Building, Code, Calendar, ExternalLink, GitGraph, CreditCard, Plus, Activity, Trash2, FileOutput } from "lucide-react";
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const pdfStyles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica' },
  header: { fontSize: 20, marginBottom: 20, color: '#333' },
  text: { fontSize: 10, marginBottom: 5, color: '#555' },
  table: { display: "flex", width: "auto", borderStyle: "solid", borderWidth: 1, borderColor: '#bfbfbf', borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { margin: "auto", flexDirection: "row" },
  tableColHeader: { width: "16.6%", borderStyle: "solid", borderWidth: 1, borderColor: '#bfbfbf', borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f0f0f0' },
  tableCol: { width: "16.6%", borderStyle: "solid", borderWidth: 1, borderColor: '#bfbfbf', borderLeftWidth: 0, borderTopWidth: 0 },
  tableCellHeader: { margin: 5, fontSize: 8, fontWeight: 'bold' },
  tableCell: { margin: 5, fontSize: 8 }
});

const ReceiptDocument = ({ project, totalPrice, advancePaid, totalCollected, remainingBalance }: any) => (
  <Document>
    <Page style={pdfStyles.page}>
      <Text style={pdfStyles.header}>Payment Receipt</Text>
      <Text style={pdfStyles.text}>Project: {project.title}</Text>
      <Text style={pdfStyles.text}>Total Price: INR {totalPrice}</Text>
      <Text style={pdfStyles.text}>Advance Paid: INR {advancePaid}</Text>
      <Text style={pdfStyles.text}>Total Collected: INR {totalCollected}</Text>
      <Text style={pdfStyles.text}>Remaining Balance: INR {remainingBalance}</Text>
      <Text style={pdfStyles.text}>Generated On: {new Date().toLocaleDateString()}</Text>
      
      <View style={{ ...pdfStyles.table, marginTop: 20 }}>
        <View style={pdfStyles.tableRow}>
          <View style={pdfStyles.tableColHeader}><Text style={pdfStyles.tableCellHeader}>Description</Text></View>
          <View style={pdfStyles.tableColHeader}><Text style={pdfStyles.tableCellHeader}>Amount (INR)</Text></View>
          <View style={pdfStyles.tableColHeader}><Text style={pdfStyles.tableCellHeader}>Due Date</Text></View>
          <View style={pdfStyles.tableColHeader}><Text style={pdfStyles.tableCellHeader}>Paid Date</Text></View>
          <View style={pdfStyles.tableColHeader}><Text style={pdfStyles.tableCellHeader}>Txn ID</Text></View>
          <View style={pdfStyles.tableColHeader}><Text style={pdfStyles.tableCellHeader}>Status</Text></View>
        </View>
        {(project.payments || []).map((p: any, i: number) => (
          <View style={pdfStyles.tableRow} key={i}>
            <View style={pdfStyles.tableCol}><Text style={pdfStyles.tableCell}>{p.description || "-"}</Text></View>
            <View style={pdfStyles.tableCol}><Text style={pdfStyles.tableCell}>{parseFloat(p.amount).toFixed(2)}</Text></View>
            <View style={pdfStyles.tableCol}><Text style={pdfStyles.tableCell}>{p.due_date || "-"}</Text></View>
            <View style={pdfStyles.tableCol}><Text style={pdfStyles.tableCell}>{p.paid_date || "-"}</Text></View>
            <View style={pdfStyles.tableCol}><Text style={pdfStyles.tableCell}>{p.transaction_id || "-"}</Text></View>
            <View style={pdfStyles.tableCol}><Text style={pdfStyles.tableCell}>{p.status}</Text></View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const PIPELINE_PHASES = [
  'REQUIREMENT', 'TOPIC', 'SYNOPSIS', 'DESIGN', 'FRONTEND', 
  'BACKEND', 'DATABASE', 'TESTING', 'REPORT', 'DEPLOYMENT', 'DELIVERED'
];

export default function ProjectDetails() {
   const { id } = useParams();
   const [project, setProject] = useState<any>(null);
   const [releases, setReleases] = useState<any[]>([]);
   const [documents, setDocuments] = useState<any[]>([]);
   const [readmeContent, setReadmeContent] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [isGithubLoading, setIsGithubLoading] = useState(false);

   // Edit Form State
   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
   const [isSaving, setIsSaving] = useState(false);
   const [editData, setEditData] = useState<any>({});
   const [groups, setGroups] = useState<any[]>([]);
   const [developers, setDevelopers] = useState<any[]>([]);

   // Payment Form State
   const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
   const [isPaymentSaving, setIsPaymentSaving] = useState(false);
   const today = new Date().toISOString().split('T')[0];
   const [paymentData, setPaymentData] = useState({ amount: '', description: 'Payment', status: 'PAID', due_date: today, paid_date: today, transaction_id: '' });

   const [isAddingStudent, setIsAddingStudent] = useState(false);
   const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

   const fetchProject = async () => {
      try {
         const res = await api.get(`projects/${id}/`);
         setProject(res.data);
         setEditData({
            title: res.data.title,
            description: res.data.description,
            category: res.data.category,
            technology: res.data.technology,
            status: res.data.status,
            start_date: res.data.start_date || '',
            deadline: res.data.deadline || '',
            github_repo: res.data.github_repo || '',
            progress_percentage: res.data.progress_percentage || 0,
            assigned_developer_id: res.data.assigned_developer?.id || '',
            total_price: res.data.total_price || 0,
            advance_payment: res.data.advance_payment || 0,
         });

         // Assuming backend has an endpoint for users or we can just leave it as text for now if no endpoint exists, but let's try fetching users
         api.get('students/').then(d => setDevelopers(d.data)).catch(console.error); // We might need a users endpoint for developers.

         if (res.data.github_repo) {
            setIsGithubLoading(true);
            try {
               const [relRes, docRes, readmeRes] = await Promise.all([
                  api.get(`projects/${id}/github_releases/`).catch(() => ({ data: [] })),
                  api.get(`projects/${id}/github_documents/`).catch(() => ({ data: [] })),
                  api.get(`projects/${id}/github_readme/`).catch(() => ({ data: { content: null } }))
               ]);
               setReleases(relRes.data);
               setDocuments(docRes.data);
               setReadmeContent(readmeRes.data.content);
            } catch (ghErr) {
               console.error("Failed to fetch github data", ghErr);
            } finally {
               setIsGithubLoading(false);
            }
         }
      } catch (err) {
         console.error("Failed to fetch project details", err);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      fetchProject();
   }, [id]);

   const handleEditSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      try {
         // Sanitize data: empty strings for dates must be null for Django
         const payload = {
            ...editData,
            start_date: editData.start_date || null,
            deadline: editData.deadline || null,
            assigned_developer: editData.assigned_developer_id || null,
         };
         await api.patch(`projects/${id}/`, payload);
         setIsEditDialogOpen(false);
         await fetchProject();
      } catch (err: any) {
         console.error("Failed to update project", err.response?.data || err.message);
         alert("Failed to update project: " + JSON.stringify(err.response?.data || {}));
      } finally {
         setIsSaving(false);
      }
   };

   const handlePaymentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      const amountToPay = parseFloat(paymentData.amount);
      if (amountToPay > remainingBalance) {
         alert(`Payment amount (₹${amountToPay}) cannot exceed the remaining balance (₹${remainingBalance}).`);
         return;
      }

      setIsPaymentSaving(true);
      try {
         const payload = {
            ...paymentData,
            project: id,
            due_date: paymentData.due_date || null,
            paid_date: paymentData.paid_date || null,
         };
         await api.post(`payments/`, payload);
         setIsPaymentDialogOpen(false);
         setPaymentData({ amount: '', description: 'Payment', status: 'PAID', due_date: today, paid_date: today, transaction_id: '' });
         await fetchProject();
      } catch (err: any) {
         console.error("Failed to create payment", err.response?.data || err.message);
         alert("Failed to create payment: " + JSON.stringify(err.response?.data || {}));
      } finally {
         setIsPaymentSaving(false);
      }
   };

   const handleDeletePayment = async (paymentId: number) => {
      if (!confirm("Are you sure you want to delete this payment?")) return;
      try {
         await api.delete(`payments/${paymentId}/`);
         await fetchProject();
      } catch (err) {
         console.error("Failed to delete payment", err);
         alert("Failed to delete payment.");
      }
   };

   const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsAddingStudent(true);
      const usn = new FormData(e.currentTarget).get('usn');
      try {
         await api.post(`projects/${id}/add_student/`, { usn });
         setIsAddStudentOpen(false);
         await fetchProject();
      } catch (err: any) {
         alert("Failed to add student: " + (err.response?.data?.error || err.response?.data?.detail || "Unknown error"));
      } finally {
         setIsAddingStudent(false);
      }
   };

   const handleDownloadReceipt = async () => {
      if (!project) return;
      try {
         const blob = await pdf(
            <ReceiptDocument 
               project={project} 
               totalPrice={totalPrice} 
               advancePaid={advancePaid} 
               totalCollected={totalCollected} 
               remainingBalance={remainingBalance} 
            />
         ).toBlob();
         
         const url = URL.createObjectURL(blob);
         const link = document.createElement('a');
         link.href = url;
         link.download = `${project.title.replace(/\s+/g, '_')}_Payment_Receipt.pdf`;
         link.click();
         URL.revokeObjectURL(url);
      } catch (err) {
         console.error("Failed to generate PDF", err);
         alert("Failed to generate PDF. Make sure @react-pdf/renderer is installed.");
      }
   };

   if (isLoading) {
      const PIPELINE_PHASES = ['REQUIREMENT', 'TOPIC', 'SYNOPSIS', 'DESIGN', 'FRONTEND', 'BACKEND', 'DATABASE', 'TESTING', 'REPORT', 'DEPLOYMENT', 'DELIVERED'];
   const currentPhaseIndex = PIPELINE_PHASES.indexOf(project?.status);

   return (
         <div className="flex items-center justify-center min-h-[500px]">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
         </div>
      );
   }

   if (!project) return <div>Project not found</div>;

   const totalPaidFromInstallments = project?.payments?.filter((p:any) => p.status === 'PAID').reduce((s:number, p:any) => s + parseFloat(p.amount), 0) || 0;
   const advancePaid = parseFloat(project?.advance_payment) || 0;
   const totalPrice = parseFloat(project?.total_price) || 0;
   const totalCollected = advancePaid + totalPaidFromInstallments;
   const remainingBalance = Math.max(0, totalPrice - totalCollected);
   const paymentStatus = remainingBalance <= 0 && totalPrice > 0 ? "Fully Paid" : (totalCollected > 0 ? "Partially Paid" : "Unpaid");

   const currentPhaseIndex = PIPELINE_PHASES.indexOf(project.status);

   return (
      <div className="max-w-8xl mx-auto px-4 md:px-8 animate-in fade-in duration-300 font-sans text-foreground">

         {/* Breadcrumb */}
         <div className="mb-6">
            <Link to="/admin/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
               <ArrowLeft className="w-4 h-4" /> Projects
            </Link>
         </div>

         {/* Hero Section */}
         <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
            <div className="flex-1">
               <div className="flex items-center gap-3 mb-3">
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold text-primary border-primary/20 bg-primary/5">
                     {project.category || "Uncategorized"}
                  </Badge>
               </div>
               <h1 className="text-4xl font-bold tracking-tight mb-2 text-foreground">
                  {project.title}
               </h1>
               <div className="flex items-center gap-2 mt-4 flex-wrap">
                  {project.technology?.split(',').map((tech: string, i: number) => (
                     <Badge key={i} variant="secondary" className="font-normal text-[10px] bg-secondary/50">
                        {tech.trim()}
                     </Badge>
                  ))}
               </div>
            </div>
            
            <div>
               <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                     <Button variant="outline" size="sm" className="h-9 gap-2 shadow-sm rounded-md">
                        <Edit className="w-4 h-4" /> Edit Project
                     </Button>
                  </DialogTrigger>
                        <DialogTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-6 w-6 ml-2 text-muted-foreground hover:text-foreground">
                              <Edit className="w-3.5 h-3.5" />
                           </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                           <DialogHeader>
                              <DialogTitle className="text-xl">Edit Project</DialogTitle>
                           </DialogHeader>
                           <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium">Project Title</label>
                                    <Input value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} required className="rounded-md" />
                                 </div>
                                 <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <textarea
                                       className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                       value={editData.description}
                                       onChange={e => setEditData({ ...editData, description: e.target.value })}
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <Input value={editData.category} onChange={e => setEditData({ ...editData, category: e.target.value })} required className="rounded-md" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium">Tech Stack</label>
                                    <Input value={editData.technology} onChange={e => setEditData({ ...editData, technology: e.target.value })} className="rounded-md" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    <Select value={editData.status} onValueChange={(v) => setEditData({ ...editData, status: v })}>
                                       <SelectTrigger className="rounded-md"><SelectValue /></SelectTrigger>
                                       <SelectContent>
                                          <SelectItem value="REQUIREMENT">Requirement Collection</SelectItem>
                                          <SelectItem value="TOPIC">Topic Finalization</SelectItem>
                                          <SelectItem value="SYNOPSIS">Synopsis Preparation</SelectItem>
                                          <SelectItem value="DESIGN">UI/UX Design</SelectItem>
                                          <SelectItem value="FRONTEND">Frontend Development</SelectItem>
                                          <SelectItem value="BACKEND">Backend Development</SelectItem>
                                          <SelectItem value="DATABASE">Database Integration</SelectItem>
                                          <SelectItem value="TESTING">Testing Phase</SelectItem>
                                          <SelectItem value="REPORT">Report Preparation</SelectItem>
                                          <SelectItem value="DEPLOYMENT">Deployment</SelectItem>
                                          <SelectItem value="DELIVERED">Final Delivery</SelectItem>
                                       </SelectContent>
                                    </Select>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium">Start Date</label>
                                    <Input type="date" value={editData.start_date} onChange={e => setEditData({ ...editData, start_date: e.target.value })} className="rounded-md" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium">Deadline</label>
                                    <Input type="date" value={editData.deadline} onChange={e => setEditData({ ...editData, deadline: e.target.value })} className="rounded-md" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium">Developer ID</label>
                                    <Input type="number" placeholder="Enter Developer User ID" value={editData.assigned_developer_id} onChange={e => setEditData({...editData, assigned_developer_id: e.target.value})} className="rounded-md" />
                                    <p className="text-xs text-muted-foreground mt-1">Leave empty if unassigned.</p>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium">Total Price</label>
                                    <Input type="number" value={editData.total_price} onChange={e => setEditData({...editData, total_price: parseFloat(e.target.value)})} className="rounded-md" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium">Advance Payment</label>
                                    <Input type="number" value={editData.advance_payment} onChange={e => setEditData({...editData, advance_payment: parseFloat(e.target.value)})} className="rounded-md" />
                                 </div>
                                 <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium flex justify-between">
                                       Progress Percentage <span>{editData.progress_percentage}%</span>
                                    </label>
                                    <Input type="range" min="0" max="100" value={editData.progress_percentage} onChange={e => setEditData({ ...editData, progress_percentage: parseInt(e.target.value) })} className="w-full accent-primary" />
                                 </div>
                                 <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium">GitHub Repository</label>
                                    <Input placeholder="owner/repo" value={editData.github_repo} onChange={e => setEditData({...editData, github_repo: e.target.value})} className="rounded-md" />
                                    <p className="text-xs text-muted-foreground mt-1">Example: PuneethKrishnaS/SoftMade</p>
                                 </div>
                              </div>
                              <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                                 <Button type="button" variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="rounded-md">Cancel</Button>
                                 <Button type="submit" disabled={isSaving} className="rounded-md bg-foreground text-background hover:bg-foreground/90">{isSaving ? "Saving..." : "Save Changes"}</Button>
                              </div>
                           </form>
                        </DialogContent>
                     </Dialog>
                  <p className="text-muted-foreground leading-relaxed max-w-2xl mt-4">{project.description}</p>
            </div>
         </div>

         {/* Visual Pipeline Stepper */}
         <div className="mb-10 w-full overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex items-center min-w-max px-2">
               {PIPELINE_PHASES.map((phase, index) => {
                  const isCompleted = currentPhaseIndex > index;
                  const isCurrent = currentPhaseIndex === index;
                  
                  return (
                     <div key={phase} className="flex items-center">
                        <div className={`flex flex-col items-center gap-2 relative z-10 w-24`}>
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                              isCompleted ? 'bg-primary text-primary-foreground' : 
                              isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-600/20' : 
                              'bg-muted text-muted-foreground'
                           }`}>
                              {index + 1}
                           </div>
                           <span className={`text-[10px] uppercase font-semibold text-center tracking-wider ${
                              isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'
                           }`}>
                              {phase.replace('_', ' ')}
                           </span>
                        </div>
                        {index < PIPELINE_PHASES.length - 1 && (
                           <div className={`w-12 h-1 -mx-4 z-0 rounded-full transition-colors ${
                              isCompleted ? 'bg-primary' : 'bg-muted'
                           }`} />
                        )}
                     </div>
                  );
               })}
            </div>
         </div>

         {/* Split Dashboard Layout */}
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Main Content (Tabs) */}
            <div className="xl:col-span-2 space-y-6">

                     {/* Content Tabs */}
         <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start flex-wrap rounded-none h-auto bg-transparent p-0 border-b border-border gap-x-6 gap-y-2 mb-8">
               <TabsTrigger value="overview" className="rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 gap-2 font-medium">
                  Overview
               </TabsTrigger>
               <TabsTrigger value="documents" className="rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 gap-2 font-medium">
                  Documents
               </TabsTrigger>
               <TabsTrigger value="releases" className="rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 gap-2 font-medium">
                  Releases
               </TabsTrigger>
               <TabsTrigger value="group" className="rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 gap-2 font-medium">
                  Team
               </TabsTrigger>
               <TabsTrigger value="payments" className="rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 gap-2 font-medium">
                  Payments
               </TabsTrigger>
            </TabsList>

            {/* Tab: Overview (README) */}
            <TabsContent value="overview" className="space-y-4">
               {!project.github_repo ? (
                  <p className="text-sm text-muted-foreground">No GitHub repository linked to this project.</p>
               ) : isGithubLoading ? (
                  <div className="flex items-center justify-center p-12">
                     <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
               ) : readmeContent ? (
                  <div className="border border-border rounded-md p-6 bg-card text-card-foreground markdown-content space-y-4 [&>h1]:text-3xl [&>h1]:font-bold [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mt-6 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-4 [&>p]:text-muted-foreground [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&>ul]:text-muted-foreground [&>ol]:list-decimal [&>ol]:pl-5 [&>pre]:bg-muted [&>pre]:p-4 [&>pre]:rounded-md [&>pre]:overflow-x-auto [&>code]:bg-muted [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded-sm [&>code]:text-sm [&>a]:text-primary [&>a]:underline [&>blockquote]:border-l-4 [&>blockquote]:border-muted-foreground/50 [&>blockquote]:pl-4 [&>blockquote]:italic">
                     <ReactMarkdown remarkPlugins={[remarkGfm]}>{readmeContent}</ReactMarkdown>
                  </div>
               ) : (
                  <p className="text-sm text-muted-foreground">No README.md found in the repository.</p>
               )}
            </TabsContent>

            {/* Tab: Documents */}
            <TabsContent value="documents" className="space-y-4">
               {!project.github_repo ? (
                  <p className="text-sm text-muted-foreground">No GitHub repository linked. Cannot fetch documents.</p>
               ) : isGithubLoading ? (
                  <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Fetching...</p>
               ) : documents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No documents found in the repository.</p>
               ) : (
                  <div className="space-y-2">
                     {documents.map((doc: any) => (
                        <a key={doc.path} href={doc.download_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 rounded-md border border-border bg-card hover:bg-muted/50 transition-colors group">
                           <div className="bg-primary/10 p-2 rounded-md">
                              <FileOutput className="w-5 h-5 text-primary" />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-sm font-semibold capitalize">{doc.name.replace('.pdf', '').replace(/-/g, ' ')}</span>
                              <span className="text-xs text-muted-foreground">{doc.path} • {(doc.size / 1024).toFixed(1)} KB</span>
                           </div>
                           <Download className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                     ))}
                  </div>
               )}
            </TabsContent>

            {/* Tab: Releases */}
            <TabsContent value="releases" className="space-y-4">
               {!project.github_repo ? (
                  <p className="text-sm text-muted-foreground">No GitHub repository linked. Cannot fetch releases.</p>
               ) : isGithubLoading ? (
                  <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Fetching...</p>
               ) : releases.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No releases found in the repository.</p>
               ) : (
                  <div className="space-y-6">
                     {releases.map((release) => (
                        <div key={release.id} className="border border-border rounded-md p-5">
                           <div className="flex items-center justify-between mb-4">
                              <h3 className="font-semibold">{release.name}</h3>
                              <span className="text-xs text-muted-foreground">{new Date(release.published_at).toLocaleDateString()}</span>
                           </div>
                           <div className="space-y-2">
                              {release.assets.map((asset: any) => (
                                 <div key={asset.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-md text-sm">
                                    <div className="flex items-center gap-2">
                                       <Package className="w-4 h-4 text-muted-foreground" /> {asset.name}
                                    </div>
                                    <a href={asset.download_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                                       <Download className="w-4 h-4" />
                                    </a>
                                 </div>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </TabsContent>

            {/* Tab: Group */}
            <TabsContent value="group" className="space-y-8">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Project Team Members</h3>

                  <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
                     <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-md gap-2 h-8 text-xs">
                           <Plus className="w-3.5 h-3.5" /> Add Student
                        </Button>
                     </DialogTrigger>
                     <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                           <DialogTitle className="text-xl">Add Student to Project</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddStudent} className="space-y-4 pt-4">
                           <div className="space-y-2">
                              <label className="text-sm font-medium">Student USN</label>
                              <Input name="usn" required className="rounded-md" placeholder="Enter student USN" />
                           </div>
                           <div className="flex justify-end gap-3 pt-4 border-t">
                              <Button type="button" variant="ghost" onClick={() => setIsAddStudentOpen(false)} className="rounded-md">Cancel</Button>
                              <Button type="submit" disabled={isAddingStudent} className="rounded-md">{isAddingStudent ? "Adding..." : "Add"}</Button>
                           </div>
                        </form>
                     </DialogContent>
                  </Dialog>
               </div>

               <div className="border border-border rounded-md overflow-hidden">
                  <div className="divide-y divide-border">
                     {project.students && project.students.length > 0 ? (
                        project.students.map((student: any) => (
                           <div key={student.usn} className="flex items-center justify-between p-4 bg-background text-sm">
                              <div>
                                 <p className="font-medium text-foreground">{student.user?.first_name || student.user?.username || student.usn}</p>
                                 <p className="text-xs text-muted-foreground">{student.usn}</p>
                              </div>
                              <div className="text-right text-muted-foreground text-xs">
                                 <p>{student.user?.email || 'No email'}</p>
                                 <p>{student.phone || 'No phone'}</p>
                              </div>
                           </div>
                        ))
                     ) : (
                        <div className="p-8 text-center text-muted-foreground text-sm">No students assigned to this project.</div>
                     )}
                  </div>
               </div>
            </TabsContent>

            {/* Tab: Payments */}
            <TabsContent value="payments" className="space-y-6">
               {/* Financial Summary */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="border border-border rounded-md p-4 bg-muted/20">
                     <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Price</p>
                     <p className="text-2xl font-semibold">₹{totalPrice}</p>
                  </div>
                  <div className="border border-border rounded-md p-4 bg-muted/20">
                     <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Advance Paid</p>
                     <p className="text-2xl font-semibold text-emerald-600">₹{advancePaid}</p>
                  </div>
                  <div className="border border-border rounded-md p-4 bg-muted/20">
                     <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Payments Collected</p>
                     <p className="text-2xl font-semibold text-emerald-600">
                        ₹{totalPaidFromInstallments}
                     </p>
                  </div>
                  <div className="border border-border rounded-md p-4 bg-muted/20">
                     <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Remaining Balance</p>
                     <p className="text-2xl font-semibold text-destructive">
                        ₹{remainingBalance}
                     </p>
                  </div>
               </div>

               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Invoices & Payments</h3>

                  <div className="flex gap-3">
                     <Button variant="secondary" size="sm" onClick={handleDownloadReceipt} className="rounded-md gap-2 h-8 text-xs">
                        <Download className="w-3.5 h-3.5" /> Download Receipt
                     </Button>

                     <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                        <DialogTrigger asChild>
                           <Button 
                              variant="default" 
                              size="sm" 
                              disabled={remainingBalance <= 0}
                              className="rounded-md gap-2 h-8 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                              title={remainingBalance <= 0 ? "Project is fully paid" : ""}
                           >
                              <Plus className="w-3.5 h-3.5" /> Record Payment
                           </Button>
                        </DialogTrigger>
                     <DialogContent className="sm:max-w-[420px]">
                        <DialogHeader>
                           <DialogTitle className="text-xl">Record Payment</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handlePaymentSubmit} className="space-y-4 pt-4">
                           <div className="space-y-2">
                              <label className="text-sm font-medium">Amount</label>
                              <div className="flex gap-2">
                                 <Input 
                                    type="number" 
                                    step="0.01" 
                                    max={remainingBalance > 0 ? remainingBalance : undefined} 
                                    value={paymentData.amount} 
                                    onChange={e => setPaymentData({ ...paymentData, amount: e.target.value })} 
                                    required 
                                    className="rounded-md flex-1" 
                                 />
                                 <Button 
                                    type="button" 
                                    variant="secondary" 
                                    className="px-3 rounded-md"
                                    onClick={() => {
                                       setPaymentData({ ...paymentData, amount: String(remainingBalance) });
                                    }}
                                 >
                                    Full
                                 </Button>
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-sm font-medium">Status</label>
                              <Select value={paymentData.status} onValueChange={(v) => setPaymentData({ ...paymentData, status: v })}>
                                 <SelectTrigger className="rounded-md"><SelectValue /></SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="PAID">Paid</SelectItem>
                                    <SelectItem value="OVERDUE">Overdue</SelectItem>
                                    <SelectItem value="FAILED">Failed</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-sm font-medium">Due Date</label>
                                 <Input type="date" value={paymentData.due_date} onChange={e => setPaymentData({ ...paymentData, due_date: e.target.value })} className="rounded-md" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-sm font-medium">Paid Date</label>
                                 <Input type="date" value={paymentData.paid_date} onChange={e => setPaymentData({ ...paymentData, paid_date: e.target.value })} className="rounded-md" />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-sm font-medium">Transaction ID</label>
                              <Input placeholder="e.g. UPI Ref / Receipt No" value={paymentData.transaction_id} onChange={e => setPaymentData({ ...paymentData, transaction_id: e.target.value })} className="rounded-md" />
                           </div>
                           <div className="flex justify-end gap-3 pt-4 border-t">
                              <Button type="button" variant="ghost" onClick={() => setIsPaymentDialogOpen(false)} className="rounded-md">Cancel</Button>
                              <Button type="submit" disabled={isPaymentSaving} className="rounded-md">{isPaymentSaving ? "Saving..." : "Save"}</Button>
                           </div>
                        </form>
                     </DialogContent>
                  </Dialog>
                  </div>
               </div>

               {project.payments && project.payments.length > 0 ? (
                  <div className="border border-border rounded-md overflow-hidden">
                     <div className="grid grid-cols-12 gap-4 p-3 border-b bg-muted/30 text-xs font-semibold text-muted-foreground uppercase">
                        <div className="col-span-3">Description</div>
                        <div className="col-span-2">Amount</div>
                        <div className="col-span-2">Due Date</div>
                        <div className="col-span-2">Paid Date</div>
                        <div className="col-span-2">Txn ID</div>
                        <div className="col-span-2 text-right">Status</div>
                     </div>
                     <div className="divide-y divide-border">
                        {project.payments.map((payment: any) => (
                           <div key={payment.id} className="grid grid-cols-12 gap-4 p-3 text-sm items-center hover:bg-muted/30 transition-colors group">
                              <div className="col-span-3 flex items-center gap-2 truncate">
                                 <CreditCard className="w-4 h-4 text-muted-foreground shrink-0" />
                                 {payment.description}
                              </div>
                              <div className="col-span-2 font-medium">
                                 ₹{parseFloat(payment.amount).toFixed(2)}
                              </div>
                              <div className="col-span-2 text-muted-foreground text-xs">
                                 {payment.due_date || '-'}
                              </div>
                              <div className="col-span-2 text-muted-foreground text-xs">
                                 {payment.paid_date || '-'}
                              </div>
                              <div className="col-span-2 text-muted-foreground text-xs truncate" title={payment.transaction_id}>
                                 {payment.transaction_id || '-'}
                              </div>
                              <div className="col-span-1 text-right flex items-center justify-end gap-2">
                                 <Badge variant="secondary" className={`rounded-sm text-[10px] font-normal uppercase border-transparent ${payment.status === 'PAID' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                                    {payment.status}
                                 </Badge>
                                 <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" 
                                    onClick={() => handleDeletePayment(payment.id)}
                                    title="Delete payment"
                                 >
                                    <Trash2 className="w-3 h-3" />
                                 </Button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               ) : (
                  <p className="text-sm text-muted-foreground border rounded-md p-8 text-center bg-muted/10">No payments recorded yet.</p>
               )}
            </TabsContent>

         </Tabs>
         </div>

         {/* Right Sidebar (Metadata Cards) */}
         <div className="space-y-6">
            
            {/* Financial Health Card */}
            <div className="border border-border rounded-xl bg-card p-5 shadow-sm">
               <h3 className="font-semibold flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <CreditCard className="w-4 h-4" /> Financial Health
               </h3>
               
               <div className="flex justify-between items-end mb-2">
                  <span className="text-3xl font-bold tracking-tight">₹{totalPrice.toLocaleString()}</span>
                  <Badge variant="outline" className={`rounded-sm font-normal text-[10px] uppercase border-transparent ${remainingBalance <= 0 && totalPrice > 0 ? 'bg-emerald-100 text-emerald-800' : (totalCollected > 0 ? 'bg-blue-100 text-blue-800' : 'bg-muted text-muted-foreground')}`}>
                     {paymentStatus}
                  </Badge>
               </div>
               
               <div className="mt-5 space-y-2">
                  <div className="flex justify-between text-xs">
                     <span className="text-muted-foreground">Collected</span>
                     <span className="font-medium text-emerald-600">₹{totalCollected.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                     <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${totalPrice > 0 ? Math.min((totalCollected / totalPrice) * 100, 100) : 0}%` }} />
                  </div>
               </div>

               <div className="mt-4 pt-4 border-t flex justify-between text-xs">
                  <span className="text-muted-foreground">Pending Balance</span>
                  <span className="font-medium text-destructive">₹{remainingBalance.toLocaleString()}</span>
               </div>
            </div>

            {/* Timeline Card */}
            <div className="border border-border rounded-xl bg-card p-5 shadow-sm">
               <h3 className="font-semibold flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" /> Project Timeline
               </h3>
               <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-muted-foreground">Start Date</span>
                     <span className="font-medium">{project.start_date || 'TBD'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-muted-foreground">Deadline</span>
                     <span className="font-medium">{project.deadline || 'TBD'}</span>
                  </div>
                  <div className="pt-3 border-t">
                     <span className="text-xs text-muted-foreground flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5" /> Progress Tracker
                     </span>
                     <div className="flex items-center gap-3 mt-2">
                        <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                           <div className="bg-primary h-1.5 rounded-full" style={{ width: `${project.progress_percentage || 0}%` }} />
                        </div>
                        <span className="text-xs font-medium">{project.progress_percentage}%</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Developer & Links Card */}
            <div className="border border-border rounded-xl bg-card p-5 shadow-sm">
               <h3 className="font-semibold flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" /> Team & Links
               </h3>
               
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                        {project.assigned_developer?.username ? project.assigned_developer.username.substring(0,2) : '?'}
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{project.assigned_developer?.username || 'Unassigned'}</p>
                        <p className="text-xs text-muted-foreground">Assigned Developer</p>
                     </div>
                  </div>

                  {project.github_repo && (
                     <div className="pt-4 border-t">
                        <a href={`https://github.com/${project.github_repo}`} target="_blank" rel="noreferrer" className="flex items-center justify-between group">
                           <div className="flex items-center gap-2">
                              <GitGraph className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium group-hover:underline underline-offset-4">GitHub Repository</span>
                           </div>
                           <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                        </a>
                        <p className="text-xs text-muted-foreground ml-6 mt-1 truncate">{project.github_repo}</p>
                     </div>
                  )}
               </div>
            </div>

         </div>
         </div>

      </div>
   );
}
