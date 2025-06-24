import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, AlertCircle, Heart, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'donor',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value) => {
    setFormData({ ...formData, role: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl glass-morphism">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-xl">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Join CharityChain</CardTitle>
            <CardDescription className="text-lg">
              Create your account and start making a difference
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-red-600 text-sm font-medium">{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="pl-10 h-12 border-0 bg-muted/50 focus:bg-background transition-colors"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="pl-10 h-12 border-0 bg-muted/50 focus:bg-background transition-colors"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-semibold">
                    Account Type
                  </Label>
                  <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger className="h-12 border-0 bg-muted/50 focus:bg-background">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="donor">Donor - Make donations</SelectItem>
                      <SelectItem value="ngo">NGO - Distribute funds</SelectItem>
                      <SelectItem value="admin">Admin - Platform management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      className="pl-10 pr-10 h-12 border-0 bg-muted/50 focus:bg-background transition-colors"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      className="pl-10 pr-10 h-12 border-0 bg-muted/50 focus:bg-background transition-colors"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 gradient-primary text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-lg font-semibold"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
            
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-medium bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent hover:from-violet-700 hover:to-fuchsia-700 transition-all"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
