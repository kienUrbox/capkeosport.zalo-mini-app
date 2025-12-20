# Component Architecture Review & Improvement

## 🔍 Phân Tích Hiện Tại

### Component Structure Hiện Có:
```
src/components/
├── common/          # Shared components (AppHeader, BottomNav, etc.)
└── ui/              # UI-specific components (Cards, Buttons, Forms)
```

### Vấn Đề Trong Plan Ban Đầu:

1. **Match Cards - Quá nhiều component riêng biệt**
   - ❌ MatchedCard.tsx
   - ❌ CappingCard.tsx
   - ❌ ConfirmedCard.tsx
   - ❌ ScheduleCard.tsx
   - **Vấn đề**: Code duplication, khó maintain

2. **Status Badge - Tạo mới thay vì extend**
   - ❌ MatchStatusBadge.tsx (riêng)
   - **Vấn đề**: Badge component hiện có đơn giản, nên extend thay vì tạo mới

3. **Form Components - Có thể tận dụng FormInput**
   - ❌ FormDatePicker.tsx (riêng)
   - ❌ FormTimePicker.tsx (riêng)
   - ❌ FormLocationInput.tsx (riêng)
   - **Vấn đề**: FormInput đã flexible, chỉ cần wrapper với icon

---

## ✅ Đề Xuất Cải Thiện

### 1. Match Card Components - **REFACTOR**

#### Option A: Single Component với Variants (RECOMMENDED) ⭐
```typescript
// src/components/ui/MatchCard.tsx
type MatchCardVariant = 
  | 'matched'      // Tab "Đã Match"
  | 'capping'       // Tab "Đang Cáp Kèo"
  | 'confirmed'    // Tab "Đã Chốt Kèo"
  | 'upcoming'     // Tab "Lịch Sắp Tới" - sắp diễn ra
  | 'finished'     // Tab "Lịch Sắp Tới" - đã kết thúc

type MatchCardProps = {
  variant: MatchCardVariant
  teamA: Team
  teamB: Team
  date?: string
  time?: string
  location?: string
  status?: MatchStatus  // Cho variant 'capping'
  score?: { teamA: number; teamB: number }  // Cho variant 'finished'
  countdown?: CountdownData  // Cho variant 'upcoming'
  onAction?: (action: string) => void
}
```

**Ưu điểm:**
- ✅ Single source of truth
- ✅ Dễ maintain và update
- ✅ Consistent design
- ✅ Type-safe với variants

**Nhược điểm:**
- ⚠️ Component có thể lớn (nhưng có thể split render logic)

#### Option B: Composition Pattern
```typescript
// Base component
<MatchCardBase>
  <MatchCardHeader />
  <MatchCardContent />
  <MatchCardActions />
</MatchCardBase>

// Specific variants
<MatchedCard />  // Wraps MatchCardBase với specific props
<CappingCard />  // Wraps MatchCardBase với specific props
```

**Ưu điểm:**
- ✅ Flexible
- ✅ Có thể reuse parts

**Nhược điểm:**
- ⚠️ Phức tạp hơn
- ⚠️ Có thể over-engineering

**👉 RECOMMENDATION: Option A - Single Component với Variants**

---

### 2. Status Badge - **EXTEND EXISTING**

#### Current Badge Component:
```typescript
// src/components/ui/Badge.tsx (hiện tại)
type BadgeProps = {
  label: string
}
```

#### Improved Badge Component:
```typescript
// src/components/ui/Badge.tsx (cải thiện)
type BadgeVariant = 
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  // Match status variants
  | 'matched'
  | 'pending'
  | 'capping'
  | 'confirming'
  | 'confirmed'
  | 'upcoming'
  | 'finished'

type BadgeProps = {
  label: string
  variant?: BadgeVariant
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
}

// Usage
<Badge label="Đã chốt" variant="confirmed" />
<Badge label="Đang capping" variant="capping" />
```

**Ưu điểm:**
- ✅ Extend existing component
- ✅ Consistent với design system
- ✅ Không cần component mới

**👉 RECOMMENDATION: Extend Badge component**

---

### 3. Form Components - **WRAPPER PATTERN**

#### Current FormInput:
```typescript
// src/components/ui/FormInput.tsx (hiện tại)
// Đã có label, hint, className, ...props
```

