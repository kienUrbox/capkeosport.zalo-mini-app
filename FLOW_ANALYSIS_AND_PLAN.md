# Phân Tích Flow Điều Hướng & Plan Phát Triển

## 📱 Cấu Trúc Tổng Quan

### Bottom Navigation
1. **Home** - Màn hình chính
2. **Cáp Kèo** - Swipe deck tìm đội
3. **My Teams** - Quản lý đội của user
4. **Kèo** (đổi từ "Upcoming") - Quản lý các kèo đấu
5. **Profile** - Hồ sơ cá nhân

---

## 🏠 Tab 1: Home (1)

**Màn hình chính với:**
- Quick actions: Tạo đội, Cáp kèo, Trận tới
- Danh sách "Đội gần bạn" (horizontal scroll)
- Danh sách "Kèo đang mở" (horizontal scroll)
- Bottom navigation bar

**Flow từ Home:**
- Click "Tạo đội" → Create Team (3.2)
- Click "Cáp kèo" → Team Select Modal (2) → Swipe Deck (2.1)
- Click "Trận tới" → Tab Kèo (4)

---

## ⚔️ Tab 2: Cáp Kèo (2, 2.1, 2.2)

### Flow Swipe:
```
Home (1) → "Cáp kèo" 
  → Team Select Modal (2) [Chọn đội để cáp kèo]
  → Swipe Deck (2.1) [Tinder-style swipe]
  → [Match thành công] 
  → Swipe Matched (2.2) [Animation "It's a Match!"]
  → Team Detail (4.1) [Xem chi tiết đội đối thủ]
  → Request Match (4.2) [Tạo lời mời đấu]
```

**Các màn hình:**
- `team seclect (2)`: Modal chọn đội để cáp kèo
- `swipe team (2.1)`: Swipe deck tìm đội phù hợp
- `swipe team matched (2.2)`: Màn hình khi match thành công

---

## 👥 Tab 3: My Teams (3, 3.1, 3.2)

### Flow:
```
Home (1) → "Tạo đội" 
  → Create Team (3.2) 
  → My Teams (3) [Danh sách đội]
  → Team Detail (3.1) [Chi tiết đội của user]
```

**Các màn hình:**
- `my team tabs (3)`: Danh sách các đội của user
- `team_detail (3.1)`: Chi tiết đội của user
  - Tabs: Tổng quan, Thành viên, Lịch sử đấu
- `create team (3.2)`: Form tạo đội mới

---

## 🎯 Tab 4: Kèo (4) - **CẬP NHẬT MỚI**

### Tên màn hình: "Kèo" (thay vì "Upcoming")

### Các Tab Con (Tabs Layout):

#### Tab 1: **Đã Match** 
- **Mô tả:** Các kèo đã match nhưng chưa cáp (chưa gửi lời mời)
- **Trạng thái:** Match thành công từ Swipe Deck
- **Actions:** 
  - Xem chi tiết đội đối thủ
  - Gửi lời mời cáp kèo
  - Bỏ qua
- **Màn hình liên quan:** 
  - Swipe Matched (2.2) → Team Detail (4.1) → Request Match (4.2)

#### Tab 2: **Đang Cáp Kèo**
- **Mô tả:** Các kèo đã gửi lời mời, đang chờ phản hồi/capping/xác nhận
- **Trạng thái:** 
  - Đã gửi lời mời → Chờ phản hồi
  - Đối thủ đã nhận → Đang capping (trao đổi)
  - Đang xác nhận kèo với đối thủ
- **Actions:**
  - Xem chi tiết
  - Vào Match Room (4.4) để trao đổi
  - Xác nhận thông tin kèo (4.8)
  - Hủy lời mời
- **Màn hình liên quan:**
  - Request Match (4.2) → Incoming Request (4.7) [đối thủ] → Accept Request (4.4) → Confirm Match Info (4.8)

