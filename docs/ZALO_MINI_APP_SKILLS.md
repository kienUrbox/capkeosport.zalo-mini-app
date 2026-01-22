# Zalo Mini App Skills & Best Practices

> Tài liệu kỹ thuật về Zalo Mini App development

## 📱 Zalo Mini App Overview

Zalo Mini App là ứng dụng web nhẹ chạy trong nền tảng Zalo, tương tự như Mini App trên các nền tảng khác. Zalo cung cấp SDK (zmp-sdk) và CLI tools để phát triển Mini App dễ dàng.

### Đặc điểm
- Chạy trong Zalo app ( WebView có giới hạn)
- Có thể truy cập các API của Zalo (user info, phone number, share, etc.)
- Sử dụng framework web phổ biến (React, Vue, vanilla JS)
- Deploy lên Zalo Platform

## 🔧 ZMP CLI Commands

### Installation

```bash
npm install -g zmp-cli
```

### Common Commands

| Command | Description |
|---------|-------------|
| `zmp start` | Chạy development server |
| `zmp build` | Build cho production |
| `zmp login` | Login vào Zalo Developer |
| `zmp deploy` | Deploy Mini App lên Zalo |

### Scripts trong package.json

```json
{
  "scripts": {
    "dev": "zmp start",
    "build": "zmp build",
    "login": "zmp login",
    "deploy": "zmp deploy"
  }
}
```

## 📦 ZMP SDK

### Import SDK

```typescript
import zmp from "zmp-sdk";
```

### Core APIs

#### 1. getAccessToken - Lấy Access Token

```typescript
zmp.getAccessToken({
  success: (res) => {
    const token = res?.access_token || res?.accessToken || res;
    console.log('Access Token:', token);
  },
  fail: (err) => {
    console.error('Error:', err);
  }
});
```

