import { ethers } from 'ethers';

// Extend Window interface for MetaMask
declare global {
  interface Window {
    ethereum?: any;
    phantom?: { ethereum: any }; // Added for Phantom
  }
}

export interface CarbonCredit {
  id: string;
  type: string;
  credits: number;
  price: number;
  change24h: number;
  volume24h: number;
  status: 'verified' | 'pending' | 'locked';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  tokenId: string;
  metadata: {
    image: string;
    description: string;
    attributes: Array<{ trait_type: string; value: string }>;
  };
}

export interface WalletConnection {
  address: string;
  balance: string;
  network: string;
  isConnected: boolean;
  walletType: 'phantom' | 'metamask' | 'custom';
}

export interface WalletProvider {
  name: string;
  type: 'phantom' | 'metamask' | 'custom';
  icon: string;
  description: string;
  isAvailable: boolean;
}

export interface GameSession {
  id: string;
  gameType: 'carbon_capture' | 'sustainability_quiz' | 'trading_challenge';
  score: number;
  maxScore: number;
  rewards: number;
  completed: boolean;
  timestamp: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  reward: number;
  gameType: string;
}

class BlockchainService {
  private provider: ethers.BrowserProvider | ethers.JsonRpcProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private walletConnection: WalletConnection | null = null;
  private carbonCredits: CarbonCredit[] = [];
  private gameSessions: GameSession[] = [];
  private achievements: Achievement[] = [];

  // Get available wallet providers
  getWalletProviders(): WalletProvider[] {
    const providers: WalletProvider[] = [
      {
        name: 'Phantom',
        type: 'phantom',
        icon: '👻',
        description: 'Solana and Ethereum compatible wallet',
        isAvailable: typeof window !== 'undefined' && !!window.phantom?.ethereum
      },
      {
        name: 'MetaMask',
        type: 'metamask',
        icon: '🦊',
        description: 'Popular Ethereum wallet extension',
        isAvailable: typeof window !== 'undefined' && !!window.ethereum
      },
      {
        name: 'Custom Wallet',
        type: 'custom',
        icon: '🔗',
        description: 'Connect via custom RPC endpoint',
        isAvailable: true
      }
    ];

    return providers;
  }

  // Initialize the service
  async initialize() {
    // Just return true, we'll handle wallet connection separately
    return true;
  }

  // Connect to specific wallet type
  async connectWallet(walletType: 'phantom' | 'metamask' | 'custom', customRpcUrl?: string): Promise<WalletConnection | null> {
    try {
      let provider: ethers.BrowserProvider | ethers.JsonRpcProvider;

      switch (walletType) {
        case 'phantom':
          if (typeof window === 'undefined' || !window.phantom?.ethereum) {
            throw new Error('Phantom wallet not available');
          }
          provider = new ethers.BrowserProvider(window.phantom.ethereum);
          break;

        case 'metamask':
          if (typeof window === 'undefined' || !window.ethereum) {
            throw new Error('MetaMask not available');
          }
          provider = new ethers.BrowserProvider(window.ethereum);
          break;

        case 'custom':
          if (!customRpcUrl) {
            throw new Error('Custom RPC URL required');
          }
          provider = new ethers.JsonRpcProvider(customRpcUrl);
          break;

        default:
          throw new Error('Unsupported wallet type');
      }

      this.provider = provider;

      // Request account access
      let accounts: string[];
      if (walletType === 'custom') {
        // For custom RPC, we'll need the user to provide an address
        throw new Error('Custom wallet connection requires manual address input');
      } else {
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      }

      const address = accounts[0];
      if (!address) {
        throw new Error('No accounts found');
      }

      const balance = await provider.getBalance(address);
      const network = await provider.getNetwork();

      this.walletConnection = {
        address,
        balance: ethers.formatEther(balance),
        network: network.name,
        isConnected: true,
        walletType
      };

      // Load user-specific data
      await this.loadUserData(address);
      
      return this.walletConnection;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return null;
    }
  }

  // Connect custom wallet with address
  async connectCustomWallet(address: string, customRpcUrl: string): Promise<WalletConnection | null> {
    try {
      const provider = new ethers.JsonRpcProvider(customRpcUrl);
      this.provider = provider;

      const balance = await provider.getBalance(address);
      const network = await provider.getNetwork();

      this.walletConnection = {
        address,
        balance: ethers.formatEther(balance),
        network: network.name,
        isConnected: true,
        walletType: 'custom'
      };

      // Load user-specific data
      await this.loadUserData(address);
      
      return this.walletConnection;
    } catch (error) {
      console.error('Failed to connect custom wallet:', error);
      return null;
    }
  }

  // Disconnect wallet
  async disconnectWallet() {
    this.walletConnection = null;
    this.provider = null;
    this.signer = null;
    this.carbonCredits = [];
    this.gameSessions = [];
    this.achievements = [];
  }

  // Get wallet connection status
  getWalletConnection(): WalletConnection | null {
    return this.walletConnection;
  }

