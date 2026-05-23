import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, FolderOpen, Loader2, Activity, Terminal, ChevronRight, ChevronDown, FileCode, FileImage, FileJson, FileType2, File } from "lucide-react";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from 'react-syntax-highlighter';
import stackoverflowLight from 'react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-light';
import remarkGfm from 'remark-gfm';

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

export default function ProjectRepositoryTab({ repoPath }: { repoPath: string }) {
   const [treeData, setTreeData] = useState<TreeNode[]>([]);
   const [readme, setReadme] = useState<string>("");
   const [loadingDocs, setLoadingDocs] = useState(false);
   const [loadingReadme, setLoadingReadme] = useState(true);
   const [selectedFile, setSelectedFile] = useState<{name: string, content: string, loading: boolean, path: string} | null>(null);

   useEffect(() => {
      if (repoPath) {
         setLoadingDocs(true);
         fetch(`https://api.github.com/repos/${repoPath}`)
            .then(res => {
               if (!res.ok) throw new Error("Failed to fetch repo");
               return res.json();
            })
            .then(repo => {
               const branch = repo.default_branch;
               return fetch(`https://api.github.com/repos/${repoPath}/git/trees/${branch}?recursive=1`)
                  .then(res => res.json())
                  .then(data => ({ treeData: data, branch }));
            })
            .then(({ treeData, branch }) => {
               if (treeData && treeData.tree) {
                  const root = buildTree(treeData.tree, branch, repoPath);
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
   }, [repoPath]);

   useEffect(() => {
      if (repoPath) {
         setLoadingReadme(true);
         fetch(`https://api.github.com/repos/${repoPath}/readme`, {
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
   }, [repoPath]);


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

   if (!repoPath) {
      return (
         <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-md bg-muted/20">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
               <FolderOpen className="w-6 h-6 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-base font-medium text-foreground">No Repository Linked</h3>
            <p className="text-muted-foreground text-sm mt-1 max-w-sm">Edit the project details to link a GitHub repository (e.g. owner/repo).</p>
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
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full pb-8">
         <div className="flex items-center justify-between p-4 bg-card/60 border border-border/40 rounded-xl shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-4">
               <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">Project Resources</h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{repoPath}</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <Badge variant="outline" className="bg-background text-[10px] font-bold uppercase tracking-widest border-border px-3 py-1 shadow-sm">
                  {totalFiles} Files
               </Badge>
               <Button 
                  size="sm" 
                  onClick={() => window.open(`https://github.com/${repoPath}/archive/HEAD.zip`, '_blank')}
                  className="h-7 text-xs px-3 bg-primary text-primary-foreground hover:bg-primary/90"
               >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Download ZIP
               </Button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[600px] min-h-[400px]">
            <div className="lg:col-span-4 h-full min-h-0">
               <Card className="rounded-xl border-border/40 shadow-sm bg-card/60 backdrop-blur-sm h-full flex flex-col overflow-hidden">
                  <CardHeader className="px-5 py-3 border-b border-border/40 bg-background/50 flex flex-row items-center justify-between shrink-0">
                     <CardTitle className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-foreground">
                        <FolderOpen className="w-3.5 h-3.5" /> Repository
                     </CardTitle>
                     {loadingDocs && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
                  </CardHeader>
                  <CardContent className="p-0 flex-1 overflow-y-auto min-h-0">
                     <div className="py-2">
                        {loadingDocs ? (
                           <div className="p-8 flex flex-col items-center justify-center text-muted-foreground space-y-3">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span className="text-[10px] uppercase tracking-widest font-bold">Loading Structure...</span>
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
                           <div className="p-8 text-center text-muted-foreground text-[10px] uppercase tracking-widest">No resources found.</div>
                        )}
                     </div>
                  </CardContent>
               </Card>
            </div>

            <div className="lg:col-span-8 h-full min-h-0 min-w-0">
               <Card className="rounded-xl border-border/40 shadow-sm bg-card/60 backdrop-blur-sm h-full flex flex-col overflow-hidden">
                  <CardHeader className="px-5 py-3 border-b border-border/40 bg-background/50 flex flex-row items-center justify-between shrink-0">
                     <CardTitle className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-foreground">
                        <Terminal className="w-3.5 h-3.5" /> {selectedFile ? `Viewing File: ${selectedFile.name}` : 'Project Documentation (README)'}
                     </CardTitle>
                     {selectedFile ? (
                        <div className="flex items-center gap-2">
                           <Badge variant="outline" className="text-[9px] uppercase tracking-widest px-1.5 py-0 h-4 border-border bg-secondary/50">
                              {selectedFile.name.split('.').pop() || 'File'}
                           </Badge>
                           <Button size="sm" variant="ghost" className="h-5 text-[9px] uppercase tracking-widest px-2" onClick={() => setSelectedFile(null)}>Close</Button>
                        </div>
                     ) : (
                        <Badge variant="outline" className="text-[9px] uppercase tracking-widest px-1.5 py-0 h-4 border-border bg-secondary/50">
                           Markdown
                        </Badge>
                     )}
                  </CardHeader>
                  <CardContent className="p-0 flex-1 overflow-hidden relative min-h-0">
                     {selectedFile ? (
                        selectedFile.loading ? (
                           <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground space-y-3">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span className="text-[10px] uppercase tracking-widest font-bold">Loading File...</span>
                           </div>
                        ) : (
                           <div className="h-full overflow-y-auto p-4 bg-background/30 custom-scrollbar">
                              {selectedFile.name.toLowerCase().endsWith('.md') ? (
                                 <article className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-foreground prose-a:underline-offset-4 prose-code:text-xs prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-secondary/50 prose-pre:border prose-pre:border-border/50">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedFile.content}</ReactMarkdown>
                                 </article>
                              ) : (
                                 <SyntaxHighlighter 
                                    language={selectedFile.name.split('.').pop() || 'text'} 
                                    style={stackoverflowLight}
                                    customStyle={{ margin: 0, padding: '1rem', borderRadius: '0.375rem', fontSize: '13px', background: 'hsl(var(--secondary) / 0.3)' }}
                                    showLineNumbers={true}
                                 >
                                    {selectedFile.content}
                                 </SyntaxHighlighter>
                              )}
                           </div>
                        )
                     ) : loadingReadme ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground space-y-3">
                           <Loader2 className="w-5 h-5 animate-spin" />
                           <span className="text-[10px] uppercase tracking-widest font-bold">Reading Documentation...</span>
                        </div>
                     ) : readme ? (
                        <div className="h-full overflow-y-auto p-8 bg-background/30 custom-scrollbar">
                           <article className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-foreground prose-a:underline-offset-4 prose-code:text-xs prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-secondary/50 prose-pre:border prose-pre:border-border/50">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{readme}</ReactMarkdown>
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
