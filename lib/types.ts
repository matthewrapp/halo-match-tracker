export type GameMode =
   | "Team Slayer"
   | "Capture the Flag"
   | "King of the Hill"
   | "Oddball"
   | "Extraction"
   | "Strongholds"
   | "Other";

export type GameType =
   | "Ranked Arena"
   | "Ranked Doubles"
   | "Ranked Tactical"
   | "Ranked Snipers"
   | "Other";

export type GameMap =
   | "Aquarious"
   | "Catalyst"
   | "Forbidden"
   | "Live Fire"
   | "Recharge"
   | "Streets"
   | "Other";

export type Player = "zE tthrilla" | "zE eskky" | "HafenNation" | "YungJaguar";

export type Match = {
   // id: string;
   gameMode: GameMode;
   win: boolean;
   map: GameMap | undefined;
   createdAt: Date;
};

export type Session = {
   players: Array<Player>;
   gameType: GameType;
   // matches: Array<Match>;
   matches: { [id: string]: Match };
   createdAt: Date;
};

export type SocketEvent =
   | "sessionInit"
   | "sessionCreated"
   | "matchInit"
   | "matchCreated"
   | "userLanded"
   | "userCreated"
   | "userJoined";

export type SocketEventResponse = {
   [socketEvent in SocketEvent]: {
      gamertag: string | null;
      [key: string]: any;
   };
};
