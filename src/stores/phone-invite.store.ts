import { create } from 'zustand';
import type {
  PhoneInvite,
  SendPhoneInviteDto,
  RespondPhoneInviteDto,
} from '@/types/api.types';
import { api } from '@/services/api/index';

interface PhoneInviteState {
  // State
  myInvites: PhoneInvite[];
  inviteDetails: Map<string, PhoneInvite>; // inviteId -> details
  isLoading: boolean;
  isLoadingDetails: boolean;
  error: string | null;

  // Track fetched state to prevent duplicate requests
  _fetched: boolean;
  _fetchedDetails: Record<string, boolean>;

  // ========== State Management Actions ==========
  setMyInvites: (invites: PhoneInvite[]) => void;
  setInviteDetails: (inviteId: string, details: PhoneInvite) => void;
  addInvite: (invite: PhoneInvite) => void;
  updateInvite: (inviteId: string, updates: Partial<PhoneInvite>) => void;
  removeInvite: (inviteId: string) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;

  // ========== API Methods ==========

  /**
   * Fetch my invites
   * GET /phone-invites/my-invites
   */
  fetchMyInvites: (forceRefresh?: boolean) => Promise<PhoneInvite[]>;

  /**
   * Get invite details
   * GET /phone-invites/:id
   */
  getInviteDetails: (inviteId: string, forceRefresh?: boolean) => Promise<PhoneInvite>;

  /**
   * Respond to invite
   * POST /phone-invites/:id/respond
   */
  respondInvite: (inviteId: string, action: 'accept' | 'decline') => Promise<void>;

  /**
   * Send phone invite
   * POST /phone-invites/send
   */
  sendPhoneInvite: (data: SendPhoneInviteDto) => Promise<PhoneInvite>;

  /**
   * Cancel invite
   * DELETE /phone-invites/:id
   */
  cancelInvite: (inviteId: string) => Promise<void>;

  /**
   * Resend invite
   * POST /phone-invites/:id/resend
   */
  resendInvite: (inviteId: string) => Promise<PhoneInvite>;
}

