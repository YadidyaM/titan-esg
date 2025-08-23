// MongoDB Service for ESG Data Storage
// Manages data persistence for ESG datasets, AI analysis, and crypto credits

export interface ESGFileUpload {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: Date;
  status: 'uploading' | 'processing' | 'analyzed' | 'failed';
  aiAnalysisId?: string;
  cryptoCreditsEarned?: number;
  metadata: {
    category?: string;
    tags?: string[];
    description?: string;
    carbonReduction?: number;
  };
}

export interface AIAnalysisRecord {
  id: string;
  fileId: string;
  userId: string;
  analysis: string;
  sustainabilityScore: number;
  carbonReductionPotential: number;
  recommendations: string[];
  riskAssessment: string;
  complianceStatus: string;
  timestamp: Date;
  aiModel: string;
  cryptoCredits: number;
  blockchainTxHash?: string;
}

export interface SustainabilityQuizRecord {
  id: string;
  userId: string;
  postcode: string;
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  score: number;
  cryptoCreditsEarned: number;
  timestamp: Date;
  blockchainTxHash?: string;
}

export interface CryptoCreditRecord {
  id: string;
  userId: string;
  amount: number;
  source: 'file_upload' | 'sustainability_quiz' | 'referral' | 'bonus';
  sourceId: string;
  timestamp: Date;
  blockchainTxHash?: string;
  status: 'pending' | 'confirmed' | 'failed';
  metadata: {
    fileName?: string;
    postcode?: string;
    questionId?: string;
    carbonReduction?: number;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  walletAddress?: string;
  totalCryptoCredits: number;
  totalFilesUploaded: number;
  totalQuizAttempts: number;
  sustainabilityScore: number;
  joinDate: Date;
  lastActive: Date;
}

class MongoDBService {
  private isConnected = false;
  private mockData: {
    files: ESGFileUpload[];
    analysis: AIAnalysisRecord[];
    quizzes: SustainabilityQuizRecord[];
    credits: CryptoCreditRecord[];
    users: UserProfile[];
  } = {
    files: [],
    analysis: [],
    quizzes: [],
    credits: [],
    users: []
  };

  constructor() {
    this.initializeMockData();
  }

