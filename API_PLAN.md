# 📋 Kế Hoạch API - Cap Kéo Sport Zalo Mini App

> **Documentation**: Kế hoạch chi tiết API cho Cap Kéo Sport - Ứng dụng tìm kiếm và quản lý trận đấu bóng đá trên Zalo Platform
>
> **Created**: 28/11/2024
> **Project**: Cap Kéo Sport Zalo Mini App
> **Tech Stack**: React + TypeScript + Zalo SDK + Backend API

---

## 📊 Tổng Quan Dự Án

**Cap Kéo Sport** là ứng dụng Zalo Mini App về tìm kiếm và quản lý trận đấu bóng đá với các tính năng:

- ✅ Frontend hoàn chỉnh với React + TypeScript
- ✅ UI/UX design hoàn thiện với 30+ routes
- ✅ Mock data cho tất cả entities
- ✅ TypeScript types được định nghĩa rõ ràng
- 🔄 **Cần implement**: Backend API system

---

## 🔗 Danh Sách API Cần Thiết

### 1️⃣ Authentication APIs (3 endpoints)

| Method | Endpoint | Chức Năng | Priority |
|--------|----------|-----------|----------|
| `POST` | `/api/v1/auth/zalo/login` | Đăng nhập qua Zalo OAuth | 🔴 High |
| `POST` | `/api/v1/auth/refresh` | Làm mới access token | 🔴 High |
| `POST` | `/api/v1/auth/logout` | Đăng xuất, xóa token | 🟡 Medium |

**Request Example**:
```json
POST /api/v1/auth/zalo/login
{
  "zaloAccessToken": "abc123",
  "zaloUserId": "user_456"
}
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_456",
      "zaloUserId": "zalo_123",
      "name": "Nguyễn Văn A",
      "avatar": "https://...",
      "phone": "0901234567",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "tokens": {
      "accessToken": "jwt_token_abc",
      "refreshToken": "refresh_token_xyz",
      "expiresIn": 900
    }
  }
}
```

---

### 2️⃣ User Management APIs (2 endpoints)

| Method | Endpoint | Chức Năng | Priority |
|--------|----------|-----------|----------|
| `GET` | `/api/v1/users/me` | Lấy profile người dùng | 🔴 High |
| `PUT` | `/api/v1/users/me` | Cập nhật profile | 🟡 Medium |

**Request Example**:
```json
PUT /api/v1/users/me
{
  "name": "Nguyễn Văn A",
  "avatar": "https://avatar.jpg",
  "phone": "0901234567",
  "preferences": {
    "notifications": true,
    "location": {
      "lat": 10.7769,
      "lng": 106.7009,
      "radius": 10
    }
  }
}
```

---

### 3️⃣ Team Management APIs (6 endpoints)

| Method | Endpoint | Chức Năng | Priority |
|--------|----------|-----------|----------|
| `GET` | `/api/v1/teams` | Lấy danh sách đội của user | 🔴 High |
| `POST` | `/api/v1/teams` | Tạo đội bóng mới | 🔴 High |
| `GET` | `/api/v1/teams/{teamId}` | Chi tiết đội bóng | 🔴 High |
| `PUT` | `/api/v1/teams/{teamId}` | Cập nhật thông tin đội | 🟡 Medium |
| `POST` | `/api/v1/teams/{teamId}/members` | Thêm thành viên | 🟡 Medium |
| `DELETE` | `/api/v1/teams/{teamId}/members/{userId}` | Xóa thành viên | 🟡 Medium |

**Create Team Request**:
```json
POST /api/v1/teams
{
  "name": "Hùng Vương FC",
  "logo": "https://logo.png",
  "level": "Trung bình",
  "gender": "Nam",
  "location": "Quận 1, TP.HCM",
  "pitch": ["Sân 7", "Sân 11"],
  "stats": {
    "attack": 85,
    "defense": 78,
    "technique": 82
  }
}
```

**Team Response Example**:
```json
{
  "success": true,
  "data": {
    "teams": [
      {
        "id": "team_123",
        "name": "Hùng Vương FC",
        "logo": "https://logo.png",
        "level": "Trung bình",
        "gender": "Nam",
        "stats": {
          "attack": 85,
          "defense": 78,
          "technique": 82
        },
        "location": "Quận 1, TP.HCM",
        "pitch": ["Sân 7", "Sân 11"],
        "members": 15,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

---

### 4️⃣ Team Discovery APIs (2 endpoints)

| Method | Endpoint | Chức Năng | Priority |
|--------|----------|-----------|----------|
| `GET` | `/api/v1/teams/discover` | Tìm đội nearby để swipe | 🔴 High |
| `POST` | `/api/v1/swipe` | Ghi nhận swipe (like/pass) | 🔴 High |

**Discover Teams Query Parameters**:
```
GET /api/v1/teams/discover?
  lat=10.7769&
  lng=106.7009&
  radius=10&
  teamId=abc&
  level=intermediate&
  gender=Nam&
  limit=20
