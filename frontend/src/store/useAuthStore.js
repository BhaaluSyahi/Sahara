import { create } from 'zustand';

// ─── Token helpers ────────────────────────────────────────────────────────────
// TODO: swap localStorage for a more secure httpOnly cookie approach
// once your backend supports it. For now localStorage is fine for dev.
const TOKEN_KEY = 'sahara_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// ─── Auth Store ───────────────────────────────────────────────────────────────
const useAuthStore = create((set) => ({
  isLoggedIn: !!getToken(), // rehydrate from localStorage on page load
  user: null,

  login: (userData, token) => {
    if (token) setToken(token);
    set({ isLoggedIn: true, user: userData });
  },

  logout: () => {
    clearToken();
    set({ isLoggedIn: false, user: null });
  },
}));

export default useAuthStore;