#### Tab 3: **Đã Chốt Kèo**
- **Mô tả:** Các request đã 2 bên đồng ý, đang lên lịch chốt kèo để chuẩn bị đến trận đấu
- **Trạng thái:** 
  - Đã xác nhận thông tin kèo
  - Đã chốt kèo
  - Đang đếm ngược đến trận đấu
- **Actions:**
  - Xem chi tiết trận đấu (4.6)
  - Chat Zalo
  - Cập nhật kết quả (sau khi đá) (4.3)
- **Màn hình liên quan:**
  - Confirm Match Info (4.8) → Match Detail (4.6)

#### Tab 4: **Lịch Sắp Tới & Đã Kết Thúc**
- **Mô tả:** Các trận đấu sắp diễn ra và đã kết thúc
- **Trạng thái:**
  - Sắp diễn ra: Countdown timer, thông tin trận đấu
  - Đã kết thúc: Kết quả, gallery, lịch sử
- **Actions:**
  - Xem chi tiết trận đấu (4.6) hoặc (4.9)
  - Cập nhật kết quả (4.3) [nếu chưa cập nhật]
  - Request Rematch (4.4)
  - Xem gallery, lịch sử đối đầu
- **Màn hình liên quan:**
  - Match Detail (4.6) [trận sắp diễn ra]
  - Match Result Update (4.3) [cập nhật kết quả]
  - Finish Match Detail (4.9) [xem kết quả]

### Flow Tổng Quan Tab Kèo:

```
Tab "Đã Match"
  → Team Detail (4.1)
  → Request Match (4.2)
  → Chuyển sang Tab "Đang Cáp Kèo"

Tab "Đang Cáp Kèo"
  → Incoming Request (4.7) [nếu là đối thủ]
  → Accept Request (4.4) [Match Room]
  → Confirm Match Info (4.8)
  → Chuyển sang Tab "Đã Chốt Kèo"

Tab "Đã Chốt Kèo"
  → Match Detail (4.6) [trận sắp diễn ra]
  → Match Result Update (4.3) [sau khi đá]
  → Chuyển sang Tab "Lịch Sắp Tới & Đã Kết Thúc"

Tab "Lịch Sắp Tới & Đã Kết Thúc"
  → Match Detail (4.6) [trận sắp diễn ra]
  → Finish Match Detail (4.9) [trận đã kết thúc]
  → Request Rematch (4.4) [nếu muốn đá lại]
```

---

## 📋 Các Màn Hình Chi Tiết

### Tab 4: Kèo - Các Màn Hình Liên Quan

#### 4.1: Team Detail (Đội Đối Thủ)
- Xem thông tin đội đối thủ
- Chỉ số đội (Attack, Defense, Technique)
- Thành viên
- Lịch sử đối đầu
- Action: "Gửi lời mời"

#### 4.2: Request Match
- Form tạo lời mời đấu
- Chọn ngày, giờ, địa điểm
- Ghi chú
- Preview lời mời

#### 4.3: Match Result Update
- Cập nhật tỷ số
- Upload ảnh minh chứng
- Ghi chú

#### 4.4: Accept Request Match (Match Room)
- Phòng chờ trận đấu
- Timeline: Đã gửi → Đã nhận → Đang capping
- Trao đổi trước trận
- Actions: Chốt kèo, Mở Zalo Chat, Hủy lời mời

#### 4.4 (variant): Request Rematch
- Form tạo kèo rematch
- Chọn đội, thời gian, loại sân
- Ghi chú

#### 4.6: Match Detail (Trận Sắp Diễn Ra)
- Thông tin 2 đội
- Countdown timer
- Thông tin địa điểm, thời gian
- Danh sách tham gia
- Lịch sử trận đấu (timeline)
- Actions: Mở Zalo Chat, Chỉnh sửa, Cập nhật kết quả

#### 4.7: Incoming Request
- Danh sách lời mời đến
- Actions: Accept, Propose, Decline

