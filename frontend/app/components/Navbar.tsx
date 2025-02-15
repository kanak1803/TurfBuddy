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
            <NavigationMenuItem>
              <Link href={"/profile"} className="hover:text-primary transition">
                Profile
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <Button variant="default" asChild>
          <Link href={"/login"}>Login</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
