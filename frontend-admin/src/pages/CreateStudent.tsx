import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, UserPlus, Building2, Phone, Mail, Key } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function CreateStudent() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    contact_number: "",
    usn: "",
    college_name: "",
    branch: "",
    semester: "8",
    password: "Softmade@2026",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await api.post("students/register-leader/", {
        ...formData,
        semester: parseInt(formData.semester)
      });
      navigate("/admin/students");
    } catch (err: any) {
      setError(err.response?.data?.detail || JSON.stringify(err.response?.data) || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/admin/students">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold tracking-tight">Add Team Leader</h2>
          <p className="text-muted-foreground">Register a new student account as a group leader.</p>
        </div>
      </div>

      <Card className="rounded-2xl shadow-sm border-border/50">
        <CardHeader className="border-b bg-secondary/20">
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Leader Details
          </CardTitle>
          <CardDescription>
            This account will be designated as the Team Leader. Only the leader's primary details are required; they can add their own team members later from the student portal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-8">
          <form onSubmit={handleSubmit}>
            {error && <div className="mb-6 p-3 text-sm text-red-500 bg-red-500/10 rounded-xl">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Personal Info */}
             <div className="space-y-6">
                <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name <span className="text-red-500">*</span></label>
                  <Input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="e.g. Rahul Sharma" required />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input name="email" value={formData.email} onChange={handleChange} className="pl-9" placeholder="student@example.com" type="email" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input name="contact_number" value={formData.contact_number} onChange={handleChange} className="pl-9" placeholder="+91 9876543210" required />
                  </div>
                </div>
             </div>

             {/* Academic Info */}
             <div className="space-y-6">
                <h3 className="font-semibold text-lg border-b pb-2">Academic Information</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">USN / Student ID <span className="text-red-500">*</span></label>
                  <Input name="usn" value={formData.usn} onChange={handleChange} placeholder="e.g. 1RV20CS001" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">College Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input name="college_name" value={formData.college_name} onChange={handleChange} className="pl-9" placeholder="e.g. RV College of Engineering" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Branch</label>
                    <Input name="branch" value={formData.branch} onChange={handleChange} placeholder="CSE" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Semester</label>
                    <Input name="semester" value={formData.semester} onChange={handleChange} type="number" placeholder="8" />
                  </div>
                </div>
             </div>
          </div>

          {/* Account Security */}
          <div className="space-y-6 pt-4 border-t mt-8">
             <h3 className="font-semibold text-lg">Account Security</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input name="password" value={formData.password} onChange={handleChange} className="pl-9" type="password" required />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">The student can change this after their first login.</p>
                </div>
             </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t mt-8">
            <Link to="/admin/students">
              <Button variant="outline" type="button" className="rounded-xl px-8">Cancel</Button>
            </Link>
            <Button type="submit" className="rounded-xl px-8" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register Leader"}
            </Button>
          </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
