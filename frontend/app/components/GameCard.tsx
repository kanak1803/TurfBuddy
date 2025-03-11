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
import { useMutation } from "@tanstack/react-query";
import { deleteGame, leaveGame } from "@/services/api";
import { queryClient } from "@/lib/queryClient";
import { DoorOpen, LogOut, Trash2 } from "lucide-react";

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
  const isHost = game.host?._id === userId;
  const hasJoined = userId
    ? game.playerJoined.some((player) => player._id === userId)
    : false;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    if (!isAuthenticated) {
      toast.error("You need to log in to join a game!");
      return;
    }
    setIsModalOpen(true);
  };

  const deleteMutation = useMutation({
    mutationFn: () => deleteGame(game._id),
    onSuccess: () => {
      toast.success("Game deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
    onError: () => {
      toast.error("Failed to delete game.");
    },
  });

  const leaveMutation = useMutation({
    mutationFn: () => leaveGame(game._id),
    onSuccess: () => {
      toast.success("You have left the game!");
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
    onError: () => {
      toast.error("Failed to leave the game.");
    },
  });

  const handleDeleteGame = () => {
    if (!isAuthenticated || !userId) {
      toast.error("Unauthorized: Please log in.");
      return;
    }

    if (!isHost) {
      toast.error("You can only delete your own games.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this game?")) {
      deleteMutation.mutate();
    }
  };

  const handleLeaveGame = () => {
    if (!isAuthenticated || !userId) {
      toast.error("Unauthorized:Please Logged In");
      return;
    }
    if (!hasJoined) {
      toast.error("You are not part of this game.");
      return;
    }
    if (window.confirm("Are you sure you want to leave this game?")) {
      leaveMutation.mutate();
    }
  };

  return (
    <Card className="overflow-hidden rounded-lg shadow-lg border border-gray-200">
      {/* Game Image */}
      <div className="relative">
        <Image
          src={sportImages[game.sport.toLowerCase()] || sportImages.default}
          alt={game.sport}
          width={400}
          height={200}
          className="w-full h-56 object-cover rounded-t-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-t-lg"></div>
      </div>

      {/* Card Content */}
      <CardHeader className="px-6 pt-4 pb-2">
        <CardTitle className="text-xl font-semibold text-gray-800">
          {game.sport}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pb-6 text-sm text-gray-600">
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            📍{" "}
            <span className="font-medium">
              {game.location.city}, {game.location.address}
            </span>
          </div>
          <div className="flex items-center gap-2">
            📅 <span>{new Date(game.date).toDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            ⏰ <span>{game.time}</span>
          </div>
          <div className="flex items-center gap-2">
            👥{" "}
            <span>
              {game.playerJoined.length}/{game.playerNeeded} players joined
            </span>
          </div>
          <Badge
            className={`mt-2 w-fit px-3 py-1 text-white ${
              game.status === "open"
                ? "bg-green-500"
                : game.status === "full"
                ? "bg-red-500"
                : "bg-gray-500"
            }`}
          >
            {game.status}
          </Badge>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-col gap-2">
          {isHost && (
            <Button
              onClick={handleDeleteGame}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              <Trash2 className="mr-2" size={16} />
              Delete Game
            </Button>
          )}
          {game.status === "open" && !hasJoined && (
            <Button
              onClick={handleOpenModal}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              <DoorOpen className="mr-2" size={16} />
              Join Game
            </Button>
          )}
          {hasJoined && !isHost && (
            <Button
              onClick={handleLeaveGame}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              <LogOut className="mr-2" size={16} />
              Leave Game
            </Button>
          )}
        </div>
      </CardContent>

      {/* Join Modal */}
      <JoinGameModal
        game={game}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Card>
  );
};
