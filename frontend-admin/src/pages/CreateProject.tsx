import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FolderKanban, IndianRupee, Tag, Users, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function CreateProject() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    technology: "",
    leader_usn: "",
    deadline: "",
    status: "REQUIREMENT",
    github_repo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await api.post("projects/", formData);
      navigate("/admin/projects");
    } catch (err: any) {
      setError(err.response?.data?.detail || JSON.stringify(err.response?.data) || "Project creation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/admin/projects">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold tracking-tight">Create Project Master</h2>
          <p className="text-muted-foreground">Setup a new project and assign it to a student group.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {error && <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-xl">{error}</div>}
          <Card className="rounded-2xl shadow-sm border-border/50">
            <CardHeader className="border-b bg-secondary/20">
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-primary" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Title <span className="text-red-500">*</span></label>
                <Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. AI Medical Assistant" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full min-h-[100px] p-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/50" 
                  placeholder="Briefly describe the project objectives and scope..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Domain / Category <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input name="category" value={formData.category} onChange={handleChange} className="pl-9" placeholder="e.g. Machine Learning" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tech Stack</label>
                  <Input name="technology" value={formData.technology} onChange={handleChange} placeholder="e.g. Python, React, PostgreSQL" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">GitHub Repository</label>
                  <Input name="github_repo" value={formData.github_repo} onChange={handleChange} placeholder="e.g. PuneethKrishnaS/SoftMade" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm border-border/50">
            <CardHeader className="border-b bg-secondary/20">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Assignment & Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Assign to Group Leader (USN) <span className="text-red-500">*</span></label>
                    <Input name="leader_usn" value={formData.leader_usn} onChange={handleChange} placeholder="Search Leader USN..." required />
                    <p className="text-xs text-muted-foreground mt-1">The group will be automatically linked.</p>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Assigned Developer / Guide</label>
                    <Input placeholder="Developer Name" disabled />
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Panel for Financials & Settings */}
        <div className="space-y-6">
          <Card className="rounded-2xl shadow-sm border-border/50 bg-primary/5 border-primary/20">
            <CardHeader className="border-b border-primary/10 bg-primary/10">
              <CardTitle className="flex items-center gap-2 text-primary">
                <IndianRupee className="w-5 h-5" />
                Financials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">Total Project Cost (₹) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground font-medium">₹</span>
                  <Input className="pl-8 bg-background border-primary/20 font-bold" placeholder="0.00" type="number" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Advance Amount Received (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground font-medium">₹</span>
                  <Input className="pl-8 bg-background" placeholder="0.00" type="number" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm border-border/50">
            <CardHeader className="border-b bg-secondary/20">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Expected Delivery Date</label>
                <Input name="deadline" value={formData.deadline} onChange={handleChange} type="date" className="bg-background text-sm" />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={isLoading} className="w-full rounded-xl h-12 text-md font-semibold">
            {isLoading ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </div>
    </form>
  );
}
