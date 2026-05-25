import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Search, ArrowRight, MessageSquare, Clock, Send, Loader2, Filter, Paperclip, File, Download } from "lucide-react";
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
   const [updatingStatus, setUpdatingStatus] = useState(false);
   const [showMobileChat, setShowMobileChat] = useState(false);
   const ws = useRef<WebSocket | null>(null);
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);
   const user = useAuthStore((state) => state.user);

   const fetchTickets = async () => {
      try {
         const res = await api.get('tickets/');
         setTickets(res.data);
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
         const wsUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace('http', 'ws') + `/ws/tickets/${selectedTicket.id}/`;
         ws.current = new WebSocket(wsUrl);

         ws.current.onmessage = (event) => {
            const messageData = JSON.parse(event.data);
            if (messageData.type === 'status_update') {
               setSelectedTicket((prev: any) => prev ? { ...prev, status: messageData.status } : null);
               setTickets((prev) => prev.map(t => t.id === selectedTicket.id ? { ...t, status: messageData.status } : t));
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

   const updateStatus = async (status: string) => {
      if (!selectedTicket) return;
      setUpdatingStatus(true);
      try {
         const res = await api.patch(`tickets/${selectedTicket.id}/`, { status });
         setTickets(tickets.map(t => t.id === selectedTicket.id ? res.data : t));
         setSelectedTicket(res.data);
      } catch (err) {
         console.error("Failed to update status", err);
      } finally {
         setUpdatingStatus(false);
      }
   };

   return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight">Support Tickets</h2>
          <p className="text-muted-foreground">Respond to student queries, bugs, and modification requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input placeholder="Search ticket ID..." className="pl-9 h-10 rounded-xl" />
          </div>
          <Button variant="outline" className="rounded-xl h-10 gap-2 bg-background">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Ticket List (Hidden on mobile if chat is open) */}
        <div className={cn("lg:col-span-1 space-y-5", showMobileChat ? "hidden lg:block" : "block")}>
           <div className="flex justify-between items-center px-1">
              <h3 className="font-semibold text-sm">Inbox ({tickets.length})</h3>
           </div>
           <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {loading ? (
                 <p className="text-muted-foreground text-sm">Loading tickets...</p>
              ) : tickets.length === 0 ? (
                 <p className="text-muted-foreground text-sm">No tickets found.</p>
              ) : (
                tickets.map((ticket) => (
                  <div 
                    key={ticket.id} 
                    onClick={() => handleSelectTicket(ticket)}
                    className={`p-4 rounded-xl border cursor-pointer transition-colors ${selectedTicket?.id === ticket.id ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-card hover:bg-secondary/20'}`}
                  >
                     <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-xs text-muted-foreground">TKT-{ticket.id}</span>
                        <span className="text-xs text-muted-foreground">{new Date(ticket.created_at).toLocaleDateString()}</span>
                     </div>
                     <h4 className="font-semibold text-sm mb-1">{ticket.title}</h4>
                     <p className="text-xs text-muted-foreground mb-3">{ticket.project?.title}</p>
                     <Badge variant="secondary" className={`text-[10px] ${
                        ticket.status === 'OPEN' ? 'bg-orange-500/10 text-orange-600' :
                        ticket.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-600' :
                        'bg-green-500/10 text-green-600'
                     }`}>{ticket.status}</Badge>
                  </div>
                ))
              )}
           </div>
        </div>

        {/* Chat / Detail View (Hidden on mobile if chat is not open) */}
        <div className={cn("lg:col-span-2", !showMobileChat ? "hidden lg:block" : "block")}>
           {selectedTicket ? (
              <Card className="rounded-2xl shadow-sm border-border/50 h-[600px] flex flex-col bg-card overflow-hidden">
                 <CardHeader className="px-6 py-4 border-b border-border/30 bg-background/50 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                       <Button variant="ghost" size="icon" className="lg:hidden shrink-0" onClick={() => setShowMobileChat(false)}>
                          <ArrowRight className="w-5 h-5 rotate-180" />
                       </Button>
                       <div>
                          <CardTitle className="text-lg font-bold">{selectedTicket.title}</CardTitle>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                             <span className="text-xs text-muted-foreground font-semibold">TKT-{selectedTicket.id} • {selectedTicket.project?.title}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                       <Badge variant="secondary" className={cn("text-[10px] font-bold uppercase tracking-widest px-3 py-1 mr-2", 
                          selectedTicket.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 
                          selectedTicket.status === 'OPEN' ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20' : 
                          'bg-primary/10 text-primary hover:bg-primary/20')}>
                          {selectedTicket.status}
                       </Badge>
                       {selectedTicket.status === 'OPEN' && (
                          <Button size="sm" variant="outline" className="rounded-lg h-8 gap-2 border-primary/20 text-primary hover:bg-primary/10" onClick={() => updateStatus('IN_PROGRESS')} disabled={updatingStatus}>
                            {updatingStatus ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-3.5 h-3.5" />} In Progress
                          </Button>
                       )}
                       {selectedTicket.status !== 'COMPLETED' && (
                          <Button size="sm" className="rounded-lg h-8 gap-2 bg-emerald-500 hover:bg-emerald-600 text-white border-transparent" onClick={() => updateStatus('COMPLETED')} disabled={updatingStatus}>
                            {updatingStatus ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />} Resolve
                          </Button>
                       )}
                    </div>
                 </CardHeader>
                 
                 <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 bg-secondary/5">
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
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-1 shadow-sm ${
                                   isMe ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary'
                                }`}>
                                   {isMe ? 'ME' : msg.sender_role === 'STUDENT' ? 'ST' : 'AD'}
                                </div>
                                <div className={cn("p-4 rounded-2xl text-sm shadow-sm inline-block max-w-[85%]", isMe ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-background border border-border/50 text-foreground rounded-tl-sm")}>
                                   {renderMessage(msg.message)}
                                   <span className={`text-[10px] opacity-70 mt-2 block ${isMe ? 'text-right' : ''}`}>
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
                     <div className="p-5 border-t bg-emerald-500/5 text-center shrink-0">
                        <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">
                           This ticket is marked as completed.
                        </p>
                     </div>
                 ) : (
                     <div className="p-4 border-t bg-background flex items-center gap-3 shrink-0">
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
                          placeholder="Type your reply here..." 
                          className="rounded-xl h-12 bg-secondary/50" 
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <Button className="h-12 w-12 rounded-xl shrink-0" size="icon" onClick={sendMessage} disabled={!newMessage.trim()}>
                           <Send className="w-5 h-5" />
                        </Button>
                     </div>
                 )}
              </Card>
           ) : (
              <Card className="rounded-2xl shadow-sm border-border/50 h-[600px] flex items-center justify-center">
                 <div className="text-center space-y-4 opacity-50">
                    <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground" />
                    <p className="font-semibold text-muted-foreground">Select a ticket to view conversation</p>
                 </div>
              </Card>
           )}
        </div>
      </div>
    </div>
  );
}
