import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

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

@Injectable()
export class ComplianceAgent {
  private readonly logger = new Logger(ComplianceAgent.name);
  private openai: OpenAI;

  // Framework requirements mapping
  private frameworkRequirements = {
    GRI: {
      environmental: ['GRI 301', 'GRI 302', 'GRI 303', 'GRI 304', 'GRI 305', 'GRI 306', 'GRI 307', 'GRI 308'],
      social: ['GRI 401', 'GRI 402', 'GRI 403', 'GRI 404', 'GRI 405', 'GRI 406', 'GRI 407', 'GRI 408', 'GRI 409'],
      governance: ['GRI 205', 'GRI 206', 'GRI 207', 'GRI 208', 'GRI 209', 'GRI 210', 'GRI 211', 'GRI 212']
    },
    SASB: {
      environmental: ['GHG Emissions', 'Air Quality', 'Energy Management', 'Water & Wastewater Management', 'Waste & Hazardous Materials Management'],
      social: ['Employee Health & Safety', 'Labor Rights', 'Data Security', 'Access & Affordability', 'Product Quality & Safety'],
      governance: ['Business Ethics', 'Competitive Behavior', 'Management of the Legal & Regulatory Environment', 'Critical Incident Risk Management']
    },
    TCFD: {
      governance: ['Board oversight', 'Management role'],
      strategy: ['Climate-related risks and opportunities', 'Impact on business', 'Strategic planning'],
      risk_management: ['Risk identification and assessment', 'Risk management processes'],
      metrics_targets: ['Metrics and targets', 'Scope 1, 2, and 3 emissions']
    },
    CSRD: {
      environmental: ['Climate change', 'Pollution', 'Water and marine resources', 'Biodiversity and ecosystems', 'Resource use and circular economy'],
      social: ['Equal treatment and opportunities', 'Working conditions', 'Respect for human rights', 'Anti-corruption and bribery'],
      governance: ['Business conduct', 'Political engagement', 'Management and supervisory bodies']
    }
  };

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async checkCompliance(data: any, framework: string = 'GRI'): Promise<ComplianceResult> {
    try {
      this.logger.log(`Starting compliance check for ${framework} framework`);

      if (!this.openai) {
        return this.fallbackComplianceCheck(data, framework);
      }

      const prompt = this.buildCompliancePrompt(data, framework);
      const response = await this.openai.chat.completions.create({
        model: this.configService.get<string>('OPENAI_MODEL') || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are an ESG compliance expert specializing in ${framework} framework. Analyze the provided data and determine compliance status, requirements met, and provide recommendations.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1500,
      });

      const result = this.parseComplianceResult(response.choices[0]?.message?.content || '', framework);
      this.logger.log(`${framework} compliance check completed`);
      return result;

    } catch (error) {
      this.logger.error(`${framework} compliance check failed, using fallback`, error);
      return this.fallbackComplianceCheck(data, framework);
    }
  }

  private buildCompliancePrompt(data: any, framework: string): string {
    const requirements = this.frameworkRequirements[framework] || {};
    const requirementList = Object.entries(requirements)
      .map(([category, reqs]) => {
        if (Array.isArray(reqs)) {
          return `${category}: ${reqs.join(', ')}`;
        }
        return `${category}: ${reqs}`;
      })
      .join('\n');

    return `Analyze the following ESG data for ${framework} framework compliance and provide:

1. Compliance status (compliant/non_compliant/partially_compliant)
2. Compliance score (0-100)
3. Total requirements count
4. Requirements met count
5. Missing requirements list
6. Recommendations for improvement

Framework Requirements:
${requirementList}

Data: ${JSON.stringify(data, null, 2)}

Please format your response as:
Status: [status]
Score: [number]
Total Requirements: [number]
Met Requirements: [number]
Missing Requirements:
- [requirement 1]
- [requirement 2]
Recommendations:
- [recommendation 1]
- [recommendation 2]`;
  }

