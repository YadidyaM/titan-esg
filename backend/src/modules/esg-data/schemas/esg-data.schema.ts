import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EsgDataDocument = EsgData & Document;

@Schema({ timestamps: true })
export class EsgData {
  @Prop({ required: true })
  organization: string;

  @Prop({ required: true })
  reportingPeriod: string;

  @Prop({ required: true })
  dataSource: string;

  @Prop({ type: Object })
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

  @Prop({ type: Object })
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

  @Prop({ type: Object })
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

  @Prop({ type: Object })
  metrics: {
    esgScore?: number;
    environmentalScore?: number;
    socialScore?: number;
    governanceScore?: number;
    riskLevel?: string;
    trend?: string;
  };

  @Prop({ type: [String] })
  frameworks: string[];

  @Prop({ type: Object })
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

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;

  @Prop({ default: 'active' })
  status: 'active' | 'archived' | 'deleted';

  @Prop({ type: [String] })
  tags: string[];
}

export const EsgDataSchema = SchemaFactory.createForClass(EsgData);

// Indexes for better query performance
EsgDataSchema.index({ organization: 1, reportingPeriod: 1 });
EsgDataSchema.index({ frameworks: 1 });
EsgDataSchema.index({ 'metadata.lastUpdated': -1 });
EsgDataSchema.index({ status: 1 });
