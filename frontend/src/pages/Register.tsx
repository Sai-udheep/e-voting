import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Vote, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { UserRole } from '@/types';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'voter' as UserRole,
    dateOfBirth: '',
    address: '',
  });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, verifyOtp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.dateOfBirth) {
        toast.error('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      // Frontend age check (must be 18+)
      const dob = new Date(formData.dateOfBirth);
      if (isNaN(dob.getTime())) {
        toast.error('Please enter a valid date of birth');
        setIsLoading(false);
        return;
      }
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear() - (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
      if (age < 18) {
        toast.error('You must be at least 18 years old to register');
        setIsLoading(false);
        return;
      }

      const success = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        dateOfBirth: formData.dateOfBirth,
      });

      if (success) {
        setStep('verify');
        toast.info('Please enter the OTP sent to your phone');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      if (verifyOtp) {
        const success = await verifyOtp(formData.phone, otp);
        if (success) {
          toast.success('Registration complete! Please wait for admin approval.');
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('OTP verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Vote className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Voter Registration</h1>
          <p className="text-muted-foreground">Create your account to participate in elections</p>
        </div>

        {step === 'register' ? (
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Register as *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="voter">Voter</SelectItem>
                    <SelectItem value="candidate">Candidate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="Enter your full address"
                value={formData.address}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register & Send OTP'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-muted-foreground mb-2">
                OTP has been sent to <strong>{formData.phone}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Please enter the 6-digit code to verify your phone number
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP *</Label>
              <Input
                id="otp"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                disabled={isLoading}
                className="text-center text-2xl tracking-widest"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setStep('register');
                  setOtp('');
                }}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button type="submit" className="flex-1" size="lg" disabled={isLoading || otp.length !== 6}>
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </div>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    const { authApi } = await import('@/lib/api');
                    await authApi.resendOtp(formData.phone);
                    toast.success('OTP resent successfully!');
                  } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to resend OTP';
                    toast.error(errorMessage);
                    console.error('Resend OTP error:', error);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
                className="text-sm"
              >
                {isLoading ? 'Sending...' : 'Resend OTP'}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link to="/login" className="text-primary hover:underline font-medium">
            Login here
          </Link>
        </div>
      </Card>
    </div>
  );
}
