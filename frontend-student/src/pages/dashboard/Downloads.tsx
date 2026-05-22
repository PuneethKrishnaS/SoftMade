import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, FolderOpen, Loader2, FileArchive, Activity, Terminal } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import api from "@/lib/api";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

export default function Downloads() {
  const { activeProject } = useOutletContext<{ activeProject: any }>();
  const [documents, setDocuments] = useState<any[]>([]);
  const [readme, setReadme] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeProject?.id) {
      setLoading(true);
      Promise.all([
        api.get(`/api/projects/${activeProject.id}/github_documents/`).catch(() => ({ data: [] })),
        api.get(`/api/projects/${activeProject.id}/github_readme/`).catch(() => ({ data: { content: null } }))
      ]).then(([docsRes, readmeRes]) => {
         // Documents
         if (Array.isArray(docsRes.data)) {
            setDocuments(docsRes.data);
         } else if (docsRes.data && Array.isArray(docsRes.data.documents)) {
            setDocuments(docsRes.data.documents);
         } else {
            setDocuments([]);
         }

         // README
         if (readmeRes.data?.content) {
            setReadme(readmeRes.data.content);
         } else {
            setReadme("");
         }
      }).finally(() => {
         setLoading(false);
      });
    }
  }, [activeProject]);

  if (!activeProject) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-2xl bg-card/50">
        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
           <FolderOpen className="w-6 h-6 text-muted-foreground opacity-50" />
        </div>
        <h3 className="text-base font-medium text-foreground">No Active Project</h3>
        <p className="text-muted-foreground text-sm mt-1 max-w-sm">You haven't been assigned to a project yet. Please contact your administrator.</p>
      </div>
    );
  }

  const formatSize = (bytes: number) => {
     if (!bytes) return "Unknown";
     if (bytes < 1024) return bytes + " B";
     if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
     return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full pb-8">
      
      {/* HEADER SECTION (Monochrome, compact) */}
      <div className="flex items-center justify-between p-4 bg-card/60 border border-border/40 rounded-xl shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-4">
           <div>
             <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">Project Resources</h2>
             <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{activeProject.title}</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <Badge variant="outline" className="bg-background text-[10px] font-bold uppercase tracking-widest border-border px-3 py-1 shadow-sm">
             {documents.length} Files
           </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-14rem)] min-h-[600px]">
        
        {/* Left Col (30% approx -> 4/12): Files Viewing/Downloading */}
        <div className="lg:col-span-4 h-full">
           <Card className="rounded-xl border-border/40 shadow-sm bg-card/60 backdrop-blur-sm h-full flex flex-col overflow-hidden">
             <CardHeader className="px-5 py-3 border-b border-border/40 bg-background/50 flex flex-row items-center justify-between shrink-0">
                <CardTitle className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-foreground">
                   <FolderOpen className="w-3.5 h-3.5" /> Repository Files
                </CardTitle>
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
             </CardHeader>
             <CardContent className="p-0 flex-1 overflow-y-auto">
                <div className="divide-y divide-border/40">
                   {loading ? (
                      <div className="p-8 flex flex-col items-center justify-center text-muted-foreground space-y-3">
                         <Loader2 className="w-5 h-5 animate-spin" />
                         <span className="text-[10px] uppercase tracking-widest font-bold">Syncing Resources...</span>
                      </div>
                   ) : documents.length > 0 ? (
                      documents.map((doc, i) => (
                         <div key={i} className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors group">
                            <div className="flex items-center gap-3 overflow-hidden">
                               <div className="p-2 rounded-lg border shadow-sm shrink-0 bg-background text-muted-foreground border-border/60 group-hover:bg-foreground group-hover:text-background transition-colors">
                                  {doc.type === 'dir' ? <FolderOpen className="w-3.5 h-3.5" /> : doc.name.toLowerCase().endsWith('.pdf') ? <FileText className="w-3.5 h-3.5" /> : <FileArchive className="w-3.5 h-3.5" />}
                               </div>
                               <div className="truncate pr-2">
                                 <h4 className="font-bold text-xs uppercase tracking-wider text-foreground truncate" title={doc.name}>
                                    {doc.name}
                                 </h4>
                                 <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                    {doc.type === 'dir' ? 'Folder' : formatSize(doc.size)}
                                 </p>
                               </div>
                            </div>
                            {doc.type === 'file' && (
                               <Button 
                                 size="sm" 
                                 variant="outline"
                                 className="rounded-lg h-7 w-7 p-0 shrink-0 border-border/60 bg-background hover:bg-foreground hover:text-background transition-colors"
                                 onClick={() => {
                                    if(doc.download_url) window.open(doc.download_url, '_blank');
                                 }}
                                 title="Download File"
                               >
                                 <Download className="w-3.5 h-3.5" />
                               </Button>
                            )}
                         </div>
                      ))
                   ) : (
                      <div className="p-8 text-center text-muted-foreground text-[10px] uppercase tracking-widest">No resources found in the repository.</div>
                   )}
                </div>
             </CardContent>
           </Card>
        </div>

        {/* Right Col (70% approx -> 8/12): README / Viewer */}
        <div className="lg:col-span-8 h-full">
           <Card className="rounded-xl border-border/40 shadow-sm bg-card/60 backdrop-blur-sm h-full flex flex-col overflow-hidden">
              <CardHeader className="px-5 py-3 border-b border-border/40 bg-background/50 flex flex-row items-center justify-between shrink-0">
                 <CardTitle className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-foreground">
                    <Terminal className="w-3.5 h-3.5" /> Project Documentation (README)
                 </CardTitle>
                 <Badge variant="outline" className="text-[9px] uppercase tracking-widest px-1.5 py-0 h-4 border-border bg-secondary/50">
                    Markdown
                 </Badge>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-hidden relative">
                 {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground space-y-3">
                       <Loader2 className="w-5 h-5 animate-spin" />
                       <span className="text-[10px] uppercase tracking-widest font-bold">Reading Documentation...</span>
                    </div>
                 ) : readme ? (
                    <div className="h-full overflow-y-auto p-8 bg-background/30 custom-scrollbar">
                       <article className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-foreground prose-a:underline-offset-4 prose-code:text-xs prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-secondary/50 prose-pre:border prose-pre:border-border/50">
                          <ReactMarkdown>{readme}</ReactMarkdown>
                       </article>
                    </div>
                 ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                       <div className="w-12 h-12 bg-secondary/50 rounded-full flex items-center justify-center mb-3">
                          <Activity className="w-5 h-5 opacity-50" />
                       </div>
                       <p className="text-[10px] uppercase tracking-widest font-bold">No documentation available.</p>
                       <p className="text-[9px] mt-1 text-muted-foreground/70 uppercase tracking-widest">A README.md file is missing from the repository root.</p>
                    </div>
                 )}
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
