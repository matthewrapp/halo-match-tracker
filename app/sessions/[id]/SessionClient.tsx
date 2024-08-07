"use client";

import PageContainer from "@/lib/common/container/PageContainer";
import { GameMap, GameMode, Match, Player, Session } from "@/lib/types";
import { IconButton } from "@material-tailwind/react";
import React, { useEffect, useRef, useState } from "react";
import Players from "../../../lib/features/session-partials/Players";
import ReportMatch from "../../../lib/features/session-partials/ReportMatch";
import MatchesTable from "@/lib/features/session-partials/MatchesTable";
import { getSessionById, saveMatch } from "@/lib/server-actions/firebase";
import { useRouter } from "next/navigation";
import { revalidate } from "@/lib/server-actions/revalidate";
import { deepCopy } from "@/utilities/helpers";
import FloatingBtnContainer from "@/lib/common/floating-btn-container/FloatingBtnContainer";
import {
   ArrowLeftEndOnRectangleIcon,
   PlusIcon,
} from "@heroicons/react/24/solid";
import AnalyticCards from "@/lib/features/analytic-cards/AnalyticCards";
import Matches from "@/lib/features/session-partials/Matches";
import MatchContextProvider from "@/lib/features/session-partials/MatchContextProvider";

interface Props {
   session: Session;
   sessionId: string;
   gameModes: Array<GameMode>;
   maps: Array<GameMap>;
}

const SessionClient = ({ session, sessionId, gameModes, maps }: Props) => {
   const router = useRouter();
   const btnContainerRef = useRef<any>();
   const [sessionData, setSessionData] = useState<Session>(session);
   const [modalOpen, setModalOpen] = useState<boolean>(false);
   const [currPlayers, setCurrPlayers] = useState<Array<Player>>(
      Object.keys(session?.players) as Array<Player>
   );
   const [matchConfig, setMatchConfig] = useState<{ [id: string]: Match }>();

   const handleSaveMatch = async (mToSave: Match, id: string) => {
      const matches = { ...sessionData?.matches };

      if (matches[id]) matches[id] = mToSave;
      else matches[id] = mToSave;

      await saveMatch(sessionId, { matches });
      const updatedSessionData = await getSessionById(sessionId);
      setSessionData(updatedSessionData);
      setModalOpen(false);
   };

   const handleEditMatch = async (matchId: string) => {
      const copy = deepCopy(sessionData?.matches);
      const matchIds = Object.keys(copy);
      const foundMatchId: string | undefined = matchIds?.find(
         (mId: string) => mId === matchId
      );
      setMatchConfig({
         [foundMatchId as string]: copy[foundMatchId as string],
      });
      setModalOpen(true);
   };

   const handleDeleteMatch = async (matchId: string) => {
      const copy = deepCopy(sessionData?.matches);
      const matchIds = Object.keys(copy);
      const foundMatchId: string | undefined = matchIds?.find(
         (mId: string) => mId === matchId
      );
      delete copy[foundMatchId as string];
      await saveMatch(sessionId, { matches: copy });
      const updatedSessionData = await getSessionById(sessionId);
      setSessionData(updatedSessionData);
   };

   useEffect(() => {
      if (!modalOpen) setMatchConfig(undefined);
   }, [modalOpen]);

   const matchIds: Array<string> = Object.keys(sessionData?.matches);
   const wins = matchIds?.filter(
      (id: string) => sessionData?.matches[id]?.win
   )?.length;
   const loses = matchIds?.filter(
      (id: string) => !sessionData?.matches[id]?.win
   )?.length;

   return (
      <>
         <PageContainer className="max-h-[90vh]">
            <Players session={session} />

            <MatchContextProvider matches={sessionData?.matches}>
               <AnalyticCards
                  wins={wins}
                  loses={loses}
                  matchesPlayed={matchIds?.length || 0}
                  matches={sessionData?.matches}
               />
               <Matches
                  handleDeleteMatch={handleDeleteMatch}
                  handleEditMatch={handleEditMatch}
                  sessionData={sessionData}
               />
            </MatchContextProvider>

            <FloatingBtnContainer>
               <IconButton
                  placeholder={undefined}
                  size="lg"
                  color="teal"
                  onClick={() => {
                     setModalOpen(true);
                  }}
               >
                  <PlusIcon width={24} height={24} color="currentColor" />
               </IconButton>
               <IconButton
                  variant="filled"
                  placeholder={undefined}
                  size="lg"
                  color="black"
                  onClick={async () => {
                     const path = "/";
                     await revalidate({ path });
                     router.push(path);
                  }}
               >
                  <ArrowLeftEndOnRectangleIcon
                     width={24}
                     height={24}
                     color="currentColor"
                  />
               </IconButton>
            </FloatingBtnContainer>
         </PageContainer>
         <ReportMatch
            defaultData={matchConfig}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            handleSaveMatch={handleSaveMatch}
            gameModes={gameModes}
            maps={maps}
         />
      </>
   );
};

export default SessionClient;
