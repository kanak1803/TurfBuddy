"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import CreateGameModal from "./CreateGameModal";
import {
  BadgePlus,
  LogIn,
  LogOut,
  Menu,
  UserCircle,
  UserPlus,
  UserRoundPen,
  Volleyball,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { isAuthenticated, checkAuth, logout, isCheckingAuth } =
    useAuthStore();
  const [openModal, setOpenModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2">
            <Link href={"/"} className="flex items-center space-x-2">
              <Volleyball className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                TurfBuddy
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" asChild>
              <Link href="/" className="flex items-center gap-2">
                <Volleyball className="h-4 w-4" />
                Games
              </Link>
            </Button>

            {isCheckingAuth ? (
              <Button variant="ghost" disabled>
                Loading...
              </Button>
            ) : isAuthenticated ? (
              <>
                <Button
                  onClick={() => setOpenModal(true)}
                  variant="ghost"
                  className="flex items-center gap-2"
                >
                  <BadgePlus className="h-4 w-4" />
                  Create Game
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <UserCircle className="h-5 w-5 text-primary" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <UserRoundPen className="h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={logout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/register" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Register
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              <Button variant="ghost" asChild className="justify-start">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <Volleyball className="h-5 w-5" />
                  Games
                </Link>
              </Button>

              {isCheckingAuth ? (
                <Button variant="ghost" disabled className="justify-start">
                  Loading...
                </Button>
              ) : isAuthenticated ? (
                <>
                  <Button
                    onClick={() => {
                      setOpenModal(true);
                      setMobileMenuOpen(false);
                    }}
                    variant="ghost"
                    className="justify-start"
                  >
                    <BadgePlus className="h-5 w-5 mr-2" />
                    Create Game
                  </Button>

                  <Button variant="ghost" asChild className="justify-start">
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2"
                    >
                      <UserRoundPen className="h-5 w-5" />
                      Profile
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    className="justify-start text-destructive hover:text-destructive"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2"
                    >
                      <LogIn className="h-5 w-5" />
                      Login
                    </Link>
                  </Button>

                  <Button asChild className="justify-start">
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2"
                    >
                      <UserPlus className="h-5 w-5" />
                      Register
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Game Modal */}
      <CreateGameModal open={openModal} setOpen={setOpenModal} />
    </nav>
  );
};

export default Navbar;
