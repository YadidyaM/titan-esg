# Titan ESG Platform - AI-Powered Sustainability System

## 🚀 Overview

The Titan ESG Platform has been transformed into a comprehensive, AI-powered sustainability analysis system that integrates OpenAI GPT-4 for intelligent ESG insights, blockchain technology for crypto credit management, and MongoDB for secure data storage. Users can now earn crypto credits by uploading ESG data files and participating in sustainability quizzes.

## ✨ Key Features

### 1. **AI-Powered ESG Analysis**
- **OpenAI GPT-4 Integration**: Advanced AI analysis of uploaded ESG datasets
- **Instant Feedback**: Real-time sustainability scoring and recommendations
- **Carbon Reduction Insights**: AI-generated carbon footprint analysis and improvement suggestions
- **Compliance Assessment**: Automated ESG compliance evaluation

### 2. **Crypto Credit Rewards System**
- **File Upload Rewards**: Earn up to 1.0 crypto credits for carbon emission files
- **Sustainability Quiz Rewards**: Earn 0.5 crypto credits for correct answers
- **Daily Limits**: One quiz attempt per postcode per day
- **Blockchain Integration**: Secure credit storage on Polygon network

### 3. **Property Sustainability Quiz**
- **AI-Generated Questions**: Dynamic questions based on property EPC and ESG data
- **Educational Content**: Learn sustainability concepts while earning rewards
- **Smart Validation**: AI-powered answer validation with detailed explanations
- **Postcode-Based**: Unique questions for each property location

### 4. **Advanced Data Management**
- **Multi-Format Support**: CSV, Excel, PDF, JSON file uploads
- **Drag & Drop Interface**: Modern, intuitive file upload experience
- **Real-Time Processing**: Live progress tracking and status updates
- **AI Analysis Queue**: Automated processing with intelligent insights

## 🏗️ Architecture

### **Frontend (Next.js 14)**
- React 18 with TypeScript
- Tailwind CSS for responsive design
- Framer Motion for animations
- React Dropzone for file handling

### **AI Services**
- **OpenAI GPT-4 Integration**: ESG analysis and quiz generation
- **Smart Prompts**: Context-aware analysis requests
- **Fallback Systems**: Robust error handling and fallback responses

### **Blockchain Integration**
- **Polygon Network**: Fast, low-cost transactions
- **Smart Contracts**: ERC-20 style crypto credit management
- **MetaMask Integration**: Secure wallet connectivity
- **Transaction Verification**: On-chain credit validation

### **Data Storage**
- **MongoDB**: Scalable document storage
- **Real-time Updates**: Live data synchronization
- **User Profiles**: Comprehensive user management
- **Analytics**: Detailed usage and performance metrics

## 🔑 API Integration

### **OpenAI Configuration**
```bash
# Add to your .env file
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

### **Blockchain Configuration**
```bash
# Add to your .env file
NEXT_PUBLIC_CRYPTO_CREDIT_CONTRACT=your_contract_address_here
```

### **Supported File Types**
- **CSV**: Comma-separated values for data analysis
- **Excel**: Spreadsheet data with multiple sheets
- **PDF**: Document analysis and text extraction
- **JSON**: Structured data for API responses

## 💰 Crypto Credit System

### **Earning Mechanisms**

#### **File Upload Rewards**
- **Base Credit**: 0.1 credits for any file upload
- **Sustainability Bonus**: +0.2 credits for scores ≥80
- **Carbon Reduction Bonus**: +0.3 credits for potential ≥20%
- **Compliance Bonus**: +0.2 credits for compliant data
- **Carbon File Bonus**: +1.0 credits for carbon/emission files

#### **Quiz Rewards**
- **Correct Answer**: 0.5 crypto credits
- **Daily Limit**: One attempt per postcode per day
- **Educational Value**: Learn while earning

### **Credit Calculation Example**
```
Carbon Emissions File Upload:
├── Base Credit: +0.1
├── High Score (85): +0.2
├── Carbon Reduction (35%): +0.3
├── Compliance: +0.2
└── Carbon File Bonus: +1.0
Total: 1.8 crypto credits
```

## 🧠 AI Analysis Features

### **ESG File Analysis**
- **Sustainability Score**: 0-100 rating system
- **Carbon Reduction Potential**: Percentage improvement estimates
- **Risk Assessment**: Low/Medium/High risk categorization
- **Compliance Status**: Automated regulatory compliance check
- **Actionable Recommendations**: 3-5 specific improvement suggestions

### **Quiz Generation**
- **Property-Specific Questions**: Tailored to EPC and property data
- **Difficulty Levels**: Easy, Medium, Hard categorization
- **Category Classification**: Energy, Carbon, Water, Waste, Biodiversity
- **Educational Explanations**: Detailed answer explanations

### **Answer Validation**
- **Semantic Analysis**: Understanding-based evaluation
- **Technical Accuracy**: Fact-checking and validation
- **Scoring System**: 0-100 point scale
- **Detailed Feedback**: Comprehensive explanation of results

## 🏠 Property Search & Quiz System

### **How It Works**
1. **Search Property**: Enter UK postcode (e.g., CB4 1DF)
2. **AI Question Generation**: GPT-4 creates property-specific sustainability questions
3. **User Answer**: Submit your sustainability knowledge
4. **AI Validation**: GPT-4 evaluates and scores your answer
5. **Credit Reward**: Earn 0.5 credits for correct answers
6. **Daily Limits**: One quiz attempt per postcode per day

### **Example Questions**
- **Energy Efficiency**: "Based on the EPC rating for CB4 1DF, what is the most effective way to improve energy efficiency?"
- **Solar Benefits**: "What sustainability benefit would installing solar panels provide for this property?"
- **Carbon Footprint**: "How can this property reduce its carbon emissions based on the current energy consumption data?"

## 📊 Data Upload Center

### **Upload Process**
1. **Drag & Drop**: Intuitive file upload interface
2. **File Validation**: Format and size checking
3. **AI Processing**: GPT-4 analysis and insights
4. **Credit Calculation**: Automatic reward computation
5. **Blockchain Storage**: Secure credit minting
6. **Results Display**: Comprehensive analysis dashboard

### **Processing Queue**
- **Real-time Status**: Live progress tracking
- **AI Analysis**: Automated sustainability assessment
- **Credit Rewards**: Instant crypto credit calculation
- **Error Handling**: Graceful failure management

## 🔐 Security & Privacy

### **Data Protection**
- **Local Processing**: File content processed locally before AI analysis
- **Secure Storage**: Encrypted data storage in MongoDB
- **Blockchain Security**: Immutable credit transaction records
- **User Privacy**: No personal data shared with third parties

### **API Security**
- **Environment Variables**: Secure API key management
- **Rate Limiting**: Protection against API abuse
- **Error Handling**: Secure error message handling
- **Input Validation**: Comprehensive data sanitization

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- OpenAI API key
- MetaMask wallet (for blockchain features)
- MongoDB connection (optional, mock data available)

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd titanesg/frontend

# Install dependencies
npm install

# Set up environment variables
cp env.sample .env
# Edit .env with your API keys

# Start development server
npm run dev
```

