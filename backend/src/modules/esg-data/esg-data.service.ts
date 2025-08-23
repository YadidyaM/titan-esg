import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

@Injectable()
export class EsgDataService {
  private readonly logger = new Logger(EsgDataService.name);

  constructor(
    @InjectModel(EsgData.name) private esgDataModel: Model<EsgDataDocument>,
  ) {}

  async create(createDto: CreateEsgDataDto, userId?: string): Promise<EsgData> {
    try {
      this.logger.log(`Creating ESG data for organization: ${createDto.organization}`);

      const esgData = new this.esgDataModel({
        ...createDto,
        createdBy: userId ? new Types.ObjectId(userId) : undefined,
        metadata: {
          version: '1.0',
          lastUpdated: new Date(),
          dataQuality: {
            completeness: 0,
            accuracy: 0,
            consistency: 0,
            timeliness: 0,
          },
          validationStatus: 'pending',
          anomalies: [],
        },
      });

      const savedData = await esgData.save();
      this.logger.log(`ESG data created with ID: ${savedData._id}`);

      return savedData;
    } catch (error) {
      this.logger.error('Failed to create ESG data', error);
      throw new BadRequestException('Failed to create ESG data');
    }
  }

  async findAll(query: EsgDataQuery = {}): Promise<{ data: EsgData[]; total: number }> {
    try {
      const filter: any = {};

      if (query.organization) {
        filter.organization = { $regex: query.organization, $options: 'i' };
      }

      if (query.reportingPeriod) {
        filter.reportingPeriod = { $regex: query.reportingPeriod, $options: 'i' };
      }

      if (query.frameworks && query.frameworks.length > 0) {
        filter.frameworks = { $in: query.frameworks };
      }

      if (query.status) {
        filter.status = query.status;
      }

      if (query.startDate || query.endDate) {
        filter.createdAt = {};
        if (query.startDate) filter.createdAt.$gte = query.startDate;
        if (query.endDate) filter.createdAt.$lte = query.endDate;
      }

      const limit = query.limit || 50;
      const offset = query.offset || 0;

      const [data, total] = await Promise.all([
        this.esgDataModel
          .find(filter)
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(offset)
          .exec(),
        this.esgDataModel.countDocuments(filter),
      ]);

      return { data, total };
    } catch (error) {
      this.logger.error('Failed to fetch ESG data', error);
      throw new BadRequestException('Failed to fetch ESG data');
    }
  }

