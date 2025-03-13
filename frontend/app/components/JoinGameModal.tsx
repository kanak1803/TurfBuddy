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
import { CalendarIcon, MapPinIcon, UsersIcon, PhoneIcon, Clock, Trophy, Timer, AlertCircle } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
  
  // Calculate if game is happening soon (within 24 hours)
  const gameDate = new Date(game.date);
  const now = new Date();
  const hoursDifference = (gameDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  const isHappeningSoon = hoursDifference > 0 && hoursDifference < 24;

  // Get sport-specific color
  const getSportColor = (sport) => {
    const sportColors = {
      "Basketball": "bg-orange-500",
      "Football": "bg-green-600",
      "Soccer": "bg-emerald-600",
      "Tennis": "bg-yellow-500",
      "Volleyball": "bg-blue-500",
      "Baseball": "bg-red-600",
      "Cricket": "bg-teal-600",
      "Golf": "bg-green-700",
      "Hockey": "bg-blue-700",
      "Rugby": "bg-amber-700",
      // Default color if sport isn't in the list
      "default": "bg-purple-600"
    };
    
    return sportColors[sport] || sportColors.default;
  };
  
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
      <DialogContent className="sm:max-w-md md:max-w-lg p-0 overflow-hidden rounded-lg">
        {/* Header with sport-specific styling */}
        <div className={`bg-secondary px-6 py-4 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="h-6 w-6" />
              <DialogTitle className="text-2xl font-bold uppercase">{game.sport}</DialogTitle>
            </div>
            <Badge 
              variant={isFull ? "destructive" : isHappeningSoon ? "outline" : "success"} 
              className={`${isFull ? "bg-red-700" : isHappeningSoon ? "bg-amber-500" : "bg-green-700"} text-white border-0`}
            >
              {isFull ? "Full" : isHappeningSoon ? "Starting Soon" : "Open"}
            </Badge>
          </div>
          <DialogDescription className="text-white/90 text-base mt-1">
            Join this exciting {game.sport} game with other players
          </DialogDescription>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="rounded-full bg-gray-100 p-2">
                <MapPinIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Location</h4>
                <p className="text-sm text-white">{game.location.address}, {game.location.city}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="rounded-full bg-gray-100 p-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Date</h4>
                <p className="text-sm text-white">{formattedDate}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="rounded-full bg-gray-100 p-2">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Time</h4>
                <p className="text-sm text-white">{game.time}</p>
                {isHappeningSoon && (
                  <div className="flex items-center mt-1 text-amber-600 text-xs">
                    <Timer className="h-3 w-3 mr-1" />
                    Happening soon!
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="rounded-full bg-gray-100 p-2">
                <UsersIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Players</h4>
                  <span className="text-sm font-medium">
                    {playersFilled}/{playersNeeded}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full ${isFull ? 'bg-red-500' : filledPercentage > 80 ? 'bg-amber-500' : 'bg-green-500'}`} 
                      style={{ width: `${filledPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-sm text-gray-600">
                      {!isFull && playersRemaining > 0 && (
                        <span className="font-medium text-green-600">{playersRemaining} spots left</span>
                      )}
                      {isFull && (
                        <span className="font-medium text-red-600">No spots left</span>
                      )}
                    </p>
                    {filledPercentage > 80 && !isFull && (
                      <p className="text-xs text-amber-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Filling up fast!
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Player avatars */}
                {playersFilled > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Players joined:</p>
                    <div className="flex -space-x-2">
                      {Array.from({ length: Math.min(playersFilled, 5) }).map((_, i) => (
                        <Avatar key={i} className="border-2 border-white h-8 w-8">
                          <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                            P{i+1}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {playersFilled > 5 && (
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 border-2 border-white text-xs">
                          +{playersFilled - 5}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="rounded-full bg-gray-100 p-2">
                <PhoneIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Host Contact</h4>
                <p className="text-sm text-white">{game.hostContact}</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <DialogFooter className="sm:justify-between flex-row gap-3 pt-2">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1 sm:flex-none hover:bg-red-600">Cancel</Button>
            </DialogClose>
            
            {isAuthenticated && (
              <Button
                onClick={() => handleJoin()}
                disabled={isPending || isFull}
                className={`flex-1 sm:flex-none ${isFull ? 'bg-gray-500 hover:bg-gray-600' : "bg-primary"}`}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGameModal;