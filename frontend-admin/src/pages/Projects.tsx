import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, UploadCloud, Users, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("projects/");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight">Project Master</h2>
          <p className="text-muted-foreground">Manage all ongoing projects, assign files, and update progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input placeholder="Search projects..." className="pl-9 h-10 rounded-xl" />
          </div>
          <Link to="/admin/projects/create">
            <Button className="rounded-xl h-10 gap-2">
              <Plus className="w-4 h-4" /> Create Project
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center p-12 text-muted-foreground bg-card rounded-2xl border border-dashed">
          No projects found. Create one to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <Card key={i} className="rounded-2xl shadow-sm border-border/50 hover:shadow-md transition-shadow group cursor-pointer">
               <CardHeader className="pb-3 border-b border-border/40 bg-secondary/10">
                  <div className="flex justify-between items-start gap-4">
                     <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">{project.title}</CardTitle>
                     <Badge variant="outline" className={`shrink-0 ${
                       project.status === 'DELAYED' ? 'text-red-500 border-red-500/20 bg-red-500/5' : 
                       project.status === 'REQUIREMENT' ? 'text-orange-500 border-orange-500/20 bg-orange-500/5' : 
                       'text-green-500 border-green-500/20 bg-green-500/5'
                     }`}>
                       {project.status.replace('_', ' ')}
                     </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                     <Users className="w-4 h-4" /> {project.group?.name || 'Unassigned'}
                  </div>
               </CardHeader>
               <CardContent className="pt-4 space-y-4">
                  <div>
                     <div className="flex justify-between text-xs font-medium mb-1.5">
                        <span className="text-muted-foreground">Current Stage</span>
                        <span className="text-foreground">{project.status}</span>
                     </div>
                     <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${project.progress_percentage || 0}%` }} />
                     </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-border/40">
                     <Link to={`/admin/projects/${project.id}`} className="flex-1">
                       <Button variant="ghost" size="sm" className="w-full rounded-lg gap-2 h-8 text-xs bg-secondary/30 hover:bg-secondary/60">
                          <FileText className="w-3.5 h-3.5" /> Details
                       </Button>
                     </Link>
                     <Button variant="ghost" size="sm" className="flex-1 rounded-lg gap-2 h-8 text-xs bg-secondary/30 hover:bg-secondary/60">
                        <UploadCloud className="w-3.5 h-3.5" /> Upload File
                     </Button>
                  </div>
               </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
