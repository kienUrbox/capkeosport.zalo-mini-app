/**
 * Zalo Mini App utilities
 * Documentation: https://developers.zalo.me/docs/zalo-mini-app/open/api/open-zalo-chat
 */

/**
 * Open Zalo chat
 * Opens Zalo chat from Mini App using openZaloChat API
 */
export const openZaloChat = async (): Promise<void> => {
  try {
    // Check if running in Zalo Mini App environment
    if (typeof window.openZaloChat !== 'function') {
      console.warn('[Zalo] openZaloChat is not available. Make sure you are testing in Zalo Mini App environment.');
      return;
    }

    await window.openZaloChat();
    console.log('[Zalo] Successfully opened Zalo chat');
  } catch (error) {
    console.error('[Zalo] Failed to open Zalo chat:', error);
  }
};
