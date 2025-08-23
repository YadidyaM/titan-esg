# Titan ESG Backend

A comprehensive AI-powered ESG platform backend built with NestJS, MongoDB, and Web3 integration.

## 🚀 Features

### Core Infrastructure
- **NestJS Framework** - Modern, scalable Node.js framework
- **MongoDB Integration** - Flexible document database for ESG data
- **Web3 Integration** - Blockchain support for carbon credits and audit trails
- **Multi-Agent AI System** - LangGraph-powered AI agents for ESG analysis

### AI Agents
- **Data Analysis Agent** - Environmental, Social, and Governance data analysis
- **Compliance Agent** - Regulatory framework compliance checking (GRI, SASB, TCFD, CSRD)
- **Reporting Agent** - AI-powered ESG report generation
- **Validation Agent** - Data quality validation and anomaly detection

### Data Management
- **ESG Data CRUD** - Complete data lifecycle management
- **File Upload Support** - CSV and Excel file processing
- **Data Quality Metrics** - Completeness, accuracy, consistency, and timeliness scoring
- **Search & Analytics** - Advanced querying and statistical analysis

### Blockchain Features
- **Hyperledger Fabric Integration** - Immutable audit trails
- **Carbon Credit Management** - Tokenized environmental assets
- **Data Integrity Verification** - Cryptographic hash validation
- **Audit Trail Creation** - Complete change history tracking

### Web3 Integration
- **Polygon Network Support** - Scalable blockchain infrastructure
- **Smart Contract Integration** - Carbon credit minting and transfer
- **Wallet Management** - Secure key management and transaction signing

## 🛠️ Technology Stack

- **Backend Framework**: NestJS 10
- **Database**: MongoDB 8 with Mongoose ODM
- **AI/ML**: OpenAI GPT-4, LangChain, LangGraph
- **Blockchain**: Web3.js, Ethers.js, Polygon Network
- **File Processing**: CSV Parser, XLSX
- **API Documentation**: Swagger/OpenAPI
- **Validation**: Class-validator, Class-transformer
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB 6+
- npm or yarn
- OpenAI API key (optional, for AI features)
- Polygon network access (for Web3 features)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Windows
install.bat

# Linux/Mac
npm install
```

### 2. Environment Configuration

Copy the environment sample file and configure your variables:

```bash
cp env.sample .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/titan-esg

# Web3 Configuration
WEB3_PROVIDER_URL=https://polygon-amoy.g.alchemy.com/v2/KqKzBuL8_IJaDsZBYYVmR
CHAIN_ID=80002
WEB3_PRIVATE_KEY=your_private_key_here
CARBON_CREDIT_CONTRACT_ADDRESS=0x851a15a57F6fE3E2390e386664C7d9fC505Ca207

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview
```

### 3. Start Development Server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3001`

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:3001/api`
- **API Health**: `http://localhost:3001/health`

## 🏗️ Architecture

### Module Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts          # Root module
├── database/              # Database configuration
├── web3/                  # Web3 blockchain integration
├── ai-agent/              # AI agent system
│   ├── agents/           # Individual AI agents
│   └── ai-agent.service.ts
├── blockchain/            # Hyperledger Fabric integration
└── modules/               # Feature modules
    ├── esg-data/         # ESG data management
    ├── reporting/         # Report generation
    ├── compliance/        # Compliance management
    ├── analytics/         # Data analytics
    ├── integration/       # External integrations
    └── notification/      # Notification system
```

### AI Agent System

The platform uses a multi-agent architecture powered by LangGraph:

1. **Data Analysis Agent** - Processes ESG data and provides insights
2. **Compliance Agent** - Checks regulatory framework compliance
3. **Reporting Agent** - Generates comprehensive ESG reports
4. **Validation Agent** - Ensures data quality and detects anomalies

### Data Flow

```
ESG Data Input → Validation → AI Analysis → Blockchain Storage → Report Generation
     ↓              ↓           ↓            ↓              ↓
  File Upload   Data Quality  Insights   Audit Trail   Compliance Reports
```

## 🔧 Configuration

### MongoDB Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Create database: `titan-esg`
3. Update `MONGODB_URI` in `.env`

### OpenAI Setup

1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Add to `.env` file
3. AI features will automatically activate

### Web3 Setup

1. Configure Polygon network provider
2. Set up wallet private key
3. Deploy carbon credit smart contract
4. Update contract address in `.env`

## 📊 Data Models

### ESG Data Schema

```typescript
interface EsgData {
  organization: string;
  reportingPeriod: string;
  dataSource: string;
  environmental: {
    emissions?: number;
    renewableEnergy?: number;
    waterUsage?: number;
    // ... more fields
  };
  social: {
    employeeCount?: number;
    employeeSatisfaction?: number;
    // ... more fields
  };
  governance: {
    boardIndependence?: number;
    transparencyScore?: number;
    // ... more fields
  };
  metadata: {
    dataQuality: DataQualityMetrics;
    validationStatus: string;
    // ... more fields
  };
}
```

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start:prod
```

### Docker Deployment

```bash
docker build -t titan-esg-backend .
docker run -p 3001:3001 titan-esg-backend
```

### Environment Variables

Ensure all required environment variables are set in production:

- `NODE_ENV=production`
- `MONGODB_URI` (production MongoDB)
- `OPENAI_API_KEY` (if using AI features)
- `WEB3_PROVIDER_URL` (production blockchain network)

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 API Endpoints

### Core Endpoints

- `POST /esg-data` - Create ESG data record
- `GET /esg-data` - Get all ESG data with filtering
- `POST /esg-data/upload` - Upload CSV/Excel files
- `GET /esg-data/statistics` - Get data statistics

### AI Agent Endpoints

- `POST /ai-agent/analyze-esg-data` - Analyze ESG data
- `POST /ai-agent/generate-report` - Generate ESG report
- `POST /ai-agent/check-compliance` - Check compliance
- `POST /ai-agent/validate-data` - Validate data quality

### Blockchain Endpoints

- `POST /blockchain/store-esg-data` - Store data on blockchain
- `POST /blockchain/store-carbon-credit` - Store carbon credits
- `GET /blockchain/verify-integrity/:id` - Verify data integrity

### Web3 Endpoints

- `GET /web3/network-info` - Get blockchain network info
- `GET /web3/wallet-balance` - Get wallet balance
- `POST /web3/mint-carbon-credits` - Mint carbon credits

## 🔒 Security Features

- **Input Validation** - Comprehensive data validation
- **Rate Limiting** - API request throttling
- **CORS Protection** - Cross-origin request security
- **Helmet Security** - HTTP security headers
- **Data Encryption** - Sensitive data protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the logs for debugging information

## 🔮 Roadmap

- [ ] Advanced AI model integration
- [ ] Real-time data streaming
- [ ] Enhanced blockchain features
- [ ] Mobile API support
- [ ] Advanced analytics dashboard
- [ ] Multi-tenant architecture
- [ ] Automated compliance monitoring
- [ ] Integration with more ESG frameworks
