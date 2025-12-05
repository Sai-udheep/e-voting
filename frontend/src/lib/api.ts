const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses (like network errors)
    let data;
    try {
      data = await response.json();
    } catch {
      // If response is not JSON, create error data
      data = { message: `HTTP error! status: ${response.status}` };
    }

    if (!response.ok) {
      // Only clear token on 401 (unauthorized) errors
      // Be more careful - don't clear on database errors or server issues
      if (response.status === 401 && token) {
        const errorMessage = (data.message || '').toLowerCase();
        
        // Only clear token if it's explicitly an authentication/token error
        // Don't clear on generic errors or database connection issues
        if (errorMessage.includes('unauthorized') || 
            errorMessage.includes('invalid token') ||
            errorMessage.includes('token expired') ||
            errorMessage.includes('authentication failed')) {
          // Clear token and user data
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          // Don't redirect here - let React Router handle it naturally
        }
      }
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    // Don't clear tokens on network errors - these are temporary issues
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      // Network error - don't clear token
      throw new Error('Network error. Please check your connection.');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}

// Auth API
export const authApi = {
  register: async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'VOTER' | 'CANDIDATE';
    dateOfBirth: string;
  }) => {
    return apiRequest<{ user: any; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  verifyOtp: async (phone: string, code: string) => {
    return apiRequest<{ message: string }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    });
  },

  resendOtp: async (phone: string) => {
    return apiRequest<{ message: string }>('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  // Development endpoint to get OTP (only works in development)
  getOtp: async (phone: string) => {
    return apiRequest<{ phone: string; code: string; expiresAt: string; isUsed: boolean }>(
      `/auth/otp/${phone}`,
      { method: 'GET' }
    );
  },

  login: async (phone: string, password: string) => {
    return apiRequest<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
  },
};

// Admin API
export const adminApi = {
  getAllUsers: async () => {
    return apiRequest<any[]>('/admin/users', { method: 'GET' });
  },

  getPendingVoters: async () => {
    return apiRequest<any[]>('/admin/pending-voters', { method: 'GET' });
  },

  approveUser: async (userId: string) => {
    return apiRequest<{ message: string; user: any }>('/admin/approve-user', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  approveVoter: async (userId: string) => {
    return apiRequest<{ message: string; user: any }>('/admin/approve-voter', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  removeUser: async (userId: string) => {
    return apiRequest<{ message: string }>(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  getAdminStats: async () => {
    return apiRequest<{
      totalVoters: number;
      totalCandidates: number;
      pendingApprovals: number;
      totalVotes: number;
      activeElections: number;
      approvedCandidates: number;
    }>('/admin/stats', { method: 'GET' });
  },
};

// Election API
export const electionApi = {
  getAllElections: async () => {
    return apiRequest<any[]>('/elections', { method: 'GET' });
  },

  getActiveElections: async () => {
    return apiRequest<any[]>('/elections/active', { method: 'GET' });
  },

  getElectionById: async (id: string) => {
    return apiRequest<any>(`/elections/${id}`, { method: 'GET' });
  },

  createElection: async (data: {
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
  }) => {
    return apiRequest<any>('/elections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateElection: async (id: string, data: {
    name?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
    isResultsPublished?: boolean;
  }) => {
    return apiRequest<any>(`/elections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteElection: async (id: string) => {
    return apiRequest<{ message: string }>(`/elections/${id}`, {
      method: 'DELETE',
    });
  },

  toggleElectionActive: async (id: string) => {
    return apiRequest<any>(`/elections/${id}/toggle-active`, {
      method: 'PATCH',
    });
  },

  toggleResultsPublished: async (id: string) => {
    return apiRequest<any>(`/elections/${id}/toggle-results`, {
      method: 'PATCH',
    });
  },
};

// Candidate API
export const candidateApi = {
  submitNomination: async (data: {
    electionId: string;
    party: string;
  }) => {
    return apiRequest<any>('/candidates/nominate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMyNominations: async () => {
    return apiRequest<any[]>('/candidates/my-nominations', { method: 'GET' });
  },

  getCandidatesByElection: async (electionId: string) => {
    return apiRequest<any[]>(`/candidates/election/${electionId}`, { method: 'GET' });
  },

  getAllCandidates: async () => {
    return apiRequest<any[]>('/candidates', { method: 'GET' });
  },

  getPendingNominations: async () => {
    return apiRequest<any[]>('/candidates/pending', { method: 'GET' });
  },

  approveCandidate: async (id: string) => {
    return apiRequest<{ message: string; candidate: any }>(`/candidates/${id}/approve`, {
      method: 'PATCH',
    });
  },

  rejectCandidate: async (id: string) => {
    return apiRequest<{ message: string; candidate: any }>(`/candidates/${id}/reject`, {
      method: 'PATCH',
    });
  },

  deleteCandidate: async (id: string) => {
    return apiRequest<{ message: string }>(`/candidates/${id}`, {
      method: 'DELETE',
    });
  },
};

// Vote API
export const voteApi = {
  castVote: async (data: {
    electionId: string;
    candidateId: string;
  }) => {
    return apiRequest<{ message: string; vote: any }>('/votes/cast', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getVoteHistory: async () => {
    return apiRequest<any[]>('/votes/history', { method: 'GET' });
  },

  hasVoted: async (electionId: string) => {
    return apiRequest<{ hasVoted: boolean }>(`/votes/has-voted/${electionId}`, {
      method: 'GET',
    });
  },

  getElectionResults: async (electionId: string) => {
    return apiRequest<{
      election: any;
      candidates: Array<{
        id: string;
        name: string;
        party: string;
        votes: number;
      }>;
    }>(`/votes/results/${electionId}`, { method: 'GET' });
  },

  getAllVotes: async () => {
    return apiRequest<any[]>('/votes/all', { method: 'GET' });
  },
};

export default apiRequest;

