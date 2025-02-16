import React from "react";
import RegisterForm from "../components/RegisterForm";
import Image from "next/image";

const RegisterPage = () => {
  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Left Section - Form */}
      <div className="w-1/2 flex items-center justify-center p-10">
        <div className="container max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">
            Create an Account
          </h2>
          <RegisterForm />
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="w-1/2 relative">
        <Image
          src="https://images.unsplash.com/photo-1509077613385-f89402467146?q=80&w=1940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Sports Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h2 className="text-white text-3xl font-bold text-center max-w-md">
            Join the community of passionate players!
          </h2>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
