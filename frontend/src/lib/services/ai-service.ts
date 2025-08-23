import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: "https://api.aimlapi.com/v1",
  apiKey: process.env.NEXT_PUBLIC_AI_API_KEY || "AI_API_KEY",
  dangerouslyAllowBrowser: true
});

export interface CarbonFootprintAnalysis {
  totalFootprint: number;
  categoryBreakdown: {
    transportation: number;
    energy: number;
    food: number;
    waste: number;
    shopping: number;
  };
  recommendations: string[];
  impactScore: number;
  sustainabilityLevel: 'excellent' | 'good' | 'fair' | 'poor';
  carbonCreditsNeeded: number;
}

export interface TradingBotStrategy {
  id: string;
  name: string;
  description: string;
  creator: string;
  performance: {
    totalReturn: number;
    winRate: number;
    maxDrawdown: number;
    sharpeRatio: number;
    tradesCount: number;
  };
  riskLevel: 'low' | 'medium' | 'high';
  carbonFocus: 'arbitrage' | 'momentum' | 'value' | 'sustainable';
  price: number;
  subscribers: number;
  isActive: boolean;
}

export interface ESGScoreVisualization {
  overallScore: number;
  environmental: number;
  social: number;
  governance: number;
  trends: {
    environmental: number[];
    social: number[];
    governance: number[];
    overall: number[];
  };
  benchmarks: {
    industry: number;
    sector: number;
    global: number;
  };
  recommendations: string[];
  riskFactors: string[];
}

class AIService {
  // AI-Powered Carbon Footprint Calculator
  async calculateCarbonFootprint(userData: {
    transportation: { carMiles: number; publicTransit: number; flights: number };
    energy: { electricity: number; gas: number; renewable: number };
    food: { meatConsumption: number; localFood: number; organicFood: number };
    waste: { recycling: number; composting: number; landfill: number };
    shopping: { onlineOrders: number; clothing: number; electronics: number };
  }): Promise<CarbonFootprintAnalysis> {
    try {
      const prompt = `Analyze this user's carbon footprint data and provide detailed insights:

Transportation: ${userData.transportation.carMiles} car miles, ${userData.transportation.publicTransit} public transit trips, ${userData.transportation.flights} flights
Energy: ${userData.energy.electricity} kWh electricity, ${userData.energy.gas} therms gas, ${userData.energy.renewable}% renewable
Food: ${userData.food.meatConsumption}% meat, ${userData.food.localFood}% local food, ${userData.food.organicFood}% organic
Waste: ${userData.waste.recycling}% recycling, ${userData.waste.composting}% composting, ${userData.waste.landfill}% landfill
Shopping: ${userData.shopping.onlineOrders} online orders/month, ${userData.shopping.clothing} clothing items/month, ${userData.shopping.electronics} electronics/year

Provide a JSON response with:
- totalFootprint (CO2 tons/year)
- categoryBreakdown (transportation, energy, food, waste, shopping in CO2 tons)
- recommendations (3 actionable tips)
- impactScore (1-100)
- sustainabilityLevel (excellent/good/fair/poor)
- carbonCreditsNeeded (to offset footprint)`;

      const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      return analysis;
    } catch (error) {
      console.error('AI Carbon Footprint calculation failed:', error);
      // Fallback to basic calculation
      return this.calculateBasicFootprint(userData);
    }
  }

  // AI Trading Bot Strategy Analysis
  async analyzeTradingStrategy(strategy: {
    name: string;
    description: string;
    riskLevel: string;
    carbonFocus: string;
    historicalData: any[];
  }): Promise<{
    analysis: string;
    riskAssessment: string;
    optimization: string[];
    carbonImpact: string;
  }> {
    try {
      const prompt = `Analyze this carbon credit trading strategy:

Strategy: ${strategy.name}
Description: ${strategy.description}
Risk Level: ${strategy.riskLevel}
Carbon Focus: ${strategy.carbonFocus}

Provide a JSON response with:
- analysis (brief strategy assessment)
- riskAssessment (risk level and concerns)
- optimization (3 improvement suggestions)
- carbonImpact (environmental impact assessment)`;

      const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('AI Trading Strategy analysis failed:', error);
      return {
        analysis: "Strategy analysis unavailable",
        riskAssessment: "Risk assessment pending",
        optimization: ["Review historical performance", "Assess market conditions", "Evaluate risk parameters"],
        carbonImpact: "Carbon impact analysis pending"
      };
    }
  }

  // ESG Score Trend Analysis
  async analyzeESGTrends(esgData: {
    environmental: number[];
    social: number[];
    governance: number[];
    timeframe: string;
  }): Promise<{
    trendAnalysis: string;
    predictions: string[];
    riskAlerts: string[];
    opportunities: string[];
  }> {
    try {
      const prompt = `Analyze these ESG score trends over ${esgData.timeframe}:

Environmental: ${esgData.environmental.join(', ')}
Social: ${esgData.social.join(', ')}
Governance: ${esgData.governance.join(', ')}

Provide a JSON response with:
- trendAnalysis (overall trend assessment)
- predictions (3 future predictions)
- riskAlerts (2 risk warnings)
- opportunities (2 improvement opportunities)`;

      const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('AI ESG Trend analysis failed:', error);
      return {
        trendAnalysis: "Trend analysis unavailable",
        predictions: ["Continue monitoring performance", "Focus on weak areas", "Maintain current practices"],
        riskAlerts: ["Monitor for changes", "Stay alert to market shifts"],
        opportunities: ["Identify improvement areas", "Explore new initiatives"]
      };
    }
  }

  // Fallback basic footprint calculation
  private calculateBasicFootprint(userData: any): CarbonFootprintAnalysis {
    const totalFootprint = 
      (userData.transportation.carMiles * 0.404) +
      (userData.transportation.flights * 0.986) +
      (userData.energy.electricity * 0.00092) +
      (userData.energy.gas * 0.0053) +
      (userData.food.meatConsumption * 0.5) +
      (userData.waste.landfill * 0.25) +
      (userData.shopping.onlineOrders * 0.1);

    return {
      totalFootprint: Math.round(totalFootprint * 100) / 100,
      categoryBreakdown: {
        transportation: Math.round((userData.transportation.carMiles * 0.404 + userData.transportation.flights * 0.986) * 100) / 100,
        energy: Math.round((userData.energy.electricity * 0.00092 + userData.energy.gas * 0.0053) * 100) / 100,
        food: Math.round(userData.food.meatConsumption * 0.5 * 100) / 100,
        waste: Math.round(userData.waste.landfill * 0.25 * 100) / 100,
        shopping: Math.round(userData.shopping.onlineOrders * 0.1 * 100) / 100,
      },
      recommendations: [
        "Switch to renewable energy sources",
        "Reduce meat consumption",
        "Use public transportation more often"
      ],
      impactScore: Math.max(1, Math.min(100, Math.round(100 - (totalFootprint * 10)))),
      sustainabilityLevel: totalFootprint < 5 ? 'excellent' : totalFootprint < 10 ? 'good' : totalFootprint < 15 ? 'fair' : 'poor',
      carbonCreditsNeeded: Math.ceil(totalFootprint * 2)
    };
  }
}

export const aiService = new AIService();
