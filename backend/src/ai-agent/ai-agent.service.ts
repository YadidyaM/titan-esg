import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class AiAgentService {
  private readonly logger = new Logger(AiAgentService.name);
  private activeTasks: Map<string, AgentTask> = new Map();

  constructor(
    private configService: ConfigService,
    private dataAnalysisAgent: DataAnalysisAgent,
    private complianceAgent: ComplianceAgent,
    private reportingAgent: ReportingAgent,
    private validationAgent: ValidationAgent,
  ) {}

  async analyzeEsgData(data: any): Promise<EsgDataAnalysis> {
    const taskId = `analysis_${Date.now()}`;
    const task: AgentTask = {
      id: taskId,
      type: 'data_analysis',
      data,
      priority: 'high',
      status: 'processing',
      createdAt: new Date(),
    };

    this.activeTasks.set(taskId, task);

    try {
      this.logger.log(`Starting ESG data analysis for task ${taskId}`);

      // Parallel execution of different analysis types
      const [environmentalAnalysis, socialAnalysis, governanceAnalysis] = await Promise.all([
        this.dataAnalysisAgent.analyzeEnvironmental(data),
        this.dataAnalysisAgent.analyzeSocial(data),
        this.dataAnalysisAgent.analyzeGovernance(data),
      ]);

      // Compliance check
      const complianceResult = await this.complianceAgent.checkCompliance(data);

      // Data validation
      const validationResult = await this.validationAgent.validateData(data);

      // Compile results
      const result: EsgDataAnalysis = {
        environmentalScore: environmentalAnalysis.score,
        socialScore: socialAnalysis.score,
        governanceScore: governanceAnalysis.score,
        overallScore: this.calculateOverallScore([
          environmentalAnalysis.score,
          socialAnalysis.score,
          governanceAnalysis.score,
        ]),
        insights: [
          ...environmentalAnalysis.insights,
          ...socialAnalysis.insights,
          ...governanceAnalysis.insights,
        ],
        recommendations: [
          ...environmentalAnalysis.recommendations,
          ...socialAnalysis.recommendations,
          ...governanceAnalysis.recommendations,
        ],
        anomalies: validationResult.anomalies,
        complianceStatus: complianceResult.status,
      };

      // Update task status
      task.status = 'completed';
      task.result = result;
      task.completedAt = new Date();
      this.activeTasks.set(taskId, task);

      this.logger.log(`ESG data analysis completed for task ${taskId}`);
      return result;

    } catch (error) {
      this.logger.error(`ESG data analysis failed for task ${taskId}`, error);
      
      task.status = 'failed';
      task.error = error.message;
      task.completedAt = new Date();
      this.activeTasks.set(taskId, task);

      throw error;
    }
  }

  async generateReport(data: any, framework: string): Promise<any> {
    const taskId = `report_${Date.now()}`;
    const task: AgentTask = {
      id: taskId,
      type: 'report_generation',
      data: { ...data, framework },
      priority: 'medium',
      status: 'processing',
      createdAt: new Date(),
    };

    this.activeTasks.set(taskId, task);

    try {
      this.logger.log(`Starting report generation for ${framework} framework`);

      // First validate the data
      const validationResult = await this.validationAgent.validateData(data);
      
      if (!validationResult.isValid) {
        throw new Error(`Data validation failed: ${validationResult.errors.join(', ')}`);
      }

      // Generate the report
      const report = await this.reportingAgent.generateReport(data, framework);

      // Update task status
      task.status = 'completed';
      task.result = report;
      task.completedAt = new Date();
      this.activeTasks.set(taskId, task);

      this.logger.log(`Report generation completed for task ${taskId}`);
      return report;

    } catch (error) {
      this.logger.error(`Report generation failed for task ${taskId}`, error);
      
      task.status = 'failed';
      task.error = error.message;
      task.completedAt = new Date();
      this.activeTasks.set(taskId, task);

      throw error;
    }
  }

  async checkCompliance(data: any, frameworks: string[]): Promise<any> {
    const taskId = `compliance_${Date.now()}`;
    const task: AgentTask = {
      id: taskId,
      type: 'compliance_check',
      data: { ...data, frameworks },
      priority: 'high',
      status: 'processing',
      createdAt: new Date(),
    };

    this.activeTasks.set(taskId, task);

    try {
      this.logger.log(`Starting compliance check for frameworks: ${frameworks.join(', ')}`);

      const results = await Promise.all(
        frameworks.map(framework => this.complianceAgent.checkCompliance(data, framework))
      );

      const complianceReport = {
        frameworks,
        results,
        overallCompliance: this.calculateComplianceScore(results),
        recommendations: this.extractComplianceRecommendations(results),
      };

      // Update task status
      task.status = 'completed';
      task.result = complianceReport;
      task.completedAt = new Date();
      this.activeTasks.set(taskId, task);

      this.logger.log(`Compliance check completed for task ${taskId}`);
      return complianceReport;

    } catch (error) {
      this.logger.error(`Compliance check failed for task ${taskId}`, error);
      
      task.status = 'failed';
      task.error = error.message;
      task.completedAt = new Date();
      this.activeTasks.set(taskId, task);

      throw error;
    }
  }

  async validateData(data: any): Promise<any> {
    return await this.validationAgent.validateData(data);
  }

  getTaskStatus(taskId: string): AgentTask | null {
    return this.activeTasks.get(taskId) || null;
  }

  getAllTasks(): AgentTask[] {
    return Array.from(this.activeTasks.values());
  }

  private calculateOverallScore(scores: number[]): number {
    const weights = [0.4, 0.35, 0.25]; // Environmental, Social, Governance
    return scores.reduce((total, score, index) => total + score * weights[index], 0);
  }

  private calculateComplianceScore(results: any[]): number {
    const totalRequirements = results.reduce((sum, result) => sum + result.totalRequirements, 0);
    const metRequirements = results.reduce((sum, result) => sum + result.metRequirements, 0);
    return totalRequirements > 0 ? (metRequirements / totalRequirements) * 100 : 0;
  }

  private extractComplianceRecommendations(results: any[]): string[] {
    const recommendations: string[] = [];
    results.forEach(result => {
      if (result.recommendations) {
        recommendations.push(...result.recommendations);
      }
    });
    return recommendations;
  }
}
