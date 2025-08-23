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
exports.Web3Controller = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const web3_service_1 = require("./web3.service");
const ethers_1 = require("ethers");
let Web3Controller = class Web3Controller {
    constructor(web3Service) {
        this.web3Service = web3Service;
    }
    async getNetworkInfo() {
        try {
            return await this.web3Service.getNetworkInfo();
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to get network info: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getWalletBalance() {
        try {
            return await this.web3Service.getWalletBalance();
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to get wallet balance: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getContractBalance() {
        try {
            return await this.web3Service.getContractBalance();
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to get contract balance: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async mintCarbonCredits(amount, toAddress) {
        try {
            if (!amount || isNaN(Number(amount))) {
                throw new common_1.HttpException('Invalid amount', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.web3Service.mintCarbonCredits(amount, toAddress);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(`Failed to mint carbon credits: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async transferCarbonCredits(toAddress, amount) {
        try {
            if (!toAddress || !ethers_1.ethers.isAddress(toAddress)) {
                throw new common_1.HttpException('Invalid toAddress', common_1.HttpStatus.BAD_REQUEST);
            }
            if (!amount || isNaN(Number(amount))) {
                throw new common_1.HttpException('Invalid amount', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.web3Service.transferCarbonCredits(toAddress, amount);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(`Failed to transfer carbon credits: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.Web3Controller = Web3Controller;
__decorate([
    (0, common_1.Get)('network-info'),
    (0, swagger_1.ApiOperation)({ summary: 'Get blockchain network information' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Network information retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Failed to get network information' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Web3Controller.prototype, "getNetworkInfo", null);
__decorate([
    (0, common_1.Get)('wallet-balance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get wallet balance' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Wallet balance retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Failed to get wallet balance' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Web3Controller.prototype, "getWalletBalance", null);
__decorate([
    (0, common_1.Get)('contract-balance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get carbon credit contract balance' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contract balance retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Failed to get contract balance' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Web3Controller.prototype, "getContractBalance", null);
__decorate([
    (0, common_1.Post)('mint-carbon-credits'),
    (0, swagger_1.ApiOperation)({ summary: 'Mint carbon credits' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                amount: { type: 'string', description: 'Amount of carbon credits to mint' },
                toAddress: { type: 'string', description: 'Address to mint credits to (optional, defaults to wallet address)' }
            },
            required: ['amount']
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Carbon credits minted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Failed to mint carbon credits' }),
    __param(0, (0, common_1.Body)('amount')),
    __param(1, (0, common_1.Body)('toAddress')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], Web3Controller.prototype, "mintCarbonCredits", null);
__decorate([
    (0, common_1.Post)('transfer-carbon-credits'),
    (0, swagger_1.ApiOperation)({ summary: 'Transfer carbon credits' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                toAddress: { type: 'string', description: 'Address to transfer credits to' },
                amount: { type: 'string', description: 'Amount of carbon credits to transfer' }
            },
            required: ['toAddress', 'amount']
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Carbon credits transferred successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Failed to transfer carbon credits' }),
    __param(0, (0, common_1.Body)('toAddress')),
    __param(1, (0, common_1.Body)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], Web3Controller.prototype, "transferCarbonCredits", null);
exports.Web3Controller = Web3Controller = __decorate([
    (0, swagger_1.ApiTags)('Web3'),
    (0, common_1.Controller)('web3'),
    __metadata("design:paramtypes", [web3_service_1.Web3Service])
], Web3Controller);
//# sourceMappingURL=web3.controller.js.map