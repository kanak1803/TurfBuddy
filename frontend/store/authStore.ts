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
        "http://localhost:5001/api/users/check",
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
        "http://localhost:5001/api/users/logout",
        {},
        { withCredentials: true }
      );
      set({ isAuthenticated: false, userId: null });
    } catch (error) {
      console.log("Logout failed", error);
    }
  },
}));
