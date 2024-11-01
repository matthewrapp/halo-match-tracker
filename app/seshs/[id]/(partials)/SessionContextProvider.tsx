"use client";

import { GameType, Player, PlayersConfig, Session } from "@/lib/types";
import React, { createContext, useState } from "react";

type SessionContextType = {
   sessionData: Session;
   setSessionData: React.Dispatch<React.SetStateAction<Session>>;
   sessionId: string;
   sessionPlayers: Array<Player>;
   playersConfig: PlayersConfig;
   gameType: GameType;
};
export const SessionContext = createContext({} as SessionContextType);

type Props = {
   children: React.ReactNode;
   session: Session;
   playersConfig: PlayersConfig;
   sessionPlayers: Array<Player>;
};
const SessionContextProvider = ({ children, session, playersConfig, sessionPlayers }: Props) => {
   const [sessionData, setSessionData] = useState<Session>(session);

   return (
      <SessionContext.Provider
         value={{
            sessionData,
            setSessionData,
            sessionId: sessionData?.id as string,
            sessionPlayers: sessionPlayers,
            playersConfig: playersConfig,
            gameType: sessionData?.gameType,
         }}
      >
         {children}
      </SessionContext.Provider>
   );
};

export default SessionContextProvider;
