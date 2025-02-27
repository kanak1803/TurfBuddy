export interface IPlayer{
    _id:string
    name:string
    email:string
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
  host: string;
  hostContact: string;
  playerJoined: IPlayer[];
  status: "open" | "full" | "played";
}
