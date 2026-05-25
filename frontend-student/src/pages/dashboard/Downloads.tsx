import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, FolderOpen, Loader2, Activity, Terminal, ChevronRight, ChevronDown, FileCode, FileImage, FileJson, FileType2, File } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from 'react-syntax-highlighter';
import stackoverflowLight from 'react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-light';

interface TreeNode {
   name: string;
   path: string;
   type: 'tree' | 'blob';
   size?: number;
   children?: TreeNode[];
   download_url?: string;
}

function getFileIcon(filename: string) {
   const ext = filename.split('.').pop()?.toLowerCase();
   switch(ext) {
      case 'ts':
      case 'tsx':
         return <FileType2 className="w-4 h-4 text-blue-500" />;
      case 'js':
      case 'jsx':
         return <FileCode className="w-4 h-4 text-yellow-500" />;
      case 'css':
      case 'scss':
         return <FileCode className="w-4 h-4 text-sky-500" />;
      case 'json':
         return <FileJson className="w-4 h-4 text-green-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'svg':
      case 'gif':
         return <FileImage className="w-4 h-4 text-purple-500" />;
      case 'md':
      case 'txt':
         return <FileText className="w-4 h-4 text-muted-foreground" />;
      default:
         return <File className="w-4 h-4 text-muted-foreground" />;
   }
}

function buildTree(paths: any[], branch: string, repo: string): TreeNode[] {
   const root: TreeNode[] = [];
   const map = new Map<string, TreeNode>();

   paths.forEach(item => {
      const node: TreeNode = {
         name: item.path.split('/').pop() || '',
         path: item.path,
         type: item.type,
         size: item.size,
         children: item.type === 'tree' ? [] : undefined,
         download_url: item.type === 'blob' ? `https://raw.githubusercontent.com/${repo}/${branch}/${item.path}` : undefined
      };
      map.set(item.path, node);

      const parts = item.path.split('/');
      parts.pop();
      const parentPath = parts.join('/');

      if (parentPath === '') {
         root.push(node);
      } else {
         const parent = map.get(parentPath);
         if (parent && parent.children) {
            parent.children.push(node);
         } else {
            root.push(node);
         }
      }
   });

   const sortNodes = (nodes: TreeNode[]) => {
      nodes.sort((a, b) => {
         if (a.type === 'tree' && b.type === 'blob') return -1;
         if (a.type === 'blob' && b.type === 'tree') return 1;
         return a.name.localeCompare(b.name);
      });
      nodes.forEach(n => {
         if (n.children) sortNodes(n.children);
      });
   };
   sortNodes(root);

   return root;
}

function FileNodeViewer({ node, level = 0, onSelectFile, selectedPath }: { node: TreeNode, level?: number, onSelectFile: (node: TreeNode) => void, selectedPath?: string }) {
   const [expanded, setExpanded] = useState(false);

   const isFolder = node.type === 'tree';
   const isSelected = selectedPath === node.path;

   return (
      <div className="w-full">
         <div 
            className={`flex items-center justify-between py-2 px-3 hover:bg-secondary/40 cursor-pointer group ${isSelected ? 'bg-secondary/60' : ''}`}
            style={{ paddingLeft: `${level * 18 + 12}px` }}
            onClick={() => {
               if (isFolder) {
                  setExpanded(!expanded);
               } else {
                  onSelectFile(node);
               }
            }}
         >
            <div className="flex items-center gap-2.5 overflow-hidden">
               {isFolder ? (
                  expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
               ) : (
                  <span className="w-4 shrink-0" /> // spacer
               )}

               {isFolder ? (
                  <FolderOpen className={`w-4 h-4 shrink-0 ${expanded ? 'text-primary' : 'text-muted-foreground'}`} />
               ) : (
                  getFileIcon(node.name)
               )}

               <span className={`text-sm truncate ${isFolder ? 'font-medium text-foreground' : 'text-muted-foreground group-hover:text-foreground transition-colors'}`}>
                  {node.name}
               </span>
            </div>
            
         </div>

         {isFolder && expanded && node.children && (
            <div className="flex flex-col">
               {node.children.map((child) => (
                  <FileNodeViewer 
                     key={child.path} 
                     node={child} 
                     level={level + 1} 
                     onSelectFile={onSelectFile}
                     selectedPath={selectedPath}
                  />
               ))}
            </div>
         )}
      </div>
   );
}

