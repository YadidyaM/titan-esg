import { Controller, Post, Get, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { BlockchainService, BlockchainRecord, AuditTrail } from './blockchain.service';

@ApiTags('Blockchain')
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post('store-esg-data')
  @ApiOperation({ summary: 'Store ESG data on blockchain' })
  @ApiResponse({ status: 201, description: 'ESG data stored successfully' })
  @ApiBody({ description: 'ESG data to store' })
  async storeEsgData(
    @Body() body: { data: any; organization: string }
  ): Promise<BlockchainRecord> {
    try {
      const { data, organization } = body;
      
      if (!data || !organization) {
        throw new HttpException('Data and organization are required', HttpStatus.BAD_REQUEST);
      }

      return await this.blockchainService.storeEsgData(data, organization);
    } catch (error) {
      throw new HttpException(
        `Failed to store ESG data: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('store-compliance-report')
  @ApiOperation({ summary: 'Store compliance report on blockchain' })
  @ApiResponse({ status: 201, description: 'Compliance report stored successfully' })
  async storeComplianceReport(
    @Body() body: { report: any; organization: string }
  ): Promise<BlockchainRecord> {
    try {
      const { report, organization } = body;
      
      if (!report || !organization) {
        throw new HttpException('Report and organization are required', HttpStatus.BAD_REQUEST);
      }

      return await this.blockchainService.storeComplianceReport(report, organization);
    } catch (error) {
      throw new HttpException(
        `Failed to store compliance report: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('create-audit-trail')
  @ApiOperation({ summary: 'Create audit trail for data changes' })
  @ApiResponse({ status: 201, description: 'Audit trail created successfully' })
  async createAuditTrail(
    @Body() body: {
      recordId: string;
      changes: Array<{ field: string; oldValue: any; newValue: any; userId: string }>;
      organization: string;
      dataType: string;
    }
  ): Promise<AuditTrail> {
    try {
      const { recordId, changes, organization, dataType } = body;
      
      if (!recordId || !changes || !organization || !dataType) {
        throw new HttpException('All fields are required', HttpStatus.BAD_REQUEST);
      }

      return await this.blockchainService.createAuditTrail(
        recordId,
        changes,
        organization,
        dataType
      );
    } catch (error) {
      throw new HttpException(
        `Failed to create audit trail: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('store-carbon-credit')
  @ApiOperation({ summary: 'Store carbon credit on blockchain' })
  @ApiResponse({ status: 201, description: 'Carbon credit stored successfully' })
  async storeCarbonCredit(
    @Body() body: {
      amount: number;
      type: string;
      organization: string;
      verificationStatus: string;
    }
  ): Promise<BlockchainRecord> {
    try {
      const { amount, type, organization, verificationStatus } = body;
      
      if (!amount || !type || !organization || !verificationStatus) {
        throw new HttpException('All fields are required', HttpStatus.BAD_REQUEST);
      }

      return await this.blockchainService.storeCarbonCredit({
        amount,
        type,
        organization,
        verificationStatus,
      });
    } catch (error) {
      throw new HttpException(
        `Failed to store carbon credit: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('record/:recordId')
  @ApiOperation({ summary: 'Get blockchain record by ID' })
  @ApiResponse({ status: 200, description: 'Record retrieved successfully' })
  async getRecord(@Param('recordId') recordId: string): Promise<BlockchainRecord | null> {
    try {
      const record = await this.blockchainService.getRecord(recordId);
      
      if (!record) {
        throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
      }

      return record;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to get record: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('records/type/:type')
  @ApiOperation({ summary: 'Get blockchain records by type' })
  @ApiResponse({ status: 200, description: 'Records retrieved successfully' })
  async getRecordsByType(@Param('type') type: string): Promise<BlockchainRecord[]> {
    try {
      return await this.blockchainService.getRecordsByType(type);
    } catch (error) {
      throw new HttpException(
        `Failed to get records by type: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('records/organization/:organization')
  @ApiOperation({ summary: 'Get blockchain records by organization' })
  @ApiResponse({ status: 200, description: 'Records retrieved successfully' })
  async getRecordsByOrganization(@Param('organization') organization: string): Promise<BlockchainRecord[]> {
    try {
      return await this.blockchainService.getRecordsByOrganization(organization);
    } catch (error) {
      throw new HttpException(
        `Failed to get records by organization: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('audit-trail/:recordId')
  @ApiOperation({ summary: 'Get audit trail for a record' })
  @ApiResponse({ status: 200, description: 'Audit trail retrieved successfully' })
  async getAuditTrail(@Param('recordId') recordId: string): Promise<AuditTrail | null> {
    try {
      const auditTrail = await this.blockchainService.getAuditTrail(recordId);
      
      if (!auditTrail) {
        throw new HttpException('Audit trail not found', HttpStatus.NOT_FOUND);
      }

      return auditTrail;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to get audit trail: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('verify-integrity/:recordId')
  @ApiOperation({ summary: 'Verify data integrity of a blockchain record' })
  @ApiResponse({ status: 200, description: 'Integrity verification completed' })
  async verifyDataIntegrity(@Param('recordId') recordId: string): Promise<{ isValid: boolean; issues: string[] }> {
    try {
      return await this.blockchainService.verifyDataIntegrity(recordId);
    } catch (error) {
      throw new HttpException(
        `Failed to verify data integrity: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get blockchain statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getBlockchainStats(): Promise<any> {
    try {
      return await this.blockchainService.getBlockchainStats();
    } catch (error) {
      throw new HttpException(
        `Failed to get blockchain stats: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('export')
  @ApiOperation({ summary: 'Export blockchain data' })
  @ApiResponse({ status: 200, description: 'Blockchain data exported successfully' })
  async exportBlockchainData(): Promise<any> {
    try {
      return await this.blockchainService.exportBlockchainData();
    } catch (error) {
      throw new HttpException(
        `Failed to export blockchain data: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('health')
  @ApiOperation({ summary: 'Check blockchain service health' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async getHealth(): Promise<{ status: string; timestamp: string; service: string }> {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'Blockchain Service',
    };
  }
}
