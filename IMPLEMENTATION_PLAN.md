# Plan Implementation - CapKeoSport Zalo Mini App

## 📋 Tổng Quan

Implement toàn bộ UI và navigation flow dựa trên:
- `FLOW_ANALYSIS_AND_PLAN.md` - Phân tích flow chi tiết
- `all_design_html_files/` - Các file HTML design tham khảo
- Tech stack: React, TypeScript, Tailwind CSS, Zalo Mini App SDK

---

## 🎯 Mục Tiêu

1. ✅ Implement tất cả màn hình theo design HTML
2. ✅ Setup navigation flow hoàn chỉnh
3. ✅ Tạo các component reusable
4. ✅ Cập nhật routing và bottom navigation
5. ✅ Implement Tab "Kèo" với 4 tabs con
6. ✅ Gắn navigation giữa các màn hình

---

## 📁 Cấu Trúc File Cần Tạo/Cập Nhật

### 1. Routing & Navigation

#### 1.1. Cập nhật `src/router.tsx`
- [ ] Thêm routes cho các màn hình mới
- [ ] Cập nhật route cho Tab "Kèo" (matches)
- [ ] Thêm routes cho các màn hình chi tiết

#### 1.2. Cập nhật `src/components/common/TabsLayout.tsx`
- [ ] Đổi label "Trận đấu" → "Kèo"
- [ ] Cập nhật path `/matches` → `/matches` (giữ nguyên nhưng đổi label)

#### 1.3. Cập nhật `src/components/common/BottomNav.tsx`
- [ ] Đổi icon và label cho tab "Kèo"
- [ ] Đảm bảo active state hoạt động đúng

---

### 2. Screens - Tab Kèo (Matches)

#### 2.1. Main Screen: `src/screens/matches/index.tsx` ⭐ **PRIORITY**
- [ ] Tạo TabsLayout với 4 tabs:
  1. **Đã Match** (`/matches/matched`)
  2. **Đang Cáp Kèo** (`/matches/capping`)
  3. **Đã Chốt Kèo** (`/matches/confirmed`)
  4. **Lịch Sắp Tới & Đã Kết Thúc** (`/matches/schedule`)
- [ ] Implement tab switching logic
- [ ] State management cho active tab
- [ ] Empty states cho mỗi tab
- [ ] Loading states

#### 2.2. Tab Screens (Sub-screens trong matches):

**2.2.1. `src/screens/matches/MatchedTab.tsx`**
- [ ] List các kèo đã match (từ Swipe Deck)
- [ ] Card design: Logo đội, tên đội, thời gian match
- [ ] Actions: Xem chi tiết, Gửi lời mời, Bỏ qua
- [ ] Navigation: Team Detail → Request Match
- [ ] Empty state: "Chưa có kèo nào đã match"

**2.2.2. `src/screens/matches/CappingTab.tsx`**
- [ ] List các kèo đang cáp kèo
- [ ] Badge trạng thái: Chờ phản hồi / Đang capping / Đang xác nhận
- [ ] Card design với status indicators
- [ ] Actions: Xem chi tiết, Vào Match Room, Xác nhận kèo, Hủy
- [ ] Empty state: "Chưa có kèo nào đang cáp"

**2.2.3. `src/screens/matches/ConfirmedTab.tsx`**
- [ ] List các kèo đã chốt
- [ ] Countdown timer (nếu sắp diễn ra)
- [ ] Badge "Đã chốt"
- [ ] Actions: Xem chi tiết, Chat Zalo, Cập nhật kết quả
- [ ] Empty state: "Chưa có kèo nào đã chốt"

**2.2.4. `src/screens/matches/ScheduleTab.tsx`**
- [ ] List trận sắp diễn ra và đã kết thúc
- [ ] Phân biệt bằng badge: "Sắp diễn ra" / "Đã kết thúc"
- [ ] Sắp diễn ra: Countdown, thông tin trận đấu
- [ ] Đã kết thúc: Tỷ số, kết quả, gallery preview
- [ ] Actions: Xem chi tiết, Chat Zalo, Request Rematch
- [ ] Empty state: "Chưa có lịch sắp tới"

