import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadCloud, UploadCloud, FileText, FileCode, Presentation, FileArchive } from "lucide-react";

const DOWNLOADS = [
  { name: "Project Synopsis", type: "PDF", size: "2.4 MB", date: "Oct 12, 2026", icon: FileText, available: true },
  { name: "Mid-Term Report", type: "DOCX", size: "4.1 MB", date: "Nov 05, 2026", icon: FileText, available: true },
  { name: "Final Presentation", type: "PPTX", size: "12.8 MB", date: "Pending", icon: Presentation, available: false },
  { name: "Source Code", type: "ZIP", size: "45.2 MB", date: "Pending", icon: FileCode, available: false },
  { name: "Android APK", type: "APK", size: "28.5 MB", date: "Pending", icon: FileArchive, available: false },
];

export default function Downloads() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Files & Resources</h2>
        <p className="text-muted-foreground">Download project deliverables or upload college formats.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Downloads List */}
        <div className="lg:col-span-2 space-y-4">
           <Card className="rounded-2xl shadow-sm border-border/50">
             <CardHeader className="bg-secondary/30 border-b">
                <CardTitle className="flex items-center gap-2">
                  <DownloadCloud className="w-5 h-5 text-primary" />
                  Available Downloads
                </CardTitle>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y divide-border/40">
                  {DOWNLOADS.map((file, i) => (
                     <div key={i} className="flex items-center justify-between p-4 md:p-6 hover:bg-secondary/20 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className={`p-3 rounded-xl ${file.available ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                              <file.icon className="w-6 h-6" />
                           </div>
                           <div>
                             <h4 className="font-medium">{file.name}</h4>
                             <p className="text-sm text-muted-foreground mt-0.5">
                               {file.type} • {file.available ? file.size : file.date}
                             </p>
                           </div>
                        </div>
                        <Button 
                          variant={file.available ? "default" : "outline"} 
                          disabled={!file.available}
                          className="rounded-xl px-6"
                        >
                          {file.available ? 'Download' : 'Unavailable'}
                        </Button>
                     </div>
                  ))}
                </div>
             </CardContent>
           </Card>
        </div>

        {/* Upload Section */}
        <div className="space-y-6">
           <Card className="rounded-2xl shadow-sm border-border/50 bg-primary/5 border-primary/10">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <UploadCloud className="w-5 h-5 text-primary" />
                   Upload Documents
                 </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="border-2 border-dashed border-primary/20 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-background/50 hover:bg-background transition-colors cursor-pointer group">
                    <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                       <UploadCloud className="w-8 h-8" />
                    </div>
                    <h3 className="font-medium mt-4">Drag & drop files here</h3>
                    <p className="text-sm text-muted-foreground mt-1 text-center">
                       Upload college formats, IEEE papers, or correction screenshots.
                    </p>
                    <Button className="mt-6 rounded-xl w-full" variant="outline">Browse Files</Button>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
