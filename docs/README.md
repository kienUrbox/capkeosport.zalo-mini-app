# Cap Kèo Sport - Documentation

> Tài liệu dự án Zalo Mini App - Cap Kèo Sport

## 📚 Documentation Index

### Getting Started

| Document | Description |
|----------|-------------|
| **[Project Requirements](./PROJECT_REQUIREMENTS.md)** | Tổng quan về dự án, tính năng, tech stack |
| **[Development Guide](./DEVELOPMENT_GUIDE.md)** | Hướng dẫn setup môi trường, build, deploy |

### Technical Documentation

| Document | Description |
|----------|-------------|
| **[Zalo Mini App Skills](./ZALO_MINI_APP_SKILLS.md)** | Kỹ thuật Zalo Mini App, SDK, CLI, authentication |
| **[Source Structure](./SOURCE_STRUCTURE.md)** | Cấu trúc thư mục và file trong dự án |
| **[Zustand Stores](./ZUSTAND_STORES.md)** | State management với Zustand (12 stores) |
| **[API Reference](./API_REFERENCE.md)** | API endpoints và services |

## 🚀 Quick Start

### 1. Installation

```bash
# Clone repository
git clone <repository-url>
cd capkeosport.zalo-mini-app

# Install dependencies
npm install
```

### 2. Environment Setup

Tạo file `.env`:

```bash
VITE_ZALO_APP_ID=your_zalo_app_id
VITE_API_BASE_URL=https://api.capkeosport.com/api/v1
VITE_CLIENT_SECRET=your_client_secret
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

### 5. Deploy to Zalo

```bash
npm run deploy
```

## 📁 Project Overview

### Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 5 |
| **State Management** | Zustand 5 |
| **Styling** | Tailwind CSS + SCSS |
| **HTTP Client** | Axios |
| **Platform** | Zalo Mini App |

### Project Structure

```
capkeosport.zalo-mini-app/
├── src/
│   ├── app.ts                    # Entry point
│   ├── router.tsx                # Routing config
│   ├── components/               # UI components
│   ├── screens/                  # Screen components (pages)
│   ├── stores/                   # Zustand stores (12 files)
│   ├── services/                 # API services
│   ├── hooks/                    # Custom hooks
│   ├── contexts/                 # React contexts
│   ├── types/                    # TypeScript types
│   └── utils/                    # Utility functions
├── docs/                         # Documentation (this folder)
├── public/                       # Static assets
├── app-config.json               # Zalo Mini App config
├── vite.config.ts                # Vite config
└── package.json                  # Dependencies
```

### Key Features

| Feature | Description |
|---------|-------------|
| **Authentication** | Zalo 3-step OAuth with token refresh |
| **Team Management** | Create, edit teams, manage members |
| **Match Management** | Pending, upcoming, live, history matches |
| **Discovery** | Find nearby teams with filters |
| **Swipe** | Like/pass teams for matching |
| **Notifications** | In-app notifications system |
| **File Upload** | Avatar, logo, banner uploads |

## 🔑 Important Files

### Configuration

| File | Description |
|------|-------------|
| [app-config.json](../app-config.json) | Zalo Mini App configuration |
| [zmp-cli.json](../zmp-cli.json) | ZMP CLI configuration |
| [vite.config.ts](../vite.config.ts) | Vite build configuration |
| [tailwind.config.js](../tailwind.config.js) | Tailwind CSS config |
| [tsconfig.json](../tsconfig.json) | TypeScript config |

### Entry Points

| File | Description |
|------|-------------|
| [src/app.ts](../src/app.ts) | Application entry point |
| [src/router.tsx](../src/router.tsx) | React Router configuration |
| [index.html](../index.html) | HTML entry point |

### Core Services

| File | Description |
|------|-------------|
| [src/services/api/index.ts](../src/services/api/index.ts) | Axios client setup |
| [src/services/zalo-three-step-auth.ts](../src/services/zalo-three-step-auth.ts) | Zalo authentication |

### State Management

| File | Description |
|------|-------------|
| [src/stores/auth.store.ts](../src/stores/auth.store.ts) | Authentication state |
| [src/stores/match.store.ts](../src/stores/match.store.ts) | Match management |
| [src/stores/team.store.ts](../src/stores/team.store.ts) | Team management |
| [src/stores/ui.store.ts](../src/stores/ui.store.ts) | UI state |

## 📖 Common Tasks

### Add New Screen

1. Create screen file in `src/screens/`
2. Add route in [src/router.tsx](../src/router.tsx)
3. Add navigation link if needed

### Add New API Endpoint

1. Add method to service in `src/services/api/`
2. Add types to `src/types/api.types.ts`
3. Use in component or store

### Add New Store

1. Create store file in `src/stores/`
2. Follow existing store pattern
3. Export selectors and actions
4. Add persist middleware if needed

### Modify Zalo Config

Edit [app-config.json](../app-config.json):

```json
{
  "app": {
    "title": "Your App Title",
    "themeColor": "#11d473",
    "statusBar": "transparent",
    "actionBarHidden": true
  }
}
```

## 🐛 Debugging

### Enable DevTools

```typescript
// In store
import { devtools } from 'zustand/middleware';

devtools(/* store config */, { name: 'StoreName' })
```

### Console Logging

```typescript
// API calls already log in dev mode
// Check console for:
// - 🚀 API Request
// - ✅ API Response
// - ❌ API Error
```

## 📞 Support

### Zalo Mini App Resources

- [Zalo Developers](https://developers.zalo.me/)
- [Mini App Documentation](https://developers.zalo.me/docs/mini-app/introduction/)
- [ZMP SDK Reference](https://developers.zalo.me/docs/mini-app/zmp-sdk/overview/)

### Project Documentation

- See individual documentation files for detailed information
- Check inline code comments for implementation details
- Refer to [Source Structure](./SOURCE_STRUCTURE.md) for file organization

## 📝 Changelog

Documentation last updated: January 2026

For changes to the documentation, please update this section accordingly.
