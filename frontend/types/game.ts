export interface IGame {
  _id: string;
  sport: string;
  location: {
    address: string;
    city: string;
  };
  date: Date;
  time: string;
  playerNeeded: number;
  host: string;
  hostContact: string;
  playerJoined: string[];
  status: "open" | "full" | "played";
}
