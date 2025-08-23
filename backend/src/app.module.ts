import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

// Core modules
import { DatabaseModule } from './database/database.module';
import { Web3Module } from './web3/web3.module';
import { AiAgentModule } from './ai-agent/ai-agent.module';
import { BlockchainModule } from './blockchain/blockchain.module';

// Feature modules
import { EsgDataModule } from './modules/esg-data/esg-data.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/titan-esg'),
    ScheduleModule.forRoot(),
    
    // Core modules
    DatabaseModule,
    Web3Module,
    AiAgentModule,
    BlockchainModule,
    
    // Feature modules
    EsgDataModule,
  ],
})
export class AppModule {}