#### 4.8: Create Match Form / Confirm Match Info
- Xác nhận thông tin kèo
- Form điền: Ngày chốt, Giờ chốt, Tên sân, Địa chỉ, Link bản đồ, Ghi chú
- Action: Chốt kèo

#### 4.9: Finish Match Detail (Trận Đã Kết Thúc)
- Kết quả trận đấu (tỷ số)
- Match Recap
- Match Gallery
- Previous Encounters
- Actions: Request Rematch, Share

---

## 🔄 Flow Điều Hướng Chính

### Flow 1: Tạo Đội và Quản Lý Đội
```
Home (1) → "Tạo đội" 
  → Create Team (3.2) 
  → My Teams (3) 
  → Team Detail (3.1)
```

### Flow 2: Cáp Kèo (Swipe)
```
Home (1) → "Cáp kèo" 
  → Team Select Modal (2) 
  → Swipe Deck (2.1) 
  → [Match thành công] 
  → Swipe Matched (2.2) 
  → Team Detail (4.1) 
  → Request Match (4.2) 
  → [Chuyển sang Tab "Đang Cáp Kèo"]
  → Incoming Request (4.7) [đối thủ nhận]
  → Accept Request (4.4) [match room]
  → Confirm Match Info (4.8) 
  → [Chuyển sang Tab "Đã Chốt Kèo"]
  → Match Detail (4.6) [trận đã chốt]
```

### Flow 3: Quản Lý Trận Đấu
```
Tab "Kèo" → Tab "Đã Chốt Kèo"
  → Match Detail (4.6) [trận sắp diễn ra]
    → Match Result Update (4.3) [sau khi đá]
    → [Chuyển sang Tab "Lịch Sắp Tới & Đã Kết Thúc"]
    → Finish Match Detail (4.9) [xem kết quả]
      → Request Rematch (4.4) [nếu muốn đá lại]
```

### Flow 4: Nhận Lời Mời
```
Home (1) → Notification/Incoming Request (4.7)
  → Accept/Propose/Decline
  → Accept Request (4.4) [match room]
  → Confirm Match Info (4.8)
  → [Chuyển sang Tab "Đã Chốt Kèo"]
  → Match Detail (4.6)
```

---

## 📝 Plan Implementation Tab "Kèo"

### Bước 1: Cập nhật màn hình chính
- [ ] Đổi tên "Upcoming" thành "Kèo" trong Bottom Navigation
- [ ] Cập nhật title màn hình từ "Lịch Sắp Tới" thành "Kèo"

### Bước 2: Tạo Tabs Layout
- [ ] Implement Tabs component với 4 tabs:
  1. **Đã Match** - Các kèo đã match chưa cáp
  2. **Đang Cáp Kèo** - Đang chờ phản hồi/capping/xác nhận
  3. **Đã Chốt Kèo** - Đã chốt, đang chuẩn bị
  4. **Lịch Sắp Tới & Đã Kết Thúc** - Sắp diễn ra và đã kết thúc

### Bước 3: Implement Tab "Đã Match"
- [ ] List các kèo đã match từ Swipe Deck
- [ ] Hiển thị thông tin: Logo đội đối thủ, tên đội, thời gian match
- [ ] Actions: Xem chi tiết, Gửi lời mời, Bỏ qua
- [ ] Navigation: Team Detail (4.1) → Request Match (4.2)

### Bước 4: Implement Tab "Đang Cáp Kèo"
- [ ] List các kèo đang trong quá trình cáp kèo
- [ ] Hiển thị trạng thái: Chờ phản hồi / Đang capping / Đang xác nhận
- [ ] Badge trạng thái với màu sắc khác nhau
- [ ] Actions: Xem chi tiết, Vào Match Room, Xác nhận kèo, Hủy
- [ ] Navigation: 
  - Request Match (4.2) → Incoming Request (4.7) → Accept Request (4.4) → Confirm Match Info (4.8)

