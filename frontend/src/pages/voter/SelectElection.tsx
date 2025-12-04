import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useElection } from '@/contexts/ElectionContext';
import { useNavigate } from 'react-router-dom';
import { Vote, Calendar, Info } from 'lucide-react';

export default function SelectElection() {
  const { elections, setSelectedElection } = useElection();
  const navigate = useNavigate();

  const handleSelectElection = (election: any) => {
    setSelectedElection(election);
    navigate('/voter/cast-vote');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Select Election</h1>
          <p className="text-muted-foreground">
            Choose an election to participate in
          </p>
        </div>

        <div className="grid gap-6">
          {elections.filter(e => e.isActive).map((election) => (
            <Card key={election.id} className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Vote className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-bold">{election.name}</h3>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      {election.description}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <Button onClick={() => handleSelectElection(election)}>
                  Participate
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
