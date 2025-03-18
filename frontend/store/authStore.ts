import axios from "axios";
import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean | null;
  userId: string | null;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  isCheckingAuth: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: null,
  userId: null,
  isCheckingAuth: true,
  checkAuth: async () => {
    try {
      const response = await axios.get(
        "https://turfbuddy.onrender.com/api/users/check",
        {
          withCredentials: true,
        }
      );
      set({
        isAuthenticated: response.data.authenticated,
        userId: response.data.user?.userId,
      });
    } catch (error) {
      console.log(error);
      set({ isAuthenticated: false, userId: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    try {
      await axios.post(
        "https://turfbuddy.onrender.com/api/users/logout",
        {},
        { withCredentials: true }
      );
      set({ isAuthenticated: false, userId: null });
      window.location.href = "/login";
    } catch (error) {
      console.log("Logout failed", error);
    }
  },
}));
