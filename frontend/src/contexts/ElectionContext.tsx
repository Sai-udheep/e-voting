import React, { createContext, useContext, useState, useEffect } from 'react';
import { Election } from '@/types';
import { electionApi } from '@/lib/api';

interface ElectionContextType {
  elections: Election[];
  selectedElection: Election | null;
  setSelectedElection: (election: Election | null) => void;
  refreshElections: () => Promise<void>;
  loading: boolean;
}

const ElectionContext = createContext<ElectionContextType | undefined>(undefined);

export function ElectionProvider({ children }: { children: React.ReactNode }) {
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState(true);

  const loadElections = async () => {
    try {
      setLoading(true);
      const data = await electionApi.getActiveElections();
      // Map backend data to frontend Election type
      const mappedElections: Election[] = data.map((e: any) => ({
        id: e.id,
        name: e.name,
        description: e.description || '',
        startDate: e.startDate,
        endDate: e.endDate,
        isActive: e.isActive,
        isResultsPublished: e.isResultsPublished,
      }));
      setElections(mappedElections);
    } catch (error) {
      console.error('Failed to load elections:', error);
      setElections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadElections();
  }, []);

  useEffect(() => {
    const storedElectionId = localStorage.getItem('selectedElectionId');
    if (storedElectionId && elections.length > 0) {
      const election = elections.find(e => e.id === storedElectionId);
      if (election) {
        setSelectedElection(election);
      }
    }
  }, [elections]);

  const handleSetSelectedElection = (election: Election | null) => {
    setSelectedElection(election);
    if (election) {
      localStorage.setItem('selectedElectionId', election.id);
    } else {
      localStorage.removeItem('selectedElectionId');
    }
  };

  return (
    <ElectionContext.Provider value={{ 
      elections, 
      selectedElection, 
      setSelectedElection: handleSetSelectedElection,
      refreshElections: loadElections,
      loading
    }}>
      {children}
    </ElectionContext.Provider>
  );
}

export function useElection() {
  const context = useContext(ElectionContext);
  if (!context) {
    throw new Error('useElection must be used within ElectionProvider');
  }
  return context;
}
