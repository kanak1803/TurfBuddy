"use client";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/users/check",
          {
            withCredentials: true, // Important! Allows cookies to be sent
          }
        );
        console.log(response);
        setIsAuthenticated(response.data.authenticated);
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);
  return (
    <nav className="bg-secondary text-secondary-foreground p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href={"/"} className="text-xl font-bold">
          TrufBuddy
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4">
            <NavigationMenuItem>
              <Link href={"/"} className="hover:text-primary transition">
                Home
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href={"/games"} className="hover:text-primary transition">
                Games
              </Link>
            </NavigationMenuItem>
            {isAuthenticated && (
              <NavigationMenuItem>
                <Link
                  href={"/profile"}
                  className="hover:text-primary transition"
                >
                  Profile
                </Link>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {!isAuthenticated ? (
          <>
            <Button variant="default" asChild>
              <Link href={"/login"}>Login</Link>
            </Button>
            <Button variant="default" asChild>
              <Link href={"/register"}>Signup</Link>
            </Button>
          </>
        ) : (
          <Button variant="default" asChild>
            <Link href={"/profile"}>Profile</Link>
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