  // Initialize mock data for development
  private initializeMockData(): void {
    // Mock users
    this.mockData.users = [
      {
        id: 'user_1',
        email: 'demo@titanesg.com',
        name: 'Demo User',
        walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        totalCryptoCredits: 3.7,
        totalFilesUploaded: 5,
        totalQuizAttempts: 3,
        sustainabilityScore: 85,
        joinDate: new Date('2024-01-01'),
        lastActive: new Date()
      }
    ];

    // Mock file uploads
    this.mockData.files = [
      {
        id: 'file_1',
        userId: 'user_1',
        fileName: 'carbon-emissions-q4.csv',
        fileType: 'csv',
        fileSize: 2.3 * 1024 * 1024, // 2.3 MB
        uploadDate: new Date('2024-01-15'),
        status: 'analyzed',
        aiAnalysisId: 'analysis_1',
        cryptoCreditsEarned: 1.2,
        metadata: {
          category: 'Environmental',
          tags: ['carbon', 'emissions', 'quarterly'],
          description: 'Q4 Carbon emissions data for manufacturing facilities',
          carbonReduction: 25
        }
      },
      {
        id: 'file_2',
        userId: 'user_1',
        fileName: 'employee-diversity.xlsx',
        fileType: 'xlsx',
        fileSize: 1.8 * 1024 * 1024, // 1.8 MB
        uploadDate: new Date('2024-01-16'),
        status: 'processing',
        metadata: {
          category: 'Social',
          tags: ['diversity', 'inclusion', 'hr'],
          description: 'Employee diversity and inclusion metrics'
        }
      }
    ];

    // Mock AI analysis
    this.mockData.analysis = [
      {
        id: 'analysis_1',
        fileId: 'file_1',
        userId: 'user_1',
        analysis: 'Comprehensive analysis of Q4 carbon emissions data reveals significant opportunities for reduction through energy efficiency improvements and renewable energy adoption.',
        sustainabilityScore: 78,
        carbonReductionPotential: 35,
        recommendations: [
          'Implement smart energy monitoring systems',
          'Upgrade to LED lighting across all facilities',
          'Install solar panels on warehouse roofs',
          'Optimize HVAC systems for energy efficiency'
        ],
        riskAssessment: 'Medium risk due to current high emissions levels',
        complianceStatus: 'partially_compliant',
        timestamp: new Date('2024-01-15'),
        aiModel: 'gpt-4',
        cryptoCredits: 1.2,
        blockchainTxHash: '0x1234567890abcdef'
      }
    ];

    // Mock quiz records
    this.mockData.quizzes = [
      {
        id: 'quiz_1',
        userId: 'user_1',
        postcode: 'SW1A 1AA',
        questionId: 'q_1',
        userAnswer: 'Upgrade insulation and heating systems',
        isCorrect: true,
        score: 95,
        cryptoCreditsEarned: 0.5,
        timestamp: new Date('2024-01-15'),
        blockchainTxHash: '0xabcdef1234567890'
      }
    ];

    // Mock crypto credits
    this.mockData.credits = [
      {
        id: 'credit_1',
        userId: 'user_1',
        amount: 1.2,
        source: 'file_upload',
        sourceId: 'file_1',
        timestamp: new Date('2024-01-15'),
        blockchainTxHash: '0x1234567890abcdef',
        status: 'confirmed',
        metadata: {
          fileName: 'carbon-emissions-q4.csv',
          carbonReduction: 25
        }
      },
      {
        id: 'credit_2',
        userId: 'user_1',
        amount: 0.5,
        source: 'sustainability_quiz',
        sourceId: 'quiz_1',
        timestamp: new Date('2024-01-15'),
        blockchainTxHash: '0xabcdef1234567890',
        status: 'confirmed',
        metadata: {
          postcode: 'SW1A 1AA',
          questionId: 'q_1'
        }
      }
    ];
  }

  // File Upload Management
  async uploadFile(fileData: Omit<ESGFileUpload, 'id' | 'uploadDate'>): Promise<ESGFileUpload> {
    const file: ESGFileUpload = {
      ...fileData,
      id: this.generateId('file'),
      uploadDate: new Date()
    };

    this.mockData.files.push(file);
    return file;
  }

  async getFileById(fileId: string): Promise<ESGFileUpload | null> {
    return this.mockData.files.find(f => f.id === fileId) || null;
  }

  async getUserFiles(userId: string): Promise<ESGFileUpload[]> {
    return this.mockData.files.filter(f => f.userId === userId);
  }

  async updateFileStatus(fileId: string, status: ESGFileUpload['status']): Promise<void> {
    const file = this.mockData.files.find(f => f.id === fileId);
    if (file) {
      file.status = status;
    }
  }

  // AI Analysis Management
  async saveAnalysis(analysisData: Omit<AIAnalysisRecord, 'id' | 'timestamp'>): Promise<AIAnalysisRecord> {
    const analysis: AIAnalysisRecord = {
      ...analysisData,
      id: this.generateId('analysis'),
      timestamp: new Date()
    };

    this.mockData.analysis.push(analysis);
    return analysis;
  }

  async getAnalysisByFileId(fileId: string): Promise<AIAnalysisRecord | null> {
    return this.mockData.analysis.find(a => a.fileId === fileId) || null;
  }

  async getUserAnalysis(userId: string): Promise<AIAnalysisRecord[]> {
    return this.mockData.analysis.filter(a => a.userId === userId);
  }

  // Sustainability Quiz Management
  async saveQuizAttempt(quizData: Omit<SustainabilityQuizRecord, 'id' | 'timestamp'>): Promise<SustainabilityQuizRecord> {
    const quiz: SustainabilityQuizRecord = {
      ...quizData,
      id: this.generateId('quiz'),
      timestamp: new Date()
    };

    this.mockData.quizzes.push(quiz);
    return quiz;
  }

