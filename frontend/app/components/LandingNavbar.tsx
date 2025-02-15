import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const LandingNavbar = () => {
  console.log("LandingNavbar rendered!");
  return (
    <>
      <nav className="absolute top-0 left-0 w-full p-4 bg-transparent">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href={"/"} className="text-2xl font-bold text-white">
            TrufBuddy
          </Link>

          {/* Get Started Button */}
          <Button
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-80 transition"
            asChild
          >
            <Link href={"/login"}>Login</Link>
          </Button>
          <Button
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-80 transition"
            asChild
          >
            <Link href={"/register"}>Get Started!</Link>
          </Button>
        </div>
      </nav>
    </>
  );
};

export default LandingNavbar;
