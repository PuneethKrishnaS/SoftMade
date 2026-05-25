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
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-200 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-5 sm:p-6 bg-card/40 border border-border/40 rounded-[32px] shadow-xl backdrop-blur-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 p-32 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
         <div className="flex flex-col gap-2 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Group Profile & Details</h2>
          <p className="text-muted-foreground font-medium text-sm sm:text-base">Manage your team members and update your college information.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        
        {/* Left Column - Team Info */}
        <div className="xl:col-span-2 space-y-5">
           {/* Project Context */}
           <Card className="rounded-[32px] shadow-xl border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm hover:-translate-y-1 transition-transform duration-200 overflow-hidden relative">
             <div className="absolute top-0 right-0 p-24 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
             <CardHeader className="pb-3 px-8 pt-8 relative z-10">
                <CardTitle className="text-primary flex items-center gap-2.5 text-[11px] uppercase tracking-widest font-bold">
                  <Briefcase className="w-4 h-4" />
                  Assigned Project
                </CardTitle>
             </CardHeader>
             <CardContent className="px-8 pb-8 relative z-10">
                <div className="text-2xl font-extrabold tracking-tight text-foreground">{activeProject?.title || 'No Project Assigned'}</div>
                <p className="text-sm text-foreground/70 mt-1 font-medium">This group is currently assigned to this project.</p>
             </CardContent>
           </Card>

           {/* Personal / College Details Form */}
           <Card className="rounded-[32px] border-border/40 shadow-xl bg-card/40 backdrop-blur-sm overflow-hidden hover:border-foreground/20 transition-colors duration-200">
             <CardHeader className="px-6 py-4 border-b border-border/30 bg-background/20">
                <CardTitle className="flex items-center gap-2.5 text-xs uppercase tracking-widest font-bold text-foreground">
                  <Building2 className="w-4 h-4 text-primary" />
                  Group & College Details
                </CardTitle>
                <CardDescription className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-2">Only the team leader can update these details.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6 p-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2.5">
                     <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Team Leader Name</label>
                     <div className="relative group">
                       <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                       <Input className="pl-11 h-12 bg-background/50 backdrop-blur-md border-border/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl font-medium" value={user?.first_name || ""} readOnly />
                     </div>
                   </div>
                   <div className="space-y-2.5">
                     <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contact Number</label>
                     <div className="relative group">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                       <Input className="pl-11 h-12 bg-background/50 backdrop-blur-md border-border/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl font-medium" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                     </div>
                   </div>
                   <div className="space-y-2.5 md:col-span-2">
                     <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">College Name</label>
                     <div className="relative group">
                       <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                       <Input className="pl-11 h-12 bg-background/50 backdrop-blur-md border-border/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl font-medium" value={formData.college_name} onChange={e => setFormData({...formData, college_name: e.target.value})} />
                     </div>
                   </div>
                   <div className="space-y-2.5">
                     <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Department / Branch</label>
                     <Input className="h-12 bg-background/50 backdrop-blur-md border-border/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl font-medium px-4" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                   </div>
                   <div className="space-y-2.5">
                     <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Semester</label>
                     <Input className="h-12 bg-background/50 backdrop-blur-md border-border/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl font-medium px-4" type="number" value={formData.semester} onChange={e => setFormData({...formData, semester: parseInt(e.target.value) || 1})} />
                   </div>
                </div>
                <div className="flex justify-end pt-6 border-t border-border/30">
                   <Button className="rounded-xl h-12 px-8 font-bold shadow-lg hover:shadow-primary/20 transition-colors hover:-translate-y-0.5" onClick={handleSaveProfile} disabled={isSaving}>
                     {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                     Save Details
                   </Button>
                </div>
             </CardContent>
           </Card>
        </div>

        {/* Right Column - Members Management */}
        <div className="space-y-5">
           <Card className="rounded-[32px] border-border/40 shadow-xl bg-card/40 backdrop-blur-sm overflow-hidden hover:border-foreground/20 transition-colors duration-200 hover:-translate-y-1">
              <CardHeader className="px-6 py-4 border-b border-border/30 bg-background/20">
                 <CardTitle className="flex items-center gap-2.5 text-xs uppercase tracking-widest font-bold text-foreground">
                   <Users className="w-4 h-4 text-primary" />
                   Team Members
                 </CardTitle>
                 <CardDescription className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-2">Max 4 members allowed</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                 {/* Member List */}
                 <div className="space-y-4">
                    {students.length > 0 ? students.map(member => (
                       <div key={member.id} className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-background/50 hover:bg-card/80 shadow-sm transition-colors group">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-sm shrink-0 border border-border/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                {member.user?.first_name ? member.user.first_name.charAt(0).toUpperCase() : 'M'}
                             </div>
                             <div>
                               <div className="font-bold text-sm text-foreground/90 group-hover:text-foreground transition-colors">{member.user?.first_name || member.usn}</div>
                               <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">{member.usn} - {member.department}</div>
                             </div>
                          </div>
                          <div className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-lg font-bold border ${member.usn === studentProfile?.usn ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary/50 text-secondary-foreground border-border/50'}`}>
                             {member.usn === studentProfile?.usn ? 'You' : 'Member'}
                          </div>
                       </div>
                    )) : (
                       <div className="text-xs font-semibold text-muted-foreground py-8 text-center uppercase tracking-widest border border-dashed border-border/50 rounded-2xl bg-background/30">No members found.</div>
                    )}
                 </div>

                 {/* Add Member form */}
                 <div className="p-6 rounded-2xl bg-background/40 border border-border/50 shadow-sm space-y-6">
                    <div>
                       <h4 className="text-sm font-bold flex items-center gap-2 mb-1">
                          <UserPlus className="w-4 h-4 text-primary" /> Add Existing Student
                       </h4>
                       <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">Enter the USN of a registered student to add them to your project.</p>
                    </div>
                     <div className="space-y-4">
                       <div className="flex gap-3">
                         <Input 
                           placeholder="Enter USN" 
                           className="bg-background/80 h-11 text-sm uppercase rounded-xl border-border/50 focus:border-primary focus:ring-1 focus:ring-primary font-medium px-4" 
                           value={newUsn}
                           onChange={e => setNewUsn(e.target.value)}
                           disabled={!!studentPreview}
                         />
                         {!studentPreview ? (
                            <Button 
                               variant="secondary" 
                               className="h-11 px-6 text-xs font-bold uppercase tracking-widest shadow-sm rounded-xl border-border/50 bg-secondary/80 hover:bg-secondary"
                               onClick={handleVerifyStudent} 
                               disabled={isPreviewing || !newUsn.trim()}
                            >
                               {isPreviewing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                            </Button>
                         ) : (
                            <Button 
                               variant="outline" 
                               className="h-11 px-6 text-xs font-bold uppercase tracking-widest shadow-sm rounded-xl border-border/50 hover:bg-secondary/80"
                               onClick={() => setStudentPreview(null)}
                            >
                               Change
                            </Button>
                         )}
                       </div>
                       
                       {studentPreview && (
                          <div className="p-5 bg-card/80 rounded-2xl border border-border/50 shadow-sm">
                             <h4 className="font-extrabold text-sm mb-1">{studentPreview.user?.first_name || studentPreview.usn}</h4>
                             <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{studentPreview.college_name}</p>
                             <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">{studentPreview.department} - Sem {studentPreview.semester}</p>
                          </div>
                       )}

                       <Button 
                         variant="default" 
                         className="w-full h-12 rounded-xl text-xs uppercase tracking-widest font-bold shadow-lg hover:shadow-primary/20 transition-colors hover:-translate-y-0.5"
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
