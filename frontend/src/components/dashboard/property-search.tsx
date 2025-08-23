'use client';

import React, { useState } from 'react';
import { Search, MapPin, Building, Leaf, Eye, Download, FileText, FileSpreadsheet, Info, Brain, Coins, CheckCircle, XCircle } from 'lucide-react';
import { aiAnalysisService } from '@/lib/services/ai-analysis';
import { blockchainService } from '@/lib/services/blockchain';
import { mongodbService } from '@/lib/services/mongodb';

interface EPCData {
  address: string;
  current_energy_rating: string;
  potential_energy_rating: string;
  current_energy_efficiency: number;
  potential_energy_efficiency: number;
  property_type: string;
  built_form: string;
  inspection_date: string;
  local_authority: string;
  constituency: string;
  county: string;
  lodgement_date: string;
  transaction_type: string;
  environment_impact_current: string;
  environment_impact_potential: string;
  co2_current: number;
  co2_potential: number;
  co2_current_rating: string;
  co2_potential_rating: string;
  energy_consumption_current: number;
  energy_consumption_potential: number;
  energy_consumption_current_rating: string;
  energy_consumption_potential_rating: string;
}

interface PropertyData {
  address: string;
  postcode: string;
  property_type: string;
  tenure: string;
  council_tax_band: string;
  local_authority: string;
  region: string;
  latitude: number;
  longitude: number;
  last_sold_date?: string;
  last_sold_price?: number;
  estimated_value?: number;
}

interface PropertySearchProps {
  onSearch: (postcode: string) => Promise<{
    epcData: EPCData[];
    propertyData: PropertyData[];
  }>;
}

