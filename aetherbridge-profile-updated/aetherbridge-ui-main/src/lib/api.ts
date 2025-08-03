// API Service for AetherBridge Academic Mobility Platform
// import { auth } from './firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const BLOCKCHAIN_API_URL = import.meta.env.VITE_BLOCKCHAIN_API_URL || 'http://localhost:3000';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin' | 'institution';
  did?: string;
  walletAddress?: string;
}

export interface Course {
  id: string;
  title: string;
  institution: string;
  category: string;
  credits: number;
  description: string;
  equivalencyMetadata: any;
  isFeatured: boolean;
}

export interface Credential {
  id: string;
  userId: string;
  type: 'course' | 'assessment' | 'certification';
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  blockchainHash: string;
  transactionHash: string;
  status: 'pending' | 'verified' | 'revoked';
  metadata: any;
  nftTokenId?: string;
}

export interface Application {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  transcripts: string[];
  targetInstitution: string;
  targetProgram: string;
  adminComments?: string;
  equivalencyResults?: any;
}

export interface EquivalencyResult {
  sourceCourse: string;
  targetCourse: string;
  confidenceScore: number;
  verdict: 'equivalent' | 'partial' | 'not_equivalent';
  reasoning: string;
  suggestedBridgingCourses?: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: 'conference' | 'webinar' | 'workshop' | 'fair';
  registrationRequired: boolean;
  registeredUsers: string[];
}

export interface Mentor {
  id: string;
  name: string;
  expertise: string[];
  institution: string;
  bio: string;
  availability: any;
  rating: number;
  hourlyRate: number;
}

export interface Assessment {
  id: string;
  title: string;
  type: 'technical' | 'critical_thinking' | 'leadership';
  duration: number;
  questionCount: number;
  description: string;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  userId: string;
  score: number;
  completedAt: string;
  skillsIdentified: string[];
  recommendations: string[];
}

export interface NFT {
  id: string;
  tokenId: string;
  contractAddress: string;
  credentialId: string;
  title: string;
  description: string;
  image: string;
  metadata: any;
  mintedAt: string;
  transactionHash: string;
  network: string;
  status: string;
  marketplaceLinks: any;
}

export interface WalletInfo {
  walletAddress: string;
  did: string;
  balance: string;
  network: string;
  connectedAt: string;
}

export interface AdminApplication {
  id: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  status: string;
  submittedAt: string;
  targetInstitution: string;
  targetProgram: string;
  transcripts: any[];
  equivalencyResults?: any;
  adminComments?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  priority: string;
}

