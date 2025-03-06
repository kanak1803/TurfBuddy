import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IGame } from "@/types/game";
import Image from "next/image";
import { FC } from "react";

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

export const ProfileGameCard: FC<GameCardProps> = ({ game }) => {
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
        <div>📅 {new Date(game.date).toDateString()}</div>
        <div>⏰ {game.time}</div>
        <div>
          👥 {game.playerJoined.length}/{game.playerNeeded} players joined
        </div>
        <Badge
          className={`mt-2 ${
            game.status === "open" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {game.status}
        </Badge>
      </CardContent>
    </Card>
  );
};
