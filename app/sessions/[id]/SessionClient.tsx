"use client";
import PageContainer from "@/lib/common/container/PageContainer";
import { GameMap, Match, Player, Session } from "@/lib/types";
import {
   Button,
   Card,
   CardBody,
   IconButton,
   Tooltip,
   Typography,
} from "@material-tailwind/react";
import React, { useEffect, useRef, useState } from "react";
import Players from "../../../lib/features/session-partials/Players";
import ReportMatch from "../../../lib/features/session-partials/ReportMatch";
import MatchesTable from "@/lib/features/session-partials/MatchesTable";
import { getSessionById, saveMatch } from "@/lib/server-actions/firebase";
import { useRouter } from "next/navigation";
import { revalidate } from "@/lib/server-actions/revalidate";
import { deepCopy } from "@/utilities/helpers";
import useSocketIO from "@/lib/hooks/useSocketIO";
import FloatingBtnContainer from "@/lib/common/floating-btn-container/FloatingBtnContainer";
import {
   ArrowLeftEndOnRectangleIcon,
   PlusIcon,
} from "@heroicons/react/24/solid";
import AnalyticCards from "@/lib/features/analytic-cards/AnalyticCards";

interface Props {
   session: Session;
   sessionId: string;
}

const SessionClient = ({ session, sessionId }: Props) => {
   const router = useRouter();
   const btnContainerRef = useRef<any>();
   const { socket } = useSocketIO();
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

   // map
   // how bad we won or lost
   // - ranking
   // most played maps
   // most played game modes

   useEffect(() => {
      if (!modalOpen) setMatchConfig(undefined);
   }, [modalOpen]);

   const matchIds: Array<string> = Object.keys(sessionData?.matches);
   const gameCount = matchIds?.length || 0;
   const winCount = matchIds?.filter(
      (id: string) => sessionData?.matches[id]?.win
   )?.length;
   const lossCount = matchIds?.filter(
      (id: string) => !sessionData?.matches[id]?.win
   )?.length;
   const winPer = !isNaN((winCount / gameCount) * 100)
      ? `${Math.round((winCount / gameCount) * 100)}%`
      : `0%`;
   let haloMapCount: any = {};
   matchIds.forEach((mId: string) => {
      const match = sessionData?.matches[mId];
      if (!match?.map) return;
      if (!haloMapCount[match.map]) haloMapCount[match.map] = 1;
      else haloMapCount[match.map] += 1;
   });
   let mostCommonMapCount: number = 0;
   let mostCommonMap: Array<GameMap | undefined> = [];
   for (const map in haloMapCount) {
      if (haloMapCount[map] > mostCommonMapCount)
         mostCommonMapCount = haloMapCount[map];
   }
   for (const map in haloMapCount) {
      if (haloMapCount[map] === mostCommonMapCount)
         mostCommonMap.push(map as GameMap);
   }

   const cards = [
      { title: "Games Played", value: gameCount },
      { title: "Wins / Loses", value: `${winCount} - ${lossCount}` },
      // { title: "Total Loses", value: lossCount },
      { title: "Win %", value: winPer },
      {
         title: "Most Played Map",
         value: mostCommonMap?.join(", ") || "N/A",
         toolTipVal: `${mostCommonMap?.join(", ")} - ${mostCommonMapCount}`,
      },
   ];

   return (
      <>
         <PageContainer className="max-h-[90vh]">
            <Players session={session} />

            <AnalyticCards cards={cards} />

            <MatchesTable
               data={sessionData?.matches || []}
               onClick={(action: "edit" | "delete", id: string) => {
                  if (action === "edit") handleEditMatch(id);
                  else if (action === "delete") handleDeleteMatch(id);
               }}
            />
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
         />
      </>
   );
};

export default SessionClient;
