/**
 * Design System Constants
 * Chuẩn hóa spacing, font sizes cho toàn bộ app
 * Scale theo 8px base unit (8, 12, 16, 20, 24, 32, 40, 48)
 */

// ============== SPACING SCALE ==============
/**
 * Scale dựa trên 8px grid system
 * - xs: 4px - micro spacing (icon padding, tight gaps)
 * - sm: 8px - tight spacing (related items)
 * - md: 12px - compact spacing (cards, forms)
 * - lg: 16px - default spacing (sections, components)
 * - xl: 24px - relaxed spacing (between sections)
 * - 2xl: 32px - generous spacing (major sections)
 * - 3xl: 40px - hero spacing
 * - 4xl: 48px - maximum spacing
 */

// Gap spacing (flex/grid gap)
export const SPACING = {
  none: 'gap-0',
  xs: 'gap-1',   // 4px
  sm: 'gap-2',   // 8px
  md: 'gap-3',   // 12px
  lg: 'gap-4',   // 16px
  xl: 'gap-6',   // 24px
  '2xl': 'gap-8', // 32px
  '3xl': 'gap-10', // 40px
} as const

// Padding (internal spacing)
export const PADDING = {
  none: 'p-0',
  xs: 'p-2',     // 8px
  sm: 'p-3',     // 12px
  md: 'p-4',     // 16px - default cho cards
  lg: 'p-6',     // 24px
  xl: 'p-8',     // 32px
} as const

// Vertical spacing (space-y)
export const SPACE_Y = {
  none: 'space-y-0',
  xs: 'space-y-1',   // 4px
  sm: 'space-y-2',   // 8px
  md: 'space-y-3',   // 12px
  lg: 'space-y-4',   // 16px - default
  xl: 'space-y-6',   // 24px
  '2xl': 'space-y-8', // 32px
} as const

// Horizontal spacing (space-x)
export const SPACE_X = {
  none: 'space-x-0',
  xs: 'space-x-1',
  sm: 'space-x-2',
  md: 'space-x-3',
  lg: 'space-x-4',
  xl: 'space-x-6',
} as const

// ============== FONT SIZES ==============
/**
 * Typography scale với 1.25 (major third) ratio
 * - caption: 12px - small text, labels
 * - small: 14px - secondary text
 * - base: 16px - body text (default)
 * - md: 18px - emphasized text
 * - lg: 20px - subtitles
 * - xl: 24px - cards titles, important info
 * - 2xl: 28px - section headings
 * - 3xl: 32px - page headings
 * - 4xl: 36px - hero headings
 */
export const FONT_SIZES = {
  caption: 'text-xs',    // 12px - labels, meta info
  small: 'text-sm',      // 14px - secondary text, descriptions
  base: 'text-base',     // 16px - body text (default)
  md: 'text-lg',         // 18px - emphasized content
  lg: 'text-xl',         // 20px - card titles
  xl: 'text-2xl',        // 24px - section headers
  '2xl': 'text-[28px]',  // 28px - page headings
  '3xl': 'text-[32px]',  // 32px - hero headings
  '4xl': 'text-[36px]',  // 36px - display
} as const

// ============== ICON SIZES ==============
export const ICON_SIZES = {
  xs: 'text-sm',    // 14px - compact icons
  sm: 'text-base',  // 16px - small icons
  md: 'text-lg',    // 18px - medium icons
  lg: 'text-xl',    // 20px - default icons
  xl: 'text-2xl',   // 24px - large icons
  '2xl': 'text-3xl', // 30px - hero icons
} as const

// ============== COMPONENT SPECS ==============

// Section spacing (khoảng cách giữa các section lớn)
export const SECTION = {
  spacing: 'gap-5',      // 20px - khoảng cách giữa sections
  padding: 'px-5',       // 20px - horizontal padding
  titleSize: FONT_SIZES.xl,  // 24px
  titleSpacing: 'mb-4',  // 16px - khoảng cách dưới section title
} as const

// Header Component
export const HEADER = {
  height: 'h-14',         // 56px - standard header height
  padding: 'px-4',       // horizontal 16px (top/bottom handled by safe-area-top CSS)
  titleSize: FONT_SIZES.lg,    // 20px
  iconSize: ICON_SIZES.lg,     // 20px
  iconButtonSize: 'size-9',    // 36px - clickable area
} as const

