import { Controller, Post, Get, Body, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AiAgentService, EsgDataAnalysis } from './ai-agent.service';

@ApiTags('AI Agents')
@Controller('ai-agent')
export class AiAgentController {
  constructor(private readonly aiAgentService: AiAgentService) {}

  @Post('analyze-esg-data')
  @ApiOperation({ summary: 'Analyze ESG data using AI agents' })
  @ApiResponse({ status: 200, description: 'ESG data analysis completed successfully' })
  @ApiBody({ description: 'ESG data to analyze' })
  async analyzeEsgData(@Body() data: any): Promise<EsgDataAnalysis> {
    try {
      if (!data || Object.keys(data).length === 0) {
        throw new HttpException('No data provided for analysis', HttpStatus.BAD_REQUEST);
      }

      return await this.aiAgentService.analyzeEsgData(data);
    } catch (error) {
      throw new HttpException(
        `ESG data analysis failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('generate-report')
  @ApiOperation({ summary: 'Generate ESG report using AI agents' })
  @ApiResponse({ status: 200, description: 'ESG report generated successfully' })
  async generateReport(
    @Body() body: { data: any; framework: string }
  ): Promise<any> {
    try {
      const { data, framework } = body;
      
      if (!data || !framework) {
        throw new HttpException('Data and framework are required', HttpStatus.BAD_REQUEST);
      }

      return await this.aiAgentService.generateReport(data, framework);
    } catch (error) {
      throw new HttpException(
        `Report generation failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('check-compliance')
  @ApiOperation({ summary: 'Check compliance using AI agents' })
  @ApiResponse({ status: 200, description: 'Compliance check completed successfully' })
  async checkCompliance(
    @Body() body: { data: any; frameworks: string[] }
  ): Promise<any> {
    try {
      const { data, frameworks } = body;
      
      if (!data || !frameworks || frameworks.length === 0) {
        throw new HttpException('Data and frameworks are required', HttpStatus.BAD_REQUEST);
      }

      return await this.aiAgentService.checkCompliance(data, frameworks);
    } catch (error) {
      throw new HttpException(
        `Compliance check failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('validate-data')
  @ApiOperation({ summary: 'Validate ESG data using AI agents' })
  @ApiResponse({ status: 200, description: 'Data validation completed successfully' })
  async validateData(@Body() data: any): Promise<any> {
    try {
      if (!data || Object.keys(data).length === 0) {
        throw new HttpException('No data provided for validation', HttpStatus.BAD_REQUEST);
      }

      return await this.aiAgentService.validateData(data);
    } catch (error) {
      throw new HttpException(
        `Data validation failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('task-status/:taskId')
  @ApiOperation({ summary: 'Get AI agent task status' })
  @ApiResponse({ status: 200, description: 'Task status retrieved successfully' })
  async getTaskStatus(@Param('taskId') taskId: string): Promise<any> {
    try {
      const task = this.aiAgentService.getTaskStatus(taskId);
      
      if (!task) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }

      return task;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to get task status: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('tasks')
  @ApiOperation({ summary: 'Get all AI agent tasks' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  async getAllTasks(): Promise<any[]> {
    try {
      return this.aiAgentService.getAllTasks();
    } catch (error) {
      throw new HttpException(
        `Failed to get tasks: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('health')
  @ApiOperation({ summary: 'Check AI agent service health' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async getHealth(): Promise<{ status: string; timestamp: string; agents: string[] }> {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      agents: [
        'DataAnalysisAgent',
        'ComplianceAgent',
        'ReportingAgent',
        'ValidationAgent',
      ],
    };
  }
}
