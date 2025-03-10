"use client";

import { fetchGames } from "@/services/api";
import { IGame } from "@/types/game";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { GameCard } from "./GameCard";
import SideBar from "./SideBar";
import { Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Games = () => {
  const [filters, setFilters] = useState({
    search: "",
    sport: "all",
  });
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const {
    data: games,
    isLoading,
    error,
  } = useQuery<IGame[]>({
    queryKey: ["games"],
    queryFn: fetchGames,
  });

  // Filtering logic
  const filteredGames = games?.filter((game) => {
    const matchesSearch =
      game.sport.toLowerCase().includes(filters.search.toLowerCase()) ||
      game.sport.toLowerCase().includes(filters.search.toLowerCase());
    const matchesSport =
      filters.sport === "all" || game.sport.toLowerCase() === filters.sport;
    return matchesSearch && matchesSport;
  });

  const gamesCount = filteredGames?.length || 0;

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border py-4 px-4 md:px-6">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">
              Available Games
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="md:hidden flex items-center gap-2"
            >
              <Filter size={16} />
              Filters
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 container mx-auto">
          {/* Games Section */}
          <main className="flex-1 p-4 md:p-6">
            {/* Results Summary */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-muted-foreground">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Loading games...
                  </span>
                ) : (
                  `Showing ${gamesCount} ${gamesCount === 1 ? "game" : "games"}`
                )}
              </p>
            </div>

            {/* Loading and Error States */}
            {isLoading && (
              <div className="flex justify-center items-center min-h-[300px]">
                <Loader2 size={32} className="animate-spin text-primary" />
              </div>
            )}

            {error && (
              <div className="text-center mt-10 text-destructive p-8 border border-destructive/20 rounded-lg bg-destructive/10">
                Failed to load games. Please try again later.
              </div>
            )}

            {/* Games Grid */}
            {!isLoading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
                {filteredGames && filteredGames.length > 0 ? (
                  filteredGames.map((game) => (
                    <GameCard key={game._id} game={game} />
                  ))
                ) : (
                  <div className="col-span-full text-center p-10 border border-border rounded-lg bg-secondary/20">
                    <p className="text-muted-foreground">
                      No games match your current filters
                    </p>
                    <Button
                      variant="link"
                      onClick={() => setFilters({ search: "", sport: "all" })}
                      className="mt-2 text-primary"
                    >
                      Reset filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </main>

          {/* Sidebar - Hidden on mobile until toggled */}
          <div
            className={`fixed inset-y-0 right-0 transform ${
              showMobileSidebar ? "translate-x-0" : "translate-x-full"
            } md:translate-x-0 md:static transition-transform duration-300 ease-in-out z-20 md:z-0`}
          >
            <SideBar filters={filters} setFilters={setFilters} />

            {/* Overlay for mobile */}
            {showMobileSidebar && (
              <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm md:hidden z-10"
                onClick={() => setShowMobileSidebar(false)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Games;
