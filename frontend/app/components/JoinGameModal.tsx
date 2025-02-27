"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { joinGame } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { IGame } from "@/types/game";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import React from "react";
import { toast } from "sonner";

interface GameModalProps {
  game: IGame;
  isOpen: boolean;
  onClose: () => void;
}

const JoinGameModal: React.FC<GameModalProps> = ({ game, isOpen, onClose }) => {
  console.log(game);
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  //joining game function|| mutation
  const { mutate: handleJoin, isPending } = useMutation({
    mutationFn: () => joinGame(game._id),
    onSuccess: () => {
      toast.success("You have Successfully joined the game!");
      queryClient.invalidateQueries({ queryKey: ["games"] });
      onClose();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to join the game.");
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{game.sport}</DialogTitle>
          <DialogDescription>Details about this game</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <p>
            <span className="font-semibold">Location:</span>{" "}
            {game.location.address}, {game.location.city}
          </p>
          <p>
            <span className="font-semibold">Date & Time:</span>{" "}
            {new Date(game.date).toLocaleDateString()} at {game.time}
          </p>
          <p>
            <span className="font-semibold">Players Needed:</span>{" "}
            {game.status === "full"
              ? "No more players needed"
              : game.playerNeeded - game.playerJoined.length}
          </p>
          <p>
            <span className="font-semibold">Host Contact:</span>{" "}
            {game.hostContact}
          </p>
        </div>
        <div className="flex justify-end space-x-2">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>

          {isAuthenticated && (
            <Button
              onClick={() => handleJoin()}
              disabled={isPending || game.playerJoined.includes("USER_ID")}
              className="bg-green-500 text-white"
            >
              {isPending ? "Joining..." : "Join Game"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGameModal;
