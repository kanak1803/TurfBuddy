import React from "react";
import Image from "next/image";
import LoginForm from "../components/LoginForm";
import Link from "next/link";

const LoginPage = () => {
  // Sample profile images - in a real app, these would come from your database
  const profileImages = [
    "https://randomuser.me/api/portraits/men/39.jpg",
    "https://randomuser.me/api/portraits/men/19.jpg",
    "https://randomuser.me/api/portraits/men/9.jpg",
    "https://randomuser.me/api/portraits/men/89.jpg",
    
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Left Section - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to continue your journey with us
            </p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Dont have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="https://images.unsplash.com/photo-1509077613385-f89402467146?q=80&w=1940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Athletes in action"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex flex-col items-center justify-center p-8">
          <h2 className="text-white text-4xl font-bold text-center max-w-md mb-4">
            Join our community of passionate players
          </h2>
          <p className="text-white/80 text-center max-w-md">
            Connect with athletes, track your progress, and take your game to
            the next level
          </p>

          {/* Social proof with actual profile images */}
          <div className="mt-8 flex items-center space-x-4">
            <div className="flex -space-x-3">
              {profileImages.map((src, i) => (
                <div
                  key={i}
                  className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white"
                >
                  <Image
                    src={src}
                    alt={`Community member ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="text-white text-sm">
              Join <span className="font-bold">2,000+</span> athletes already on
              the platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
