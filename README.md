# 🚀 Titan ESG Platform

<div align="center">

![Titan ESG Platform](https://img.shields.io/badge/ESG-Platform-blue?style=for-the-badge&logo=leaf)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)
![AI Powered](https://img.shields.io/badge/AI-GPT--4-green?style=for-the-badge&logo=openai)
![Blockchain](https://img.shields.io/badge/Blockchain-Polygon-purple?style=for-the-badge&logo=ethereum)

**The Future of Sustainable Business Intelligence**

*AI-Powered ESG Management • Blockchain Integration • Real-Time Analytics*

[🚀 Live Demo](https://titan-esg.netlify.app) • [📚 Documentation](./docs/) • [🐛 Report Bug](https://github.com/your-repo/issues) • [✨ Request Feature](https://github.com/your-repo/issues)

</div>

---

## 🎯 What is Titan ESG Platform?

Titan ESG Platform is a **next-generation Environmental, Social, and Governance (ESG) management system** that combines cutting-edge AI technology, blockchain innovation, and real-time data analytics to revolutionize how organizations approach sustainability.

### 🌟 Key Highlights

- 🤖 **AI-Powered Analysis** - GPT-4 integration for intelligent ESG insights
- 🔗 **Blockchain Integration** - Secure carbon credit management on Polygon
- 📊 **Real-Time Analytics** - Live ESG scoring and performance tracking
- 🏠 **Property Intelligence** - UK property data integration with EPC ratings
- 💰 **Crypto Rewards** - Earn blockchain credits for sustainable actions
- 🎨 **Modern UI/UX** - Responsive design with smooth animations

---

## ✨ Features

### 🧠 AI-Powered Intelligence
- **GPT-4 Analysis** - Advanced AI analysis of ESG datasets
- **Smart Recommendations** - Personalized sustainability insights
- **Compliance Assessment** - Automated regulatory framework checking
- **Quiz Generation** - AI-created property-specific sustainability questions

### 🔗 Blockchain Innovation
- **Carbon Credits** - Tokenized environmental assets
- **Secure Transactions** - Immutable audit trails on Polygon
- **Wallet Integration** - MetaMask and Web3 wallet support
- **Smart Contracts** - Automated credit distribution

### 📊 Advanced Analytics
- **Real-Time ESG Scoring** - Live sustainability metrics
- **Interactive Dashboards** - Beautiful data visualizations
- **Performance Tracking** - Historical trend analysis
- **Compliance Monitoring** - Automated regulatory checks

### 🏠 Property Intelligence
- **EPC Integration** - Real-time energy performance data
- **Property Search** - UK postcode-based property lookup
- **Sustainability Scoring** - AI-calculated property ESG ratings
- **Improvement Recommendations** - Personalized action plans

### 💰 Reward System
- **File Upload Rewards** - Earn up to 1.8 crypto credits per upload
- **Quiz Rewards** - 0.5 credits for correct sustainability answers
- **Daily Challenges** - Gamified sustainability learning
- **Achievement Tracking** - Progress monitoring and milestones

---

## 🏗️ Architecture

### Frontend Stack
```
┌─────────────────────────────────────────────────────────────┐
│                    🌐 Frontend Layer                        │
├─────────────────────────────────────────────────────────────┤
│  Next.js 14 • TypeScript • Tailwind CSS • Framer Motion    │
│  Recharts • Headless UI • TanStack Query • Zustand         │
└─────────────────────────────────────────────────────────────┘
```

### Backend Stack
```
┌─────────────────────────────────────────────────────────────┐
│                    ⚙️ Backend Layer                         │
├─────────────────────────────────────────────────────────────┤
│  NestJS • MongoDB • OpenAI GPT-4 • Web3.js • Ethers.js     │
│  LangChain • LangGraph • Swagger • Helmet • CORS           │
└─────────────────────────────────────────────────────────────┘
```

### AI & Blockchain
```
┌─────────────────────────────────────────────────────────────┐
│                🧠 AI & 🔗 Blockchain Layer                  │
├─────────────────────────────────────────────────────────────┤
│  OpenAI GPT-4 • Polygon Network • Smart Contracts          │
│  Carbon Credits • MetaMask • Web3 Integration               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- **OpenAI API Key** (for AI features)
- **MetaMask Wallet** (for blockchain features)

### 1️⃣ Clone & Install
```bash
# Clone the repository
git clone https://github.com/your-username/titan-esg.git
cd titan-esg

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2️⃣ Environment Setup
```bash
# Frontend environment
cd frontend
cp env.sample .env.local

# Backend environment
cd ../backend
cp env.sample .env
```

### 3️⃣ Configure Environment Variables

**Frontend (.env.local):**
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here

# Blockchain Configuration
NEXT_PUBLIC_CRYPTO_CREDIT_CONTRACT=your_contract_address_here

# Property Data APIs
EPC_KEY=32c3c4979f4bf02ea00be456a3b840ec272dca44
PROPERTY_DATA_API_KEY=RPEMJFQNOR
USE_LAND_PROPERTY_API_KEY=a84446ee-20b8-49e2-b618-d7a67075897
```

**Backend (.env):**
```env
# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/titan-esg

# AI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview

# Blockchain Configuration
WEB3_PROVIDER_URL=https://polygon-amoy.g.alchemy.com/v2/your_key
CHAIN_ID=80002
WEB3_PRIVATE_KEY=your_private_key_here
CARBON_CREDIT_CONTRACT_ADDRESS=0x851a15a57F6fE3E2390e386664C7d9fC505Ca207
```

### 4️⃣ Start Development
```bash
# Start backend (Terminal 1)
cd backend
npm run start:dev

# Start frontend (Terminal 2)
cd frontend
npm run dev
```

### 5️⃣ Open Your Browser
Navigate to [http://localhost:3000](http://localhost:3000) 🎉

---

## 🎮 How to Use

### 📁 Upload ESG Data
1. **Navigate** to Data Upload Center
2. **Drag & Drop** your CSV/Excel files
3. **Watch** AI analysis in real-time
4. **Receive** sustainability insights and recommendations
5. **Earn** crypto credits automatically

### 🏠 Property Sustainability Quiz
1. **Search** for a UK postcode (e.g., CB4 1DF)
2. **Answer** AI-generated sustainability questions
3. **Learn** about property-specific improvements
4. **Earn** 0.5 crypto credits for correct answers

### 💰 Crypto Credit System
- **File Upload**: Up to 1.8 credits per upload
- **Quiz Rewards**: 0.5 credits per correct answer
- **Daily Limits**: One quiz attempt per postcode per day
- **Blockchain Storage**: Secure credit management

---

## 🛠️ Technology Stack

### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14 | React framework with App Router |
| **TypeScript** | 5.6 | Type-safe development |
| **Tailwind CSS** | 3.4 | Utility-first styling |
| **Framer Motion** | 11 | Smooth animations |
| **Recharts** | 2.12 | Data visualization |
| **TanStack Query** | 5.59 | Server state management |
| **Zustand** | 4.5 | Client state management |

### Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **NestJS** | Latest | Scalable Node.js framework |
| **MongoDB** | 8 | Document database |
| **OpenAI GPT-4** | Latest | AI analysis and insights |
| **Web3.js** | Latest | Blockchain integration |
| **LangChain** | Latest | AI agent orchestration |
| **Swagger** | Latest | API documentation |

### AI & Blockchain
| Technology | Purpose |
|------------|---------|
| **OpenAI GPT-4** | ESG analysis and quiz generation |
| **Polygon Network** | Fast, low-cost blockchain transactions |
| **MetaMask** | Web3 wallet integration |
| **Smart Contracts** | Automated credit distribution |

---

## 📊 API Integration

### Government APIs
- **EPC API** - Energy Performance Certificate data
- **Property Data API** - Comprehensive property information
- **Land Registry API** - Property ownership and valuation data

### AI Services
- **OpenAI GPT-4** - ESG analysis and insights
- **Custom Prompts** - Context-aware analysis requests
- **Fallback Systems** - Robust error handling

### Blockchain Services
- **Polygon Network** - Carbon credit transactions
- **Smart Contracts** - Automated reward distribution
- **Web3 Integration** - Wallet connectivity

---

## 🚀 Deployment

### 🌐 Frontend (Netlify)
```bash
# Build and deploy
npm run build
netlify deploy --prod --dir=out
```

### ⚙️ Backend (Heroku)
```bash
# Deploy to Heroku
heroku create titan-esg-backend
git push heroku main
```

### 🐳 Docker Deployment
```bash
# Build and run with Docker
docker-compose up --build
```

---

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm run test
npm run test:e2e

# Backend tests
cd backend
npm run test
npm run test:e2e
npm run test:cov
```

---

## 📈 Performance

### Core Web Vitals
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### Optimization Features
- **Code Splitting** - Automatic route-based splitting
- **Image Optimization** - Next.js Image component
- **Caching** - TanStack Query caching strategies
- **Bundle Analysis** - Webpack bundle monitoring

---

## 🔒 Security

### Frontend Security
- **Input Validation** - Client-side data validation
- **XSS Protection** - React's built-in protection
- **Environment Variables** - Secure configuration management

### Backend Security
- **Helmet** - HTTP security headers
- **CORS** - Cross-origin request security
- **Rate Limiting** - API request throttling
- **Data Encryption** - Sensitive data protection

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Add** tests
5. **Submit** a pull request

### Code Standards
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for formatting
- **Jest** for testing

---

## 📚 Documentation

- [👤 User Guide](./docs/user-guide.md)
- [🔧 API Reference](./docs/api-reference.md)
- [🏗️ Architecture](./docs/architecture.md)
- [🚀 Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [🤖 AI Integration](./README-AI-ESG-SYSTEM.md)
- [🔗 API Integration](./README-API-INTEGRATION.md)

---

## 🆘 Support

### Getting Help
- 📧 **Email**: support@titanesg.com
- 💬 **Discord**: [Join our community](https://discord.gg/titan-esg)
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- 📖 **Docs**: [Documentation](./docs/)

### Common Issues
- **AI Analysis Fails**: Check OpenAI API key validity
- **Blockchain Issues**: Ensure MetaMask is installed
- **File Upload Problems**: Verify file size and format limits

---

## 🗺️ Roadmap

### 🎯 Q1 2024
- [ ] Dark mode support
- [ ] Advanced data filtering
- [ ] Real-time collaboration
- [ ] Mobile app (React Native)

### 🎯 Q2 2024
- [ ] Advanced analytics dashboard
- [ ] Custom report builder
- [ ] Multi-language support
- [ ] API marketplace

### 🎯 Q3 2024
- [ ] Machine learning insights
- [ ] Predictive analytics
- [ ] Industry specialization
- [ ] Cross-chain support

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 API
- **Polygon** for blockchain infrastructure
- **Vercel** for Next.js framework
- **MongoDB** for database services
- **Tailwind CSS** for styling framework

---

<div align="center">

### 🌟 Star this repository if you found it helpful!

**Built with ❤️ by the Titan ESG Team**

*Empowering sustainable business through AI and blockchain technology*

[⬆ Back to Top](#-titan-esg-platform)

</div>
