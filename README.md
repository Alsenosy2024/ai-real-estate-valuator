# AI Real Estate Valuator

![AI Real Estate Valuator](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![Node](https://img.shields.io/badge/Node-20+-green)

An intelligent, AI-powered property valuation platform specifically designed for the Riyadh real estate market. This application leverages advanced machine learning models and real-time market data to provide accurate property valuations in seconds.

## 🌟 Features

### Core Features
- **AI-Powered Valuation**: Advanced machine learning models trained on Riyadh market data
- **Live Market Data**: Real-time data crawling from verified Saudi real estate portals (Aqar.fm, Ejar.sa, Haraj.com.sa)
- **Interactive Map Integration**: Select property locations using Leaflet maps with automatic district detection
- **Bilingual Support**: Full Arabic and English language support with RTL/LTR layouts
- **Professional PDF Reports**: Generate detailed valuation reports in both English and Arabic
- **Comprehensive Property Analysis**: Factor in property type, age, finishing quality, amenities, and more

### Technical Features
- **Real-time Progress Tracking**: Visual progress indicators during valuation calculation
- **Comparable Properties Analysis**: Find and display similar properties with pricing data
- **Confidence Scoring**: AI-generated confidence scores based on data quality and availability
- **Market Trend Analysis**: Analyze market trends and price movements
- **Secure Authentication**: OAuth-based authentication system
- **Responsive Design**: Mobile-first design that works on all devices

## 🏗️ Architecture

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and optimized builds
- **TailwindCSS 4** for modern styling
- **tRPC** for type-safe API calls
- **React Query** for efficient data fetching and caching
- **Wouter** for lightweight routing
- **Radix UI** for accessible component primitives
- **Leaflet** for interactive maps

### Backend
- **Express.js** with TypeScript
- **tRPC** for type-safe API layer
- **OpenAI API** for AI-powered analysis
- **Drizzle ORM** with MySQL
- **PDFKit** for PDF report generation
- **AWS S3** for file storage

## 📋 Prerequisites

- Node.js 20 or higher
- MySQL database
- OpenAI API key (for AI features)
- AWS S3 credentials (for report storage)
- OAuth server credentials

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-real-estate-valuator
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Configure Environment Variables

Copy the `.env.example` file to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# App Configuration
VITE_APP_ID=your-app-id
VITE_OAUTH_PORTAL_URL=https://vida.butterfly-effect.dev
VITE_APP_TITLE="AI Real Estate Valuator"
VITE_APP_LOGO="https://your-logo-url.com/logo.png"

# Analytics (Optional)
VITE_ANALYTICS_ENDPOINT=https://your-analytics-endpoint.com
VITE_ANALYTICS_WEBSITE_ID=your-analytics-id

# OAuth Server
OAUTH_SERVER_URL=https://vidabiz.butterfly-effect.dev

# Database
DATABASE_URL=mysql://username:password@localhost:3306/database_name

# Security
JWT_SECRET=your-secure-jwt-secret-change-in-production

# OpenAI API
OPENAI_API_URL=https://api.openai.com/v1
OPENAI_API_KEY=your-openai-api-key

# Infrastructure
PORT=3000
```

### 4. Set up Database

Run the database migrations:

```bash
npm run db:push
```

This will:
1. Generate migration files
2. Apply migrations to your database
3. Create the necessary tables (users, valuations, marketData)

### 5. Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
```

This creates optimized production builds:
- Frontend: `dist/` directory (static files)
- Backend: `dist/` directory (Node.js bundle)

### Start Production Server

```bash
npm start
```

## 🔧 Configuration

### Database Schema

The application uses three main tables:

1. **users**: User authentication and profiles
2. **valuations**: Property valuation records
3. **marketData**: Cached market data for faster valuations

### API Endpoints

The tRPC API provides the following routers:

- `auth.*`: Authentication endpoints (login, logout, me)
- `valuation.create`: Create new valuation
- `valuation.list`: Get user's valuations
- `valuation.get`: Get single valuation with details
- `valuation.generateReport`: Generate PDF report
- `admin.*`: Admin-only endpoints for market data management

## 🎨 UI Components

The application includes a comprehensive UI component library:

- Forms: Input, Select, Textarea, Checkbox, Radio, Switch
- Layout: Card, Dialog, Sheet, Tabs, Accordion
- Navigation: Breadcrumb, Pagination, Navigation Menu
- Feedback: Alert, Toast (Sonner), Progress
- Data Display: Table, Badge, Avatar, Tooltip
- And many more...

## 🗺️ Riyadh Districts

The application includes comprehensive coverage of Riyadh districts organized by region:

- **North**: Al Olaya, Al Narjis, Al Malka, Al Qirwan, Al Yasmin, Al Sahafa, and more
- **East**: Al Ramal, Al Munsiyah, Qurtubah, Al Yarmouk, and more
- **West**: Dhahrat Namar, Tuwaiq, Irqah, Al Badi'ah, and more
- **South**: Al Aziziyah, Al Dar Al Baida, Badr, Al Hazm, and more
- **Central**: Al Malaz, Al Sulimaniyah, Al Margab, and more

## 🧪 Testing

Run type checking:

```bash
npm run check
```

Run tests:

```bash
npm test
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run db:push` - Run database migrations

## 🌍 Internationalization

The application supports both English and Arabic:

- English (en): Left-to-right layout
- Arabic (ar): Right-to-left layout with proper Arabic typography

Language can be switched using the toggle button in the navigation bar.

## 🔐 Authentication

The application uses an OAuth-based authentication system:

1. Users click "Login" and are redirected to the OAuth portal
2. After authentication, they're redirected back with credentials
3. Session is maintained using secure HTTP-only cookies
4. JWT tokens are used for API authentication

## 📊 Valuation Process

The AI-powered valuation process includes:

1. **Data Collection**: Gather property details from user input
2. **Market Data Crawling**: AI searches the internet for comparable properties
3. **AI Analysis**: Advanced algorithms analyze data and calculate adjustments
4. **Confidence Scoring**: Generate confidence score based on data quality
5. **Report Generation**: Create comprehensive PDF report with findings

## 🤖 AI Features

The application uses OpenAI's GPT models for:

- Real-time market data analysis
- Comparable property identification
- Price adjustment calculations
- Market trend analysis
- Detailed valuation explanations

## 📈 Performance Optimizations

- React Query for efficient data caching
- Code splitting and lazy loading
- Optimized image loading
- Debounced search inputs
- Memoized expensive calculations

## 🛠️ Tech Stack Details

### Frontend Stack
- **React 19**: Latest React with concurrent features
- **TypeScript 5.9**: Type-safe development
- **Vite 7**: Lightning-fast dev server and build tool
- **TailwindCSS 4**: Utility-first CSS framework
- **tRPC 11**: End-to-end type safety
- **React Query 5**: Powerful data fetching
- **Wouter 3**: Minimalist routing
- **Framer Motion 12**: Smooth animations
- **Leaflet 1.9**: Interactive maps
- **Radix UI**: Accessible components

### Backend Stack
- **Express 4**: Web framework
- **TypeScript**: Type-safe backend
- **tRPC 11**: Type-safe API
- **Drizzle ORM**: Type-safe database queries
- **MySQL 2**: Database
- **PDFKit**: PDF generation
- **AWS SDK**: S3 storage
- **OpenAI API**: AI features

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue in the GitHub repository.

## 🎯 Roadmap

- [ ] Mobile app development
- [ ] Additional property types support
- [ ] Historical price trends visualization
- [ ] Neighborhood analysis features
- [ ] Mortgage calculator integration
- [ ] Property comparison tool
- [ ] Investment ROI calculator
- [ ] Market alerts and notifications

## 🌟 Acknowledgments

- OpenAI for GPT API
- Aqar.fm, Ejar.sa, Haraj.com.sa for market data
- OpenStreetMap for map tiles
- The open-source community

---

**Made with ❤️ for the Riyadh real estate market**
