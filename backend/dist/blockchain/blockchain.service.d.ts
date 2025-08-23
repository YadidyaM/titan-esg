import { ConfigService } from '@nestjs/config';
export interface BlockchainRecord {
    id: string;
    type: 'esg_data' | 'compliance_report' | 'audit_trail' | 'carbon_credit';
    data: any;
    hash: string;
    timestamp: Date;
    organization: string;
    previousHash?: string;
    blockNumber: number;
}
export interface AuditTrail {
    recordId: string;
    changes: Array<{
        field: string;
        oldValue: any;
        newValue: any;
        timestamp: Date;
        userId: string;
    }>;
    metadata: {
        organization: string;
        dataType: string;
        version: string;
    };
}
export declare class BlockchainService {
    private configService;
    private readonly logger;
    private records;
    private auditTrails;
    private blockCounter;
    constructor(configService: ConfigService);
    storeEsgData(data: any, organization: string): Promise<BlockchainRecord>;
    storeComplianceReport(report: any, organization: string): Promise<BlockchainRecord>;
    createAuditTrail(recordId: string, changes: Array<{
        field: string;
        oldValue: any;
        newValue: any;
        userId: string;
    }>, organization: string, dataType: string): Promise<AuditTrail>;
    storeCarbonCredit(creditData: {
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
    getBlockchainStats(): Promise<{
        totalRecords: number;
        totalBlocks: number;
        organizations: string[];
        recordTypes: {
            [key: string]: number;
        };
        lastUpdated: Date;
    }>;
    private generateHash;
    private getLastHash;
    simulateNetworkSync(): Promise<void>;
    exportBlockchainData(): Promise<{
        records: BlockchainRecord[];
        auditTrails: AuditTrail[];
        metadata: {
            exportDate: Date;
            totalRecords: number;
            totalAuditTrails: number;
            version: string;
        };
    }>;
}
