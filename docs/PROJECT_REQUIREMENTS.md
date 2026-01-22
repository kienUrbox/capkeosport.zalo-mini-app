# Project Requirements - Cap Kèo Sport

> Zalo Mini App cho quản lý đội bóng và đặt đấu

## 📋 Thông tin dự án

| Tên | Cap Kèo Sport |
|-----|---------------|
| Loại ứng dụng | Zalo Mini App |
| Mô hình | Client-Server (Mini App + REST API) |
| Framework | React 18 + TypeScript + Vite |
| State Management | Zustand |
| UI Library | zmp-ui + Tailwind CSS |

## 🎯 Mô tả sản phẩm

**Cap Kèo Sport** là một Zalo Mini App giúp người dùng quản lý đội thể thao của mình và tìm đối thủ để đặt đấu. Ứng dụng tích hợp các tính năng:

- Quản lý đội bóng (tạo đội, quản lý thành viên)
- Tìm kiếm đối thủ dựa trên vị trí, trình độ
- Đặt đấu và quản lý lịch thi đấu
- Theo dõi lịch sử trận đấu
- Thông báo và mời tham gia

## 🚀 Tính năng chính

### 1. Authentication (Xác thực)

**Địa chỉ file:** [src/services/zalo-three-step-auth.ts](../src/services/zalo-three-step-auth.ts), [src/stores/auth.store.ts](../src/stores/auth.store.ts)

- **Zalo 3-Step OAuth**:
  - `getAccessToken()` - Lấy access token từ Zalo
  - `getUserID()` - Lấy ID người dùng Zalo
  - `getPhoneNumber()` - Lấy số điện thoại (yêu cầu quyền)
- **Silent Authentication**: Tự động đăng nhập lại khi token còn hiệu lực
- **Token Refresh**: Tự động refresh token khi hết hạn
- **Mock Mode**: Chế độ development bypass Zalo auth

### 2. Team Management (Quản lý đội)

**Địa chỉ file:** [src/stores/team.store.ts](../src/stores/team.store.ts), [src/services/api/team.service.ts](../src/services/api/team.service.ts)

- Tạo đội mới
- Chỉnh sửa thông tin đội (logo, banner, tên, mô tả)
- Quản lý thành viên:
  - Thêm thành viên
  - Xóa thành viên
  - Thay đổi vai trò (admin/member)
  - Thay đổi quyền admin
- Mời thành viên:
  - Mời qua link (invite token)
  - Mời qua số điện thoại
- Xem danh sách đội của mình
- Chuyển đổi giữa các đội

### 3. Match Management (Quản lý trận đấu)

**Địa chỉ file:** [src/stores/match.store.ts](../src/stores/match.store.ts), [src/services/api/match.service.ts](../src/services/api/match.service.ts)

**Các trạng thái trận đấu:**

| Trạng thái API | Trạng thái UI | Mô tả |
|----------------|---------------|-------|
| `MATCHED` | Chờ kèo | Hệ thống match được 2 đội |
| `REQUESTED` | Chờ kèo | Một đội đã gửi yêu cầu |
| `ACCEPTED` | Chờ kèo | Đã chấp nhận, chờ confirm |
| `CONFIRMED` | Lịch đấu | Đã xác nhận, chờ thi đấu |
| `FINISHED` | Lịch sử | Đã kết thúc |
| `CANCELLED` | Lịch sử | Đã hủy |

**Tabs trong Match Management:**
- **Chờ kèo** (Pending): `MATCHED`, `REQUESTED`, `ACCEPTED`
- **Lịch đấu** (Upcoming): `CONFIRMED` (tự động chuyển sang Live khi bắt đầu)
- **Lịch sử** (History): `FINISHED`, `CANCELLED`

**Actions:**
- Gửi yêu cầu đặt đấu
- Chấp nhận/Từ chối yêu cầu
- Xác nhận trận đấu (điền thông tin sân, thời gian)
- Cập nhật tỷ số
- Kết thúc trận đấu
- Hủy trận đấu
- Đặt lại (Rematch)

### 4. Discovery (Tìm kiếm đội)

**Địa chỉ file:** [src/stores/discovery.store.ts](../src/stores/discovery.store.ts), [src/services/api/discovery.service.ts](../src/services/api/discovery.service.ts)

- Tìm đội gần đây dựa trên:
  - Vị trí (lat/lng)
  - Bán kính tìm kiếm
  - Trình độ (level)
  - Giới tính
  - Loại bóng (sân 5, 7, 11)
- Swipe để thích/bỏ qua đội
- Xem đội đã matched
- Thống kê discovery

### 5. Swipe Feature

**Địa chỉ file:** [src/stores/swipe.store.ts](../src/stores/swipe.store.ts), [src/services/api/swipe.service.ts](../src/services/api/swipe.service.ts)

- Swipe qua trái để bỏ qua (PASS)
- Swipe qua phải để thích (LIKE)
- Xem lịch sử swipe
- Xem swipe nhận được
- Undo swipe
- Thống kê swipe