---

### 3. Screens - Các Màn Hình Chi Tiết

#### 3.1. Team Detail (Đội Đối Thủ) - `src/screens/teamDetail/index.tsx`
- [ ] **CẬP NHẬT** - Thêm logic phân biệt đội của user vs đội đối thủ
- [ ] Header với banner và logo
- [ ] Thông tin đội: Tên, badges (gender, level)
- [ ] Chỉ số đội: Attack, Defense, Technique (ProgressBar)
- [ ] Thành viên (grid layout)
- [ ] Lịch sử đối đầu
- [ ] Action button: "Gửi lời mời" (nếu là đội đối thủ)
- [ ] Reference: `team detail (4.1).html`

#### 3.2. Request Match - `src/screens/requestMatch/index.tsx` ⭐ **NEW**
- [ ] Form tạo lời mời đấu
- [ ] Hiển thị 2 đội: Your Team vs Opponent Team
- [ ] Date picker: Ngày đá
- [ ] Time picker: Giờ đá
- [ ] Location input: Địa điểm
- [ ] Notes textarea: Ghi chú
- [ ] Preview section: Xem trước lời mời
- [ ] Actions: Hủy, Gửi lời mời
- [ ] Reference: `request match (4.2).html`

#### 3.3. Match Result Update - `src/screens/submitMatchResult/index.tsx`
- [ ] **CẬP NHẬT** - Đảm bảo UI match design
- [ ] Match info card: Tên 2 đội, thời gian, địa điểm
- [ ] Score input: 2 input fields cho tỷ số
- [ ] Image uploader: Upload ảnh minh chứng (tối đa 5)
- [ ] Notes textarea
- [ ] Action: Lưu kết quả
- [ ] Reference: `match result update (4.3).html`

#### 3.4. Match Room (Accept Request) - `src/screens/matchRoom/index.tsx`
- [ ] **CẬP NHẬT** - Đảm bảo UI match design
- [ ] Header: 2 đội với logo
- [ ] Status badge: "Đã nhận kèo – Đang capping"
- [ ] Timeline: Đã gửi → Đã nhận → Đang capping
- [ ] Chat preview card: "Trao đổi trước trận"
- [ ] Actions: Chốt kèo, Mở Zalo Chat, Hủy lời mời
- [ ] Reference: `accept request match (4.4).html`

#### 3.5. Request Rematch - `src/screens/rematchRequest/index.tsx`
- [ ] **CẬP NHẬT** - Đảm bảo UI match design
- [ ] Opponent display: Logo và tên đội đối thủ
- [ ] Team selector: Dropdown chọn đội của bạn
- [ ] Date & Time picker: Thời gian
- [ ] Pitch type selector: Sân 5, Sân 7, Sân 11
- [ ] Notes textarea
- [ ] Action: Gửi Rematch
- [ ] Reference: `request rematch (4.4).html`

#### 3.6. Match Detail (Upcoming) - `src/screens/matchDetail/index.tsx`
- [ ] **CẬP NHẬT** - Đảm bảo UI match design
- [ ] Hero section: 2 đội với logo
- [ ] Countdown timer: Ngày, Giờ, Phút, Giây
- [ ] Info card: Thời gian, địa điểm, link bản đồ
- [ ] Actions: Mở Zalo Chat, Chỉnh sửa, Cập nhật kết quả
- [ ] Player roster: Danh sách tham gia
- [ ] Event timeline: Lịch sử trận đấu
- [ ] Reference: `match detail (4.6).html`

#### 3.7. Incoming Requests - `src/screens/incomingRequests/index.tsx`
- [ ] **CẬP NHẬT** - Đảm bảo UI match design
- [ ] List các lời mời đến
- [ ] Card design: Logo đội, tên đội, message, thời gian, địa điểm
- [ ] Actions: Accept, Propose, Decline
- [ ] Empty state: "All Caught Up!"
- [ ] Reference: `incoming request (4.7).html`

