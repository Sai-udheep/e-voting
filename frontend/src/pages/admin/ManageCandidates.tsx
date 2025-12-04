import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { candidateApi } from '@/lib/api';
import { CheckCircle, XCircle, Trash2, Loader2, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function ManageCandidates() {
  const [pendingNominations, setPendingNominations] = useState<any[]>([]);
  const [allCandidates, setAllCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pending, all] = await Promise.all([
        candidateApi.getPendingNominations(),
        candidateApi.getAllCandidates(),
      ]);
      setPendingNominations(pending);
      setAllCandidates(all);
    } catch (error) {
      toast.error('Failed to load candidates');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, candidateName: string) => {
    try {
      setProcessing(id);
      await candidateApi.approveCandidate(id);
      toast.success(`Candidate ${candidateName} approved!`);
      await loadData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to approve candidate';
      toast.error(errorMessage);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id: string, candidateName: string) => {
    try {
      setProcessing(id);
      await candidateApi.rejectCandidate(id);
      toast.success(`Candidate ${candidateName} rejected!`);
      await loadData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reject candidate';
      toast.error(errorMessage);
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (id: string, candidateName: string) => {
    if (!confirm(`Are you sure you want to remove ${candidateName}?`)) {
      return;
    }

    try {
      setProcessing(id);
      await candidateApi.deleteCandidate(id);
      toast.success(`Candidate ${candidateName} removed!`);
      await loadData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove candidate';
      toast.error(errorMessage);
    } finally {
      setProcessing(null);
    }
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Candidates</h1>
          <p className="text-muted-foreground">
            Approve pending nominations and manage existing candidates
          </p>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="pending">
              Pending Nominations
              {pendingNominations.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pendingNominations.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all">All Candidates</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {pendingNominations.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No pending nominations</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pendingNominations.map((nomination) => (
                  <Card key={nomination.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xl font-bold text-primary-foreground">
                          {nomination.user.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold">{nomination.user.name}</h3>
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          </div>
                          <p className="text-sm text-primary font-medium">{nomination.party}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Election: {nomination.election.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Email: {nomination.user.email} | Phone: {nomination.user.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(nomination.id, nomination.user.name)}
                          disabled={processing === nomination.id}
                        >
                          {processing === nomination.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(nomination.id, nomination.user.name)}
                          disabled={processing === nomination.id}
                        >
                          {processing === nomination.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            {allCandidates.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No candidates found</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {allCandidates.map((candidate) => (
                  <Card key={candidate.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xl font-bold text-primary-foreground">
                          {candidate.user.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold">{candidate.user.name}</h3>
                            <Badge
                              variant={
                                candidate.status === 'APPROVED'
                                  ? 'default'
                                  : candidate.status === 'REJECTED'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {candidate.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-primary font-medium">{candidate.party}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Election: {candidate.election.name}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Votes: {candidate._count?.votes || 0}
                          </p>
                        </div>
                      </div>
                      {candidate.status === 'APPROVED' && candidate._count?.votes === 0 && (
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(candidate.id, candidate.user.name)}
                          disabled={processing === candidate.id}
                        >
                          {processing === candidate.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
