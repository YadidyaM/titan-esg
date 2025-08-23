import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EsgDataService } from './esg-data.service';
import { EsgDataController } from './esg-data.controller';
import { EsgData, EsgDataSchema } from './schemas/esg-data.schema';
import { DataUploadService } from './data-upload.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EsgData.name, schema: EsgDataSchema }
    ])
  ],
  providers: [EsgDataService, DataUploadService],
  controllers: [EsgDataController],
  exports: [EsgDataService, DataUploadService],
})
export class EsgDataModule {}
