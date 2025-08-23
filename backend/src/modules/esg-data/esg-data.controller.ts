import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EsgDataService, CreateEsgDataDto, UpdateEsgDataDto } from './esg-data.service';
import { DataUploadService } from './data-upload.service';

@ApiTags('ESG Data')
@Controller('esg-data')
export class EsgDataController {
  constructor(
    private readonly esgDataService: EsgDataService,
    private readonly dataUploadService: DataUploadService,
  ) {}

  private getMaxFileSize(): number {
    return this.dataUploadService?.getMaxFileSize() || 10 * 1024 * 1024; // 10MB fallback
  }

  @Post()
  @ApiOperation({ summary: 'Create new ESG data record' })
  @ApiResponse({ status: 201, description: 'ESG data created successfully' })
  async create(@Body() createDto: CreateEsgDataDto): Promise<any> {
    try {
      return await this.esgDataService.create(createDto);
    } catch (error) {
      throw new HttpException(
        `Failed to create ESG data: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all ESG data records with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'ESG data retrieved successfully' })
  async findAll(@Query() query: any): Promise<any> {
    try {
      // Parse query parameters
      const parsedQuery: any = { ...query };
      
      if (query.limit) parsedQuery.limit = parseInt(query.limit);
      if (query.offset) parsedQuery.offset = parseInt(query.offset);
      if (query.startDate) parsedQuery.startDate = new Date(query.startDate);
      if (query.endDate) parsedQuery.endDate = new Date(query.endDate);
      if (query.frameworks) parsedQuery.frameworks = query.frameworks.split(',');

      return await this.esgDataService.findAll(parsedQuery);
    } catch (error) {
      throw new HttpException(
        `Failed to fetch ESG data: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Search ESG data records' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  async search(@Query('q') query: string): Promise<any> {
    try {
      if (!query) {
        throw new BadRequestException('Search query is required');
      }

      return await this.esgDataService.search(query);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        `Search failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get ESG data statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStatistics(): Promise<any> {
    try {
      return await this.esgDataService.getStatistics();
    } catch (error) {
      throw new HttpException(
        `Failed to get statistics: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('organization/:organization')
  @ApiOperation({ summary: 'Get ESG data by organization' })
  @ApiResponse({ status: 200, description: 'ESG data retrieved successfully' })
  async findByOrganization(@Param('organization') organization: string): Promise<any> {
    try {
      return await this.esgDataService.findByOrganization(organization);
    } catch (error) {
      throw new HttpException(
        `Failed to fetch ESG data for organization: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ESG data by ID' })
  @ApiResponse({ status: 200, description: 'ESG data retrieved successfully' })
  async findOne(@Param('id') id: string): Promise<any> {
    try {
      return await this.esgDataService.findOne(id);
    } catch (error) {
      if (error.message === 'ESG data not found') {
        throw new HttpException('ESG data not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        `Failed to fetch ESG data: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update ESG data record' })
  @ApiResponse({ status: 200, description: 'ESG data updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateEsgDataDto,
  ): Promise<any> {
    try {
      return await this.esgDataService.update(id, updateDto);
    } catch (error) {
      if (error.message === 'ESG data not found') {
        throw new HttpException('ESG data not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        `Failed to update ESG data: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete ESG data record' })
  @ApiResponse({ status: 200, description: 'ESG data deleted successfully' })
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.esgDataService.delete(id);
    } catch (error) {
      if (error.message === 'ESG data not found') {
        throw new HttpException('ESG data not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        `Failed to delete ESG data: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post(':id/soft-delete')
  @ApiOperation({ summary: 'Soft delete ESG data record' })
  @ApiResponse({ status: 200, description: 'ESG data soft deleted successfully' })
  async softDelete(@Param('id') id: string): Promise<void> {
    try {
      await this.esgDataService.softDelete(id);
    } catch (error) {
      if (error.message === 'ESG data not found') {
        throw new HttpException('ESG data not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        `Failed to soft delete ESG data: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id/data-quality')
  @ApiOperation({ summary: 'Update data quality metrics' })
  @ApiResponse({ status: 200, description: 'Data quality updated successfully' })
  async updateDataQuality(
    @Param('id') id: string,
    @Body() qualityMetrics: any,
  ): Promise<any> {
    try {
      return await this.esgDataService.updateDataQuality(id, qualityMetrics);
    } catch (error) {
      if (error.message === 'ESG data not found') {
        throw new HttpException('ESG data not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        `Failed to update data quality: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('bulk-update')
  @ApiOperation({ summary: 'Bulk update multiple ESG data records' })
  @ApiResponse({ status: 200, description: 'Bulk update completed successfully' })
  async bulkUpdate(@Body() updates: Array<{ id: string; data: UpdateEsgDataDto }>): Promise<any> {
    try {
      if (!updates || !Array.isArray(updates) || updates.length === 0) {
        throw new BadRequestException('Updates array is required and must not be empty');
      }

      return await this.esgDataService.bulkUpdate(updates);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        `Bulk update failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload ESG data file (CSV/Excel)' })
  @ApiResponse({ status: 201, description: 'File uploaded and processed successfully' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
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
        } else {
          cb(new BadRequestException('Only CSV and Excel files are allowed'), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('organization') organization: string,
  ): Promise<any> {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      if (!organization) {
        throw new BadRequestException('Organization is required');
      }

      const filePath = file.path;
      const fileType = this.getFileType(file.mimetype);

      // Validate file
      const validationResult = await this.dataUploadService.validateFile(filePath, fileType);
      
      if (!validationResult.isValid) {
        await this.dataUploadService.cleanupFile(filePath);
        throw new BadRequestException(`File validation failed: ${validationResult.errors.join(', ')}`);
      }

      // Process file
      let uploadResult;
      if (fileType === 'csv') {
        uploadResult = await this.dataUploadService.processCsvFile(filePath, organization);
      } else {
        uploadResult = await this.dataUploadService.processExcelFile(filePath, organization);
      }

      // Cleanup file
      await this.dataUploadService.cleanupFile(filePath);

      return {
        message: 'File uploaded and processed successfully',
        ...uploadResult,
      };
    } catch (error) {
      // Cleanup file on error
      if (file?.path) {
        await this.dataUploadService.cleanupFile(file.path);
      }

      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        `File upload failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('upload/supported-formats')
  @ApiOperation({ summary: 'Get supported file formats for upload' })
  @ApiResponse({ status: 200, description: 'Supported formats retrieved successfully' })
  getSupportedFormats(): { formats: string[]; maxFileSize: number } {
    return {
      formats: this.dataUploadService.getSupportedFormats(),
      maxFileSize: this.getMaxFileSize(),
    };
  }

  private getFileType(mimeType: string): string {
    if (mimeType === 'text/csv') return 'csv';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'excel';
    return 'csv'; // Default fallback
  }
}
