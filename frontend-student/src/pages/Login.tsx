import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import api from "../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, User } from "lucide-react";

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 selection:bg-primary selection:text-primary-foreground">
      <Card className="w-full max-w-md rounded-2xl shadow-xl border-border/50 animate-in fade-in zoom-in duration-500">
        <CardHeader className="space-y-2 text-center pt-8">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Student Login</CardTitle>
          <CardDescription>
            Enter your USN and password to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">USN / Username</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="pl-9 h-11 rounded-xl" 
                  placeholder="e.g. 1RV20CS001" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Password</label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="pl-9 h-11 rounded-xl" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              className="w-full h-11 rounded-xl text-md font-medium" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            
            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account? <a href="/" className="text-primary hover:underline">Contact Admin</a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
