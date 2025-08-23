# Titan ESG Platform Frontend

A modern, responsive frontend application for the Titan ESG Platform - an AI-powered Environmental, Social, and Governance management system.

## 🚀 Features

### Core Dashboard
- **ESG Score Overview** - Real-time KPI cards with trend indicators
- **Performance Charts** - Interactive ESG score trends and comparisons
- **Quick Actions** - Easy access to common tasks
- **Recent Activity** - Live updates and notifications

### Modern UI/UX
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode Ready** - Built with theming support
- **Smooth Animations** - Framer Motion powered transitions
- **Accessible Components** - Built with accessibility in mind

### Technology Stack
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Beautiful, composable charts
- **Headless UI** - Accessible UI components
- **Heroicons** - Beautiful SVG icons

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running (see backend README)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   ```
   
   Configure your `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # Reusable components
│   ├── dashboard/         # Dashboard-specific components
│   │   ├── dashboard.tsx
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── dashboard-content.tsx
│   │   ├── kpi-card.tsx
│   │   ├── esg-score-chart.tsx
│   │   ├── quick-actions.tsx
│   │   └── recent-activity.tsx
│   ├── ui/                # Base UI components
│   │   └── card.tsx
│   └── providers.tsx      # Context providers
├── lib/                   # Utility functions
│   └── utils.ts
├── types/                 # TypeScript type definitions
├── hooks/                 # Custom React hooks
└── store/                 # State management
```

## 🎨 Component Architecture

### Dashboard Components
- **Dashboard** - Main container and layout manager
- **Sidebar** - Navigation with mobile responsiveness
- **Header** - Search, notifications, and user menu
- **DashboardContent** - Main content area organizer
- **KpiCard** - Metric display with trend indicators
- **EsgScoreChart** - Interactive performance visualization
- **QuickActions** - Common task shortcuts
- **RecentActivity** - Live activity feed

### UI Components
- **Card** - Reusable card container with variants
- **Button** - Consistent button styling
- **Input** - Form input components
- **Modal** - Dialog and overlay components

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

### Code Style

- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Tailwind CSS** - Utility-first styling

### Component Guidelines

1. **Use TypeScript** - All components should be typed
2. **Follow naming conventions** - PascalCase for components, camelCase for functions
3. **Implement responsive design** - Mobile-first approach
4. **Add accessibility** - ARIA labels, keyboard navigation
5. **Use Tailwind utilities** - Leverage the design system

## 🎯 Key Features Implementation

### ESG Score Visualization
- **Area Charts** - Stacked ESG dimension scores
- **Trend Lines** - Overall performance tracking
- **Interactive Tooltips** - Detailed data on hover
- **Responsive Design** - Works on all screen sizes

### Real-time Updates
- **Activity Feed** - Live notifications and updates
- **Status Indicators** - Real-time system status
- **Progress Tracking** - AI analysis and upload progress

### Mobile Experience
- **Responsive Sidebar** - Collapsible navigation
- **Touch-friendly** - Optimized for mobile devices
- **Progressive Web App** - Offline capabilities ready

## 🔌 API Integration

The frontend is designed to integrate with the Titan ESG Backend API:

- **ESG Data Management** - CRUD operations for ESG records
- **AI Analysis** - Request and monitor AI-powered insights
- **File Upload** - CSV/Excel processing and validation
- **Blockchain Integration** - Carbon credit management
- **Reporting** - Generate compliance and performance reports

## 🚀 Deployment

### Production Build

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm run start
   ```

### Environment Variables

Ensure these are set in production:
- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- `NODE_ENV=production`

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for all new components
3. Ensure responsive design for mobile devices
4. Test accessibility with screen readers
5. Update documentation for new features

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔮 Roadmap

- [ ] Dark mode support
- [ ] Advanced data filtering
- [ ] Real-time collaboration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Custom report builder
- [ ] Multi-language support

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the component documentation
- Review the TypeScript types
- Check the browser console for errors
- Verify API connectivity
