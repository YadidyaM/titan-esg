import { ConfigService } from '@nestjs/config';
export interface ReportSection {
    title: string;
    content: string;
    data: any;
    charts?: any[];
}
export interface GeneratedReport {
    id: string;
    framework: string;
    title: string;
    executiveSummary: string;
    sections: ReportSection[];
    metadata: {
        generatedAt: Date;
        dataSource: string;
        version: string;
        totalPages: number;
    };
    compliance: {
        status: string;
        score: number;
        requirements: string[];
    };
}
export declare class ReportingAgent {
    private configService;
    private readonly logger;
    private openai;
    constructor(configService: ConfigService);
    generateReport(data: any, framework: string): Promise<GeneratedReport>;
    private generateExecutiveSummary;
    private generateReportSections;
    private generateSection;
    private generateComplianceSummary;
    private generateChartsForSection;
    private getDefaultExecutiveSummary;
    private getDefaultSections;
    private fallbackReportGeneration;
}
