import { ConfigService } from '@nestjs/config';
import { DataAnalysisAgent } from './agents/data-analysis.agent';
import { ComplianceAgent } from './agents/compliance.agent';
import { ReportingAgent } from './agents/reporting.agent';
import { ValidationAgent } from './agents/validation.agent';
export interface EsgDataAnalysis {
    environmentalScore: number;
    socialScore: number;
    governanceScore: number;
    overallScore: number;
    insights: string[];
    recommendations: string[];
    anomalies: string[];
    complianceStatus: string;
}
export interface AgentTask {
    id: string;
    type: 'data_analysis' | 'compliance_check' | 'report_generation' | 'validation';
    data: any;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    result?: any;
    error?: string;
    createdAt: Date;
    completedAt?: Date;
}
export declare class AiAgentService {
    private configService;
    private dataAnalysisAgent;
    private complianceAgent;
    private reportingAgent;
    private validationAgent;
    private readonly logger;
    private activeTasks;
    constructor(configService: ConfigService, dataAnalysisAgent: DataAnalysisAgent, complianceAgent: ComplianceAgent, reportingAgent: ReportingAgent, validationAgent: ValidationAgent);
    analyzeEsgData(data: any): Promise<EsgDataAnalysis>;
    generateReport(data: any, framework: string): Promise<any>;
    checkCompliance(data: any, frameworks: string[]): Promise<any>;
    validateData(data: any): Promise<any>;
    getTaskStatus(taskId: string): AgentTask | null;
    getAllTasks(): AgentTask[];
    private calculateOverallScore;
    private calculateComplianceScore;
    private extractComplianceRecommendations;
}
