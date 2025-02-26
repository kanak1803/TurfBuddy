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
import { IGame } from "@/types/game";

import React from "react";

interface GameModalProps {
  game: IGame;
  isOpen: boolean;
  onClose: () => void;
}

const JoinGameModal: React.FC<GameModalProps> = ({ game, isOpen, onClose }) => {
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
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGameModal;
