# Design System - CapKeoSport

## Icons

### Material Symbols Outlined
- **Default size**: `text-2xl` (24px) - `ICON_SIZES.lg`
- **Small icons**: `text-base` (16px) - `ICON_SIZES.base`
- **Medium icons**: `text-xl` (20px) - `ICON_SIZES.md`
- **Large icons**: `text-3xl` (30px) - `ICON_SIZES.xl`
- **Extra large**: `text-4xl` (36px) - `ICON_SIZES['2xl']`

### Usage
```tsx
import { ICONS, ICON_SIZES } from '../../constants/design'

<span className={`material-symbols-outlined ${ICON_SIZES.lg}`}>
  {ICONS.calendar_month}
</span>
```

## Typography

### Headings
- **H1**: `text-3xl font-bold leading-tight tracking-[-0.015em]` - `TYPOGRAPHY.heading['1']`
- **H2**: `text-2xl font-bold leading-tight tracking-[-0.015em]` - `TYPOGRAPHY.heading['2']`
- **H3**: `text-xl font-bold leading-tight tracking-[-0.015em]` - `TYPOGRAPHY.heading['3']`
- **H4**: `text-lg font-bold leading-tight tracking-[-0.015em]` - `TYPOGRAPHY.heading['4']`

### Body Text
- **Base**: `text-base font-normal leading-normal` - `TYPOGRAPHY.body.base`
- **Small**: `text-sm font-normal leading-normal` - `TYPOGRAPHY.body.sm`
- **Caption**: `text-xs font-normal leading-normal` - `TYPOGRAPHY.caption`

### Usage
```tsx
import { TYPOGRAPHY } from '../../constants/design'

<h1 className={TYPOGRAPHY.heading['1']}>Title</h1>
<p className={TYPOGRAPHY.body.base}>Body text</p>
```

## Spacing

### Gaps
- **xs**: `gap-1` (4px) - `SPACING.xs`
- **sm**: `gap-2` (8px) - `SPACING.sm`
- **md**: `gap-3` (12px) - `SPACING.md`
- **lg**: `gap-4` (16px) - `SPACING.lg` (Default)
- **xl**: `gap-6` (24px) - `SPACING.xl`

### Padding
- **xs**: `p-2` (8px)
- **sm**: `p-3` (12px)
- **md**: `p-4` (16px) - Default
- **lg**: `p-6` (24px)
- **xl**: `p-8` (32px)

### Space Y (Vertical spacing)
- **sm**: `space-y-2` (8px)
- **md**: `space-y-3` (12px)
- **lg**: `space-y-4` (16px) - Default
- **xl**: `space-y-6` (24px)

### Usage
```tsx
import { SPACING, PADDING, SPACE_Y } from '../../constants/design'

<div className={`flex ${SPACING.lg}`}>
<div className={PADDING.md}>
<div className={SPACE_Y.lg}>
```

## Border Radius

- **sm**: `rounded` (8px) - `BORDER_RADIUS.sm`
- **md**: `rounded-lg` (16px) - `BORDER_RADIUS.md` (Default)
- **lg**: `rounded-xl` (24px) - `BORDER_RADIUS.lg`
- **xl**: `rounded-2xl` (32px) - `BORDER_RADIUS.xl`
- **2xl**: `rounded-3xl` (48px) - `BORDER_RADIUS['2xl']`
- **full**: `rounded-full` - `BORDER_RADIUS.full`

## Header

### Standard Header Component
```tsx
import { StandardHeader } from '../../components/common'

<StandardHeader 
  title="Screen Title"
  showBack={true}
  rightAction={<button>Action</button>}
/>
```

### Header Styles
- **Height**: `h-16` (64px)
- **Padding**: `px-4 py-2`
- **Title**: `text-lg font-bold leading-tight tracking-[-0.015em]`
- **Icon size**: `text-2xl` (24px)
- **Icon button**: `size-10` (40px)

## Buttons

### Heights
- **sm**: `h-10` (40px)
- **md**: `h-12` (48px) - Default
- **lg**: `h-14` (56px)

### Icon in Button
- **Size**: `text-xl` (20px) - `ICON_SIZES.md`
- **Gap**: `gap-2` (8px) - `SPACING.sm`

## Cards

### Default Card
- **Padding**: `p-4` (16px) - `CARD.padding`
- **Border Radius**: `rounded-lg` (16px) - `CARD.borderRadius`
- **Gap**: `gap-4` (16px) - `CARD.gap`

## Inputs

### Heights
- **sm**: `h-10` (40px)
- **md**: `h-12` (48px)
- **lg**: `h-14` (56px) - Default

### Icon in Input
- **Size**: `text-2xl` (24px) - `ICON_SIZES.lg`

## Common Patterns

### Icon with Text
```tsx
<div className={`flex items-center ${SPACING.md}`}>
  <span className={`material-symbols-outlined text-primary ${ICON_SIZES.lg}`}>
    {ICONS.calendar_month}
  </span>
  <p className={TYPOGRAPHY.body.base}>Text</p>
</div>
```

### Card with Icon List
```tsx
<div className={`bg-[#1a2431] ${BORDER_RADIUS.md} ${CARD.padding} ${SPACE_Y.lg}`}>
  <div className={`flex items-center ${SPACING.lg}`}>
    <span className={`material-symbols-outlined text-primary ${ICON_SIZES.lg}`}>
      {ICONS.calendar_month}
    </span>
    <p className={TYPOGRAPHY.body.base}>Content</p>
  </div>
</div>
```

### Section Header
```tsx
<h3 className={`text-white font-bold ${TYPOGRAPHY.heading['4']}`}>
  Section Title
</h3>
```

## Color Reference

- **Primary**: `#006af5` / `primary`
- **Background Dark**: `#0f1823` / `background-dark`
- **Surface Dark**: `#1a2431` / `#1E1E1E`
- **Text Primary**: `#E0E0E0` / `text-white`
- **Text Secondary**: `#9aa9bc` / `text-muted`
- **Border**: `#333` / `border-border`

