"use client";

import { getUserProfile } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { ProfileGameCard } from "../components/ProfileGameCard";
import { IGame } from "@/types/game";
import { Calendar, Loader, MapPin, Trophy, Users } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const ProfilePage = () => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("hosted");

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

  // Calculate user statistics
  const calculateStats = () => {
    if (!user) return null;

    const totalGames =
      (user.gameHosted?.length || 0) + (user.gameJoined?.length || 0);
    const totalSports = new Set([
      ...(user.gameHosted || []).map((game: IGame) => game.sport),
      ...(user.gameJoined || []).map((game: IGame) => game.sport),
    ]).size;

    // Count cities played in
    const cities = new Set([
      ...(user.gameHosted || []).map((game: IGame) => game.location.city),
      ...(user.gameJoined || []).map((game: IGame) => game.location.city),
    ]).size;

    return { totalGames, totalSports, cities };
  };

  const stats = user ? calculateStats() : null;

  if (isPending)
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <Loader className="size-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading your profile...</p>
      </div>
    );

  if (error)
    return (
      <div className="max-w-3xl mx-auto mt-20 p-8 text-center">
        <div className="bg-secondary/20 p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold text-destructive mb-2">
            Unable to load profile
          </h2>
          <p className="text-foreground/80 mb-4">
            There was a problem retrieving your profile information. Please try
            again later.
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="mx-auto"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
      {/* Profile Card */}
      <Card className="mb-8 overflow-hidden border-border bg-card/50">
        <div className="h-32 bg-gradient-to-r from-primary/80 to-secondary" />
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end -mt-16 mb-6 gap-4 sm:gap-6">
            <div className="relative inline-block">
              <div className="rounded-full border-4 border-background p-1 bg-secondary">
                <Image
                  src={user.profileImage || "/defaultprofile.png"}
                  alt="Profile Picture"
                  width={120}
                  height={120}
                  className="rounded-full bg-background object-cover h-28 w-28"
                />
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex-1">
              <h1 className="text-3xl font-bold text-foreground">
                {user.name}
              </h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <Button className="mt-4 sm:mt-0">Edit Profile</Button>
          </div>

          <Separator className="my-6 bg-border" />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Card className="border-border bg-secondary/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {stats?.totalGames || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Games</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-secondary/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-accent" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {stats?.totalSports || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Sports Played
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-secondary/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <MapPin className="h-8 w-8 text-accent" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {stats?.cities || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Cities</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Card>

      {/* Games Tabs Section */}
      <Tabs
        defaultValue="hosted"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-foreground">Your Games</h2>
          <TabsList className="bg-secondary/40">
            <TabsTrigger
              value="hosted"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Trophy className="size-4" />
              <span>Hosted ({user.gameHosted?.length || 0})</span>
            </TabsTrigger>
            <TabsTrigger
              value="joined"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Calendar className="size-4" />
              <span>Joined ({user.gameJoined?.length || 0})</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="hosted" className="mt-0">
          {user.gameHosted && user.gameHosted.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.gameHosted.map((game: IGame) => (
                <ProfileGameCard key={game._id} game={game} />
              ))}
            </div>
          ) : (
            <Card className="border-border bg-card/50">
              <CardContent className="pt-6 pb-8 text-center">
                <div className="flex flex-col items-center gap-3 max-w-md mx-auto">
                  <Trophy className="size-16 text-muted-foreground/40" />
                  <CardTitle className="text-xl mt-2 text-foreground">
                    No Games Hosted Yet
                  </CardTitle>
                  <CardDescription className="text-center text-muted-foreground">
                    Start hosting games to connect with players in your area and
                    enjoy your favorite sports together.
                  </CardDescription>
                  <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                    Host Your First Game
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="joined" className="mt-0">
          {user.gameJoined && user.gameJoined.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.gameJoined.map((game: IGame) => (
                <ProfileGameCard key={game._id} game={game} />
              ))}
            </div>
          ) : (
            <Card className="border-border bg-card/50">
              <CardContent className="pt-6 pb-8 text-center">
                <div className="flex flex-col items-center gap-3 max-w-md mx-auto">
                  <Calendar className="size-16 text-muted-foreground/40" />
                  <CardTitle className="text-xl mt-2 text-foreground">
                    No Games Joined Yet
                  </CardTitle>
                  <CardDescription className="text-center text-muted-foreground">
                    Browse available games in your area and join to start
                    playing with others who share your interests.
                  </CardDescription>
                  <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href={'/'}>Find Games</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
