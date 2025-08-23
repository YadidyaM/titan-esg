import { BlockchainService, BlockchainRecord, AuditTrail } from './blockchain.service';
export declare class BlockchainController {
    private readonly blockchainService;
    constructor(blockchainService: BlockchainService);
    storeEsgData(body: {
        data: any;
        organization: string;
    }): Promise<BlockchainRecord>;
    storeComplianceReport(body: {
        report: any;
        organization: string;
    }): Promise<BlockchainRecord>;
    createAuditTrail(body: {
        recordId: string;
        changes: Array<{
            field: string;
            oldValue: any;
            newValue: any;
            userId: string;
        }>;
        organization: string;
        dataType: string;
    }): Promise<AuditTrail>;
    storeCarbonCredit(body: {
        amount: number;
        type: string;
        organization: string;
        verificationStatus: string;
    }): Promise<BlockchainRecord>;
    getRecord(recordId: string): Promise<BlockchainRecord | null>;
    getRecordsByType(type: string): Promise<BlockchainRecord[]>;
    getRecordsByOrganization(organization: string): Promise<BlockchainRecord[]>;
    getAuditTrail(recordId: string): Promise<AuditTrail | null>;
    verifyDataIntegrity(recordId: string): Promise<{
        isValid: boolean;
        issues: string[];
    }>;
    getBlockchainStats(): Promise<any>;
    exportBlockchainData(): Promise<any>;
    getHealth(): Promise<{
        status: string;
        timestamp: string;
        service: string;
    }>;
}