#### 3.8. Confirm Match Info - `src/screens/confirmMatchInfo/index.tsx`
- [ ] **CẬP NHẬT** - Đảm bảo UI match design
- [ ] Match summary card: 2 đội
- [ ] Form fields:
  - Ngày chốt (date picker)
  - Giờ chốt (time picker)
  - Tên sân (input)
  - Địa chỉ (input + "Mở bản đồ" link)
  - Link bản đồ (input)
  - Ghi chú (textarea)
- [ ] Sticky CTA: "Chốt kèo"
- [ ] Reference: `create match form (4.8).html` / `confirm_match_info_(dark_mode)_/code.html`

#### 3.9. Finished Match Detail - `src/screens/finishedMatchDetail/index.tsx`
- [ ] **CẬP NHẬT** - Đảm bảo UI match design
- [ ] Header: 2 đội với logo và tỷ số
- [ ] Winner/Loser badges
- [ ] Match meta: Thời gian, địa điểm
- [ ] Actions: Request Rematch, Share
- [ ] Match Recap: Mô tả trận đấu
- [ ] Match Gallery: Horizontal scroll images
- [ ] Previous Encounters: Lịch sử đối đầu
- [ ] Reference: `finish match detail (4.9).html`

---

### 4. Screens - Swipe Deck Flow

#### 4.1. Team Select Modal - `src/screens/home/TeamSelectBottomSheet.tsx`
- [ ] **CẬP NHẬT** - Đảm bảo UI match design
- [ ] Bottom sheet với handle
- [ ] List các đội của user
- [ ] Selected state với checkmark
- [ ] Action: "Chọn đội này"
- [ ] Reference: `team seclect (2).html`

#### 4.2. Swipe Deck - `src/screens/swipeDeck/index.tsx`
- [ ] **CẬP NHẬT** - Đảm bảo UI match design
- [ ] Card stack với animation
- [ ] Top card: Full info
- [ ] Background cards: Scale down effect
- [ ] Team info: Logo, tên, badges, stats
- [ ] Action buttons: Reject (X), Like (Heart)
- [ ] Match animation modal (hidden by default)
- [ ] Reference: `swipe team (2.1).html`

#### 4.3. Swipe Matched - `src/screens/swipeMatched/index.tsx` ⭐ **NEW**
- [ ] Match animation modal overlay
- [ ] "It's a Match!" title với animation
- [ ] 2 team logos side by side
- [ ] Message: "You and [Team] have liked each other"
- [ ] Actions: Send a Message, Keep Swiping
- [ ] Reference: `swipe team matched (2.2).html`

---

### 5. Screens - My Teams Flow

#### 5.1. My Teams - `src/screens/myTeams/index.tsx`
- [ ] **CẬP NHẬT** - Đảm bảo UI match design
- [ ] List các đội của user
- [ ] Card: Logo, tên đội, role badge (Admin/Member), level, sân, khu vực
- [ ] Action: "Tạo đội mới"
- [ ] Empty state với illustration
- [ ] Reference: `my team tabs (3).html`

#### 5.2. Team Detail (My Team) - `src/screens/teamDetail/index.tsx`
- [ ] **CẬP NHẬT** - Logic phân biệt đội của user
- [ ] Banner carousel với dots indicator
- [ ] Team logo và info
- [ ] Quick stats: Location, Pitch, Matches played
- [ ] Tabs: Tổng quan, Thành viên, Lịch sử đấu
- [ ] Tab "Tổng quan": Giới thiệu, Chỉ số đội
- [ ] Actions: Chỉnh sửa đội, Mời thành viên
- [ ] Reference: `team_detail (3.1).html`