// Button Component
export const BUTTON = {
  height: {
    sm: 'h-10',   // 40px
    md: 'h-11',   // 44px - default
    lg: 'h-12',   // 48px
  },
  padding: {
    sm: 'px-4 py-2',   // 16px horizontal, 8px vertical
    md: 'px-5 py-2.5', // 20px horizontal, 10px vertical
    lg: 'px-6 py-3',   // 24px horizontal, 12px vertical
  },
  fontSize: {
    sm: FONT_SIZES.small,  // 14px
    md: FONT_SIZES.base,   // 16px
    lg: FONT_SIZES.md,     // 18px
  },
  iconSize: ICON_SIZES.md, // 18px
  borderRadius: 'lg',      // rounded-lg (12px)
  gap: SPACING.sm,         // gap-2 (8px)
} as const

// Card Component
export const CARD = {
  padding: {
    sm: PADDING.sm,     // p-3 (12px)
    md: PADDING.md,     // p-4 (16px) - default
    lg: PADDING.lg,     // p-6 (24px)
  },
  borderRadius: 'lg',   // rounded-xl (12px)
  gap: SPACING.md,      // gap-3 (12px) - internal spacing
  marginBottom: 'mb-4', // 16px - khoảng cách giữa cards
} as const

// Input Component
export const INPUT = {
  height: {
    sm: 'h-10',   // 40px
    md: 'h-11',   // 44px - default
    lg: 'h-12',   // 48px
  },
  padding: 'px-4 py-3',      // horizontal 16px, vertical 12px
  fontSize: FONT_SIZES.base, // 16px
  borderRadius: CARD.borderRadius,
  iconSize: ICON_SIZES.lg,   // 20px
  labelSpacing: 'mb-1.5',    // 6px - label to input gap
  errorSpacing: 'mt-1.5',    // 6px - input to error gap
} as const

// List Item (PlayerCard, TeamCard, etc.)
export const LIST_ITEM = {
  padding: 'p-3',      // 12px
  gap: SPACING.md,     // gap-3 (12px)
  avatarSize: 48,      // 48px avatar
  borderRadius: 'lg',  // rounded-xl
} as const

// ============== TYPOGRAPHY ==============
export const TYPOGRAPHY = {
  heading: {
    page: 'text-[32px] font-bold leading-tight tracking-tight',      // Page title
    section: 'text-2xl font-bold leading-tight tracking-tight',      // Section title
    card: 'text-xl font-bold leading-tight tracking-tight',          // Card title
    small: 'text-lg font-bold leading-tight',                        // Small heading
  },
  body: {
    base: 'text-base font-normal leading-relaxed',      // 16px
    small: 'text-sm font-normal leading-relaxed',       // 14px
  },
  label: 'text-sm font-medium leading-normal',          // 14px - form labels
  caption: 'text-xs font-normal leading-normal',        // 12px - meta info
} as const

// ============== BORDER RADIUS ==============
export const BORDER_RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-lg',      // 8px - small elements
  md: 'rounded-xl',      // 12px - default (buttons, cards, inputs)
  lg: 'rounded-2xl',     // 16px - larger cards
  xl: 'rounded-3xl',     // 24px - hero elements
  full: 'rounded-full',
} as const

// ============== LAYOUT ==============
/**
 * Layout spacing cho fixed elements (header, bottom nav, etc.)
 */
export const LAYOUT = {
  // Header height (bao gồm safe area)
  headerHeight: 'h-14',         // 56px - header content
  headerTotalHeight: 'h-[72px]', // ~72px - bao gồm safe area top

  // Bottom nav height (bao gồm safe area)
  bottomNavHeight: 'h-[72px]',  // 72px - bottom nav content

  // Content padding bottom để tránh bị che bởi bottom nav
  // Dùng pb-safe-with-nav để auto-adjust: safe-area-inset-bottom + 72px
  contentPaddingBottom: 'pb-safe-with-nav',
  contentPaddingBottomStatic: 'pb-24', // 96px - fallback cho devices không có safe area
} as const

