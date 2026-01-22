# Development Guide - Cap Kèo Sport

> Hướng phát triển dự án Zalo Mini App

## 📋 Prerequisites

### Required Software

| Software | Version | Description |
|----------|---------|-------------|
| **Node.js** | 18+ | JavaScript runtime |
| **npm** hoặc **yarn** | Latest | Package manager |
| **Git** | Latest | Version control |

### Zalo Account

- **Zalo Developer Account**: Đăng ký tại [developers.zalo.me](https://developers.zalo.me/)
- **Mini App ID**: Lấy sau khi tạo Mini App trên Zalo Platform
- **Zalo App**: Để test Mini App trên mobile

## 🚀 Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd capkeosport.zalo-mini-app
```

### 2. Install Dependencies

```bash
npm install
# hoặc
yarn install
```

### 3. Environment Setup

Tạo file `.env` trong root directory:

```bash
# Copy từ .env.example nếu có
cp .env.example .env
```

Hoặc tạo mới với nội dung:

```bash
# Zalo Mini App Configuration
VITE_ZALO_APP_ID=your_zalo_app_id_here
VITE_API_BASE_URL=https://api.capkeosport.com/api/v1
VITE_CLIENT_SECRET=your_client_secret_here
VITE_SIGNATURE_TIMEOUT=300000
```

**Lấy Zalo App ID:**
1. Đăng nhập tại [developers.zalo.me](https://developers.zalo.me/)
2. Tạo mới Mini App
3. Copy App ID từ dashboard

## 🏃 Running Development Server

### Start Dev Server

```bash
npm run dev
# hoặc
zmp start
```

Server sẽ chạy tại:
- **Local**: `http://localhost:5173`
- **Network**: `http://192.168.x.x:5173` (cho mobile testing)

### Testing on Zalo App

1. Mở Zalo app trên điện thoại
2. Vào **Tìm kiếm** → Nhấn vào **Quét mã QR**
3. Quét mã QR hiển thị trong terminal
4. Mini App sẽ mở trong Zalo

### Development Mode Features

**Mock Authentication:**

Trong development mode, Zalo auth có thể được bypass:

**File:** [src/services/zalo-three-step-auth.ts:63](../src/services/zalo-three-step-auth.ts#L63)

```typescript
// DEV MODE: Set to true to bypass Zalo authentication
const BYPASS_ZALO_AUTH = true;
```

Khi `BYPASS_ZALO_AUTH = true`:
- Tự động login với mock user
- Mock tokens được tạo
- Không cần Zalo SDK

## 🏗️ Building for Production

### Build Command

```bash
npm run build
# hoặc
zmp build
```

Build output sẽ nằm trong thư mục `www/`.

### Build Configuration

**File:** [vite.config.ts](../vite.config.ts)

```typescript
export default defineConfig({
  plugins: [
    react(),
    zmpVitePlugin(),
  ],
  build: {
    outDir: 'www',
    sourcemap: true,
  },
});
```

## 📦 Deployment

### 1. Login to Zalo

```bash
npm run login
# hoặc
zmp login
```

### 2. Deploy to Zalo

```bash
npm run deploy
# hoặc
zmp deploy
```

### 3. Verify Deployment

1. Mở Zalo app
2. Tìm Mini App theo tên
3. Test các tính năng chính

## 🛠️ Development Tips

### 1. Hot Module Replacement (HMR)

Vite hỗ trợ HMR, changes sẽ tự động reload:

```typescript
// File change → Auto refresh
// State preserved during HMR
```

### 2. TypeScript Path Aliases

**File:** [tsconfig.json](../tsconfig.json)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Usage:
```typescript
import { useAuthStore } from '@/stores/auth.store';
import { api } from '@/services/api';
```

### 3. Environment Variables

Access trong code:

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const appId = import.meta.env.VITE_ZALO_APP_ID;
```

**Note:** Chỉ variables bắt đầu với `VITE_` mới accessible trong client code.

### 4. Debugging

#### Console Logging

```typescript
console.log('Debug info:', data);
console.error('Error:', error);
```

#### React DevTools

Cài đặt React DevTools extension cho browser.

#### Network Debugging

```typescript
// Trong src/services/api/index.ts
if (import.meta.env.DEV) {
  console.log('🚀 API Request:', config);
  console.log('✅ API Response:', response);
  console.error('❌ API Error:', error);
}
```

### 5. State Management Debugging

Zustand DevTools có thể được thêm:

```typescript
import { devtools } from 'zustand/middleware';

export const useMyStore = create<MyState>()(
  devtools(
    persist(
      (set, get) => ({ /* store */ }),
      { name: 'my-storage' }
    ),
    { name: 'MyStore' }
  )
);
```

### 6. Testing Different Screens

Direct routing với URL hash:

```
#launching   → Launching screen
#login       → Login screen
#dashboard   → Dashboard
#teams       → Teams list
#match/schedule → Match schedule
```

### 7. Mock API Responses

Để test không cần backend:

```typescript
// Trong store
fetchMyTeams: async () => {
  if (import.meta.env.DEV && USE_MOCK) {
    set({
      myTeams: mockTeams,
      isLoading: false
    });
    return;
  }

  // Real API call
  const response = await api.get('/teams/my-teams');
  // ...
}
```

## 🐛 Common Issues & Solutions

### Issue 1: Zalo SDK Not Available

**Lỗi:** `Cannot read property 'getAccessToken' of undefined`

**Giải pháp:**
```typescript
// Kiểm tra trước khi gọi
if (typeof zmp !== 'undefined' && zmp.getAccessToken) {
  zmp.getAccessToken({...});
} else {
  console.warn('Zalo SDK not available');
}
```

### Issue 2: CORS Error

**Lỗi:** API request bị block bởi CORS

**Giải pháp:**
- Backend phải có CORS header cho Zalo domains
- Hoặc sử dụng proxy trong development

### Issue 3: Build Failed

**Lỗi:** Build error khi chạy `zmp build`

**Giải pháp:**
```bash
# Clean build cache
rm -rf node_modules www
npm install
npm run build
```

### Issue 4: Token Refresh Loop

**Lỗi:** Vòng lặp refresh token vô hạn

**Giải pháp:**
```typescript
// Kiểm tra isRefreshing flag
if (isRefreshing) {
  // Add to queue instead of immediately refresh
  return new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  });
}
```

### Issue 5: State Not Persisting

**Lỗi:** Zustand state bị mất khi reload

**Giải pháp:**
```typescript
// Kiểm tra persist configuration
persist(
  (set, get) => ({ /* store */ }),
  {
    name: 'storage-key',
    partialize: (state) => ({
      // Fields cần persist
    }),
  }
)
```

## 📱 Testing on Real Device

### 1. Connect Device to Same Network

```
Computer: 192.168.1.100
Phone: 192.168.1.x
```

### 2. Start Dev Server with Network Access

```bash
npm run dev -- --host
```

### 3. Access via Network URL

```
http://192.168.1.100:5173
```

### 4. Scan QR Code on Zalo

Zalo CLI sẽ tự động generate QR code để scan.

## 📝 Coding Standards

### 1. File Naming

- **Components**: PascalCase - `UserProfile.tsx`
- **Hooks**: camelCase với prefix `use` - `useUserData.ts`
- **Services**: camelCase - `auth.service.ts`
- **Stores**: camelCase với suffix `.store` - `auth.store.ts`
- **Types**:camelCase - `api.types.ts`

### 2. Code Organization

```typescript
// 1. Imports
import { useState } from 'react';
import { api } from '@/services/api';

