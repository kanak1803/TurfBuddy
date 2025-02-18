import axios from "axios";
import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean | null;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: null,
  checkAuth: async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/users/check",
        {
          withCredentials: true,
        }
      );
      set({ isAuthenticated: response.data.authenticated });
    } catch (error) {
      console.log(error);
      set({ isAuthenticated: false });
    }
  },
  logout: async () => {
    try {
      await axios.post(
        "http://localhost:5001/api/users/logout",
        {},
        { withCredentials: true }
      );
      set({ isAuthenticated: false });
    } catch (error) {
      console.log("Logout failed", error);
    }
  },
}));
