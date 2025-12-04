import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { electionApi, voteApi } from '@/lib/api';
import { Download, TrendingUp, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

export default function AdminResults() {
  const [elections, setElections] = useState<any[]>([]);
  const [selectedElectionId, setSelectedElectionId] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);

  useEffect(() => {
    loadElections();
  }, []);

  useEffect(() => {
    if (selectedElectionId) {
      loadResults(selectedElectionId);
    }
  }, [selectedElectionId]);

  const loadElections = async () => {
    try {
      setLoading(true);
      const data = await electionApi.getAllElections();
      setElections(data);
      if (data.length > 0) {
        setSelectedElectionId(data[0].id);
      }
    } catch (error) {
      toast.error('Failed to load elections');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadResults = async (electionId: string) => {
    try {
      setLoadingResults(true);
      const data = await voteApi.getElectionResults(electionId);
      setResults(data);
    } catch (error: any) {
      // Backend should allow admins to see unpublished results
      // If we get a 403, it might be an auth issue, not a published issue
      if (error.message?.includes('not published') || error.message?.includes('403')) {
        console.warn('Error loading results:', error.message);
        // Don't show error toast for unpublished results - admin should still see them
        if (!error.message?.includes('not published')) {
          toast.error('Failed to load results. Please check your authentication.');
        }
      } else {
        toast.error('Failed to load results');
      }
      console.error(error);
      setResults(null);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleExport = () => {
    toast.success('Results exported successfully!');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!results || !results.candidates) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Election Results</h1>
              <p className="text-muted-foreground">View complete results and analytics</p>
            </div>
          </div>
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Select an election to view results</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const totalVotes = results.election.totalVotes || 0;
  const sortedCandidates = [...results.candidates].sort((a: any, b: any) => b.votes - a.votes);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Election Results</h1>
            <p className="text-muted-foreground">
              Complete results and analytics
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedElectionId} onValueChange={setSelectedElectionId}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select election" />
              </SelectTrigger>
              <SelectContent>
                {elections.map((election) => (
                  <SelectItem key={election.id} value={election.id}>
                    {election.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          </div>
        </div>

        {loadingResults ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>

        <div className="grid md:grid-cols-4 gap-6">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Votes</p>
            <p className="text-3xl font-bold">{totalVotes}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Winner</p>
            <p className="text-xl font-bold">{sortedCandidates[0].name}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Winning Votes</p>
            <p className="text-3xl font-bold">{sortedCandidates[0].votes}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Turnout</p>
            <p className="text-3xl font-bold">
              {results.election.totalEligibleVoters > 0
                ? ((totalVotes / results.election.totalEligibleVoters) * 100).toFixed(1)
                : '0.0'}%
            </p>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Detailed Results</h2>
          </div>
          
          <div className="space-y-6">
            {sortedCandidates.map((candidate: any, index: number) => {
              const percentage = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0;
              return (
                <div key={candidate.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`text-3xl font-bold ${
                        index === 0 ? 'text-yellow-500' : 
                        index === 1 ? 'text-gray-400' : 
                        index === 2 ? 'text-orange-600' : 'text-muted-foreground'
                      }`}>
                        #{index + 1}
                      </div>
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xl font-bold text-primary-foreground">
                        {candidate.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-lg">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground">{candidate.party}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{candidate.votes}</p>
                      <p className="text-sm text-muted-foreground">{percentage.toFixed(2)}%</p>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-4" />
                </div>
              );
            })}
          </div>
        </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
