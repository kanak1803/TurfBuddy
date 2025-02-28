"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
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
import { createGame } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";

// const gameSchema = z.object({
//   sport: z.string().min(1, "Sport Name is Required"),
//   address: z.string().min(1, "Address is Required"),
//   city: z.string().min(1, "City is Required"),
//   date: z.string().min(1, "Date is required"),
//   time: z.string().min(1, "Time is required"),
//   playerNeeded: z.number().min(1, "At least 1 player is needed"),
// });

// type GameFormValues = z.infer<typeof gameSchema>;

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

  //create game mutation
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"}>Create Game</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-2-md">
        <DialogHeader>
          <DialogTitle>Create a Game</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sport Selection */}
          <div>
            <Label>Sport</Label>
            <Select
              onValueChange={handleSportChange}
              value={formData.sport}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="football">Football</SelectItem>
                <SelectItem value="basketball">Basketball</SelectItem>
                <SelectItem value="cricket">Cricket</SelectItem>
                <SelectItem value="hockey">Hockey</SelectItem>
                <SelectItem value="Badminton">Badminton</SelectItem>
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
            <Button type="submit">Create Game</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGameModal;
