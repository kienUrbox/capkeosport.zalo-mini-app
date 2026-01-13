import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface UIState {
  // Bottom Nav
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: 'light' | 'dark';
  updateEffectiveTheme: () => void;

  // Modals
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;

  // Loading
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;

  // Toast notifications
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;

  // Bottom Sheet
  isBottomSheetOpen: boolean;
  bottomSheetContent: React.ReactNode | null;
  openBottomSheet: (content: React.ReactNode) => void;
  closeBottomSheet: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      activeTab: 'home',
      theme: 'system',
      effectiveTheme: 'dark',
      isModalOpen: false,
      modalContent: null,
      globalLoading: false,
      toast: null,
      isBottomSheetOpen: false,
      bottomSheetContent: null,

      // Actions
      setActiveTab: (tab) => set({ activeTab: tab }),

      setTheme: (theme) => {
        set({ theme });
        // Update effective theme immediately
        get().updateEffectiveTheme();
      },

      updateEffectiveTheme: () => {
        const state = get();
        let resolved: 'light' | 'dark';

        if (state.theme === 'system') {
          if (typeof window !== 'undefined') {
            resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          } else {
            resolved = 'light'; // Default for SSR
          }
        } else {
          resolved = state.theme;
        }

        // Update DOM
        if (typeof document !== 'undefined') {
          const root = document.documentElement;
          if (resolved === 'dark') {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        }

        set({ effectiveTheme: resolved });
      },

      openModal: (content) => set({ isModalOpen: true, modalContent: content }),

      closeModal: () => set({ isModalOpen: false, modalContent: null }),

      setGlobalLoading: (loading) => set({ globalLoading: loading }),

      showToast: (message, type = 'info') =>
        set({ toast: { message, type } }),

      hideToast: () => set({ toast: null }),

      openBottomSheet: (content) =>
        set({ isBottomSheetOpen: true, bottomSheetContent: content }),

      closeBottomSheet: () =>
        set({ isBottomSheetOpen: false, bottomSheetContent: null }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        activeTab: state.activeTab,
      }),
    }
  )
);

// Initialize effective theme on mount
if (typeof window !== 'undefined') {
  // Update effective theme on store mount
  useUIStore.getState().updateEffectiveTheme();

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = () => {
    const state = useUIStore.getState();
    if (state.theme === 'system') {
      useUIStore.getState().updateEffectiveTheme();
    }
  };
  mediaQuery.addEventListener('change', handleChange);
}

// Selectors
export const useActiveTab = () => useUIStore((state) => state.activeTab);

export const useThemeState = () => useUIStore((state) => ({
  theme: state.theme,
  effectiveTheme: state.effectiveTheme,
  setTheme: state.setTheme,
}));

export const useIsDarkMode = () => useUIStore((state) => state.effectiveTheme === 'dark');

export const useModal = () =>
  useUIStore((state) => ({
    isOpen: state.isModalOpen,
    content: state.modalContent,
    open: state.openModal,
    close: state.closeModal,
  }));

export const useToast = () =>
  useUIStore((state) => ({
    toast: state.toast,
    show: state.showToast,
    hide: state.hideToast,
  }));

export const useBottomSheet = () =>
  useUIStore((state) => ({
    isOpen: state.isBottomSheetOpen,
    content: state.bottomSheetContent,
    open: state.openBottomSheet,
    close: state.closeBottomSheet,
  }));

export default useUIStore;
