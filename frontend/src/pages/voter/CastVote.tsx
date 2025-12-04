import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { candidateApi, voteApi, electionApi } from '@/lib/api';
import { useElection } from '@/contexts/ElectionContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { CheckCircle, Vote, Users, Loader2 } from 'lucide-react';

export default function CastVote() {
  const { selectedElection, setSelectedElection, elections, refreshElections } = useElection();
  const { user } = useAuth();
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [hasVotedInElection, setHasVotedInElection] = useState(false);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedCandidateData, setSelectedCandidateData] = useState<any>(null);

  useEffect(() => {
    if (selectedElection) {
      loadCandidates();
      checkVoteStatus();
    }
  }, [selectedElection]);

  const loadCandidates = async () => {
    if (!selectedElection) return;
    try {
      setLoading(true);
      const data = await candidateApi.getCandidatesByElection(selectedElection.id);
      setCandidates(data);
    } catch (error) {
      toast.error('Failed to load candidates');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const checkVoteStatus = async () => {
    if (!selectedElection || !user) return;
    try {
      const result = await voteApi.hasVoted(selectedElection.id);
      setHasVotedInElection(result.hasVoted);
    } catch (error) {
      console.error('Failed to check vote status:', error);
    }
  };

  const handleVote = (candidateId: string) => {
    if (hasVotedInElection) {
      toast.error('You have already voted in this election');
      return;
    }
    const candidate = candidates.find((c: any) => c.id === candidateId);
    setSelectedCandidate(candidateId);
    setSelectedCandidateData(candidate);
    setShowConfirmDialog(true);
  };

  const confirmVote = async () => {
    if (!selectedCandidate || !selectedElection) {
      toast.error('Please select a candidate');
      return;
    }

    if (hasVotedInElection) {
      toast.error('You have already voted in this election');
      return;
    }

    try {
      setSubmitting(true);
      setShowConfirmDialog(false);
      await voteApi.castVote({
        electionId: selectedElection.id,
        candidateId: selectedCandidate,
      });
      setHasVoted(true);
      setHasVotedInElection(true);
      toast.success('Your vote has been recorded successfully!');
      await refreshElections();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cast vote';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
      setSelectedCandidateData(null);
    }
  };

  const handleSelectElection = async (electionId: string) => {
    try {
      const election = await electionApi.getElectionById(electionId);
      const mappedElection = {
        id: election.id,
        name: election.name,
        description: election.description || '',
        startDate: election.startDate,
        endDate: election.endDate,
        isActive: election.isActive,
        isResultsPublished: election.isResultsPublished,
      };
      setSelectedElection(mappedElection);
      setHasVoted(false);
      setSelectedCandidate(null);
    } catch (error) {
      toast.error('Failed to load election');
      console.error(error);
    }
  };

  if (!selectedElection) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Select Election</h1>
            <p className="text-muted-foreground">Choose an election to cast your vote</p>
          </div>
          <div className="grid gap-6">
            {elections.filter(e => e.isActive).map((election) => (
              <Card key={election.id} className="p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{election.name}</h3>
                    <p className="text-muted-foreground">{election.description}</p>
                  </div>
                  <Button onClick={() => handleSelectElection(election.id)}>
                    Select
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (hasVoted) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <CheckCircle className="h-20 w-20 text-green-500 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Vote Recorded!</h1>
          <p className="text-muted-foreground max-w-md mb-4">
            Thank you for participating in "{selectedElection.name}". Your vote has been securely recorded.
          </p>
          <Button onClick={() => { setHasVoted(false); setSelectedElection(null); }}>
            Back to Elections
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">Cast Your Vote</h1>
            <Button variant="outline" onClick={() => setSelectedElection(null)}>
              Change Election
            </Button>
          </div>
          <p className="text-muted-foreground">
            Election: {selectedElection.name}
          </p>
          {hasVotedInElection && (
            <p className="text-sm text-primary font-medium mt-2">
              ✓ You have already voted in this election
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <Card className="p-6 bg-muted/50">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Total Candidates</p>
                  <p className="text-2xl font-bold">{candidates.length}</p>
                </div>
              </div>
            </Card>

            {candidates.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No approved candidates for this election</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {candidates.map((candidate) => (
                  <Card
                    key={candidate.id}
                    className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                      selectedCandidate === candidate.id
                        ? 'ring-2 ring-primary bg-primary/5'
                        : ''
                    } ${hasVotedInElection ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !hasVotedInElection && handleVote(candidate.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-2xl font-bold text-primary-foreground">
                        {candidate.user.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{candidate.user.name}</h3>
                        <p className="text-sm text-primary font-medium mb-2">{candidate.party}</p>
                      </div>
                      {selectedCandidate === candidate.id && (
                        <CheckCircle className="h-6 w-6 text-primary" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <div className="flex justify-end">
              <Button variant="outline" size="lg" onClick={() => setSelectedElection(null)}>
                Change Election
              </Button>
            </div>
          </>
        )}

        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to vote for <strong>{selectedCandidateData?.user?.name}</strong> ({selectedCandidateData?.party}) in the election <strong>{selectedElection?.name}</strong>?
                <br />
                <br />
                This action cannot be undone. Once you submit your vote, you cannot change it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setShowConfirmDialog(false);
                setSelectedCandidate(null);
                setSelectedCandidateData(null);
              }}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={confirmVote} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Yes, Confirm Vote'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
