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
var ValidationAgent_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationAgent = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
let ValidationAgent = ValidationAgent_1 = class ValidationAgent {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(ValidationAgent_1.name);
        this.validationRules = {
            environmental: {
                emissions: { min: 0, max: 100000, unit: 'tons CO2' },
                renewableEnergy: { min: 0, max: 100, unit: '%' },
                waterUsage: { min: 0, max: 1000000, unit: 'liters' },
                wasteGeneration: { min: 0, max: 50000, unit: 'tons' },
            },
            social: {
                employeeSatisfaction: { min: 0, max: 100, unit: '%' },
                diversityScore: { min: 0, max: 100, unit: '%' },
                trainingHours: { min: 0, max: 1000, unit: 'hours' },
                communityInvestment: { min: 0, max: 10000000, unit: 'USD' },
            },
            governance: {
                boardIndependence: { min: 0, max: 100, unit: '%' },
                transparencyScore: { min: 0, max: 100, unit: '%' },
                riskManagement: { min: 0, max: 100, unit: '%' },
                complianceScore: { min: 0, max: 100, unit: '%' },
            },
        };
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (apiKey) {
            this.openai = new openai_1.default({ apiKey });
        }
    }
    async validateData(data) {
        try {
            this.logger.log('Starting ESG data validation');
            if (!this.openai) {
                return this.fallbackDataValidation(data);
            }
            const aiValidation = await this.performAIValidation(data);
            const ruleValidation = this.performRuleBasedValidation(data);
            const anomalies = this.detectAnomalies(data);
            const result = {
                isValid: aiValidation.isValid && ruleValidation.isValid && anomalies.length === 0,
                score: this.calculateValidationScore(aiValidation, ruleValidation, anomalies),
                errors: [...aiValidation.errors, ...ruleValidation.errors],
                warnings: [...aiValidation.warnings, ...ruleValidation.warnings],
                anomalies: anomalies.map(a => a.description),
                dataQuality: this.calculateDataQuality(data),
                recommendations: this.generateRecommendations(aiValidation, ruleValidation, anomalies),
            };
            this.logger.log('ESG data validation completed');
            return result;
        }
        catch (error) {
            this.logger.error('ESG data validation failed, using fallback', error);
            return this.fallbackDataValidation(data);
        }
    }
    async performAIValidation(data) {
        try {
            const prompt = `Validate the following ESG data for accuracy, completeness, and consistency. 
      
      Data: ${JSON.stringify(data, null, 2)}
      
      Please identify:
      1. Data quality issues
      2. Missing required fields
      3. Inconsistent values
      4. Potential errors
      
      Format your response as:
      Valid: [true/false]
      Errors:
      - [error 1]
      - [error 2]
      Warnings:
      - [warning 1]
      - [warning 2]`;
            const response = await this.openai.chat.completions.create({
                model: this.configService.get('OPENAI_MODEL') || 'gpt-4-turbo-preview',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an ESG data validation expert specializing in data quality assessment.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.2,
                max_tokens: 800,
            });
            const content = response.choices[0]?.message?.content || '';
            return this.parseAIValidationResult(content);
        }
        catch (error) {
            this.logger.error('AI validation failed', error);
            return { isValid: true, errors: [], warnings: [] };
        }
    }
    parseAIValidationResult(content) {
        try {
            const validMatch = content.match(/Valid:\s*(true|false)/i);
            const errorsMatch = content.match(/Errors:\s*((?:- [^\n]+\n?)+)/s);
            const warningsMatch = content.match(/Warnings:\s*((?:- [^\n]+\n?)+)/s);
            const isValid = validMatch?.[1]?.toLowerCase() === 'true';
            const errors = errorsMatch?.[1]
                ?.split('\n')
                .filter(line => line.trim().startsWith('-'))
                .map(line => line.trim().substring(2))
                .filter(Boolean) || [];
            const warnings = warningsMatch?.[1]
                ?.split('\n')
                .filter(line => line.trim().startsWith('-'))
                .map(line => line.trim().substring(2))
                .filter(Boolean) || [];
            return { isValid, errors, warnings };
        }
        catch (error) {
            this.logger.error('Failed to parse AI validation result', error);
            return { isValid: true, errors: [], warnings: [] };
        }
    }
    performRuleBasedValidation(data) {
        const errors = [];
        const warnings = [];
        try {
            if (data.environmental) {
                this.validateCategory(data.environmental, 'environmental', errors, warnings);
            }
            if (data.social) {
                this.validateCategory(data.social, 'social', errors, warnings);
            }
            if (data.governance) {
                this.validateCategory(data.governance, 'governance', errors, warnings);
            }
            this.validateGeneralData(data, errors, warnings);
        }
        catch (error) {
            this.logger.error('Rule-based validation failed', error);
            errors.push('Rule-based validation encountered an error');
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }
    validateCategory(categoryData, category, errors, warnings) {
        const rules = this.validationRules[category];
        if (!rules)
            return;
        Object.entries(rules).forEach(([field, rule]) => {
            const value = categoryData[field];
            if (value === undefined || value === null) {
                warnings.push(`Missing ${field} data in ${category} category`);
                return;
            }
            if (typeof value === 'number') {
                if (typeof rule === 'object' && rule !== null && 'min' in rule && 'max' in rule) {
                    const min = rule.min;
                    const max = rule.max;
                    const unit = rule.unit || '';
                    if (value < min || value > max) {
                        errors.push(`${field} value ${value} is outside expected range [${min}, ${max}] ${unit}`);
                    }
                }
            }
        });
    }
    validateGeneralData(data, errors, warnings) {
        const requiredFields = ['organization', 'reportingPeriod', 'dataSource'];
        requiredFields.forEach(field => {
            if (!data[field]) {
                warnings.push(`Missing required field: ${field}`);
            }
        });
        if (data.reportingPeriod && typeof data.reportingPeriod !== 'string') {
            errors.push('reportingPeriod must be a string');
        }
        if (data.organization && typeof data.organization !== 'string') {
            errors.push('organization must be a string');
        }
    }
    detectAnomalies(data) {
        const anomalies = [];
        try {
            const numericalFields = this.extractNumericalFields(data);
            numericalFields.forEach(({ path, value }) => {
                const anomaly = this.detectStatisticalAnomaly(path, value, data);
                if (anomaly) {
                    anomalies.push(anomaly);
                }
            });
            const patternAnomalies = this.detectPatternAnomalies(data);
            anomalies.push(...patternAnomalies);
        }
        catch (error) {
            this.logger.error('Anomaly detection failed', error);
        }
        return anomalies;
    }
    extractNumericalFields(obj, path = '') {
        const fields = [];
        Object.entries(obj).forEach(([key, value]) => {
            const currentPath = path ? `${path}.${key}` : key;
            if (typeof value === 'number') {
                fields.push({ path: currentPath, value });
            }
            else if (typeof value === 'object' && value !== null) {
                fields.push(...this.extractNumericalFields(value, currentPath));
            }
        });
        return fields;
    }
    detectStatisticalAnomaly(path, value, data) {
        const similarValues = this.findSimilarValues(path, data);
        if (similarValues.length < 3)
            return null;
        const mean = similarValues.reduce((sum, val) => sum + val, 0) / similarValues.length;
        const variance = similarValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / similarValues.length;
        const stdDev = Math.sqrt(variance);
        if (stdDev === 0)
            return null;
        const zScore = Math.abs((value - mean) / stdDev);
        if (zScore > 3) {
            return {
                type: 'outlier',
                field: path,
                value,
                expectedRange: [mean - 2 * stdDev, mean + 2 * stdDev],
                severity: zScore > 5 ? 'high' : 'medium',
                description: `Value ${value} is a statistical outlier (z-score: ${zScore.toFixed(2)})`,
            };
        }
        return null;
    }
    findSimilarValues(path, data) {
        const values = [];
        const baseField = path.split('.').pop();
        if (baseField) {
            Object.values(data).forEach(category => {
                if (typeof category === 'object' && category !== null && category[baseField] !== undefined) {
                    const value = category[baseField];
                    if (typeof value === 'number') {
                        values.push(value);
                    }
                }
            });
        }
        return values;
    }
    detectPatternAnomalies(data) {
        const anomalies = [];
        try {
            if (data.environmental?.emissions === 0 && data.environmental?.energy > 1000) {
                anomalies.push({
                    type: 'suspicious',
                    field: 'environmental.emissions',
                    value: 0,
                    expectedRange: 'Non-zero value expected with high energy usage',
                    severity: 'medium',
                    description: 'Zero emissions reported despite high energy consumption - potential data inconsistency',
                });
            }
            const missingFields = this.identifyMissingFields(data);
            if (missingFields.length > 5) {
                anomalies.push({
                    type: 'missing',
                    field: 'multiple',
                    value: missingFields.length,
                    expectedRange: 'All required fields present',
                    severity: 'high',
                    description: `High number of missing fields: ${missingFields.join(', ')}`,
                });
            }
        }
        catch (error) {
            this.logger.error('Pattern anomaly detection failed', error);
        }
        return anomalies;
    }
    identifyMissingFields(data) {
        const missing = [];
        const requiredFields = ['emissions', 'energy', 'water', 'waste', 'employeeData', 'governanceData'];
        requiredFields.forEach(field => {
            if (!data[field] && !data.environmental?.[field] && !data.social?.[field] && !data.governance?.[field]) {
                missing.push(field);
            }
        });
        return missing;
    }
    calculateValidationScore(aiValidation, ruleValidation, anomalies) {
        let score = 100;
        score -= aiValidation.errors.length * 10;
        score -= ruleValidation.errors.length * 10;
        score -= aiValidation.warnings.length * 3;
        score -= ruleValidation.warnings.length * 3;
        score -= anomalies.filter(a => a.severity === 'high').length * 15;
        score -= anomalies.filter(a => a.severity === 'medium').length * 8;
        score -= anomalies.filter(a => a.severity === 'low').length * 3;
        return Math.max(0, score);
    }
    calculateDataQuality(data) {
        const totalFields = this.countTotalFields(data);
        const presentFields = this.countPresentFields(data);
        const completeness = totalFields > 0 ? (presentFields / totalFields) * 100 : 0;
        const accuracy = Math.max(50, 100 - this.countDataErrors(data) * 5);
        const consistency = Math.max(60, 100 - this.countInconsistencies(data) * 8);
        const timeliness = data.lastUpdated ? this.calculateTimeliness(data.lastUpdated) : 70;
        return {
            completeness: Math.round(completeness),
            accuracy: Math.round(accuracy),
            consistency: Math.round(consistency),
            timeliness: Math.round(timeliness),
        };
    }
    countTotalFields(obj) {
        let count = 0;
        Object.values(obj).forEach(value => {
            if (typeof value === 'object' && value !== null) {
                count += this.countTotalFields(value);
            }
            else {
                count++;
            }
        });
        return count;
    }
    countPresentFields(obj) {
        let count = 0;
        Object.values(obj).forEach(value => {
            if (value !== undefined && value !== null) {
                if (typeof value === 'object') {
                    count += this.countPresentFields(value);
                }
                else {
                    count++;
                }
            }
        });
        return count;
    }
    countDataErrors(data) {
        let errors = 0;
        if (data.environmental?.emissions < 0)
            errors++;
        if (data.environmental?.renewableEnergy > 100)
            errors++;
        if (data.social?.employeeSatisfaction > 100)
            errors++;
        return errors;
    }
    countInconsistencies(data) {
        let inconsistencies = 0;
        if (data.environmental?.emissions === 0 && data.environmental?.energy > 1000)
            inconsistencies++;
        if (data.social?.employeeCount > 0 && data.social?.employeeSatisfaction === undefined)
            inconsistencies++;
        return inconsistencies;
    }
    calculateTimeliness(lastUpdated) {
        try {
            const lastUpdate = new Date(lastUpdated);
            const now = new Date();
            const daysDiff = (now.getTime() - lastUpdate.getTime()) / (1000 * 3600 * 24);
            if (daysDiff <= 7)
                return 100;
            if (daysDiff <= 30)
                return 80;
            if (daysDiff <= 90)
                return 60;
            return 40;
        }
        catch {
            return 50;
        }
    }
    generateRecommendations(aiValidation, ruleValidation, anomalies) {
        const recommendations = [];
        if (aiValidation.errors.length > 0) {
            recommendations.push('Review and correct identified data errors');
        }
        if (ruleValidation.errors.length > 0) {
            recommendations.push('Ensure data values are within expected ranges');
        }
        if (anomalies.length > 0) {
            recommendations.push('Investigate detected data anomalies');
        }
        if (aiValidation.warnings.length > 0 || ruleValidation.warnings.length > 0) {
            recommendations.push('Address data quality warnings to improve accuracy');
        }
        if (recommendations.length === 0) {
            recommendations.push('Continue monitoring data quality metrics');
        }
        return recommendations;
    }
    fallbackDataValidation(data) {
        const errors = [];
        const warnings = [];
        const anomalies = [];
        if (!data.organization) {
            warnings.push('Missing organization name');
        }
        if (!data.reportingPeriod) {
            warnings.push('Missing reporting period');
        }
        if (data.environmental?.emissions < 0) {
            errors.push('Emissions cannot be negative');
        }
        if (data.environmental?.renewableEnergy > 100) {
            errors.push('Renewable energy percentage cannot exceed 100%');
        }
        const isValid = errors.length === 0;
        const score = Math.max(0, 100 - errors.length * 20 - warnings.length * 5);
        return {
            isValid,
            score,
            errors,
            warnings,
            anomalies,
            dataQuality: {
                completeness: 70,
                accuracy: 80,
                consistency: 75,
                timeliness: 60,
            },
            recommendations: [
                'Implement comprehensive data validation',
                'Establish data quality monitoring',
                'Regular data quality audits',
            ],
        };
    }
};
exports.ValidationAgent = ValidationAgent;
exports.ValidationAgent = ValidationAgent = ValidationAgent_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ValidationAgent);
//# sourceMappingURL=validation.agent.js.map