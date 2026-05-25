import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import api from "../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Lock, User, Terminal, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const setTokens = useAuthStore(state => state.setTokens);
  const fetchProfile = useAuthStore(state => state.fetchProfile);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await api.post("auth/login/", {
        username: username.toLowerCase(),
        password,
      });
      
      setTokens(res.data.access, res.data.refresh);
      await fetchProfile();
      
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background selection:bg-primary selection:text-primary-foreground font-sans">
      
      {/* Left Panel - Visual Showcase */}
      <div className="hidden md:flex md:w-[45%] lg:w-[55%] relative overflow-hidden bg-foreground p-10 flex-col justify-between border-r border-border/10">
        <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500 blur-[120px] rounded-full mix-blend-screen" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500 blur-[120px] rounded-full mix-blend-screen" />
        </div>
        
        {/* Abstract Grid Pattern */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="relative z-10 flex items-center gap-3">
            <img src="/logo.avif" alt="Softmake Logo" className="h-8 brightness-0 invert" />
        </div>

        <div className="relative z-10 my-auto">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-md space-y-6"
            >
                <div className="inline-flex items-center rounded-full border border-background/20 px-4 py-1.5 text-xs font-medium text-background/80 bg-background/5 backdrop-blur-sm shadow-xl">
                    <Terminal className="w-3.5 h-3.5 mr-2" />
                    Student Portal
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold text-background leading-[1.1] tracking-tight">
                    Manage your <br/>academic projects with precision.
                </h1>
                <p className="text-background/70 text-lg leading-relaxed">
                    Track milestones, download resources, and communicate directly with your dedicated developers in real-time.
                </p>
                
                <div className="pt-8 grid grid-cols-2 gap-6 border-t border-background/10 mt-8">
                    <div>
                        <div className="text-3xl font-bold text-background mb-1">24/7</div>
                        <div className="text-[10px] text-background/60 uppercase tracking-widest font-bold">Live Tracking</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-background mb-1">100%</div>
                        <div className="text-[10px] text-background/60 uppercase tracking-widest font-bold">Plagiarism Free</div>
                    </div>
                </div>
            </motion.div>
        </div>

        <div className="relative z-10 text-background/40 text-xs font-medium">
            © 2026 Softmake IT Solutions. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-12 bg-background relative">
        <Link to="/" className="absolute top-6 right-6 sm:top-10 sm:right-10 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full border border-border/50 hover:bg-muted">
            Back to Home <ArrowRight className="w-4 h-4" />
        </Link>
        
        {/* Mobile Logo */}
        <div className="md:hidden flex items-center justify-center mb-12">
            <img src="/logo.avif" alt="Softmake Logo" className="h-10 mix-blend-multiply dark:mix-blend-normal" />
        </div>
        
        <div className="w-full max-w-sm mx-auto">
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
                <div className="space-y-3">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 border border-primary/20 shadow-inner">
                        <LayoutDashboard className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Welcome back</h2>
                    <p className="text-muted-foreground text-sm sm:text-base">Enter your USN and password to access your dashboard.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl font-medium flex items-center gap-3">
                            {error}
                        </motion.div>
                    )}
                    
                    <div className="space-y-2.5">
                        <label className="text-sm font-semibold tracking-wide text-foreground">USN / Username</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input 
                                className="pl-12 h-14 rounded-2xl border-border bg-muted/30 focus:bg-background transition-all text-base focus-visible:ring-2 focus-visible:ring-primary/20" 
                                placeholder="e.g. 1RV20CS001" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold tracking-wide text-foreground">Password</label>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input 
                                className="pl-12 h-14 rounded-2xl border-border bg-muted/30 focus:bg-background transition-all text-base focus-visible:ring-2 focus-visible:ring-primary/20" 
                                type="password" 
                                placeholder="••••••••" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <Button 
                        className="w-full h-14 rounded-2xl text-base font-bold shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden group mt-2" 
                        type="submit" 
                        disabled={isLoading}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {isLoading ? "Authenticating..." : "Sign Into Dashboard"} 
                            {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </span>
                        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out"></div>
                    </Button>
                </form>

                <div className="pt-6 border-t border-border/50 text-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account? <Link to="/" className="text-foreground font-semibold hover:underline decoration-primary underline-offset-4 transition-all">Contact Admin</Link>
                    </p>
                </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
}
