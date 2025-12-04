export type UserRole = 'voter' | 'candidate' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  votedElections?: string[]; // Array of election IDs user has voted in
  isNominated?: boolean;
}

export interface Voter extends User {
  age: number;
  address: string;
  idProof?: string;
}

export interface Election {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isResultsPublished: boolean;
  isActive: boolean;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  manifesto?: string;
  photo?: string;
  votes: number;
  description?: string;
  electionId: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phone: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: UserRole;
  }) => Promise<boolean>;
  verifyOtp?: (phone: string, code: string) => Promise<boolean>;
}
