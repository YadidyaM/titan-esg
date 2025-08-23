// AI Analysis Service for ESG Data
// Integrates with OpenAI for intelligent ESG analysis and sustainability insights

import { OpenAI } from 'openai';

export interface AIAnalysisResult {
  id: string;
  fileId: string;
  analysis: string;
  sustainabilityScore: number;
  carbonReductionPotential: number;
  recommendations: string[];
  riskAssessment: string;
  complianceStatus: string;
  timestamp: Date;
  aiModel: string;
}

export interface SustainabilityQuestion {
  id: string;
  postcode: string;
  question: string;
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'energy' | 'carbon' | 'water' | 'waste' | 'biodiversity';
}

export interface CryptoCredit {
  id: string;
  userId: string;
  amount: number;
  source: 'file_upload' | 'sustainability_quiz' | 'referral' | 'bonus';
  sourceId: string;
  timestamp: Date;
  blockchainTxHash?: string;
  status: 'pending' | 'confirmed' | 'failed';
  metadata: {
    fileName?: string;
    postcode?: string;
    questionId?: string;
    carbonReduction?: number;
  };
}

class AIAnalysisService {
  private openai: OpenAI;
  private dailyQuizAttempts: Map<string, Set<string>> = new Map(); // userId -> Set<postcode>

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || 'your-openai-api-key',
      dangerouslyAllowBrowser: true
    });
  }

  // Analyze uploaded ESG file for sustainability insights
  async analyzeESGFile(fileContent: string, fileName: string, fileType: string): Promise<AIAnalysisResult> {
    try {
      const prompt = this.buildFileAnalysisPrompt(fileContent, fileName, fileType);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert ESG analyst specializing in sustainability assessment, carbon footprint analysis, and environmental compliance. Provide detailed, actionable insights with specific metrics and recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });

      const analysis = completion.choices[0]?.message?.content || 'Analysis failed';
      
      // Extract structured data from AI response
      const result = this.parseAnalysisResponse(analysis, fileName);
      
      return {
        id: this.generateId(),
        fileId: fileName,
        analysis,
        sustainabilityScore: result.sustainabilityScore,
        carbonReductionPotential: result.carbonReductionPotential,
        recommendations: result.recommendations,
        riskAssessment: result.riskAssessment,
        complianceStatus: result.complianceStatus,
        timestamp: new Date(),
        aiModel: 'gpt-4'
      };
    } catch (error) {
      console.error('AI analysis failed:', error);
      throw new Error('Failed to analyze file with AI. Please try again.');
    }
  }

  // Generate sustainability question based on property data
  async generateSustainabilityQuestion(
    postcode: string, 
    epcData: any, 
    propertyData: any
  ): Promise<SustainabilityQuestion> {
    try {
      const prompt = this.buildQuestionGenerationPrompt(postcode, epcData, propertyData);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert sustainability educator. Generate engaging, educational questions about property sustainability based on the provided data. Questions should be specific to the property and teach valuable sustainability concepts."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      });

      const response = completion.choices[0]?.message?.content || '';
      const questionData = this.parseQuestionResponse(response, postcode);
      
      return questionData;
    } catch (error) {
      console.error('Question generation failed:', error);
      // Fallback to predefined questions
      return this.getFallbackQuestion(postcode, epcData, propertyData);
    }
  }

  // Validate user's answer to sustainability question
  async validateAnswer(
    question: SustainabilityQuestion, 
    userAnswer: string
  ): Promise<{ correct: boolean; explanation: string; score: number }> {
    try {
      const prompt = `Question: ${question.question}
Correct Answer: ${question.correctAnswer}
User Answer: ${userAnswer}

Please evaluate if the user's answer is correct. Consider:
1. Semantic similarity to the correct answer
2. Technical accuracy
3. Understanding of sustainability concepts

Respond with JSON format:
{
  "correct": boolean,
  "explanation": "detailed explanation",
  "score": number (0-100)
}`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert sustainability educator evaluating student answers. Be fair but thorough in your assessment."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 500
      });

      const response = completion.choices[0]?.message?.content || '';
      const result = this.parseValidationResponse(response);
      
      return result;
    } catch (error) {
      console.error('Answer validation failed:', error);
      // Fallback to simple text matching
      const isCorrect = userAnswer.toLowerCase().includes(question.correctAnswer.toLowerCase()) ||
                       question.correctAnswer.toLowerCase().includes(userAnswer.toLowerCase());
      
      return {
        correct: isCorrect,
        explanation: isCorrect ? "Answer is correct!" : "Answer is incorrect. Try again!",
        score: isCorrect ? 100 : 0
      };
    }
  }

  // Check if user can attempt quiz for a postcode today
  canAttemptQuiz(userId: string, postcode: string): boolean {
    const today = new Date().toDateString();
    const userAttempts = this.dailyQuizAttempts.get(userId);
    
    if (!userAttempts) {
      return true;
    }
    
    return !userAttempts.has(postcode);
  }

  // Record quiz attempt for a postcode
  recordQuizAttempt(userId: string, postcode: string): void {
    if (!this.dailyQuizAttempts.has(userId)) {
      this.dailyQuizAttempts.set(userId, new Set());
    }
    
    this.dailyQuizAttempts.get(userId)!.add(postcode);
  }

  // Calculate crypto credits based on analysis results
  calculateCryptoCredits(analysisResult: AIAnalysisResult): number {
    let credits = 0;
    
    // Base credit for file upload
    credits += 0.1;
    
    // Bonus for high sustainability score
    if (analysisResult.sustainabilityScore >= 80) {
      credits += 0.2;
    }
    
    // Bonus for carbon reduction potential
    if (analysisResult.carbonReductionPotential >= 20) {
      credits += 0.3;
    }
    
    // Bonus for compliance
    if (analysisResult.complianceStatus === 'compliant') {
      credits += 0.2;
    }
    
    // Special bonus for carbon emission files
    if (analysisResult.fileId.toLowerCase().includes('carbon') || 
        analysisResult.fileId.toLowerCase().includes('emission')) {
      credits += 1.0; // 1 crypto credit for carbon emission files
    }
    
    return Math.round(credits * 100) / 100; // Round to 2 decimal places
  }

  // Private helper methods
  private buildFileAnalysisPrompt(fileContent: string, fileName: string, fileType: string): string {
    return `Analyze the following ESG data file and provide comprehensive sustainability insights:

File: ${fileName}
Type: ${fileType}
Content: ${fileContent.substring(0, 2000)}...

Please provide:
1. Overall sustainability score (0-100)
2. Carbon reduction potential (0-100%)
3. 3-5 specific recommendations
4. Risk assessment
5. Compliance status

Respond with JSON format:
{
  "sustainabilityScore": number,
  "carbonReductionPotential": number,
  "recommendations": ["rec1", "rec2", "rec3"],
  "riskAssessment": "low/medium/high risk description",
  "complianceStatus": "compliant/partially_compliant/non_compliant"
}`;
  }

  private buildQuestionGenerationPrompt(postcode: string, epcData: any, propertyData: any): string {
    return `Generate a sustainability question based on this property data:

Postcode: ${postcode}
EPC Data: ${JSON.stringify(epcData)}
Property Data: ${JSON.stringify(propertyData)}

Create an engaging question that:
1. Is specific to this property
2. Teaches sustainability concepts
3. Has a clear, correct answer
4. Includes educational explanation

Respond with JSON format:
{
  "question": "What is the question?",
  "correctAnswer": "What is the correct answer?",
  "explanation": "Why is this answer correct?",
  "difficulty": "easy/medium/hard",
  "category": "energy/carbon/water/waste/biodiversity"
}`;
  }

  private parseAnalysisResponse(response: string, fileName: string): any {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('Failed to parse AI response as JSON:', error);
    }

    // Fallback parsing
    const sustainabilityScore = this.extractNumber(response, 'sustainability score', 70);
    const carbonReduction = this.extractNumber(response, 'carbon reduction', 15);
    
    return {
      sustainabilityScore,
      carbonReductionPotential: carbonReduction,
      recommendations: this.extractRecommendations(response),
      riskAssessment: this.extractRiskAssessment(response),
      complianceStatus: this.extractComplianceStatus(response)
    };
  }

  private parseQuestionResponse(response: string, postcode: string): SustainabilityQuestion {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        return {
          id: this.generateId(),
          postcode,
          question: data.question || 'How can this property improve its sustainability?',
          correctAnswer: data.correctAnswer || 'Implement energy efficiency measures',
          explanation: data.explanation || 'Energy efficiency reduces carbon footprint and costs',
          difficulty: data.difficulty || 'medium',
          category: data.category || 'energy'
        };
      }
    } catch (error) {
      console.warn('Failed to parse question response:', error);
    }

    return this.getFallbackQuestion(postcode, {}, {});
  }

  private parseValidationResponse(response: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('Failed to parse validation response:', error);
    }

    return {
      correct: false,
      explanation: 'Unable to validate answer',
      score: 0
    };
  }

  private extractNumber(text: string, label: string, defaultValue: number): number {
    const regex = new RegExp(`${label}[^0-9]*([0-9]+)`, 'i');
    const match = text.match(regex);
    return match ? parseInt(match[1]) : defaultValue;
  }

  private extractRecommendations(text: string): string[] {
    const recommendations = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.includes('recommend') || line.includes('suggest') || line.includes('should')) {
        const cleanLine = line.replace(/^[-*•]\s*/, '').trim();
        if (cleanLine.length > 10) {
          recommendations.push(cleanLine);
        }
      }
    }
    
    return recommendations.length > 0 ? recommendations : [
      'Implement energy monitoring systems',
      'Consider renewable energy sources',
      'Improve waste management practices'
    ];
  }

  private extractRiskAssessment(text: string): string {
    if (text.toLowerCase().includes('high risk')) return 'high';
    if (text.toLowerCase().includes('medium risk')) return 'medium';
    if (text.toLowerCase().includes('low risk')) return 'low';
    return 'medium';
  }

  private extractComplianceStatus(text: string): string {
    if (text.toLowerCase().includes('compliant')) return 'compliant';
    if (text.toLowerCase().includes('partially')) return 'partially_compliant';
    if (text.toLowerCase().includes('non-compliant') || text.toLowerCase().includes('non compliant')) return 'non_compliant';
    return 'partially_compliant';
  }

  private getFallbackQuestion(postcode: string, epcData: any, propertyData: any): SustainabilityQuestion {
    const questions = [
      {
        question: `Based on the EPC rating for ${postcode}, what is the most effective way to improve energy efficiency?`,
        correctAnswer: 'Upgrade insulation and heating systems',
        explanation: 'Improving insulation and heating systems typically provides the highest energy savings for properties with lower EPC ratings.',
        difficulty: 'medium' as const,
        category: 'energy' as const
      },
      {
        question: `What sustainability benefit would installing solar panels provide for this property?`,
        correctAnswer: 'Reduce carbon emissions and energy bills',
        explanation: 'Solar panels generate clean energy, reducing both carbon footprint and electricity costs.',
        difficulty: 'easy' as const,
        category: 'carbon' as const
      }
    ];

    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    return {
      id: this.generateId(),
      postcode,
      ...randomQuestion
    };
  }

  private generateId(): string {
    return `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const aiAnalysisService = new AIAnalysisService();
