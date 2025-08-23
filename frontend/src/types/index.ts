// ESG Data Types
export interface EsgData {
  id: string
  organization: string
  reportingPeriod: string
  dataSource: string
  environmental: EnvironmentalData
  social: SocialData
  governance: GovernanceData
  metrics: EsgMetrics
  frameworks: string[]
  metadata: EsgMetadata
  createdBy?: string
  updatedBy?: string
  status: 'active' | 'archived' | 'deleted'
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface EnvironmentalData {
  emissions?: number
  renewableEnergy?: number
  waterUsage?: number
  wasteGeneration?: number
  energyConsumption?: number
  carbonFootprint?: number
  biodiversityImpact?: number
  airQuality?: number
}

export interface SocialData {
  employeeCount?: number
  employeeSatisfaction?: number
  diversityScore?: number
  trainingHours?: number
  communityInvestment?: number
  healthAndSafety?: number
  laborRights?: number
  dataPrivacy?: number
}

export interface GovernanceData {
  boardIndependence?: number
  transparencyScore?: number
  riskManagement?: number
  complianceScore?: number
  ethicsScore?: number
  stakeholderEngagement?: number
  antiCorruption?: number
  boardDiversity?: number
}

export interface EsgMetrics {
  esgScore?: number
  environmentalScore?: number
  socialScore?: number
  governanceScore?: number
  riskLevel?: 'low' | 'medium' | 'high'
  trend?: 'improving' | 'stable' | 'declining'
}

export interface EsgMetadata {
  version: string
  lastUpdated: string
  dataQuality: DataQualityMetrics
  validationStatus: 'pending' | 'validated' | 'failed'
  anomalies: string[]
}

export interface DataQualityMetrics {
  completeness: number
  accuracy: number
  consistency: number
  timeliness: number
}

// AI Analysis Types
export interface AiAnalysis {
  id: string
  dataId: string
  type: 'esg-analysis' | 'compliance-check' | 'report-generation' | 'data-validation'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  result?: any
  error?: string
  createdAt: string
  updatedAt: string
}

// Blockchain Types
export interface CarbonCredit {
  id: string
  amount: number
  owner: string
  transactionHash: string
  blockNumber: number
  createdAt: string
}

export interface BlockchainTransaction {
  hash: string
  from: string
  to: string
  amount: number
  status: 'pending' | 'confirmed' | 'failed'
  blockNumber?: number
  timestamp: string
}

// User Types
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'analyst' | 'viewer'
  organization: string
  permissions: string[]
  lastLogin?: string
  createdAt: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Dashboard Types
export interface DashboardStats {
  overallEsgScore: number
  dataQuality: number
  complianceStatus: number
  carbonCredits: number
  trend: 'up' | 'down' | 'stable'
  changeAmount: number
}

export interface ActivityItem {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  message: string
  timestamp: string
  userId?: string
  metadata?: Record<string, any>
}

// Form Types
export interface EsgDataForm {
  organization: string
  reportingPeriod: string
  dataSource: string
  environmental: Partial<EnvironmentalData>
  social: Partial<SocialData>
  governance: Partial<GovernanceData>
  frameworks: string[]
  tags: string[]
}

// Search and Filter Types
export interface SearchFilters {
  organization?: string
  reportingPeriod?: string
  frameworks?: string[]
  status?: string
  dateRange?: {
    start: string
    end: string
  }
  tags?: string[]
}

// Notification Types
export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
}
