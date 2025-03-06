export interface IPlayer {
  _id: string;
  name: string;
  email: string;
}

export interface IHost {
  contactNumber: string;
  _id: string;
  name: string;
  email: string;
}

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
  host: IHost;
  hostContact: string;
  playerJoined: IPlayer[];
  status: "open" | "full" | "played";
}