export default function Downloads() {
   const { activeProject } = useOutletContext<{ activeProject: any }>();
   const [treeData, setTreeData] = useState<TreeNode[]>([]);
   const [readme, setReadme] = useState<string>("");
   const [loadingDocs, setLoadingDocs] = useState(false);
   const [loadingReadme, setLoadingReadme] = useState(true);
   const [selectedFile, setSelectedFile] = useState<{name: string, content: string, loading: boolean, path: string} | null>(null);

   useEffect(() => {
      if (activeProject?.github_repo) {
         setLoadingDocs(true);
         fetch(`https://api.github.com/repos/${activeProject.github_repo}`)
            .then(res => {
               if (!res.ok) throw new Error("Failed to fetch repo");
               return res.json();
            })
            .then(repo => {
               const branch = repo.default_branch;
               return fetch(`https://api.github.com/repos/${activeProject.github_repo}/git/trees/${branch}?recursive=1`)
                  .then(res => res.json())
                  .then(data => ({ treeData: data, branch }));
            })
            .then(({ treeData, branch }) => {
               if (treeData && treeData.tree) {
                  const root = buildTree(treeData.tree, branch, activeProject.github_repo);
                  setTreeData(root);
               } else {
                  setTreeData([]);
               }
            })
            .catch(() => setTreeData([]))
            .finally(() => setLoadingDocs(false));
      } else {
         setTreeData([]);
      }
   }, [activeProject]);

   useEffect(() => {
      if (activeProject?.github_repo) {
         setLoadingReadme(true);
         fetch(`https://api.github.com/repos/${activeProject.github_repo}/readme`, {
            headers: {
               'Accept': 'application/vnd.github.v3.raw'
            }
         })
            .then(res => {
               if (!res.ok) throw new Error("Not found");
               return res.text();
            })
            .then(text => setReadme(text))
            .catch(() => setReadme(""))
            .finally(() => setLoadingReadme(false));
      } else {
         setReadme("");
      }
   }, [activeProject]);


   const handleSelectFile = (node: TreeNode) => {
      setSelectedFile({ name: node.name, content: "", loading: true, path: node.path });
      if (node.download_url) {
         fetch(node.download_url)
            .then(res => {
               if (!res.ok) throw new Error("Failed to load file");
               return res.text();
            })
            .then(text => setSelectedFile(prev => prev?.path === node.path ? { ...prev, content: text, loading: false } : prev))
            .catch(() => setSelectedFile(prev => prev?.path === node.path ? { ...prev, content: "Error loading file content.", loading: false } : prev));
      } else {
         setSelectedFile(prev => prev?.path === node.path ? { ...prev, content: "Error: No download URL.", loading: false } : prev);
      }
   };

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

   const countFiles = (nodes: TreeNode[]): number => {
      let count = 0;
      nodes.forEach(n => {
         if (n.type === 'blob') count++;
         if (n.children) count += countFiles(n.children);
      });
      return count;
   };
   const totalFiles = countFiles(treeData);

   return (
      <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-200 w-full pb-10 max-w-[1600px] mx-auto">
         
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-5 sm:p-6 bg-card/40 border border-border/40 rounded-[32px] shadow-xl backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="flex flex-col gap-2 relative z-10">
               <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Project Resources</h2>
               <p className="text-muted-foreground font-medium text-sm sm:text-base">View and download files related to your project.</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 relative z-10">
               <Badge variant="outline" className="bg-background/50 text-xs font-bold uppercase tracking-widest border-border/50 px-4 py-1.5 shadow-sm rounded-xl">
                  {totalFiles} Files
               </Badge>
               <Button 
                  size="sm" 
                  onClick={() => window.open(`https://github.com/${activeProject.github_repo}/archive/HEAD.zip`, '_blank')}
                  className="h-12 text-xs font-bold px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg hover:shadow-primary/20 transition-colors hover:-translate-y-0.5"
               >
                  <Download className="w-4 h-4 mr-2" />
                  Download ZIP
               </Button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-14rem)] min-h-[500px]">
            {/* Sidebar File Tree */}
            <div className="lg:col-span-3 h-full min-h-0">
               <Card className="rounded-[32px] border-border/40 shadow-xl bg-card/40 backdrop-blur-sm h-full flex flex-col overflow-hidden hover:border-foreground/20 transition-colors duration-200">
                  <CardHeader className="px-6 py-4 border-b border-border/30 bg-background/20 flex flex-row items-center justify-between shrink-0">
                     <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2.5 text-muted-foreground">
                        <FolderOpen className="w-4 h-4 text-primary" /> Repository
                     </CardTitle>
                     {loadingDocs && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                  </CardHeader>
                  <CardContent className="p-0 flex-1 overflow-y-auto min-h-0 custom-scrollbar bg-background/10">
                     <div className="py-3 px-2">
                        {loadingDocs ? (
                           <div className="p-6 flex flex-col items-center justify-center text-muted-foreground space-y-4">
                              <Loader2 className="w-6 h-6 animate-spin text-primary" />
                              <span className="text-xs uppercase tracking-widest font-bold">Loading Structure...</span>
                           </div>
                        ) : treeData.length > 0 ? (
                           treeData.map((node) => (
                              <FileNodeViewer 
                                 key={node.path} 
                                 node={node} 
                                 onSelectFile={handleSelectFile}
                                 selectedPath={selectedFile?.path}
                              />
                           ))
                        ) : (
                           <div className="p-6 text-center text-muted-foreground text-xs uppercase tracking-widest font-semibold border border-dashed border-border/50 rounded-2xl m-4 bg-background/30">No resources found.</div>
                        )}
                     </div>
                  </CardContent>
               </Card>
            </div>

            {/* Main Viewer */}
            <div className="lg:col-span-9 h-full min-h-0 min-w-0">
               <Card className="rounded-[32px] border-border/40 shadow-xl bg-card/40 backdrop-blur-sm h-full flex flex-col overflow-hidden hover:border-foreground/20 transition-colors duration-200">
                  <CardHeader className="px-6 py-4 border-b border-border/30 bg-background/20 flex flex-row items-center justify-between shrink-0">
                     <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2.5 text-foreground/80">
                        <Terminal className="w-4 h-4 text-primary" /> 
                        <span className="truncate max-w-[200px] sm:max-w-md">{selectedFile ? `Viewing: ${selectedFile.name}` : 'Project Documentation (README)'}</span>
                     </CardTitle>
                     {selectedFile ? (
                        <div className="flex items-center gap-3">
                           <Badge variant="outline" className="text-[10px] uppercase tracking-widest px-2 py-0.5 border-border/50 bg-secondary/80 font-bold rounded-lg hidden sm:inline-flex">
                              {selectedFile.name.split('.').pop() || 'File'}
                           </Badge>
                           <Button size="sm" variant="ghost" className="h-7 text-[10px] font-bold uppercase tracking-widest px-3 rounded-lg hover:bg-secondary/80" onClick={() => setSelectedFile(null)}>Close</Button>
                        </div>
                     ) : (
                        <Badge variant="outline" className="text-[10px] uppercase tracking-widest px-2 py-0.5 border-border/50 bg-secondary/80 font-bold rounded-lg">
                           Markdown
                        </Badge>
                     )}
                  </CardHeader>
                  <CardContent className="p-0 flex-1 overflow-hidden relative min-h-0 bg-background/20">
                     {selectedFile ? (
                        selectedFile.loading ? (
                           <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground space-y-4">
                              <Loader2 className="w-6 h-6 animate-spin text-primary" />
                              <span className="text-[10px] uppercase tracking-widest font-bold">Loading File...</span>
                           </div>
                        ) : (
                           <div className="h-full overflow-y-auto p-6 md:p-8 custom-scrollbar">
                              {selectedFile.name.toLowerCase().endsWith('.md') ? (
                                 <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80 prose-a:underline-offset-4 prose-code:text-xs prose-code:bg-secondary/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-secondary/50 prose-pre:border prose-pre:border-border/50 prose-pre:backdrop-blur-md">
                                    <ReactMarkdown>{selectedFile.content}</ReactMarkdown>
                                 </article>
                              ) : (
                                 <SyntaxHighlighter 
                                    language={selectedFile.name.split('.').pop() || 'text'} 
                                    style={stackoverflowLight}
                                    customStyle={{ margin: 0, padding: '1.5rem', borderRadius: '1rem', fontSize: '14px', background: 'hsl(var(--secondary) / 0.5)', border: '1px solid hsl(var(--border) / 0.5)' }}
                                    showLineNumbers={true}
                                 >
                                    {selectedFile.content}
                                 </SyntaxHighlighter>
                              )}
                           </div>
                        )
                     ) : loadingReadme ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground space-y-4">
                           <Loader2 className="w-6 h-6 animate-spin text-primary" />
                           <span className="text-[10px] uppercase tracking-widest font-bold">Reading Documentation...</span>
                        </div>
                     ) : readme ? (
                        <div className="h-full overflow-y-auto p-6 md:p-10 custom-scrollbar">
                           <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80 prose-a:underline-offset-4 prose-code:text-xs prose-code:bg-secondary/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-secondary/50 prose-pre:border prose-pre:border-border/50 prose-pre:backdrop-blur-md">
                              <ReactMarkdown>{readme}</ReactMarkdown>
                           </article>
                        </div>
                     ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                           <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mb-4 border border-border/50 shadow-inner">
                              <Activity className="w-6 h-6 opacity-50" />
                           </div>
                           <p className="text-[11px] uppercase tracking-widest font-bold">No documentation available.</p>
                           <p className="text-[10px] mt-2 text-muted-foreground/70 uppercase tracking-widest font-medium">A README.md file is missing from the repository root.</p>
                        </div>
                     )}
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