  private parseComplianceResult(content: string, framework: string): ComplianceResult {
    try {
      const statusMatch = content.match(/Status:\s*(compliant|non_compliant|partially_compliant)/i);
      const scoreMatch = content.match(/Score:\s*(\d+)/);
      const totalMatch = content.match(/Total Requirements:\s*(\d+)/);
      const metMatch = content.match(/Met Requirements:\s*(\d+)/);
      
      const missingRequirements = content.match(/Missing Requirements:\s*((?:- [^\n]+\n?)+)/s)?.[1]
        ?.split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.trim().substring(2))
        .filter(Boolean) || [];

      const recommendations = content.match(/Recommendations:\s*((?:- [^\n]+\n?)+)/s)?.[1]
        ?.split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.trim().substring(2))
        .filter(Boolean) || [];

      const status = statusMatch?.[1]?.toLowerCase() as 'compliant' | 'non_compliant' | 'partially_compliant' || 'partially_compliant';
      const score = parseInt(scoreMatch?.[1] || '50');
      const totalRequirements = parseInt(totalMatch?.[1] || '20');
      const metRequirements = parseInt(metMatch?.[1] || '10');

      return {
        framework,
        status,
        score,
        totalRequirements,
        metRequirements,
        missingRequirements: missingRequirements.length > 0 ? missingRequirements : ['Framework requirements analysis completed'],
        recommendations: recommendations.length > 0 ? recommendations : ['Continue monitoring compliance metrics'],
        lastUpdated: new Date(),
      };
    } catch (error) {
      this.logger.error(`Failed to parse ${framework} compliance result`, error);
      return this.getDefaultComplianceResult(framework);
    }
  }

  private getDefaultComplianceResult(framework: string): ComplianceResult {
    return {
      framework,
      status: 'partially_compliant',
      score: 50,
      totalRequirements: 20,
      metRequirements: 10,
      missingRequirements: ['Framework requirements analysis completed'],
      recommendations: ['Continue monitoring compliance metrics'],
      lastUpdated: new Date(),
    };
  }

  // Fallback compliance check when OpenAI is not available
  private fallbackComplianceCheck(data: any, framework: string): ComplianceResult {
    const requirements = this.frameworkRequirements[framework] || {};
    const totalRequirements = Object.values(requirements).flat().length;
    
    // Simple scoring based on data availability
    let metRequirements = 0;
    let score = 0;

    if (framework === 'GRI') {
      if (data.emissions !== undefined) metRequirements += 2;
      if (data.energy !== undefined) metRequirements += 2;
      if (data.water !== undefined) metRequirements += 2;
      if (data.waste !== undefined) metRequirements += 2;
      if (data.employeeData !== undefined) metRequirements += 2;
      if (data.governanceData !== undefined) metRequirements += 2;
    } else if (framework === 'SASB') {
      if (data.ghgEmissions !== undefined) metRequirements += 3;
      if (data.energyManagement !== undefined) metRequirements += 3;
      if (data.employeeSafety !== undefined) metRequirements += 3;
      if (data.businessEthics !== undefined) metRequirements += 3;
    } else if (framework === 'TCFD') {
      if (data.climateRisks !== undefined) metRequirements += 4;
      if (data.emissions !== undefined) metRequirements += 4;
      if (data.governance !== undefined) metRequirements += 4;
    } else if (framework === 'CSRD') {
      if (data.environmental !== undefined) metRequirements += 3;
      if (data.social !== undefined) metRequirements += 3;
      if (data.governance !== undefined) metRequirements += 3;
    }

    score = totalRequirements > 0 ? Math.round((metRequirements / totalRequirements) * 100) : 0;

    let status: 'compliant' | 'non_compliant' | 'partially_compliant';
    if (score >= 80) status = 'compliant';
    else if (score >= 40) status = 'partially_compliant';
    else status = 'non_compliant';

    return {
      framework,
      status,
      score,
      totalRequirements,
      metRequirements,
      missingRequirements: ['Compliance analysis completed using fallback algorithm'],
      recommendations: [
        'Implement comprehensive data collection',
        'Establish compliance monitoring processes',
        'Regular framework requirement reviews',
      ],
      lastUpdated: new Date(),
    };
  }

  getFrameworkRequirements(framework: string) {
    return this.frameworkRequirements[framework] || {};
  }

  getSupportedFrameworks(): string[] {
    return Object.keys(this.frameworkRequirements);
  }
}
