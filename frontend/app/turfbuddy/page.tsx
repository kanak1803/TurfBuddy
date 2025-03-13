import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ArrowRight, MapPin, Users, Calendar, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <React.Fragment>
      {/* Hero Section */}
      <div className="relative w-full h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1536122985607-4fe00b283652?q=80&w=1868&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Landing Background"
            fill
            className="object-cover"
            quality={100}
            priority
          />
          {/* Improved overlay with gradient for better readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Play More Sports. <span className="text-primary">Meet New Friends.</span>
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-gray-200 max-w-3xl">
            Join pickup games in your area or host your own. TrufBuddy connects sports 
            enthusiasts in over 50 cities nationwide.
          </p>

          {/* Dual CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/">
              <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-medium hover:bg-primary/90 transition flex items-center justify-center gap-2">
                Find Games Near Me <MapPin size={18} />
              </button>
            </Link>
            <Link href="/host">
              <button className="px-8 py-4 bg-white text-black rounded-lg text-lg font-medium hover:bg-gray-100 transition flex items-center justify-center gap-2">
                Host a Game <ArrowRight size={18} />
              </button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={20} fill="#FFD700" color="#FFD700" />
                ))}
              </div>
              <p className="text-gray-300 mt-2">Trusted by 10,000+ athletes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Athletes Love TrufBuddy
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="text-primary" size={24} />
              </div>
              <h3 className="text-xl text-gray-600 font-semibold mb-2">Find Local Games</h3>
              <p className="text-gray-600">
                Discover pickup games happening near you. Filter by sport, skill level, and location.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-600">Meet New Players</h3>
              <p className="text-gray-600">
                Connect with like-minded sports enthusiasts and expand your network.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Calendar className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-600">Host Your Games</h3>
              <p className="text-gray-600">
                Create and manage your own games, invite friends, and track attendees.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get in the Game?
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Join thousands of players who are finding games and making new connections every day.
          </p>
          <Link href="/register">
            <button className="px-8 py-4 bg-white text-primary rounded-lg text-lg font-semibold hover:bg-gray-100 transition">
              Sign Up Free
            </button>
          </Link>
          <p className="text-white/70 mt-4">No credit card required. Get started in minutes.</p>
        </div>
      </section>
    </React.Fragment>
  );
}