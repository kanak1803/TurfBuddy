"use client";

import { fetchGames } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface IGame {
  _id: string;
  sport: string;
  location: {
    city: string;
  };
  playerNeeded: number;
}

const Games = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["games"],
    queryFn: fetchGames,
  });

  console.log(data)

  const games = data?.games || [];
  console.log(games)

  return (
    <ul>
      {Array.isArray(games) && games.length > 0 ? (
        games.map((game) => (
          <li key={game._id} className="p-4 border rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">{game.sport}</h2>
            <p>Location: {game.location.city}</p>
            <p>Players Needed: {game.playerNeeded}</p>
          </li>
        ))
      ) : (
        <p>No games available</p>
      )}
    </ul>
  );

  console.log(games);

  if (isLoading) return <p>...Loading</p>;
  if (error) return <p>...Error while loading the game</p>;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Available Games</h1>
      <ul className="mt-4 space-y-4">
        {games?.map((game: IGame) => (
          <li key={game._id} className="p-4 border rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">{game.sport}</h2>
            <p>Location: {game.location.city}</p>
            <p>Players Needed: {game.playerNeeded}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Games;