#### 5.3. Create Team - `src/screens/teamCreate/index.tsx`
- [ ] **CẬP NHẬT** - Đảm bảo UI match design
- [ ] Logo upload với edit button
- [ ] Team name input
- [ ] Banner upload (tối đa 5 ảnh)
- [ ] Location input
- [ ] Description textarea
- [ ] Team rating section:
  - Level selector: Gà, Trung bình, Khá, Mạnh
  - Sliders: Tấn công, Phòng thủ, Kỹ thuật
- [ ] Fixed CTA: "Tạo đội ngay"
- [ ] Reference: `create team (3.2).html`

---

### 6. Screens - Home

#### 6.1. Home - `src/screens/home/index.tsx`
- [ ] **CẬP NHẬT** - Đảm bảo UI match design
- [ ] Header: "Xin chào, User!"
- [ ] Hero banner: "Cáp kèo ngay hôm nay" với CTA "Tạo kèo"
- [ ] Quick actions grid: Tạo đội, Cáp kèo, Trận tới
- [ ] Section: "Đội gần bạn" (horizontal scroll)
- [ ] Section: "Kèo đang mở" (horizontal scroll)
- [ ] Reference: `home (1).html`

---

### 7. Components - UI Components

#### 7.1. Match Card Components

**7.1.1. `src/components/ui/MatchCard.tsx`** ⭐ **UPDATE**
- [ ] Cập nhật để support nhiều trạng thái
- [ ] Props: status, teams, time, location, actions
- [ ] Badge trạng thái với màu sắc
- [ ] Actions buttons

**7.1.2. `src/components/ui/MatchedCard.tsx`** ⭐ **NEW**
- [ ] Card cho tab "Đã Match"
- [ ] Design: Logo đội đối thủ, tên, thời gian match
- [ ] Actions: Xem chi tiết, Gửi lời mời, Bỏ qua

**7.1.3. `src/components/ui/CappingCard.tsx`** ⭐ **NEW**
- [ ] Card cho tab "Đang Cáp Kèo"
- [ ] Status badge: Chờ phản hồi / Đang capping / Đang xác nhận
- [ ] Actions: Xem chi tiết, Vào Match Room, Hủy

**7.1.4. `src/components/ui/ConfirmedCard.tsx`** ⭐ **NEW**
- [ ] Card cho tab "Đã Chốt Kèo"
- [ ] Countdown timer (nếu sắp diễn ra)
- [ ] Badge "Đã chốt"
- [ ] Actions: Xem chi tiết, Chat Zalo

**7.1.5. `src/components/ui/ScheduleCard.tsx`** ⭐ **NEW**
- [ ] Card cho tab "Lịch Sắp Tới & Đã Kết Thúc"
- [ ] Variant: Upcoming (countdown) / Finished (score)
- [ ] Gallery preview cho trận đã kết thúc
- [ ] Actions: Xem chi tiết, Chat Zalo, Request Rematch

#### 7.2. Status Badge Component

**7.2.1. `src/components/ui/MatchStatusBadge.tsx`** ⭐ **NEW**
- [ ] Badge component với các trạng thái:
  - `MATCHED`: Blue/Gray
  - `PENDING`: Orange/Yellow
  - `CAPPING`: Purple/Blue
  - `CONFIRMING`: Cyan/Blue
  - `CONFIRMED`: Green
  - `UPCOMING`: Blue/Primary
  - `FINISHED`: Gray
- [ ] Text và icon tương ứng

#### 7.3. Countdown Timer Component

**7.3.1. `src/components/ui/CountdownTimer.tsx`** ⭐ **NEW**
- [ ] Countdown timer với 4 units: Ngày, Giờ, Phút, Giây
- [ ] Grid layout
- [ ] Auto update mỗi giây
- [ ] Format: DD:HH:MM:SS

#### 7.4. Timeline Component

**7.4.1. `src/components/ui/MatchTimeline.tsx`** ⭐ **NEW**
- [ ] Vertical timeline với dots
- [ ] Events: Tạo kèo, Nhận kèo, Xác nhận, etc.
- [ ] Timestamp cho mỗi event
- [ ] Reference: `match detail (4.6).html`

#### 7.5. Image Uploader Component

