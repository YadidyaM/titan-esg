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
var DataAnalysisAgent_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataAnalysisAgent = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
let DataAnalysisAgent = DataAnalysisAgent_1 = class DataAnalysisAgent {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(DataAnalysisAgent_1.name);
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (apiKey) {
            this.openai = new openai_1.default({ apiKey });
        }
    }
    async analyzeEnvironmental(data) {
        try {
            this.logger.log('Starting environmental analysis');
            if (!this.openai) {
                return this.fallbackEnvironmentalAnalysis(data);
            }
            const prompt = this.buildEnvironmentalPrompt(data);
            const response = await this.openai.chat.completions.create({
                model: this.configService.get('OPENAI_MODEL') || 'gpt-4-turbo-preview',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an ESG expert specializing in environmental sustainability analysis. Analyze the provided data and provide insights, scores, and recommendations.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 1000,
            });
            const analysis = this.parseEnvironmentalAnalysis(response.choices[0]?.message?.content || '');
            this.logger.log('Environmental analysis completed');
            return analysis;
        }
        catch (error) {
            this.logger.error('Environmental analysis failed, using fallback', error);
            return this.fallbackEnvironmentalAnalysis(data);
        }
    }
    async analyzeSocial(data) {
        try {
            this.logger.log('Starting social analysis');
            if (!this.openai) {
                return this.fallbackSocialAnalysis(data);
            }
            const prompt = this.buildSocialPrompt(data);
            const response = await this.openai.chat.completions.create({
                model: this.configService.get('OPENAI_MODEL') || 'gpt-4-turbo-preview',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an ESG expert specializing in social responsibility analysis. Analyze the provided data and provide insights, scores, and recommendations.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 1000,
            });
            const analysis = this.parseSocialAnalysis(response.choices[0]?.message?.content || '');
            this.logger.log('Social analysis completed');
            return analysis;
        }
        catch (error) {
            this.logger.error('Social analysis failed, using fallback', error);
            return this.fallbackSocialAnalysis(data);
        }
    }
    async analyzeGovernance(data) {
        try {
            this.logger.log('Starting governance analysis');
            if (!this.openai) {
                return this.fallbackGovernanceAnalysis(data);
            }
            const prompt = this.buildGovernancePrompt(data);
            const response = await this.openai.chat.completions.create({
                model: this.configService.get('OPENAI_MODEL') || 'gpt-4-turbo-preview',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an ESG expert specializing in corporate governance analysis. Analyze the provided data and provide insights, scores, and recommendations.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 1000,
            });
            const analysis = this.parseGovernanceAnalysis(response.choices[0]?.message?.content || '');
            this.logger.log('Governance analysis completed');
            return analysis;
        }
        catch (error) {
            this.logger.error('Governance analysis failed, using fallback', error);
            return this.fallbackGovernanceAnalysis(data);
        }
    }
    buildEnvironmentalPrompt(data) {
        return `Analyze the following environmental ESG data and provide:
1. A score from 0-100
2. 3-5 key insights
3. 3-5 actionable recommendations
4. Confidence level (0-100%)

Data: ${JSON.stringify(data, null, 2)}

Please format your response as:
Score: [number]
Insights:
- [insight 1]
- [insight 2]
- [insight 3]
Recommendations:
- [recommendation 1]
- [recommendation 2]
- [recommendation 3]
Confidence: [number]%`;
    }
    buildSocialPrompt(data) {
        return `Analyze the following social ESG data and provide:
1. A score from 0-100
2. 3-5 key insights
3. 3-5 actionable recommendations
4. Confidence level (0-100%)

Data: ${JSON.stringify(data, null, 2)}

Please format your response as:
Score: [number]
Insights:
- [insight 1]
- [insight 2]
- [insight 3]
Recommendations:
- [recommendation 1]
- [recommendation 2]
- [recommendation 3]
Confidence: [number]%`;
    }
    buildGovernancePrompt(data) {
        return `Analyze the following governance ESG data and provide:
1. A score from 0-100
2. 3-5 key insights
3. 3-5 actionable recommendations
4. Confidence level (0-100%)

Data: ${JSON.stringify(data, null, 2)}

Please format your response as:
Score: [number]
Insights:
- [insight 1]
- [insight 2]
- [insight 3]
Recommendations:
- [recommendation 1]
- [recommendation 2]
- [recommendation 3]
Confidence: [number]%`;
    }
    parseEnvironmentalAnalysis(content) {
        return this.parseAnalysisContent(content, 'Environmental');
    }
    parseSocialAnalysis(content) {
        return this.parseAnalysisContent(content, 'Social');
    }
    parseGovernanceAnalysis(content) {
        return this.parseAnalysisContent(content, 'Governance');
    }
    parseAnalysisContent(content, type) {
        try {
            const scoreMatch = content.match(/Score:\s*(\d+)/);
            const confidenceMatch = content.match(/Confidence:\s*(\d+)%/);
            const insights = content.match(/Insights:\s*((?:- [^\n]+\n?)+)/s)?.[1]
                ?.split('\n')
                .filter(line => line.trim().startsWith('-'))
                .map(line => line.trim().substring(2))
                .filter(Boolean) || [];
            const recommendations = content.match(/Recommendations:\s*((?:- [^\n]+\n?)+)/s)?.[1]
                ?.split('\n')
                .filter(line => line.trim().startsWith('-'))
                .map(line => line.trim().substring(2))
                .filter(Boolean) || [];
            return {
                score: parseInt(scoreMatch?.[1] || '50'),
                insights: insights.length > 0 ? insights : [`${type} data analysis completed`],
                recommendations: recommendations.length > 0 ? recommendations : [`Continue monitoring ${type.toLowerCase()} metrics`],
                confidence: parseInt(confidenceMatch?.[1] || '75'),
            };
        }
        catch (error) {
            this.logger.error(`Failed to parse ${type} analysis content`, error);
            return this.getDefaultAnalysisResult(type);
        }
    }
    getDefaultAnalysisResult(type) {
        return {
            score: 50,
            insights: [`${type} data analysis completed`],
            recommendations: [`Continue monitoring ${type.toLowerCase()} metrics`],
            confidence: 75,
        };
    }
    fallbackEnvironmentalAnalysis(data) {
        const emissions = data.emissions || 0;
        const renewableEnergy = data.renewableEnergy || 0;
        const wasteReduction = data.wasteReduction || 0;
        let score = 50;
        if (emissions < 1000)
            score += 20;
        if (renewableEnergy > 50)
            score += 20;
        if (wasteReduction > 30)
            score += 10;
        return {
            score: Math.min(score, 100),
            insights: [
                'Environmental data analyzed using fallback algorithm',
                `Current emissions: ${emissions} tons CO2`,
                `Renewable energy usage: ${renewableEnergy}%`,
            ],
            recommendations: [
                'Implement energy efficiency measures',
                'Increase renewable energy adoption',
                'Develop waste reduction strategies',
            ],
            confidence: 60,
        };
    }
    fallbackSocialAnalysis(data) {
        const employeeSatisfaction = data.employeeSatisfaction || 0;
        const diversityScore = data.diversityScore || 0;
        const communityInvestment = data.communityInvestment || 0;
        let score = 50;
        if (employeeSatisfaction > 70)
            score += 20;
        if (diversityScore > 60)
            score += 20;
        if (communityInvestment > 100000)
            score += 10;
        return {
            score: Math.min(score, 100),
            insights: [
                'Social data analyzed using fallback algorithm',
                `Employee satisfaction: ${employeeSatisfaction}%`,
                `Diversity score: ${diversityScore}%`,
            ],
            recommendations: [
                'Improve employee engagement programs',
                'Enhance diversity and inclusion initiatives',
                'Increase community investment',
            ],
            confidence: 60,
        };
    }
    fallbackGovernanceAnalysis(data) {
        const boardIndependence = data.boardIndependence || 0;
        const transparencyScore = data.transparencyScore || 0;
        const riskManagement = data.riskManagement || 0;
        let score = 50;
        if (boardIndependence > 70)
            score += 20;
        if (transparencyScore > 60)
            score += 20;
        if (riskManagement > 70)
            score += 10;
        return {
            score: Math.min(score, 100),
            insights: [
                'Governance data analyzed using fallback algorithm',
                `Board independence: ${boardIndependence}%`,
                `Transparency score: ${transparencyScore}%`,
            ],
            recommendations: [
                'Strengthen board independence',
                'Improve transparency and disclosure',
                'Enhance risk management frameworks',
            ],
            confidence: 60,
        };
    }
};
exports.DataAnalysisAgent = DataAnalysisAgent;
exports.DataAnalysisAgent = DataAnalysisAgent = DataAnalysisAgent_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DataAnalysisAgent);
//# sourceMappingURL=data-analysis.agent.js.map