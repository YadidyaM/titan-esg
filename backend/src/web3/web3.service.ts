import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class Web3Service {
  private readonly logger = new Logger(Web3Service.name);
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private carbonCreditContract: ethers.Contract;

  constructor(private configService: ConfigService) {
    this.initializeWeb3();
  }

  private async initializeWeb3() {
    try {
      const providerUrl = this.configService.get<string>('WEB3_PROVIDER_URL');
      const privateKey = this.configService.get<string>('WEB3_PRIVATE_KEY');
      const contractAddress = this.configService.get<string>('CARBON_CREDIT_CONTRACT_ADDRESS');

      if (!providerUrl || !privateKey || !contractAddress) {
        this.logger.warn('Web3 configuration incomplete, some features may not work');
        return;
      }

      // Initialize provider
      this.provider = new ethers.JsonRpcProvider(providerUrl);
      
      // Initialize wallet
      this.wallet = new ethers.Wallet(privateKey, this.provider);
      
      // Initialize contract (basic ABI for carbon credits)
      const contractABI = [
        'function balanceOf(address owner) view returns (uint256)',
        'function totalSupply() view returns (uint256)',
        'function mint(address to, uint256 amount)',
        'function transfer(address to, uint256 amount) returns (bool)',
        'event Transfer(address indexed from, address indexed to, uint256 value)',
        'event Mint(address indexed to, uint256 amount)'
      ];
      
      this.carbonCreditContract = new ethers.Contract(contractAddress, contractABI, this.wallet);
      
      this.logger.log('Web3 service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Web3 service', error);
    }
  }

  async getNetworkInfo() {
    try {
      if (!this.provider) {
        throw new Error('Web3 provider not initialized');
      }

      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      
      return {
        chainId: network.chainId.toString(),
        name: network.name,
        blockNumber: blockNumber.toString(),
        provider: this.configService.get<string>('WEB3_PROVIDER_URL'),
      };
    } catch (error) {
      this.logger.error('Failed to get network info', error);
      throw error;
    }
  }

  async getWalletBalance() {
    try {
      if (!this.wallet) {
        throw new Error('Web3 wallet not initialized');
      }

      const balance = await this.provider.getBalance(this.wallet.address);
      return {
        address: this.wallet.address,
        balance: ethers.formatEther(balance),
        balanceWei: balance.toString(),
      };
    } catch (error) {
      this.logger.error('Failed to get wallet balance', error);
      throw error;
    }
  }

  async getContractBalance() {
    try {
      if (!this.carbonCreditContract) {
        throw new Error('Carbon credit contract not initialized');
      }

      const totalSupply = await this.carbonCreditContract.totalSupply();
      const walletBalance = await this.carbonCreditContract.balanceOf(this.wallet.address);
      
      return {
        contractAddress: this.configService.get<string>('CARBON_CREDIT_CONTRACT_ADDRESS'),
        totalSupply: totalSupply.toString(),
        walletBalance: walletBalance.toString(),
      };
    } catch (error) {
      this.logger.error('Failed to get contract balance', error);
      throw error;
    }
  }

  async mintCarbonCredits(amount: string, toAddress?: string) {
    try {
      if (!this.carbonCreditContract) {
        throw new Error('Carbon credit contract not initialized');
      }

      const targetAddress = toAddress || this.wallet.address;
      const amountWei = ethers.parseUnits(amount, 18); // Assuming 18 decimals
      
      const tx = await this.carbonCreditContract.mint(targetAddress, amountWei);
      const receipt = await tx.wait();
      
      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        amount: amount,
        toAddress: targetAddress,
        status: 'success',
      };
    } catch (error) {
      this.logger.error('Failed to mint carbon credits', error);
      throw error;
    }
  }

  async transferCarbonCredits(toAddress: string, amount: string) {
    try {
      if (!this.carbonCreditContract) {
        throw new Error('Carbon credit contract not initialized');
      }

      const amountWei = ethers.parseUnits(amount, 18);
      
      const tx = await this.carbonCreditContract.transfer(toAddress, amountWei);
      const receipt = await tx.wait();
      
      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        amount: amount,
        fromAddress: this.wallet.address,
        toAddress: toAddress,
        status: 'success',
      };
    } catch (error) {
      this.logger.error('Failed to transfer carbon credits', error);
      throw error;
    }
  }
}