### 6. Notification (Thông báo)

**Địa chỉ file:** [src/stores/notification.store.ts](../src/stores/notification.store.ts), [src/services/api/notification.service.ts](../src/services/api/notification.service.ts)

- Danh sách thông báo
- Đánh dấu đã đọc
- Đánh dấu tất cả đã đọc
- Đếm số thông báo chưa đọc
- Thống kê thông báo

### 7. Profile Management (Hồ sơ cá nhân)

**Địa chỉ file:** [src/screens/profile/](../src/screens/profile/)

- Xem hồ sơ cá nhân
- Chỉnh sửa hồ sơ (tên, avatar, phone)
- Xem danh sách đội đã tham gia
- Xem thống kê cá nhân

### 8. File Upload (Upload file)

**Địa chỉ file:** [src/stores/file.store.ts](../src/stores/file.store.ts), [src/services/api/file.service.ts](../src/services/api/file.service.ts)

- Upload avatar người dùng
- Upload logo đội
- Upload banner đội
- Theo dõi tiến độ upload

### 9. Phone Invite (Mời qua SMS)

**Địa chỉ file:** [src/stores/phone-invite.store.ts](../src/stores/phone-invite.store.ts), [src/services/api/phone-invite.service.ts](../src/services/api/phone-invite.service.ts)

- Gửi lời mời qua số điện thoại
- Xem danh sách lời mời đã gửi
- Xem chi tiết lời mời
- Trả lời lời mời (chấp nhận/từ chối)
- Hủy lời mời
- Gửi lại lời mời

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI Framework
- **TypeScript 5.9.3** - Type safety
- **Vite 5.2.13** - Build tool
- **React Router DOM 7.9.6** - Routing
- **Zustand 5.0.8** - State management

### Zalo Specific
- **zmp-cli 4.0.1** - Zalo Mini App CLI
- **zmp-sdk** - Zalo SDK
- **zmp-ui** - Zalo UI components
- **zmp-vite-plugin** - Vite plugin

### Styling
- **Tailwind CSS 3.4.15** - Utility-first CSS
- **SCSS/SASS 1.80.4** - CSS preprocessor

### HTTP & Data
- **Axios 1.13.2** - HTTP client
- **@tanstack/react-query 5.90.11** - Server state

### Utilities
- **date-fns 4.1.0** - Date manipulation
- **react-qr-code 2.0.18** - QR code generation
- **clsx 2.1.1** - Class name utilities

## 📁 API Endpoint

Base URL: `https://api.capkeosport.com/api/v1`

Chi tiết các endpoints xem tại [API_REFERENCE.md](./API_REFERENCE.md)

## 🔐 Authentication Flow

```
1. User mở Mini App
2. Kiểm tra token trong localStorage (auth-store)
3. Nếu có token:
   - Kiểm tra token còn hiệu quả không
   - Nếu còn → Silent auth thành công
   - Nếu hết → Refresh token
4. Nếu không có token:
   - Thực hiện Zalo 3-step authentication
   - Lưu token và user info vào store
5. Điều hướng đến Dashboard
```

## 📱 Screens Structure

### Public Routes
- `/launching` - Màn hình chào/splash screen
- `/login` - Đăng nhập

### Protected Routes
- `/dashboard` - Trang chủ (Home tab)
- `/teams` - Quản lý đội (Teams tab)
- `/match/schedule` - Lịch đấu (Schedule tab)
- `/profile` - Hồ sơ cá nhân (Profile tab)

### Other Routes
- **Team**: `/teams/create`, `/teams/edit/:id`, `/teams/detail/:id`, `/teams/members/:id`, `/teams/share`
- **Match**: `/match/find`, `/match/detail/:id`, `/match/attendance/:id`, `/match/update-score/:id`, `/match/rematch/:id`, `/match/invite`, `/match/opponent/:id`, `/match/history`
- **Swipe**: `/swipe`, `/swipe/history`, `/swipe/received`, `/swipe/stats`
- **Other**: `/notifications`, `/inviting`, `/onboarding`

## 🎨 Design System

- **Primary Color**: `#11d473` (Green)
- **Dark Mode**: Supported
- **Font**: Zalo default font
- **Spacing**: Tailwind default spacing
- **Components**: zmp-ui + Custom components

## 🔧 Development Requirements

- Node.js 18+
- npm hoặc yarn
- Zalo Developer Account
- Zalo Mini App ID

## 📚 Related Documentation

- [Zalo Mini App Skills](./ZALO_MINI_APP_SKILLS.md) - Hướng dẫn kỹ thuật Zalo Mini App
- [Source Structure](./SOURCE_STRUCTURE.md) - Cấu trúc source code
- [Zustand Stores](./ZUSTAND_STORES.md) - State management với Zustand
- [API Reference](./API_REFERENCE.md) - API endpoints documentation
- [Development Guide](./DEVELOPMENT_GUIDE.md) - Hướng dẫn development
