"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateGame } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { IGame } from "@/types/game";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

const UpdateGameModal = ({
  open,
  setOpen,
  game,
}: {
  open: boolean;
  setOpen: (state: boolean) => void;
  game: IGame; // TypeScript: Replace `any` with your game type
}) => {
  const queryClient = useQueryClient();
  const { userId } = useAuthStore();
  const [formData, setFormData] = useState({
    sport: "",
    address: "",
    city: "",
    date: "",
    time: "",
    playerNeeded: "",
  });

  // Populate form with existing game data when modal opens
  useEffect(() => {
    if (game) {
      setFormData({
        sport: game.sport || "",
        address: game.location?.address || "",
        city: game.location?.city || "",
        date: game.date ? new Date(game.date).toISOString().split("T")[0]:"",
        time: game.time || "",
        playerNeeded: game.playerNeeded?.toString() || "",
      });
    }
  }, [game]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle sport selection change
  const handleSportChange = (value: string) => {
    setFormData({ ...formData, sport: value });
  };

  // Update game mutation
  const mutation = useMutation({
    mutationFn: (updatedGame: any) => updateGame(game._id, updatedGame),
    onSuccess: () => {
      toast.success("Game updated successfully");
      queryClient.invalidateQueries({ queryKey: ["games"] });
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update game.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error("You must be logged in to update a game.");
      return;
    }

    const updatedGameData = {
      sport: formData.sport,
      location: {
        address: formData.address,
        city: formData.city,
      },
      date: formData.date,
      time: formData.time,
      playerNeeded: Number(formData.playerNeeded),
    };

    mutation.mutate(updatedGameData);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-2-md">
        <DialogHeader>
          <DialogTitle>Update Game</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sport Selection */}
          <div>
            <Label>Sport</Label>
            <Select onValueChange={handleSportChange} value={formData.sport}>
              <SelectTrigger>
                <SelectValue placeholder="Select Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="football">Football</SelectItem>
                <SelectItem value="basketball">Basketball</SelectItem>
                <SelectItem value="cricket">Cricket</SelectItem>
                <SelectItem value="hockey">Hockey</SelectItem>
                <SelectItem value="badminton">Badminton</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Address */}
          <div>
            <Label>Address</Label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          {/* City */}
          <div>
            <Label>City</Label>
            <Input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          {/* Date */}
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Time */}
          <div>
            <Label>Time</Label>
            <Input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          {/* Players Needed */}
          <div>
            <Label>Players Needed</Label>
            <Input
              type="number"
              name="playerNeeded"
              value={formData.playerNeeded}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Game</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateGameModal;
