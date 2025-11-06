# EcoMetrics - Integrated Carbon Emissions Management Platform

EcoMetrics empowers businesses to track and reduce their carbon footprint with intelligent analytics, automated reporting, and comprehensive emission tracking. Now featuring integrated CarbonCalc functionality for detailed emissions calculations and management.

A modern, responsive web application built with Next.js 15, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion, and Supabase.

## 🚀 Features

### CarbonCalc Integration (New!)

- **Unified Dashboard** - Comprehensive emissions overview with interactive tabs
- **Electricity Tracking** - Grid electricity, backup generators, and consumption analysis
- **Stationary Fuel Management** - Fixed fuel sources, generators, and combustion tracking
- **Mobile Fuel Analytics** - Vehicle fleet, transportation, and mobile equipment emissions
- **Fugitive Gas Monitoring** - Methane, CO2, and other gas emission tracking
- **Process Emissions** - Industrial processes and manufacturing emissions
- **Waste Water Management** - Water treatment and waste processing emissions
- **Renewable Energy** - Solar, wind, and hydro energy tracking
- **Data Input & Calculations** - Comprehensive forms with real-time calculations
- **Emissions Reports** - Detailed reporting and data export
- **Settings & Configuration** - Customizable emission factors and preferences

### EcoMetrics Advanced Features

- **Real-Time Carbon Tracking** - Live monitoring and alerts
- **Automated Reports** - Scheduled reporting with custom recipients
- **Custom Dashboards** - Personalized analytics and visualizations
- **Emission Source Breakdown** - Detailed analysis by source type
- **Cloud Integration** - Connect with existing business systems
- **Team Collaboration** - Multi-user access and sharing capabilities
- **Compliance Reporting** - Regulatory compliance and audit trails
- **Executive Summaries** - High-level reporting for leadership

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v3)
- **UI Components**: Shadcn UI
- **Animations**: Framer Motion
- **Charts**: Recharts for data visualization
- **Backend**: Supabase
- **Icons**: Lucide React & Material UI Icons
- **State Management**: React Context API

## 📋 Available Pages

### CarbonCalc Features

- **Dashboard** (`/dashboard`) - Main emissions dashboard with comprehensive overview
- **Electricity** (`/electricity`) - Electricity consumption and emissions tracking
- **Stationary Fuel** (`/stationary-fuel`) - Fixed fuel sources and emissions
- **Mobile Fuel** (`/mobile-fuel`) - Vehicle fleet and transportation emissions
- **Fugitive Gas** (`/fugitive-gas`) - Gas leak and fugitive emissions
- **Process** (`/process`) - Industrial process emissions
- **Waste Water** (`/waste-water`) - Water treatment emissions
- **Renewable Electricity** (`/renewable-electricity`) - Renewable energy tracking
- **Emissions** (`/emissions`) - Centralized emissions management
- **Input** (`/input`) - Data entry and calculations
- **Reports** (`/reports`) - Report generation and viewing
- **Settings** (`/settings`) - Configuration and preferences
- **Help** (`/help`) - User guidance and documentation

### EcoMetrics Features

- **Real-Time Carbon Tracking** (`/real-time-carbon-tracking`) - Live monitoring
- **Automated Reports** (`/automated-reports`) - Scheduled reporting
- **Custom Dashboards** (`/custom-dashboards`) - Personalized analytics
- **Emission Source Breakdown** (`/emission-source-breakdown`) - Detailed analysis
- **Cloud Integration** (`/cloud-integration`) - System connectivity
- **Team Collaboration** (`/team-collaboration`) - Multi-user features
- **Compliance Report** (`/custom-dashboards/compliance-report`) - Regulatory compliance
- **Executive Summary** (`/custom-dashboards/executive-summary`) - Leadership reporting
- **Operations Dashboard** (`/custom-dashboards/operations-dashboard`) - Operational metrics
- **Sustainability Scorecard** (`/custom-dashboards/sustainability-scorecard`) - KPI tracking

## 🎨 Design System

- **Primary Colors**: Green and Emerald gradients for environmental theme
- **Typography**: Inter font family for modern readability
- **Components**: Consistent design with rounded corners and shadows
- **Animations**: Smooth fade-ins, hover effects, and scroll-triggered animations
- **Responsive**: Mobile-first with tablet and desktop breakpoints
- **Accessibility**: WCAG compliant with proper contrast and focus states

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for backend features)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ecometrics
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Responsive Design

- **Mobile**: Optimized for phones and small screens
- **Tablet**: Medium screens with adjusted layouts
- **Desktop**: Full experience with larger screens
- **TV/Large**: Maximum width container for very large screens