**7.5.1. `src/components/ui/ImageUploader.tsx`** ⭐ **NEW**
- [ ] Grid layout cho images
- [ ] Add button với dashed border
- [ ] Image preview với delete button
- [ ] Max images limit
- [ ] Reference: `match result update (4.3).html`

#### 7.6. Form Components

**7.6.1. `src/components/ui/FormDatePicker.tsx`** ⭐ **NEW**
- [ ] Date picker input với calendar icon
- [ ] Format: "Thứ X, DD/MM/YYYY"

**7.6.2. `src/components/ui/FormTimePicker.tsx`** ⭐ **NEW**
- [ ] Time picker input với clock icon
- [ ] Format: "HH:MM"

**7.6.3. `src/components/ui/FormLocationInput.tsx`** ⭐ **NEW**
- [ ] Location input với map icon
- [ ] "Mở bản đồ" link

#### 7.7. Team Components

**7.7.1. `src/components/ui/TeamAvatar.tsx`** ⭐ **NEW**
- [ ] Team logo với border
- [ ] Gender badge indicator
- [ ] Size variants: sm, md, lg, xl

**7.7.2. `src/components/ui/TeamStats.tsx`** ⭐ **NEW**
- [ ] Stats bars: Attack, Defense, Technique
- [ ] ProgressBar component
- [ ] Value display

---

### 8. Components - Common Components

#### 8.1. Tabs Component

**8.1.1. `src/components/common/Tabs.tsx`** ⭐ **NEW**
- [ ] Horizontal tabs với underline indicator
- [ ] Active state
- [ ] Click handler
- [ ] Support 4 tabs

#### 8.2. Empty State Component

**8.2.1. `src/components/common/EmptyState.tsx`** ⭐ **NEW**
- [ ] Icon/Illustration
- [ ] Title
- [ ] Description
- [ ] Optional CTA button

#### 8.3. Loading State Component

**8.3.1. `src/components/common/LoadingState.tsx`** ⭐ **NEW**
- [ ] Skeleton loaders cho cards
- [ ] Spinner
- [ ] Full screen loading

---

### 9. Types & Interfaces

#### 9.1. `src/types/index.ts` ⭐ **UPDATE**
- [ ] Thêm types cho Match:
  ```typescript
  type MatchStatus = 
    | 'MATCHED'      // Đã match, chưa cáp
    | 'PENDING'      // Đã gửi lời mời, chờ phản hồi
    | 'CAPPING'      // Đang capping (trao đổi)
    | 'CONFIRMING'   // Đang xác nhận kèo
    | 'CONFIRMED'    // Đã chốt kèo
    | 'UPCOMING'     // Sắp diễn ra
    | 'FINISHED'     // Đã kết thúc

  type Match = {
    id: string
    status: MatchStatus
    teamA: Team
    teamB: Team
    date?: string
    time?: string
    location?: string
    score?: { teamA: number; teamB: number }
    createdAt: string
    updatedAt: string
  }

  type Team = {
    id: string
    name: string
    logo: string
    level: string
    gender: 'Nam' | 'Nữ' | 'Mixed'
    stats: {
      attack: number
      defense: number
      technique: number
    }
  }
  ```

---

### 10. Utils & Helpers

#### 10.1. `src/utils/match.ts` ⭐ **NEW**
- [ ] `getMatchStatusLabel(status: MatchStatus): string`
- [ ] `getMatchStatusColor(status: MatchStatus): string`
- [ ] `filterMatchesByStatus(matches: Match[], status: MatchStatus): Match[]`
- [ ] `formatMatchDate(date: string): string`
- [ ] `formatMatchTime(time: string): string`
- [ ] `calculateCountdown(targetDate: Date): { days: number; hours: number; minutes: number; seconds: number }`

#### 10.2. `src/utils/navigation.ts` ⭐ **NEW**
- [ ] Helper functions cho navigation
- [ ] `navigateToMatchDetail(matchId: string)`
- [ ] `navigateToTeamDetail(teamId: string)`
- [ ] `navigateToMatchRoom(matchId: string)`

