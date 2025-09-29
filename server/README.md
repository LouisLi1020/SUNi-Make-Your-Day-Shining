# Suni Server API

🌊 **Suni - Beach Lifestyle & Water Activities Platform Backend**

## 概述

Suni Server 是一個基於 Node.js、Express 和 MongoDB 的 RESTful API 服務器，專為海灘生活方式和水上活動平台設計。

## 技術棧

- **Runtime**: Node.js (>=18.0.0)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Language**: TypeScript
- **Validation**: Built-in validation with Mongoose
- **Security**: bcryptjs for password hashing, rate limiting

## 快速開始

### 環境要求

- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB (本地或雲端)

### 安裝與運行

1. **安裝依賴**
   ```bash
   npm install
   ```

2. **環境配置**
   ```bash
   cp env.example .env
   ```
   
   編輯 `.env` 文件：
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/suni-dev
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   JWT_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d
   CLIENT_URL=http://localhost:5176
   ```

3. **啟動服務器**
   ```bash
   # 開發模式
   npm run dev
   
   # 生產模式
   npm run build
   npm start
   ```

4. **健康檢查**
   ```bash
   curl http://localhost:5000/health
   ```

## API 端點

### 基礎端點

| 方法 | 端點 | 描述 |
|------|------|------|
| GET | `/` | API 基本信息 |
| GET | `/health` | 健康檢查 |

### 認證端點 (`/api/auth`)

| 方法 | 端點 | 描述 | 認證 |
|------|------|------|------|
| POST | `/register` | 用戶註冊 | ❌ |
| POST | `/login` | 用戶登入 | ❌ |
| POST | `/logout` | 用戶登出 | ✅ |
| GET | `/profile` | 獲取用戶資料 | ✅ |
| PUT | `/profile` | 更新用戶資料 | ✅ |
| PUT | `/change-password` | 修改密碼 | ✅ |
| POST | `/forgot-password` | 忘記密碼 | ❌ |
| POST | `/reset-password` | 重設密碼 | ❌ |
| POST | `/refresh-token` | 刷新令牌 | ❌ |

### 用戶管理端點 (`/api/users`)

| 方法 | 端點 | 描述 | 認證 | 權限 |
|------|------|------|------|------|
| GET | `/` | 獲取所有用戶 | ✅ | Admin |
| POST | `/` | 創建用戶 | ✅ | Admin |
| GET | `/:id` | 獲取特定用戶 | ✅ | 本人或 Admin |
| PUT | `/:id` | 更新用戶 | ✅ | 本人或 Admin |
| DELETE | `/:id` | 刪除用戶 | ✅ | Admin |
| PATCH | `/:id/status` | 切換用戶狀態 | ✅ | Admin |
| GET | `/search` | 搜索用戶 | ✅ | 所有用戶 |
| GET | `/stats` | 用戶統計 | ✅ | Admin |

## 請求/響應格式

### 標準響應格式

```json
{
  "success": true,
  "message": "操作成功",
  "data": {
    // 響應數據
  }
}
```

### 錯誤響應格式

```json
{
  "success": false,
  "message": "錯誤描述",
  "error": "詳細錯誤信息"
}
```

## 認證

API 使用 JWT (JSON Web Tokens) 進行認證。

### 獲取令牌

1. **註冊或登入** 獲取 `accessToken` 和 `refreshToken`
2. **在請求頭中包含令牌**：
   ```
   Authorization: Bearer <accessToken>
   ```

### 令牌刷新

當 `accessToken` 過期時，使用 `refreshToken` 獲取新的令牌：

```bash
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "your-refresh-token"}'
```

## 數據模型

### 用戶 (User)

```typescript
{
  _id: ObjectId,
  email: string,
  name: string,
  role: 'guest' | 'member' | 'admin' | 'staff',
  profile: {
    firstName?: string,
    lastName?: string,
    phone?: string,
    avatar?: string,
    dateOfBirth?: Date,
    gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say'
  },
  preferences: {
    language: string,
    currency: string,
    notifications: {
      email: boolean,
      sms: boolean,
      push: boolean
    },
    marketing: boolean
  },
  address?: {
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  },
  isActive: boolean,
  isEmailVerified: boolean,
  lastLoginAt?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 使用範例

### 1. 用戶註冊

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### 2. 用戶登入

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 3. 獲取用戶資料

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <access-token>"
```

### 4. 更新用戶資料

```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <access-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "profile": {
      "firstName": "John",
      "lastName": "Smith",
      "phone": "+1234567890"
    }
  }'
```

## 安全特性

- **密碼加密**: 使用 bcryptjs 進行密碼哈希
- **速率限制**: 防止暴力攻擊
- **帳戶鎖定**: 多次登入失敗後自動鎖定
- **JWT 令牌**: 安全的無狀態認證
- **CORS 配置**: 跨域請求控制
- **輸入驗證**: 完整的數據驗證

## 開發腳本

```bash
# 開發模式 (使用 nodemon)
npm run dev

# 構建項目
npm run build

# 啟動生產服務器
npm start

# 運行測試
npm test

# 代碼檢查
npm run lint

# 修復代碼格式
npm run lint:fix

# 數據庫種子
npm run seed

# 測試認證
npm run test:auth
```

## 數據庫

### 連接

服務器會自動連接到 MongoDB 並創建必要的索引。

### 種子數據

服務器啟動時會自動創建默認管理員用戶：
- Email: `admin@suni.com`
- Password: `admin123456`
- Role: `admin`

### 索引

自動創建的索引：
- `email` (唯一)
- `role`
- `isActive`
- `isEmailVerified`
- `createdAt`

## 錯誤處理

API 使用統一的錯誤處理中間件，返回標準化的錯誤響應。

### 常見錯誤碼

- `400` - 請求參數錯誤
- `401` - 未認證
- `403` - 權限不足
- `404` - 資源不存在
- `409` - 資源衝突
- `429` - 請求過於頻繁
- `500` - 服務器內部錯誤

## 監控與日誌

- 健康檢查端點: `/health`
- 數據庫連接狀態監控
- 自動重連機制
- 優雅關閉處理

## 部署

### 環境變量

確保設置以下環境變量：

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-mongodb-connection-string
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=https://your-frontend-domain.com
```

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 貢獻

1. Fork 項目
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

## 許可證

MIT License - 詳見 [LICENSE](LICENSE) 文件

## 支持

如有問題或建議，請開啟 [Issue](../../issues) 或聯繫開發團隊。

---

**Suni Team** 🌊