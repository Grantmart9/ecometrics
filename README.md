# EcoMetrics - Modern Landing Page

EcoMetrics empowers businesses to track and reduce their carbon footprint with intelligent analytics and automated reporting.

A modern, responsive landing page built with Next.js 13, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion, and Supabase.

## 🚀 Features

- **Modern Tech Stack**: Next.js 13 (App Router), TypeScript, Tailwind CSS
- **Beautiful UI Components**: Shadcn UI with customizable design system
- **Smooth Animations**: Framer Motion for engaging user interactions
- **Responsive Design**: Mobile-first approach with perfect desktop experience
- **Supabase Integration**: User authentication and backend services
- **Production Ready**: Optimized for performance and SEO

## 🛠️ Tech Stack

- **Framework**: Next.js 13 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Animations**: Framer Motion
- **Backend**: Supabase
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)

## 📋 Sections

1. **Hero Section**: Animated headline with gradient text and CTA buttons
2. **About Section**: Company mission with beautiful imagery
3. **Features Section**: 6 feature cards in responsive grid
4. **How It Works**: 3-step process with numbered indicators
5. **Testimonials**: Customer feedback with avatars
6. **CTA Section**: Final conversion opportunity
7. **Footer**: Complete site navigation and links

## 🎨 Design System

- **Primary Colors**: Green and Emerald gradients
- **Typography**: Inter font family
- **Components**: Consistent rounded corners (rounded-2xl)
- **Animations**: Smooth fade-ins and scroll-triggered animations
- **Responsive**: Mobile-first with tablet and desktop breakpoints

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for backend features)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd eco-metrics
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
- **Hover Effects**: Interactive buttons and cards
- **Page Transitions**: Smooth navigation experience

## 🔐 Authentication

The landing page includes a sign-up modal that integrates with Supabase Auth:

- **Sign-up Modal**: Accessible from "Get Started" and "Sign up free" buttons
- **API Route**: `/api/signup` handles user registration
- **Form Validation**: Client-side and server-side validation
- **Error Handling**: User-friendly error messages

## 📁 Project Structure

```
├── app/                    # Next.js 13 App Router
│   ├── api/               # API routes
│   │   └── signup/        # User registration
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── input.tsx
│   └── signup-modal.tsx   # Sign-up modal
├── lib/                   # Utility libraries
│   ├── supabaseClient.ts  # Supabase configuration
│   └── utils.ts           # Helper functions
└── public/                # Static assets
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

### Animations

Modify Framer Motion variants in `app/page.tsx`:

```javascript
const fadeIn = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};
```

### Content

Update the content in `app/page.tsx`:

- Hero headline and description
- Features array
- Testimonials array
- Company information

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

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

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
- [Lucide](https://lucide.dev/) for beautiful icons
- [Supabase](https://supabase.com/) for backend services
