export interface Game {
  id: string;
  name: string;
  description: string;
  type: 'carbon_capture' | 'sustainability_quiz' | 'trading_challenge';
  difficulty: 'easy' | 'medium' | 'hard';
  maxScore: number;
  rewardMultiplier: number;
  instructions: string[];
}

export interface GameQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

export interface GameResult {
  sessionId: string;
  score: number;
  maxScore: number;
  rewards: number;
  timeSpent: number;
  accuracy: number;
  completed: boolean;
}

class GamingService {
  private games: Game[] = [
    {
      id: 'carbon_capture',
      name: 'Carbon Capture Challenge',
      description: 'Help capture CO2 by solving environmental puzzles',
      type: 'carbon_capture',
      difficulty: 'medium',
      maxScore: 100,
      rewardMultiplier: 1.5,
      instructions: [
        'Answer questions about carbon capture technologies',
        'Complete environmental challenges',
        'Earn points for correct answers',
        'Get bonus points for speed and accuracy'
      ]
    },
    {
      id: 'sustainability_quiz',
      name: 'Sustainability Master',
      description: 'Test your knowledge of sustainable practices',
      type: 'sustainability_quiz',
      difficulty: 'easy',
      maxScore: 50,
      rewardMultiplier: 1.0,
      instructions: [
        'Answer sustainability questions',
        'Learn about eco-friendly practices',
        'Earn points for each correct answer',
        'Complete all questions to unlock rewards'
      ]
    },
    {
      id: 'trading_challenge',
      name: 'Trading Challenge',
      description: 'Practice carbon credit trading strategies',
      type: 'trading_challenge',
      difficulty: 'hard',
      maxScore: 200,
      rewardMultiplier: 2.0,
      instructions: [
        'Make trading decisions with virtual credits',
        'Analyze market trends and patterns',
        'Earn points for profitable trades',
        'Learn risk management strategies'
      ]
    }
  ];

  private questions: { [gameType: string]: GameQuestion[] } = {
    sustainability_quiz: [
      {
        id: '1',
        question: 'What is the primary greenhouse gas responsible for climate change?',
        options: ['Methane', 'Carbon Dioxide', 'Nitrous Oxide', 'Water Vapor'],
        correctAnswer: 1,
        explanation: 'Carbon dioxide (CO2) is the primary greenhouse gas contributing to climate change.',
        points: 10
      },
      {
        id: '2',
        question: 'Which renewable energy source produces the most electricity globally?',
        options: ['Solar', 'Wind', 'Hydropower', 'Biomass'],
        correctAnswer: 2,
        explanation: 'Hydropower is currently the largest renewable energy source for electricity generation.',
        points: 10
      },
      {
        id: '3',
        question: 'What percentage of Earth\'s surface is covered by oceans?',
        options: ['50%', '60%', '70%', '80%'],
        correctAnswer: 2,
        explanation: 'Oceans cover approximately 71% of Earth\'s surface.',
        points: 10
      },
      {
        id: '4',
        question: 'Which of these is NOT a sustainable practice?',
        options: ['Using public transport', 'Single-use plastics', 'Energy-efficient appliances', 'Local food sourcing'],
        correctAnswer: 1,
        explanation: 'Single-use plastics are harmful to the environment and not sustainable.',
        points: 10
      },
      {
        id: '5',
        question: 'What is the main benefit of carbon credits?',
        options: ['Reducing air pollution', 'Funding renewable energy projects', 'Creating jobs', 'All of the above'],
        correctAnswer: 3,
        explanation: 'Carbon credits provide multiple benefits including pollution reduction, funding clean energy, and job creation.',
        points: 10
      }
    ],
    carbon_capture: [
      {
        id: '1',
        question: 'Which technology captures CO2 directly from the air?',
        options: ['Direct Air Capture', 'Carbon Capture and Storage', 'Bioenergy with CCS', 'Enhanced Oil Recovery'],
        correctAnswer: 0,
        explanation: 'Direct Air Capture (DAC) technology removes CO2 directly from the atmosphere.',
        points: 20
      },
      {
        id: '2',
        question: 'What is the main challenge of carbon capture technology?',
        options: ['High cost', 'Low efficiency', 'Storage limitations', 'All of the above'],
        correctAnswer: 3,
        explanation: 'Carbon capture faces challenges in cost, efficiency, and storage.',
        points: 20
      },
      {
        id: '3',
        question: 'Which natural process helps capture carbon?',
        options: ['Photosynthesis', 'Volcanic eruptions', 'Ocean acidification', 'Deforestation'],
        correctAnswer: 0,
        explanation: 'Photosynthesis is the natural process where plants capture CO2 and convert it to oxygen.',
        points: 20
      },
      {
        id: '4',
        question: 'What is the primary storage method for captured CO2?',
        options: ['Underground storage', 'Ocean storage', 'Atmospheric release', 'Chemical conversion'],
        correctAnswer: 0,
        explanation: 'Underground geological storage is the primary method for storing captured CO2.',
        points: 20
      },
      {
        id: '5',
        question: 'Which industry produces the most CO2 emissions?',
        options: ['Transportation', 'Electricity generation', 'Industry', 'Buildings'],
        correctAnswer: 1,
        explanation: 'Electricity generation is the largest source of CO2 emissions globally.',
        points: 20
      }
    ],
    trading_challenge: [
      {
        id: '1',
        question: 'What happens to carbon credit prices when demand increases?',
        options: ['Prices decrease', 'Prices increase', 'Prices stay the same', 'Prices become volatile'],
        correctAnswer: 1,
        explanation: 'When demand for carbon credits increases, prices typically rise due to supply and demand dynamics.',
        points: 40
      },
      {
        id: '2',
        question: 'Which trading strategy involves buying low and selling high?',
        options: ['Arbitrage', 'Scalping', 'Position trading', 'Day trading'],
        correctAnswer: 2,
        explanation: 'Position trading involves holding positions for longer periods to profit from price movements.',
        points: 40
      },
      {
        id: '3',
        question: 'What is the main risk in carbon credit trading?',
        options: ['Market volatility', 'Regulatory changes', 'Liquidity issues', 'All of the above'],
        correctAnswer: 3,
        explanation: 'Carbon credit trading faces multiple risks including volatility, regulation, and liquidity.',
        points: 40
      },
      {
        id: '4',
        question: 'Which market indicator shows price momentum?',
        options: ['Moving Average', 'RSI', 'MACD', 'All of the above'],
        correctAnswer: 3,
        explanation: 'All these indicators can help identify price momentum in different ways.',
        points: 40
      },
      {
        id: '5',
        question: 'What is the purpose of stop-loss orders?',
        options: ['Maximize profits', 'Limit losses', 'Increase leverage', 'Reduce fees'],
        correctAnswer: 1,
        explanation: 'Stop-loss orders help limit potential losses by automatically selling at a predetermined price.',
        points: 40
      }
    ]
  };

