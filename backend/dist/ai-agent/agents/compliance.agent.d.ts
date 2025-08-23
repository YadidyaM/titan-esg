import { ConfigService } from '@nestjs/config';
export interface ComplianceResult {
    framework: string;
    status: 'compliant' | 'non_compliant' | 'partially_compliant';
    score: number;
    totalRequirements: number;
    metRequirements: number;
    missingRequirements: string[];
    recommendations: string[];
    lastUpdated: Date;
}
export declare class ComplianceAgent {
    private configService;
    private readonly logger;
    private openai;
    private frameworkRequirements;
    constructor(configService: ConfigService);
    checkCompliance(data: any, framework?: string): Promise<ComplianceResult>;
    private buildCompliancePrompt;
    private parseComplianceResult;
    private getDefaultComplianceResult;
    private fallbackComplianceCheck;
    getFrameworkRequirements(framework: string): any;
    getSupportedFrameworks(): string[];
}
