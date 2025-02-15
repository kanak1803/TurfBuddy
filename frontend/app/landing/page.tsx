import LandingNavbar from "../components/LandingNavbar";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function LandingPage() {
  return (
    <React.Fragment>
      <div className="relative w-full h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1536122985607-4fe00b283652?q=80&w=1868&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Change this to your actual image
            alt="Landing Background"
            fill
            className="object-cover"
            quality={100}
            priority
          />
          {/* Overlay for better readability */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Transparent Navbar */}
        <LandingNavbar />

        {/* Hero Section */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold">
            Find & Join Sports Games Near You!
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl">
            TrufBuddy helps you connect with players and host games in your
            city.
          </p>

          {/* Call To Action Button */}
          <Link href="/games">
            <button className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-lg font-medium hover:opacity-80 transition">
              Explore Games
            </button>
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
}
