import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

type Role = 'judge' | 'clerk';

const Login = () => {
  const [username, setUsername] = useState('hon. justice');
  const [password, setPassword] = useState('justice2025');
  const [role, setRole] = useState<Role>('judge');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter username and password",
        variant: "destructive",
      });
      return;
    }

    const success = login(username, password, role);
    
    if (success) {
      toast({
        title: "Welcome",
        description: `Logged in as ${role}`,
      });
      navigate(`/${role}`);
    } else {
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen court-hero flex items-center justify-center p-4 relative overflow-hidden -ml-[120px] -mr-[120px]">
      {/* Justice pattern background */}
      <div className="absolute inset-0 justice-pattern pointer-events-none" />
      
      <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-accent relative z-10 glass-card">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center mb-4">
            <img src="/judicial-removebg-preview.png" alt="Judicial System Logo" className="w-20 h-20 object-contain" />
          </div>
          <CardTitle className="text-4xl font-display text-foreground">Judicial AI Suite</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Secure Court Management Technology
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <Select value={role} onValueChange={(value) => {
                  setRole(value as Role);
                  // Auto-fill credentials based on role
                  if (value === 'judge') {
                    setUsername('hon. justice');
                    setPassword('justice2025');
                  } else if (value === 'clerk') {
                    setUsername('court.clerk');
                    setPassword('clerk2025');
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Court Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="judge">Circuit Judge</SelectItem>
                    <SelectItem value="clerk">Court Clerk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full court-gold-gradient hover:opacity-90 transition-opacity" size="lg">
              <LogIn className="w-4 h-4 mr-2" />
              Login to Court System
            </Button>

            <div className="flex items-center justify-between text-xs mt-4">
              <a href="#" className="text-accent hover:underline">Forgot Password?</a>
              <a href="#" className="text-accent hover:underline">Need Help?</a>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="fixed bottom-4 text-center w-full text-sm text-white/80 z-10">
        © 2025 Judicial AI Suite – Secure Court Technology
      </div>
    </div>
  );
};

export default Login;
