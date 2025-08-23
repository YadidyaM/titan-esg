import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiAgentService } from './ai-agent.service';
import { AiAgentController } from './ai-agent.controller';
import { DataAnalysisAgent } from './agents/data-analysis.agent';
import { ComplianceAgent } from './agents/compliance.agent';
import { ReportingAgent } from './agents/reporting.agent';
import { ValidationAgent } from './agents/validation.agent';

@Module({
  imports: [ConfigModule],
  providers: [
    AiAgentService,
    DataAnalysisAgent,
    ComplianceAgent,
    ReportingAgent,
    ValidationAgent,
  ],
  controllers: [AiAgentController],
  exports: [AiAgentService],
})
export class AiAgentModule {}
