"use client";

import { GameType, Player, Session } from "@/lib/types";
import React, { createContext, useState } from "react";

type SessionContextType = {
   sessionData: Session;
   setSessionData: React.Dispatch<React.SetStateAction<Session>>;
   sessionId: string;
   players: Array<Player>;
   gameType: GameType;
};
export const SessionContext = createContext({} as SessionContextType);

type Props = { children: React.ReactNode; session: Session };
const SessionContextProvider = ({ children, session }: Props) => {
   const [sessionData, setSessionData] = useState<Session>(session);

   return (
      <SessionContext.Provider
         value={{
            sessionData,
            setSessionData,
            sessionId: sessionData?.id as string,
            players: Object.keys(sessionData?.players) as Array<Player>,
            gameType: sessionData?.gameType,
         }}
      >
         {children}
      </SessionContext.Provider>
   );
};

export default SessionContextProvider;
