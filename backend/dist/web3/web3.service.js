"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Web3Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3Service = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ethers_1 = require("ethers");
let Web3Service = Web3Service_1 = class Web3Service {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(Web3Service_1.name);
        this.initializeWeb3();
    }
    async initializeWeb3() {
        try {
            const providerUrl = this.configService.get('WEB3_PROVIDER_URL');
            const privateKey = this.configService.get('WEB3_PRIVATE_KEY');
            const contractAddress = this.configService.get('CARBON_CREDIT_CONTRACT_ADDRESS');
            if (!providerUrl || !privateKey || !contractAddress) {
                this.logger.warn('Web3 configuration incomplete, some features may not work');
                return;
            }
            this.provider = new ethers_1.ethers.JsonRpcProvider(providerUrl);
            this.wallet = new ethers_1.ethers.Wallet(privateKey, this.provider);
            const contractABI = [
                'function balanceOf(address owner) view returns (uint256)',
                'function totalSupply() view returns (uint256)',
                'function mint(address to, uint256 amount)',
                'function transfer(address to, uint256 amount) returns (bool)',
                'event Transfer(address indexed from, address indexed to, uint256 value)',
                'event Mint(address indexed to, uint256 amount)'
            ];
            this.carbonCreditContract = new ethers_1.ethers.Contract(contractAddress, contractABI, this.wallet);
            this.logger.log('Web3 service initialized successfully');
        }
        catch (error) {
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
                provider: this.configService.get('WEB3_PROVIDER_URL'),
            };
        }
        catch (error) {
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
                balance: ethers_1.ethers.formatEther(balance),
                balanceWei: balance.toString(),
            };
        }
        catch (error) {
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
                contractAddress: this.configService.get('CARBON_CREDIT_CONTRACT_ADDRESS'),
                totalSupply: totalSupply.toString(),
                walletBalance: walletBalance.toString(),
            };
        }
        catch (error) {
            this.logger.error('Failed to get contract balance', error);
            throw error;
        }
    }
    async mintCarbonCredits(amount, toAddress) {
        try {
            if (!this.carbonCreditContract) {
                throw new Error('Carbon credit contract not initialized');
            }
            const targetAddress = toAddress || this.wallet.address;
            const amountWei = ethers_1.ethers.parseUnits(amount, 18);
            const tx = await this.carbonCreditContract.mint(targetAddress, amountWei);
            const receipt = await tx.wait();
            return {
                transactionHash: receipt.hash,
                blockNumber: receipt.blockNumber,
                amount: amount,
                toAddress: targetAddress,
                status: 'success',
            };
        }
        catch (error) {
            this.logger.error('Failed to mint carbon credits', error);
            throw error;
        }
    }
    async transferCarbonCredits(toAddress, amount) {
        try {
            if (!this.carbonCreditContract) {
                throw new Error('Carbon credit contract not initialized');
            }
            const amountWei = ethers_1.ethers.parseUnits(amount, 18);
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
        }
        catch (error) {
            this.logger.error('Failed to transfer carbon credits', error);
            throw error;
        }
    }
};
exports.Web3Service = Web3Service;
exports.Web3Service = Web3Service = Web3Service_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], Web3Service);
//# sourceMappingURL=web3.service.js.map