// Cookie utility functions for managing welcome popup state

export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export const setCookie = (name: string, value: string, days: number = 365): void => {
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

export const deleteCookie = (name: string): void => {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
};

export const hasSeenWelcomePopup = (): boolean => {
  return getCookie('ascii-gen-welcome-seen') === 'true';
};

export const markWelcomePopupAsSeen = (): void => {
  setCookie('ascii-gen-welcome-seen', 'true', 365);
};

// Development helper to reset the welcome popup (for testing)
export const resetWelcomePopup = (): void => {
  deleteCookie('ascii-gen-welcome-seen');
  // Reload the page to trigger the popup again
  window.location.reload();
}; 