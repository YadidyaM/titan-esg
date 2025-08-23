import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private records: Map<string, BlockchainRecord> = new Map();
  private auditTrails: Map<string, AuditTrail> = new Map();
  private blockCounter = 0;

  constructor(private configService: ConfigService) {
    this.logger.log('Blockchain service initialized');
  }

  async storeEsgData(data: any, organization: string): Promise<BlockchainRecord> {
    try {
      this.logger.log(`Storing ESG data for organization: ${organization}`);

      const recordId = `esg_${organization}_${Date.now()}`;
      const hash = this.generateHash(data);
      const previousHash = this.getLastHash();

      const record: BlockchainRecord = {
        id: recordId,
        type: 'esg_data',
        data,
        hash,
        timestamp: new Date(),
        organization,
        previousHash,
        blockNumber: ++this.blockCounter,
      };

      this.records.set(recordId, record);
      this.logger.log(`ESG data stored with ID: ${recordId}`);

      return record;
    } catch (error) {
      this.logger.error('Failed to store ESG data', error);
      throw error;
    }
  }

  async storeComplianceReport(report: any, organization: string): Promise<BlockchainRecord> {
    try {
      this.logger.log(`Storing compliance report for organization: ${organization}`);

      const recordId = `compliance_${organization}_${Date.now()}`;
      const hash = this.generateHash(report);
      const previousHash = this.getLastHash();

      const record: BlockchainRecord = {
        id: recordId,
        type: 'compliance_report',
        data: report,
        hash,
        timestamp: new Date(),
        organization,
        previousHash,
        blockNumber: ++this.blockCounter,
      };

      this.records.set(recordId, record);
      this.logger.log(`Compliance report stored with ID: ${recordId}`);

      return record;
    } catch (error) {
      this.logger.error('Failed to store compliance report', error);
      throw error;
    }
  }

  async createAuditTrail(
    recordId: string,
    changes: Array<{ field: string; oldValue: any; newValue: any; userId: string }>,
    organization: string,
    dataType: string
  ): Promise<AuditTrail> {
    try {
      this.logger.log(`Creating audit trail for record: ${recordId}`);

      const auditTrail: AuditTrail = {
        recordId,
        changes: changes.map(change => ({
          ...change,
          timestamp: new Date(),
        })),
        metadata: {
          organization,
          dataType,
          version: '1.0',
        },
      };

      this.auditTrails.set(recordId, auditTrail);
      this.logger.log(`Audit trail created for record: ${recordId}`);

      return auditTrail;
    } catch (error) {
      this.logger.error('Failed to create audit trail', error);
      throw error;
    }
  }

  async storeCarbonCredit(
    creditData: {
      amount: number;
      type: string;
      organization: string;
      verificationStatus: string;
    }
  ): Promise<BlockchainRecord> {
    try {
      this.logger.log(`Storing carbon credit for organization: ${creditData.organization}`);

      const recordId = `carbon_${creditData.organization}_${Date.now()}`;
      const hash = this.generateHash(creditData);
      const previousHash = this.getLastHash();

      const record: BlockchainRecord = {
        id: recordId,
        type: 'carbon_credit',
        data: creditData,
        hash,
        timestamp: new Date(),
        organization: creditData.organization,
        previousHash,
        blockNumber: ++this.blockCounter,
      };

      this.records.set(recordId, record);
      this.logger.log(`Carbon credit stored with ID: ${recordId}`);

      return record;
    } catch (error) {
      this.logger.error('Failed to store carbon credit', error);
      throw error;
    }
  }

  async getRecord(recordId: string): Promise<BlockchainRecord | null> {
    try {
      return this.records.get(recordId) || null;
    } catch (error) {
      this.logger.error(`Failed to get record: ${recordId}`, error);
      return null;
    }
  }

  async getRecordsByType(type: string): Promise<BlockchainRecord[]> {
    try {
      return Array.from(this.records.values()).filter(record => record.type === type);
    } catch (error) {
      this.logger.error(`Failed to get records by type: ${type}`, error);
      return [];
    }
  }

  async getRecordsByOrganization(organization: string): Promise<BlockchainRecord[]> {
    try {
      return Array.from(this.records.values()).filter(record => record.organization === organization);
    } catch (error) {
      this.logger.error(`Failed to get records for organization: ${organization}`, error);
      return [];
    }
  }

  async getAuditTrail(recordId: string): Promise<AuditTrail | null> {
    try {
      return this.auditTrails.get(recordId) || null;
    } catch (error) {
      this.logger.error(`Failed to get audit trail for record: ${recordId}`, error);
      return null;
    }
  }

  async verifyDataIntegrity(recordId: string): Promise<{ isValid: boolean; issues: string[] }> {
    try {
      const record = this.records.get(recordId);
      if (!record) {
        return { isValid: false, issues: ['Record not found'] };
      }

      const issues: string[] = [];
      const calculatedHash = this.generateHash(record.data);

      // Verify hash
      if (calculatedHash !== record.hash) {
        issues.push('Data hash mismatch - data may have been tampered with');
      }

      // Verify previous hash chain
      if (record.previousHash && record.blockNumber > 1) {
        const previousRecord = Array.from(this.records.values())
          .find(r => r.blockNumber === record.blockNumber - 1);
        
        if (!previousRecord || previousRecord.hash !== record.previousHash) {
          issues.push('Previous hash mismatch - blockchain integrity compromised');
        }
      }

      // Verify timestamp consistency
      if (record.blockNumber > 1) {
        const previousRecord = Array.from(this.records.values())
          .find(r => r.blockNumber === record.blockNumber - 1);
        
        if (previousRecord && record.timestamp <= previousRecord.timestamp) {
          issues.push('Timestamp inconsistency - newer record has older timestamp');
        }
      }

      return {
        isValid: issues.length === 0,
        issues,
      };
    } catch (error) {
      this.logger.error(`Failed to verify data integrity for record: ${recordId}`, error);
      return { isValid: false, issues: ['Verification failed due to system error'] };
    }
  }

  async getBlockchainStats(): Promise<{
    totalRecords: number;
    totalBlocks: number;
    organizations: string[];
    recordTypes: { [key: string]: number };
    lastUpdated: Date;
  }> {
    try {
      const organizations = [...new Set(Array.from(this.records.values()).map(r => r.organization))];
      const recordTypes: { [key: string]: number } = {};
      
      Array.from(this.records.values()).forEach(record => {
        recordTypes[record.type] = (recordTypes[record.type] || 0) + 1;
      });

      return {
        totalRecords: this.records.size,
        totalBlocks: this.blockCounter,
        organizations,
        recordTypes,
        lastUpdated: new Date(),
      };
    } catch (error) {
      this.logger.error('Failed to get blockchain stats', error);
      return {
        totalRecords: 0,
        totalBlocks: 0,
        organizations: [],
        recordTypes: {},
        lastUpdated: new Date(),
      };
    }
  }

  private generateHash(data: any): string {
    // Simple hash function - in production, use cryptographic hash
    const dataString = JSON.stringify(data);
    let hash = 0;
    
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(16);
  }

  private getLastHash(): string | undefined {
    if (this.blockCounter === 0) return undefined;
    
    const lastRecord = Array.from(this.records.values())
      .find(r => r.blockNumber === this.blockCounter);
    
    return lastRecord?.hash;
  }

  // Method to simulate blockchain network operations
  async simulateNetworkSync(): Promise<void> {
    try {
      this.logger.log('Simulating blockchain network synchronization');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.logger.log('Blockchain network synchronization completed');
    } catch (error) {
      this.logger.error('Blockchain network synchronization failed', error);
    }
  }

  // Method to export blockchain data
  async exportBlockchainData(): Promise<{
    records: BlockchainRecord[];
    auditTrails: AuditTrail[];
    metadata: {
      exportDate: Date;
      totalRecords: number;
      totalAuditTrails: number;
      version: string;
    };
  }> {
    try {
      this.logger.log('Exporting blockchain data');

      const records = Array.from(this.records.values());
      const auditTrails = Array.from(this.auditTrails.values());

      return {
        records,
        auditTrails,
        metadata: {
          exportDate: new Date(),
          totalRecords: records.length,
          totalAuditTrails: auditTrails.length,
          version: '1.0',
        },
      };
    } catch (error) {
      this.logger.error('Failed to export blockchain data', error);
      throw error;
    }
  }
}
