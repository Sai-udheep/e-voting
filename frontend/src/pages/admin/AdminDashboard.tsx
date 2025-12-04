import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, CheckCircle, BarChart3, UserPlus, Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVoters: 0,
    totalCandidates: 0,
    pendingApprovals: 0,
    totalVotes: 0,
    activeElections: 0,
    approvedCandidates: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAdminStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };
  const dashboardCards = [
    {
      title: 'Manage Users',
      description: 'View, approve, and remove all users',
      icon: Users,
      link: '/admin/users',
      color: 'text-blue-500',
    },
    {
      title: 'Validate Voters',
      description: 'Review and approve pending voters',
      icon: CheckCircle,
      link: '/admin/validate',
      color: 'text-green-500',
    },
    {
      title: 'Manage Elections',
      description: 'Control elections and publish results',
      icon: BarChart3,
      link: '/admin/elections',
      color: 'text-purple-500',
    },
    {
      title: 'Manage Candidates',
      description: 'Add or remove candidates',
      icon: Users,
      link: '/admin/candidates',
      color: 'text-orange-500',
    },
    {
      title: 'Final Results',
      description: 'View complete election results',
      icon: BarChart3,
      link: '/admin/results',
      color: 'text-indigo-500',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage elections, candidates, and voters from your central hub
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

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-bold mb-4">Quick Stats</h3>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Voters</span>
                  <span className="font-bold">{stats.totalVoters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Candidates</span>
                  <span className="font-bold">{stats.approvedCandidates}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pending Approvals</span>
                  <span className="font-bold">{stats.pendingApprovals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Votes Cast</span>
                  <span className="font-bold">{stats.totalVotes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Elections</span>
                  <span className="font-bold">{stats.activeElections}</span>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 bg-muted/50">
            <h3 className="font-bold mb-4">Recent Activity</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <UserPlus className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">New voter registration</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Candidate approved</p>
                  <p className="text-xs text-muted-foreground">15 minutes ago</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
