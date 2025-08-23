import { Model } from 'mongoose';
import { EsgData, EsgDataDocument } from './schemas/esg-data.schema';
export interface CreateEsgDataDto {
    organization: string;
    reportingPeriod: string;
    dataSource: string;
    environmental?: any;
    social?: any;
    governance?: any;
    frameworks?: string[];
    tags?: string[];
}
export interface UpdateEsgDataDto {
    environmental?: any;
    social?: any;
    governance?: any;
    frameworks?: string[];
    tags?: string[];
}
export interface EsgDataQuery {
    organization?: string;
    reportingPeriod?: string;
    frameworks?: string[];
    status?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
}
export declare class EsgDataService {
    private esgDataModel;
    private readonly logger;
    constructor(esgDataModel: Model<EsgDataDocument>);
    create(createDto: CreateEsgDataDto, userId?: string): Promise<EsgData>;
    findAll(query?: EsgDataQuery): Promise<{
        data: EsgData[];
        total: number;
    }>;
    findOne(id: string): Promise<EsgData>;
    findByOrganization(organization: string): Promise<EsgData[]>;
    update(id: string, updateDto: UpdateEsgDataDto, userId?: string): Promise<EsgData>;
    delete(id: string): Promise<void>;
    softDelete(id: string): Promise<void>;
    updateDataQuality(id: string, qualityMetrics: any): Promise<EsgData>;
    getStatistics(): Promise<{
        totalRecords: number;
        organizations: string[];
        frameworks: string[];
        averageDataQuality: number;
        recentActivity: number;
    }>;
    search(query: string): Promise<EsgData[]>;
    bulkUpdate(updates: Array<{
        id: string;
        data: UpdateEsgDataDto;
    }>): Promise<EsgData[]>;
}
