import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, ChevronRight } from "lucide-react";
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
    <div className="max-w-5xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-primary">Projects</h1>
          <p className="text-muted-foreground mt-2 text-sm">Manage all ongoing projects and assignments.</p>
        </div>
        <div className="flex items-center gap-4 mt-6 md:mt-0">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9 rounded-md border-border bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-primary/20" />
          </div>
          <Link to="/admin/projects/create">
            <Button className="rounded-md shadow-none font-medium gap-2">
              <Plus className="w-4 h-4" /> New
            </Button>
          </Link>
        </div>
      </div>

      {/* List View */}
      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground text-sm">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="py-20 text-center border rounded-md text-muted-foreground text-sm">
          No projects found. Create one to get started.
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden bg-background">
          <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/30 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            <div className="col-span-5">Name</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-3">Group</div>
            <div className="col-span-1 text-right"></div>
          </div>
          
          <div className="divide-y divide-border">
            {projects.map((project, i) => (
              <Link key={i} to={`/admin/projects/${project.id}`} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors group">
                <div className="col-span-5 flex items-center gap-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm text-foreground">{project.title}</span>
                </div>
                
                <div className="col-span-3 flex items-center">
                  <Badge variant="secondary" className="rounded-sm font-normal text-xs bg-muted text-muted-foreground border-transparent">
                    {project.status.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="col-span-3 text-sm text-muted-foreground truncate">
                  {project.group?.name || 'Unassigned'}
                </div>
                
                <div className="col-span-1 flex justify-end">
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
