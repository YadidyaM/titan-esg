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
var EsgDataService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EsgDataService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const esg_data_schema_1 = require("./schemas/esg-data.schema");
let EsgDataService = EsgDataService_1 = class EsgDataService {
    constructor(esgDataModel) {
        this.esgDataModel = esgDataModel;
        this.logger = new common_1.Logger(EsgDataService_1.name);
    }
    async create(createDto, userId) {
        try {
            this.logger.log(`Creating ESG data for organization: ${createDto.organization}`);
            const esgData = new this.esgDataModel({
                ...createDto,
                createdBy: userId ? new mongoose_2.Types.ObjectId(userId) : undefined,
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
        }
        catch (error) {
            this.logger.error('Failed to create ESG data', error);
            throw new common_1.BadRequestException('Failed to create ESG data');
        }
    }
    async findAll(query = {}) {
        try {
            const filter = {};
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
                if (query.startDate)
                    filter.createdAt.$gte = query.startDate;
                if (query.endDate)
                    filter.createdAt.$lte = query.endDate;
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
        }
        catch (error) {
            this.logger.error('Failed to fetch ESG data', error);
            throw new common_1.BadRequestException('Failed to fetch ESG data');
        }
    }
    async findOne(id) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException('Invalid ID format');
            }
            const esgData = await this.esgDataModel.findById(id).exec();
            if (!esgData) {
                throw new common_1.NotFoundException('ESG data not found');
            }
            return esgData;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.logger.error(`Failed to fetch ESG data with ID: ${id}`, error);
            throw new common_1.BadRequestException('Failed to fetch ESG data');
        }
    }
    async findByOrganization(organization) {
        try {
            return await this.esgDataModel
                .find({ organization: { $regex: organization, $options: 'i' } })
                .sort({ createdAt: -1 })
                .exec();
        }
        catch (error) {
            this.logger.error(`Failed to fetch ESG data for organization: ${organization}`, error);
            throw new common_1.BadRequestException('Failed to fetch ESG data');
        }
    }
    async update(id, updateDto, userId) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException('Invalid ID format');
            }
            const existingData = await this.esgDataModel.findById(id);
            if (!existingData) {
                throw new common_1.NotFoundException('ESG data not found');
            }
            const updatedData = await this.esgDataModel
                .findByIdAndUpdate(id, {
                ...updateDto,
                updatedBy: userId ? new mongoose_2.Types.ObjectId(userId) : undefined,
                'metadata.lastUpdated': new Date(),
            }, { new: true, runValidators: true })
                .exec();
            this.logger.log(`ESG data updated with ID: ${id}`);
            return updatedData;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.logger.error(`Failed to update ESG data with ID: ${id}`, error);
            throw new common_1.BadRequestException('Failed to update ESG data');
        }
    }
    async delete(id) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException('Invalid ID format');
            }
            const result = await this.esgDataModel.findByIdAndDelete(id).exec();
            if (!result) {
                throw new common_1.NotFoundException('ESG data not found');
            }
            this.logger.log(`ESG data deleted with ID: ${id}`);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.logger.error(`Failed to delete ESG data with ID: ${id}`, error);
            throw new common_1.BadRequestException('Failed to delete ESG data');
        }
    }
    async softDelete(id) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException('Invalid ID format');
            }
            const result = await this.esgDataModel
                .findByIdAndUpdate(id, { status: 'deleted' }, { new: true })
                .exec();
            if (!result) {
                throw new common_1.NotFoundException('ESG data not found');
            }
            this.logger.log(`ESG data soft deleted with ID: ${id}`);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.logger.error(`Failed to soft delete ESG data with ID: ${id}`, error);
            throw new common_1.BadRequestException('Failed to soft delete ESG data');
        }
    }
    async updateDataQuality(id, qualityMetrics) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException('Invalid ID format');
            }
            const updatedData = await this.esgDataModel
                .findByIdAndUpdate(id, {
                'metadata.dataQuality': qualityMetrics,
                'metadata.lastUpdated': new Date(),
            }, { new: true })
                .exec();
            if (!updatedData) {
                throw new common_1.NotFoundException('ESG data not found');
            }
            this.logger.log(`Data quality updated for ESG data with ID: ${id}`);
            return updatedData;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.logger.error(`Failed to update data quality for ID: ${id}`, error);
            throw new common_1.BadRequestException('Failed to update data quality');
        }
    }
    async getStatistics() {
        try {
            const [totalRecords, organizations, frameworks, dataQualityStats, recentActivity,] = await Promise.all([
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
                ? Math.round((dataQualityStats[0].avgCompleteness +
                    dataQualityStats[0].avgAccuracy +
                    dataQualityStats[0].avgConsistency +
                    dataQualityStats[0].avgTimeliness) / 4)
                : 0;
            return {
                totalRecords,
                organizations,
                frameworks: frameworks.flat(),
                averageDataQuality: avgDataQuality,
                recentActivity,
            };
        }
        catch (error) {
            this.logger.error('Failed to get ESG data statistics', error);
            throw new common_1.BadRequestException('Failed to get statistics');
        }
    }
    async search(query) {
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
        }
        catch (error) {
            this.logger.error(`Failed to search ESG data with query: ${query}`, error);
            throw new common_1.BadRequestException('Failed to search ESG data');
        }
    }
    async bulkUpdate(updates) {
        try {
            const updatedRecords = [];
            for (const update of updates) {
                if (!mongoose_2.Types.ObjectId.isValid(update.id)) {
                    throw new common_1.BadRequestException(`Invalid ID format: ${update.id}`);
                }
                const updatedRecord = await this.esgDataModel
                    .findByIdAndUpdate(update.id, {
                    ...update.data,
                    'metadata.lastUpdated': new Date(),
                }, { new: true, runValidators: true })
                    .exec();
                if (updatedRecord) {
                    updatedRecords.push(updatedRecord);
                }
            }
            this.logger.log(`Bulk updated ${updatedRecords.length} ESG data records`);
            return updatedRecords;
        }
        catch (error) {
            this.logger.error('Failed to bulk update ESG data', error);
            throw new common_1.BadRequestException('Failed to bulk update ESG data');
        }
    }
};
exports.EsgDataService = EsgDataService;
exports.EsgDataService = EsgDataService = EsgDataService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(esg_data_schema_1.EsgData.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], EsgDataService);
//# sourceMappingURL=esg-data.service.js.map