"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import React, { FC, useState } from "react";
import JoinGameModal from "./JoinGameModal";
import { IGame } from "@/types/game";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

interface GameCardProps {
  game: IGame;
}

const sportImages: Record<string, string> = {
  football: "/images/football.jpg",
  basketball: "/images/basketball.jpg",
  tennis: "/images/tennis.jpg",
  cricket: "/images/cricket.jpg",
  default: "/images/default.jpg",
};

export const GameCard: FC<GameCardProps> = ({ game }) => {
  const { isAuthenticated, userId } = useAuthStore();
  const hasJoined = userId
    ? game.playerJoined.some((player) => player._id === userId)
    : false;
  const handleOpenModal = () => {
    if (!isAuthenticated) {
      toast.error("You need to log in to join a game!");
      return;
    }
    setIsModalOpen(true);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Card>
      <Image
        src={sportImages[game.sport.toLowerCase()] || sportImages.default}
        alt={game.sport}
        width={400}
        height={200}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <CardHeader>
        <CardTitle>{game.sport}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <div>
          📍 {game.location.city}, {game.location.address}
        </div>
        <div className="text-sm">📅 {new Date(game.date).toDateString()}</div>
        <div className="text-sm">⏰ {game.time}</div>
        <div className="text-sm">
          👥 {game.playerJoined.length}/{game.playerNeeded} players joined
        </div>
        <Badge
          className={`mt-2 ${
            game.status === "open"
              ? "bg-green-500"
              : game.status === "full"
              ? "bg-red-500"
              : "bg-gray-500"
          }`}
        >
          {game.status}
        </Badge>
        {/* Join Button (only if game is open) */}
        {game.status === "open" && (
          <Button
            onClick={handleOpenModal}
            className="mt-4 w-full"
            disabled={hasJoined}
          >
            {hasJoined ? "Already Joined" : "Join Game"}
          </Button>
        )}
        <JoinGameModal
          game={game}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </CardContent>
    </Card>
  );
};