// 2. Types
interface MyProps {
  // ...
}

// 3. Component
function MyComponent({ prop1, prop2 }: MyProps) {
  // 3.1 Hooks
  const [state, setState] = useState();

  // 3.2 Effects
  useEffect(() => {
    // ...
  }, []);

  // 3.3 Handlers
  const handleClick = () => {
    // ...
  };

  // 3.4 Render
  return (
    <div>...</div>
  );
}

// 4. Export
export default MyComponent;
```

### 3. Store Pattern

```typescript
// 1. Interface
interface MyState {
  data: any[];
  // ...
}

// 2. Create store
export const useMyStore = create<MyState>()(
  persist(
    (set, get) => ({
      // Initial state
      data: [],

      // Actions
      setData: (data) => set({ data }),

      // API methods
      fetchData: async () => {
        // ...
      },
    }),
    {
      name: 'my-storage',
      partialize: (state) => ({ data: state.data }),
    }
  )
);

// 3. Selectors
export const useData = () => useMyStore((state) => state.data);
export const useActions = () => {
  const store = useMyStore();
  return {
    setData: store.setData,
    fetchData: store.fetchData,
  };
};

// 4. Default export
export default useMyStore;
```

## 🔧 Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run deploy       # Deploy to Zalo

# Code Quality
npm run lint         # Run ESLint

# Dependencies
npm install          # Install dependencies
npm install <pkg>    # Add new dependency
npm uninstall <pkg>  # Remove dependency
```

## 📚 Resources

### Zalo Mini App Docs
- [Official Documentation](https://developers.zalo.me/docs/mini-app/introduction/)
- [ZMP SDK Reference](https://developers.zalo.me/docs/mini-app/zmp-sdk/overview/)
- [App Guidelines](https://developers.zalo.me/docs/mini-app/important-guidelines/)

### Tech Stack Docs
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Vite](https://vitejs.dev/guide/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Project Documentation
- [Project Requirements](./PROJECT_REQUIREMENTS.md)
- [Zalo Mini App Skills](./ZALO_MINI_APP_SKILLS.md)
- [Source Structure](./SOURCE_STRUCTURE.md)
- [Zustand Stores](./ZUSTAND_STORES.md)
- [API Reference](./API_REFERENCE.md)
