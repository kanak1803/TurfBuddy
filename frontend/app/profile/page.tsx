"use client";

import { getUserProfile } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { ProfileGameCard } from "../components/ProfileGameCard";
import { IGame } from "@/types/game";
import { Loader } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProfilePage = () => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const {
    data: user,
    isPending,
    error,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  if (isPending)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  if (error)
    return (
      <p className="text-center mt-10 text-red-500">Error loading profile</p>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      {/* Profile Section */}
      <div className="flex items-center space-x-6 border-b pb-6 mb-6">
        <Image
          src={user.profileImage || "/defaultprofile.png"}
          alt="Profile Picture"
          width={100}
          height={100}
          className="rounded-full border"
        />
        <div>
          <h1 className="text-2xl font-semibold">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Games Hosted Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Games Hosted</h2>
        {user.gameHosted.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {user.gameHosted.map((game: IGame) => (
              <ProfileGameCard key={game._id} game={game} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You haven’t hosted any games yet.</p>
        )}
      </div>

      {/* Games Joined Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Games Joined</h2>
        {user.gameJoined.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {user.gameJoined.map((game: IGame) => (
              <ProfileGameCard key={game._id} game={game} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You haven’t joined any games yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
