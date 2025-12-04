import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { electionApi } from '@/lib/api';
import { Calendar, CheckCircle, XCircle, Loader2, Plus, Trash2, Power } from 'lucide-react';
import { toast } from 'sonner';

export default function ManageElections() {
  const [elections, setElections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newElection, setNewElection] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    loadElections();
  }, []);

  const loadElections = async () => {
    try {
      setLoading(true);
      const data = await electionApi.getAllElections();
      setElections(data);
    } catch (error) {
      toast.error('Failed to load elections');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishResults = async (electionId: string, electionName: string) => {
    try {
      setProcessing(electionId);
      await electionApi.toggleResultsPublished(electionId);
      toast.success(`Results published for ${electionName}!`);
      await loadElections();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to publish results';
      toast.error(errorMessage);
    } finally {
      setProcessing(null);
    }
  };

  const handleUnpublishResults = async (electionId: string, electionName: string) => {
    try {
      setProcessing(electionId);
      await electionApi.toggleResultsPublished(electionId);
      toast.success(`Results unpublished for ${electionName}!`);
      await loadElections();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to unpublish results';
      toast.error(errorMessage);
    } finally {
      setProcessing(null);
    }
  };

  const handleCreateElection = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newElection.name || !newElection.startDate || !newElection.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const startDate = new Date(newElection.startDate);
    const endDate = new Date(newElection.endDate);

    if (endDate <= startDate) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      setIsSubmitting(true);
      await electionApi.createElection({
        name: newElection.name,
        description: newElection.description || undefined,
        startDate: newElection.startDate,
        endDate: newElection.endDate,
      });
      toast.success('Election created successfully!');
      setIsCreateDialogOpen(false);
      setNewElection({ name: '', description: '', startDate: '', endDate: '' });
      await loadElections();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create election';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteElection = async (electionId: string, electionName: string) => {
    try {
      setProcessing(electionId);
      await electionApi.deleteElection(electionId);
      toast.success(`Election "${electionName}" deleted successfully!`);
      await loadElections();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete election';
      toast.error(errorMessage);
    } finally {
      setProcessing(null);
    }
  };

  const handleToggleActive = async (electionId: string, electionName: string, currentStatus: boolean) => {
    try {
      setProcessing(electionId);
      await electionApi.toggleElectionActive(electionId);
      toast.success(`Election "${electionName}" ${currentStatus ? 'deactivated' : 'activated'}!`);
      await loadElections();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update election status';
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Elections</h1>
            <p className="text-muted-foreground">
              Create, manage, and control election status and results
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Election
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleCreateElection}>
                <DialogHeader>
                  <DialogTitle>Create New Election</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new election
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Election Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Presidential Election 2024"
                      value={newElection.name}
                      onChange={(e) => setNewElection({ ...newElection, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of the election"
                      value={newElection.description}
                      onChange={(e) => setNewElection({ ...newElection, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="datetime-local"
                        value={newElection.startDate}
                        onChange={(e) => setNewElection({ ...newElection, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date *</Label>
                      <Input
                        id="endDate"
                        type="datetime-local"
                        value={newElection.endDate}
                        onChange={(e) => setNewElection({ ...newElection, endDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Election
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {elections.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No elections found</p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {elections.map((election) => (
              <Card key={election.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-bold">{election.name}</h3>
                    </div>
                    <p className="text-muted-foreground mb-2">{election.description || 'No description'}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
                      </span>
                      <span className={`font-medium ${election.isActive ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {election.isActive ? '● Active' : '○ Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Status</p>
                      <p className={`text-sm ${election.isActive ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {election.isActive ? '● Active' : '○ Inactive'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Results Status</p>
                      <p className={`text-sm ${election.isResultsPublished ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {election.isResultsPublished ? '✅ Published' : '⏳ Not Published'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(election.id, election.name, election.isActive)}
                      disabled={processing === election.id}
                    >
                      {processing === election.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Power className="h-4 w-4" />
                      )}
                    </Button>
                    
                    {election.isResultsPublished ? (
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnpublishResults(election.id, election.name)}
                        disabled={processing === election.id}
                      >
                        {processing === election.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                      </Button>
                    ) : (
                      <Button 
                        size="sm"
                        onClick={() => handlePublishResults(election.id, election.name)}
                        disabled={processing === election.id}
                      >
                        {processing === election.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </Button>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={processing === election.id || election._count?.votes > 0}
                        >
                          {processing === election.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the election "{election.name}".
                            {election._count?.votes > 0 && (
                              <span className="block mt-2 text-destructive font-medium">
                                ⚠️ Cannot delete: This election has {election._count.votes} vote(s) cast.
                              </span>
                            )}
                            {election._count?.candidates > 0 && (
                              <span className="block mt-1 text-muted-foreground">
                                This election has {election._count.candidates} candidate(s).
                              </span>
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteElection(election.id, election.name)}
                            disabled={election._count?.votes > 0}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