---

## 🔄 Navigation Flow Implementation

### Flow 1: Swipe → Match → Request
```
Home → Team Select Modal → Swipe Deck
  → [Match] → Swipe Matched Modal
  → Team Detail (4.1) → Request Match (4.2)
  → [Navigate to Tab "Đang Cáp Kèo"]
```

### Flow 2: Incoming Request → Accept → Confirm
```
Incoming Requests (4.7) → Accept
  → Match Room (4.4) → Confirm Match Info (4.8)
  → [Navigate to Tab "Đã Chốt Kèo"]
  → Match Detail (4.6)
```

### Flow 3: Match Detail → Update Result → Finished
```
Tab "Đã Chốt Kèo" → Match Detail (4.6)
  → Match Result Update (4.3)
  → [Navigate to Tab "Lịch Sắp Tới & Đã Kết Thúc"]
  → Finished Match Detail (4.9)
  → Request Rematch (4.4)
```

### Flow 4: Tab Switching
```
Tab "Đã Match" → [Gửi lời mời] → Auto switch to Tab "Đang Cáp Kèo"
Tab "Đang Cáp Kèo" → [Chốt kèo] → Auto switch to Tab "Đã Chốt Kèo"
Tab "Đã Chốt Kèo" → [Cập nhật kết quả] → Auto switch to Tab "Lịch Sắp Tới & Đã Kết Thúc"
```

---

## 📝 Implementation Checklist

### Phase 1: Setup & Routing ⭐ **PRIORITY**
- [ ] Cập nhật `router.tsx` với tất cả routes
- [ ] Cập nhật `TabsLayout.tsx` - đổi label "Kèo"
- [ ] Cập nhật `BottomNav.tsx`
- [ ] Tạo types trong `types/index.ts`

### Phase 2: Tab "Kèo" Main Screen ⭐ **PRIORITY**
- [ ] Tạo `matches/index.tsx` với TabsLayout
- [ ] Implement 4 tabs: Matched, Capping, Confirmed, Schedule
- [ ] Tạo `Tabs.tsx` component
- [ ] Tab switching logic

### Phase 3: Tab Screens
- [ ] `MatchedTab.tsx` - List kèo đã match
- [ ] `CappingTab.tsx` - List kèo đang cáp
- [ ] `ConfirmedTab.tsx` - List kèo đã chốt
- [ ] `ScheduleTab.tsx` - List lịch sắp tới & đã kết thúc

### Phase 4: Card Components
- [ ] `MatchedCard.tsx`
- [ ] `CappingCard.tsx`
- [ ] `ConfirmedCard.tsx`
- [ ] `ScheduleCard.tsx`
- [ ] `MatchStatusBadge.tsx`

### Phase 5: Detail Screens
- [ ] `requestMatch/index.tsx` - NEW
- [ ] `swipeMatched/index.tsx` - NEW
- [ ] Update `teamDetail/index.tsx`
- [ ] Update `matchDetail/index.tsx`
- [ ] Update `matchRoom/index.tsx`
- [ ] Update `submitMatchResult/index.tsx`
- [ ] Update `confirmMatchInfo/index.tsx`
- [ ] Update `finishedMatchDetail/index.tsx`
- [ ] Update `incomingRequests/index.tsx`
- [ ] Update `rematchRequest/index.tsx`

### Phase 6: Supporting Components
- [ ] `CountdownTimer.tsx`
- [ ] `MatchTimeline.tsx`
- [ ] `ImageUploader.tsx`
- [ ] `FormDatePicker.tsx`
- [ ] `FormTimePicker.tsx`
- [ ] `FormLocationInput.tsx`
- [ ] `TeamAvatar.tsx`
- [ ] `TeamStats.tsx`
- [ ] `EmptyState.tsx`
- [ ] `LoadingState.tsx`

### Phase 7: Utils & Helpers
- [ ] `utils/match.ts`
- [ ] `utils/navigation.ts`

