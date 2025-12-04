import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { candidateApi, electionApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function SubmitNomination() {
  const { user } = useAuth();
  const [elections, setElections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    electionId: '',
    party: '',
  });

  useEffect(() => {
    loadElections();
  }, []);

  const loadElections = async () => {
    try {
      setLoading(true);
      const activeElections = await electionApi.getActiveElections();
      setElections(activeElections);
    } catch (error) {
      toast.error('Failed to load elections');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleElectionChange = (value: string) => {
    setFormData({ ...formData, electionId: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.electionId || !formData.party) {
      toast.error('Please select an election and enter party name');
      return;
    }

    try {
      setSubmitting(true);
      await candidateApi.submitNomination({
        electionId: formData.electionId,
        party: formData.party,
      });
      toast.success('Nomination submitted successfully! Awaiting admin approval.');
      setFormData({ electionId: '', party: '' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit nomination';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ electionId: '', party: '' });
    toast.info('Nomination form cleared');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold mb-2">Submit Nomination</h1>
          <p className="text-muted-foreground">
            Register yourself as a candidate for an upcoming election
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Candidate Name</Label>
              <Input
                id="name"
                value={user?.name || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Your name from registration
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="election">Select Election</Label>
              {loading ? (
                <div className="p-3 border rounded-md text-sm text-muted-foreground">
                  Loading elections...
                </div>
              ) : elections.length === 0 ? (
                <div className="p-3 border rounded-md text-sm text-muted-foreground">
                  No active elections available
                </div>
              ) : (
                <Select value={formData.electionId} onValueChange={handleElectionChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an election" />
                  </SelectTrigger>
                  <SelectContent>
                    {elections.map((election) => (
                      <SelectItem key={election.id} value={election.id}>
                        {election.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="party">Political Party</Label>
              <Input
                id="party"
                name="party"
                placeholder="Party name or Independent"
                value={formData.party}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                size="lg" 
                onClick={handleCancel} 
                className="flex-1"
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                size="lg" 
                className="flex-1"
                disabled={submitting || !formData.electionId || !formData.party}
              >
                {submitting ? 'Submitting...' : 'Submit Nomination'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