// ============== ICON NAMES ==============
export const ICONS = {
  // Navigation
  arrow_back: 'arrow_back',
  arrow_back_ios_new: 'arrow_back_ios_new',
  chevron_right: 'chevron_right',
  chevron_left: 'chevron_left',
  arrow_forward: 'arrow_forward',
  home: 'home',

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
  visibility: 'visibility',
  delete: 'delete',
  check_circle: 'check_circle',
  star: 'star',

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
  event_busy: 'event_busy',
  event: 'event',
  history: 'history',
  sports_soccer: 'sports_soccer',
  bolt: 'bolt',

  // Team & Social
  groups: 'groups',
  group_add: 'group_add',
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
  notifications_active: 'notifications_active',
  add_photo_alternate: 'add_photo_alternate',
  inbox: 'inbox',
  person: 'person',
  more_vert: 'more_vert',
  settings: 'settings',
  help: 'help',
  info: 'info',
} as const

// ============== COLORS ==============
export const FC_COLORS = {
  primary: '#11d473',
  primaryDark: '#0ea65a',
  primaryLight: '#4ae19a',
  bgLight: '#f6f8f7',
  bgDark: '#102219',
  surfaceDark: '#1c2721',
  surfaceLight: '#ffffff',
  borderDark: '#2a3b32',
  textSecondary: '#9db9ab',
} as const

// ============== TEAM CONSTANTS ==============
/**
 * Pitch Types - Loại sân bóng
 * API format: ["Sân 5", "Sân 7", "Sân 11"]
 * UI format: ["5", "7", "11"]
 */
export const PITCH_TYPES = {
  FIVE: 'Sân 5',
  SEVEN: 'Sân 7',
  ELEVEN: 'Sân 11',
} as const

export const PITCH_TYPE_VALUES = [PITCH_TYPES.FIVE, PITCH_TYPES.SEVEN, PITCH_TYPES.ELEVEN] as const;

// UI values (without "Sân " prefix) for easier comparison
export const PITCH_TYPE_UI_VALUES = ['5', '7', '11'] as const;

/**
 * Team Levels - Trình độ đội bóng
 */
export const TEAM_LEVELS = [
  'Mới chơi',
  'Trung bình',
  'Nghiệp dư',
  'Bán chuyên',
  'Chuyên nghiệp',
] as const;

/**
 * Team Gender - Giới tính đội bóng
 * API accepts both Vietnamese format and enum format
 */
export const TEAM_GENDER = {
  MALE: 'Nam',
  FEMALE: 'Nữ',
  MIXED: 'Mixed',
} as const;

/**
 * Convert pitch type from API format to UI format
 * @param pitch - API format like ["Sân 5", "Sân 7", "Sân 11"]
 * @returns UI format like ["5", "7", "11"]
 */
export const formatPitchFromApi = (pitch: string[]): string[] => {
  return pitch.map(p => p.replace('Sân ', '').trim());
};

/**
 * Convert pitch type from UI format to API format
 * @param pitch - UI format like ["5", "7", "11"]
 * @returns API format like ["Sân 5", "Sân 7", "Sân 11"]
 */
export const formatPitchForApi = (pitch: string[]): string[] => {
  return pitch.map(p => `Sân ${p}`);
};

/**
 * Convert gender from API format to display format
 * API returns: "Nam", "Nữ", "Mixed" (already in correct format)
 * Legacy enum support: "MALE", "FEMALE", "MIXED"
 */
export const formatGenderFromApi = (gender: string): string => {
  if (gender === 'MALE') return TEAM_GENDER.MALE;
  if (gender === 'FEMALE') return TEAM_GENDER.FEMALE;
  if (gender === 'MIXED') return TEAM_GENDER.MIXED;
  // Already in correct format
  if (gender === 'Nam' || gender === 'Nữ' || gender === 'Mixed') return gender;
  return TEAM_GENDER.MALE;
};

/**
 * Convert gender from display format to API format
 * API expects: "Nam", "Nữ", "Mixed"
 */
export const formatGenderForApi = (gender: string): 'Nam' | 'Nữ' | 'Mixed' => {
  if (gender === 'Nam') return TEAM_GENDER.MALE;
  if (gender === 'Nữ') return TEAM_GENDER.FEMALE;
  return TEAM_GENDER.MIXED;
};
