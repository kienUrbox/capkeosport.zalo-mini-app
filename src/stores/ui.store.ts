import { create } from 'zustand';

interface UIState {
  // Bottom Nav
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;

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

export const useUIStore = create<UIState>()((set) => ({
  // Initial state
  activeTab: 'home',
  isDarkMode: true,
  isModalOpen: false,
  modalContent: null,
  globalLoading: false,
  toast: null,
  isBottomSheetOpen: false,
  bottomSheetContent: null,

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),

  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

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
}));

// Selectors
export const useActiveTab = () => useUIStore((state) => state.activeTab);

export const useIsDarkMode = () => useUIStore((state) => state.isDarkMode);

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
