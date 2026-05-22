import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Github, Package, FileText, Loader2, Download, ExternalLink, Calendar, Users, Code, Activity } from "lucide-react";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [releases, setReleases] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`projects/${id}/`);
        setProject(res.data);
        
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
    fetchProject();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) return <div>Project not found</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/projects">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold tracking-tight">{project.title}</h2>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{project.status}</Badge>
            </div>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Users className="w-4 h-4" /> {project.group?.name || 'Unassigned Group'} • <Code className="w-4 h-4 ml-2" /> {project.technology}
            </p>
          </div>
        </div>
        
        {project.github_repo && (
           <Button variant="outline" className="rounded-xl gap-2 h-10" onClick={() => window.open(`https://github.com/${project.github_repo}`, '_blank')}>
              <Github className="w-4 h-4" /> Open Repository
           </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          <Card className="rounded-2xl shadow-sm border-border/50 bg-card overflow-hidden">
             <div className="bg-secondary/20 border-b border-border/40 p-4 px-6 flex justify-between items-center">
                <h3 className="font-semibold flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> Progress Status</h3>
                <span className="font-bold text-primary">{project.progress_percentage}%</span>
             </div>
             <CardContent className="p-6">
                <div className="w-full bg-secondary rounded-full h-3 mb-4">
                  <div className="bg-primary h-3 rounded-full transition-all duration-1000" style={{ width: `${project.progress_percentage || 0}%` }} />
                </div>
                <p className="text-sm text-muted-foreground">{project.description}</p>
             </CardContent>
          </Card>

          <Tabs defaultValue="releases" className="w-full">
            <TabsList className="w-full justify-start rounded-xl h-12 bg-secondary/30 p-1">
              <TabsTrigger value="releases" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Package className="w-4 h-4" /> App Releases
              </TabsTrigger>
              <TabsTrigger value="documents" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <FileText className="w-4 h-4" /> Documents & Reports
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="releases" className="mt-6 space-y-4">
              {!project.github_repo ? (
                 <div className="p-8 text-center text-muted-foreground bg-secondary/10 rounded-2xl border border-dashed">
                    Link a GitHub repository to automatically sync app releases.
                 </div>
              ) : isGithubLoading ? (
                 <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
              ) : releases.length === 0 ? (
                 <div className="p-8 text-center text-muted-foreground bg-secondary/10 rounded-2xl border border-dashed">
                    No releases found on GitHub.
                 </div>
              ) : (
                 releases.map((release) => (
                    <Card key={release.id} className="rounded-xl shadow-sm border-border/50">
                       <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                             <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                   {release.name} 
                                   <Badge variant="secondary" className="text-xs">{release.tag_name}</Badge>
                                </CardTitle>
                                <CardDescription className="mt-1">Published on {new Date(release.published_at).toLocaleDateString()}</CardDescription>
                             </div>
                          </div>
                       </CardHeader>
                       <CardContent>
                          <div className="space-y-2">
                             {release.assets.map((asset: any) => (
                                <div key={asset.name} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-border/40 hover:bg-secondary/40 transition-colors">
                                   <div className="flex items-center gap-3">
                                      <Package className="w-4 h-4 text-primary" />
                                      <span className="font-medium text-sm">{asset.name}</span>
                                   </div>
                                   <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={() => window.open(asset.download_url, '_blank')}>
                                      <Download className="w-3.5 h-3.5" /> Download
                                   </Button>
                                </div>
                             ))}
                          </div>
                       </CardContent>
                    </Card>
                 ))
              )}
            </TabsContent>

            <TabsContent value="documents" className="mt-6 space-y-4">
              {!project.github_repo ? (
                 <div className="p-8 text-center text-muted-foreground bg-secondary/10 rounded-2xl border border-dashed">
                    Link a GitHub repository to sync documents.
                 </div>
              ) : isGithubLoading ? (
                 <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
              ) : documents.length === 0 ? (
                 <div className="p-8 text-center text-muted-foreground bg-secondary/10 rounded-2xl border border-dashed">
                    No documents found in the `docs` folder.
                 </div>
              ) : (
                 <Card className="rounded-xl shadow-sm border-border/50">
                    <CardContent className="p-2">
                       {documents.map((doc: any) => (
                          <div key={doc.path} className="flex items-center justify-between p-3 hover:bg-secondary/30 rounded-lg transition-colors group">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                   <FileText className="w-4 h-4" />
                                </div>
                                <div>
                                   <p className="font-medium text-sm group-hover:text-primary transition-colors">{doc.name}</p>
                                   <p className="text-xs text-muted-foreground">{(doc.size / 1024).toFixed(1)} KB</p>
                                </div>
                             </div>
                             <Button variant="outline" size="sm" className="h-8 gap-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => window.open(doc.download_url, '_blank')}>
                                <ExternalLink className="w-3.5 h-3.5" /> View
                             </Button>
                          </div>
                       ))}
                    </CardContent>
                 </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="rounded-2xl shadow-sm border-border/50 bg-card">
            <CardHeader className="bg-secondary/20 border-b border-border/40 rounded-t-2xl pb-4">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Project Metadata</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2"><Calendar className="w-4 h-4" /> Timeline</p>
                <div className="flex items-center justify-between text-sm font-medium bg-secondary/20 p-3 rounded-lg border border-border/40">
                  <span>{project.start_date || 'TBD'}</span>
                  <ArrowLeft className="w-4 h-4 rotate-180 text-muted-foreground" />
                  <span className={project.status === 'DELAYED' ? 'text-red-500' : ''}>{project.deadline || 'TBD'}</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Category</p>
                <p className="font-medium text-sm">{project.category}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Assigned Developer</p>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                      {project.assigned_developer?.username?.[0]?.toUpperCase() || '?'}
                   </div>
                   <p className="font-medium text-sm">{project.assigned_developer?.username || 'Unassigned'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">GitHub Integration</p>
                {project.github_repo ? (
                   <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 gap-1.5 py-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Linked
                   </Badge>
                ) : (
                   <Badge variant="outline" className="bg-secondary/50 text-muted-foreground border-border/50">
                      Not Linked
                   </Badge>
                )}
              </div>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
