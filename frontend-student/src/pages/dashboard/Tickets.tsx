import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Ticket as TicketIcon, Search, MessageSquarePlus, MessageSquare, Send, ArrowRight, Paperclip, Loader2, File, Download } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

export default function Tickets() {
   const [tickets, setTickets] = useState<any[]>([]);
   const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
   const [messages, setMessages] = useState<any[]>([]);
   const [newMessage, setNewMessage] = useState("");
   const [loading, setLoading] = useState(true);
   const [uploadingFile, setUploadingFile] = useState(false);
   const ws = useRef<WebSocket | null>(null);
   const [showMobileChat, setShowMobileChat] = useState(false);
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);
   const user = useAuthStore((state) => state.user);

   const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
   const [newTicketForm, setNewTicketForm] = useState({ title: '', description: '', priority: 'MEDIUM' });
   const [creating, setCreating] = useState(false);
   const [projects, setProjects] = useState<any[]>([]);

   const fetchTickets = async () => {
      try {
         const res = await api.get('tickets/');
         setTickets(res.data);
         if (res.data.length > 0 && !selectedTicket) {
            handleSelectTicket(res.data[0]);
         }
         
         const projRes = await api.get('projects/');
         setProjects(projRes.data);
      } catch (err) {
         console.error("Failed to fetch tickets", err);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchTickets();
      // eslint-disable-next-line
   }, []);

   const handleSelectTicket = (ticket: any) => {
      setSelectedTicket(ticket);
      setMessages(ticket.messages || []);
      setShowMobileChat(true);
   };

   useEffect(() => {
      if (selectedTicket) {
         // Connect to WebSocket
         const wsUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace('http', 'ws') + `/ws/tickets/${selectedTicket.id}/`;
         ws.current = new WebSocket(wsUrl);

         ws.current.onmessage = (event) => {
            const messageData = JSON.parse(event.data);
            if (messageData.type === 'status_update') {
               setSelectedTicket((prev: any) => prev ? { ...prev, status: messageData.status } : null);
               setTickets((prev: any) => prev.map((t: any) => t.id === selectedTicket?.id ? { ...t, status: messageData.status } : t));
            } else if (messageData.type === 'chat_message' || messageData.message) {
               setMessages((prev) => [...prev, messageData]);
            }
         };

         return () => {
            ws.current?.close();
         };
      }
   }, [selectedTicket?.id]);

   useEffect(() => {
      if (messagesEndRef.current) {
         messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
   }, [messages]);

   const sendMessage = () => {
      if (!newMessage.trim() || !ws.current || !selectedTicket) return;

      if (ws.current.readyState === WebSocket.OPEN) {
         ws.current.send(JSON.stringify({
            message: newMessage,
            sender_id: user?.id
         }));
         setNewMessage("");
      }
   };

   const uploadAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !selectedTicket) return;
      
      setUploadingFile(true);
      const formData = new FormData();
      formData.append("file", file);
      
      try {
         const res = await api.post(`tickets/${selectedTicket.id}/upload_attachment/`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
         });
         const attachmentMsg = `📁 **Attachment:** [${res.data.file_name}](/api/tickets/${selectedTicket.id}/attachment/?name=${res.data.safe_name})`;
         
         if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({
               message: attachmentMsg,
               sender_id: user?.id
            }));
         }
      } catch (err) {
         console.error("Upload failed", err);
         alert("Failed to upload file to GitHub.");
      } finally {
         setUploadingFile(false);
         if (fileInputRef.current) fileInputRef.current.value = "";
      }
   };

   const renderMessage = (text: string) => {
      const parts = text.split(/(\[.*?\]\(.*?\))/g);
      return parts.map((part, i) => {
         const match = part.match(/\[(.*?)\]\((.*?)\)/);
         if (match) {
            const fileName = match[1];
            const baseUrl = api.defaults.baseURL?.replace(/\/api\/?$/, '') || 'http://localhost:8000';
            const url = match[2].startsWith('/') ? `${baseUrl}${match[2]}` : match[2];
            
            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
            if (isImage) {
               return (
                  <div key={i} className="my-2 rounded-xl overflow-hidden border border-border/50 max-w-xs sm:max-w-sm">
                     <img src={url} alt={fileName} className="w-full h-auto object-cover" />
                  </div>
               );
            }
            return (
               <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 my-2 p-3 rounded-xl bg-background border border-border/50 text-foreground hover:bg-secondary/80 transition-colors shadow-sm">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary"><File className="w-5 h-5" /></div>
                  <span className="font-semibold text-sm truncate max-w-[150px] sm:max-w-[200px]">{fileName}</span>
                  <Download className="w-4 h-4 ml-1 opacity-50" />
               </a>
            );
         }
         return <span key={i}>{part}</span>;
      });
   };

   const createTicket = async () => {
      if (!newTicketForm.title.trim() || !newTicketForm.description.trim() || projects.length === 0 || !user) return;
      setCreating(true);
      try {
         const student_id = user.student_profile?.id;
         const res = await api.post('tickets/', {
            ...newTicketForm,
            project: projects[0].id,
            student: student_id
         });
         setTickets([res.data, ...tickets]);
         setIsNewTicketModalOpen(false);
         setNewTicketForm({ title: '', description: '', priority: 'MEDIUM' });
         handleSelectTicket(res.data);
      } catch (err) {
         console.error("Failed to create ticket", err);
      } finally {
         setCreating(false);
      }
   };

   const hasActiveTicket = tickets.some(t => ['OPEN', 'IN_PROGRESS', 'PENDING'].includes(t.status));

   return (
    <div className="space-y-5 max-w-[1600px] mx-auto pb-10">
      
      {isNewTicketModalOpen && (
         <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl rounded-[32px] border-border/40 animate-in zoom-in-95 duration-200">
               <CardHeader className="border-b bg-secondary/20 py-5">
                  <CardTitle className="text-xl">Raise New Ticket</CardTitle>
               </CardHeader>
               <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-muted-foreground">Title</label>
                     <Input 
                        placeholder="e.g. Database connection issue" 
                        value={newTicketForm.title}
                        onChange={e => setNewTicketForm({...newTicketForm, title: e.target.value})}
                        className="rounded-xl h-12"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-muted-foreground">Description</label>
                     <textarea 
                        placeholder="Describe the issue in detail..." 
                        value={newTicketForm.description}
                        onChange={e => setNewTicketForm({...newTicketForm, description: e.target.value})}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[120px]"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-muted-foreground">Priority</label>
                     <select 
                        value={newTicketForm.priority}
                        onChange={e => setNewTicketForm({...newTicketForm, priority: e.target.value})}
                        className="flex h-12 w-full items-center justify-between rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                     >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                     </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                     <Button variant="outline" className="flex-1 rounded-xl h-12 font-bold" onClick={() => setIsNewTicketModalOpen(false)}>Cancel</Button>
                     <Button className="flex-1 rounded-xl h-12 font-bold" onClick={createTicket} disabled={creating}>
                        {creating ? "Creating..." : "Submit Ticket"}
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-5 sm:p-6 bg-card/40 border border-border/40 rounded-[32px] shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 p-32 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
         <div className="flex flex-col gap-2 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Support Tickets</h2>
          <p className="text-muted-foreground font-medium text-sm sm:text-base">Raise changes, report bugs, or get help directly from the developers.</p>
        </div>
        {!hasActiveTicket ? (
           <Button onClick={() => setIsNewTicketModalOpen(true)} className="rounded-xl h-12 px-6 gap-2 shadow-md relative z-10 text-sm font-bold">
             <MessageSquarePlus className="w-4 h-4" />
             Raise New Ticket
           </Button>
        ) : (
           <div className="relative z-10 text-sm font-bold text-muted-foreground bg-secondary/50 px-6 h-12 rounded-xl flex items-center gap-2 border border-border/50">
             <CheckCircle2 className="w-4 h-4" />
             Ticket Currently Active
           </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Ticket List (Hidden on mobile if chat is open) */}
        <div className={cn("lg:col-span-1 space-y-5", showMobileChat ? "hidden lg:block" : "block")}>
           <Card className="rounded-[32px] border-border/40 shadow-sm bg-card/40 overflow-hidden h-[600px] flex flex-col">
             <CardHeader className="px-6 py-4 border-b border-border/30 bg-background/20 shrink-0">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Inbox ({tickets.length})</CardTitle>
             </CardHeader>
             <CardContent className="p-0 flex-1 overflow-y-auto">
                <div className="divide-y divide-border/30">
                  {loading ? (
                     <div className="p-5 text-center text-sm text-muted-foreground">Loading tickets...</div>
                  ) : tickets.length === 0 ? (
                     <div className="p-5 text-center text-sm text-muted-foreground">No tickets found.</div>
                  ) : (
                    tickets.map((ticket) => (
                      <div 
                        key={ticket.id} 
                        onClick={() => handleSelectTicket(ticket)}
                        className={`p-5 cursor-pointer transition-colors ${selectedTicket?.id === ticket.id ? 'bg-primary/10 border-l-4 border-primary' : 'hover:bg-secondary/40 border-l-4 border-transparent'}`}
                      >
                         <div className="flex justify-between items-start mb-2">
                            <span className="font-mono text-[10px] uppercase tracking-wider bg-secondary border border-border/50 px-2 py-0.5 rounded-md">TKT-{ticket.id}</span>
                            <Badge variant="outline" className={`text-[9px] uppercase tracking-widest px-2 py-0.5 border ${
                               ticket.status === 'COMPLETED' || ticket.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                               ticket.status === 'IN_PROGRESS' || ticket.status === 'In Progress' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 
                               'bg-orange-500/10 text-orange-600 border-orange-500/20'
                            }`}>{ticket.status}</Badge>
                         </div>
                         <h4 className="font-bold text-sm text-foreground/90 mb-1 truncate">{ticket.title}</h4>
                         <p className="text-xs text-muted-foreground truncate">{ticket.description}</p>
                      </div>
                    ))
                  )}
                </div>
             </CardContent>
           </Card>
        </div>

        {/* Chat / Detail View (Hidden on mobile if chat is not open) */}
        <div className={cn("lg:col-span-2", !showMobileChat ? "hidden lg:block" : "block")}>
           {selectedTicket ? (
              <Card className="rounded-[32px] border-border/40 shadow-sm bg-card/40 overflow-hidden h-[600px] flex flex-col">
                 <CardHeader className="px-6 py-4 border-b border-border/30 bg-background/20 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                       <Button variant="ghost" size="icon" className="lg:hidden shrink-0" onClick={() => setShowMobileChat(false)}>
                          <ArrowRight className="w-5 h-5 rotate-180" />
                       </Button>
                       <div>
                          <CardTitle className="text-lg font-bold">{selectedTicket.title}</CardTitle>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                             <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest">{selectedTicket.category}</Badge>
                             <span className="text-xs text-muted-foreground font-semibold">{selectedTicket.project_name}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                       <Badge variant="secondary" className={cn("text-[10px] font-bold uppercase tracking-widest px-3 py-1", 
                          selectedTicket.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                          selectedTicket.status === 'OPEN' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                          'bg-primary/10 text-primary border-primary/20')}>
                          {selectedTicket.status}
                       </Badge>
                    </div>
                 </CardHeader>
                 
                 <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 bg-background/10">
                    {messages.length === 0 ? (
                       <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-4">
                          <MessageSquare className="w-12 h-12" />
                          <p className="text-sm font-semibold tracking-wide">No messages yet. Start the conversation!</p>
                       </div>
                    ) : (
                       messages.map((msg: any, i: number) => {
                          const isMe = msg.sender_id === user?.id || msg.sender?.id === user?.id || msg.sender === user?.id;
                          return (
                             <div key={i} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-1 shadow-inner ${
                                   isMe ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground border border-border'
                                }`}>
                                   {isMe ? 'ME' : msg.sender_role === 'ADMIN' || msg.sender_role === 'SUPERADMIN' ? 'AD' : 'DEV'}
                                </div>
                                <div className={cn("p-4 rounded-2xl text-sm shadow-sm inline-block max-w-[85%]", isMe ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-background border border-border/50 text-foreground rounded-tl-sm")}>
                                   {renderMessage(msg.message)}
                                   <span className={`text-[9px] text-muted-foreground mt-2 block uppercase tracking-wider font-semibold ${isMe ? 'text-white/70' : ''}`}>
                                      {msg.sender_name || (msg.sender?.first_name || msg.sender?.username)} • {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                   </span>
                                </div>
                             </div>
                          );
                       })
                    )}
                    <div ref={messagesEndRef} />
                 </CardContent>

                 {selectedTicket.status === 'COMPLETED' ? (
                     <div className="p-5 border-t border-border/30 bg-emerald-500/5 text-center shrink-0">
                        <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">
                           This query is resolved. No further chat is allowed.
                        </p>
                        <p className="text-xs text-emerald-600/70 mt-1 font-semibold">Please raise a new ticket for further queries.</p>
                     </div>
                 ) : (
                     <div className="p-4 border-t border-border/30 bg-background/40 flex items-center gap-3 shrink-0">
                        <input type="file" className="hidden" ref={fileInputRef} onChange={uploadAttachment} />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-12 w-12 rounded-xl shrink-0" 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingFile}
                        >
                           {uploadingFile ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : <Paperclip className="w-5 h-5 text-muted-foreground" />}
                        </Button>
                        <Input 
                          placeholder="Type your message here..." 
                          className="rounded-xl h-12 bg-background border-border shadow-sm focus-visible:ring-primary/50" 
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <Button 
                          className="h-12 px-6 rounded-xl shrink-0 shadow-sm transition-colors font-bold tracking-wide" 
                          onClick={sendMessage}
                          disabled={!newMessage.trim()}
                        >
                           <Send className="w-4 h-4 mr-2" /> Send
                        </Button>
                     </div>
                 )}
              </Card>
           ) : (
              <Card className="rounded-[32px] border-border/40 shadow-sm bg-card/40 overflow-hidden h-[600px] flex items-center justify-center">
                 <div className="text-center space-y-4 opacity-50">
                    <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground" />
                    <p className="font-semibold tracking-widest text-muted-foreground uppercase text-sm">Select a ticket to view conversation</p>
                 </div>
              </Card>
           )}
        </div>

      </div>
    </div>
  );
}
