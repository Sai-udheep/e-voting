import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Vote, BarChart3, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useElection } from '@/contexts/ElectionContext';
import { voteApi } from '@/lib/api';

export default function VoterDashboard() {
  const { user } = useAuth();
  const { selectedElection, elections } = useElection();
  const [hasVotedMessage, setHasVotedMessage] = useState<string>('Checking your voting status...');
  const activeElection = selectedElection || elections.find((e) => e.isActive);

  useEffect(() => {
    let isMounted = true;

    const checkStatus = async () => {
      if (!activeElection) {
        if (isMounted) setHasVotedMessage('No active election available right now.');
        return;
      }

      try {
        const result = await voteApi.hasVoted(activeElection.id);
        if (!isMounted) return;
        if (result.hasVoted) {
          setHasVotedMessage(`You just voted in "${activeElection.name}". Thank you for participating!`);
        } else {
          setHasVotedMessage(`You haven't voted yet in "${activeElection.name}". Cast your vote now.`);
        }
      } catch (error) {
        console.error('Failed to check voting status', error);
        if (isMounted) {
          setHasVotedMessage('Unable to fetch your voting status right now.');
        }
      }
    };

    checkStatus();

    return () => {
      isMounted = false;
    };
  }, [activeElection]);

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
              <p className="text-sm text-muted-foreground mb-3">{hasVotedMessage}</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
