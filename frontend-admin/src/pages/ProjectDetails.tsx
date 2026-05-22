import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Package, FileText, Loader2, Download, Users, Edit, GraduationCap, Building, Code, Calendar, ExternalLink, GitGraph, CreditCard, Plus } from "lucide-react";

export default function ProjectDetails() {
   const { id } = useParams();
   const [project, setProject] = useState<any>(null);
   const [releases, setReleases] = useState<any[]>([]);
   const [documents, setDocuments] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isGithubLoading, setIsGithubLoading] = useState(false);
   
   // Edit Form State
   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
   const [isSaving, setIsSaving] = useState(false);
   const [editData, setEditData] = useState<any>({});
   
   // Payment Form State
   const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
   const [isPaymentSaving, setIsPaymentSaving] = useState(false);
   const [paymentData, setPaymentData] = useState({ amount: '', description: '', status: 'PENDING', due_date: '' });

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
         });

         if (res.data.github_repo) {
            setIsGithubLoading(true);
            try {
               const [relRes, docRes] = await Promise.all([
                  api.get(`projects/${id}/github_releases/`),
                  api.get(`projects/${id}/github_documents/`)
               ]);
               setReleases(relRes.data);
               setDocuments(docRes.data);
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
         await api.patch(`projects/${id}/`, editData);
         setIsEditDialogOpen(false);
         await fetchProject();
      } catch (err) {
         console.error("Failed to update project", err);
      } finally {
         setIsSaving(false);
      }
   };
   
   const handlePaymentSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsPaymentSaving(true);
      try {
         await api.post(`payments/`, { ...paymentData, project: id });
         setIsPaymentDialogOpen(false);
         setPaymentData({ amount: '', description: '', status: 'PENDING', due_date: '' });
         await fetchProject();
      } catch (err) {
         console.error("Failed to create payment", err);
      } finally {
         setIsPaymentSaving(false);
      }
   };

   if (isLoading) {
      return (
         <div className="flex items-center justify-center min-h-[500px]">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
         </div>
      );
   }

   if (!project) return <div>Project not found</div>;

   return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-300 font-sans text-foreground">
         
         {/* Breadcrumb */}
         <div className="mb-6">
            <Link to="/admin/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
               <ArrowLeft className="w-4 h-4" /> Projects
            </Link>
         </div>

         {/* Header */}
         <div className="mb-8 border-b border-border pb-8">
            <div className="flex items-start justify-between">
               <div>
                  <h1 className="text-4xl font-bold tracking-tight mb-3 flex items-center gap-3">
                     <FileText className="w-8 h-8 text-muted-foreground" />
                     {project.title}
                     
                     <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
                                    <Input value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} required className="rounded-md" />
                                 </div>
                                 <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <textarea 
                                       className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                       value={editData.description} 
                                       onChange={e => setEditData({...editData, description: e.target.value})} 
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <Input value={editData.category} onChange={e => setEditData({...editData, category: e.target.value})} required className="rounded-md" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium">Tech Stack</label>
                                    <Input value={editData.technology} onChange={e => setEditData({...editData, technology: e.target.value})} className="rounded-md" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    <Select value={editData.status} onValueChange={(v) => setEditData({...editData, status: v})}>
                                       <SelectTrigger className="rounded-md"><SelectValue /></SelectTrigger>
                                       <SelectContent>
                                          <SelectItem value="REQUIREMENT">Requirement</SelectItem>
                                          <SelectItem value="DEVELOPMENT">Development</SelectItem>
                                          <SelectItem value="TESTING">Testing</SelectItem>
                                          <SelectItem value="DEPLOYMENT">Deployment</SelectItem>
                                          <SelectItem value="COMPLETED">Completed</SelectItem>
                                          <SelectItem value="DELAYED">Delayed</SelectItem>
                                       </SelectContent>
                                    </Select>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium">Start Date</label>
                                    <Input type="date" value={editData.start_date} onChange={e => setEditData({...editData, start_date: e.target.value})} className="rounded-md" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium">Deadline</label>
                                    <Input type="date" value={editData.deadline} onChange={e => setEditData({...editData, deadline: e.target.value})} className="rounded-md" />
                                 </div>
                                 <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium flex justify-between">
                                      Progress Percentage <span>{editData.progress_percentage}%</span>
                                    </label>
                                    <Input type="range" min="0" max="100" value={editData.progress_percentage} onChange={e => setEditData({...editData, progress_percentage: parseInt(e.target.value)})} className="w-full accent-primary" />
                                 </div>
                                 <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium">GitHub Repository</label>
                                    <Input placeholder="owner/repo" value={editData.github_repo} onChange={e => setEditData({...editData, github_repo: e.target.value})} className="rounded-md" />
                                    <p className="text-xs text-muted-foreground mt-1">Example: PuneethKrishnaS/SoftMade</p>
                                 </div>
                              </div>
                              <div className="flex justify-end gap-3 pt-4 border-t">
                                 <Button type="button" variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="rounded-md">Cancel</Button>
                                 <Button type="submit" disabled={isSaving} className="rounded-md">{isSaving ? "Saving..." : "Save Changes"}</Button>
                              </div>
                           </form>
                        </DialogContent>
                     </Dialog>
                  </h1>
                  <p className="text-muted-foreground leading-relaxed max-w-2xl">{project.description}</p>
               </div>
            </div>

            {/* Notion-style Properties Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm">
               <div className="flex items-start gap-4">
                  <span className="w-32 text-muted-foreground flex items-center gap-2"><Activity className="w-4 h-4" /> Status</span>
                  <Badge variant="secondary" className="rounded-sm bg-muted text-muted-foreground font-normal border-none">
                     {project.status.replace('_', ' ')}
                  </Badge>
               </div>
               <div className="flex items-start gap-4">
                  <span className="w-32 text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4" /> Dates</span>
                  <span className="text-foreground">{project.start_date || 'TBD'} → {project.deadline || 'TBD'}</span>
               </div>
               <div className="flex items-start gap-4">
                  <span className="w-32 text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4" /> Developer</span>
                  <span className="text-foreground">{project.assigned_developer?.username || 'Unassigned'}</span>
               </div>
               <div className="flex items-start gap-4">
                  <span className="w-32 text-muted-foreground flex items-center gap-2"><Code className="w-4 h-4" /> Stack</span>
                  <span className="text-foreground">{project.technology}</span>
               </div>
               <div className="flex items-center gap-4 col-span-1 sm:col-span-2 mt-2">
                  <span className="w-32 text-muted-foreground flex items-center gap-2">Progress</span>
                  <div className="flex-1 max-w-md flex items-center gap-3">
                     <div className="flex-1 bg-muted rounded-full h-1.5">
                        <div className="bg-foreground h-1.5 rounded-full" style={{ width: `${project.progress_percentage || 0}%` }} />
                     </div>
                     <span className="text-xs text-muted-foreground">{project.progress_percentage}%</span>
                  </div>
               </div>
               {project.github_repo && (
                  <div className="flex items-start gap-4 col-span-1 sm:col-span-2 mt-1">
                     <span className="w-32 text-muted-foreground flex items-center gap-2"><GitGraph className="w-4 h-4" /> GitHub</span>
                     <a href={`https://github.com/${project.github_repo}`} target="_blank" rel="noreferrer" className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-all">
                        {project.github_repo}
                     </a>
                  </div>
               )}
            </div>
         </div>

         {/* Content Tabs */}
         <Tabs defaultValue="documents" className="w-full">
            <TabsList className="w-full justify-start rounded-none h-auto bg-transparent p-0 border-b border-border space-x-6 mb-8">
               <TabsTrigger value="documents" className="rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 gap-2 font-medium">
                  Documents
               </TabsTrigger>
               <TabsTrigger value="releases" className="rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 gap-2 font-medium">
                  Releases
               </TabsTrigger>
               <TabsTrigger value="group" className="rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 gap-2 font-medium">
                  Group
               </TabsTrigger>
               <TabsTrigger value="payments" className="rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 gap-2 font-medium">
                  Payments
               </TabsTrigger>
            </TabsList>
            
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
                        <a key={doc.path} href={doc.download_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors group">
                           <FileText className="w-4 h-4 text-muted-foreground" />
                           <span className="text-sm font-medium">{doc.name}</span>
                           <span className="text-xs text-muted-foreground ml-auto">{(doc.size / 1024).toFixed(1)} KB</span>
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
               {project.group ? (
                  <>
                     <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                           <p className="text-muted-foreground mb-1">Group Name</p>
                           <p className="font-medium">{project.group.name}</p>
                        </div>
                        <div>
                           <p className="text-muted-foreground mb-1">College</p>
                           <p className="font-medium">{project.group.college_name}</p>
                        </div>
                        <div>
                           <p className="text-muted-foreground mb-1">Department</p>
                           <p className="font-medium">{project.group.department}</p>
                        </div>
                        <div>
                           <p className="text-muted-foreground mb-1">Semester</p>
                           <p className="font-medium">{project.group.semester}</p>
                        </div>
                     </div>
                     
                     <div className="border-t border-border pt-6">
                        <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Members</h3>
                        <div className="space-y-3">
                           {project.group.members && project.group.members.length > 0 ? (
                              project.group.members.map((member: any) => (
                                 <div key={member.usn} className="flex items-center justify-between p-3 border border-border rounded-md text-sm">
                                    <div>
                                       <p className="font-medium">{member.name}</p>
                                       <p className="text-xs text-muted-foreground">{member.usn}</p>
                                    </div>
                                    <div className="text-right text-muted-foreground text-xs">
                                       <p>{member.email}</p>
                                       <p>{member.phone || 'No phone'}</p>
                                    </div>
                                 </div>
                              ))
                           ) : (
                              <p className="text-sm text-muted-foreground">No members found.</p>
                           )}
                        </div>
                     </div>
                  </>
               ) : (
                  <p className="text-sm text-muted-foreground">No group assigned to this project.</p>
               )}
            </TabsContent>

            {/* Tab: Payments */}
            <TabsContent value="payments" className="space-y-4">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Invoices & Payments</h3>
                  
                  <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                     <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-md gap-2 h-8 text-xs">
                           <Plus className="w-3.5 h-3.5" /> Record Payment
                        </Button>
                     </DialogTrigger>
                     <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                           <DialogTitle className="text-xl">Record Payment</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handlePaymentSubmit} className="space-y-4 pt-4">
                           <div className="space-y-2">
                              <label className="text-sm font-medium">Amount</label>
                              <Input type="number" step="0.01" value={paymentData.amount} onChange={e => setPaymentData({...paymentData, amount: e.target.value})} required className="rounded-md" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-sm font-medium">Description</label>
                              <Input placeholder="e.g. 1st Installment" value={paymentData.description} onChange={e => setPaymentData({...paymentData, description: e.target.value})} required className="rounded-md" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-sm font-medium">Status</label>
                              <Select value={paymentData.status} onValueChange={(v) => setPaymentData({...paymentData, status: v})}>
                                 <SelectTrigger className="rounded-md"><SelectValue /></SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="PAID">Paid</SelectItem>
                                    <SelectItem value="OVERDUE">Overdue</SelectItem>
                                    <SelectItem value="FAILED">Failed</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-sm font-medium">Due Date</label>
                              <Input type="date" value={paymentData.due_date} onChange={e => setPaymentData({...paymentData, due_date: e.target.value})} className="rounded-md" />
                           </div>
                           <div className="flex justify-end gap-3 pt-4 border-t">
                              <Button type="button" variant="ghost" onClick={() => setIsPaymentDialogOpen(false)} className="rounded-md">Cancel</Button>
                              <Button type="submit" disabled={isPaymentSaving} className="rounded-md">{isPaymentSaving ? "Saving..." : "Save"}</Button>
                           </div>
                        </form>
                     </DialogContent>
                  </Dialog>
               </div>
               
               {project.payments && project.payments.length > 0 ? (
                  <div className="border border-border rounded-md overflow-hidden">
                     <div className="grid grid-cols-12 gap-4 p-3 border-b bg-muted/30 text-xs font-semibold text-muted-foreground uppercase">
                        <div className="col-span-5">Description</div>
                        <div className="col-span-3">Amount</div>
                        <div className="col-span-2">Due Date</div>
                        <div className="col-span-2 text-right">Status</div>
                     </div>
                     <div className="divide-y divide-border">
                        {project.payments.map((payment: any) => (
                           <div key={payment.id} className="grid grid-cols-12 gap-4 p-3 text-sm items-center hover:bg-muted/30 transition-colors">
                              <div className="col-span-5 flex items-center gap-2">
                                 <CreditCard className="w-4 h-4 text-muted-foreground" />
                                 {payment.description}
                              </div>
                              <div className="col-span-3 font-medium">
                                 ${parseFloat(payment.amount).toFixed(2)}
                              </div>
                              <div className="col-span-2 text-muted-foreground text-xs">
                                 {payment.due_date || 'N/A'}
                              </div>
                              <div className="col-span-2 text-right">
                                 <Badge variant="secondary" className="rounded-sm text-[10px] font-normal uppercase bg-muted text-muted-foreground border-transparent">
                                    {payment.status}
                                 </Badge>
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
   );
}
