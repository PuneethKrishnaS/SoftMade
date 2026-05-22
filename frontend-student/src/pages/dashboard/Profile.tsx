import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOutletContext } from "react-router-dom";
import { Users, UserPlus, Building2, Phone, UserCircle, Briefcase } from "lucide-react";

const TEAM_MEMBERS = [
  { id: 1, name: "Rahul Sharma", usn: "1RV20CS001", role: "Leader" },
  { id: 2, name: "Priya Singh", usn: "1RV20CS002", role: "Member" },
];

export default function Profile() {
  const { activeProject } = useOutletContext<{ activeProject: { name: string, id: string, role: string } }>();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
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
                <div className="text-2xl font-bold">{activeProject.name}</div>
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
                       <Input className="pl-9" defaultValue="Rahul Sharma" />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Contact Number</label>
                     <div className="relative">
                       <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                       <Input className="pl-9" defaultValue="+91 9876543210" />
                     </div>
                   </div>
                   <div className="space-y-2 md:col-span-2">
                     <label className="text-sm font-medium">College Name</label>
                     <div className="relative">
                       <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                       <Input className="pl-9" defaultValue="RV College of Engineering" />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Department / Branch</label>
                     <Input defaultValue="Computer Science" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Semester</label>
                     <Input defaultValue="8th Semester" />
                   </div>
                </div>
                <div className="flex justify-end pt-4">
                   <Button className="rounded-xl px-8">Save Details</Button>
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
                    {TEAM_MEMBERS.map(member => (
                       <div key={member.id} className="flex items-center justify-between p-3 rounded-xl border bg-card hover:bg-secondary/20 transition-colors">
                          <div>
                            <div className="font-medium text-sm">{member.name}</div>
                            <div className="text-xs text-muted-foreground">{member.usn}</div>
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-md font-medium ${member.role === 'Leader' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                             {member.role}
                          </div>
                       </div>
                    ))}
                 </div>

                 {/* Add Member form */}
                 <div className="p-4 rounded-xl bg-secondary/30 border border-dashed border-border space-y-4">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                       <UserPlus className="w-4 h-4" /> Add New Member
                    </h4>
                    <div className="space-y-3">
                       <Input placeholder="Member Name" className="bg-background h-9 text-sm" />
                       <Input placeholder="University Serial Number (USN)" className="bg-background h-9 text-sm" />
                       <Input placeholder="Email Address" type="email" className="bg-background h-9 text-sm" />
                       <Button variant="secondary" className="w-full h-9 rounded-lg text-sm bg-background hover:bg-background/80 shadow-sm">
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
