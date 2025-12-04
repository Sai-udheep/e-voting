import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MOCK_CANDIDATES } from '@/lib/mockData';
import { useElection } from '@/contexts/ElectionContext';
import { BarChart3, TrendingUp, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function CandidateViewResults() {
  const { selectedElection, setSelectedElection, elections } = useElection();

  const handleSelectElection = (electionId: string) => {
    const election = elections.find(e => e.id === electionId);
    if (election) {
      setSelectedElection(election);
    }
  };

  if (!selectedElection) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Select Election</h1>
            <p className="text-muted-foreground">Choose an election to view results</p>
          </div>
          <div className="grid gap-6">
            {elections.map((election) => (
              <Card key={election.id} className="p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{election.name}</h3>
                    <p className="text-muted-foreground mb-2">{election.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Status: {election.isResultsPublished ? '✅ Results Published' : '⏳ Results Pending'}
                    </p>
                  </div>
                  <Button onClick={() => handleSelectElection(election.id)}>
                    View
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!selectedElection.isResultsPublished) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Election Results</h1>
              <p className="text-muted-foreground">{selectedElection.name}</p>
            </div>
            <Button variant="outline" onClick={() => setSelectedElection(null)}>
              Change Election
            </Button>
          </div>

          <Card className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Results Not Released Yet</h2>
            <p className="text-muted-foreground">
              The election results for "{selectedElection.name}" have not been published by the admin yet.
              Please check back later.
            </p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const candidates = MOCK_CANDIDATES.filter(c => c.electionId === selectedElection.id);
  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Election Results</h1>
            <p className="text-muted-foreground">{selectedElection.name}</p>
          </div>
          <Button variant="outline" onClick={() => setSelectedElection(null)}>
            Change Election
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <BarChart3 className="h-8 w-8 text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Total Votes</p>
            <p className="text-3xl font-bold">{totalVotes}</p>
          </Card>
          
          <Card className="p-6">
            <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
            <p className="text-sm text-muted-foreground">Leading Candidate</p>
            <p className="text-xl font-bold">{sortedCandidates[0]?.name || 'N/A'}</p>
          </Card>
          
          <Card className="p-6">
            <BarChart3 className="h-8 w-8 text-blue-500 mb-2" />
            <p className="text-sm text-muted-foreground">Total Candidates</p>
            <p className="text-3xl font-bold">{candidates.length}</p>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Candidate Rankings</h2>
          <div className="space-y-6">
            {sortedCandidates.map((candidate, index) => {
              const percentage = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0;
              return (
                <div key={candidate.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-muted-foreground">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-bold">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground">{candidate.party}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{candidate.votes}</p>
                      <p className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-3" />
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