#### Improved Approach:
```typescript
// src/components/ui/FormInputWithIcon.tsx (NEW - wrapper)
type FormInputWithIconProps = FormInputProps & {
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  onIconClick?: () => void
}

// Usage
<FormInputWithIcon 
  label="Ngày đá"
  icon={<CalendarIcon />}
  iconPosition="right"
  type="date"
/>

<FormInputWithIcon 
  label="Giờ đá"
  icon={<ClockIcon />}
  iconPosition="right"
  type="time"
/>

<FormInputWithIcon 
  label="Địa điểm"
  icon={<LocationIcon />}
  iconPosition="right"
  onIconClick={() => openMap()}
/>
```

**Hoặc đơn giản hơn - Extend FormInput:**
```typescript
// src/components/ui/FormInput.tsx (UPDATE)
type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  hint?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  onIconClick?: () => void
}
```

**Ưu điểm:**
- ✅ Tận dụng FormInput hiện có
- ✅ Không cần tạo nhiều component riêng
- ✅ Flexible và reusable

**👉 RECOMMENDATION: Extend FormInput với icon support**

---

### 4. Team Components - **REVIEW**

#### TeamAvatar vs Avatar:
```typescript
// Current: src/components/common/Avatar.tsx
// Có thể đã support team logo

// Proposed: src/components/ui/TeamAvatar.tsx
// ❓ Có cần riêng không?
```

**Review:**
- Nếu Avatar hiện tại chỉ support initials → Cần TeamAvatar
- Nếu Avatar đã support image → Chỉ cần extend Avatar

**👉 RECOMMENDATION: Check Avatar component trước, nếu cần thì extend thay vì tạo mới**

#### TeamStats Component:
```typescript
// src/components/ui/TeamStats.tsx
// ✅ Hợp lý - Component riêng vì có logic riêng
// - ProgressBar với label
// - Multiple stats
// - Layout riêng
```

**👉 RECOMMENDATION: Giữ nguyên - Component riêng hợp lý**

---

### 5. Countdown Timer - **STANDALONE**

```typescript
// src/components/ui/CountdownTimer.tsx
// ✅ Hợp lý - Component riêng
// - Logic riêng (setInterval)
// - Layout riêng (grid)
// - Reusable
```

**👉 RECOMMENDATION: Giữ nguyên - Component riêng hợp lý**

---

### 6. Timeline Component - **STANDALONE**

```typescript
// src/components/ui/MatchTimeline.tsx
// ✅ Hợp lý - Component riêng
// - Layout riêng (vertical timeline)
// - Logic riêng (events, timestamps)
// - Reusable
```

**👉 RECOMMENDATION: Giữ nguyên - Component riêng hợp lý**

---

### 7. Image Uploader - **STANDALONE**

```typescript
// src/components/ui/ImageUploader.tsx
// ✅ Hợp lý - Component riêng
// - Logic riêng (file upload, preview, delete)
// - Layout riêng (grid)
// - Reusable
```

**👉 RECOMMENDATION: Giữ nguyên - Component riêng hợp lý**

---

## 📋 Component Structure - REVISED

### UI Components (Revised)

```
src/components/ui/
├── MatchCard.tsx              ⭐ UPDATE - Single component với variants
├── Badge.tsx                  ⭐ UPDATE - Add variants (matched, pending, etc.)
├── FormInput.tsx              ⭐ UPDATE - Add icon support
├── Avatar.tsx                 ⚠️ CHECK - Extend nếu cần team logo
├── TeamStats.tsx              ✅ NEW - Giữ nguyên
├── CountdownTimer.tsx         ✅ NEW - Giữ nguyên
├── MatchTimeline.tsx          ✅ NEW - Giữ nguyên
├── ImageUploader.tsx          ✅ NEW - Giữ nguyên
├── ProgressBar.tsx            ✅ EXISTING - Giữ nguyên
├── PrimaryButton.tsx          ✅ EXISTING - Giữ nguyên
├── SecondaryButton.tsx        ✅ EXISTING - Giữ nguyên
└── ... (other existing components)
```

### Common Components (Revised)

```
src/components/common/
├── Tabs.tsx                   ✅ NEW - Giữ nguyên
├── EmptyState.tsx             ✅ NEW - Giữ nguyên
├── LoadingState.tsx           ✅ NEW - Giữ nguyên
├── AppHeader.tsx              ✅ EXISTING - Giữ nguyên
├── BottomNav.tsx               ✅ EXISTING - Giữ nguyên
└── ... (other existing components)
```

---

