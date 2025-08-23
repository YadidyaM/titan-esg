"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiAgentModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ai_agent_service_1 = require("./ai-agent.service");
const ai_agent_controller_1 = require("./ai-agent.controller");
const data_analysis_agent_1 = require("./agents/data-analysis.agent");
const compliance_agent_1 = require("./agents/compliance.agent");
const reporting_agent_1 = require("./agents/reporting.agent");
const validation_agent_1 = require("./agents/validation.agent");
let AiAgentModule = class AiAgentModule {
};
exports.AiAgentModule = AiAgentModule;
exports.AiAgentModule = AiAgentModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [
            ai_agent_service_1.AiAgentService,
            data_analysis_agent_1.DataAnalysisAgent,
            compliance_agent_1.ComplianceAgent,
            reporting_agent_1.ReportingAgent,
            validation_agent_1.ValidationAgent,
        ],
        controllers: [ai_agent_controller_1.AiAgentController],
        exports: [ai_agent_service_1.AiAgentService],
    })
], AiAgentModule);
//# sourceMappingURL=ai-agent.module.js.map