import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full border-b p-4 shadow-md bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href={"/"} className="text-xl font-bold">
          TrufBuddy
        </Link>
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4">
            <NavigationMenuItem>
              <Link href={"/"} className="text-gray-700 hover:text-black">
                Home
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href={"/games"} className="text-gray-700 hover:text-black">
                Games
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href={"/profile"}
                className="text-gray-700 hover:text-black"
              >
                Profile
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Button asChild>
          <Link href={"/login"}>Login</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
