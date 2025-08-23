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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const blockchain_service_1 = require("./blockchain.service");
let BlockchainController = class BlockchainController {
    constructor(blockchainService) {
        this.blockchainService = blockchainService;
    }
    async storeEsgData(body) {
        try {
            const { data, organization } = body;
            if (!data || !organization) {
                throw new common_1.HttpException('Data and organization are required', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.blockchainService.storeEsgData(data, organization);
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to store ESG data: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async storeComplianceReport(body) {
        try {
            const { report, organization } = body;
            if (!report || !organization) {
                throw new common_1.HttpException('Report and organization are required', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.blockchainService.storeComplianceReport(report, organization);
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to store compliance report: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createAuditTrail(body) {
        try {
            const { recordId, changes, organization, dataType } = body;
            if (!recordId || !changes || !organization || !dataType) {
                throw new common_1.HttpException('All fields are required', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.blockchainService.createAuditTrail(recordId, changes, organization, dataType);
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to create audit trail: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async storeCarbonCredit(body) {
        try {
            const { amount, type, organization, verificationStatus } = body;
            if (!amount || !type || !organization || !verificationStatus) {
                throw new common_1.HttpException('All fields are required', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.blockchainService.storeCarbonCredit({
                amount,
                type,
                organization,
                verificationStatus,
            });
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to store carbon credit: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getRecord(recordId) {
        try {
            const record = await this.blockchainService.getRecord(recordId);
            if (!record) {
                throw new common_1.HttpException('Record not found', common_1.HttpStatus.NOT_FOUND);
            }
            return record;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(`Failed to get record: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getRecordsByType(type) {
        try {
            return await this.blockchainService.getRecordsByType(type);
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to get records by type: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getRecordsByOrganization(organization) {
        try {
            return await this.blockchainService.getRecordsByOrganization(organization);
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to get records by organization: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAuditTrail(recordId) {
        try {
            const auditTrail = await this.blockchainService.getAuditTrail(recordId);
            if (!auditTrail) {
                throw new common_1.HttpException('Audit trail not found', common_1.HttpStatus.NOT_FOUND);
            }
            return auditTrail;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(`Failed to get audit trail: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async verifyDataIntegrity(recordId) {
        try {
            return await this.blockchainService.verifyDataIntegrity(recordId);
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to verify data integrity: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getBlockchainStats() {
        try {
            return await this.blockchainService.getBlockchainStats();
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to get blockchain stats: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async exportBlockchainData() {
        try {
            return await this.blockchainService.exportBlockchainData();
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to export blockchain data: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getHealth() {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'Blockchain Service',
        };
    }
};
exports.BlockchainController = BlockchainController;
__decorate([
    (0, common_1.Post)('store-esg-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Store ESG data on blockchain' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'ESG data stored successfully' }),
    (0, swagger_1.ApiBody)({ description: 'ESG data to store' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "storeEsgData", null);
__decorate([
    (0, common_1.Post)('store-compliance-report'),
    (0, swagger_1.ApiOperation)({ summary: 'Store compliance report on blockchain' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Compliance report stored successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "storeComplianceReport", null);
__decorate([
    (0, common_1.Post)('create-audit-trail'),
    (0, swagger_1.ApiOperation)({ summary: 'Create audit trail for data changes' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Audit trail created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "createAuditTrail", null);
__decorate([
    (0, common_1.Post)('store-carbon-credit'),
    (0, swagger_1.ApiOperation)({ summary: 'Store carbon credit on blockchain' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Carbon credit stored successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "storeCarbonCredit", null);
__decorate([
    (0, common_1.Get)('record/:recordId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get blockchain record by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Record retrieved successfully' }),
    __param(0, (0, common_1.Param)('recordId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getRecord", null);
__decorate([
    (0, common_1.Get)('records/type/:type'),
    (0, swagger_1.ApiOperation)({ summary: 'Get blockchain records by type' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Records retrieved successfully' }),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getRecordsByType", null);
__decorate([
    (0, common_1.Get)('records/organization/:organization'),
    (0, swagger_1.ApiOperation)({ summary: 'Get blockchain records by organization' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Records retrieved successfully' }),
    __param(0, (0, common_1.Param)('organization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getRecordsByOrganization", null);
__decorate([
    (0, common_1.Get)('audit-trail/:recordId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit trail for a record' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Audit trail retrieved successfully' }),
    __param(0, (0, common_1.Param)('recordId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getAuditTrail", null);
__decorate([
    (0, common_1.Get)('verify-integrity/:recordId'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify data integrity of a blockchain record' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Integrity verification completed' }),
    __param(0, (0, common_1.Param)('recordId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "verifyDataIntegrity", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get blockchain statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getBlockchainStats", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, swagger_1.ApiOperation)({ summary: 'Export blockchain data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Blockchain data exported successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "exportBlockchainData", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Check blockchain service health' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getHealth", null);
exports.BlockchainController = BlockchainController = __decorate([
    (0, swagger_1.ApiTags)('Blockchain'),
    (0, common_1.Controller)('blockchain'),
    __metadata("design:paramtypes", [blockchain_service_1.BlockchainService])
], BlockchainController);
//# sourceMappingURL=blockchain.controller.js.map