export const usePhoneInviteStore = create<PhoneInviteState>((set, get) => ({
  // Initial state
  myInvites: [],
  inviteDetails: new Map(),
  isLoading: false,
  isLoadingDetails: false,
  error: null,
  _fetched: false,
  _fetchedDetails: {},

  // ========== State Management Actions ==========

  setMyInvites: (invites) => set({ myInvites: invites }),

  setInviteDetails: (inviteId, details) =>
    set((state) => {
      const newMap = new Map(state.inviteDetails);
      newMap.set(inviteId, details);
      return { inviteDetails: newMap };
    }),

  addInvite: (invite) =>
    set((state) => ({
      myInvites: [invite, ...state.myInvites],
    })),

  updateInvite: (inviteId, updates) =>
    set((state) => ({
      myInvites: state.myInvites.map((invite) =>
        invite.id === inviteId ? { ...invite, ...updates } : invite
      ),
      inviteDetails: (() => {
        const newMap = new Map(state.inviteDetails);
        const existing = newMap.get(inviteId);
        if (existing) {
          newMap.set(inviteId, { ...existing, ...updates });
        }
        return newMap;
      })(),
    })),

  removeInvite: (inviteId) =>
    set((state) => ({
      myInvites: state.myInvites.filter((invite) => invite.id !== inviteId),
      inviteDetails: (() => {
        const newMap = new Map(state.inviteDetails);
        newMap.delete(inviteId);
        return newMap;
      })(),
    })),

  clearError: () => set({ error: null }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  // ========== API Methods ==========

  /**
   * Fetch my invites
   * GET /phone-invites/my-invites
   */
  fetchMyInvites: async (forceRefresh = false) => {
    try {
      const currentState = get();

      // Skip if already loading
      if (currentState.isLoading) {
        console.log('[PhoneInviteStore] Skipping fetch - already loading');
        return currentState.myInvites;
      }

      // Skip if already fetched UNLESS forceRefresh
      if (!forceRefresh && currentState._fetched) {
        console.log('[PhoneInviteStore] Skipping fetch - already fetched (use forceRefresh=true)');
        return currentState.myInvites;
      }

      set({ isLoading: true, error: null });

      const response = await api.get<PhoneInvite[]>('/phone-invites/my-invites');

      if (response.success && response.data) {
        const invites = Array.isArray(response.data) ? response.data : [];

        set({
          myInvites: invites,
          _fetched: true,
          error: null,
        });

        return invites;
      } else {
        throw new Error(response.error?.message || 'Failed to fetch invites');
      }
    } catch (error: any) {
      const errorMessage = error.error?.message || error.message || 'Không thể tải lời mời';
      set({ error: errorMessage, isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Get invite details
   * GET /phone-invites/:id
   */
  getInviteDetails: async (inviteId, forceRefresh = false) => {
    try {
      const currentState = get();

      // Skip if already fetched UNLESS forceRefresh
      if (!forceRefresh && currentState._fetchedDetails[inviteId]) {
        const cached = currentState.inviteDetails.get(inviteId);
        if (cached) {
          return cached;
        }
      }

      set({ isLoadingDetails: true, error: null });

      const response = await api.get<PhoneInvite>(`/phone-invites/${inviteId}`);

      if (response.success && response.data) {
        // Store in invite details map
        get().setInviteDetails(inviteId, response.data);

        // Update in myInvites if present
        get().updateInvite(inviteId, response.data);

        set({
          _fetchedDetails: {
            ...currentState._fetchedDetails,
            [inviteId]: true,
          },
          error: null,
        });

        return response.data;
      } else {
        throw new Error(response.error?.message || 'Failed to fetch invite details');
      }
    } catch (error: any) {
      const errorMessage = error.error?.message || error.message || 'Không thể tải chi tiết lời mời';
      set({ error: errorMessage, isLoadingDetails: false });
      throw error;
    } finally {
      set({ isLoadingDetails: false });
    }
  },

  /**
   * Respond to invite
   * POST /phone-invites/:id/respond
   */
  respondInvite: async (inviteId, action) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.post<PhoneInvite>(`/phone-invites/${inviteId}/respond`, {
        action,
      } as RespondPhoneInviteDto);

      if (response.success && response.data) {
        // Update invite in myInvites and details
        get().updateInvite(inviteId, response.data);

        // If declined/cancelled/expired, remove from myInvites after a delay
        if (action === 'decline') {
          setTimeout(() => {
            get().removeInvite(inviteId);
          }, 500);
        }
      } else {
        throw new Error(response.error?.message || 'Failed to respond to invite');
      }
    } catch (error: any) {
      const errorMessage = error.error?.message || error.message || 'Không thể phản hồi lời mời';
      set({ error: errorMessage, isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Send phone invite
   * POST /phone-invites/send
   */
  sendPhoneInvite: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.post<PhoneInvite>('/phone-invites/send', data);

      if (response.success && response.data) {
        // Add to myInvites
        get().addInvite(response.data);

        return response.data;
      } else {
        throw new Error(response.error?.message || 'Failed to send invite');
      }
    } catch (error: any) {
      const errorMessage = error.error?.message || error.message || 'Không thể gửi lời mời';
      set({ error: errorMessage, isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Cancel invite
   * DELETE /phone-invites/:id
   */
  cancelInvite: async (inviteId) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.delete(`/phone-invites/${inviteId}`);

      if (response.success) {
        // Update invite status to cancelled
        get().updateInvite(inviteId, { status: 'cancelled' as const });

        // Remove from myInvites after a delay
        setTimeout(() => {
          get().removeInvite(inviteId);
        }, 500);
      } else {
        throw new Error(response.error?.message || 'Failed to cancel invite');
      }
    } catch (error: any) {
      const errorMessage = error.error?.message || error.message || 'Không thể hủy lời mời';
      set({ error: errorMessage, isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Resend invite
   * POST /phone-invites/:id/resend
   */
  resendInvite: async (inviteId) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.post<PhoneInvite>(`/phone-invites/${inviteId}/resend`);

      if (response.success && response.data) {
        // Update invite in myInvites and details
        get().updateInvite(inviteId, response.data);

        return response.data;
      } else {
        throw new Error(response.error?.message || 'Failed to resend invite');
      }
    } catch (error: any) {
      const errorMessage = error.error?.message || error.message || 'Không thể gửi lại lời mời';
      set({ error: errorMessage, isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Selectors
export const useMyInvites = () => usePhoneInviteStore((state) => state.myInvites);

export const useInviteDetails = (inviteId: string) =>
  usePhoneInviteStore((state) => state.inviteDetails.get(inviteId));

export const usePhoneInviteActions = () => {
  const store = usePhoneInviteStore();
  return {
    setMyInvites: store.setMyInvites,
    setInviteDetails: store.setInviteDetails,
    addInvite: store.addInvite,
    updateInvite: store.updateInvite,
    removeInvite: store.removeInvite,
    clearError: store.clearError,
    setLoading: store.setLoading,
    setError: store.setError,
    // API methods
    fetchMyInvites: store.fetchMyInvites,
    getInviteDetails: store.getInviteDetails,
    respondInvite: store.respondInvite,
    sendPhoneInvite: store.sendPhoneInvite,
    cancelInvite: store.cancelInvite,
    resendInvite: store.resendInvite,
  };
};

export default usePhoneInviteStore;
