# Development Setup Guide

## 🌊 Suni Platform Development Environment

This guide will help you set up your development environment for the Suni platform.

## 📋 Prerequisites

### Required Software
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher (comes with Node.js)
- **MongoDB**: v6.0 or higher
- **Git**: Latest version
- **VS Code** (recommended) or your preferred editor

### Optional but Recommended
- **Docker**: For containerized development
- **MongoDB Compass**: GUI for MongoDB
- **Postman**: API testing
- **GitHub CLI**: For easier GitHub operations

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/LouisLi1020/SUNi-Make-Your-Day-Shining.git
cd SUNi-Make-Your-Day-Shining
```

### 2. Install Dependencies
```bash
# Install all dependencies (root, client, server)
npm run install:all

# Or install individually
npm install                    # Root dependencies
cd client && npm install      # Frontend dependencies
cd ../server && npm install   # Backend dependencies
```

### 3. Environment Setup
```bash
# Copy environment files
cp server/env.example server/.env
cp client/.env.example client/.env

# Edit environment variables
# server/.env - Database, JWT, API keys
# client/.env - API endpoints, public keys
```

### 4. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:client    # Frontend on http://localhost:5176
npm run dev:server    # Backend on http://localhost:5000
```

## 🗄️ Database Setup

### MongoDB Local Installation
```bash
# Windows (using Chocolatey)
choco install mongodb

# macOS (using Homebrew)
brew install mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB service
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `server/.env`

### Database Initialization
```bash
# Connect to MongoDB
mongosh

# Create database
use suni-dev

# Create collections (optional - will be created automatically)
db.createCollection("users")
db.createCollection("products")
db.createCollection("orders")
```

## 🔧 Environment Variables

### Backend (.env)
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/suni-dev
MONGODB_TEST_URI=mongodb://localhost:27017/suni-test

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# CORS
CLIENT_URL=http://localhost:5176

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe (Payment)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@suni.com
```

### Frontend (.env)
```bash
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=10000

# Stripe (Public Key)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# Cloudinary (Public)
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# App Configuration
VITE_APP_NAME=Suni
VITE_APP_VERSION=1.0.0
```

## 🐳 Docker Development

### Using Docker Compose
```bash
# Start all services
docker-compose up --build

# Start in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Services
```bash
# Start only MongoDB
docker-compose up mongodb

# Start only Redis
docker-compose up redis

# Rebuild specific service
docker-compose up --build server
```

## 🛠️ Development Tools

### VS Code Extensions (Recommended)
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-json",
    "mongodb.mongodb-vscode",
    "ms-vscode.vscode-git-graph",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

## 🧪 Testing Setup

### Backend Testing
```bash
cd server

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Frontend Testing
```bash
cd client

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

## 📦 Package Management

### Adding Dependencies
```bash
# Backend dependencies
cd server
npm install package-name

# Frontend dependencies
cd client
npm install package-name

# Development dependencies
npm install -D package-name
```

### Updating Dependencies
```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Update specific package
npm install package-name@latest
```

## 🔍 Debugging

### Backend Debugging
```bash
# Start with debugger
cd server
npm run dev:debug

# VS Code debug configuration
{
  "type": "node",
  "request": "launch",
  "name": "Debug Server",
  "program": "${workspaceFolder}/server/src/index.ts",
  "runtimeArgs": ["-r", "ts-node/register"],
  "env": {
    "NODE_ENV": "development"
  }
}
```

### Frontend Debugging
```bash
# Start with debug mode
cd client
npm run dev

# Browser DevTools
# - React Developer Tools
# - Redux DevTools
# - Network tab for API calls
```

## 🚀 Build and Deployment

### Development Build
```bash
# Build both frontend and backend
npm run build

# Build individually
npm run build:client
npm run build:server
```

### Production Build
```bash
# Set production environment
export NODE_ENV=production

# Build for production
npm run build

# Start production server
npm start
```

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <process_id> /F

# Kill process (macOS/Linux)
kill -9 <process_id>
```

#### MongoDB Connection Issues
```bash
# Check MongoDB status
# Windows: net start MongoDB
# macOS: brew services list | grep mongodb
# Linux: sudo systemctl status mongod

# Check connection string
mongosh "mongodb://localhost:27017/suni-dev"
```

#### Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors
```bash
# Check TypeScript version
npx tsc --version

# Clear TypeScript cache
rm -rf node_modules/.cache
npm run build
```

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Learning Resources
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Patterns](https://reactpatterns.com/)
- [MongoDB University](https://university.mongodb.com/)

### Community
- [GitHub Issues](https://github.com/LouisLi1020/SUNi-Make-Your-Day-Shining/issues)
- [Discussions](https://github.com/LouisLi1020/SUNi-Make-Your-Day-Shining/discussions)

---

**Happy coding! 🌊** If you encounter any issues, please check the troubleshooting section or create an issue on GitHub.