  async findOne(id: string): Promise<EsgData> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid ID format');
      }

      const esgData = await this.esgDataModel.findById(id).exec();
      
      if (!esgData) {
        throw new NotFoundException('ESG data not found');
      }

      return esgData;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to fetch ESG data with ID: ${id}`, error);
      throw new BadRequestException('Failed to fetch ESG data');
    }
  }

  async findByOrganization(organization: string): Promise<EsgData[]> {
    try {
      return await this.esgDataModel
        .find({ organization: { $regex: organization, $options: 'i' } })
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      this.logger.error(`Failed to fetch ESG data for organization: ${organization}`, error);
      throw new BadRequestException('Failed to fetch ESG data');
    }
  }

  async update(id: string, updateDto: UpdateEsgDataDto, userId?: string): Promise<EsgData> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid ID format');
      }

      const existingData = await this.esgDataModel.findById(id);
      if (!existingData) {
        throw new NotFoundException('ESG data not found');
      }

      const updatedData = await this.esgDataModel
        .findByIdAndUpdate(
          id,
          {
            ...updateDto,
            updatedBy: userId ? new Types.ObjectId(userId) : undefined,
            'metadata.lastUpdated': new Date(),
          },
          { new: true, runValidators: true }
        )
        .exec();

      this.logger.log(`ESG data updated with ID: ${id}`);
      return updatedData;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to update ESG data with ID: ${id}`, error);
      throw new BadRequestException('Failed to update ESG data');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid ID format');
      }

      const result = await this.esgDataModel.findByIdAndDelete(id).exec();
      
      if (!result) {
        throw new NotFoundException('ESG data not found');
      }

      this.logger.log(`ESG data deleted with ID: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to delete ESG data with ID: ${id}`, error);
      throw new BadRequestException('Failed to delete ESG data');
    }
  }

  async softDelete(id: string): Promise<void> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid ID format');
      }

      const result = await this.esgDataModel
        .findByIdAndUpdate(id, { status: 'deleted' }, { new: true })
        .exec();
      
      if (!result) {
        throw new NotFoundException('ESG data not found');
      }

      this.logger.log(`ESG data soft deleted with ID: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to soft delete ESG data with ID: ${id}`, error);
      throw new BadRequestException('Failed to soft delete ESG data');
    }
  }

  async updateDataQuality(id: string, qualityMetrics: any): Promise<EsgData> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid ID format');
      }

      const updatedData = await this.esgDataModel
        .findByIdAndUpdate(
          id,
          {
            'metadata.dataQuality': qualityMetrics,
            'metadata.lastUpdated': new Date(),
          },
          { new: true }
        )
        .exec();

      if (!updatedData) {
        throw new NotFoundException('ESG data not found');
      }

      this.logger.log(`Data quality updated for ESG data with ID: ${id}`);
      return updatedData;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to update data quality for ID: ${id}`, error);
      throw new BadRequestException('Failed to update data quality');
    }
  }

  async getStatistics(): Promise<{
    totalRecords: number;
    organizations: string[];
    frameworks: string[];
    averageDataQuality: number;
    recentActivity: number;
  }> {
    try {
      const [
        totalRecords,
        organizations,
        frameworks,
        dataQualityStats,
        recentActivity,
      ] = await Promise.all([
        this.esgDataModel.countDocuments({ status: 'active' }),
        this.esgDataModel.distinct('organization'),
        this.esgDataModel.distinct('frameworks'),
        this.esgDataModel.aggregate([
          { $match: { status: 'active' } },
          {
            $group: {
              _id: null,
              avgCompleteness: { $avg: '$metadata.dataQuality.completeness' },
              avgAccuracy: { $avg: '$metadata.dataQuality.accuracy' },
              avgConsistency: { $avg: '$metadata.dataQuality.consistency' },
              avgTimeliness: { $avg: '$metadata.dataQuality.timeliness' },
            },
          },
        ]),
        this.esgDataModel.countDocuments({
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        }),
      ]);

      const avgDataQuality = dataQualityStats.length > 0
        ? Math.round(
            (dataQualityStats[0].avgCompleteness +
              dataQualityStats[0].avgAccuracy +
              dataQualityStats[0].avgConsistency +
              dataQualityStats[0].avgTimeliness) / 4
          )
        : 0;

      return {
        totalRecords,
        organizations,
        frameworks: frameworks.flat(),
        averageDataQuality: avgDataQuality,
        recentActivity,
      };
    } catch (error) {
      this.logger.error('Failed to get ESG data statistics', error);
      throw new BadRequestException('Failed to get statistics');
    }
  }

  async search(query: string): Promise<EsgData[]> {
    try {
      const searchRegex = { $regex: query, $options: 'i' };
      
      return await this.esgDataModel
        .find({
          $or: [
            { organization: searchRegex },
            { reportingPeriod: searchRegex },
            { tags: searchRegex },
            { frameworks: searchRegex },
          ],
          status: 'active',
        })
        .sort({ createdAt: -1 })
        .limit(20)
        .exec();
    } catch (error) {
      this.logger.error(`Failed to search ESG data with query: ${query}`, error);
      throw new BadRequestException('Failed to search ESG data');
    }
  }

  async bulkUpdate(updates: Array<{ id: string; data: UpdateEsgDataDto }>): Promise<EsgData[]> {
    try {
      const updatedRecords: EsgData[] = [];

      for (const update of updates) {
        if (!Types.ObjectId.isValid(update.id)) {
          throw new BadRequestException(`Invalid ID format: ${update.id}`);
        }

        const updatedRecord = await this.esgDataModel
          .findByIdAndUpdate(
            update.id,
            {
              ...update.data,
              'metadata.lastUpdated': new Date(),
            },
            { new: true, runValidators: true }
          )
          .exec();

        if (updatedRecord) {
          updatedRecords.push(updatedRecord);
        }
      }

      this.logger.log(`Bulk updated ${updatedRecords.length} ESG data records`);
      return updatedRecords;
    } catch (error) {
      this.logger.error('Failed to bulk update ESG data', error);
      throw new BadRequestException('Failed to bulk update ESG data');
    }
  }
}
