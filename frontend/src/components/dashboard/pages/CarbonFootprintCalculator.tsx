import React, { useState } from 'react';
import { 
  Calculator, Leaf, Car, Zap, Utensils, Trash2, ShoppingBag, 
  TrendingUp, Target, Lightbulb, Award, Globe, RefreshCw, 
  CheckCircle, AlertTriangle, Info
} from 'lucide-react';
import { aiService, CarbonFootprintAnalysis } from '../../../lib/services/ai-service';

const CarbonFootprintCalculator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [footprintData, setFootprintData] = useState({
    transportation: { carMiles: 0, publicTransit: 0, flights: 0 },
    energy: { electricity: 0, gas: 0, renewable: 0 },
    food: { meatConsumption: 0, localFood: 0, organicFood: 0 },
    waste: { recycling: 0, composting: 0, landfill: 0 },
    shopping: { onlineOrders: 0, clothing: 0, electronics: 0 }
  });
  const [analysis, setAnalysis] = useState<CarbonFootprintAnalysis | null>(null);

  const storyboardSteps = [
    {
      title: "🌍 Your Sustainability Journey Begins",
      subtitle: "Let's discover your carbon footprint together",
      description: "Every choice you make has an impact on our planet. Let's measure yours and find ways to make it greener!",
      icon: Globe
    },
    {
      title: "🚗 Transportation Habits",
      subtitle: "How do you get around?",
      description: "From daily commutes to weekend trips, let's see how your travel choices affect the environment.",
      icon: Car
    },
    {
      title: "⚡ Energy Consumption",
      subtitle: "Powering your daily life",
      description: "Your home energy use is a major part of your carbon footprint. Let's explore how to make it more sustainable.",
      icon: Zap
    },
    {
      title: "🍽️ Food Choices",
      subtitle: "What's on your plate?",
      description: "Food production has a huge environmental impact. Your choices can make a real difference!",
      icon: Utensils
    },
    {
      title: "🗑️ Waste Management",
      subtitle: "How do you handle waste?",
      description: "Reducing, reusing, and recycling can significantly lower your environmental impact.",
      icon: Trash2
    },
    {
      title: "🛍️ Shopping Habits",
      subtitle: "Conscious consumer choices",
      description: "Every purchase has a carbon cost. Let's make your shopping more sustainable!",
      icon: ShoppingBag
    },
    {
      title: "🧮 AI Analysis in Progress",
      subtitle: "Our AI is calculating your footprint",
      description: "Using advanced algorithms to analyze your data and provide personalized recommendations.",
      icon: Calculator
    },
    {
      title: "📊 Your Carbon Footprint Results",
      subtitle: "Discover your impact and opportunities",
      description: "See your results and get AI-powered recommendations to reduce your environmental impact.",
      icon: Target
    }
  ];

  const handleInputChange = (category: string, field: string, value: number) => {
    setFootprintData(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const calculateFootprint = async () => {
    setIsCalculating(true);
    setCurrentStep(6); // Show calculation step
    
    try {
      const result = await aiService.calculateCarbonFootprint(footprintData);
      setAnalysis(result);
      setCurrentStep(7); // Show results
    } catch (error) {
      console.error('Calculation failed:', error);
      // Fallback calculation
      const result = aiService.calculateBasicFootprint(footprintData);
      setAnalysis(result);
      setCurrentStep(7);
    } finally {
      setIsCalculating(false);
    }
  };

  const renderInputStep = (stepIndex: number) => {
    const step = storyboardSteps[stepIndex];
    const Icon = step.icon;

    switch (stepIndex) {
      case 1: // Transportation
        return (
          <div className="space-y-6">
            <div className="glass-morphism p-6 rounded-xl border border-white/10">
              <h3 className="text-xl font-medium text-white mb-4">🚗 Transportation Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Car Miles per Week</label>
                  <input
                    type="number"
                    value={footprintData.transportation.carMiles}
                    onChange={(e) => handleInputChange('transportation', 'carMiles', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Public Transit Trips per Week</label>
                  <input
                    type="number"
                    value={footprintData.transportation.publicTransit}
                    onChange={(e) => handleInputChange('transportation', 'publicTransit', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Flights per Year</label>
                  <input
                    type="number"
                    value={footprintData.transportation.flights}
                    onChange={(e) => handleInputChange('transportation', 'flights', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Energy
        return (
          <div className="space-y-6">
            <div className="glass-morphism p-6 rounded-xl border border-white/10">
              <h3 className="text-xl font-medium text-white mb-4">⚡ Energy Consumption</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Monthly Electricity (kWh)</label>
                  <input
                    type="number"
                    value={footprintData.energy.electricity}
                    onChange={(e) => handleInputChange('energy', 'electricity', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Monthly Gas (therms)</label>
                  <input
                    type="number"
                    value={footprintData.energy.gas}
                    onChange={(e) => handleInputChange('energy', 'gas', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Renewable Energy (%)</label>
                  <input
                    type="number"
                    value={footprintData.energy.renewable}
                    onChange={(e) => handleInputChange('energy', 'renewable', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                    placeholder="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Food
        return (
          <div className="space-y-6">
            <div className="glass-morphism p-6 rounded-xl border border-white/10">
              <h3 className="text-xl font-medium text-white mb-4">🍽️ Food Consumption</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Meat Consumption (%)</label>
                  <input
                    type="number"
                    value={footprintData.food.meatConsumption}
                    onChange={(e) => handleInputChange('food', 'meatConsumption', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                    placeholder="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Local Food (%)</label>
                  <input
                    type="number"
                    value={footprintData.food.localFood}
                    onChange={(e) => handleInputChange('food', 'localFood', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                    placeholder="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Organic Food (%)</label>
                  <input
                    type="number"
                    value={footprintData.food.organicFood}
                    onChange={(e) => handleInputChange('food', 'organicFood', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                    placeholder="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // Waste
        return (
          <div className="space-y-6">
            <div className="glass-morphism p-6 rounded-xl border border-white/10">
              <h3 className="text-xl font-medium text-white mb-4">🗑️ Waste Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Recycling (%)</label>
                  <input
                    type="number"
                    value={footprintData.waste.recycling}
                    onChange={(e) => handleInputChange('waste', 'recycling', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                    placeholder="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Composting (%)</label>
                  <input
                    type="number"
                    value={footprintData.waste.composting}
                    onChange={(e) => handleInputChange('waste', 'composting', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                    placeholder="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Landfill (%)</label>
                  <input
                    type="number"
                    value={footprintData.waste.landfill}
                    onChange={(e) => handleInputChange('waste', 'landfill', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                    placeholder="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 5: // Shopping
        return (
          <div className="space-y-6">
            <div className="glass-morphism p-6 rounded-xl border border-white/10">
              <h3 className="text-xl font-medium text-white mb-4">🛍️ Shopping Habits</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Online Orders per Month</label>
                  <input
                    type="number"
                    value={footprintData.shopping.onlineOrders}
                    onChange={(e) => handleInputChange('shopping', 'onlineOrders', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Clothing Items per Month</label>
                  <input
                    type="number"
                    value={footprintData.shopping.clothing}
                    onChange={(e) => handleInputChange('shopping', 'clothing', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Electronics per Year</label>
                  <input
                    type="number"
                    value={footprintData.shopping.electronics}
                    onChange={(e) => handleInputChange('shopping', 'electronics', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderResults = () => {
    if (!analysis) return null;

    const getSustainabilityColor = (level: string) => {
      switch (level) {
        case 'excellent': return 'text-emerald-400';
        case 'good': return 'text-blue-400';
        case 'fair': return 'text-yellow-400';
        case 'poor': return 'text-red-400';
        default: return 'text-slate-400';
      }
    };

    const getSustainabilityIcon = (level: string) => {
      switch (level) {
        case 'excellent': return '🏆';
        case 'good': return '✅';
        case 'fair': return '⚠️';
        case 'poor': return '🚨';
        default: return '❓';
      }
    };

    return (
      <div className="space-y-6">
        {/* Main Result */}
        <div className="glass-morphism p-8 rounded-xl border border-white/10 text-center">
          <div className="text-6xl mb-4">{getSustainabilityIcon(analysis.sustainabilityLevel)}</div>
          <h2 className="text-3xl font-bold text-white mb-2">Your Carbon Footprint</h2>
          <p className="text-6xl font-bold text-emerald-400 mb-4">{analysis.totalFootprint} tons CO₂/year</p>
          <div className={`text-xl font-medium ${getSustainabilityColor(analysis.sustainabilityLevel)} mb-4`}>
            {analysis.sustainabilityLevel.charAt(0).toUpperCase() + analysis.sustainabilityLevel.slice(1)} Sustainability Level
          </div>
          <div className="text-slate-400">
            Impact Score: <span className="text-white font-medium">{analysis.impactScore}/100</span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="glass-morphism p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-medium text-white mb-4">📊 Category Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(analysis.categoryBreakdown).map(([category, value]) => (
              <div key={category} className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl mb-2">
                  {category === 'transportation' ? '🚗' : 
                   category === 'energy' ? '⚡' : 
                   category === 'food' ? '🍽️' : 
                   category === 'waste' ? '🗑️' : '🛍️'}
                </div>
                <p className="text-white font-medium capitalize">{category}</p>
                <p className="text-emerald-400 text-lg font-bold">{value} tons</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="glass-morphism p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-medium text-white mb-4">💡 AI-Powered Recommendations</h3>
          <div className="space-y-3">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                <p className="text-white">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Carbon Credits Needed */}
        <div className="glass-morphism p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-medium text-white mb-4">🌱 Carbon Offset Information</h3>
          <div className="text-center">
            <p className="text-slate-400 mb-2">To offset your carbon footprint, you would need:</p>
            <p className="text-3xl font-bold text-emerald-400 mb-4">{analysis.carbonCreditsNeeded} Carbon Credits</p>
            <p className="text-slate-400 text-sm">
              This represents the amount of carbon dioxide that needs to be removed from the atmosphere to balance your emissions.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderCalculationStep = () => (
    <div className="glass-morphism p-12 rounded-xl border border-white/10 text-center">
      <div className="text-6xl mb-6">🧮</div>
      <h2 className="text-2xl font-bold text-white mb-4">AI Analysis in Progress</h2>
      <p className="text-slate-400 mb-6">Our advanced AI is analyzing your data and calculating your carbon footprint...</p>
      <div className="flex justify-center">
        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="glass-morphism p-6 rounded-b-3xl border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              AI Carbon Footprint Calculator
            </h1>
            <p className="text-slate-400 mt-1">Discover your environmental impact with AI-powered insights</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 text-sm">AI Powered</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-6">
        <div className="glass-morphism p-4 rounded-xl border border-white/10 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Progress</span>
            <span className="text-sm text-white font-medium">{currentStep + 1} of {storyboardSteps.length}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-blue-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / storyboardSteps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Storyboard Content */}
        <div className="glass-morphism rounded-2xl p-6">
          {/* Step Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">
              {storyboardSteps[currentStep].icon && React.createElement(storyboardSteps[currentStep].icon, { className: "w-16 h-16 text-emerald-400 mx-auto" })}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{storyboardSteps[currentStep].title}</h2>
            <p className="text-lg text-emerald-400 mb-2">{storyboardSteps[currentStep].subtitle}</p>
            <p className="text-slate-400">{storyboardSteps[currentStep].description}</p>
          </div>

          {/* Step Content */}
          {currentStep < 6 && renderInputStep(currentStep)}
          {currentStep === 6 && renderCalculationStep()}
          {currentStep === 7 && renderResults()}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="glass-morphism px-6 py-3 rounded-xl hover:bg-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            {currentStep < 5 && (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="glass-morphism px-6 py-3 rounded-xl hover:bg-emerald-500/20 transition-all duration-300"
              >
                Next →
              </button>
            )}

            {currentStep === 5 && (
              <button
                onClick={calculateFootprint}
                disabled={isCalculating}
                className="glass-morphism px-6 py-3 rounded-xl hover:bg-emerald-500/20 transition-all duration-300 disabled:opacity-50"
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="w-5 h-5 inline mr-2 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5 inline mr-2" />
                    Calculate My Footprint
                  </>
                )}
              </button>
            )}

            {currentStep === 7 && (
              <button
                onClick={() => {
                  setCurrentStep(0);
                  setAnalysis(null);
                  setFootprintData({
                    transportation: { carMiles: 0, publicTransit: 0, flights: 0 },
                    energy: { electricity: 0, gas: 0, renewable: 0 },
                    food: { meatConsumption: 0, localFood: 0, organicFood: 0 },
                    waste: { recycling: 0, composting: 0, landfill: 0 },
                    shopping: { onlineOrders: 0, clothing: 0, electronics: 0 }
                  });
                }}
                className="glass-morphism px-6 py-3 rounded-xl hover:bg-blue-500/20 transition-all duration-300"
              >
                <RefreshCw className="w-5 h-5 inline mr-2" />
                Start Over
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonFootprintCalculator;