**File:** [src/services/zalo-three-step-auth.ts:76-106](../src/services/zalo-three-step-auth.ts#L76-L106)

#### 2. getUserID - Lấy User ID

```typescript
zmp.getUserID({
  success: (res) => {
    const userId = res?.userID || res?.userId || res;
    console.log('User ID:', userId);
  },
  fail: (err) => {
    console.error('Error:', err);
  }
});
```

**File:** [src/services/zalo-three-step-auth.ts:110-140](../src/services/zalo-three-step-auth.ts#L110-L140)

#### 3. getPhoneNumber - Lấy Số Điện Thoại

```typescript
zmp.getPhoneNumber({
  success: (res) => {
    // Trả về token thay vì số điện thoại thực tế
    // Token này gửi lên backend để backend verify với Zalo server
    const token = res?.token;
    console.log('Phone Token:', token);
  },
  fail: (err) => {
    console.error('Error:', err);
  }
});
```

**File:** [src/services/zalo-three-step-auth.ts:144-174](../src/services/zalo-three-step-auth.ts#L144-L174)

## 🔐 Zalo 3-Step Authentication Flow

Đây là flow authentication chuẩn của Zalo Mini App:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ZALO 3-STEP AUTH FLOW                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. CLIENT SIDE (Mini App)                                          │
│     ┌─────────────────────────────────────────────────────────────┐ │
│     │  Step 1: getAccessToken()                                    │ │
│     │     ↓                                                        │ │
│     │  Step 2: getUserID()                                         │ │
│     │     ↓                                                        │ │
│     │  Step 3: getPhoneNumber() → token                            │ │
│     │     ↓                                                        │ │
│     │  Gửi {accessToken, userId, phoneToken} → Backend            │ │
│     └─────────────────────────────────────────────────────────────┘ │
│                              ↓                                       │
│  2. BACKEND (API)                                                   │
│     ┌─────────────────────────────────────────────────────────────┐ │
│     │  Verify phoneToken với Zalo Server                           │ │
│     │     ↓                                                        │ │
│     │  Tạo/Cập nhật User                                           │ │
│     │     ↓                                                        │ │
│     │  Generate JWT tokens (access + refresh)                      │ │
│     │     ↓                                                        │ │
│     │  Trả về {user, tokens} → Mini App                            │ │
│     └─────────────────────────────────────────────────────────────┘ │
│                              ↓                                       │
│  3. CLIENT SIDE (Mini App)                                          │
│     ┌─────────────────────────────────────────────────────────────┐ │
│     │  Lưu tokens vào Zustand store + localStorage                 │ │
│     │     ↓                                                        │ │
│     │  Redirect → Dashboard                                        │ │
│     └─────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Implementation

**File:** [src/services/zalo-three-step-auth.ts](../src/services/zalo-three-step-auth.ts)

```typescript
// Step 1: Get Zalo access token
private async getZaloAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    zmp.getAccessToken({
      success: (res: any) => {
        const token = res?.access_token || res?.accessToken || res;
        if (token) resolve(token);
        else reject(new Error("No access token"));
      },
      fail: (err: any) => {
        reject(new Error("Failed to get Zalo access token"));
      },
    });
  });
}

// Step 2: Get Zalo user ID
private async getZaloUserId(): Promise<string> {
  return new Promise((resolve, reject) => {
    zmp.getUserID({
      success: (res: any) => {
        const userId = res?.userID || res?.userId || res;
        if (userId) resolve(userId.toString());
        else reject(new Error("No user ID"));
      },
      fail: (err: any) => {
        reject(new Error("Failed to get Zalo user ID"));
      },
    });
  });
}

// Step 3: Get Zalo phone number token
private async getZaloPhoneNumber(): Promise<string> {
  return new Promise((resolve, reject) => {
    zmp.getPhoneNumber({
      success: (res: any) => {
        if (res?.token) {
          resolve(res.token);  // Token gửi lên backend verify
        } else {
          reject(new Error("No phone token"));
        }
      },
      fail: (err: any) => {
        reject(new Error("User denied phone number access"));
      },
    });
  });
}
```

### Silent Authentication

Khi user quay lại app, ta có thể làm "silent auth" nếu họ đã cấp quyền trước đó:

```typescript
async attemptSilentAuth(): Promise<ZaloThreeStepResponse> {
  // 1. Kiểm tra token còn hiệu lực không
  if (hasValidAuth()) {
    return { success: true, user: /* ... */ };
  }

  // 2. Cố gắng refresh token
  const tokenValid = await this.checkAndRefreshToken();
  if (!tokenValid) {
    return { success: false, error: "Token expired" };
  }

  // 3. Nếu user đã từng cấp quyền, thử auth lại
  if (this.hasPhonePermission()) {
    return await this.authenticateWithThreeSteps();
  }

  // 4. Cần user cấp quyền lại
  return { success: false, error: "Permission not granted" };
}
```

**File:** [src/services/zalo-three-step-auth.ts:251-358](../src/services/zalo-three-step-auth.ts#L251-L358)

## 📄 Configuration Files

### app-config.json

**File:** [app-config.json](../app-config.json)

```json
{
  "app": {
    "title": "Cap Kèo Sport",
    "textColor": {
      "light": "white",
      "dark": "white"
    },
    "statusBar": "transparent",
    "actionBarHidden": true,
    "hideIOSSafeAreaBottom": true,
    "hideAndroidBottomNavigationBar": false,
    "themeColor": "#11d473"
  },
  "listCSS": [],
  "listSyncJS": [],
  "listAsyncJS": []
}
```

**Các thuộc tính:**
- `title`: Tên hiển thị trên header Zalo
- `textColor`: Màu chữ header (light/dark mode)
- `statusBar`: Style của status bar (`transparent`, `default`)
- `actionBarHidden`: Ẩn/hiện action bar
- `hideIOSSafeAreaBottom`: Ẩn safe area bottom iOS
- `hideAndroidBottomNavigationBar`: Ẩn navigation bar Android
- `themeColor`: Màu chủ đạo

### zmp-cli.json

**File:** [zmp-cli.json](../zmp-cli.json)

```json
{
  "name": "capkeo-sport-mini-app",
  "framework": "react-typescript",
  "cssPreProcessor": "scss",
  "includeTailwind": true,
  "package": "zmp-ui",
  "stateManagement": "none",
  "theming": {
    "customColor": true,
    "color": "#7C5CFF",
    "darkTheme": true,
    "iconFonts": true,
    "fillBars": false,
    "useUiKits": true
  }
}
```

## 🌍 Environment Variables

**File:** [.env](../.env)

```bash
# Zalo Mini App ID
VITE_ZALO_APP_ID=1510444156496649483

# API Base URL
VITE_API_BASE_URL=https://api.capkeosport.com/api/v1

# Client Secret (for backend)
VITE_CLIENT_SECRET=...

# Signature Timeout
VITE_SIGNATURE_TIMEOUT=300000
```

**Sử dụng trong code:**
```typescript
const appId = import.meta.env.VITE_ZALO_APP_ID;
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## 🎯 Best Practices

### 1. Mock Development Mode

Khi phát triển local, có thể bypass Zalo auth:

**File:** [src/services/zalo-three-step-auth.ts:63](../src/services/zalo-three-step-auth.ts#L63)

```typescript
// DEV MODE: Set to true to bypass Zalo authentication
const BYPASS_ZALO_AUTH = true;

private mockAuthentication(): ZaloThreeStepResponse {
  return {
    success: true,
    data: {
      user: { /* mock user */ },
      tokens: { /* mock tokens */ }
    }
  };
}
```

### 2. Error Handling

Luôn handle error khi gọi Zalo SDK:

```typescript
zmp.getAccessToken({
  success: (res) => { /* success */ },
  fail: (err) => {
    console.error('Error:', err);
    // Show user-friendly message
    // Fallback to alternative auth method
  }
});
```

### 3. Permission Handling

Zalo yêu cầu user cấp quyền truy cập số điện thoại. Cần xử lý trường hợp user từ chối:

```typescript
private async getZaloPhoneNumber(): Promise<string> {
  return new Promise((resolve, reject) => {
    zmp.getPhoneNumber({
      success: (res) => {
        if (res?.token) resolve(res.token);
        else reject(new Error("No phone token"));
      },
      fail: (err) => {
        // User denied or other error
        reject(new Error("User denied phone number access"));
      },
    });
  });
}
```

### 4. Token Management

- Lưu token trong Zustand store với persist middleware
- Kiểm tra token expiry trước mỗi API call
- Tự động refresh token khi sắp hết hạn
- Clear token khi logout hoặc refresh fail

**File:** [src/stores/auth.store.ts](../src/stores/auth.store.ts)

### 5. TypeScript Support

Khai báo types cho Zalo SDK:

```typescript
declare global {
  interface Window {
    zmp: any;
  }
}
```

**File:** [src/services/zalo-three-step-auth.ts:8-12](../src/services/zalo-three-step-auth.ts#L8-L12)

## 🐛 Common Issues & Solutions

### Issue 1: Zalo SDK not available

**Lỗi:** `TypeError: Cannot read property 'getAccessToken' of undefined`

**Giải pháp:**
```typescript
if (typeof zmp === "undefined" || !zmp.getAccessToken) {
  console.warn("Zalo SDK not available");
  // Fallback or show error
}
```

### Issue 2: Token expired

**Lỗi:** API trả về 401 Unauthorized

**Giải pháp:**
```typescript
// Auto refresh token in axios interceptor
if (error.response?.status === 401) {
  const refreshed = await authStore.refreshTokens();
  if (refreshed) {
    // Retry original request
  }
}
```

### Issue 3: User denied phone permission

**Lỗi:** `getPhoneNumber` fail callback

**Giải pháp:**
- Hiển thị thông báo yêu cầu cấp quyền
- Cung cấp alternative auth method
- Lưu trạng thái permission để không hỏi lại

## 📚 Related Documentation

- [Zalo Mini App Official Docs](https://developers.zalo.me/docs/mini-app/introduction/)
- [Project Requirements](./PROJECT_REQUIREMENTS.md)
- [Development Guide](./DEVELOPMENT_GUIDE.md)
- [API Reference](./API_REFERENCE.md)
