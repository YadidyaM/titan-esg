import { ConfigService } from '@nestjs/config';
import { EsgDataService } from './esg-data.service';
export interface UploadResult {
    success: boolean;
    message: string;
    recordsProcessed: number;
    recordsCreated: number;
    errors: string[];
    warnings: string[];
}
export interface FileValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    estimatedRecords: number;
}
export declare class DataUploadService {
    private configService;
    private esgDataService;
    private readonly logger;
    private readonly uploadPath;
    private readonly maxFileSize;
    constructor(configService: ConfigService, esgDataService: EsgDataService);
    processCsvFile(filePath: string, organization: string): Promise<UploadResult>;
    processExcelFile(filePath: string, organization: string): Promise<UploadResult>;
    validateFile(filePath: string, fileType: string): Promise<FileValidationResult>;
    private validateCsvFile;
    private validateExcelFile;
    private processCsvRow;
    private processExcelRow;
    private parseNumber;
    private createEsgDataRecords;
    cleanupFile(filePath: string): Promise<void>;
    getSupportedFormats(): string[];
    getMaxFileSize(): number;
}