const PropertySearch: React.FC<PropertySearchProps> = ({ onSearch }) => {
  const [postcode, setPostcode] = useState('');
  const [searchResults, setSearchResults] = useState<{
    epcData: EPCData[];
    propertyData: PropertyData[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<{
    epc: EPCData;
    property: PropertyData;
  } | null>(null);
  const [showExportOptions, setShowExportOptions] = useState(false);
  
  // AI Quiz State
  const [sustainabilityQuestion, setSustainabilityQuestion] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [quizResult, setQuizResult] = useState<any>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [cryptoCredits, setCryptoCredits] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [canAttemptQuiz, setCanAttemptQuiz] = useState(true);

  // Mock user ID for demo purposes
  const userId = 'user_1';

  const handleSearch = async () => {
    if (!postcode.trim()) return;

    setLoading(true);
    setError(null);
    setSearchResults(null);
    setSelectedProperty(null);
    setSustainabilityQuestion(null);
    setQuizResult(null);
    setShowQuiz(false);

    try {
      const results = await onSearch(postcode.trim());
      setSearchResults(results);

      // Auto-select first property if available
      if (results.epcData.length > 0 && results.propertyData.length > 0) {
        setSelectedProperty({
          epc: results.epcData[0],
          property: results.propertyData[0]
        });

        // Check if user can attempt quiz for this postcode
        const canAttempt = await mongodbService.canAttemptQuiz(userId, postcode.trim());
        setCanAttemptQuiz(canAttempt);

        if (canAttempt) {
          // Generate sustainability question
          await generateSustainabilityQuestion(results.epcData[0], results.propertyData[0]);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const generateSustainabilityQuestion = async (epcData: EPCData, propertyData: PropertyData) => {
    try {
      setQuizLoading(true);
      const question = await aiAnalysisService.generateSustainabilityQuestion(
        postcode,
        epcData,
        propertyData
      );
      setSustainabilityQuestion(question);
      setShowQuiz(true);
    } catch (error) {
      console.error('Failed to generate question:', error);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleQuizSubmit = async () => {
    if (!userAnswer.trim() || !sustainabilityQuestion) return;

    try {
      setQuizLoading(true);
      
      // Validate answer using AI
      const result = await aiAnalysisService.validateAnswer(sustainabilityQuestion, userAnswer);
      setQuizResult(result);

      if (result.correct && canAttemptQuiz) {
        // Award crypto credits
        const creditsEarned = 0.5; // 0.5 credits for correct answer
        
        // Save to MongoDB
        await mongodbService.saveQuizAttempt({
          userId,
          postcode: postcode.trim(),
          questionId: sustainabilityQuestion.id,
          userAnswer: userAnswer.trim(),
          isCorrect: true,
          score: result.score,
          cryptoCreditsEarned: creditsEarned
        });

        // Save crypto credit record
        await mongodbService.saveCryptoCredit({
          userId,
          amount: creditsEarned,
          source: 'sustainability_quiz',
          sourceId: sustainabilityQuestion.id,
          status: 'confirmed',
          metadata: {
            postcode: postcode.trim(),
            questionId: sustainabilityQuestion.id
          }
        });

        // Update blockchain (if connected)
        try {
          // Check if wallet is connected
          const walletConnection = blockchainService.getWalletConnection();
          if (walletConnection && walletConnection.isConnected) {
            // In a real app, you would mint credits here
            // For now, we'll just log the action
            console.log(`Would mint ${creditsEarned} credits for user ${userId} for sustainability quiz`);
            
            // Update credit record with blockchain hash
            // In a real app, you'd update the MongoDB record here
          }
        } catch (blockchainError) {
          console.warn('Blockchain transaction failed, but credits were awarded:', blockchainError);
        }

        // Update local state
        setCryptoCredits(prev => prev + creditsEarned);
        setCanAttemptQuiz(false);
        
        // Record quiz attempt
        aiAnalysisService.recordQuizAttempt(userId, postcode.trim());
      }
    } catch (error) {
      console.error('Quiz submission failed:', error);
      setError('Failed to submit quiz answer. Please try again.');
    } finally {
      setQuizLoading(false);
    }
  };

  const calculateESGScore = (epcData: EPCData): number => {
    // Energy Rating: 40% weight
    const energyRatingScore = getEnergyRatingScore(epcData.current_energy_rating);
    
    // CO2 Emissions: 30% weight (lower emissions = higher score)
    const co2Score = Math.max(0, 100 - (epcData.co2_current * 20));
    
    // Energy Consumption: 30% weight (lower consumption = higher score)
    const consumptionScore = Math.max(0, 100 - (epcData.energy_consumption_current * 0.2));
    
    return Math.round((energyRatingScore * 0.4) + (co2Score * 0.3) + (consumptionScore * 0.3));
  };

  const getEnergyRatingScore = (rating: string): number => {
    const scores: { [key: string]: number } = {
      'A': 100, 'B': 85, 'C': 70, 'D': 55, 'E': 40, 'F': 25, 'G': 10
    };
    return scores[rating] || 0;
  };

  const getESGLevel = (score: number): string => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    if (score >= 60) return 'Poor';
    return 'Very Poor';
  };

  const getESGColor = (score: number): string => {
    if (score >= 90) return 'text-green-500';
    if (score >= 80) return 'text-blue-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 60) return 'text-orange-500';
    return 'text-red-500';
  };

  const exportToCSV = () => {
    if (!selectedProperty) return;

    const { epc, property } = selectedProperty;
    const esgScore = calculateESGScore(epc);
    const esgLevel = getESGLevel(esgScore);

    const csvData = [
      ['Property Report', ''],
      ['Generated', new Date().toLocaleDateString()],
      ['', ''],
      ['Property Information', ''],
      ['Address', epc.address],
      ['Postcode', property.postcode],
      ['Property Type', property.property_type],
      ['Tenure', property.tenure],
      ['Council Tax Band', property.council_tax_band],
      ['Local Authority', property.local_authority],
      ['Region', property.region],
      ['Estimated Value', `£${property.estimated_value?.toLocaleString() || 'N/A'}`],
      ['', ''],
      ['Energy Performance', ''],
      ['Current Rating', epc.current_energy_rating],
      ['Potential Rating', epc.potential_energy_rating],
      ['Current Efficiency', `${epc.current_energy_efficiency}%`],
      ['Potential Efficiency', `${epc.potential_energy_efficiency}%`],
      ['CO2 Emissions Current', `${epc.co2_current} kg/m²/year`],
      ['CO2 Emissions Potential', `${epc.co2_potential} kg/m²/year`],
      ['Energy Consumption Current', `${epc.energy_consumption_current} kWh/m²/year`],
      ['Energy Consumption Potential', `${epc.energy_consumption_potential} kWh/m²/year`],
      ['', ''],
      ['ESG Assessment', ''],
      ['ESG Score', esgScore.toString()],
      ['ESG Level', esgLevel],
      ['Energy Rating Impact', epc.current_energy_rating],
      ['CO2 Impact', epc.co2_current_rating],
      ['Efficiency', `${epc.current_energy_efficiency}%`]
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `property-report-${property.postcode}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = async () => {
    if (!selectedProperty) return;

    try {
      // Create a simple HTML-based PDF using browser print functionality
      const { epc, property } = selectedProperty;
      const esgScore = calculateESGScore(epc);
      const esgLevel = getESGLevel(esgScore);

      // Create a new window with formatted content
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Popup blocked');
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Property ESG Report - ${property.postcode}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            .section h2 { color: #2563eb; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .info-item { margin-bottom: 15px; }
            .label { font-weight: bold; color: #666; }
            .value { color: #333; }
            .esg-score { text-align: center; background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .esg-score .score { font-size: 48px; font-weight: bold; color: #059669; }
            .esg-score .level { font-size: 18px; color: #059669; margin-top: 10px; }
            @media print { body { margin: 20px; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Property ESG Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="section">
            <h2>Property Information</h2>
            <div class="info-grid">
              <div class="info-item">
                <div class="label">Address:</div>
                <div class="value">${epc.address}</div>
              </div>
              <div class="info-item">
                <div class="label">Postcode:</div>
                <div class="value">${property.postcode}</div>
              </div>
              <div class="info-item">
                <div class="label">Property Type:</div>
                <div class="value">${property.property_type}</div>
              </div>
              <div class="info-item">
                <div class="label">Tenure:</div>
                <div class="value">${property.tenure}</div>
              </div>
              <div class="info-item">
                <div class="label">Council Tax:</div>
                <div class="value">Band ${property.council_tax_band}</div>
              </div>
              <div class="info-item">
                <div class="label">Local Authority:</div>
                <div class="value">${property.local_authority}</div>
              </div>
              <div class="info-item">
                <div class="label">Estimated Value:</div>
                <div class="value">£${property.estimated_value?.toLocaleString() || 'N/A'}</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2>Energy Performance</h2>
            <div class="info-grid">
              <div class="info-item">
                <div class="label">Current Rating:</div>
                <div class="value">${epc.current_energy_rating} (${epc.current_energy_efficiency}%)</div>
              </div>
              <div class="info-item">
                <div class="label">Potential Rating:</div>
                <div class="value">${epc.potential_energy_rating} (${epc.potential_energy_efficiency}%)</div>
              </div>
              <div class="info-item">
                <div class="label">CO2 Emissions:</div>
                <div class="value">${epc.co2_current} kg/m²/year</div>
              </div>
              <div class="info-item">
                <div class="label">Energy Consumption:</div>
                <div class="value">${epc.energy_consumption_current} kWh/m²/year</div>
              </div>
              <div class="info-item">
                <div class="label">Inspection Date:</div>
                <div class="value">${new Date(epc.inspection_date).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2>ESG Assessment</h2>
            <div class="esg-score">
              <div class="score">${esgScore}</div>
              <div class="level">${esgLevel}</div>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <div class="label">Energy Rating Impact:</div>
                <div class="value">${epc.current_energy_rating}</div>
              </div>
              <div class="info-item">
                <div class="label">CO2 Impact:</div>
                <div class="value">${epc.co2_current_rating}</div>
              </div>
              <div class="info-item">
                <div class="label">Efficiency:</div>
                <div class="value">${epc.current_energy_efficiency}%</div>
              </div>
            </div>
          </div>
          
          <div class="no-print" style="margin-top: 40px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #059669; color: white; border: none; border-radius: 5px; cursor: pointer;">
              Print Report
            </button>
          </div>
        </body>
        </html>
      `);

      printWindow.document.close();
      
      // Wait for content to load then trigger print
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to CSV if PDF generation fails
      exportToCSV();
    }
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      exportToCSV();
    } else {
      exportToPDF();
    }
    setShowExportOptions(false);
  };

  return (
    <div className="space-y-6">
      {/* Property Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Property Search</h2>
        </div>
        
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Info className="w-4 h-4" />
            <span className="text-sm">Connected to real EPC and Property Data APIs • Live data from government sources</span>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter postcode (e.g., CB4 1DF)"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !postcode.trim()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Search Results */}
      {searchResults && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Building className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Search Results for {postcode.toUpperCase()}
              </h2>
            </div>

            {/* EPC Data */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Leaf className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Energy Performance ({searchResults.epcData.length} properties)
                </h3>
              </div>
              <div className="grid gap-4">
                {searchResults.epcData.map((epc, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    onClick={() => {
                      const property = searchResults.propertyData[index] || searchResults.propertyData[0];
                      setSelectedProperty({ epc, property });
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{epc.address}</h4>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <span>Current: {epc.current_energy_efficiency}</span>
                          <span>CO2: {epc.co2_current} kg/m²/year</span>
                          <span>Potential: {epc.potential_energy_efficiency}</span>
                          <span>Energy: {epc.energy_consumption_current} kWh/m²/year</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {epc.potential_energy_rating}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Property Data */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Building className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Property Details ({searchResults.propertyData.length} properties)
                </h3>
              </div>
              <div className="grid gap-4">
                {searchResults.propertyData.map((property, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    onClick={() => {
                      const epc = searchResults.epcData[index] || searchResults.epcData[0];
                      setSelectedProperty({ epc, property });
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{property.address}</h4>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <span>Type: {property.property_type}</span>
                          <span>Council Tax: Band {property.council_tax_band}</span>
                          <span>{property.postcode}</span>
                          <span>Tenure: {property.tenure}</span>
                          <span>Value: £{(property.estimated_value || 0) / 1000000}M</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Sustainability Quiz */}
          {showQuiz && sustainabilityQuestion && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-purple-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Sustainability Quiz</h2>
                <div className="ml-auto flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Earn 0.5 crypto credits for correct answers
                  </span>
                </div>
              </div>

              {!quizResult ? (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Question:</h3>
                    <p className="text-gray-700 dark:text-gray-300">{sustainabilityQuestion.question}</p>
                    <div className="mt-2 flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                      <span>Difficulty: {sustainabilityQuestion.difficulty}</span>
                      <span>•</span>
                      <span>Category: {sustainabilityQuestion.category}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Answer:
                    </label>
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {canAttemptQuiz ? (
                        <span className="text-green-600 dark:text-green-400">✓ You can attempt this quiz today</span>
                      ) : (
                        <span className="text-red-600 dark:text-red-400">✗ Quiz already attempted for this postcode today</span>
                      )}
                    </div>
                    <button
                      onClick={handleQuizSubmit}
                      disabled={!userAnswer.trim() || quizLoading || !canAttemptQuiz}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {quizLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4" />
                          Submit Answer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${
                    quizResult.correct 
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                      : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      {quizResult.correct ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                      <h3 className={`font-medium ${
                        quizResult.correct ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                      }`}>
                        {quizResult.correct ? 'Correct Answer!' : 'Incorrect Answer'}
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Your Answer:</span>
                        <p className="text-gray-600 dark:text-gray-400">{userAnswer}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Correct Answer:</span>
                        <p className="text-gray-600 dark:text-gray-400">{sustainabilityQuestion.correctAnswer}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Explanation:</span>
                        <p className="text-gray-600 dark:text-gray-400">{sustainabilityQuestion.explanation}</p>
                      </div>
                      
                      {quizResult.correct && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                            <Coins className="w-5 h-5" />
                            <span className="font-medium">Congratulations! You earned 0.5 crypto credits!</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Property Analysis */}
          {selectedProperty && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-purple-500" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Property Analysis</h2>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowExportOptions(!showExportOptions)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export Report
                  </button>
                  
                  {showExportOptions && (
                    <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 min-w-[200px]">
                      <div className="p-2">
                        <button
                          onClick={() => handleExport('csv')}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded flex items-center gap-2"
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                          Export as CSV
                        </button>
                        <button
                          onClick={() => handleExport('pdf')}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          Export as PDF
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Property Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Property Information</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Address:</span>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedProperty.epc.address}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Postcode:</span>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedProperty.property.postcode}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Property Type:</span>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedProperty.property.property_type}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Tenure:</span>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedProperty.property.tenure}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Council Tax:</span>
                      <p className="text-gray-900 dark:text-white font-medium">Band {selectedProperty.property.council_tax_band}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Estimated Value:</span>
                      <p className="text-gray-900 dark:text-white font-medium">
                        £{selectedProperty.property.estimated_value?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Energy Performance */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Energy Performance</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Current Rating:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 dark:text-white font-medium">
                          {selectedProperty.epc.current_energy_rating} {selectedProperty.epc.current_energy_efficiency}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Potential Rating:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 dark:text-white font-medium">
                          {selectedProperty.epc.potential_energy_rating} {selectedProperty.epc.potential_energy_efficiency}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">CO2 Emissions:</span>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {selectedProperty.epc.co2_current} kg/m²/year
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Energy Consumption:</span>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {selectedProperty.epc.energy_consumption_current} kWh/m²/year
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Inspection Date:</span>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {new Date(selectedProperty.epc.inspection_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ESG Assessment */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">ESG Assessment</h3>
                  <div className="text-center mb-4">
                    <div className="w-24 h-24 bg-gray-800 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center mx-auto">
                      <span className="text-3xl font-bold text-white">
                        {calculateESGScore(selectedProperty.epc)}
                      </span>
                      <span className={`text-sm font-medium ${getESGColor(calculateESGScore(selectedProperty.epc))}`}>
                        {getESGLevel(calculateESGScore(selectedProperty.epc))}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">ESG Score</p>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Energy Rating:</span>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedProperty.epc.current_energy_rating}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">CO2 Impact:</span>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedProperty.epc.co2_current_rating}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Efficiency:</span>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedProperty.epc.current_energy_efficiency}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PropertySearch;
