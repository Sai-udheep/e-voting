import { User, Candidate, Election } from '@/types';

// Sample users for testing
export const MOCK_USERS: (User & { password: string })[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'voter@example.com',
    phone: '9876543210',
    password: 'voter123',
    role: 'voter',
    isVerified: true,
    votedElections: [],
    isNominated: false,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'candidate@example.com',
    phone: '9876543211',
    password: 'candidate123',
    role: 'candidate',
    isVerified: true,
    votedElections: [],
    isNominated: true,
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '9876543212',
    password: 'admin123',
    role: 'admin',
    isVerified: true,
  },
];

export const MOCK_ELECTIONS: Election[] = [
  {
    id: 'e1',
    name: 'Presidential Election 2024',
    description: 'National election for President',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isResultsPublished: true,
    isActive: true,
  },
  {
    id: 'e2',
    name: 'State Governor Election 2024',
    description: 'State-level gubernatorial election',
    startDate: '2024-06-01',
    endDate: '2024-12-31',
    isResultsPublished: false,
    isActive: true,
  },
  {
    id: 'e3',
    name: 'City Mayor Election 2024',
    description: 'Municipal election for City Mayor',
    startDate: '2024-03-01',
    endDate: '2024-12-31',
    isResultsPublished: false,
    isActive: true,
  },
];

export const MOCK_CANDIDATES: Candidate[] = [
  // Presidential Election Candidates
  {
    id: 'c1',
    name: 'Sarah Johnson',
    party: 'Democratic Party',
    manifesto: 'Building a better future for all citizens',
    votes: 245,
    description: 'Experienced leader with 10 years in public service',
    electionId: 'e1',
  },
  {
    id: 'c2',
    name: 'Michael Chen',
    party: 'Progressive Alliance',
    manifesto: 'Innovation and equality for everyone',
    votes: 189,
    description: 'Tech entrepreneur focused on digital transformation',
    electionId: 'e1',
  },
  {
    id: 'c3',
    name: 'Emma Williams',
    party: 'Green Coalition',
    manifesto: 'Sustainable development and environmental protection',
    votes: 156,
    description: 'Environmental activist and policy maker',
    electionId: 'e1',
  },
  // State Governor Candidates
  {
    id: 'c4',
    name: 'Robert Davis',
    party: 'Unity Front',
    manifesto: 'Economic growth and social welfare',
    votes: 201,
    description: 'Economist with focus on inclusive growth',
    electionId: 'e2',
  },
  {
    id: 'c5',
    name: 'Linda Martinez',
    party: 'People\'s Choice',
    manifesto: 'Healthcare and education for all',
    votes: 178,
    description: 'Former healthcare administrator',
    electionId: 'e2',
  },
  {
    id: 'c6',
    name: 'James Wilson',
    party: 'Reform Party',
    manifesto: 'Transparency and accountability in government',
    votes: 143,
    description: 'Anti-corruption activist',
    electionId: 'e2',
  },
  // City Mayor Candidates
  {
    id: 'c7',
    name: 'Patricia Brown',
    party: 'Urban Development Party',
    manifesto: 'Smart city initiatives and infrastructure',
    votes: 312,
    description: 'Urban planner with 15 years experience',
    electionId: 'e3',
  },
  {
    id: 'c8',
    name: 'David Lee',
    party: 'Community First',
    manifesto: 'Neighborhood safety and community programs',
    votes: 267,
    description: 'Former police chief and community organizer',
    electionId: 'e3',
  },
  {
    id: 'c9',
    name: 'Maria Garcia',
    party: 'Green Future',
    manifesto: 'Environmental sustainability for our city',
    votes: 198,
    description: 'Environmental scientist and advocate',
    electionId: 'e3',
  },
];

export const PENDING_VOTERS = [
  {
    id: 'v1',
    name: 'Alice Brown',
    email: 'alice@example.com',
    phone: '9876543213',
    age: 25,
    address: '123 Main St, City',
    status: 'pending',
  },
  {
    id: 'v2',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    phone: '9876543214',
    age: 32,
    address: '456 Oak Ave, Town',
    status: 'pending',
  },
];
