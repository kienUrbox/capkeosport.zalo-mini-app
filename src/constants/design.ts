/**
 * Design System Constants
 * Chuẩn hóa icons, font sizes, spacing cho toàn bộ app
 */

// Icon Sizes
export const ICON_SIZES = {
  xs: 'text-base', // 16px
  sm: 'text-lg', // 18px
  md: 'text-xl', // 20px
  lg: 'text-2xl', // 24px - Default
  xl: 'text-3xl', // 30px
  '2xl': 'text-4xl', // 36px
  '3xl': 'text-5xl', // 48px
} as const

// Font Sizes
export const FONT_SIZES = {
  xs: 'text-xs', // 12px
  sm: 'text-sm', // 14px
  base: 'text-base', // 16px
  lg: 'text-lg', // 18px
  xl: 'text-xl', // 20px
  '2xl': 'text-2xl', // 24px
  '3xl': 'text-3xl', // 30px
  '4xl': 'text-4xl', // 36px
  '5xl': 'text-5xl', // 48px
} as const

// Spacing
export const SPACING = {
  xs: 'gap-1', // 4px
  sm: 'gap-2', // 8px
  md: 'gap-3', // 12px
  lg: 'gap-4', // 16px
  xl: 'gap-6', // 24px
  '2xl': 'gap-8', // 32px
} as const

export const PADDING = {
  xs: 'p-2', // 8px
  sm: 'p-3', // 12px
  md: 'p-4', // 16px - Default
  lg: 'p-6', // 24px
  xl: 'p-8', // 32px
} as const

export const MARGIN = {
  xs: 'm-2',
  sm: 'm-3',
  md: 'm-4',
  lg: 'm-6',
  xl: 'm-8',
} as const

export const SPACE_Y = {
  xs: 'space-y-1',
  sm: 'space-y-2',
  md: 'space-y-3',
  lg: 'space-y-4', // Default
  xl: 'space-y-6',
  '2xl': 'space-y-8',
} as const

// Border Radius
export const BORDER_RADIUS = {
  none: 'rounded-none',
  sm: 'rounded', // 0.5rem - 8px
  md: 'rounded-lg', // 1rem - 16px - Default
  lg: 'rounded-xl', // 1.5rem - 24px
  xl: 'rounded-2xl', // 2rem - 32px
  '2xl': 'rounded-3xl', // 3rem - 48px
  full: 'rounded-full',
} as const

// Header Styles
export const HEADER = {
  height: 'h-16', // 64px
  padding: 'px-4 py-2',
  titleSize: 'text-lg', // 18px
  titleWeight: 'font-bold',
  titleTracking: 'tracking-[-0.015em]',
  iconSize: ICON_SIZES.lg, // 24px
  iconButtonSize: 'size-10', // 40px
} as const

// Button Styles
export const BUTTON = {
  height: {
    sm: 'h-10', // 40px
    md: 'h-12', // 48px - Default
    lg: 'h-14', // 56px
  },
  padding: {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  },
  fontSize: {
    sm: 'text-sm',
    md: 'text-base', // Default
    lg: 'text-lg',
  },
  iconSize: ICON_SIZES.md, // 20px
  borderRadius: BORDER_RADIUS.md, // rounded-lg
} as const

// Card Styles
export const CARD = {
  padding: PADDING.md, // p-4
  borderRadius: BORDER_RADIUS.md, // rounded-lg
  gap: SPACING.lg, // gap-4
} as const

// Input Styles
export const INPUT = {
  height: {
    sm: 'h-10',
    md: 'h-12',
    lg: 'h-14', // Default
  },
  padding: 'px-4 py-3',
  fontSize: 'text-base',
  borderRadius: BORDER_RADIUS.md,
  iconSize: ICON_SIZES.lg, // 24px
} as const

// Typography
export const TYPOGRAPHY = {
  heading: {
    '1': 'text-3xl font-bold leading-tight tracking-[-0.015em]',
    '2': 'text-2xl font-bold leading-tight tracking-[-0.015em]',
    '3': 'text-xl font-bold leading-tight tracking-[-0.015em]',
    '4': 'text-lg font-bold leading-tight tracking-[-0.015em]',
  },
  body: {
    base: 'text-base font-normal leading-normal',
    sm: 'text-sm font-normal leading-normal',
  },
  caption: 'text-xs font-normal leading-normal',
} as const

// Common Icon Names - Using Material Icons (hosted by Zalo CDN)
// Full list: https://fonts.google.com/icons
export const ICONS = {
  // Navigation
  arrow_back: 'arrow_back',
  arrow_back_ios_new: 'arrow_back_ios_new',
  chevron_right: 'chevron_right',

  // Actions
  add: 'add',
  close: 'close',
  done: 'done',
  edit: 'edit',
  share: 'share',
  ios_share: 'ios_share',
  search: 'search',
  send: 'send',
  sync: 'sync',
  tune: 'tune',
  unfold_more: 'unfold_more',

  // Match & Sports
  calendar_today: 'calendar_today',
  calendar_month: 'calendar_month',
  schedule: 'schedule',
  location_on: 'location_on',
  stadium: 'stadium',
  map: 'map',
  chat: 'chat',
  chat_bubble: 'chat_bubble',
  scoreboard: 'scoreboard',
  favorite: 'favorite',
  check_circle: 'check_circle',
  event_busy: 'event_busy',
  event_upcoming: 'event',
  history: 'history',

  // Team & Social
  groups: 'groups',
  group_add: 'group_add',
  sports_soccer: 'sports_soccer',
  grass: 'grass',
  signal_cellular_alt: 'signal_cellular_alt',
  shield: 'shield',

  // Gender
  male: 'male',
  female: 'female',
  man: 'man',
  woman: 'woman',

  // UI Elements
  notifications: 'notifications',
  add_photo_alternate: 'add_photo_alternate',
  inbox: 'inbox',
  home: 'home',
  person: 'person',
  swords: 'sports_kabaddi', // Alternative to swords
} as const

