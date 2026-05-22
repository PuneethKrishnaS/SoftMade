import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, FolderKanban, IndianRupee, Tag, Users, Calendar, Check, ChevronsUpDown, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { cn } from "@/lib/utils";

const DOMAINS = [
  "Web Development", "Machine Learning", "Data Science", 
  "Mobile App Development", "Cybersecurity", "Blockchain",
  "IoT", "Cloud Computing"
];

const TECH_OPTIONS = [
  "React", "Angular", "Vue", "Next.js", "Node.js", "Django", 
  "Flask", "Spring Boot", "Express", "PostgreSQL", "MongoDB", 
  "MySQL", "Python", "Java", "C++", "AWS", "Docker"
];

export default function CreateProject() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Data for Comboboxes
  const [students, setStudents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [openStudent, setOpenStudent] = useState(false);
  const [openGuide, setOpenGuide] = useState(false);
  const [openDomain, setOpenDomain] = useState(false);
  const [openTech, setOpenTech] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    technology: "",
    leader_usn: "",
    assigned_developer: "",
    deadline: "",
    status: "REQUIREMENT",
    github_repo: "",
    total_price: "",
    advance_payment: "",
  });

  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);

  useEffect(() => {
    // Fetch students and guides
    api.get("students/").then(res => setStudents(res.data)).catch(console.error);
    api.get("users/").then(res => setUsers(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    // Convert array of selected techs back to string for backend
    const payload = { ...formData, technology: selectedTechs.join(", ") };
    // If assigned_developer is empty, send null or remove it
    if (!payload.assigned_developer) {
       delete (payload as any).assigned_developer;
    }

    try {
      const res = await api.post("projects/", payload);
      navigate(`/admin/projects/${res.data.id}`);
    } catch (err: any) {
      const data = err.response?.data;
      if (data && typeof data === 'object' && !data.detail) {
         const firstErrorKey = Object.keys(data)[0];
         const firstErrorMsg = Array.isArray(data[firstErrorKey]) ? data[firstErrorKey][0] : data[firstErrorKey];
         setError(firstErrorMsg || "Project creation failed.");
      } else {
         setError(data?.detail || JSON.stringify(data) || "Project creation failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleTech = (tech: string) => {
    setSelectedTechs(prev => 
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-8xl mx-auto pb-16">
      
      {/* Sticky Header with Actions */}
      <div className="sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background/80 backdrop-blur-md pb-4 pt-2 border-b border-border/50">
        <div className="flex items-center gap-4">
          <Link to="/admin/projects">
            <Button variant="ghost" size="icon" className="rounded-full bg-secondary/50 hover:bg-secondary">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold tracking-tight">Create Project Master</h2>
            <p className="text-sm text-muted-foreground">Setup a new project and assign it to a student group.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link to="/admin/projects">
            <Button type="button" variant="outline" className="rounded-xl px-6 h-11">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading} className="rounded-xl px-8 h-11 shadow-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
            {isLoading ? "Creating..." : "Save Project"}
          </Button>
        </div>
      </div>

      {error && <div className="p-4 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-2">{error}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-6">
        
        {/* Main Column - Project Details (Spans 2 columns) */}
        <div className="xl:col-span-2 space-y-8">
          <Card className="rounded-2xl shadow-sm border-border bg-card overflow-hidden">
            <CardHeader className="border-b bg-secondary/10 px-8 py-5">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-primary/10 rounded-lg"><FolderKanban className="w-5 h-5 text-primary" /></div>
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="space-y-3">
                <label className="text-sm font-semibold tracking-wide">Project Title <span className="text-destructive">*</span></label>
                <Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. AI Medical Assistant" required className="h-12 text-lg rounded-xl border-border focus-visible:ring-primary/20 shadow-sm" />
                <p className="text-xs text-muted-foreground">The official title of the project. This will be displayed on all receipts and reports.</p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold tracking-wide">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full min-h-[140px] p-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-y shadow-sm" 
                  placeholder="Briefly describe the project objectives, scope, and target outcomes..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Domain Combobox */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide flex items-center gap-2">
                     <Tag className="h-4 w-4 text-muted-foreground" /> Domain / Category <span className="text-destructive">*</span>
                  </label>
                  <Popover open={openDomain} onOpenChange={setOpenDomain}>
                     <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" aria-expanded={openDomain} className="w-full justify-between h-12 rounded-xl border-border font-normal bg-background shadow-sm">
                           {formData.category || "Select a category..."}
                           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                     </PopoverTrigger>
                     <PopoverContent className="w-[300px] p-0" align="start">
                        <Command>
                           <CommandInput placeholder="Search category..." />
                           <CommandList>
                           <CommandEmpty>No category found.</CommandEmpty>
                           <CommandGroup>
                              {DOMAINS.map((domain) => (
                                 <CommandItem key={domain} onSelect={(val) => { setFormData({...formData, category: domain}); setOpenDomain(false); }}>
                                    <Check className={cn("mr-2 h-4 w-4", formData.category === domain ? "opacity-100" : "opacity-0")} />
                                    {domain}
                                 </CommandItem>
                              ))}
                           </CommandGroup>
                           </CommandList>
                        </Command>
                     </PopoverContent>
                  </Popover>
                </div>
                
                {/* Tech Stack Multi-select */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide">Tech Stack</label>
                  <Popover open={openTech} onOpenChange={setOpenTech}>
                     <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" aria-expanded={openTech} className="w-full justify-between h-auto min-h-[48px] rounded-xl border-border font-normal bg-background shadow-sm hover:bg-background">
                           <div className="flex flex-wrap gap-1 items-center">
                              {selectedTechs.length > 0 ? (
                                 selectedTechs.map(tech => (
                                    <Badge key={tech} variant="secondary" className="mr-1 rounded-sm">
                                       {tech}
                                       <div role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); toggleTech(tech); }} className="ml-1 hover:bg-muted rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                          <X className="h-3 w-3" />
                                       </div>
                                    </Badge>
                                 ))
                              ) : (
                                 <span className="text-muted-foreground">Select technologies...</span>
                              )}
                           </div>
                           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                     </PopoverTrigger>
                     <PopoverContent className="w-[300px] p-0" align="start">
                        <Command>
                           <CommandInput placeholder="Search tech..." />
                           <CommandList>
                           <CommandEmpty>No technology found.</CommandEmpty>
                           <CommandGroup>
                              {TECH_OPTIONS.map((tech) => (
                                 <CommandItem key={tech} onSelect={() => toggleTech(tech)}>
                                    <Check className={cn("mr-2 h-4 w-4", selectedTechs.includes(tech) ? "opacity-100" : "opacity-0")} />
                                    {tech}
                                 </CommandItem>
                              ))}
                           </CommandGroup>
                           </CommandList>
                        </Command>
                     </PopoverContent>
                  </Popover>
                  <p className="text-[11px] text-muted-foreground">Select multiple technologies for the project stack.</p>
                </div>
                
                <div className="space-y-3 md:col-span-2">
                  <label className="text-sm font-semibold tracking-wide">GitHub Repository</label>
                  <Input name="github_repo" value={formData.github_repo} onChange={handleChange} className="h-12 rounded-xl border-border font-mono text-sm shadow-sm" placeholder="e.g. PuneethKrishnaS/SoftMade" />
                  <p className="text-[11px] text-muted-foreground">Format: username/repository. Required to fetch README, documents, and releases.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column - Logistics (Spans 1 column) */}
        <div className="space-y-8">
          
          {/* Assignment */}
          <Card className="rounded-2xl shadow-sm border-border bg-card overflow-hidden">
            <CardHeader className="border-b bg-secondary/10 px-6 py-4">
              <CardTitle className="flex items-center gap-3 text-base">
                <div className="p-2 bg-blue-500/10 rounded-lg"><Users className="w-4 h-4 text-blue-600" /></div>
                Assignment & Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold tracking-wide">Group Leader (USN) <span className="text-destructive">*</span></label>
                <Popover open={openStudent} onOpenChange={setOpenStudent}>
                   <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" aria-expanded={openStudent} className="w-full justify-between h-11 rounded-xl border-border bg-background shadow-sm font-mono text-sm">
                         {formData.leader_usn ? formData.leader_usn : <span className="text-muted-foreground font-sans">Select Student USN...</span>}
                         <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                   </PopoverTrigger>
                   <PopoverContent className="w-[300px] p-0" align="start">
                      <Command>
                         <CommandInput placeholder="Search USN or Name..." />
                         <CommandList>
                         <CommandEmpty>No student found.</CommandEmpty>
                         <CommandGroup>
                            {students.map((student) => (
                               <CommandItem key={student.usn} onSelect={() => { setFormData({...formData, leader_usn: student.usn}); setOpenStudent(false); }}>
                                  <Check className={cn("mr-2 h-4 w-4", formData.leader_usn === student.usn ? "opacity-100" : "opacity-0")} />
                                  <div className="flex flex-col">
                                    <span className="font-mono text-xs">{student.usn}</span>
                                    <span className="text-muted-foreground text-xs">{student.user?.first_name || student.user?.username}</span>
                                  </div>
                               </CommandItem>
                            ))}
                         </CommandGroup>
                         </CommandList>
                      </Command>
                   </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground leading-relaxed">Search from registered students.</p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold tracking-wide">Assigned Developer / Guide</label>
                <Popover open={openGuide} onOpenChange={setOpenGuide}>
                   <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" aria-expanded={openGuide} className="w-full justify-between h-11 rounded-xl border-border bg-background shadow-sm font-normal">
                         {formData.assigned_developer ? users.find(u => u.id.toString() === formData.assigned_developer)?.username : <span className="text-muted-foreground">Select a guide...</span>}
                         <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                   </PopoverTrigger>
                   <PopoverContent className="w-[300px] p-0" align="start">
                      <Command>
                         <CommandInput placeholder="Search users..." />
                         <CommandList>
                         <CommandEmpty>No users found.</CommandEmpty>
                         <CommandGroup>
                            {users.map((u) => (
                               <CommandItem key={u.id} onSelect={() => { setFormData({...formData, assigned_developer: u.id.toString()}); setOpenGuide(false); }}>
                                  <Check className={cn("mr-2 h-4 w-4", formData.assigned_developer === u.id.toString() ? "opacity-100" : "opacity-0")} />
                                  <div className="flex flex-col">
                                    <span className="text-sm">{u.username}</span>
                                    <span className="text-muted-foreground text-xs">{u.role}</span>
                                  </div>
                               </CommandItem>
                            ))}
                         </CommandGroup>
                         </CommandList>
                      </Command>
                   </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          {/* Financials */}
          <Card className="rounded-2xl shadow-sm border-border bg-card overflow-hidden">
            <CardHeader className="border-b bg-secondary/10 px-6 py-4">
              <CardTitle className="flex items-center gap-3 text-base">
                <div className="p-2 bg-emerald-500/10 rounded-lg"><IndianRupee className="w-4 h-4 text-emerald-600" /></div>
                Financial Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold tracking-wide">Total Project Cost <span className="text-destructive">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-muted-foreground font-medium">₹</span>
                  <Input name="total_price" value={formData.total_price} onChange={handleChange} className="pl-9 h-11 text-lg font-bold rounded-xl border-border bg-background shadow-sm" placeholder="0.00" type="number" required />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold tracking-wide">Advance Received</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-muted-foreground font-medium">₹</span>
                  <Input name="advance_payment" value={formData.advance_payment} onChange={handleChange} className="pl-9 h-11 rounded-xl border-border bg-background shadow-sm" placeholder="0.00" type="number" />
                </div>
                <p className="text-[11px] text-muted-foreground">This will be immediately marked as paid.</p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="rounded-2xl shadow-sm border-border bg-card overflow-hidden">
            <CardHeader className="border-b bg-secondary/10 px-6 py-4">
              <CardTitle className="flex items-center gap-3 text-base">
                <div className="p-2 bg-orange-500/10 rounded-lg"><Calendar className="w-4 h-4 text-orange-600" /></div>
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold tracking-wide">Expected Delivery Date</label>
                <Input name="deadline" value={formData.deadline} onChange={handleChange} type="date" className="h-11 rounded-xl border-border shadow-sm" />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </form>
  );
}
