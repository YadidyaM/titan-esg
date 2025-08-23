import { Web3Service } from './web3.service';
export declare class Web3Controller {
    private readonly web3Service;
    constructor(web3Service: Web3Service);
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
