import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Package, FileText, Loader2, Download, ExternalLink, Calendar, Users, Code, Activity, GitGraph, Edit, GraduationCap, Building, Tag, CheckCircle2, Ticket } from "lucide-react";

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

   if (isLoading) {
      return (
         <div className="flex items-center justify-center min-h-[500px]">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
         </div>
      );
   }

   if (!project) return <div>Project not found</div>;

   return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-12">

         {/* 1. Hero Banner */}
         <div className="relative rounded-3xl overflow-hidden shadow-sm border border-border/50 bg-card">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/20 z-0 pointer-events-none" />
            
            <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
               <div className="space-y-4">
                  <Link to="/admin/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                     <ArrowLeft className="w-4 h-4" /> Back to Projects
                  </Link>
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-primary/60 text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
                        <Package className="w-8 h-8" />
                     </div>
                     <div>
                        <div className="flex items-center gap-3">
                           <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{project.title}</h2>
                           
                           {/* Edit Dialog */}
                           <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                              <DialogTrigger asChild>
                                 <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-border/50 bg-background/50 backdrop-blur-sm">
                                    <Edit className="w-4 h-4 text-muted-foreground" />
                                 </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px] rounded-2xl">
                                 <DialogHeader>
                                    <DialogTitle>Edit Project Details</DialogTitle>
                                 </DialogHeader>
                                 <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                       <div className="space-y-2 col-span-2">
                                          <label className="text-sm font-medium">Project Title</label>
                                          <Input value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} required />
                                       </div>
                                       <div className="space-y-2 col-span-2">
                                          <label className="text-sm font-medium">Description</label>
                                          <textarea 
                                             className="w-full min-h-[100px] p-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                             value={editData.description} 
                                             onChange={e => setEditData({...editData, description: e.target.value})} 
                                          />
                                       </div>
                                       <div className="space-y-2">
                                          <label className="text-sm font-medium">Category</label>
                                          <Input value={editData.category} onChange={e => setEditData({...editData, category: e.target.value})} required />
                                       </div>
                                       <div className="space-y-2">
                                          <label className="text-sm font-medium">Tech Stack</label>
                                          <Input value={editData.technology} onChange={e => setEditData({...editData, technology: e.target.value})} />
                                       </div>
                                       <div className="space-y-2">
                                          <label className="text-sm font-medium">Status</label>
                                          <Select value={editData.status} onValueChange={(v) => setEditData({...editData, status: v})}>
                                             <SelectTrigger><SelectValue /></SelectTrigger>
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
                                          <Input type="date" value={editData.start_date} onChange={e => setEditData({...editData, start_date: e.target.value})} />
                                       </div>
                                       <div className="space-y-2">
                                          <label className="text-sm font-medium">Deadline</label>
                                          <Input type="date" value={editData.deadline} onChange={e => setEditData({...editData, deadline: e.target.value})} />
                                       </div>
                                       <div className="space-y-2 col-span-2">
                                          <label className="text-sm font-medium flex justify-between">
                                            Progress Percentage <span>{editData.progress_percentage}%</span>
                                          </label>
                                          <Input type="range" min="0" max="100" value={editData.progress_percentage} onChange={e => setEditData({...editData, progress_percentage: parseInt(e.target.value)})} className="w-full accent-primary" />
                                       </div>
                                       <div className="space-y-2 col-span-2">
                                          <label className="text-sm font-medium">GitHub Repository</label>
                                          <Input placeholder="owner/repo" value={editData.github_repo} onChange={e => setEditData({...editData, github_repo: e.target.value})} />
                                          <p className="text-xs text-muted-foreground mt-1">Example: PuneethKrishnaS/SoftMade. Used for auto-fetching releases and documents.</p>
                                       </div>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4 border-t">
                                       <Button type="button" variant="ghost" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                                       <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</Button>
                                    </div>
                                 </form>
                              </DialogContent>
                           </Dialog>

                        </div>
                        <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
                           {project.description || "No description provided."}
                        </p>
                     </div>
                  </div>
               </div>
               
               {/* Actions in Banner */}
               {project.github_repo && (
                  <Button className="rounded-xl gap-2 h-11 shadow-sm shrink-0" onClick={() => window.open(`https://github.com/${project.github_repo}`, '_blank')}>
                     <GitGraph className="w-4 h-4" /> Open Repository
                  </Button>
               )}
            </div>
         </div>

         {/* 2. Top Metric Cards Row */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <Card className="rounded-2xl shadow-sm border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card transition-colors">
               <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                     <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Activity className="w-5 h-5" />
                     </div>
                     <Badge variant="outline" className={`shrink-0 ${
                        project.status === 'DELAYED' ? 'text-red-500 border-red-500/20 bg-red-500/5' : 
                        project.status === 'COMPLETED' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 
                        'text-primary border-primary/20 bg-primary/5'
                     }`}>
                        {project.status.replace('_', ' ')}
                     </Badge>
                  </div>
                  <div>
                     <p className="text-sm font-medium text-muted-foreground mb-1">Progress</p>
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold">{project.progress_percentage}%</span>
                     </div>
                     <div className="w-full bg-secondary rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full transition-all duration-1000" style={{ width: `${project.progress_percentage || 0}%` }} />
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card transition-colors">
               <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
                     <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="text-sm font-medium text-muted-foreground mb-1">Timeline</p>
                     <p className="text-lg font-bold">{project.start_date || 'TBD'}</p>
                     <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
                        to <span className={project.status === 'DELAYED' ? 'text-red-500 font-medium' : ''}>{project.deadline || 'TBD'}</span>
                     </p>
                  </div>
               </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card transition-colors">
               <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                     <Tag className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="text-sm font-medium text-muted-foreground mb-1">Category & Stack</p>
                     <p className="text-lg font-bold truncate" title={project.category}>{project.category}</p>
                     <p className="text-sm text-muted-foreground mt-0.5 truncate flex items-center gap-1" title={project.technology}>
                        <Code className="w-3.5 h-3.5" /> {project.technology}
                     </p>
                  </div>
               </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card transition-colors">
               <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                     <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Users className="w-5 h-5" />
                     </div>
                     {project.github_repo ? (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1.5 py-1 text-xs">
                           <CheckCircle2 className="w-3 h-3" /> Linked
                        </Badge>
                     ) : (
                        <Badge variant="outline" className="text-muted-foreground border-border/50 text-xs">
                           Not Linked
                        </Badge>
                     )}
                  </div>
                  <div>
                     <p className="text-sm font-medium text-muted-foreground mb-1">Assigned Developer</p>
                     <p className="text-lg font-bold truncate">{project.assigned_developer?.username || 'Unassigned'}</p>
                     <p className="text-sm text-muted-foreground mt-0.5 truncate flex items-center gap-1" title={project.github_repo}>
                        <GitGraph className="w-3.5 h-3.5" /> {project.github_repo || 'No repo configured'}
                     </p>
                  </div>
               </CardContent>
            </Card>

         </div>

         {/* 3. Main Content Tabs (Full Width) */}
         <Tabs defaultValue="releases" className="w-full">
            <TabsList className="w-full sm:w-auto inline-flex justify-start rounded-xl h-12 bg-secondary/30 p-1 mb-6">
               <TabsTrigger value="releases" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-6">
                  <Package className="w-4 h-4" /> App Releases
               </TabsTrigger>
               <TabsTrigger value="documents" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-6">
                  <FileText className="w-4 h-4" /> Documents & Reports
               </TabsTrigger>
               <TabsTrigger value="group" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-6">
                  <GraduationCap className="w-4 h-4" /> Group Details
               </TabsTrigger>
               <TabsTrigger value="tickets" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-6">
                  <Ticket className="w-4 h-4" /> Tickets
               </TabsTrigger>
            </TabsList>
            
            {/* Tab: Releases */}
            <TabsContent value="releases" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               {!project.github_repo ? (
                  <div className="p-12 text-center text-muted-foreground bg-secondary/10 rounded-3xl border border-dashed border-border/60">
                     <GitGraph className="w-12 h-12 mx-auto mb-4 opacity-20" />
                     <h3 className="text-lg font-semibold text-foreground mb-1">No Repository Linked</h3>
                     <p>Link a GitHub repository to automatically sync app releases and APKs.</p>
                  </div>
               ) : isGithubLoading ? (
                  <div className="p-16 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
               ) : releases.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground bg-secondary/10 rounded-3xl border border-dashed border-border/60">
                     <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                     <h3 className="text-lg font-semibold text-foreground mb-1">No Releases Found</h3>
                     <p>When you publish a Release on GitHub, it will appear here automatically.</p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {releases.map((release) => (
                        <Card key={release.id} className="rounded-2xl shadow-sm border-border/50 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                           <CardHeader className="pb-4 border-b border-border/40 bg-secondary/10">
                              <div className="flex justify-between items-start">
                                 <div>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                       {release.name} 
                                       <Badge variant="secondary" className="text-xs bg-background/50 backdrop-blur-sm">{release.tag_name}</Badge>
                                    </CardTitle>
                                    <CardDescription className="mt-1">Published on {new Date(release.published_at).toLocaleDateString()}</CardDescription>
                                 </div>
                                 <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                                    <Package className="w-5 h-5 text-primary" />
                                 </div>
                              </div>
                           </CardHeader>
                           <CardContent className="pt-4">
                              <div className="space-y-3">
                                 <p className="text-sm font-medium text-muted-foreground mb-2">Assets ({release.assets.length})</p>
                                 {release.assets.map((asset: any) => (
                                    <div key={asset.name} className="flex items-center justify-between p-3.5 bg-secondary/20 rounded-xl border border-border/40 hover:bg-secondary/40 transition-colors group">
                                       <div className="flex items-center gap-3 overflow-hidden">
                                          <FileText className="w-4 h-4 text-primary shrink-0" />
                                          <span className="font-medium text-sm truncate">{asset.name}</span>
                                       </div>
                                       <Button variant="ghost" size="sm" className="h-8 gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => window.open(asset.download_url, '_blank')}>
                                          <Download className="w-3.5 h-3.5" /> Download
                                       </Button>
                                    </div>
                                 ))}
                              </div>
                           </CardContent>
                        </Card>
                     ))}
                  </div>
               )}
            </TabsContent>

            {/* Tab: Documents */}
            <TabsContent value="documents" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               {!project.github_repo ? (
                  <div className="p-12 text-center text-muted-foreground bg-secondary/10 rounded-3xl border border-dashed border-border/60">
                     <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                     <h3 className="text-lg font-semibold text-foreground mb-1">No Repository Linked</h3>
                     <p>Link a GitHub repository to automatically sync documents from the <code>docs</code> folder.</p>
                  </div>
               ) : isGithubLoading ? (
                  <div className="p-16 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
               ) : documents.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground bg-secondary/10 rounded-3xl border border-dashed border-border/60">
                     <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                     <h3 className="text-lg font-semibold text-foreground mb-1">No Documents Found</h3>
                     <p>Add PDFs or DOCX files to the <code>docs</code> folder in your GitHub repo.</p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     {documents.map((doc: any) => (
                        <Card key={doc.path} className="rounded-2xl shadow-sm border-border/50 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group cursor-pointer" onClick={() => window.open(doc.download_url, '_blank')}>
                           <CardContent className="p-5 flex items-start gap-4">
                              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                 <FileText className="w-6 h-6" />
                              </div>
                              <div className="overflow-hidden">
                                 <p className="font-semibold text-foreground truncate">{doc.name}</p>
                                 <p className="text-sm text-muted-foreground mt-0.5">{(doc.size / 1024).toFixed(1)} KB</p>
                                 <div className="mt-2 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    View Document <ArrowLeft className="w-3 h-3 rotate-180" />
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                     ))}
                  </div>
               )}
            </TabsContent>

            {/* Tab: Group Details */}
            <TabsContent value="group" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               {project.group ? (
                  <Card className="rounded-3xl shadow-sm border-border/50 bg-card overflow-hidden">
                     <div className="bg-secondary/20 p-8 border-b border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                           <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                              <Users className="w-8 h-8" />
                           </div>
                           <div>
                              <h3 className="text-2xl font-bold">{project.group.name}</h3>
                              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                                 <Building className="w-4 h-4" /> {project.group.college_name}
                              </p>
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <div className="bg-background rounded-xl p-3 px-5 border border-border/50 shadow-sm">
                              <p className="text-xs text-muted-foreground font-medium mb-0.5">Department</p>
                              <p className="font-semibold">{project.group.department || 'N/A'}</p>
                           </div>
                           <div className="bg-background rounded-xl p-3 px-5 border border-border/50 shadow-sm">
                              <p className="text-xs text-muted-foreground font-medium mb-0.5">Semester</p>
                              <p className="font-semibold">{project.group.semester || 'N/A'}</p>
                           </div>
                        </div>
                     </div>
                     <CardContent className="p-8">
                        <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
                           <GraduationCap className="w-5 h-5 text-primary" /> Group Members
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                           {project.group.members && project.group.members.length > 0 ? (
                              project.group.members.map((member: any) => (
                                 <div key={member.usn} className="flex flex-col gap-2 p-4 rounded-2xl border border-border/50 bg-secondary/10">
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg">
                                          {member.name[0]?.toUpperCase()}
                                       </div>
                                       <div>
                                          <p className="font-semibold text-sm">{member.name}</p>
                                          <p className="text-xs text-muted-foreground">{member.usn}</p>
                                       </div>
                                    </div>
                                    <div className="text-xs mt-2 space-y-1">
                                       <p><span className="text-muted-foreground">Email:</span> {member.email}</p>
                                       <p><span className="text-muted-foreground">Phone:</span> {member.phone || 'N/A'}</p>
                                    </div>
                                 </div>
                              ))
                           ) : (
                              <p className="text-muted-foreground col-span-full">No members found in this group.</p>
                           )}
                        </div>
                     </CardContent>
                  </Card>
               ) : (
                  <div className="p-12 text-center text-muted-foreground bg-secondary/10 rounded-3xl border border-dashed border-border/60">
                     <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                     <h3 className="text-lg font-semibold text-foreground mb-1">No Group Assigned</h3>
                     <p>This project has not been assigned to a student group yet.</p>
                  </div>
               )}
            </TabsContent>

            {/* Tab: Tickets */}
            <TabsContent value="tickets" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               {project.tickets && project.tickets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {project.tickets.map((ticket: any) => (
                        <Card key={ticket.id} className="rounded-2xl shadow-sm border-border/50">
                           <CardContent className="p-5 flex justify-between items-start">
                              <div>
                                 <h4 className="font-semibold">{ticket.title}</h4>
                                 <p className="text-xs text-muted-foreground mt-1">Created on {new Date(ticket.created_at).toLocaleDateString()}</p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                 <Badge variant="outline" className={`text-[10px] uppercase ${ticket.status === 'COMPLETED' ? 'text-green-500 border-green-500/20' : ticket.status === 'OPEN' ? 'text-blue-500 border-blue-500/20' : 'text-orange-500 border-orange-500/20'}`}>
                                    {ticket.status}
                                 </Badge>
                                 <Badge variant="secondary" className="text-[10px] uppercase">{ticket.priority}</Badge>
                              </div>
                           </CardContent>
                        </Card>
                     ))}
                  </div>
               ) : (
                  <div className="p-12 text-center text-muted-foreground bg-secondary/10 rounded-3xl border border-dashed border-border/60">
                     <Ticket className="w-12 h-12 mx-auto mb-4 opacity-20" />
                     <h3 className="text-lg font-semibold text-foreground mb-1">No Tickets Found</h3>
                     <p>Students have not raised any issues or tickets for this project yet.</p>
                  </div>
               )}
            </TabsContent>

         </Tabs>

      </div>
   );
}