### Bước 5: Implement Tab "Đã Chốt Kèo"
- [ ] List các kèo đã chốt, đang chuẩn bị
- [ ] Hiển thị: Thông tin 2 đội, thời gian, địa điểm, countdown (nếu sắp diễn ra)
- [ ] Badge: "Đã chốt"
- [ ] Actions: Xem chi tiết, Chat Zalo, Cập nhật kết quả (nếu đã đá)
- [ ] Navigation: Match Detail (4.6)

### Bước 6: Implement Tab "Lịch Sắp Tới & Đã Kết Thúc"
- [ ] List các trận sắp diễn ra và đã kết thúc
- [ ] Phân biệt bằng badge: "Sắp diễn ra" / "Đã kết thúc"
- [ ] Sắp diễn ra: Countdown timer, thông tin trận đấu
- [ ] Đã kết thúc: Tỷ số, kết quả, gallery preview
- [ ] Actions: 
  - Sắp diễn ra: Xem chi tiết, Chat Zalo
  - Đã kết thúc: Xem chi tiết, Request Rematch
- [ ] Navigation: 
  - Match Detail (4.6) [sắp diễn ra]
  - Finish Match Detail (4.9) [đã kết thúc]

### Bước 7: State Management
- [ ] Định nghĩa các trạng thái kèo:
  - `MATCHED`: Đã match, chưa cáp
  - `PENDING`: Đã gửi lời mời, chờ phản hồi
  - `CAPPING`: Đang capping (trao đổi)
  - `CONFIRMING`: Đang xác nhận kèo
  - `CONFIRMED`: Đã chốt kèo
  - `UPCOMING`: Sắp diễn ra
  - `FINISHED`: Đã kết thúc
- [ ] Filter logic cho từng tab
- [ ] Auto chuyển tab khi trạng thái thay đổi

### Bước 8: UI/UX Enhancements
- [ ] Empty states cho mỗi tab
- [ ] Loading states
- [ ] Pull to refresh
- [ ] Badge số lượng kèo mới/chưa đọc
- [ ] Animation khi chuyển tab
- [ ] Swipe gesture để chuyển tab (optional)

### Bước 9: Integration
- [ ] Kết nối với API để lấy danh sách kèo theo trạng thái
- [ ] Real-time updates khi có thay đổi trạng thái
- [ ] Push notifications khi có lời mời mới/trạng thái thay đổi

---

## 🎨 Design Notes

### Badge Colors:
- **Đã Match**: Blue/Gray (neutral)
- **Chờ phản hồi**: Orange/Yellow (pending)
- **Đang capping**: Purple/Blue (active)
- **Đang xác nhận**: Cyan/Blue (confirming)
- **Đã chốt**: Green (confirmed)
- **Sắp diễn ra**: Blue/Primary (upcoming)
- **Đã kết thúc**: Gray (finished)

### Card Design:
- Mỗi tab có card design phù hợp với trạng thái
- Hiển thị đầy đủ thông tin: Logo đội, tên đội, thời gian, địa điểm
- Actions buttons rõ ràng, dễ nhận biết

---

## ✅ Checklist Implementation

- [ ] Cập nhật Bottom Navigation: "Upcoming" → "Kèo"
- [ ] Tạo TabsLayout component với 4 tabs
- [ ] Implement Tab "Đã Match"
- [ ] Implement Tab "Đang Cáp Kèo"
- [ ] Implement Tab "Đã Chốt Kèo"
- [ ] Implement Tab "Lịch Sắp Tới & Đã Kết Thúc"
- [ ] State management cho các trạng thái kèo
- [ ] Filter logic
- [ ] Empty states
- [ ] Badge notifications
- [ ] API integration
- [ ] Testing flow điều hướng

---

**Last Updated:** [Date]
**Version:** 1.0

