"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore"; // Zustand store

import { Loader } from "lucide-react";
import Games from "./components/Games";

const HomePage = () => {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show loader while authentication is being checked
  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Games />
    </div>
  );
};

export default HomePage;