### **Environment Setup**
```bash
# Required
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_CRYPTO_CREDIT_CONTRACT=your_contract_address

# Optional
NODE_ENV=development
DEBUG=true
```

## 📈 Usage Examples

### **Upload ESG File**
1. Navigate to Data Upload Center
2. Drag & drop your CSV/Excel file
3. Watch AI analysis in real-time
4. Receive sustainability insights and recommendations
5. Earn crypto credits automatically

### **Property Sustainability Quiz**
1. Go to ESG Data Hub → Property Search
2. Search for a UK postcode
3. Answer AI-generated sustainability questions
4. Learn about property-specific improvements
5. Earn crypto credits for correct answers

### **View Crypto Credits**
1. Check the Crypto Credits widget
2. View transaction history
3. Monitor earning progress
4. Track sustainability impact

## 🔧 Configuration

### **AI Analysis Settings**
- **Model**: GPT-4 (configurable)
- **Temperature**: 0.3 for analysis, 0.7 for questions
- **Max Tokens**: 1000 for analysis, 800 for questions
- **Fallback Systems**: Robust error handling

### **Blockchain Settings**
- **Network**: Polygon Mainnet/Testnet
- **Gas Optimization**: Efficient transaction handling
- **Contract Integration**: ERC-20 compatible
- **Wallet Support**: MetaMask, WalletConnect

### **File Processing**
- **Max Size**: 50MB per file
- **Supported Formats**: CSV, Excel, PDF, JSON
- **Batch Processing**: Multiple file uploads
- **Progress Tracking**: Real-time status updates

## 🐛 Troubleshooting

### **Common Issues**

#### **AI Analysis Fails**
- Check OpenAI API key validity
- Verify API rate limits
- Check file format compatibility
- Review error logs in console

#### **Blockchain Connection Issues**
- Ensure MetaMask is installed
- Check network configuration
- Verify contract address
- Check wallet balance for gas fees

#### **File Upload Problems**
- Verify file size limits
- Check supported formats
- Ensure stable internet connection
- Clear browser cache

### **Debug Mode**
```bash
# Enable debug logging
DEBUG=true
SHOW_API_RESPONSES=true
LOG_API_REQUESTS=true
```

## 🔮 Future Enhancements

### **Planned Features**
- **Batch Analysis**: Multiple file processing
- **Advanced Analytics**: Machine learning insights
- **Mobile App**: React Native application
- **API Marketplace**: Third-party integrations
- **Real-time Collaboration**: Team-based ESG analysis

### **AI Improvements**
- **Custom Models**: Fine-tuned ESG analysis
- **Multi-language Support**: International ESG standards
- **Predictive Analytics**: Future sustainability trends
- **Industry Specialization**: Sector-specific insights

### **Blockchain Expansion**
- **NFT Integration**: ESG achievement certificates
- **DeFi Features**: Credit staking and lending
- **Cross-chain**: Multi-blockchain support
- **DAO Governance**: Community-driven decisions

## 📚 API Documentation

### **AI Analysis Endpoints**
```typescript
// Analyze ESG file
POST /api/ai/analyze
Body: { fileContent, fileName, fileType }

// Generate sustainability question
POST /api/ai/question
Body: { postcode, epcData, propertyData }

// Validate quiz answer
POST /api/ai/validate
Body: { question, userAnswer }
```

### **Blockchain Endpoints**
```typescript
// Mint crypto credits
POST /api/blockchain/mint
Body: { userId, amount, metadata }

// Get credit balance
GET /api/blockchain/balance/{userId}

// Transfer credits
POST /api/blockchain/transfer
Body: { fromUserId, toUserId, amount }
```

## 🤝 Contributing

### **Development Setup**
1. Fork the repository
2. Create feature branch
3. Implement changes
4. Add tests
5. Submit pull request

### **Code Standards**
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Jest for testing

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### **Documentation**
- [API Reference](./docs/api.md)
- [User Guide](./docs/user-guide.md)
- [Developer Guide](./docs/developer.md)

### **Community**
- [GitHub Issues](https://github.com/your-repo/issues)
- [Discord Server](https://discord.gg/your-server)
- [Email Support](mailto:support@titanesg.com)

---

**Built with ❤️ by the Titan ESG Team**

*Empowering sustainable business through AI and blockchain technology*