## 🎯 Revised Implementation Plan

### Phase 1: Update Existing Components

1. **Update MatchCard.tsx**
   - [ ] Add variant prop: `matched | capping | confirmed | upcoming | finished`
   - [ ] Add conditional rendering based on variant
   - [ ] Add status badge integration
   - [ ] Add countdown support (for upcoming)
   - [ ] Add score display (for finished)
   - [ ] Add action buttons based on variant

2. **Update Badge.tsx**
   - [ ] Add variant prop với match status variants
   - [ ] Add color mapping
   - [ ] Add size prop
   - [ ] Add icon support (optional)

3. **Update FormInput.tsx**
   - [ ] Add icon prop
   - [ ] Add iconPosition prop
   - [ ] Add onIconClick handler
   - [ ] Update styling for icon layout

4. **Check & Update Avatar.tsx** (if needed)
   - [ ] Check if supports image
   - [ ] If not, add image support
   - [ ] Add gender badge indicator (optional)

### Phase 2: New Components

1. **TeamStats.tsx** - NEW
2. **CountdownTimer.tsx** - NEW
3. **MatchTimeline.tsx** - NEW
4. **ImageUploader.tsx** - NEW
5. **Tabs.tsx** - NEW
6. **EmptyState.tsx** - NEW
7. **LoadingState.tsx** - NEW

---

## 📊 Component Comparison

| Component | Original Plan | Revised Plan | Reason |
|-----------|--------------|--------------|--------|
| MatchCard | 4 separate cards | 1 card với variants | ✅ Avoid duplication |
| Status Badge | New component | Extend Badge | ✅ Consistent design |
| FormDatePicker | New component | Extend FormInput | ✅ Reuse existing |
| FormTimePicker | New component | Extend FormInput | ✅ Reuse existing |
| FormLocationInput | New component | Extend FormInput | ✅ Reuse existing |
| TeamAvatar | New component | Check Avatar first | ✅ Avoid duplication |
| TeamStats | New component | Keep separate | ✅ Unique logic |
| CountdownTimer | New component | Keep separate | ✅ Unique logic |
| MatchTimeline | New component | Keep separate | ✅ Unique layout |
| ImageUploader | New component | Keep separate | ✅ Unique logic |

---

## ✅ Final Recommendations

### ✅ Keep Separate (Unique Logic/Layout):
1. **TeamStats.tsx** - Stats bars với labels
2. **CountdownTimer.tsx** - Timer logic
3. **MatchTimeline.tsx** - Timeline layout
4. **ImageUploader.tsx** - File upload logic
5. **Tabs.tsx** - Tab navigation
6. **EmptyState.tsx** - Empty state display
7. **LoadingState.tsx** - Loading display

### ⭐ Update Existing (Extend):
1. **MatchCard.tsx** - Add variants thay vì tạo mới
2. **Badge.tsx** - Add match status variants
3. **FormInput.tsx** - Add icon support
4. **Avatar.tsx** - Check và extend nếu cần

### ❌ Remove from Plan:
1. ~~MatchedCard.tsx~~ → Use MatchCard variant="matched"
2. ~~CappingCard.tsx~~ → Use MatchCard variant="capping"
3. ~~ConfirmedCard.tsx~~ → Use MatchCard variant="confirmed"
4. ~~ScheduleCard.tsx~~ → Use MatchCard variant="upcoming" | "finished"
5. ~~MatchStatusBadge.tsx~~ → Use Badge variant="matched" | "pending" | etc.
6. ~~FormDatePicker.tsx~~ → Use FormInput type="date" with icon
7. ~~FormTimePicker.tsx~~ → Use FormInput type="time" with icon
8. ~~FormLocationInput.tsx~~ → Use FormInput with location icon

---

## 🎨 Benefits of Revised Approach

1. **Less Code Duplication**
   - 1 MatchCard thay vì 4 cards
   - Extend Badge thay vì tạo mới
   - Extend FormInput thay vì 3 components riêng

2. **Easier Maintenance**
   - Single source of truth
   - Update một chỗ, apply everywhere
   - Consistent design

3. **Better Type Safety**
   - Variants với TypeScript
   - Compile-time checks

4. **Smaller Bundle Size**
   - Ít component hơn
   - Code reuse tốt hơn

5. **Consistent Design System**
   - Tận dụng component hiện có
   - Design tokens consistent

---

**Last Updated:** [Date]
**Version:** 2.0 (Revised)