  async getUserQuizAttempts(userId: string, postcode: string): Promise<SustainabilityQuizRecord[]> {
    return this.mockData.quizzes.filter(q => q.userId === userId && q.postcode === postcode);
  }

  async canAttemptQuiz(userId: string, postcode: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attempts = this.mockData.quizzes.filter(q => 
      q.userId === userId && 
      q.postcode === postcode && 
      q.timestamp >= today
    );

    return attempts.length === 0;
  }

  // Crypto Credit Management
  async saveCryptoCredit(creditData: Omit<CryptoCreditRecord, 'id' | 'timestamp'>): Promise<CryptoCreditRecord> {
    const credit: CryptoCreditRecord = {
      ...creditData,
      id: this.generateId('credit'),
      timestamp: new Date()
    };

    this.mockData.credits.push(credit);
    
    // Update user's total credits
    const user = this.mockData.users.find(u => u.id === creditData.userId);
    if (user) {
      user.totalCryptoCredits += creditData.amount;
    }

    return credit;
  }

  async getUserCredits(userId: string): Promise<CryptoCreditRecord[]> {
    return this.mockData.credits.filter(c => c.userId === userId);
  }

  async getUserTotalCredits(userId: string): Promise<number> {
    const user = this.mockData.users.find(u => u.id === userId);
    return user?.totalCryptoCredits || 0;
  }

  // User Management
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return this.mockData.users.find(u => u.id === userId) || null;
  }

  async createUserProfile(userData: Omit<UserProfile, 'id' | 'joinDate' | 'lastActive'>): Promise<UserProfile> {
    const user: UserProfile = {
      ...userData,
      id: this.generateId('user'),
      joinDate: new Date(),
      lastActive: new Date()
    };

    this.mockData.users.push(user);
    return user;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const user = this.mockData.users.find(u => u.id === userId);
    if (user) {
      Object.assign(user, updates);
      user.lastActive = new Date();
    }
  }

  // Analytics and Reporting
  async getSystemStats(): Promise<{
    totalUsers: number;
    totalFiles: number;
    totalCredits: number;
    averageSustainabilityScore: number;
  }> {
    const totalUsers = this.mockData.users.length;
    const totalFiles = this.mockData.files.length;
    const totalCredits = this.mockData.credits.reduce((sum, c) => sum + c.amount, 0);
    const avgScore = this.mockData.analysis.length > 0 
      ? this.mockData.analysis.reduce((sum, a) => sum + a.sustainabilityScore, 0) / this.mockData.analysis.length
      : 0;

    return {
      totalUsers,
      totalFiles,
      totalCredits,
      averageSustainabilityScore: Math.round(avgScore)
    };
  }

  async getUserStats(userId: string): Promise<{
    filesUploaded: number;
    totalCredits: number;
    sustainabilityScore: number;
    quizAttempts: number;
    carbonReduction: number;
  }> {
    const files = this.mockData.files.filter(f => f.userId === userId);
    const analysis = this.mockData.analysis.filter(a => a.userId === userId);
    const quizzes = this.mockData.quizzes.filter(q => q.userId === userId);
    const credits = this.mockData.credits.filter(c => c.userId === userId);

    const avgScore = analysis.length > 0 
      ? analysis.reduce((sum, a) => sum + a.sustainabilityScore, 0) / analysis.length
      : 0;

    const carbonReduction = files.reduce((sum, f) => sum + (f.metadata.carbonReduction || 0), 0);

    return {
      filesUploaded: files.length,
      totalCredits: credits.reduce((sum, c) => sum + c.amount, 0),
      sustainabilityScore: Math.round(avgScore),
      quizAttempts: quizzes.length,
      carbonReduction
    };
  }

  // Utility methods
  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Connection management (for future MongoDB integration)
  async connect(): Promise<boolean> {
    this.isConnected = true;
    return true;
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
  }

  isConnectedToDatabase(): boolean {
    return this.isConnected;
  }
}

export const mongodbService = new MongoDBService();
