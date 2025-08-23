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
var BlockchainService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let BlockchainService = BlockchainService_1 = class BlockchainService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(BlockchainService_1.name);
        this.records = new Map();
        this.auditTrails = new Map();
        this.blockCounter = 0;
        this.logger.log('Blockchain service initialized');
    }
    async storeEsgData(data, organization) {
        try {
            this.logger.log(`Storing ESG data for organization: ${organization}`);
            const recordId = `esg_${organization}_${Date.now()}`;
            const hash = this.generateHash(data);
            const previousHash = this.getLastHash();
            const record = {
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
        }
        catch (error) {
            this.logger.error('Failed to store ESG data', error);
            throw error;
        }
    }
    async storeComplianceReport(report, organization) {
        try {
            this.logger.log(`Storing compliance report for organization: ${organization}`);
            const recordId = `compliance_${organization}_${Date.now()}`;
            const hash = this.generateHash(report);
            const previousHash = this.getLastHash();
            const record = {
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
        }
        catch (error) {
            this.logger.error('Failed to store compliance report', error);
            throw error;
        }
    }
    async createAuditTrail(recordId, changes, organization, dataType) {
        try {
            this.logger.log(`Creating audit trail for record: ${recordId}`);
            const auditTrail = {
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
        }
        catch (error) {
            this.logger.error('Failed to create audit trail', error);
            throw error;
        }
    }
    async storeCarbonCredit(creditData) {
        try {
            this.logger.log(`Storing carbon credit for organization: ${creditData.organization}`);
            const recordId = `carbon_${creditData.organization}_${Date.now()}`;
            const hash = this.generateHash(creditData);
            const previousHash = this.getLastHash();
            const record = {
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
        }
        catch (error) {
            this.logger.error('Failed to store carbon credit', error);
            throw error;
        }
    }
    async getRecord(recordId) {
        try {
            return this.records.get(recordId) || null;
        }
        catch (error) {
            this.logger.error(`Failed to get record: ${recordId}`, error);
            return null;
        }
    }
    async getRecordsByType(type) {
        try {
            return Array.from(this.records.values()).filter(record => record.type === type);
        }
        catch (error) {
            this.logger.error(`Failed to get records by type: ${type}`, error);
            return [];
        }
    }
    async getRecordsByOrganization(organization) {
        try {
            return Array.from(this.records.values()).filter(record => record.organization === organization);
        }
        catch (error) {
            this.logger.error(`Failed to get records for organization: ${organization}`, error);
            return [];
        }
    }
    async getAuditTrail(recordId) {
        try {
            return this.auditTrails.get(recordId) || null;
        }
        catch (error) {
            this.logger.error(`Failed to get audit trail for record: ${recordId}`, error);
            return null;
        }
    }
    async verifyDataIntegrity(recordId) {
        try {
            const record = this.records.get(recordId);
            if (!record) {
                return { isValid: false, issues: ['Record not found'] };
            }
            const issues = [];
            const calculatedHash = this.generateHash(record.data);
            if (calculatedHash !== record.hash) {
                issues.push('Data hash mismatch - data may have been tampered with');
            }
            if (record.previousHash && record.blockNumber > 1) {
                const previousRecord = Array.from(this.records.values())
                    .find(r => r.blockNumber === record.blockNumber - 1);
                if (!previousRecord || previousRecord.hash !== record.previousHash) {
                    issues.push('Previous hash mismatch - blockchain integrity compromised');
                }
            }
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
        }
        catch (error) {
            this.logger.error(`Failed to verify data integrity for record: ${recordId}`, error);
            return { isValid: false, issues: ['Verification failed due to system error'] };
        }
    }
    async getBlockchainStats() {
        try {
            const organizations = [...new Set(Array.from(this.records.values()).map(r => r.organization))];
            const recordTypes = {};
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
        }
        catch (error) {
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
    generateHash(data) {
        const dataString = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < dataString.length; i++) {
            const char = dataString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }
    getLastHash() {
        if (this.blockCounter === 0)
            return undefined;
        const lastRecord = Array.from(this.records.values())
            .find(r => r.blockNumber === this.blockCounter);
        return lastRecord?.hash;
    }
    async simulateNetworkSync() {
        try {
            this.logger.log('Simulating blockchain network synchronization');
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.logger.log('Blockchain network synchronization completed');
        }
        catch (error) {
            this.logger.error('Blockchain network synchronization failed', error);
        }
    }
    async exportBlockchainData() {
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
        }
        catch (error) {
            this.logger.error('Failed to export blockchain data', error);
            throw error;
        }
    }
};
exports.BlockchainService = BlockchainService;
exports.BlockchainService = BlockchainService = BlockchainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], BlockchainService);
//# sourceMappingURL=blockchain.service.js.map