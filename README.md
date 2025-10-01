# 🌟 Suni - Make Your Day Shining

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

A modern full-stack e-commerce platform for lifestyle products that bring joy to everyday life. Built with the MERN stack, featuring a beautiful Figma-designed interface and comprehensive shopping experience.

## ✨ Current Features

### 🛍️ E-commerce Core
- **Product Catalog**: Home & Living, Kitchen Essentials, Work & Productivity, Wellness & Self-Care, Garden & Outdoor
- **Advanced Filtering**: Category, brand, price range, and search functionality
- **Product Details**: Comprehensive product information with image galleries
- **Shopping Cart**: Full cart management with real-time updates (UI ready, API pending)

### 📦 Order Management
- **Guest Checkout**: Purchase without account creation
- **Member Checkout**: Faster checkout with saved addresses and payment methods
- **Order Tracking**: Real-time order status and tracking (UI ready, API pending)
- **Order History**: Complete purchase history for members (UI ready, API pending)

### 👥 User System
- **Multi-role Support**: Guest, Member, and Admin roles
- **Authentication**: JWT-based secure authentication (backend complete, frontend integration pending)
- **User Profiles**: Complete profile management with addresses and payment methods (UI ready)
- **Guest Order Lookup**: Track orders without account

### 🎨 Beautiful UI/UX
- **Figma-Designed Interface**: Professional, modern design system
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Delightful user interactions and transitions
- **Intuitive Navigation**: Easy-to-use interface with clear information architecture

### 🔧 Admin Dashboard
- **Product Management**: Add, edit, and manage product inventory
- **Order Processing**: View and manage customer orders
- **Analytics Overview**: Basic statistics and insights
- **Customer Management**: View customer information and orders

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Query** for server state management
- **Zustand** for client state management
- **React Router** for navigation
- **Axios** for API communication

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Stripe** for payment processing
- **Cloudinary** for image management
- **SendGrid** for email notifications

### Development Tools
- **Vite** for fast development and building
- **TypeScript** for type safety
- **ESLint** for code quality
- **Docker** for containerization
- **GitHub Actions** for CI/CD

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LouisLi1020/SUNi-Make-Your-Day-Shining.git
   cd SUNi-Make-Your-Day-Shining
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp server/env.example server/.env
   cp client/.env.example client/.env
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Docker Development

```bash
# Start all services with Docker Compose
docker-compose up --build

# Run in background
docker-compose up -d --build
```

## 📁 Project Structure

```
suni/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service functions
│   │   ├── store/         # State management
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   └── config/            # Configuration files
├── shared/                # Shared types and utilities
├── docs/                  # Documentation
│   ├── project-init-CN.md
│   ├── project-init-EN.md
│   ├── ROADMAP.md
│   └── TECH_STACK.md
└── docker-compose.yml     # Development environment
```

## 🎯 Development Status

### ✅ Completed
- [x] **Backend Core** (Weeks 1-4)
  - User authentication system with JWT
  - Product management system with CRUD operations
  - Shopping cart functionality (backend API)
  - Order management and processing
  - Payment integration with Stripe
  - Admin dashboard backend

- [x] **Frontend UI** (Phase 1.5)
  - Complete Figma design integration
  - All page components (Home, Products, Profile, Admin, Checkout, Orders)
  - Responsive design system with Tailwind CSS
  - Component library with shadcn/ui
  - Pages architecture migration

### 🚧 In Progress
- [ ] **API Integration** (Current Phase)
  - Connect frontend to backend APIs
  - Implement state management with Zustand
  - Add loading states and error handling
  - Replace mock data with real API calls

### 📋 Planned
- [ ] **MVP Completion**
  - Complete frontend-backend integration
  - End-to-end testing
  - Performance optimization
  - Deployment and hosting

- [ ] **Future Enhancements** (Post-MVP)
  - Water activity booking system
  - Multi-language support
  - Advanced features and optimizations

For detailed roadmap, see [docs/ROADMAP.md](docs/ROADMAP.md)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run frontend tests
npm run test:client

# Run backend tests
npm run test:server
```

## 📦 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
See `server/env.example` for required environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/LouisLi1020/SUNi-Make-Your-Day-Shining/issues)
- **Discussions**: [GitHub Discussions](https://github.com/LouisLi1020/SUNi-Make-Your-Day-Shining/discussions)

## 🙏 Acknowledgments

- Built with ❤️ to make everyday life shine brighter
- Figma designs for beautiful, modern UI
- shadcn/ui for excellent component library
- Special thanks to the open-source community

---

**Made with ✨ to bring joy to your everyday moments**
