import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Vote, FileText, BarChart3, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function CandidateDashboard() {
  const { user } = useAuth();

  const dashboardCards = [
    {
      title: 'Cast Your Vote',
      description: 'Vote for your preferred candidate',
      icon: Vote,
      link: '/candidate/cast-vote',
      color: 'text-blue-500',
    },
    {
      title: 'Submit Nomination',
      description: 'Register your candidacy',
      icon: FileText,
      link: '/candidate/nominate',
      color: 'text-purple-500',
    },
    {
      title: 'View Results',
      description: 'Check election standings',
      icon: BarChart3,
      link: '/candidate/results',
      color: 'text-green-500',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Candidate Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome, {user?.name}. Manage your candidacy and track your performance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {dashboardCards.map((card) => (
            <Card key={card.title} className="p-6 hover:shadow-lg transition-all group">
              <card.icon className={`h-10 w-10 mb-4 ${card.color} group-hover:scale-110 transition-transform`} />
              <h3 className="font-bold text-lg mb-2">{card.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{card.description}</p>
              <Link to={card.link}>
                <Button className="w-full">Access</Button>
              </Link>
            </Card>
          ))}
        </div>

        <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-start gap-4">
            <TrendingUp className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-bold mb-2">Nomination Status</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {user?.isNominated 
                  ? 'Your nomination has been approved. You are an active candidate!' 
                  : 'Submit your nomination to participate in the election.'}
              </p>
              {user?.isNominated && (
                <p className="text-sm text-primary font-medium">
                  ✓ Active Candidate Status
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
