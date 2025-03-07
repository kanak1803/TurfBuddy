"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import CreateGameModal from "./CreateGameModal";
import { BadgePlus, LogIn, UserPlus, UserRoundPen, Volleyball } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, checkAuth, logout } = useAuthStore();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <nav className="bg-secondary text-secondary-foreground p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Site Title */}
        <Link href={"/"} className="text-xl font-bold">
          TurfBuddy
        </Link>

        {/* Authentication Buttons */}
        <div className="flex space-x-2">
          {isAuthenticated ? (
            <>
              <Button onClick={() => setOpenModal(true)} variant="default">
                <span><BadgePlus/></span> Create Game
              </Button>
              <CreateGameModal open={openModal} setOpen={setOpenModal} />
              <Button variant="default" asChild>
                <Link href={"/profile"}><span><UserRoundPen /></span>Profile</Link>
              </Button>
              <Button variant="destructive" onClick={logout}>
              <span><LogIn /></span> Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="default" asChild>
                <Link href={"/"}><Volleyball />Games</Link>
              </Button>
              <Button variant="default" asChild>
                <Link href={"/login"}><LogIn />Login</Link>
              </Button>
              <Button variant="default" asChild>
                <Link href={"/register"}><UserPlus />Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
