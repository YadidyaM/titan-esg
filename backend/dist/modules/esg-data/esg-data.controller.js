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
exports.EsgDataController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const path_1 = require("path");
const esg_data_service_1 = require("./esg-data.service");
const data_upload_service_1 = require("./data-upload.service");
let EsgDataController = class EsgDataController {
    constructor(esgDataService, dataUploadService) {
        this.esgDataService = esgDataService;
        this.dataUploadService = dataUploadService;
    }
    getMaxFileSize() {
        return this.dataUploadService?.getMaxFileSize() || 10 * 1024 * 1024;
    }
    async create(createDto) {
        try {
            return await this.esgDataService.create(createDto);
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to create ESG data: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAll(query) {
        try {
            const parsedQuery = { ...query };
            if (query.limit)
                parsedQuery.limit = parseInt(query.limit);
            if (query.offset)
                parsedQuery.offset = parseInt(query.offset);
            if (query.startDate)
                parsedQuery.startDate = new Date(query.startDate);
            if (query.endDate)
                parsedQuery.endDate = new Date(query.endDate);
            if (query.frameworks)
                parsedQuery.frameworks = query.frameworks.split(',');
            return await this.esgDataService.findAll(parsedQuery);
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to fetch ESG data: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async search(query) {
        try {
            if (!query) {
                throw new common_1.BadRequestException('Search query is required');
            }
            return await this.esgDataService.search(query);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.HttpException(`Search failed: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getStatistics() {
        try {
            return await this.esgDataService.getStatistics();
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to get statistics: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByOrganization(organization) {
        try {
            return await this.esgDataService.findByOrganization(organization);
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to fetch ESG data for organization: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            return await this.esgDataService.findOne(id);
        }
        catch (error) {
            if (error.message === 'ESG data not found') {
                throw new common_1.HttpException('ESG data not found', common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException(`Failed to fetch ESG data: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateDto) {
        try {
            return await this.esgDataService.update(id, updateDto);
        }
        catch (error) {
            if (error.message === 'ESG data not found') {
                throw new common_1.HttpException('ESG data not found', common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException(`Failed to update ESG data: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async delete(id) {
        try {
            await this.esgDataService.delete(id);
        }
        catch (error) {
            if (error.message === 'ESG data not found') {
                throw new common_1.HttpException('ESG data not found', common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException(`Failed to delete ESG data: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async softDelete(id) {
        try {
            await this.esgDataService.softDelete(id);
        }
        catch (error) {
            if (error.message === 'ESG data not found') {
                throw new common_1.HttpException('ESG data not found', common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException(`Failed to soft delete ESG data: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateDataQuality(id, qualityMetrics) {
        try {
            return await this.esgDataService.updateDataQuality(id, qualityMetrics);
        }
        catch (error) {
            if (error.message === 'ESG data not found') {
                throw new common_1.HttpException('ESG data not found', common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException(`Failed to update data quality: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async bulkUpdate(updates) {
        try {
            if (!updates || !Array.isArray(updates) || updates.length === 0) {
                throw new common_1.BadRequestException('Updates array is required and must not be empty');
            }
            return await this.esgDataService.bulkUpdate(updates);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.HttpException(`Bulk update failed: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async uploadFile(file, organization) {
        try {
            if (!file) {
                throw new common_1.BadRequestException('No file uploaded');
            }
            if (!organization) {
                throw new common_1.BadRequestException('Organization is required');
            }
            const filePath = file.path;
            const fileType = this.getFileType(file.mimetype);
            const validationResult = await this.dataUploadService.validateFile(filePath, fileType);
            if (!validationResult.isValid) {
                await this.dataUploadService.cleanupFile(filePath);
                throw new common_1.BadRequestException(`File validation failed: ${validationResult.errors.join(', ')}`);
            }
            let uploadResult;
            if (fileType === 'csv') {
                uploadResult = await this.dataUploadService.processCsvFile(filePath, organization);
            }
            else {
                uploadResult = await this.dataUploadService.processExcelFile(filePath, organization);
            }
            await this.dataUploadService.cleanupFile(filePath);
            return {
                message: 'File uploaded and processed successfully',
                ...uploadResult,
            };
        }
        catch (error) {
            if (file?.path) {
                await this.dataUploadService.cleanupFile(file.path);
            }
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.HttpException(`File upload failed: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    getSupportedFormats() {
        return {
            formats: this.dataUploadService.getSupportedFormats(),
            maxFileSize: this.getMaxFileSize(),
        };
    }
    getFileType(mimeType) {
        if (mimeType === 'text/csv')
            return 'csv';
        if (mimeType.includes('excel') || mimeType.includes('spreadsheet'))
            return 'excel';
        return 'csv';
    }
};
exports.EsgDataController = EsgDataController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new ESG data record' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'ESG data created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EsgDataController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all ESG data records with pagination and filtering' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ESG data retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EsgDataController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search ESG data records' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Search results retrieved successfully' }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EsgDataController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get ESG data statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EsgDataController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('organization/:organization'),
    (0, swagger_1.ApiOperation)({ summary: 'Get ESG data by organization' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ESG data retrieved successfully' }),
    __param(0, (0, common_1.Param)('organization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EsgDataController.prototype, "findByOrganization", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get ESG data by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ESG data retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EsgDataController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update ESG data record' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ESG data updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EsgDataController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete ESG data record' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ESG data deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EsgDataController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/soft-delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete ESG data record' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ESG data soft deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EsgDataController.prototype, "softDelete", null);
__decorate([
    (0, common_1.Put)(':id/data-quality'),
    (0, swagger_1.ApiOperation)({ summary: 'Update data quality metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data quality updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EsgDataController.prototype, "updateDataQuality", null);
__decorate([
    (0, common_1.Post)('bulk-update'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk update multiple ESG data records' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bulk update completed successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], EsgDataController.prototype, "bulkUpdate", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload ESG data file (CSV/Excel)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'File uploaded and processed successfully' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'CSV or Excel file to upload',
                },
                organization: {
                    type: 'string',
                    description: 'Organization name for the data',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                return cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            const allowedMimeTypes = [
                'text/csv',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ];
            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException('Only CSV and Excel files are allowed'), false);
            }
        },
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('organization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EsgDataController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)('upload/supported-formats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get supported file formats for upload' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Supported formats retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], EsgDataController.prototype, "getSupportedFormats", null);
exports.EsgDataController = EsgDataController = __decorate([
    (0, swagger_1.ApiTags)('ESG Data'),
    (0, common_1.Controller)('esg-data'),
    __metadata("design:paramtypes", [esg_data_service_1.EsgDataService,
        data_upload_service_1.DataUploadService])
], EsgDataController);
//# sourceMappingURL=esg-data.controller.js.map