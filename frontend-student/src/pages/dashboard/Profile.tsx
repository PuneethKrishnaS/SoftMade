import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOutletContext } from "react-router-dom";
import { Users, UserPlus, Building2, Phone, UserCircle, Briefcase, Loader2, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/auth";
import api from "../../lib/api";
import toast from "react-hot-toast";

export default function Profile() {
  const { activeProject } = useOutletContext<{ activeProject: any }>();
  const user = useAuthStore(state => state.user);
  const studentProfile = user?.student_profile;

  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newUsn, setNewUsn] = useState("");
  const [studentPreview, setStudentPreview] = useState<any>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [students, setStudents] = useState<any[]>(activeProject?.students || []);

  const [formData, setFormData] = useState({
    college_name: studentProfile?.college_name || "",
    department: studentProfile?.department || "",
    semester: studentProfile?.semester || 1,
    phone: studentProfile?.phone || "",
  });

  useEffect(() => {
    if (studentProfile) {
      setFormData({
        college_name: studentProfile.college_name || "",
        department: studentProfile.department || "",
        semester: studentProfile.semester || 1,
        phone: studentProfile.phone || "",
      });
    }
  }, [studentProfile]);

  useEffect(() => {
    if (activeProject?.students) {
      setStudents(activeProject.students);
    }
  }, [activeProject]);

  const handleSaveProfile = async () => {
    if (!studentProfile?.id) return;
    setIsSaving(true);
    try {
      await api.patch(`/students/${studentProfile.id}/`, formData);
      toast.success("Profile updated successfully!");
      // In a real app we'd update the auth store here too
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerifyStudent = async () => {
    if (!newUsn.trim()) {
       toast.error("Please enter a USN");
       return;
    }
    setIsPreviewing(true);
    try {
       const res = await api.get(`/students/get_by_usn/?usn=${newUsn.trim()}`);
       setStudentPreview(res.data);
    } catch (err: any) {
       setStudentPreview(null);
       toast.error("Student not found: " + (err.response?.data?.error || "Invalid USN"));
    } finally {
       setIsPreviewing(false);
    }
  };

  const handleAddMember = async () => {
    if (!studentPreview || !activeProject?.id) return;
    setIsAdding(true);
    try {
      const res = await api.post(`/projects/${activeProject.id}/add_student/`, { usn: studentPreview.usn });
      if (res.data.student) {
        setStudents([...students, res.data.student]);
        setNewUsn("");
        setStudentPreview(null);
        toast.success("Member added successfully!");
      }
    } catch (err: any) {
      toast.error("Failed to add member: " + (err.response?.data?.error || "Unknown error"));
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-8xl mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Group Profile & Details</h2>
        <p className="text-muted-foreground">Manage your team members and update your college information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Team Info */}
        <div className="lg:col-span-2 space-y-6">
           {/* Project Context */}
           <Card className="rounded-2xl shadow-sm border-primary/20 bg-primary/5">
             <CardHeader className="pb-3">
                <CardTitle className="text-primary flex items-center gap-2 text-lg">
                  <Briefcase className="w-5 h-5" />
                  Assigned Project
                </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="text-2xl font-bold">{activeProject?.title || 'No Project Assigned'}</div>
                <p className="text-sm text-muted-foreground mt-1">This group is currently assigned to this project.</p>
             </CardContent>
           </Card>

           {/* Personal / College Details Form */}
           <Card className="rounded-2xl shadow-sm border-border/50">
             <CardHeader className="border-b bg-secondary/20">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Group & College Details
                </CardTitle>
                <CardDescription>Only the team leader can update these details.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6 pt-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Team Leader Name</label>
                     <div className="relative">
                       <UserCircle className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                       <Input className="pl-9 bg-secondary/50" value={user?.first_name || ""} readOnly />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Contact Number</label>
                     <div className="relative">
                       <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                       <Input className="pl-9" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                     </div>
                   </div>
                   <div className="space-y-2 md:col-span-2">
                     <label className="text-sm font-medium">College Name</label>
                     <div className="relative">
                       <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                       <Input className="pl-9" value={formData.college_name} onChange={e => setFormData({...formData, college_name: e.target.value})} />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Department / Branch</label>
                     <Input value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Semester</label>
                     <Input type="number" value={formData.semester} onChange={e => setFormData({...formData, semester: parseInt(e.target.value) || 1})} />
                   </div>
                </div>
                <div className="flex justify-end pt-4">
                   <Button className="rounded-xl px-8" onClick={handleSaveProfile} disabled={isSaving}>
                     {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                     Save Details
                   </Button>
                </div>
             </CardContent>
           </Card>
        </div>

        {/* Right Column - Members Management */}
        <div className="space-y-6">
           <Card className="rounded-2xl shadow-sm border-border/50">
              <CardHeader className="border-b bg-secondary/20">
                 <CardTitle className="flex items-center gap-2">
                   <Users className="w-5 h-5 text-primary" />
                   Team Members
                 </CardTitle>
                 <CardDescription>Max 4 members allowed</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                 {/* Member List */}
                 <div className="space-y-4">
                    {students.length > 0 ? students.map(member => (
                       <div key={member.id} className="flex items-center justify-between p-3 rounded-xl border bg-card hover:bg-secondary/20 transition-colors">
                          <div>
                            <div className="font-medium text-sm">{member.user?.first_name || member.usn}</div>
                            <div className="text-xs text-muted-foreground">{member.usn} - {member.department}</div>
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-md font-medium ${member.usn === studentProfile?.usn ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                             {member.usn === studentProfile?.usn ? 'You' : 'Member'}
                          </div>
                       </div>
                    )) : (
                       <div className="text-sm text-muted-foreground py-4 text-center">No members found.</div>
                    )}
                 </div>

                 {/* Add Member form */}
                 <div className="p-4 rounded-xl bg-secondary/30 border border-dashed border-border space-y-4">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                       <UserPlus className="w-4 h-4" /> Add Existing Student
                    </h4>
                    <p className="text-xs text-muted-foreground">Enter the USN of a registered student to add them to your project.</p>
                     <div className="space-y-3">
                       <div className="flex gap-2">
                         <Input 
                           placeholder="University Serial Number (USN)" 
                           className="bg-background h-9 text-sm uppercase" 
                           value={newUsn}
                           onChange={e => setNewUsn(e.target.value)}
                           disabled={!!studentPreview}
                         />
                         {!studentPreview ? (
                            <Button 
                               variant="secondary" 
                               className="h-9 px-4 text-sm shadow-sm"
                               onClick={handleVerifyStudent} 
                               disabled={isPreviewing || !newUsn.trim()}
                            >
                               {isPreviewing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                            </Button>
                         ) : (
                            <Button 
                               variant="outline" 
                               className="h-9 px-4 text-sm"
                               onClick={() => setStudentPreview(null)}
                            >
                               Change
                            </Button>
                         )}
                       </div>
                       
                       {studentPreview && (
                          <div className="p-3 bg-card rounded-md border border-border">
                             <h4 className="font-semibold text-sm">{studentPreview.user?.first_name || studentPreview.usn}</h4>
                             <p className="text-xs text-muted-foreground mt-1">{studentPreview.college_name}</p>
                             <p className="text-xs text-muted-foreground">{studentPreview.department} - Sem {studentPreview.semester}</p>
                          </div>
                       )}

                       <Button 
                         variant="default" 
                         className="w-full h-9 rounded-lg text-sm shadow-sm"
                         onClick={handleAddMember}
                         disabled={isAdding || !studentPreview}
                       >
                         {isAdding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                         Add Member
                       </Button>
                     </div>
                 </div>
              </CardContent>
           </Card>
        </div>

      </div>
    </div>
  );
}