## 🎭 Animations

- **Hero Animation**: Staggered text animations with floating elements
- **Scroll Animations**: Elements animate in when they come into view
- **Hover Effects**: Interactive buttons, cards, and navigation elements
- **Page Transitions**: Smooth navigation between different sections
- **Data Visualizations**: Animated charts and graphs

## 🔐 Authentication

The application includes comprehensive authentication with Supabase:

- **Sign-up Modal**: Accessible from "Get Started" and "Sign up free" buttons
- **Login System**: User authentication and session management
- **API Routes**: `/api/signup` handles user registration
- **Form Validation**: Client-side and server-side validation
- **Error Handling**: User-friendly error messages
- **Protected Routes**: Authenticated access to dashboard features

## 📁 Project Structure

```
ecometrics/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # EcoMetrics landing page
│   ├── globals.css              # Global styles and Tailwind
│   ├── dashboard/               # Integrated CarbonCalc dashboard
│   ├── electricity/             # Electricity tracking
│   ├── stationary-fuel/         # Stationary fuel emissions
│   ├── mobile-fuel/             # Mobile fuel emissions
│   ├── fugitive-gas/            # Fugitive gas tracking
│   ├── process/                 # Process emissions
│   ├── waste-water/             # Waste water emissions
│   ├── renewable-electricity/   # Renewable energy tracking
│   ├── emissions/               # Emissions management
│   ├── input/                   # Data input forms
│   ├── reports/                 # Report generation
│   ├── settings/                # Application settings
│   ├── help/                    # User documentation
│   ├── real-time-carbon-tracking/  # EcoMetrics real-time tracking
│   ├── automated-reports/       # EcoMetrics automated reports
│   ├── custom-dashboards/       # EcoMetrics custom dashboards
│   ├── emission-source-breakdown/  # EcoMetrics emission analysis
│   ├── cloud-integration/       # EcoMetrics cloud features
│   ├── team-collaboration/      # EcoMetrics team features
│   └── login/                   # Authentication
├── components/                   # React components
│   ├── ui/                      # Shadcn UI components
│   ├── nav.tsx                  # Unified navigation component
│   ├── signup-modal.tsx         # Sign-up modal
│   ├── recipients-management-dialog.tsx  # Report recipients
│   └── report-schedule-dialog.tsx        # Report scheduling
├── lib/                          # Utility libraries
│   ├── emissionsContext.tsx     # Emissions data context
│   ├── dummyData.ts             # Sample data for testing
│   ├── emissionFactors.json     # Emission calculation factors
│   ├── auth-context.tsx         # Authentication context
│   ├── crudService.ts          # CRUD API service
│   ├── reportGenerator.ts       # Report generation utilities
│   ├── chart-utils.ts           # Chart utilities
│   └── utils.ts                 # Helper functions
├── types/                        # TypeScript type definitions
│   └── emissions.ts             # Emissions-related types
├── INTEGRATION.md                # Integration documentation
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
└── lib/                          # Utility libraries and services
```

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize the color palette:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "hsl(var(--primary))",
      },
      // Add your custom colors
    }
  }
}
```

### Components

The application uses Shadcn UI for consistent components:

- **Cards**: For content sections and feature displays
- **Buttons**: Various styles and sizes
- **Dialogs**: For modals and popups
- **Inputs**: Form elements with validation
- **Tabs**: For dashboard navigation
- **Tables**: For data display

### Animations

Modify Framer Motion variants throughout the application:

```javascript
const fadeIn = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📈 Performance

- **Optimized Images**: Next.js Image optimization
- **Code Splitting**: Automatic code splitting with App Router
- **Tree Shaking**: Unused code elimination
- **CSS Optimization**: Tailwind CSS purging
- **Bundle Analysis**: Optimized for minimal bundle size
- **Static Generation**: Pre-built static pages for better performance

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🧪 Integration Testing

The application has been successfully tested for:

- ✅ Build compilation without errors
- ✅ All pages render correctly
- ✅ Navigation system functional
- ✅ Context and state management operational
- ✅ TypeScript type safety
- ✅ Responsive design across devices
- ✅ Authentication system
- ✅ Data visualization and charts

See [INTEGRATION.md](INTEGRATION.md) for detailed integration documentation.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Shadcn UI](https://ui.shadcn.com/) for beautiful components
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Recharts](https://recharts.org/) for data visualization
- [Lucide](https://lucide.dev/) for beautiful icons
- [Material UI](https://mui.com/) for additional icons
- [CRUD API](https://carbonreload.td0.co.za) for backend services
- [CarbonCalc](https://github.com) for emissions calculation logic
