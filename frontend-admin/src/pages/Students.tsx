import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal, Mail, Phone, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("students/");
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to fetch students", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight">Student Management</h2>
          <p className="text-muted-foreground">View, add, or edit registered student accounts.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input placeholder="Search students..." className="pl-9 h-10 rounded-xl" />
          </div>
          <Link to="/admin/students/create">
            <Button className="rounded-xl h-10 gap-2">
              <Plus className="w-4 h-4" /> Add Student
            </Button>
          </Link>
        </div>
      </div>

      <Card className="rounded-2xl shadow-sm border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
             <thead className="text-xs text-muted-foreground uppercase bg-secondary/30 border-b">
                <tr>
                   <th className="px-6 py-4 font-semibold">Student Details</th>
                   <th className="px-6 py-4 font-semibold">USN</th>
                   <th className="px-6 py-4 font-semibold">Group / College</th>
                   <th className="px-6 py-4 font-semibold">Contact</th>
                   <th className="px-6 py-4 font-semibold">Status</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-border/40">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Loading students...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  students.map((student, i) => (
                    <tr key={i} className="bg-card hover:bg-secondary/10 transition-colors">
                       <td className="px-6 py-4">
                          <div className="font-medium text-foreground">{student.user?.first_name || student.user?.username}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{student.user?.email}</div>
                       </td>
                       <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{student.usn}</td>
                       <td className="px-6 py-4">
                          <div className="font-medium">{student.group?.name || 'No Group'}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{student.group?.college_name}</div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex gap-2">
                             <a href={`mailto:${student.user?.email}`}><Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><Mail className="w-4 h-4 text-muted-foreground" /></Button></a>
                             <a href={`tel:${student.phone}`}><Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><Phone className="w-4 h-4 text-muted-foreground" /></Button></a>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <Badge variant="default" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                            Active
                          </Badge>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                             <MoreHorizontal className="w-4 h-4" />
                          </Button>
                       </td>
                    </tr>
                  ))
                )}
             </tbody>
          </table>
        </div>
        <div className="p-4 border-t bg-secondary/10 flex items-center justify-between text-sm text-muted-foreground">
           <span>Showing {students.length} entries</span>
           <div className="flex gap-2">
             <Button variant="outline" size="sm" className="rounded-lg h-8" disabled>Previous</Button>
             <Button variant="outline" size="sm" className="rounded-lg h-8" disabled>Next</Button>
           </div>
        </div>
      </Card>
    </div>
  );
}
