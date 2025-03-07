"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { joinGame } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { IGame } from "@/types/game";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarIcon, MapPinIcon, UsersIcon, PhoneIcon, Clock } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


interface GameModalProps {
  game: IGame;
  isOpen: boolean;
  onClose: () => void;
}

const JoinGameModal: React.FC<GameModalProps> = ({ game, isOpen, onClose }) => {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  
  // Format date for better display
  const formattedDate = new Date(game.date).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Calculate player slots and percentage filled
  const playersFilled = game.playerJoined.length;
  const playersNeeded = game.playerNeeded;
  const playersRemaining = Math.max(0, playersNeeded - playersFilled);
  const filledPercentage = Math.min(100, Math.round((playersFilled / playersNeeded) * 100));
  
  // Determine game status for visual cues
  const isFull = game.status === "full" || playersRemaining === 0;
  
  // Joining game function mutation
  const { mutate: handleJoin, isPending } = useMutation({
    mutationFn: () => joinGame(game._id),
    onSuccess: () => {
      toast.success("You have Successfully joined the game!");
      queryClient.invalidateQueries({ queryKey: ["games"] });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to join game");
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader className="pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">{game.sport}</DialogTitle>
            <Badge variant={isFull ? "destructive" : "success"} className="ml-2">
              {isFull ? "Full" : "Open"}
            </Badge>
          </div>
          <DialogDescription className="text-base mt-1">
            Join this exciting {game.sport} game with other players
          </DialogDescription>
        </DialogHeader>
        
        <Separator />
        
        <div className="space-y-4 py-3">
          <div className="flex items-start space-x-3">
            <MapPinIcon className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Location</h4>
              <p className="text-sm text-gray-600">{game.location.address}, {game.location.city}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <CalendarIcon className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Date</h4>
              <p className="text-sm text-gray-600">{formattedDate}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Time</h4>
              <p className="text-sm text-gray-600">{game.time}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <UsersIcon className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Players</h4>
              <div className="mt-1">
                <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full ${isFull ? 'bg-red-500' : 'bg-green-500'}`} 
                    style={{ width: `${filledPercentage}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {playersFilled} of {playersNeeded} players joined
                  {!isFull && playersRemaining > 0 && (
                    <span className="font-medium text-green-600"> ({playersRemaining} spots left)</span>
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <PhoneIcon className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Host Contact</h4>
              <p className="text-sm text-gray-600">{game.hostContact}</p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <DialogFooter className="sm:justify-between flex-row gap-3">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1 sm:flex-none">Cancel</Button>
          </DialogClose>
          
          {isAuthenticated && (
            <Button
              onClick={() => handleJoin()}
              disabled={isPending || isFull}
              className={`flex-1 sm:flex-none ${isFull ? 'bg-gray-500' : ""}`}
            >
              {isPending ? "Joining..." : isFull ? "Game Full" : "Join Game"}
            </Button>
          )}
          
          {!isAuthenticated && (
            <Button variant="secondary" className="flex-1 sm:flex-none">
              Login to Join
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGameModal;