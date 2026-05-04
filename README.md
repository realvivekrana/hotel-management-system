# 🏨 Royal Stay Inn - Luxury Hotel Booking Platform

A premium, modern hotel booking platform built with React, TypeScript, and Vite. Features a sophisticated navy blue and gold design inspired by industry leaders like Airbnb and Booking.com.

![Royal Stay Inn](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Vite](https://img.shields.io/badge/Vite-7.3.2-purple)

---

## ✨ Features

### 🎨 **Premium Design**
- Modern, clean UI with navy blue and gold luxury theme
- Smooth animations and transitions
- Fully responsive (mobile, tablet, desktop)
- Dark mode support
- Professional typography (Fraunces serif + Inter sans-serif)

### 🏨 **Hotel Management**
- Browse luxury hotels and resorts worldwide
- Advanced search and filtering (location, dates, price, guests)
- Detailed property pages with photo galleries
- Room selection and availability checking
- Real-time booking system

### 👤 **User Features**
- User authentication (sign up, sign in, sign out)
- Personal booking management
- User profile display
- Booking history

### 🛠️ **Admin Dashboard**
- Hotel management (CRUD operations)
- Room management
- User management
- Booking oversight

### 🎯 **UX Enhancements**
- Hero section with search bar
- Featured properties showcase
- Guest testimonials section
- Value proposition highlights
- Intuitive navigation
- Loading states and error handling

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to frontend directory
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at **http://localhost:8080**

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

---

## 🔐 Demo Credentials

### User Account
```
Email: demo@royalstayinn.com
Password: demo123
```

### Admin Account
```
Email: admin@royalstayinn.com
Password: admin123
```

---

## 📁 Project Structure

```
Frontend/
├── public/
│   └── favicon.svg          # Custom Royal Stay Inn favicon
├── src/
│   ├── assets/              # Images and static files
│   ├── components/
│   │   ├── ui/              # Reusable UI components (shadcn/ui)
│   │   ├── site-header.tsx  # Navigation header
│   │   ├── site-footer.tsx  # Footer component
│   │   └── site-shell.tsx   # Layout wrapper
│   ├── hooks/               # Custom React hooks
│   ├── lib/
│   │   ├── api.ts           # API client functions
│   │   ├── auth-context.tsx # Authentication context
│   │   ├── seed.ts          # Demo data
│   │   ├── types.ts         # TypeScript types
│   │   └── utils.ts         # Utility functions
│   ├── routes/              # Page components (TanStack Router)
│   │   ├── __root.tsx       # Root layout
│   │   ├── index.tsx        # Homepage
│   │   ├── hotels.tsx       # Hotel listing
│   │   ├── hotels.$id.tsx   # Hotel detail
│   │   ├── login.tsx        # Sign in
│   │   ├── signup.tsx       # Registration
│   │   ├── bookings.tsx     # User bookings
│   │   └── admin/           # Admin pages
│   ├── styles.css           # Global styles & design system
│   └── router.tsx           # Router configuration
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Navy Blue (`#1e3a8a`)
- **Accent**: Gold/Amber (`#f59e0b`)
- **Background**: White with subtle blue tints
- **Text**: Dark navy for readability

See [COLOR_PALETTE.md](./COLOR_PALETTE.md) for complete color documentation.

### Typography
- **Headings**: Fraunces (serif) - Elegant and sophisticated
- **Body**: Inter (sans-serif) - Clean and readable

### Components
Built with **shadcn/ui** and **Radix UI** for:
- Accessibility
- Customizability
- Consistency
- Best practices

---

## 🛠️ Tech Stack

### Core
- **React 19.2** - UI library
- **TypeScript 5.8** - Type safety
- **Vite 7.3** - Build tool and dev server

### Routing & State
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Server state management
- **React Context** - Authentication state

### UI & Styling
- **Tailwind CSS 4.2** - Utility-first CSS
- **shadcn/ui** - Component library
- **Radix UI** - Accessible primitives
- **Lucide React** - Icon library

### Forms & Validation
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Additional
- **date-fns** - Date utilities
- **Sonner** - Toast notifications
- **Recharts** - Charts (admin dashboard)

---

## 📱 Responsive Breakpoints

```css
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
2xl: 1536px  /* Extra large */
```

---

## ♿ Accessibility

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Color contrast compliance (WCAG AA)
- Screen reader friendly

---

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Building
npm run build        # Production build
npm run build:dev    # Development build

# Preview
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format with Prettier
```

---

## 🌟 Key Features Breakdown

### Homepage
- ✅ Hero section with background image
- ✅ Search bar (location, dates, guests)
- ✅ Featured properties grid
- ✅ Guest testimonials
- ✅ Value propositions
- ✅ Professional footer

### Hotel Listing
- ✅ Advanced filters (city, price range, dates, guests)
- ✅ Hotel cards with images and ratings
- ✅ Hover effects and animations
- ✅ Empty states
- ✅ Loading states

### Hotel Detail
- ✅ Photo gallery with thumbnails
- ✅ Property information
- ✅ Amenities list
- ✅ Booking card with pricing
- ✅ Room selection

### Authentication
- ✅ Sign in / Sign up forms
- ✅ Form validation
- ✅ Error handling
- ✅ Demo credentials display
- ✅ Redirect after login

### Bookings
- ✅ User booking history
- ✅ Booking details
- ✅ Hotel information
- ✅ Date ranges
- ✅ Total pricing

---

## 🎯 Performance Optimizations

- ✅ Code splitting with Vite
- ✅ Lazy loading images
- ✅ Optimized bundle size
- ✅ Tree shaking
- ✅ CSS purging
- ✅ Fast refresh (HMR)

---

## 🚧 Future Enhancements

Potential features to add:
- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] Reviews and ratings system
- [ ] Wishlist/favorites
- [ ] Multi-language support
- [ ] Currency conversion
- [ ] Map integration
- [ ] Advanced analytics
- [ ] Social sharing
- [ ] Mobile app (React Native)

---

## 📄 License

This project is for portfolio and educational purposes.

---

## 👨‍💻 Development

### Code Style
- ESLint for linting
- Prettier for formatting
- TypeScript strict mode
- Consistent naming conventions

### Best Practices
- Component composition
- Custom hooks for logic reuse
- Type safety throughout
- Error boundaries
- Loading states
- Optimistic updates

---

## 📞 Support

For questions or issues:
1. Check the documentation
2. Review the code comments
3. Examine the transformation summary

---

## 🎓 Learning Resources

This project demonstrates:
- Modern React patterns
- TypeScript best practices
- Responsive design
- Component architecture
- State management
- Form handling
- Authentication flows
- Routing strategies
- UI/UX principles

---

## 🏆 Portfolio Ready

This project is suitable for:
- ✅ Portfolio showcases
- ✅ Job applications
- ✅ Client presentations
- ✅ Learning demonstrations
- ✅ Code reviews
- ✅ Technical interviews

---

**Built with ❤️ by a Vivek Rana**

**Status**: ✅ Production Ready | **Version**: 1.0.0 | **Last Updated**: April 2026
