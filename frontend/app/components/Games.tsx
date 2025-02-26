"use client";
import { fetchGames } from "@/services/api";
import { IGame } from "@/types/game";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { GameCard } from "./GameCard";

const Games = () => {
  const {
    data: games,
    isLoading,
    error,
  } = useQuery<IGame[]>({
    queryKey: ["games"],
    queryFn: fetchGames,
  });
  console.log(games);
  if (isLoading) return <p className="text-center mt-10">Loading games...</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-500">Failed to load games.</p>
    );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Available Games</h1>
      <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {games && games.length > 0
          ? games.map((game) => <GameCard key={game._id} game={game} />)
          : "No games available"}
      </div>
    </div>
  );
};

export default Games;
