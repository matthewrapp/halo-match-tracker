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
   | "Ranked Slayer"
   | "League Play"
   | "Tournament Play"
   | "Other";

export type GameMap =
   | "Aquarious"
   | "Argyle"
   | "Empyrean"
   | "Catalyst"
   | "Forbidden"
   | "Live Fire"
   | "Recharge"
   | "Solitude"
   | "Streets"
   | "Other";

export type Player =
   | "zE tthrilla"
   | "zE eskky"
   | "HafenNation"
   | "YungJaguar"
   | "mcddp15"
   | "Cnasty703"
   | "Steelblade01"
   | "AG3NTUNO"
   | "II RCKLSS"
   | "Weld4me";

export type PlayerConfig = {
   color: PlayerColor;
};

export type PlayersConfig = Record<Player, PlayerConfig>;

export type Match = {
   // id: string;
   gameMode: GameMode;
   win: boolean;
   map: GameMap | undefined;
   createdAt: Date | string;
};

export type Session = {
   id?: string;
   players: Array<Player>;
   gameType: GameType;
   // matches: Array<Match>;
   matches: { [id: string]: Match };
   createdAt: Date | string;
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

export type PlayerColor = "blue" | "green" | "orange" | "red" | "pink" | "cyan" | "purple" | "gray";