```

**Swipe Request**:
```json
POST /api/v1/swipe
{
  "teamAId": "team_123",
  "teamBId": "team_456",
  "action": "like|pass",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Swipe Response**:
```json
{
  "success": true,
  "data": {
    "isMatch": true,
    "matchId": "match_789"
  }
}
```

---

### 5️⃣ Match Management APIs (7 endpoints)

| Method | Endpoint | Chức Năng | Priority |
|--------|----------|-----------|----------|
| `GET` | `/api/v1/matches` | Lấy danh sách trận đấu | 🔴 High |
| `POST` | `/api/v1/matches` | Tạo trận mới (mutual like) | 🔴 High |
| `PUT` | `/api/v1/matches/{matchId}/status` | Cập nhật trạng thái | 🔴 High |
| `POST` | `/api/v1/matches/{matchId}/suggestions` | Đề xuất chi tiết trận | 🔴 High |
| `POST` | `/api/v1/matches/{matchId}/confirm` | Đồng ý đề xuất | 🟡 Medium |
| `POST` | `/api/v1/matches/{matchId}/result` | Nộp kết quả trận | 🟡 Medium |
| `GET` | `/api/v1/matches/{matchId}` | Chi tiết trận đấu | 🟡 Medium |

**Match Status Flow**:
```
MATCHED → PENDING → CAPPING → CONFIRMING → CONFIRMED → UPCOMING → FINISHED
```

**Get Matches Query**:
```
GET /api/v1/matches?
  teamId=abc&
  status=MATCHED&
  page=1&
  limit=20&
  sortBy=createdAt
```

**Match Suggestion Request**:
```json
POST /api/v1/matches/{matchId}/suggestions
{
  "suggestedBy": "teamA",
  "date": "2024-01-15",
  "time": "19:00",
  "location": "Sân THPT Thanh Đa",
  "notes": "Đội khách mang áo trắng"
}
```

---

### 6️⃣ Real-time Communication APIs (2 endpoints)

| Method | Endpoint | Chức Năng | Priority |
|--------|----------|-----------|----------|
| `GET` | `/api/v1/chats/zalo/{matchId}` | Lấy link Zalo chat | 🔴 High |
| `POST` | `/api/v1/notifications` | Gửi thông báo | 🟡 Medium |

**Zalo Chat Response**:
```json
{
  "success": true,
  "data": {
    "zaloChatLink": "https://chat.zalo.me/?id=abc",
    "groupId": "group_123",
    "participants": ["user_1", "user_2"]
  }
}
```

---

### 7️⃣ File Upload APIs (2 endpoints)

| Method | Endpoint | Chức Năng | Priority |
|--------|----------|-----------|----------|
| `POST` | `/api/v1/upload/image` | Upload ảnh đơn | 🟡 Medium |
| `POST` | `/api/v1/upload/images` | Upload nhiều ảnh | 🟡 Medium |

---

### 8️⃣ Analytics APIs (3 endpoints)

| Method | Endpoint | Chức Năng | Priority |
|--------|----------|-----------|----------|
| `GET` | `/api/v1/users/me/stats` | Thống kê người dùng | 🟢 Low |
| `GET` | `/api/v1/teams/{teamId}/stats` | Thống kê đội bóng | 🟢 Low |
| `GET` | `/api/v1/leaderboard` | Bảng xếp hạng | 🟢 Low |

---

## 🏗️ Kiến Trúc API

### Authentication Strategy
- **Primary**: Zalo OAuth 2.0 integration
- **JWT**: Access token (15min) + Refresh token (7days)
- **Rate Limiting**: 5 requests/minute cho auth endpoints

### Response Format Standard
```typescript
interface APIResponse<T> {
  success: boolean,
  data?: T,
  error?: {
    code: string,
    message: string,
    details?: any
  },
  meta?: {
    timestamp: string,
    requestId: string,
    version: string
  }
}
```

### HTTP Status Codes
| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful request |
| 201 | Created | Resource created |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflicts |
| 422 | Unprocessable | Business logic violations |
| 429 | Too Many Requests | Rate limiting |
| 500 | Internal Error | Server errors |

---

## 🔄 Real-time Features

### WebSocket Events
```typescript
// Match status updates
'match:status:changed' => {
  matchId: string,
  status: MatchStatus,
  updatedBy: string
}

// New match suggestions
'match:suggestion:created' => {
  matchId: string,
  suggestion: MatchSuggestion
}

// Unread count updates
'notifications:unread:updated' => {
  userId: string,
  counts: UnreadCounts
}

// New matches from swiping
'match:created' => {
  matchId: string,
  teamA: Team,
  teamB: Team
}
```

---

## ⚡ Performance Optimization

### Caching Strategy
| Resource | TTL | Description |
|----------|-----|-------------|
| Team Details | 1 hour | Team information |
| User Preferences | 30 mins | User settings |
| Match Lists | 5 mins | Match data |
| Leaderboard | 15 mins | Rankings |

### Pagination
- **Default**: 20 items per page
- **Maximum**: 100 items per page
- **Cursor-based**: For infinite scroll

---

## 🔒 Security Considerations

### Security Headers
```
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
```

### Rate Limiting
| Endpoint Type | Limit | Duration |
|----------------|-------|----------|
| Authentication | 5 requests | per minute |
| Team Discovery | 100 requests | per hour |
| Match Actions | 30 requests | per minute |
| General API | 1000 requests | per hour |

---

## 📂 Files Cần Tạo/Cập Nhật

### Infrastructure Files
```
src/
├── api/
│   ├── client.ts              # HTTP client với interceptors
│   ├── types.ts               # TypeScript interfaces cho API
│   └── helpers.ts             # API helper functions
├── services/
│   ├── authService.ts         # Authentication calls
│   ├── teamService.ts         # Team operations
│   ├── matchService.ts        # Match management
│   ├── uploadService.ts       # File uploads
│   ├── websocket.ts           # WebSocket management
│   └── notifications.ts        # Push notifications
└── store/
    ├── index.ts               # Global state với API
    ├── authSlice.ts           # Authentication state
    ├── teamSlice.ts           # Team management
    └── matchSlice.ts          # Match lifecycle
```

---

## 📅 Implementation Roadmap

### Phase 1 (Weeks 1-2): Foundation 🔴
- [ ] Authentication system với Zalo OAuth
- [ ] Basic CRUD operations cho teams
- [ ] API infrastructure và error handling
- [ ] Unit testing setup

### Phase 2 (Weeks 3-4): Core Features 🔴
- [ ] Team discovery và matching algorithm
- [ ] Match status management system
- [ ] Basic real-time notifications
- [ ] Pagination và filtering

### Phase 3 (Weeks 5-6): Advanced Features 🟡
- [ ] WebSocket real-time communication
- [ ] Zalo chat integration
- [ ] Advanced analytics và statistics
- [ ] Performance optimization

### Phase 4 (Weeks 7-8): Production Ready 🟢
- [ ] Comprehensive testing (unit, integration, e2e)
- [ ] Security audit và hardening
- [ ] Performance monitoring
- [ ] Documentation và deployment

---

## 📊 API Statistics Summary

| Category | Endpoints | Priority |
|----------|-----------|----------|
| Authentication | 3 | 🔴 High |
| User Management | 2 | 🔴 High |
| Team Management | 6 | 🔴 High |
| Team Discovery | 2 | 🔴 High |
| Match Management | 7 | 🔴 High |
| Real-time Communication | 2 | 🔴 High |
| File Upload | 2 | 🟡 Medium |
| Analytics | 3 | 🟢 Low |
| **TOTAL** | **27** | **-** |

---

## 🎯 Key Success Metrics

1. **Authentication**: 100% Zalo OAuth success rate
2. **Team Discovery**: < 500ms response time for nearby teams
3. **Matching**: < 1s match creation after mutual like
4. **Real-time**: < 100ms notification delivery
5. **Uptime**: 99.9% API availability
6. **Scalability**: Support 10,000+ concurrent users

---

## 📞 Support & Contact

- **Developer**: Claude AI Assistant
- **Project**: Cap Kéo Sport Zalo Mini App
- **Created**: 28/11/2024
- **Documentation**: Complete API specification

---

**📌 Note**: Kế hoạch này được tạo dựa trên phân tích codebase hiện tại và requirements của ứng dụng. Các endpoints được thiết kế để hỗ trợ đầy đủ functionality của Cap Kéo Sport với focus vào performance, security và scalability.

**🚀 Ready to implement!**