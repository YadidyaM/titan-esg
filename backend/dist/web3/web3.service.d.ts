import { ConfigService } from '@nestjs/config';
export declare class Web3Service {
    private configService;
    private readonly logger;
    private provider;
    private wallet;
    private carbonCreditContract;
    constructor(configService: ConfigService);
    private initializeWeb3;
    getNetworkInfo(): Promise<{
        chainId: string;
        name: string;
        blockNumber: string;
        provider: string;
    }>;
    getWalletBalance(): Promise<{
        address: string;
        balance: string;
        balanceWei: string;
    }>;
    getContractBalance(): Promise<{
        contractAddress: string;
        totalSupply: any;
        walletBalance: any;
    }>;
    mintCarbonCredits(amount: string, toAddress?: string): Promise<{
        transactionHash: any;
        blockNumber: any;
        amount: string;
        toAddress: string;
        status: string;
    }>;
    transferCarbonCredits(toAddress: string, amount: string): Promise<{
        transactionHash: any;
        blockNumber: any;
        amount: string;
        fromAddress: string;
        toAddress: string;
        status: string;
    }>;
}
