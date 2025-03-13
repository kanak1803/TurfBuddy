"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import React, { FC, useState } from "react";
import JoinGameModal from "./JoinGameModal";
import { IGame } from "@/types/game";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { deleteGame, leaveGame } from "@/services/api";
import { queryClient } from "@/lib/queryClient";
import {
  Calendar,
  Clock,
  DoorOpen,
  LogOut,
  MapPin,
  Trash2,
  Users,
} from "lucide-react";

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

  const formattedDate = new Date(game.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

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
      toast.error("Unauthorized: Please log in");
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

  // Calculate progress for player joined
  const playerProgress = (game.playerJoined.length / game.playerNeeded) * 100;

  return (
    <Card className="overflow-hidden rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
    
      <div className="relative">
        <Image
          src={sportImages[game.sport.toLowerCase()] || sportImages.default}
          alt={game.sport}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

       
        <Badge
          className={`absolute top-3 right-3 px-3 py-1 text-white ${
            game.status === "open"
              ? "bg-green-500"
              : game.status === "full"
              ? "bg-red-500"
              : "bg-gray-500"
          }`}
        >
          {game.status.toUpperCase()}
        </Badge>

        <div className="absolute bottom-3 left-3 right-3">
          <h2 className="text-2xl font-extrabold text-white drop-shadow-2xl uppercase">
            {game.sport}
          </h2>
          <p className="text-white/90 text-sm font-medium">
            Host: {game.host?.name || "Anonymous"}
          </p>
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="pt-4 px-4">
        <div className="space-y-3">
          <div className="flex items-center text-gray-700">
            <MapPin className="w-4 h-4 mr-2 text-primary" />
            <span className="font-medium truncate">
              {game.location.address},{game.location.city}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center text-gray-700">
              <Calendar className="w-4 h-4 mr-2 text-primary" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Clock className="w-4 h-4 mr-2 text-primary" />
              <span>{game.time}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center text-gray-700">
                <Users className="w-4 h-4 mr-2 text-primary" />
                <span>
                  {game.playerJoined.length}/{game.playerNeeded} players
                </span>
              </div>
              <span className="text-xs font-medium">
                {Math.round(playerProgress)}% full
              </span>
            </div>
            {/* Player Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  playerProgress < 50
                    ? "bg-green-500"
                    : playerProgress < 80
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${playerProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Card Footer with Actions */}
      <CardFooter className="px-4 pb-4 pt-2 flex flex-col gap-2">
        {isHost && (
          <Button
            onClick={handleDeleteGame}
            variant="destructive"
            className="w-full"
          >
            <Trash2 className="mr-2" size={16} />
            Delete Game
          </Button>
        )}

        {game.status === "open" && !hasJoined && (
          <Button onClick={handleOpenModal} className="w-full">
            <DoorOpen className="mr-2" size={16} />
            Join Game
          </Button>
        )}

        {hasJoined && !isHost && (
          <Button
            onClick={handleLeaveGame}
            variant="outline"
            className="w-full border-gray-300"
          >
            <LogOut className="mr-2" size={16} />
            Leave Game
          </Button>
        )}
      </CardFooter>

      {/* Join Modal */}
      <JoinGameModal
        game={game}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Card>
  );
};
