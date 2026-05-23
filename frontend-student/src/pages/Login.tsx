import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import api from "../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, User } from "lucide-react";
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 selection:bg-primary selection:text-primary-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 blur-[100px] rounded-full" />
         <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/50 blur-[100px] rounded-full" />
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md">
        <Card className="rounded-3xl shadow-2xl border-border/40 backdrop-blur-sm bg-card/95">
          <CardHeader className="space-y-3 text-center pt-10">
            <motion.div variants={itemVariants} className="w-14 h-14 bg-gradient-to-br from-primary to-primary/60 text-primary-foreground rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg shadow-primary/30">
              <Lock className="w-7 h-7" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-3xl font-extrabold tracking-tight">Student Portal</CardTitle>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardDescription className="text-sm px-4">
                Enter your USN and password to access your dashboard.
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="pb-10 px-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl font-medium">
                  {error}
                </motion.div>
              )}
              
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-semibold tracking-wide text-muted-foreground">USN / Username</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-3 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input 
                    className="pl-11 h-12 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-all" 
                    placeholder="e.g. 1RV20CS001" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold tracking-wide text-muted-foreground">Password</label>
                  <a href="#" className="text-xs font-semibold text-primary hover:underline hover:text-primary/80 transition-colors">Forgot password?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-3 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input 
                    className="pl-11 h-12 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-all" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-2">
                <Button 
                  className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5" 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <p className="text-center text-sm font-medium text-muted-foreground mt-8">
                  Don't have an account? <a href="/" className="text-primary hover:underline transition-colors">Contact Admin</a>
                </p>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
