import { User } from '@/types/api.types';
import { getTokens } from '@/stores/auth.store';

export interface LaunchResult {
  success: boolean;
  shouldNavigate: boolean;
  navigateTo?: 'login' | 'dashboard';
  error?: string;
}

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;

/**
 * Launching Service
 *
 * Handles initial app loading:
 * - Check for existing token
 * - Load user profile and teams IN PARALLEL
 * - Handle retry logic
 */
class LaunchingService {
  private isInitialized = false;

  /**
   * Main initialization method
   * Checks auth and loads necessary data in parallel
   */
  async initialize(retryCount = 0): Promise<LaunchResult> {
    try {
      // Step 1: Check if user has a valid token
      const hasToken = this.hasValidToken();

      if (!hasToken) {
        return {
          success: true,
          shouldNavigate: true,
          navigateTo: 'login',
        };
      }

      // Step 2: Load profile and teams IN PARALLEL
      const results = await Promise.all([
        this.loadUserProfile(),
        this.loadMyTeams(),
      ]);

      const profileResult = results[0];
      const teamsResult = results[1];

      // Check if any API failed
      if (!profileResult.success) {
        return {
          success: false,
          shouldNavigate: false,
          error: profileResult.error,
        };
      }

      if (!teamsResult.success) {
        return {
          success: false,
          shouldNavigate: false,
          error: teamsResult.error,
        };
      }

      // All data loaded successfully
      this.isInitialized = true;
      return {
        success: true,
        shouldNavigate: true,
        navigateTo: 'dashboard',
      };
    } catch (error: any) {
      console.error('Launching error:', error);
      return {
        success: false,
        shouldNavigate: false,
        error: error.message || 'Không thể tải dữ liệu. Vui lòng thử lại.',
      };
    }
  }

  /**
   * Retry initialization with delay
   */
  async retry(retryCount: number): Promise<LaunchResult> {
    if (retryCount >= MAX_RETRY_ATTEMPTS) {
      return {
        success: false,
        shouldNavigate: false,
        error: 'Đã vượt quá số lần thử lại. Vui lòng đăng nhập lại.',
      };
    }

    // Add delay before retry
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));

    return this.initialize(retryCount);
  }

  /**
   * Check if user has a valid token in auth store
   */
  private hasValidToken(): boolean {
    try {
      // Use getTokens helper from auth store
      const { accessToken } = getTokens();
      return !!accessToken;
    } catch (error) {
      console.error('Error checking token:', error);
      return false;
    }
  }

  /**
   * Load user profile from API and save to auth.store
   */
  private async loadUserProfile(): Promise<{ success: boolean; data?: User; error?: string }> {
    try {
      // Use auth.store.getProfile() which automatically saves to store
      const { useAuthStore } = await import('@/stores/auth.store');
      const user = await useAuthStore.getState().getProfile();

      return { success: true, data: user };
    } catch (error: any) {
      console.error('Error loading profile:', error);
      return {
        success: false,
        error: error.message || 'Lỗi kết nối khi tải thông tin người dùng',
      };
    }
  }

  /**
   * Load user's teams from API and save to store
   * Uses teamStore.fetchMyTeams() which handles smart caching and persistence
   */
  private async loadMyTeams(): Promise<{ success: boolean; error?: string }> {
    try {
      const { useTeamStore } = await import('@/stores/team.store');
      // Use store's fetchMyTeams which saves to store and has smart caching
      await useTeamStore.getState().fetchMyTeams();
      return { success: true };
    } catch (error: any) {
      console.error('Error loading teams:', error);
      return {
        success: false,
        error: error.message || 'Lỗi kết nối khi tải danh sách đội',
      };
    }
  }

  /**
   * Load fonts (Material Icons)
   */
  async loadFonts(): Promise<boolean> {
    return new Promise((resolve) => {
      if ('fonts' in document) {
        const loadFonts = async () => {
          try {
            await Promise.all([
              document.fonts.load('24px Material Icons'),
              document.fonts.load('24px Material Symbols Outlined'),
            ]);
            document.body.classList.add('material-icons-loaded');
            resolve(true);
          } catch (err) {
            console.warn('Font loading failed:', err);
            // Still resolve true to not block the app
            document.body.classList.add('material-icons-loaded');
            resolve(true);
          }
        };
        loadFonts();
      } else {
        // Fallback for browsers without Font Face API
        setTimeout(() => {
          document.body.classList.add('material-icons-loaded');
          resolve(true);
        }, 500);
      }
    });
  }

  /**
   * Reset initialization state
   */
  reset(): void {
    this.isInitialized = false;
  }
}

export const launchingService = new LaunchingService();
export default launchingService;
