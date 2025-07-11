import { useState } from 'react';
import { Lock, User, KeyRound, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // Store authentication status (in a real app, this would be a JWT token)
        sessionStorage.setItem('adminAuth', 'true');
        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard",
        });
        navigate('/admin/dashboard');
      } else {
        const errorData = await response.json();
        toast({
          title: "Login Failed",
          description: errorData.message || "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-red-900/10"></div>
      
      <Card className="w-full max-w-md shadow-2xl border-0 relative z-10">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto bg-gradient-gold p-4 rounded-full w-20 h-20 flex items-center justify-center shadow-gold">
            <Lock className="h-10 w-10 text-gray-900" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Admin Login</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Secure access to Aditi Avenues admin panel
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full btn-primary text-lg py-6"
              disabled={isLoading || !formData.username || !formData.password}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Sign In Securely
                </>
              )}
            </Button>
          </form>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Protected by enterprise-grade security
            </p>
            <div className="flex items-center justify-center gap-4 mt-2 text-xs text-gray-400">
              <span>🔒 SSL Encrypted</span>
              <span>🛡️ Two-Factor Ready</span>
              <span>📱 HTTPS Only</span>
            </div>
          </div>

          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Website
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;