  // Get all available games
  getGames(): Game[] {
    return this.games;
  }

  // Get game by ID
  getGame(gameId: string): Game | undefined {
    return this.games.find(game => game.id === gameId);
  }

  // Get questions for a specific game
  getGameQuestions(gameType: string): GameQuestion[] {
    return this.questions[gameType] || [];
  }

  // Start a new game session
  startGameSession(gameId: string): {
    sessionId: string;
    game: Game;
    questions: GameQuestion[];
    startTime: Date;
  } {
    const game = this.getGame(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    const questions = this.getGameQuestions(game.type);
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      sessionId,
      game,
      questions,
      startTime: new Date()
    };
  }

  // Calculate game score and rewards
  calculateGameResult(
    sessionId: string,
    answers: { questionId: string; selectedAnswer: number; timeSpent: number }[],
    game: Game,
    startTime: Date
  ): GameResult {
    let totalScore = 0;
    let correctAnswers = 0;
    let totalTimeSpent = 0;

    const questions = this.getGameQuestions(game.type);

    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (question && answer.selectedAnswer === question.correctAnswer) {
        totalScore += question.points;
        correctAnswers++;
      }
      totalTimeSpent += answer.timeSpent;
    });

    const accuracy = (correctAnswers / questions.length) * 100;
    const timeBonus = Math.max(0, (300 - totalTimeSpent) / 10); // Bonus for speed
    const finalScore = Math.min(game.maxScore, totalScore + timeBonus);
    const rewards = Math.floor(finalScore * game.rewardMultiplier);

    return {
      sessionId,
      score: Math.round(finalScore),
      maxScore: game.maxScore,
      rewards,
      timeSpent: totalTimeSpent,
      accuracy: Math.round(accuracy),
      completed: correctAnswers === questions.length
    };
  }

  // Get leaderboard for a specific game
  async getLeaderboard(gameType: string): Promise<Array<{
    rank: number;
    player: string;
    score: number;
    date: Date;
  }>> {
    try {
      const response = await fetch(`/api/gaming/leaderboard/${gameType}`);
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Failed to get leaderboard:', error);
      return [];
    }
  }

  // Submit game result to backend
  async submitGameResult(result: GameResult): Promise<boolean> {
    try {
      const response = await fetch('/api/gaming/submit-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to submit game result:', error);
      return false;
    }
  }

  // Get user's game statistics
  async getUserGameStats(userAddress: string): Promise<{
    totalGames: number;
    totalScore: number;
    totalRewards: number;
    averageAccuracy: number;
    favoriteGame: string;
    achievements: string[];
  }> {
    try {
      const response = await fetch(`/api/gaming/stats/${userAddress}`);
      if (response.ok) {
        return await response.json();
      }
      
      return {
        totalGames: 0,
        totalScore: 0,
        totalRewards: 0,
        averageAccuracy: 0,
        favoriteGame: '',
        achievements: []
      };
    } catch (error) {
      console.error('Failed to get user game stats:', error);
      return {
        totalGames: 0,
        totalScore: 0,
        totalRewards: 0,
        averageAccuracy: 0,
        favoriteGame: '',
        achievements: []
      };
    }
  }

  // Get daily challenges
  async getDailyChallenges(): Promise<Array<{
    id: string;
    title: string;
    description: string;
    reward: number;
    deadline: Date;
    completed: boolean;
  }>> {
    try {
      const response = await fetch('/api/gaming/daily-challenges');
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Failed to get daily challenges:', error);
      return [];
    }
  }

  // Complete daily challenge
  async completeDailyChallenge(challengeId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/gaming/complete-challenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to complete daily challenge:', error);
      return false;
    }
  }
}

export const gamingService = new GamingService();
