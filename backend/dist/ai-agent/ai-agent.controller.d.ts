import { AiAgentService, EsgDataAnalysis } from './ai-agent.service';
export declare class AiAgentController {
    private readonly aiAgentService;
    constructor(aiAgentService: AiAgentService);
    analyzeEsgData(data: any): Promise<EsgDataAnalysis>;
    generateReport(body: {
        data: any;
        framework: string;
    }): Promise<any>;
    checkCompliance(body: {
        data: any;
        frameworks: string[];
    }): Promise<any>;
    validateData(data: any): Promise<any>;
    getTaskStatus(taskId: string): Promise<any>;
    getAllTasks(): Promise<any[]>;
    getHealth(): Promise<{
        status: string;
        timestamp: string;
        agents: string[];
    }>;
}
