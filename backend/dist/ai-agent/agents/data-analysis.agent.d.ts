import { ConfigService } from '@nestjs/config';
export interface AnalysisResult {
    score: number;
    insights: string[];
    recommendations: string[];
    confidence: number;
}
export declare class DataAnalysisAgent {
    private configService;
    private readonly logger;
    private openai;
    constructor(configService: ConfigService);
    analyzeEnvironmental(data: any): Promise<AnalysisResult>;
    analyzeSocial(data: any): Promise<AnalysisResult>;
    analyzeGovernance(data: any): Promise<AnalysisResult>;
    private buildEnvironmentalPrompt;
    private buildSocialPrompt;
    private buildGovernancePrompt;
    private parseEnvironmentalAnalysis;
    private parseSocialAnalysis;
    private parseGovernanceAnalysis;
    private parseAnalysisContent;
    private getDefaultAnalysisResult;
    private fallbackEnvironmentalAnalysis;
    private fallbackSocialAnalysis;
    private fallbackGovernanceAnalysis;
}
