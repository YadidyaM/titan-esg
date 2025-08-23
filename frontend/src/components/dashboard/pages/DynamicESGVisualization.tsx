import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Target, Lightbulb, Shield, 
  Globe, Leaf, Users, Building, RefreshCw, AlertTriangle,
  CheckCircle, Info, Zap, Award, TrendingDown
} from 'lucide-react';
import { aiService, ESGScoreVisualization } from '../../../lib/services/ai-service';

const DynamicESGVisualization = () => {
  const [esgData, setEsgData] = useState<ESGScoreVisualization | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1M' | '3M' | '6M' | '1Y'>('3M');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [activeView, setActiveView] = useState<'overview' | 'trends' | 'benchmarks' | 'insights'>('overview');

  // Mock ESG data
  const mockESGData: ESGScoreVisualization = {
    overallScore: 78.5,
    environmental: 82.3,
    social: 75.8,
    governance: 77.4,
    trends: {
      environmental: [78, 79, 81, 82, 83, 82.3],
      social: [72, 73, 74, 75, 76, 75.8],
      governance: [74, 75, 76, 77, 78, 77.4],
      overall: [75, 76, 77, 78, 79, 78.5]
    },
    benchmarks: {
      industry: 72.1,
      sector: 68.9,
      global: 65.4
    },
    recommendations: [
      "Increase renewable energy adoption to improve environmental score",
      "Enhance diversity and inclusion programs for better social performance",
      "Strengthen board independence and transparency measures"
    ],
    riskFactors: [
      "Regulatory changes in environmental compliance",
      "Supply chain sustainability risks",
      "Stakeholder engagement challenges"
    ]
  };

  useEffect(() => {
    setEsgData(mockESGData);
  }, []);

  const analyzeTrends = async () => {
    setIsAnalyzing(true);
    
    try {
      const result = await aiService.analyzeESGTrends({
        environmental: esgData!.trends.environmental,
        social: esgData!.trends.social,
        governance: esgData!.trends.governance,
        timeframe: selectedTimeframe
      });
      setAiInsights(result);
    } catch (error) {
      console.error('Trend analysis failed:', error);
      setAiInsights({
        trendAnalysis: "Trend analysis unavailable",
        predictions: ["Continue monitoring performance", "Focus on weak areas", "Maintain current practices"],
        riskAlerts: ["Monitor for changes", "Stay alert to market shifts"],
        opportunities: ["Identify improvement areas", "Explore new initiatives"]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/20 border-emerald-500/30';
    if (score >= 70) return 'bg-blue-500/20 border-blue-500/30';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return '🏆';
    if (score >= 70) return '✅';
    if (score >= 60) return '⚠️';
    return '🚨';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Main ESG Score */}
      <div className="glass-morphism p-8 rounded-xl border border-white/10 text-center">
        <div className="text-6xl mb-4">{getScoreIcon(esgData!.overallScore)}</div>
        <h2 className="text-3xl font-bold text-white mb-2">Overall ESG Score</h2>
        <p className={`text-8xl font-bold ${getScoreColor(esgData!.overallScore)} mb-4`}>
          {esgData!.overallScore}
        </p>
        <p className="text-slate-400 text-lg">Out of 100</p>
      </div>

      {/* Category Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`glass-morphism p-6 rounded-xl border ${getScoreBg(esgData!.environmental)}`}>
          <div className="text-center">
            <div className="text-4xl mb-2">🌱</div>
            <h3 className="text-xl font-medium text-white mb-2">Environmental</h3>
            <p className={`text-4xl font-bold ${getScoreColor(esgData!.environmental)} mb-2`}>
              {esgData!.environmental}
            </p>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${esgData!.environmental}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className={`glass-morphism p-6 rounded-xl border ${getScoreBg(esgData!.social)}`}>
          <div className="text-center">
            <div className="text-4xl mb-2">👥</div>
            <h3 className="text-xl font-medium text-white mb-2">Social</h3>
            <p className={`text-4xl font-bold ${getScoreColor(esgData!.social)} mb-2`}>
              {esgData!.social}
            </p>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${esgData!.social}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className={`glass-morphism p-6 rounded-xl border ${getScoreBg(esgData!.governance)}`}>
          <div className="text-center">
            <div className="text-4xl mb-2">🏛️</div>
            <h3 className="text-xl font-medium text-white mb-2">Governance</h3>
            <p className={`text-4xl font-bold ${getScoreColor(esgData!.governance)} mb-2`}>
              {esgData!.governance}
            </p>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-purple-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${esgData!.governance}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Benchmark Comparison */}
      <div className="glass-morphism p-6 rounded-xl border border-white/10">
        <h3 className="text-xl font-medium text-white mb-4">📊 Benchmark Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <h4 className="text-white font-medium mb-2">Industry Average</h4>
            <p className="text-2xl font-bold text-blue-400">{esgData!.benchmarks.industry}</p>
            <div className={`text-sm ${esgData!.overallScore > esgData!.benchmarks.industry ? 'text-emerald-400' : 'text-red-400'}`}>
              {esgData!.overallScore > esgData!.benchmarks.industry ? 'Above Average' : 'Below Average'}
            </div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <h4 className="text-white font-medium mb-2">Sector Average</h4>
            <p className="text-2xl font-bold text-purple-400">{esgData!.benchmarks.sector}</p>
            <div className={`text-sm ${esgData!.overallScore > esgData!.benchmarks.sector ? 'text-emerald-400' : 'text-red-400'}`}>
              {esgData!.overallScore > esgData!.benchmarks.sector ? 'Above Average' : 'Below Average'}
            </div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <h4 className="text-white font-medium mb-2">Global Average</h4>
            <p className="text-2xl font-bold text-yellow-400">{esgData!.benchmarks.global}</p>
            <div className={`text-sm ${esgData!.overallScore > esgData!.benchmarks.global ? 'text-emerald-400' : 'text-red-400'}`}>
              {esgData!.overallScore > esgData!.benchmarks.global ? 'Above Average' : 'Below Average'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      {/* Timeframe Selector */}
      <div className="glass-morphism p-4 rounded-xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium text-white">📈 Trend Analysis</h3>
          <button
            onClick={analyzeTrends}
            disabled={isAnalyzing}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 inline mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 inline mr-2" />
                AI Analysis
              </>
            )}
          </button>
        </div>
        
        <div className="flex space-x-2">
          {['1M', '3M', '6M', '1Y'].map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe as any)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                selectedTimeframe === timeframe
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-morphism p-6 rounded-xl border border-white/10">
          <h4 className="text-lg font-medium text-white mb-4">🌱 Environmental Trends</h4>
          <div className="space-y-2">
            {esgData!.trends.environmental.map((score, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-slate-400 text-sm w-8">M{index + 1}</span>
                <div className="flex-1 bg-slate-700 rounded-full h-3">
                  <div 
                    className="bg-emerald-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
                <span className="text-white font-medium w-12">{score}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-morphism p-6 rounded-xl border border-white/10">
          <h4 className="text-lg font-medium text-white mb-4">👥 Social Trends</h4>
          <div className="space-y-2">
            {esgData!.trends.social.map((score, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-slate-400 text-sm w-8">M{index + 1}</span>
                <div className="flex-1 bg-slate-700 rounded-full h-3">
                  <div 
                    className="bg-blue-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
                <span className="text-white font-medium w-12">{score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      {aiInsights && (
        <div className="glass-morphism p-6 rounded-xl border border-white/10">
          <h4 className="text-lg font-medium text-white mb-4 flex items-center">
            <Lightbulb className="w-5 h-5 text-yellow-400 mr-2" />
            AI-Powered Trend Insights
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-white font-medium mb-2">📊 Trend Analysis</h5>
              <p className="text-slate-300 text-sm">{aiInsights.trendAnalysis}</p>
            </div>
            
            <div>
              <h5 className="text-white font-medium mb-2">🔮 Predictions</h5>
              <div className="space-y-1">
                {aiInsights.predictions.map((prediction: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{prediction}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h5 className="text-white font-medium mb-2">⚠️ Risk Alerts</h5>
              <div className="space-y-1">
                {aiInsights.riskAlerts.map((alert: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{alert}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="text-white font-medium mb-2">💡 Opportunities</h5>
              <div className="space-y-1">
                {aiInsights.opportunities.map((opportunity: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{opportunity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderBenchmarks = () => (
    <div className="space-y-6">
      {/* Performance vs Peers */}
      <div className="glass-morphism p-6 rounded-xl border border-white/10">
        <h3 className="text-xl font-medium text-white mb-4">🏆 Performance vs Peers</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
              <span className="text-white font-medium">Your Score</span>
            </div>
            <span className="text-2xl font-bold text-emerald-400">{esgData!.overallScore}</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-white font-medium">Industry Average</span>
            </div>
            <span className="text-2xl font-bold text-blue-400">{esgData!.benchmarks.industry}</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <span className="text-white font-medium">Sector Average</span>
            </div>
            <span className="text-2xl font-bold text-purple-400">{esgData!.benchmarks.sector}</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-white font-medium">Global Average</span>
            </div>
            <span className="text-2xl font-bold text-yellow-400">{esgData!.benchmarks.global}</span>
          </div>
        </div>
      </div>

      {/* Ranking Position */}
      <div className="glass-morphism p-6 rounded-xl border border-white/10 text-center">
        <h3 className="text-xl font-medium text-white mb-4">📊 Your Ranking</h3>
        <div className="text-6xl font-bold text-emerald-400 mb-2">Top 15%</div>
        <p className="text-slate-400">You're performing better than 85% of companies in your industry</p>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      {/* AI Recommendations */}
      <div className="glass-morphism p-6 rounded-xl border border-white/10">
        <h3 className="text-xl font-medium text-white mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 text-yellow-400 mr-2" />
          AI-Powered Recommendations
        </h3>
        <div className="space-y-3">
          {esgData!.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
              <p className="text-white">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Factors */}
      <div className="glass-morphism p-6 rounded-xl border border-white/10">
        <h3 className="text-xl font-medium text-white mb-4 flex items-center">
          <Shield className="w-5 h-5 text-yellow-400 mr-2" />
          Risk Factors
        </h3>
        <div className="space-y-3">
          {esgData!.riskFactors.map((risk, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
              <p className="text-white">{risk}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div className="glass-morphism p-6 rounded-xl border border-white/10">
        <h3 className="text-xl font-medium text-white mb-4 flex items-center">
          <Target className="w-5 h-5 text-emerald-400 mr-2" />
          Recommended Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-all duration-300">
            <div className="text-2xl mb-2">🌱</div>
            <h4 className="text-white font-medium mb-1">Environmental</h4>
            <p className="text-slate-400 text-sm">Increase renewable energy adoption</p>
          </button>
          
          <button className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all duration-300">
            <div className="text-2xl mb-2">👥</div>
            <h4 className="text-white font-medium mb-1">Social</h4>
            <p className="text-slate-400 text-sm">Enhance diversity programs</p>
          </button>
          
          <button className="p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-all duration-300">
            <div className="text-2xl mb-2">🏛️</div>
            <h4 className="text-white font-medium mb-1">Governance</h4>
            <p className="text-slate-400 text-sm">Strengthen board independence</p>
          </button>
          
          <button className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 transition-all duration-300">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="text-white font-medium mb-1">Reporting</h4>
            <p className="text-slate-400 text-sm">Improve transparency measures</p>
          </button>
        </div>
      </div>
    </div>
  );

  if (!esgData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading ESG Data</h2>
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="glass-morphism p-6 rounded-b-3xl border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Dynamic ESG Score Visualization
            </h1>
            <p className="text-slate-400 mt-1">Interactive ESG performance tracking with AI-powered insights</p>
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
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'trends', label: 'Trends', icon: TrendingUp },
            { id: 'benchmarks', label: 'Benchmarks', icon: Target },
            { id: 'insights', label: 'AI Insights', icon: Lightbulb }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeView === tab.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="glass-morphism rounded-2xl p-6">
          {activeView === 'overview' && renderOverview()}
          {activeView === 'trends' && renderTrends()}
          {activeView === 'benchmarks' && renderBenchmarks()}
          {activeView === 'insights' && renderInsights()}
        </div>
      </div>
    </div>
  );
};

export default DynamicESGVisualization;
