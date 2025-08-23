'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Activity, Wallet, Users, TrendingUp, TrendingDown, 
  Zap, Shield, Coins, Globe, Cpu, Rocket, Star, Trophy, 
  ArrowUpRight, ArrowDownLeft, Plus, Minus, Lock, RefreshCw,
  Play, Pause, Target, Crown, Medal, Gift, Flame, MessageCircle,
  ExternalLink, CheckCircle, XCircle, Clock, Gamepad2, Briefcase, LogOut
} from 'lucide-react';
import { blockchainService, CarbonCredit, WalletConnection } from '../../../lib/services/blockchain';
import { gamingService, Game, GameQuestion, GameResult } from '../../../lib/services/gaming';

const Blockchain = () => {
  console.log('Blockchain component rendered - NEW VERSION');
  
  const [activeTab, setActiveTab] = useState<'trading' | 'gaming' | 'portfolio' | 'social'>('trading');
  const [walletConnection, setWalletConnection] = useState<WalletConnection | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWalletType, setSelectedWalletType] = useState<'phantom' | 'metamask' | 'custom' | null>(null);
  const [showCustomWalletForm, setShowCustomWalletForm] = useState(false);
  const [customWalletAddress, setCustomWalletAddress] = useState('');
  const [customRpcUrl, setCustomRpcUrl] = useState('');
  const [carbonCredits, setCarbonCredits] = useState<CarbonCredit[]>([]);
  const [portfolioStats, setPortfolioStats] = useState({
    totalCredits: 0,
    totalValue: 0,
    availableCredits: 0,
    lockedCredits: 0,
    monthlyGain: 0
  });
  const [tradingHistory, setTradingHistory] = useState<any[]>([]);
  const [realTimePrices, setRealTimePrices] = useState<{ [key: string]: number }>({});
  const [games, setGames] = useState<Game[]>([]);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [gameSession, setGameSession] = useState<{
    sessionId: string;
    game: Game;
    questions: GameQuestion[];
    startTime: Date;
    currentQuestion: number;
    answers: Array<{ questionId: string; selectedAnswer: number; timeSpent: number }>;
    score: number; // Added for active game session
  } | null>(null);
  const [gameStats, setGameStats] = useState<{
    totalGames: number;
    totalScore: number;
    totalRewards: number;
    averageAccuracy: number;
    favoriteGame: string;
    achievements: string[];
    gamesPlayed: number;
    creditsEarned: number;
  }>({
    totalGames: 0,
    totalScore: 0,
    totalRewards: 0,
    averageAccuracy: 0,
    favoriteGame: '',
    achievements: [],
    gamesPlayed: 0,
    creditsEarned: 0
  });

  useEffect(() => {
    initializeBlockchain();
    loadGames();
  }, []);

  useEffect(() => {
    if (walletConnection) {
      loadUserData();
      startRealTimeUpdates();
    }
  }, [walletConnection]);

  const initializeBlockchain = async () => {
    try {
      console.log('Initializing blockchain service...');
      const initialized = await blockchainService.initialize();
      console.log('Blockchain service initialized:', initialized);
      
      if (initialized) {
        const connection = blockchainService.getWalletConnection();
        console.log('Existing wallet connection:', connection);
        if (connection) {
          setWalletConnection(connection);
        }
      }
    } catch (error) {
      console.error('Failed to initialize blockchain:', error);
    }
  };

  const loadGames = () => {
    const availableGames = gamingService.getGames();
    setGames(availableGames);
  };

  const loadUserData = async () => {
    if (walletConnection) {
      try {
        const [credits, history, stats] = await Promise.all([
          blockchainService.getCarbonCredits(),
          blockchainService.getTradingHistory(),
          blockchainService.getPortfolioStats()
        ]);
        
        setCarbonCredits(credits);
        setTradingHistory(history);
        setPortfolioStats(stats);
        
        // Update game stats with mock data for now
        setGameStats({
          totalGames: 12,
          totalScore: 2840,
          totalRewards: 156,
          averageAccuracy: 87,
          favoriteGame: 'Carbon Capture Challenge',
          achievements: ['First Win', 'Perfect Score', 'Speed Runner'],
          gamesPlayed: 12,
          creditsEarned: 156
        });
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    }
  };

  const startRealTimeUpdates = () => {
    const interval = setInterval(async () => {
      try {
        const prices = await blockchainService.getRealTimePrices();
        setRealTimePrices(prices);
      } catch (error) {
        console.error('Failed to get real-time prices:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  };

  const connectWallet = async () => {
    if (!selectedWalletType) {
      alert('Please select a wallet type first');
      return;
    }

    setIsConnecting(true);
    try {
      console.log('Attempting to connect wallet:', selectedWalletType);
      
      let connection: WalletConnection | null = null;
      
      if (selectedWalletType === 'custom') {
        if (!customWalletAddress || !customRpcUrl) {
          alert('Please enter both wallet address and RPC URL for custom wallet');
          return;
        }
        connection = await blockchainService.connectCustomWallet(customWalletAddress, customRpcUrl);
      } else {
        connection = await blockchainService.connectWallet(selectedWalletType);
      }

      if (connection) {
        console.log('Wallet connected successfully:', connection);
        setWalletConnection(connection);
        setShowCustomWalletForm(false);
      } else {
        console.log('Wallet connection failed');
        alert('Failed to connect wallet. Please check your wallet and try again.');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      alert(`Wallet connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    await blockchainService.disconnectWallet();
    setWalletConnection(null);
    setCarbonCredits([]);
    setPortfolioStats({
      totalCredits: 0,
      totalValue: 0,
      availableCredits: 0,
      lockedCredits: 0,
      monthlyGain: 0
    });
    setTradingHistory([]);
  };

  const startGame = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    setCurrentGame(game);
    setGameSession({
      sessionId: `session_${Date.now()}`,
      game,
      questions: gamingService.getGameQuestions(game.id),
      startTime: new Date(),
      currentQuestion: 0,
      answers: [],
      score: 0
    });
  };

  const answerQuestion = (selectedAnswer: number) => {
    if (!gameSession) return;

    const newAnswers = [...gameSession.answers, { questionId: gameSession.questions[gameSession.currentQuestion].id, selectedAnswer, timeSpent: 0 }]; // Placeholder for timeSpent
    const nextQuestion = gameSession.currentQuestion + 1;

    if (nextQuestion >= gameSession.questions.length) {
      // Game completed
      completeGame(newAnswers);
    } else {
      setGameSession({
        ...gameSession,
        answers: newAnswers,
        currentQuestion: nextQuestion
      });
    }
  };

  const completeGame = async (answers: Array<{ questionId: string; selectedAnswer: number; timeSpent: number }>) => {
    if (!gameSession || !currentGame) return;

    const result = gamingService.calculateGameResult(
      gameSession.sessionId,
      answers,
      currentGame,
      gameSession.startTime
    );

    // Submit result to backend
    await gamingService.submitGameResult(result);

    // Update local state
    setGameStats(prev => ({
      ...prev,
      totalGames: prev.totalGames + 1,
      totalScore: prev.totalScore + result.score,
      totalRewards: prev.totalRewards + result.rewards
    }));

    // Reset game session
    setGameSession(null);
    setCurrentGame(null);

    // Reload user data to get updated credits
    await loadUserData();
  };

  const purchaseCredits = async (amount: number, price: number) => {
    if (!walletConnection) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const success = await blockchainService.purchaseCredits(amount, price);
      if (success) {
        await loadUserData();
        alert('Purchase successful!');
      } else {
        alert('Purchase failed. Please try again.');
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="glass-morphism p-6 rounded-b-3xl border-b border-white/10">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Blockchain Hub
            </h1>
            <p className="text-slate-400 mt-1">Trade, Game, and Manage Your Carbon Credits</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {walletConnection ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-slate-400">Connected to {walletConnection.walletType}</p>
                  <p className="text-emerald-400 font-mono text-sm">
                    {walletConnection.address.slice(0, 6)}...{walletConnection.address.slice(-4)}
                  </p>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="glass-morphism px-4 py-2 rounded-xl hover:bg-red-500/20 transition-all duration-300"
                >
                  <LogOut className="w-5 h-5 text-red-400" />
                  <span className="ml-2 text-red-400">Disconnect</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSelectedWalletType('metamask')}
                className="glass-morphism px-6 py-3 rounded-xl hover:bg-emerald-500/20 transition-all duration-300"
              >
                <Globe className="w-5 h-5 text-emerald-400" />
                <span className="ml-2 text-emerald-400">Connect Wallet</span>
              </button>
            )}
        </div>
        </div>
      </div>

      {/* Wallet Connection Section - Only show if no wallet connected */}
      {!walletConnection && (
        <div className="glass-morphism p-8 rounded-2xl text-center mx-6 mt-6">
          <Globe className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
          <p className="text-slate-400 mb-6">
            Choose your preferred wallet to access the blockchain hub features and transfer credits.
          </p>
          
          {/* Wallet Selection */}
          {!selectedWalletType && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-white mb-4">Select Wallet Type</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setSelectedWalletType('phantom')}
                  className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:border-blue-400/50"
                >
                  <div className="text-3xl mb-2">👻</div>
                  <div className="font-medium text-white">Phantom</div>
                  <div className="text-sm text-slate-400">Solana & Ethereum</div>
                </button>
                
                <button
                  onClick={() => setSelectedWalletType('metamask')}
                  className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:border-purple-400/50"
                >
                  <div className="text-3xl mb-2">🦊</div>
                  <div className="font-medium text-white">MetaMask</div>
                  <div className="text-sm text-slate-400">Popular Ethereum</div>
                </button>
                
                <button
                  onClick={() => setSelectedWalletType('custom')}
                  className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:border-gray-400/50"
                >
                  <div className="text-3xl mb-2">🔗</div>
                  <div className="font-medium text-white">Custom</div>
                  <div className="text-sm text-slate-400">RPC Endpoint</div>
                </button>
              </div>
            </div>
          )}

          {/* Custom Wallet Form */}
          {selectedWalletType === 'custom' && (
            <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <h4 className="text-lg font-medium text-white mb-4">Custom Wallet Connection</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Wallet Address (e.g., 0x123...)"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-all duration-300"
                  value={customWalletAddress}
                  onChange={(e) => setCustomWalletAddress(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="RPC URL (e.g., https://rpc.ankr.com/eth)"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-all duration-300"
                  value={customRpcUrl}
                  onChange={(e) => setCustomRpcUrl(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Connection Button */}
          {selectedWalletType && (
          <div className="space-y-4">
              <button
                onClick={connectWallet}
                disabled={isConnecting || (selectedWalletType === 'custom' && (!customWalletAddress || !customRpcUrl))}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-5 h-5 inline mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Globe className="w-5 h-5 inline mr-2" />
                    Connect {selectedWalletType === 'phantom' ? 'Phantom' : selectedWalletType === 'metamask' ? 'MetaMask' : 'Custom Wallet'}
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  setSelectedWalletType(null);
                  setCustomWalletAddress('');
                  setCustomRpcUrl('');
                }}
                className="text-slate-400 hover:text-white text-sm transition-all duration-300"
              >
                Choose Different Wallet
              </button>
            </div>
          )}
          
          {isConnecting && (
            <p className="text-slate-400 text-sm mt-2">
              Please approve the connection in your wallet popup
            </p>
          )}
        </div>
      )}

      {/* Main Content Tabs */}
      <div className="p-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 glass-morphism p-1 rounded-xl mb-6">
          {[
            { id: 'trading', label: 'Trading Floor', icon: TrendingUp },
            { id: 'gaming', label: 'Gaming Hub', icon: Gamepad2 },
            { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
            { id: 'social', label: 'Social Trading', icon: Users }
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

        {/* Tab Content */}
        <div className="glass-morphism rounded-2xl p-6">
          {activeTab === 'trading' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Trading Floor</h2>
                {!walletConnection && (
                  <div className="text-amber-400 text-sm bg-amber-500/20 px-3 py-1 rounded-lg">
                    Connect wallet to start trading
                  </div>
                )}
              </div>
              
              {/* Real-time Market Data */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-morphism p-4 rounded-xl border border-white/10">
                  <h3 className="text-lg font-medium text-white mb-2">Carbon Credits</h3>
                  <p className="text-3xl font-bold text-emerald-400">$45.67</p>
                  <p className="text-green-400 text-sm">+2.34% (24h)</p>
                </div>
                <div className="glass-morphism p-4 rounded-xl border border-white/10">
                  <h3 className="text-lg font-medium text-white mb-2">Volume (24h)</h3>
                  <p className="text-3xl font-bold text-blue-400">$2.4M</p>
                  <p className="text-blue-400 text-sm">+15.2% (24h)</p>
                </div>
                <div className="glass-morphism p-4 rounded-xl border border-white/10">
                  <h3 className="text-lg font-medium text-white mb-2">Market Cap</h3>
                  <p className="text-3xl font-bold text-purple-400">$156M</p>
                  <p className="text-purple-400 text-sm">+8.7% (24h)</p>
                </div>
              </div>

              {/* Purchase Interface */}
              <div className="glass-morphism p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-medium text-white mb-4">Purchase Carbon Credits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Price per Credit</label>
                    <input
                      type="number"
                      placeholder="Enter price"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    const amount = (document.querySelector('#purchase-amount') as HTMLInputElement)?.value;
                    const price = (document.querySelector('#purchase-price') as HTMLInputElement)?.value;
                    if (amount && price) {
                      purchaseCredits(parseFloat(amount), parseFloat(price));
                    }
                  }}
                  disabled={!walletConnection}
                  className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {walletConnection ? 'Purchase Credits' : 'Connect Wallet to Purchase'}
                </button>
              </div>

              {/* Trading History */}
              <div className="glass-morphism p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-medium text-white mb-4">Recent Trades</h3>
                <div className="space-y-3">
                  {tradingHistory.map((trade, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{trade.type}</p>
                        <p className="text-slate-400 text-sm">{trade.amount} credits</p>
                </div>
                <div className="text-right">
                        <p className="text-emerald-400 font-medium">${trade.price}</p>
                        <p className="text-slate-400 text-sm">{trade.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gaming' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Gaming Hub</h2>
                {!walletConnection && (
                  <div className="text-amber-400 text-sm bg-amber-500/20 px-3 py-1 rounded-lg">
                    Connect wallet to earn rewards
                  </div>
                )}
              </div>
              
              {/* Game Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {games.map((game) => (
                  <div key={game.id} className="glass-morphism p-6 rounded-xl border border-white/10 hover:border-emerald-400/50 transition-all duration-300">
                    <div className="text-4xl mb-4">
                      {game.type === 'carbon_capture' ? '🌱' : 
                       game.type === 'sustainability_quiz' ? '📚' : '📊'}
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">{game.name}</h3>
                    <p className="text-slate-400 text-sm mb-4">{game.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-emerald-400 font-medium">Reward: {game.rewardMultiplier}x</span>
                      <span className="text-slate-400 text-sm">Difficulty: {game.difficulty}</span>
                    </div>
                    <button
                      onClick={() => startGame(game.id)}
                      disabled={!walletConnection}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {walletConnection ? 'Start Game' : 'Connect Wallet to Play'}
                    </button>
              </div>
            ))}
          </div>

              {/* Active Game Session */}
              {currentGame && gameSession && (
                <div className="glass-morphism p-6 rounded-xl border border-emerald-500/30">
                  <h3 className="text-xl font-medium text-white mb-4">Active Game: {currentGame.name}</h3>
                  <div className="space-y-4">
            <div className="flex items-center justify-between">
                      <span className="text-slate-400">Question {gameSession.currentQuestion + 1} of {gameSession.questions.length}</span>
                      <span className="text-emerald-400 font-medium">Score: {gameSession.score}</span>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                      <p className="text-white text-lg mb-4">{gameSession.questions[gameSession.currentQuestion].question}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {gameSession.questions[gameSession.currentQuestion].options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => answerQuestion(index)}
                            className="p-3 text-left bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all duration-300 hover:border-emerald-400/50"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Game Statistics */}
              <div className="glass-morphism p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-medium text-white mb-4">Your Gaming Stats</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-emerald-400">{gameStats.gamesPlayed}</p>
                    <p className="text-slate-400 text-sm">Games Played</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-400">{gameStats.totalScore}</p>
                    <p className="text-slate-400 text-sm">Total Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-400">{gameStats.creditsEarned}</p>
                    <p className="text-slate-400 text-sm">Credits Earned</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-400">{gameStats.achievements}</p>
                    <p className="text-slate-400 text-sm">Achievements</p>
                  </div>
            </div>
          </div>
        </div>
          )}

          {activeTab === 'portfolio' && (
        <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Portfolio Overview</h2>
                {!walletConnection && (
                  <div className="text-amber-400 text-sm bg-amber-500/20 px-3 py-1 rounded-lg">
                    Connect wallet to view your portfolio
                  </div>
                )}
              </div>
              
              {/* Portfolio Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-morphism p-4 rounded-xl border border-white/10">
                  <h3 className="text-lg font-medium text-white mb-2">Total Credits</h3>
                  <p className="text-3xl font-bold text-emerald-400">
                    {walletConnection ? portfolioStats.totalCredits : '---'}
                  </p>
                  <p className="text-slate-400 text-sm">Carbon Credits</p>
                </div>
                <div className="glass-morphism p-4 rounded-xl border border-white/10">
                  <h3 className="text-lg font-medium text-white mb-2">Total Value</h3>
                  <p className="text-3xl font-bold text-blue-400">
                    {walletConnection ? `$${portfolioStats.totalValue.toFixed(2)}` : '---'}
                  </p>
                  <p className="text-slate-400 text-sm">USD Value</p>
                </div>
                <div className="glass-morphism p-4 rounded-xl border border-white/10">
                  <h3 className="text-lg font-medium text-white mb-2">Available</h3>
                  <p className="text-3xl font-bold text-purple-400">
                    {walletConnection ? portfolioStats.availableCredits : '---'}
                  </p>
                  <p className="text-slate-400 text-sm">Ready to Trade</p>
                </div>
                <div className="glass-morphism p-4 rounded-xl border border-white/10">
                  <h3 className="text-lg font-medium text-white mb-2">Monthly Gain</h3>
                  <p className="text-3xl font-bold text-yellow-400">
                    {walletConnection ? `${portfolioStats.monthlyGain > 0 ? '+' : ''}${portfolioStats.monthlyGain.toFixed(2)}%` : '---'}
                  </p>
                  <p className="text-slate-400 text-sm">30 Day Change</p>
                </div>
              </div>

              {/* Carbon Credit Portfolio */}
              <div className="glass-morphism p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-medium text-white mb-4">Carbon Credit Holdings</h3>
                {walletConnection ? (
                  <div className="space-y-3">
                    {carbonCredits.map((credit) => (
                      <div key={credit.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-emerald-400 text-lg">🌱</span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{credit.type}</p>
                            <p className="text-slate-400 text-sm">{credit.credits} credits</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-400 font-medium">${credit.price}</p>
                          <p className="text-slate-400 text-sm">{credit.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🔒</div>
                    <p className="text-slate-400 mb-2">Connect your wallet to view your carbon credit portfolio</p>
                    <p className="text-slate-500 text-sm">Your credits will be automatically transferred and displayed here</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Social Trading</h2>
                {!walletConnection && (
                  <div className="text-amber-400 text-sm bg-amber-500/20 px-3 py-1 rounded-lg">
                    Connect wallet to join social trading
                  </div>
                )}
          </div>

              {/* Top Traders Leaderboard */}
              <div className="glass-morphism p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-medium text-white mb-4">🏆 Top Traders This Week</h3>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: 'CryptoQueen', address: '0x1234...5678', profit: '+$12,450', trades: 47, followers: 1240, avatar: '👑' },
                    { rank: 2, name: 'GreenTrader', address: '0x8765...4321', profit: '+$8,920', trades: 32, followers: 890, avatar: '🌱' },
                    { rank: 3, name: 'CarbonMaster', address: '0x9999...8888', profit: '+$6,780', trades: 28, followers: 756, avatar: '⚡' },
                    { rank: 4, name: 'EcoWarrior', address: '0x7777...6666', profit: '+$5,230', trades: 41, followers: 634, avatar: '🛡️' },
                    { rank: 5, name: 'SustainablePro', address: '0x5555...4444', profit: '+$4,120', trades: 35, followers: 521, avatar: '🌍' }
                  ].map((trader) => (
                    <div key={trader.rank} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                            trader.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                            trader.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                            trader.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                            'bg-white/10 text-white'
                          }`}>
                            {trader.rank}
                          </div>
                          <div className="text-2xl">{trader.avatar}</div>
                        </div>
                        <div>
                          <p className="text-white font-medium">{trader.name}</p>
                          <p className="text-slate-400 text-sm">{trader.address}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-400 font-medium">{trader.profit}</p>
                        <p className="text-slate-400 text-sm">{trader.trades} trades</p>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-400 font-medium">{trader.followers}</p>
                        <p className="text-slate-400 text-sm">followers</p>
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300">
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trading Strategies & Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-morphism p-6 rounded-xl border border-white/10">
                  <h3 className="text-xl font-medium text-white mb-4">💡 Popular Strategies</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Carbon Arbitrage', description: 'Buy low on one exchange, sell high on another', success: '87%', users: 234 },
                      { name: 'Seasonal Trading', description: 'Trade based on environmental policy cycles', success: '92%', users: 189 },
                      { name: 'ESG Momentum', description: 'Follow sustainable company trends', success: '78%', users: 156 }
                    ].map((strategy, index) => (
                      <div key={index} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium">{strategy.name}</h4>
                          <span className="text-emerald-400 text-sm font-medium">{strategy.success} success</span>
                        </div>
                        <p className="text-slate-400 text-sm mb-2">{strategy.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-xs">{strategy.users} traders using</span>
                          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-all duration-300">
                            Learn More
              </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-morphism p-6 rounded-xl border border-white/10">
                  <h3 className="text-xl font-medium text-white mb-4">📊 Market Sentiment</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white">Bullish</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-slate-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-green-400 font-medium">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white">Neutral</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-slate-700 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                        <span className="text-yellow-400 font-medium">20%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white">Bearish</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-slate-700 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                        </div>
                        <span className="text-red-400 font-medium">5%</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-400 text-sm">
                      💡 <strong>Insight:</strong> Market sentiment is strongly bullish on carbon credits due to new environmental regulations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Community Feed */}
              <div className="glass-morphism p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-medium text-white mb-4">🌐 Community Feed</h3>
                <div className="space-y-4">
                  {[
                    { 
                      user: 'CryptoQueen', 
                      avatar: '👑', 
                      action: 'just made a profitable trade', 
                      details: 'Bought 500 carbon credits at $42.30, expecting 15% gain', 
                      time: '2 hours ago',
                      likes: 24,
                      comments: 8
                    },
                    { 
                      user: 'GreenTrader', 
                      avatar: '🌱', 
                      action: 'shared a strategy', 
                      details: 'New arbitrage opportunity between exchanges A and B. Risk: Low, Potential: 8-12%', 
                      time: '4 hours ago',
                      likes: 18,
                      comments: 12
                    },
                    { 
                      user: 'CarbonMaster', 
                      avatar: '⚡', 
                      action: 'completed a challenge', 
                      details: 'Achieved "Perfect Trader" badge with 95% accuracy this week!', 
                      time: '6 hours ago',
                      likes: 31,
                      comments: 15
                    }
                  ].map((post, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{post.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-white font-medium">{post.user}</span>
                            <span className="text-slate-400">{post.action}</span>
                          </div>
                          <p className="text-white mb-2">{post.details}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-sm">{post.time}</span>
                            <div className="flex items-center space-x-4">
                              <button className="flex items-center space-x-1 text-slate-400 hover:text-red-400 transition-all duration-300">
                                <span>❤️</span>
                                <span className="text-sm">{post.likes}</span>
              </button>
                              <button className="flex items-center space-x-1 text-slate-400 hover:text-blue-400 transition-all duration-300">
                                <span>💬</span>
                                <span className="text-sm">{post.comments}</span>
              </button>
                              <button className="text-slate-400 hover:text-emerald-400 text-sm transition-all duration-300">
                                Share
              </button>
            </div>
          </div>
        </div>
      </div>
                </div>
                  ))}
                </div>
              </div>

              {/* Copy Trading */}
              <div className="glass-morphism p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-medium text-white mb-4">🔄 Copy Trading</h3>
                <p className="text-slate-400 mb-4">
                  Automatically copy the trades of successful traders. Set your risk level and let the pros do the work.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Conservative', risk: 'Low', description: 'Copy 20% of trades, max 5% portfolio', minAmount: '$100' },
                    { name: 'Moderate', risk: 'Medium', description: 'Copy 50% of trades, max 15% portfolio', minAmount: '$500' },
                    { name: 'Aggressive', risk: 'High', description: 'Copy 80% of trades, max 30% portfolio', minAmount: '$1000' }
                  ].map((plan, index) => (
                    <div key={index} className="p-4 border border-white/10 rounded-lg hover:border-emerald-400/50 transition-all duration-300">
                      <h4 className="text-white font-medium mb-2">{plan.name}</h4>
                      <p className="text-slate-400 text-sm mb-2">{plan.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          plan.risk === 'Low' ? 'bg-green-500/20 text-green-400' :
                          plan.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {plan.risk} Risk
                        </span>
                        <span className="text-emerald-400 text-sm font-medium">Min: {plan.minAmount}</span>
              </div>
                      <button
                        disabled={!walletConnection}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {walletConnection ? 'Start Copy Trading' : 'Connect Wallet'}
                      </button>
            </div>
          ))}
        </div>
      </div>

              {/* Trading Challenges */}
              <div className="glass-morphism p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-medium text-white mb-4">🎯 Trading Challenges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">Active Challenges</h4>
                    {[
                      { name: 'Carbon King', description: 'Earn the highest profit in 7 days', prize: '1000 credits', participants: 156, endsIn: '3 days' },
                      { name: 'Speed Trader', description: 'Complete 50 trades in 24 hours', prize: '500 credits', participants: 89, endsIn: '1 day' },
                      { name: 'Risk Master', description: 'Achieve 90%+ accuracy with high volume', prize: '750 credits', participants: 234, endsIn: '5 days' }
                    ].map((challenge, index) => (
                      <div key={index} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-white font-medium">{challenge.name}</h5>
                          <span className="text-emerald-400 text-sm font-medium">{challenge.prize}</span>
                        </div>
                        <p className="text-slate-400 text-sm mb-2">{challenge.description}</p>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>{challenge.participants} participants</span>
                          <span>Ends in {challenge.endsIn}</span>
                        </div>
                        <button
                          disabled={!walletConnection}
                          className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {walletConnection ? 'Join Challenge' : 'Connect Wallet to Join'}
                        </button>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4">Your Achievements</h4>
                    {walletConnection ? (
                      <div className="space-y-3">
                        {[
                          { name: 'First Trade', icon: '🎯', unlocked: true, date: '2 days ago' },
                          { name: 'Profit Maker', icon: '💰', unlocked: true, date: '1 day ago' },
                          { name: 'Social Butterfly', icon: '🦋', unlocked: false, progress: '3/5' },
                          { name: 'Copy Master', icon: '🔄', unlocked: false, progress: '0/10' }
                        ].map((achievement, index) => (
                          <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                            achievement.unlocked ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-slate-500/20 border border-slate-500/30'
                          }`}>
                            <div className={`text-2xl ${achievement.unlocked ? 'opacity-100' : 'opacity-50'}`}>
                              {achievement.icon}
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium ${achievement.unlocked ? 'text-white' : 'text-slate-400'}`}>
                                {achievement.name}
                              </p>
                              <p className="text-slate-400 text-sm">
                                {achievement.unlocked ? `Unlocked ${achievement.date}` : `Progress: ${achievement.progress}`}
                              </p>
                            </div>
                            {achievement.unlocked && (
                              <div className="text-emerald-400">✓</div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">🔒</div>
                        <p className="text-slate-400 mb-2">Connect your wallet to view achievements</p>
                        <p className="text-slate-500 text-sm">Start trading to unlock badges and rewards</p>
                      </div>
                    )}
                  </div>
        </div>
        </div>
        </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blockchain;
