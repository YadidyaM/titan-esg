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
exports.AiAgentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ai_agent_service_1 = require("./ai-agent.service");
let AiAgentController = class AiAgentController {
    constructor(aiAgentService) {
        this.aiAgentService = aiAgentService;
    }
    async analyzeEsgData(data) {
        try {
            if (!data || Object.keys(data).length === 0) {
                throw new common_1.HttpException('No data provided for analysis', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.aiAgentService.analyzeEsgData(data);
        }
        catch (error) {
            throw new common_1.HttpException(`ESG data analysis failed: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async generateReport(body) {
        try {
            const { data, framework } = body;
            if (!data || !framework) {
                throw new common_1.HttpException('Data and framework are required', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.aiAgentService.generateReport(data, framework);
        }
        catch (error) {
            throw new common_1.HttpException(`Report generation failed: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async checkCompliance(body) {
        try {
            const { data, frameworks } = body;
            if (!data || !frameworks || frameworks.length === 0) {
                throw new common_1.HttpException('Data and frameworks are required', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.aiAgentService.checkCompliance(data, frameworks);
        }
        catch (error) {
            throw new common_1.HttpException(`Compliance check failed: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async validateData(data) {
        try {
            if (!data || Object.keys(data).length === 0) {
                throw new common_1.HttpException('No data provided for validation', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.aiAgentService.validateData(data);
        }
        catch (error) {
            throw new common_1.HttpException(`Data validation failed: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getTaskStatus(taskId) {
        try {
            const task = this.aiAgentService.getTaskStatus(taskId);
            if (!task) {
                throw new common_1.HttpException('Task not found', common_1.HttpStatus.NOT_FOUND);
            }
            return task;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(`Failed to get task status: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllTasks() {
        try {
            return this.aiAgentService.getAllTasks();
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to get tasks: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getHealth() {
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
};
exports.AiAgentController = AiAgentController;
__decorate([
    (0, common_1.Post)('analyze-esg-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Analyze ESG data using AI agents' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ESG data analysis completed successfully' }),
    (0, swagger_1.ApiBody)({ description: 'ESG data to analyze' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiAgentController.prototype, "analyzeEsgData", null);
__decorate([
    (0, common_1.Post)('generate-report'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate ESG report using AI agents' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ESG report generated successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiAgentController.prototype, "generateReport", null);
__decorate([
    (0, common_1.Post)('check-compliance'),
    (0, swagger_1.ApiOperation)({ summary: 'Check compliance using AI agents' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Compliance check completed successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiAgentController.prototype, "checkCompliance", null);
__decorate([
    (0, common_1.Post)('validate-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate ESG data using AI agents' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data validation completed successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiAgentController.prototype, "validateData", null);
__decorate([
    (0, common_1.Get)('task-status/:taskId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get AI agent task status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task status retrieved successfully' }),
    __param(0, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiAgentController.prototype, "getTaskStatus", null);
__decorate([
    (0, common_1.Get)('tasks'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all AI agent tasks' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tasks retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiAgentController.prototype, "getAllTasks", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Check AI agent service health' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiAgentController.prototype, "getHealth", null);
exports.AiAgentController = AiAgentController = __decorate([
    (0, swagger_1.ApiTags)('AI Agents'),
    (0, common_1.Controller)('ai-agent'),
    __metadata("design:paramtypes", [ai_agent_service_1.AiAgentService])
], AiAgentController);
//# sourceMappingURL=ai-agent.controller.js.map