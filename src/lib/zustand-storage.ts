import { createJSONStorage } from 'zustand/middleware'

/**
 * SSR-safe localStorage storage for Zustand persist middleware.
 * Returns a no-op storage on the server to avoid "localStorage is not defined" errors.
 */
const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

export const ssrSafeStorage = createJSONStorage(() => {
  if (typeof window === 'undefined') return noopStorage
  return localStorage
})
