import { EsgDataService, CreateEsgDataDto, UpdateEsgDataDto } from './esg-data.service';
import { DataUploadService } from './data-upload.service';
export declare class EsgDataController {
    private readonly esgDataService;
    private readonly dataUploadService;
    constructor(esgDataService: EsgDataService, dataUploadService: DataUploadService);
    private getMaxFileSize;
    create(createDto: CreateEsgDataDto): Promise<any>;
    findAll(query: any): Promise<any>;
    search(query: string): Promise<any>;
    getStatistics(): Promise<any>;
    findByOrganization(organization: string): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateDto: UpdateEsgDataDto): Promise<any>;
    delete(id: string): Promise<void>;
    softDelete(id: string): Promise<void>;
    updateDataQuality(id: string, qualityMetrics: any): Promise<any>;
    bulkUpdate(updates: Array<{
        id: string;
        data: UpdateEsgDataDto;
    }>): Promise<any>;
    uploadFile(file: Express.Multer.File, organization: string): Promise<any>;
    getSupportedFormats(): {
        formats: string[];
        maxFileSize: number;
    };
    private getFileType;
}
