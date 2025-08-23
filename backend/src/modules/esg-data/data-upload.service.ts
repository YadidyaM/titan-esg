import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as csv from 'csv-parser';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { EsgDataService, CreateEsgDataDto } from './esg-data.service';

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

@Injectable()
export class DataUploadService {
  private readonly logger = new Logger(DataUploadService.name);
  private readonly uploadPath: string;
  private readonly maxFileSize: number;

  constructor(
    private configService: ConfigService,
    private esgDataService: EsgDataService,
  ) {
    this.uploadPath = this.configService.get<string>('UPLOAD_PATH') || './uploads';
    this.maxFileSize = this.configService.get<number>('MAX_FILE_SIZE') || 10 * 1024 * 1024; // 10MB
    
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async processCsvFile(filePath: string, organization: string): Promise<UploadResult> {
    try {
      this.logger.log(`Processing CSV file: ${filePath}`);

      const results: any[] = [];
      const errors: string[] = [];
      const warnings: string[] = [];

      return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => {
            try {
              const processedData = this.processCsvRow(data);
              if (processedData) {
                results.push(processedData);
              }
            } catch (error) {
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
            } catch (error) {
              reject(error);
            }
          })
          .on('error', (error) => {
            reject(new Error(`CSV processing error: ${error.message}`));
          });
      });
    } catch (error) {
      this.logger.error(`Failed to process CSV file: ${filePath}`, error);
      throw new BadRequestException(`Failed to process CSV file: ${error.message}`);
    }
  }

  async processExcelFile(filePath: string, organization: string): Promise<UploadResult> {
    try {
      this.logger.log(`Processing Excel file: ${filePath}`);

      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      if (jsonData.length === 0) {
        throw new BadRequestException('Excel file contains no data');
      }

      const results: any[] = [];
      const errors: string[] = [];
      const warnings: string[] = [];

      jsonData.forEach((row: any, index: number) => {
        try {
          const processedData = this.processExcelRow(row);
          if (processedData) {
            results.push(processedData);
          }
        } catch (error) {
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
    } catch (error) {
      this.logger.error(`Failed to process Excel file: ${filePath}`, error);
      throw new BadRequestException(`Failed to process Excel file: ${error.message}`);
    }
  }

  async validateFile(filePath: string, fileType: string): Promise<FileValidationResult> {
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

      const errors: string[] = [];
      const warnings: string[] = [];

      if (fileType === 'csv') {
        return await this.validateCsvFile(filePath);
      } else if (fileType === 'excel') {
        return await this.validateExcelFile(filePath);
      } else {
        return {
          isValid: false,
          errors: ['Unsupported file type'],
          warnings: [],
          estimatedRecords: 0,
        };
      }
    } catch (error) {
      this.logger.error(`File validation failed: ${filePath}`, error);
      return {
        isValid: false,
        errors: [`File validation error: ${error.message}`],
        warnings: [],
        estimatedRecords: 0,
      };
    }
  }

  private async validateCsvFile(filePath: string): Promise<FileValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    let recordCount = 0;

    return new Promise((resolve) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          recordCount++;
          if (recordCount === 1) {
            // Validate headers
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
          } else if (recordCount === 1) {
            warnings.push('File contains only header row');
          }

          resolve({
            isValid: errors.length === 0,
            errors,
            warnings,
            estimatedRecords: Math.max(0, recordCount - 1), // Subtract header row
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

  private async validateExcelFile(filePath: string): Promise<FileValidationResult> {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      const errors: string[] = [];
      const warnings: string[] = [];

      if (jsonData.length === 0) {
        errors.push('Excel file contains no data');
      } else {
        // Validate first row (headers)
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
    } catch (error) {
      return {
        isValid: false,
        errors: [`Excel validation error: ${error.message}`],
        warnings: [],
        estimatedRecords: 0,
      };
    }
  }

  private processCsvRow(row: any): any {
    // Map CSV columns to ESG data structure
    const processedData: any = {
      organization: row.organization || row.Organization || row.ORGANIZATION,
      reportingPeriod: row.reportingPeriod || row.reporting_period || row.Reporting_Period,
      dataSource: row.dataSource || row.data_source || row.Data_Source,
    };

    // Environmental data
    if (row.emissions || row.Emissions) {
      processedData.environmental = {
        emissions: this.parseNumber(row.emissions || row.Emissions),
        renewableEnergy: this.parseNumber(row.renewableEnergy || row.renewable_energy || row.Renewable_Energy),
        waterUsage: this.parseNumber(row.waterUsage || row.water_usage || row.Water_Usage),
        wasteGeneration: this.parseNumber(row.wasteGeneration || row.waste_generation || row.Waste_Generation),
      };
    }

    // Social data
    if (row.employeeCount || row.employee_count || row.Employee_Count) {
      processedData.social = {
        employeeCount: this.parseNumber(row.employeeCount || row.employee_count || row.Employee_Count),
        employeeSatisfaction: this.parseNumber(row.employeeSatisfaction || row.employee_satisfaction || row.Employee_Satisfaction),
        diversityScore: this.parseNumber(row.diversityScore || row.diversity_score || row.Diversity_Score),
      };
    }

    // Governance data
    if (row.boardIndependence || row.board_independence || row.Board_Independence) {
      processedData.governance = {
        boardIndependence: this.parseNumber(row.boardIndependence || row.board_independence || row.Board_Independence),
        transparencyScore: this.parseNumber(row.transparencyScore || row.transparency_score || row.Transparency_Score),
        riskManagement: this.parseNumber(row.riskManagement || row.risk_management || row.Risk_Management),
      };
    }

    // Frameworks
    if (row.frameworks || row.Frameworks) {
      processedData.frameworks = (row.frameworks || row.Frameworks)
        .split(',')
        .map((f: string) => f.trim())
        .filter(Boolean);
    }

    // Tags
    if (row.tags || row.Tags) {
      processedData.tags = (row.tags || row.Tags)
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean);
    }

    return processedData;
  }

  private processExcelRow(row: any): any {
    // Similar to CSV processing but handle Excel-specific data types
    return this.processCsvRow(row);
  }

  private parseNumber(value: any): number | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    const num = Number(value);
    return isNaN(num) ? undefined : num;
  }

  private async createEsgDataRecords(dataArray: any[], organization: string): Promise<{
    success: boolean;
    message: string;
    recordsCreated: number;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];
    let recordsCreated = 0;

    try {
      for (const data of dataArray) {
        try {
          // Validate required fields
          if (!data.organization || !data.reportingPeriod || !data.dataSource) {
            warnings.push(`Skipping record with missing required fields: ${JSON.stringify(data)}`);
            continue;
          }

          // Use provided organization or fallback to data organization
          const finalOrganization = organization || data.organization;

          const createDto: CreateEsgDataDto = {
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
        } catch (error) {
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
    } catch (error) {
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

  async cleanupFile(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(`Cleaned up file: ${filePath}`);
      }
    } catch (error) {
      this.logger.error(`Failed to cleanup file: ${filePath}`, error);
    }
  }

  getSupportedFormats(): string[] {
    return ['csv', 'excel', 'xlsx', 'xls'];
  }

  getMaxFileSize(): number {
    return this.maxFileSize;
  }
}