  // Load wallet data
  private async loadWalletData() {
    if (!this.signer) return;
    
    try {
      const address = await this.signer.getAddress();
      const balance = await this.signer.provider!.getBalance(address);
      const network = await this.signer.provider!.getNetwork();

      this.walletConnection = {
        address,
        balance: ethers.formatEther(balance),
        network: network.name,
        isConnected: true,
        walletType: 'metamask' // Default to metamask for signer-based connections
      };
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    }
  }

  // Load carbon credits from blockchain
  private async loadCarbonCredits() {
    try {
      // This would typically call your backend API
      const response = await fetch('/api/blockchain/carbon-credits');
      if (response.ok) {
        this.carbonCredits = await response.json();
      }
    } catch (error) {
      console.error('Failed to load carbon credits:', error);
      // Fallback to empty array
      this.carbonCredits = [];
    }
  }

  // Load game sessions from backend
  private async loadGameSessions() {
    try {
      const response = await fetch('/api/gaming/sessions');
      if (response.ok) {
        this.gameSessions = await response.json();
      }
    } catch (error) {
      console.error('Failed to load game sessions:', error);
      this.gameSessions = [];
    }
  }

  // Load achievements from backend
  private async loadAchievements() {
    try {
      const response = await fetch('/api/gaming/achievements');
      if (response.ok) {
        this.achievements = await response.json();
      }
    } catch (error) {
      console.error('Failed to load achievements:', error);
      this.achievements = [];
    }
  }

  // Load user-specific data
  private async loadUserData(address: string) {
    try {
      const [creditsResponse, sessionsResponse, achievementsResponse] = await Promise.all([
        fetch(`/api/blockchain/user/${address}/credits`),
        fetch(`/api/gaming/user/${address}/sessions`),
        fetch(`/api/gaming/user/${address}/achievements`)
      ]);

      if (creditsResponse.ok) {
        this.carbonCredits = await creditsResponse.json();
      }
      if (sessionsResponse.ok) {
        this.gameSessions = await sessionsResponse.json();
      }
      if (achievementsResponse.ok) {
        this.achievements = await achievementsResponse.json();
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }

  // Get carbon credits
  getCarbonCredits(): CarbonCredit[] {
    return this.carbonCredits;
  }

  // Get game sessions
  getGameSessions(): GameSession[] {
    return this.gameSessions;
  }

  // Get achievements
  getAchievements(): Achievement[] {
    return this.achievements;
  }

  // Purchase carbon credits
  async purchaseCredits(amount: number, price: number): Promise<boolean> {
    try {
      if (!this.signer || !this.walletConnection) {
        throw new Error('Wallet not connected');
      }

      const response = await fetch('/api/blockchain/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        amount,
          price,
          buyerAddress: this.walletConnection.address
        })
      });

      if (response.ok) {
        await this.loadCarbonCredits();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to purchase credits:', error);
      return false;
    }
  }

  // Start a new game session
  async startGame(gameType: string): Promise<GameSession | null> {
    try {
      if (!this.walletConnection) {
        throw new Error('Wallet not connected');
      }

      const response = await fetch('/api/gaming/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameType,
          playerAddress: this.walletConnection.address
        })
      });

      if (response.ok) {
        const session = await response.json();
        this.gameSessions.push(session);
        return session;
      }
      return null;
    } catch (error) {
      console.error('Failed to start game:', error);
      return null;
    }
  }

  // Complete a game session
  async completeGame(sessionId: string, score: number): Promise<boolean> {
    try {
      const response = await fetch(`/api/gaming/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          score,
          playerAddress: this.walletConnection?.address
        })
      });

      if (response.ok) {
        await this.loadGameSessions();
        await this.loadAchievements();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to complete game:', error);
      return false;
    }
  }

  // Get real-time carbon credit prices
  async getRealTimePrices(): Promise<{ [key: string]: number }> {
    try {
      const response = await fetch('/api/blockchain/prices');
      if (response.ok) {
        return await response.json();
      }
      return {};
    } catch (error) {
      console.error('Failed to get real-time prices:', error);
      return {};
    }
  }

  // Get trading history
  async getTradingHistory(): Promise<any[]> {
    try {
      if (!this.walletConnection) return [];

      const response = await fetch(`/api/blockchain/history/${this.walletConnection.address}`);
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Failed to get trading history:', error);
      return [];
    }
  }

  // Get portfolio statistics
  async getPortfolioStats(): Promise<{
    totalCredits: number;
    totalValue: number;
    availableCredits: number;
    lockedCredits: number;
    monthlyGain: number;
  }> {
    try {
      if (!this.walletConnection) {
    return {
          totalCredits: 0,
          totalValue: 0,
          availableCredits: 0,
          lockedCredits: 0,
          monthlyGain: 0
        };
      }

      const response = await fetch(`/api/blockchain/portfolio/${this.walletConnection.address}`);
      if (response.ok) {
        return await response.json();
      }
    
    return {
        totalCredits: 0,
        totalValue: 0,
        availableCredits: 0,
        lockedCredits: 0,
        monthlyGain: 0
      };
    } catch (error) {
      console.error('Failed to get portfolio stats:', error);
      return {
        totalCredits: 0,
        totalValue: 0,
        availableCredits: 0,
        lockedCredits: 0,
        monthlyGain: 0
      };
    }
  }
}

export const blockchainService = new BlockchainService();
