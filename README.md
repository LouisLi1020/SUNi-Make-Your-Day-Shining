# 🌊 Suni - Beach Lifestyle & Water Activities Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

A modern full-stack e-commerce platform combining beach lifestyle product sales with water activity booking services. Built with the MERN stack and designed for scalability and user experience.

## ✨ Features

### 🛍️ E-commerce
- **Product Catalog**: Beach accessories, sunglasses, sunscreen, beachwear
- **Shopping Cart**: Seamless product browsing and purchasing
- **Order Management**: Complete order tracking and history
- **Inventory System**: Real-time stock management with low-stock alerts

### 🏄‍♀️ Water Activities
- **Activity Booking**: Diving, snorkeling, SUP, and more
- **Schedule Management**: Date/time selection with capacity limits
- **Guide Assignment**: Instructor management and availability
- **Mixed Cart**: Products and activities in unified shopping experience

### 👥 User Management
- **Multi-role Support**: Guest, member, staff, admin roles
- **Authentication**: JWT-based secure authentication
- **Profile Management**: Personal information and preferences
- **Order History**: Complete purchase and booking history

### 🌍 Internationalization
- **Multi-language**: Traditional Chinese, English (with expansion support)
- **Localized Experience**: Currency, date formats, cultural adaptation
- **Responsive Design**: Mobile-first approach with Tailwind CSS

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

## 🎯 Development Roadmap

### Phase 1: Core E-commerce (Weeks 1-4)
- [x] Project setup and architecture
- [ ] User authentication system
- [ ] Product catalog and management
- [ ] Shopping cart functionality
- [ ] Basic checkout process

### Phase 2: Water Activities (Weeks 5-8)
- [ ] Activity booking system
- [ ] Schedule management
- [ ] Guide assignment
- [ ] Mixed cart implementation

### Phase 3: Enhanced Features (Weeks 9-12)
- [ ] Multi-language support
- [ ] Advanced payment options
- [ ] Email notifications
- [ ] Customer service system

### Phase 4: Advanced Features (Weeks 13-16)
- [ ] Analytics and reporting
- [ ] Advanced user features
- [ ] API and integrations
- [ ] Security and compliance

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

- Built with ❤️ for beach lovers and water enthusiasts
- Inspired by the beauty of ocean and beach lifestyle
- Special thanks to the open-source community

---

**Made with 🌊 for the beach community**