// API Service Class
class ApiService {
  private async getAuthToken(): Promise<string | null> {
    // For development, return a mock token
    return 'dev-token-123';
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = await this.getAuthToken();
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  // User Management
  async getCurrentUser(): Promise<User> {
    return this.makeRequest('/user/profile');
  }

  async updateUserProfile(profile: Partial<User>): Promise<User> {
    return this.makeRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  // Dashboard
  async getDashboardData(): Promise<{
    academicPassport: any;
    verifiedCredits: number;
    pathwaySuggestions: string[];
    recentActivity: any[];
  }> {
    return this.makeRequest('/dashboard');
  }

  // Courses
  async getCourses(filters?: any): Promise<Course[]> {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.makeRequest(`/courses${queryParams}`);
  }

  async getCourseById(id: string): Promise<Course> {
    return this.makeRequest(`/courses/${id}`);
  }

  async enrollInCourse(courseId: string): Promise<void> {
    return this.makeRequest(`/courses/${courseId}/enroll`, {
      method: 'POST',
    });
  }

  // Applications
  async submitApplication(application: {
    transcripts: File[];
    targetInstitution: string;
    targetProgram: string;
  }): Promise<Application> {
    const formData = new FormData();
    application.transcripts.forEach(file => formData.append('transcripts', file));
    formData.append('targetInstitution', application.targetInstitution);
    formData.append('targetProgram', application.targetProgram);

    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getApplications(): Promise<Application[]> {
    return this.makeRequest('/applications');
  }

  async updateApplicationStatus(applicationId: string, status: string, comments?: string): Promise<Application> {
    return this.makeRequest(`/applications/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, comments }),
    });
  }

  // Equivalency Finder
  async findEquivalencies(sourceCourses: string[], targetInstitution: string): Promise<EquivalencyResult[]> {
    return this.makeRequest('/equivalency/find', {
      method: 'POST',
      body: JSON.stringify({ sourceCourses, targetInstitution }),
    });
  }

  // Credentials
  async getCredentials(): Promise<Credential[]> {
    return this.makeRequest('/credentials');
  }

  async getCredentialById(id: string): Promise<Credential> {
    return this.makeRequest(`/credentials/${id}`);
  }

  async verifyCredential(credentialId: string): Promise<{ verified: boolean; blockchainProof: any }> {
    return this.makeRequest(`/credentials/${credentialId}/verify`);
  }

  async downloadCredential(credentialId: string): Promise<{ downloadUrl: string; filename: string }> {
    return this.makeRequest(`/credentials/${credentialId}/download`);
  }

  async shareCredential(credentialId: string, email: string, message?: string): Promise<any> {
    return this.makeRequest(`/credentials/${credentialId}/share`, {
      method: 'POST',
      body: JSON.stringify({ email, message }),
    });
  }

  async getCredentialStats(): Promise<any> {
    return this.makeRequest('/credentials/stats');
  }

  // NFT Minting
  async mintCredentialAsNFT(credentialId: string): Promise<{ tokenId: string; transactionHash: string; blockchainLink: string }> {
    return this.makeRequest(`/credentials/${credentialId}/mint-nft`, {
      method: 'POST',
    });
  }

  async getNFTs(): Promise<NFT[]> {
    return this.makeRequest('/nft');
  }

  async getNFTById(id: string): Promise<NFT> {
    return this.makeRequest(`/nft/${id}`);
  }

  async mintNFT(credentialId: string, network?: string): Promise<NFT> {
    return this.makeRequest('/nft/mint', {
      method: 'POST',
      body: JSON.stringify({ credentialId, network }),
    });
  }

  async transferNFT(nftId: string, toAddress: string): Promise<any> {
    return this.makeRequest(`/nft/${nftId}/transfer`, {
      method: 'POST',
      body: JSON.stringify({ toAddress }),
    });
  }

  async listNFT(nftId: string, price: number, currency?: string, marketplace?: string): Promise<any> {
    return this.makeRequest(`/nft/${nftId}/list`, {
      method: 'POST',
      body: JSON.stringify({ price, currency, marketplace }),
    });
  }

  async getNFTStats(): Promise<any> {
    return this.makeRequest('/nft/stats');
  }

  async getMarketplaces(): Promise<any[]> {
    return this.makeRequest('/nft/marketplaces');
  }

  // Wallet Integration
  async connectWallet(walletAddress: string, signature?: string, message?: string): Promise<{ did: string; walletAddress: string }> {
    return this.makeRequest('/wallet/connect', {
      method: 'POST',
      body: JSON.stringify({ walletAddress, signature, message }),
    });
  }

  async getWalletInfo(): Promise<WalletInfo> {
    return this.makeRequest('/wallet/info');
  }

  async disconnectWallet(): Promise<void> {
    return this.makeRequest('/wallet/disconnect', {
      method: 'DELETE',
    });
  }

  async getWalletBalance(): Promise<{ balance: string; currency: string; network: string }> {
    return this.makeRequest('/wallet/balance');
  }

  async getWalletTransactions(limit?: number, offset?: number): Promise<any> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    return this.makeRequest(`/wallet/transactions?${params}`);
  }

  async getDIDDocument(): Promise<any> {
    return this.makeRequest('/wallet/did');
  }

  async signMessage(message: string): Promise<{ signature: string; signer: string }> {
    return this.makeRequest('/wallet/sign', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async getSupportedNetworks(): Promise<any[]> {
    return this.makeRequest('/wallet/networks');
  }

  // Events
  async getEvents(filters?: any): Promise<Event[]> {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.makeRequest(`/events${queryParams}`);
  }

  async getEventById(id: string): Promise<Event> {
    return this.makeRequest(`/events/${id}`);
  }

  async registerForEvent(eventId: string): Promise<void> {
    return this.makeRequest(`/events/${eventId}/register`, {
      method: 'POST',
    });
  }

  async unregisterFromEvent(eventId: string): Promise<void> {
    return this.makeRequest(`/events/${eventId}/unregister`, {
      method: 'DELETE',
    });
  }

  async setEventReminder(eventId: string, reminderTime: number): Promise<any> {
    return this.makeRequest(`/events/${eventId}/reminder`, {
      method: 'POST',
      body: JSON.stringify({ reminderTime }),
    });
  }

  async getRegisteredEvents(): Promise<Event[]> {
    return this.makeRequest('/events/user/registered');
  }

  async getEventCategories(): Promise<string[]> {
    return this.makeRequest('/events/categories');
  }

  // Mentorship
  async getMentors(filters?: any): Promise<Mentor[]> {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.makeRequest(`/mentorship${queryParams}`);
  }

  async getMentorById(id: string): Promise<Mentor> {
    return this.makeRequest(`/mentorship/${id}`);
  }

  async bookMentorSession(mentorId: string, sessionData: any): Promise<{ sessionId: string; meetingLink: string }> {
    return this.makeRequest(`/mentorship/${mentorId}/book`, {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async sendMessageToMentor(mentorId: string, subject: string, message: string): Promise<any> {
    return this.makeRequest(`/mentorship/${mentorId}/message`, {
      method: 'POST',
      body: JSON.stringify({ subject, message }),
    });
  }

  async getMentorAvailability(mentorId: string): Promise<any> {
    return this.makeRequest(`/mentorship/${mentorId}/availability`);
  }

  // Skill Assessment
  async getAssessments(filters?: any): Promise<Assessment[]> {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.makeRequest(`/assessment${queryParams}`);
  }

  async getAssessmentById(id: string): Promise<Assessment> {
    return this.makeRequest(`/assessment/${id}`);
  }

  async startAssessment(assessmentId: string): Promise<{ sessionId: string; questions: any[] }> {
    return this.makeRequest(`/assessment/${assessmentId}/start`, {
      method: 'POST',
    });
  }

  async submitAssessment(sessionId: string, answers: any[]): Promise<AssessmentResult> {
    return this.makeRequest('/assessment/submit', {
      method: 'POST',
      body: JSON.stringify({ sessionId, answers }),
    });
  }

  async getAssessmentResults(): Promise<AssessmentResult[]> {
    return this.makeRequest('/assessment/results');
  }

  async getAssessmentResultById(id: string): Promise<AssessmentResult> {
    return this.makeRequest(`/assessment/results/${id}`);
  }

  async getAssessmentCategories(): Promise<string[]> {
    return this.makeRequest('/assessment/categories');
  }

  // Blockchain Operations
  async getBlockchainStatus(): Promise<{ network: string; status: string; lastBlock: number }> {
    const response = await fetch(`${BLOCKCHAIN_API_URL}/status`);
    return response.json();
  }

  async verifyCredentialOnChain(credentialId: string): Promise<{ verified: boolean; proof: any }> {
    const response = await fetch(`${BLOCKCHAIN_API_URL}/credentials/${credentialId}/verify`);
    return response.json();
  }

  // Public Credential Lookup
  async lookupCredential(credentialId: string): Promise<Credential> {
    return this.makeRequest(`/public/credentials/${credentialId}`);
  }

  async verifyPublicCredential(credentialId: string): Promise<any> {
    return this.makeRequest(`/public/credentials/${credentialId}/verify`);
  }

  async searchCredentialsByIssuer(issuer: string, filters?: any): Promise<Credential[]> {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.makeRequest(`/public/credentials/search/issuer/${issuer}${queryParams}`);
  }

  async getPublicCredentialStats(): Promise<any> {
    return this.makeRequest('/public/credentials/stats');
  }

  async getCredentialQR(credentialId: string): Promise<{ qrCode: string; verificationUrl: string }> {
    return this.makeRequest(`/public/credentials/${credentialId}/qr`);
  }

  // Admin Functions
  async getPendingApplications(filters?: any): Promise<AdminApplication[]> {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.makeRequest(`/admin/applications/pending${queryParams}`);
  }

  async getAllApplications(filters?: any): Promise<{ data: AdminApplication[]; pagination: any }> {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.makeRequest(`/admin/applications${queryParams}`);
  }

  async getApplicationById(id: string): Promise<AdminApplication> {
    return this.makeRequest(`/admin/applications/${id}`);
  }

  async approveApplication(applicationId: string, equivalencyResults?: EquivalencyResult[], comments?: string): Promise<AdminApplication> {
    return this.makeRequest(`/admin/applications/${applicationId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ equivalencyResults, comments }),
    });
  }

  async rejectApplication(applicationId: string, reason: string, comments?: string): Promise<AdminApplication> {
    return this.makeRequest(`/admin/applications/${applicationId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason, comments }),
    });
  }

  async requestApplicationChanges(applicationId: string, requestedChanges: string[], comments?: string): Promise<AdminApplication> {
    return this.makeRequest(`/admin/applications/${applicationId}/request-changes`, {
      method: 'POST',
      body: JSON.stringify({ requestedChanges, comments }),
    });
  }

  async getPendingCredentials(filters?: any): Promise<any[]> {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.makeRequest(`/admin/credentials/pending${queryParams}`);
  }

  async verifyAndAnchorCredential(credentialId: string, verificationNotes?: string, blockchainNetwork?: string): Promise<Credential> {
    return this.makeRequest('/admin/credentials/verify-and-anchor', {
      method: 'POST',
      body: JSON.stringify({ credentialId, verificationNotes, blockchainNetwork }),
    });
  }

  async getAdminDashboard(): Promise<any> {
    return this.makeRequest('/admin/dashboard');
  }

  async getApplicationStats(): Promise<any> {
    return this.makeRequest('/admin/applications/stats');
  }
}

export const apiService = new ApiService();
export default apiService; 