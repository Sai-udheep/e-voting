import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/api';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PendingVoter {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isPhoneVerified: boolean;
  createdAt: string;
}

export default function ValidateVoters() {
  const [voters, setVoters] = useState<PendingVoter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingVoters();
  }, []);

  const loadPendingVoters = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getPendingVoters();
      setVoters(data);
    } catch (error) {
      toast.error('Failed to load pending voters');
      console.error('Error loading pending voters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      await adminApi.approveVoter(userId);
      setVoters(voters.filter(v => v.id !== userId));
      toast.success('Voter approved successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to approve voter';
      toast.error(errorMessage);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      await adminApi.removeUser(userId);
      setVoters(voters.filter(v => v.id !== userId));
      toast.success('Voter removed successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove voter';
      toast.error(errorMessage);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Validate Voters</h1>
          <p className="text-muted-foreground">
            Review and approve or reject pending voter registrations
          </p>
        </div>

        {loading ? (
          <Card className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading pending voters...</p>
          </Card>
        ) : voters.length === 0 ? (
          <Card className="p-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">All Clear!</h3>
            <p className="text-muted-foreground">No pending voter validations</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {voters.map((voter) => (
              <Card key={voter.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{voter.name}</h3>
                      <p className="text-sm text-muted-foreground">{voter.email}</p>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-muted-foreground">Phone:</span> {voter.phone}</p>
                      <p><span className="text-muted-foreground">Role:</span> {voter.role}</p>
                      <p><span className="text-muted-foreground">Phone Verified:</span> {voter.isPhoneVerified ? 'Yes' : 'No'}</p>
                      <p><span className="text-muted-foreground">Registered:</span> {new Date(voter.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleApprove(voter.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(voter.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
