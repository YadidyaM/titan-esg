import React, { useState, useEffect } from 'react';
import { 
  Bot, TrendingUp, Shield, Zap, Star, Users, DollarSign, 
  Play, Pause, Settings, BarChart3, Target, Lightbulb,
  RefreshCw, CheckCircle, AlertTriangle, Info, Crown, Leaf
} from 'lucide-react';
import { aiService, TradingBotStrategy } from '../../../lib/services/ai-service';

interface BotAnalysis {
  analysis: string;
  riskAssessment: string;
  optimization: string[];
  carbonImpact: string;
}

const AITradingBotMarketplace = () => {
  const [selectedBot, setSelectedBot] = useState<TradingBotStrategy | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<BotAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'marketplace' | 'my-bots' | 'performance'>('marketplace');

  // Mock trading bot data
  const tradingBots: TradingBotStrategy[] = [
    {
      id: '1',
      name: 'Carbon Arbitrage Pro',
      description: 'Advanced arbitrage strategy that identifies price differences across carbon credit exchanges and executes profitable trades automatically.',
      creator: 'TradingMaster',
      performance: {
        totalReturn: 156.7,
        winRate: 87.3,
        maxDrawdown: 8.2,
        sharpeRatio: 2.4,
        tradesCount: 1247
      },
      riskLevel: 'medium',
      carbonFocus: 'arbitrage',
      price: 299,
      subscribers: 2341,
      isActive: true
    },
    {
      id: '2',
      name: 'ESG Momentum Trader',
      description: 'Momentum-based strategy that tracks ESG performance trends and invests in companies with improving sustainability scores.',
      creator: 'GreenInvestor',
      performance: {
        totalReturn: 89.2,
        winRate: 76.8,
        maxDrawdown: 12.5,
        sharpeRatio: 1.8,
        tradesCount: 892
      },
      riskLevel: 'high',
      carbonFocus: 'momentum',
      price: 199,
      subscribers: 1567,
      isActive: true
    },
    {
      id: '3',
      name: 'Sustainable Value Finder',
      description: 'Value investing approach focused on undervalued carbon credits and sustainable assets with long-term growth potential.',
      creator: 'ValueHunter',
      performance: {
        totalReturn: 234.1,
        winRate: 92.1,
        maxDrawdown: 5.8,
        sharpeRatio: 3.2,
        tradesCount: 567
      },
      riskLevel: 'low',
      carbonFocus: 'value',
      price: 399,
      subscribers: 3421,
      isActive: true
    },
    {
      id: '4',
      name: 'Carbon Capture Optimizer',
      description: 'AI-powered strategy that optimizes carbon credit portfolios based on environmental impact and financial returns.',
      creator: 'EcoTrader',
      performance: {
        totalReturn: 178.9,
        winRate: 84.6,
        maxDrawdown: 9.3,
        sharpeRatio: 2.1,
        tradesCount: 1034
      },
      riskLevel: 'medium',
      carbonFocus: 'sustainable',
      price: 249,
      subscribers: 1892,
      isActive: true
    },
    {
      id: '5',
      name: 'Regulatory Compliance Trader',
      description: 'Strategy that anticipates regulatory changes in carbon markets and positions portfolios accordingly.',
      creator: 'PolicyExpert',
      performance: {
        totalReturn: 145.6,
        winRate: 79.2,
        maxDrawdown: 11.7,
        sharpeRatio: 1.9,
        tradesCount: 756
      },
      riskLevel: 'medium',
      carbonFocus: 'sustainable',
      price: 179,
      subscribers: 1234,
      isActive: true
    }
  ];

  const analyzeBot = async (bot: TradingBotStrategy) => {
    setIsAnalyzing(true);
    setSelectedBot(bot);
    
    try {
      const result = await aiService.analyzeTradingStrategy({
        name: bot.name,
        description: bot.description,
        riskLevel: bot.riskLevel,
        carbonFocus: bot.carbonFocus,
        historicalData: []
      });
      setAnalysis(result);
    } catch (error) {
      console.error('Bot analysis failed:', error);
      setAnalysis({
        analysis: "Analysis unavailable",
        riskAssessment: "Risk assessment pending",
        optimization: ["Review performance metrics", "Assess market conditions", "Evaluate risk parameters"],
        carbonImpact: "Carbon impact analysis pending"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-emerald-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getRiskBg = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-emerald-500/20 border-emerald-500/30';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 border-red-500/30';
      default: return 'bg-slate-500/20 border-slate-500/30';
    }
  };

  const getFocusIcon = (focus: string) => {
    switch (focus) {
      case 'arbitrage': return '🔄';
      case 'momentum': return '📈';
      case 'value': return '💎';
      case 'sustainable': return '🌱';
      default: return '🎯';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="glass-morphism p-6 rounded-b-3xl border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              AI Trading Bot Marketplace
            </h1>
            <p className="text-slate-400 mt-1">Discover and deploy AI-powered carbon credit trading strategies</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 text-sm">AI Powered</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="p-6">
        <div className="flex space-x-1 glass-morphism p-1 rounded-xl mb-6">
          {[
            { id: 'marketplace', label: 'Marketplace', icon: Bot },
            { id: 'my-bots', label: 'My Bots', icon: Settings },
            { id: 'performance', label: 'Performance', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Marketplace Tab */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            {/* Featured Bots */}
            <div className="glass-morphism p-6 rounded-xl border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">🚀 Featured Trading Bots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tradingBots.map((bot) => (
                  <div key={bot.id} className="glass-morphism p-6 rounded-xl border border-white/10 hover:border-emerald-400/50 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl">{getFocusIcon(bot.carbonFocus)}</div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskBg(bot.riskLevel)} ${getRiskColor(bot.riskLevel)}`}>
                        {bot.riskLevel.toUpperCase()}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{bot.name}</h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-3">{bot.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Creator:</span>
                        <span className="text-white font-medium">{bot.creator}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Total Return:</span>
                        <span className="text-emerald-400 font-bold">+{bot.performance.totalReturn}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Win Rate:</span>
                        <span className="text-blue-400 font-medium">{bot.performance.winRate}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Subscribers:</span>
                        <span className="text-purple-400 font-medium">{bot.subscribers.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-emerald-400">${bot.price}</div>
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm">4.8</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => analyzeBot(bot)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
                    >
                      <Bot className="w-4 h-4 inline mr-2" />
                      Analyze Bot
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bot Analysis Modal */}
            {selectedBot && (
              <div className="glass-morphism p-6 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">🤖 Bot Analysis: {selectedBot.name}</h2>
                  <button
                    onClick={() => setSelectedBot(null)}
                    className="text-slate-400 hover:text-white transition-all duration-300"
                  >
                    ✕
                  </button>
                </div>

                {isAnalyzing ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🧠</div>
                    <h3 className="text-xl font-bold text-white mb-4">AI Analysis in Progress</h3>
                    <p className="text-slate-400 mb-6">Our AI is analyzing this trading bot's strategy and performance...</p>
                    <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                  </div>
                ) : analysis ? (
                  <div className="space-y-6">
                    {/* Strategy Analysis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass-morphism p-4 rounded-xl border border-white/10">
                        <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                          <Target className="w-5 h-5 text-emerald-400 mr-2" />
                          Strategy Assessment
                        </h4>
                        <p className="text-slate-300">{analysis.analysis}</p>
                      </div>
                      
                      <div className="glass-morphism p-4 rounded-xl border border-white/10">
                        <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                          <Shield className="w-5 h-5 text-yellow-400 mr-2" />
                          Risk Assessment
                        </h4>
                        <p className="text-slate-300">{analysis.riskAssessment}</p>
                      </div>
                    </div>

                    {/* Optimization Suggestions */}
                    <div className="glass-morphism p-4 rounded-xl border border-white/10">
                      <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                        <Lightbulb className="w-5 h-5 text-blue-400 mr-2" />
                        AI Optimization Suggestions
                      </h4>
                      <div className="space-y-2">
                        {analysis.optimization.map((suggestion: string, index: number) => (
                          <div key={index} className="flex items-start space-x-2 p-2 bg-white/5 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                            <span className="text-slate-300">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Carbon Impact */}
                    <div className="glass-morphism p-4 rounded-xl border border-white/10">
                      <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                        <Leaf className="w-5 h-5 text-green-400 mr-2" />
                        Carbon Impact Assessment
                      </h4>
                      <p className="text-slate-300">{analysis.carbonImpact}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                      <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300">
                        <Play className="w-5 h-5 inline mr-2" />
                        Deploy Bot
                      </button>
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300">
                        <DollarSign className="w-5 h-5 inline mr-2" />
                        Subscribe
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}

        {/* My Bots Tab */}
        {activeTab === 'my-bots' && (
          <div className="glass-morphism p-8 rounded-xl border border-white/10 text-center">
            <div className="text-6xl mb-6">🤖</div>
            <h2 className="text-2xl font-bold text-white mb-4">My Trading Bots</h2>
            <p className="text-slate-400 mb-6">You haven't deployed any trading bots yet. Start by exploring the marketplace!</p>
            <button
              onClick={() => setActiveTab('marketplace')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
            >
              <Bot className="w-5 h-5 inline mr-2" />
              Explore Marketplace
            </button>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="glass-morphism p-8 rounded-xl border border-white/10 text-center">
            <div className="text-6xl mb-6">📊</div>
            <h2 className="text-2xl font-bold text-white mb-4">Bot Performance</h2>
            <p className="text-slate-400 mb-6">Track your deployed bots' performance and get detailed analytics.</p>
            <button
              onClick={() => setActiveTab('marketplace')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
            >
              <BarChart3 className="w-5 h-5 inline mr-2" />
              Deploy Your First Bot
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AITradingBotMarketplace;
