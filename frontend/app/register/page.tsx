import React from "react";
import RegisterForm from "../components/RegisterForm";
import Image from "next/image";
import { ArrowRight, Users } from "lucide-react";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground">
      {/* Left Section - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Create an Account</h1>
            <p className="text-muted-foreground">
              Join our community and start tracking your progress today.
            </p>
          </div>
          
          <RegisterForm />
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in <ArrowRight className="inline h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden md:block w-1/2 relative">
        <Image
          src="https://images.unsplash.com/photo-1509077613385-f89402467146?q=80&w=1940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Sports Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 flex flex-col items-center justify-center p-10">
          <div className="max-w-md space-y-4 text-center">
            <h2 className="text-white text-4xl font-bold">
              Join the community of passionate players!
            </h2>
            <p className="text-gray-200 text-lg">
              Connect with other athletes, track your performance, and take your game to the next level.
            </p>
            <div className="flex items-center justify-center space-x-4 py-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-1">
                <Image
                  src="https://randomuser.me/api/portraits/men/39.jpg"
                  width={32}
                  height={32}
                  alt="User avatar"
                  className="rounded-full"
                />
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-1">
                <Image
                  src="https://randomuser.me/api/portraits/men/10.jpg"
                  width={32}
                  height={32}
                  alt="User avatar"
                  className="rounded-full"
                />
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-1">
                <Image
                  src="https://randomuser.me/api/portraits/men/59.jpg"
                  width={32}
                  height={32}
                  alt="User avatar"
                  className="rounded-full"
                />
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-1 flex items-center justify-center">
                <span className="text-white text-xs font-medium px-2">+1.5k</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;