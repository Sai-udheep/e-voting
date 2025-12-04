import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Vote, BarChart3, FileText, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function VoterDashboard() {
  const { user } = useAuth();

  const dashboardCards = [
    {
      title: 'Cast Your Vote',
      description: 'Vote for your preferred candidate',
      icon: Vote,
      link: '/voter/cast-vote',
      color: 'text-blue-500',
    },
    {
      title: 'View Results',
      description: 'Check live election results',
      icon: BarChart3,
      link: '/voter/results',
      color: 'text-green-500',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Voter Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Your voting power starts here.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
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

        <Card className="p-6 bg-muted/50">
          <div className="flex items-start gap-4">
            <TrendingUp className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-bold mb-2">Your Voting Status</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {user?.votedElections && user.votedElections.length > 0
                  ? `You have voted in ${user.votedElections.length} election(s). Thank you for participating!` 
                  : 'You have not voted yet. Make your voice heard today!'}
              </p>
              {user?.isNominated && (
                <p className="text-sm text-primary font-medium">
                  ✓ Your nomination is currently under review
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
