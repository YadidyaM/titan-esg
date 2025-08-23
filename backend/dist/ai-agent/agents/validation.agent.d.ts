import { ConfigService } from '@nestjs/config';
export interface ValidationResult {
    isValid: boolean;
    score: number;
    errors: string[];
    warnings: string[];
    anomalies: string[];
    dataQuality: {
        completeness: number;
        accuracy: number;
        consistency: number;
        timeliness: number;
    };
    recommendations: string[];
}
export interface DataAnomaly {
    type: 'outlier' | 'missing' | 'inconsistent' | 'suspicious';
    field: string;
    value: any;
    expectedRange: any;
    severity: 'low' | 'medium' | 'high';
    description: string;
}
export declare class ValidationAgent {
    private configService;
    private readonly logger;
    private openai;
    private validationRules;
    constructor(configService: ConfigService);
    validateData(data: any): Promise<ValidationResult>;
    private performAIValidation;
    private parseAIValidationResult;
    private performRuleBasedValidation;
    private validateCategory;
    private validateGeneralData;
    private detectAnomalies;
    private extractNumericalFields;
    private detectStatisticalAnomaly;
    private findSimilarValues;
    private detectPatternAnomalies;
    private identifyMissingFields;
    private calculateValidationScore;
    private calculateDataQuality;
    private countTotalFields;
    private countPresentFields;
    private countDataErrors;
    private countInconsistencies;
    private calculateTimeliness;
    private generateRecommendations;
    private fallbackDataValidation;
}
