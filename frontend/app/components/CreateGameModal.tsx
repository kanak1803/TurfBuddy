"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { createGame } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";
import { Calendar, MapPin, Users } from "lucide-react";

const CreateGameModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (state: boolean) => void;
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

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle sport selection change
  const handleSportChange = (value: string) => {
    setFormData({ ...formData, sport: value });
  };

  // Create game mutation
  const mutation = useMutation({
    mutationFn: createGame,
    onSuccess: () => {
      toast.success("Game created successfully");
      queryClient.invalidateQueries({ queryKey: ["games"] });
      setFormData({
        sport: "",
        address: "",
        city: "",
        date: "",
        time: "",
        playerNeeded: "",
      });
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create game.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error("You must be logged in to create a game.");
      return;
    }

    const gameData = {
      sport: formData.sport,
      location: {
        address: formData.address,
        city: formData.city,
      },
      date: formData.date,
      time: formData.time,
      playerNeeded: Number(formData.playerNeeded),
    };

    mutation.mutate(gameData);
  };

  if (!open) return null;

  const sportOptions = [
    { value: "football", label: "Football", icon: "⚽" },
    { value: "basketball", label: "Basketball", icon: "🏀" },
    { value: "cricket", label: "Cricket", icon: "🏏" },
    { value: "hockey", label: "Hockey", icon: "🏑" },
    { value: "badminton", label: "Badminton", icon: "🏸" },
  ];

  // Get tomorrow's date as default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent className="sm:max-w-md  p-0 overflow-hidden rounded-lg">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold flex items-center">
            Create a New Game
          </DialogTitle>
          {/* <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </Button> */}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Sport Selection */}
          <div className="space-y-2">
            <Label htmlFor="sport" className="text-sm font-medium">
              Sport Type
            </Label>
            <Select
              onValueChange={handleSportChange}
              value={formData.sport}
              required
            >
              <SelectTrigger id="sport" className="w-full">
                <SelectValue placeholder="Select a sport" />
              </SelectTrigger>
              <SelectContent>
                {sportOptions.map((sport) => (
                  <SelectItem key={sport.value} value={sport.value}>
                    <div className="flex items-center">
                      <span className="mr-2">{sport.icon}</span>
                      {sport.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center text-gray-700">
              <MapPin size={16} className="mr-2 text-primary" />
              Location Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">
                  City
                </Label>
                <Input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  required
                  className="w-full"
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Venue/Address
                </Label>
                <Input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter venue or address"
                  required
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Time Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center text-gray-700">
              <Calendar size={16} className="mr-2 text-primary" />
              When is the game?
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  name="date"
                  min={tomorrowStr}
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>

              {/* Time */}
              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Players Needed */}
          <div className="space-y-2">
            <Label
              htmlFor="playerNeeded"
              className="text-sm font-medium flex items-center"
            >
              <Users size={16} className="mr-2 text-primary" />
              Players Needed
            </Label>
            <Input
              id="playerNeeded"
              type="number"
              name="playerNeeded"
              value={formData.playerNeeded}
              onChange={handleChange}
              min="2"
              max="30"
              placeholder="How many players do you need?"
              required
              className="w-full"
            />
          </div>
        </form>

        <DialogFooter className="px-6 py-4  border-t flex justify-end gap-2">
          <Button
            variant="destructive"
            onClick={() => setOpen(false)}
            className="border-gray-300"
          >
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} className="px-4">
            Create Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGameModal;
