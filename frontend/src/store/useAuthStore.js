import { create } from 'zustand';
import authService from '../services/authService';

// ─── Auth Store ───────────────────────────────────────────────────────────────
const useAuthStore = create((set) => ({
  isLoggedIn: authService.isAuthenticated(), // rehydrate from token on page load
  user: authService.getUserFromToken(), // get user info from token

  login: (userData, token) => {
    // Token is already set by authService
    set({ isLoggedIn: true, user: userData });
  },

  logout: () => {
    authService.logout();
    set({ isLoggedIn: false, user: null });
  },

  // Update user data (useful for profile updates)
  updateUser: (userData) => {
    set({ user: userData });
  },

  // Initialize auth state from token
  initializeAuth: () => {
    const isAuthenticated = authService.isAuthenticated();
    const user = authService.getUserFromToken();
    set({ 
      isLoggedIn: isAuthenticated, 
      user: user 
    });
  },
}));

export default useAuthStore;
