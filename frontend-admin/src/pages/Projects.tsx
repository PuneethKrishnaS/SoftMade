import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, Calendar, Users, Code2, ArrowRight, FolderKanban } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredProjects = projects.filter((p: any) => 
    (p.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.technology || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-8xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-primary">Projects</h1>
          <p className="text-muted-foreground mt-2 text-sm">Manage all ongoing projects, timelines, and developer assignments.</p>
        </div>
        <div className="flex items-center gap-4 mt-6 md:mt-0">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input 
              placeholder="Search by name, category, tech..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-md border-border bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-primary/20" 
            />
          </div>
          <Link to="/admin/projects/create">
            <Button className="rounded-md shadow-none font-medium gap-2">
              <Plus className="w-4 h-4" /> New
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid View */}
      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground text-sm">Loading projects...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-24 text-center border border-dashed rounded-xl bg-card text-muted-foreground text-sm">
          <FolderKanban className="w-12 h-12 mx-auto mb-4 opacity-20" />
          No projects found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project, i) => (
            <Card key={i} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-300 border-border/50">
               <CardHeader className="">
                  <div className="flex justify-between items-start mb-2">
                     <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold text-primary border-primary/20 bg-primary/5">
                        {project.category || "Uncategorized"}
                     </Badge>
                     <Badge variant="secondary" className="font-normal text-[10px] uppercase tracking-widest bg-muted text-muted-foreground">
                        {project.status.replace('_', ' ')}
                     </Badge>
                  </div>
                  <h3 className="font-bold text-lg leading-tight line-clamp-2" title={project.title}>
                     {project.title}
                  </h3>
               </CardHeader>
               
               <CardContent className="p-5 pt-0 flex-1 flex flex-col">
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">
                     {project.description || "No description provided."}
                  </p>
                  
                  <div className="space-y-3">
                     {/* Tech Stack */}
                     <div className="flex items-start gap-2">
                        <Code2 className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div className="flex flex-wrap gap-1">
                           {project.technology ? project.technology.split(',').slice(0, 3).map((tech: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-[10px] py-0 h-4 px-1.5 font-normal bg-secondary/50">
                                 {tech.trim()}
                              </Badge>
                           )) : <span className="text-xs text-muted-foreground">Not specified</span>}
                           {project.technology && project.technology.split(',').length > 3 && (
                              <span className="text-[10px] text-muted-foreground ml-1">+{project.technology.split(',').length - 3}</span>
                           )}
                        </div>
                     </div>

                     {/* Dates */}
                     <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span className="truncate">
                           {project.start_date || "TBD"} &rarr; {project.deadline || "TBD"}
                        </span>
                     </div>

                     {/* Team */}
                     <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="w-4 h-4 shrink-0" />
                        <span>{project.students?.length ? `${project.students.length} Student(s)` : 'Unassigned'}</span>
                     </div>
                  </div>
               </CardContent>
               
               <CardFooter className="p-0  border-t">
                  <Link to={`/admin/projects/${project.id}`} className="w-full">
                     <Button variant="ghost" className="w-full rounded-none text-muted-foreground hover:text-primary hover:bg-primary/5 gap-2 group">
                        View Details
                        <ArrowRight className="w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                     </Button>
                  </Link>
               </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
