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
var DataUploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataUploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const csv = require("csv-parser");
const XLSX = require("xlsx");
const fs = require("fs");
const esg_data_service_1 = require("./esg-data.service");
let DataUploadService = DataUploadService_1 = class DataUploadService {
    constructor(configService, esgDataService) {
        this.configService = configService;
        this.esgDataService = esgDataService;
        this.logger = new common_1.Logger(DataUploadService_1.name);
        this.uploadPath = this.configService.get('UPLOAD_PATH') || './uploads';
        this.maxFileSize = this.configService.get('MAX_FILE_SIZE') || 10 * 1024 * 1024;
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
        }
    }
    async processCsvFile(filePath, organization) {
        try {
            this.logger.log(`Processing CSV file: ${filePath}`);
            const results = [];
            const errors = [];
            const warnings = [];
            return new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (data) => {
                    try {
                        const processedData = this.processCsvRow(data);
                        if (processedData) {
                            results.push(processedData);
                        }
                    }
                    catch (error) {
                        errors.push(`Row processing error: ${error.message}`);
                    }
                })
                    .on('end', async () => {
                    try {
                        const uploadResult = await this.createEsgDataRecords(results, organization);
                        resolve({
                            success: uploadResult.success,
                            message: uploadResult.message,
                            recordsProcessed: results.length,
                            recordsCreated: uploadResult.recordsCreated,
                            errors: [...errors, ...uploadResult.errors],
                            warnings: [...warnings, ...uploadResult.warnings],
                        });
                    }
                    catch (error) {
                        reject(error);
                    }
                })
                    .on('error', (error) => {
                    reject(new Error(`CSV processing error: ${error.message}`));
                });
            });
        }
        catch (error) {
            this.logger.error(`Failed to process CSV file: ${filePath}`, error);
            throw new common_1.BadRequestException(`Failed to process CSV file: ${error.message}`);
        }
    }
    async processExcelFile(filePath, organization) {
        try {
            this.logger.log(`Processing Excel file: ${filePath}`);
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            if (jsonData.length === 0) {
                throw new common_1.BadRequestException('Excel file contains no data');
            }
            const results = [];
            const errors = [];
            const warnings = [];
            jsonData.forEach((row, index) => {
                try {
                    const processedData = this.processExcelRow(row);
                    if (processedData) {
                        results.push(processedData);
                    }
                }
                catch (error) {
                    errors.push(`Row ${index + 1} processing error: ${error.message}`);
                }
            });
            const uploadResult = await this.createEsgDataRecords(results, organization);
            return {
                success: uploadResult.success,
                message: uploadResult.message,
                recordsProcessed: results.length,
                recordsCreated: uploadResult.recordsCreated,
                errors: [...errors, ...uploadResult.errors],
                warnings: [...warnings, ...uploadResult.warnings],
            };
        }
        catch (error) {
            this.logger.error(`Failed to process Excel file: ${filePath}`, error);
            throw new common_1.BadRequestException(`Failed to process Excel file: ${error.message}`);
        }
    }
    async validateFile(filePath, fileType) {
        try {
            const stats = fs.statSync(filePath);
            if (stats.size > this.maxFileSize) {
                return {
                    isValid: false,
                    errors: [`File size ${(stats.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size`],
                    warnings: [],
                    estimatedRecords: 0,
                };
            }
            const errors = [];
            const warnings = [];
            if (fileType === 'csv') {
                return await this.validateCsvFile(filePath);
            }
            else if (fileType === 'excel') {
                return await this.validateExcelFile(filePath);
            }
            else {
                return {
                    isValid: false,
                    errors: ['Unsupported file type'],
                    warnings: [],
                    estimatedRecords: 0,
                };
            }
        }
        catch (error) {
            this.logger.error(`File validation failed: ${filePath}`, error);
            return {
                isValid: false,
                errors: [`File validation error: ${error.message}`],
                warnings: [],
                estimatedRecords: 0,
            };
        }
    }
    async validateCsvFile(filePath) {
        const errors = [];
        const warnings = [];
        let recordCount = 0;
        return new Promise((resolve) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => {
                recordCount++;
                if (recordCount === 1) {
                    const requiredHeaders = ['organization', 'reportingPeriod', 'dataSource'];
                    const headers = Object.keys(data);
                    requiredHeaders.forEach(header => {
                        if (!headers.includes(header)) {
                            errors.push(`Missing required header: ${header}`);
                        }
                    });
                    if (headers.length < 3) {
                        warnings.push('File appears to have very few columns');
                    }
                }
            })
                .on('end', () => {
                if (recordCount === 0) {
                    errors.push('File contains no data rows');
                }
                else if (recordCount === 1) {
                    warnings.push('File contains only header row');
                }
                resolve({
                    isValid: errors.length === 0,
                    errors,
                    warnings,
                    estimatedRecords: Math.max(0, recordCount - 1),
                });
            })
                .on('error', (error) => {
                resolve({
                    isValid: false,
                    errors: [`CSV parsing error: ${error.message}`],
                    warnings: [],
                    estimatedRecords: 0,
                });
            });
        });
    }
    async validateExcelFile(filePath) {
        try {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            const errors = [];
            const warnings = [];
            if (jsonData.length === 0) {
                errors.push('Excel file contains no data');
            }
            else {
                const firstRow = jsonData[0];
                const headers = Object.keys(firstRow);
                const requiredHeaders = ['organization', 'reportingPeriod', 'dataSource'];
                requiredHeaders.forEach(header => {
                    if (!headers.includes(header)) {
                        errors.push(`Missing required header: ${header}`);
                    }
                });
                if (headers.length < 3) {
                    warnings.push('File appears to have very few columns');
                }
            }
            return {
                isValid: errors.length === 0,
                errors,
                warnings,
                estimatedRecords: jsonData.length,
            };
        }
        catch (error) {
            return {
                isValid: false,
                errors: [`Excel validation error: ${error.message}`],
                warnings: [],
                estimatedRecords: 0,
            };
        }
    }
    processCsvRow(row) {
        const processedData = {
            organization: row.organization || row.Organization || row.ORGANIZATION,
            reportingPeriod: row.reportingPeriod || row.reporting_period || row.Reporting_Period,
            dataSource: row.dataSource || row.data_source || row.Data_Source,
        };
        if (row.emissions || row.Emissions) {
            processedData.environmental = {
                emissions: this.parseNumber(row.emissions || row.Emissions),
                renewableEnergy: this.parseNumber(row.renewableEnergy || row.renewable_energy || row.Renewable_Energy),
                waterUsage: this.parseNumber(row.waterUsage || row.water_usage || row.Water_Usage),
                wasteGeneration: this.parseNumber(row.wasteGeneration || row.waste_generation || row.Waste_Generation),
            };
        }
        if (row.employeeCount || row.employee_count || row.Employee_Count) {
            processedData.social = {
                employeeCount: this.parseNumber(row.employeeCount || row.employee_count || row.Employee_Count),
                employeeSatisfaction: this.parseNumber(row.employeeSatisfaction || row.employee_satisfaction || row.Employee_Satisfaction),
                diversityScore: this.parseNumber(row.diversityScore || row.diversity_score || row.Diversity_Score),
            };
        }
        if (row.boardIndependence || row.board_independence || row.Board_Independence) {
            processedData.governance = {
                boardIndependence: this.parseNumber(row.boardIndependence || row.board_independence || row.Board_Independence),
                transparencyScore: this.parseNumber(row.transparencyScore || row.transparency_score || row.Transparency_Score),
                riskManagement: this.parseNumber(row.riskManagement || row.risk_management || row.Risk_Management),
            };
        }
        if (row.frameworks || row.Frameworks) {
            processedData.frameworks = (row.frameworks || row.Frameworks)
                .split(',')
                .map((f) => f.trim())
                .filter(Boolean);
        }
        if (row.tags || row.Tags) {
            processedData.tags = (row.tags || row.Tags)
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean);
        }
        return processedData;
    }
    processExcelRow(row) {
        return this.processCsvRow(row);
    }
    parseNumber(value) {
        if (value === undefined || value === null || value === '') {
            return undefined;
        }
        const num = Number(value);
        return isNaN(num) ? undefined : num;
    }
    async createEsgDataRecords(dataArray, organization) {
        const errors = [];
        const warnings = [];
        let recordsCreated = 0;
        try {
            for (const data of dataArray) {
                try {
                    if (!data.organization || !data.reportingPeriod || !data.dataSource) {
                        warnings.push(`Skipping record with missing required fields: ${JSON.stringify(data)}`);
                        continue;
                    }
                    const finalOrganization = organization || data.organization;
                    const createDto = {
                        organization: finalOrganization,
                        reportingPeriod: data.reportingPeriod,
                        dataSource: data.dataSource,
                        environmental: data.environmental,
                        social: data.social,
                        governance: data.governance,
                        frameworks: data.frameworks,
                        tags: data.tags,
                    };
                    await this.esgDataService.create(createDto);
                    recordsCreated++;
                }
                catch (error) {
                    errors.push(`Failed to create record: ${error.message}`);
                }
            }
            return {
                success: recordsCreated > 0,
                message: `Successfully created ${recordsCreated} records`,
                recordsCreated,
                errors,
                warnings,
            };
        }
        catch (error) {
            this.logger.error('Failed to create ESG data records', error);
            return {
                success: false,
                message: 'Failed to create ESG data records',
                recordsCreated,
                errors: [...errors, error.message],
                warnings,
            };
        }
    }
    async cleanupFile(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                this.logger.log(`Cleaned up file: ${filePath}`);
            }
        }
        catch (error) {
            this.logger.error(`Failed to cleanup file: ${filePath}`, error);
        }
    }
    getSupportedFormats() {
        return ['csv', 'excel', 'xlsx', 'xls'];
    }
    getMaxFileSize() {
        return this.maxFileSize;
    }
};
exports.DataUploadService = DataUploadService;
exports.DataUploadService = DataUploadService = DataUploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        esg_data_service_1.EsgDataService])
], DataUploadService);
//# sourceMappingURL=data-upload.service.js.map