import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Vote, Shield, Users, BarChart3 } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Vote className="h-8 w-8 text-primary" />
            <span>VoteSecure</span>
          </div>
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="outline" size="lg">Login</Button>
            </Link>
            <Link to="/register">
              <Button size="lg">Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Democracy Made Digital
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Secure, transparent, and accessible online voting for the modern age. 
          Your voice matters, make it heard.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
          </Link>
          <Link to="/register">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Register to Vote
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Secure Voting</h3>
            <p className="text-sm text-muted-foreground">
              Bank-level encryption ensures your vote remains confidential and tamper-proof
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Easy Access</h3>
            <p className="text-sm text-muted-foreground">
              Vote from anywhere, anytime. No lines, no hassle, just democracy
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Real-time Results</h3>
            <p className="text-sm text-muted-foreground">
              Track election progress with live updates and transparent reporting
            </p>
          </Card>
        </div>
      </section>

    </div>
  );
}
