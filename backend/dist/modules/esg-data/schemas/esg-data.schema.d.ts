import { Document, Types } from 'mongoose';
export type EsgDataDocument = EsgData & Document;
export declare class EsgData {
    organization: string;
    reportingPeriod: string;
    dataSource: string;
    environmental: {
        emissions?: number;
        renewableEnergy?: number;
        waterUsage?: number;
        wasteGeneration?: number;
        energyConsumption?: number;
        carbonFootprint?: number;
        biodiversityImpact?: number;
        airQuality?: number;
    };
    social: {
        employeeCount?: number;
        employeeSatisfaction?: number;
        diversityScore?: number;
        trainingHours?: number;
        communityInvestment?: number;
        healthAndSafety?: number;
        laborRights?: number;
        dataPrivacy?: number;
    };
    governance: {
        boardIndependence?: number;
        transparencyScore?: number;
        riskManagement?: number;
        complianceScore?: number;
        ethicsScore?: number;
        stakeholderEngagement?: number;
        antiCorruption?: number;
        boardDiversity?: number;
    };
    metrics: {
        esgScore?: number;
        environmentalScore?: number;
        socialScore?: number;
        governanceScore?: number;
        riskLevel?: string;
        trend?: string;
    };
    frameworks: string[];
    metadata: {
        version: string;
        lastUpdated: Date;
        dataQuality: {
            completeness: number;
            accuracy: number;
            consistency: number;
            timeliness: number;
        };
        validationStatus: string;
        anomalies: string[];
    };
    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;
    status: 'active' | 'archived' | 'deleted';
    tags: string[];
}
export declare const EsgDataSchema: import("mongoose").Schema<EsgData, import("mongoose").Model<EsgData, any, any, any, Document<unknown, any, EsgData, any, {}> & EsgData & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, EsgData, Document<unknown, {}, import("mongoose").FlatRecord<EsgData>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<EsgData> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
