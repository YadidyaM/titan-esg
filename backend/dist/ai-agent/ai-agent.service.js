"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AiAgentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiAgentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const data_analysis_agent_1 = require("./agents/data-analysis.agent");
const compliance_agent_1 = require("./agents/compliance.agent");
const reporting_agent_1 = require("./agents/reporting.agent");
const validation_agent_1 = require("./agents/validation.agent");
let AiAgentService = AiAgentService_1 = class AiAgentService {
    constructor(configService, dataAnalysisAgent, complianceAgent, reportingAgent, validationAgent) {
        this.configService = configService;
        this.dataAnalysisAgent = dataAnalysisAgent;
        this.complianceAgent = complianceAgent;
        this.reportingAgent = reportingAgent;
        this.validationAgent = validationAgent;
        this.logger = new common_1.Logger(AiAgentService_1.name);
        this.activeTasks = new Map();
    }
    async analyzeEsgData(data) {
        const taskId = `analysis_${Date.now()}`;
        const task = {
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
            const [environmentalAnalysis, socialAnalysis, governanceAnalysis] = await Promise.all([
                this.dataAnalysisAgent.analyzeEnvironmental(data),
                this.dataAnalysisAgent.analyzeSocial(data),
                this.dataAnalysisAgent.analyzeGovernance(data),
            ]);
            const complianceResult = await this.complianceAgent.checkCompliance(data);
            const validationResult = await this.validationAgent.validateData(data);
            const result = {
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
            task.status = 'completed';
            task.result = result;
            task.completedAt = new Date();
            this.activeTasks.set(taskId, task);
            this.logger.log(`ESG data analysis completed for task ${taskId}`);
            return result;
        }
        catch (error) {
            this.logger.error(`ESG data analysis failed for task ${taskId}`, error);
            task.status = 'failed';
            task.error = error.message;
            task.completedAt = new Date();
            this.activeTasks.set(taskId, task);
            throw error;
        }
    }
    async generateReport(data, framework) {
        const taskId = `report_${Date.now()}`;
        const task = {
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
            const validationResult = await this.validationAgent.validateData(data);
            if (!validationResult.isValid) {
                throw new Error(`Data validation failed: ${validationResult.errors.join(', ')}`);
            }
            const report = await this.reportingAgent.generateReport(data, framework);
            task.status = 'completed';
            task.result = report;
            task.completedAt = new Date();
            this.activeTasks.set(taskId, task);
            this.logger.log(`Report generation completed for task ${taskId}`);
            return report;
        }
        catch (error) {
            this.logger.error(`Report generation failed for task ${taskId}`, error);
            task.status = 'failed';
            task.error = error.message;
            task.completedAt = new Date();
            this.activeTasks.set(taskId, task);
            throw error;
        }
    }
    async checkCompliance(data, frameworks) {
        const taskId = `compliance_${Date.now()}`;
        const task = {
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
            const results = await Promise.all(frameworks.map(framework => this.complianceAgent.checkCompliance(data, framework)));
            const complianceReport = {
                frameworks,
                results,
                overallCompliance: this.calculateComplianceScore(results),
                recommendations: this.extractComplianceRecommendations(results),
            };
            task.status = 'completed';
            task.result = complianceReport;
            task.completedAt = new Date();
            this.activeTasks.set(taskId, task);
            this.logger.log(`Compliance check completed for task ${taskId}`);
            return complianceReport;
        }
        catch (error) {
            this.logger.error(`Compliance check failed for task ${taskId}`, error);
            task.status = 'failed';
            task.error = error.message;
            task.completedAt = new Date();
            this.activeTasks.set(taskId, task);
            throw error;
        }
    }
    async validateData(data) {
        return await this.validationAgent.validateData(data);
    }
    getTaskStatus(taskId) {
        return this.activeTasks.get(taskId) || null;
    }
    getAllTasks() {
        return Array.from(this.activeTasks.values());
    }
    calculateOverallScore(scores) {
        const weights = [0.4, 0.35, 0.25];
        return scores.reduce((total, score, index) => total + score * weights[index], 0);
    }
    calculateComplianceScore(results) {
        const totalRequirements = results.reduce((sum, result) => sum + result.totalRequirements, 0);
        const metRequirements = results.reduce((sum, result) => sum + result.metRequirements, 0);
        return totalRequirements > 0 ? (metRequirements / totalRequirements) * 100 : 0;
    }
    extractComplianceRecommendations(results) {
        const recommendations = [];
        results.forEach(result => {
            if (result.recommendations) {
                recommendations.push(...result.recommendations);
            }
        });
        return recommendations;
    }
};
exports.AiAgentService = AiAgentService;
exports.AiAgentService = AiAgentService = AiAgentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        data_analysis_agent_1.DataAnalysisAgent,
        compliance_agent_1.ComplianceAgent,
        reporting_agent_1.ReportingAgent,
        validation_agent_1.ValidationAgent])
], AiAgentService);
//# sourceMappingURL=ai-agent.service.js.map