### Phase 8: Integration & Testing
- [ ] Test navigation flow
- [ ] Test tab switching
- [ ] Test empty states
- [ ] Test loading states
- [ ] Test responsive design

---

## 🎨 Design Implementation Notes

### Colors (Tailwind Config)
```typescript
// Match Status Colors
matched: 'bg-blue-500/20 text-blue-400'
pending: 'bg-orange-500/20 text-orange-400'
capping: 'bg-purple-500/20 text-purple-400'
confirming: 'bg-cyan-500/20 text-cyan-400'
confirmed: 'bg-green-500/20 text-green-400'
upcoming: 'bg-primary/20 text-primary'
finished: 'bg-gray-500/20 text-gray-400'
```

### Spacing & Layout
- Card padding: `p-4`
- Card gap: `gap-4`
- Section padding: `px-4 py-4`
- Tab height: `h-12` hoặc `h-14`

### Typography
- Title: `text-lg font-bold`
- Subtitle: `text-sm text-muted`
- Body: `text-base`
- Badge: `text-xs font-medium`

---

## 🚀 Quick Start Implementation Order

1. **Day 1-2: Setup & Tab Structure**
   - Update routing
   - Create Tab "Kèo" main screen
   - Implement Tabs component
   - Create 4 tab screens (empty for now)

2. **Day 3-4: Tab "Đã Match" & "Đang Cáp Kèo"**
   - Implement MatchedTab với MatchedCard
   - Implement CappingTab với CappingCard
   - Create MatchStatusBadge component

3. **Day 5-6: Tab "Đã Chốt Kèo" & "Lịch Sắp Tới"**
   - Implement ConfirmedTab với ConfirmedCard
   - Implement ScheduleTab với ScheduleCard
   - Create CountdownTimer component

4. **Day 7-8: Detail Screens**
   - Request Match screen
   - Swipe Matched screen
   - Update existing detail screens

5. **Day 9-10: Supporting Components & Polish**
   - ImageUploader, Form components
   - Empty states, Loading states
   - Navigation flow testing
   - UI polish

---

## 📚 Reference Files Mapping

| Design File | Screen/Component | Status |
|------------|------------------|--------|
| `home (1).html` | `screens/home/index.tsx` | ✅ Update |
| `team seclect (2).html` | `screens/home/TeamSelectBottomSheet.tsx` | ✅ Update |
| `swipe team (2.1).html` | `screens/swipeDeck/index.tsx` | ✅ Update |
| `swipe team matched (2.2).html` | `screens/swipeMatched/index.tsx` | ⭐ NEW |
| `my team tabs (3).html` | `screens/myTeams/index.tsx` | ✅ Update |
| `team_detail (3.1).html` | `screens/teamDetail/index.tsx` | ✅ Update |
| `create team (3.2).html` | `screens/teamCreate/index.tsx` | ✅ Update |
| `upcoming_matches (4).html` | `screens/matches/index.tsx` | ⭐ NEW |
| `team detail (4.1).html` | `screens/teamDetail/index.tsx` | ✅ Update |
| `request match (4.2).html` | `screens/requestMatch/index.tsx` | ⭐ NEW |
| `match result update (4.3).html` | `screens/submitMatchResult/index.tsx` | ✅ Update |
| `accept request match (4.4).html` | `screens/matchRoom/index.tsx` | ✅ Update |
| `request rematch (4.4).html` | `screens/rematchRequest/index.tsx` | ✅ Update |
| `match detail (4.6).html` | `screens/matchDetail/index.tsx` | ✅ Update |
| `incoming request (4.7).html` | `screens/incomingRequests/index.tsx` | ✅ Update |
| `create match form (4.8).html` | `screens/confirmMatchInfo/index.tsx` | ✅ Update |
| `finish match detail (4.9).html` | `screens/finishedMatchDetail/index.tsx` | ✅ Update |

---

**Last Updated:** [Date]
**Version:** 1.0
**Status:** Ready for Implementation

