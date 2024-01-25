"use client";
import React, { use, useEffect, useState } from "react";
import {
   Button,
   Card,
   CardBody,
   Checkbox,
   Dialog,
   IconButton,
   Option,
   Select,
   Typography,
} from "@material-tailwind/react";
import { GameMap, GameType, Match, Player, Session } from "@/lib/types";
import { createSession } from "@/lib/server-actions/firebase";
import { deepCopy } from "@/utilities/helpers";
import SessionsTable from "@/lib/features/sessions-partials/SessionsTable";
import { useRouter } from "next/navigation";
import PageContainer from "@/lib/common/container/PageContainer";
import { allPlayers, gameTypes } from "@/lib/lookupData";
import { revalidate } from "@/lib/server-actions/revalidate";
import useSocketIO from "@/lib/hooks/useSocketIO";
import CreateNewSession from "@/lib/features/sessions-partials/CreateNewSession";
import FloatingBtnContainer from "@/lib/common/floating-btn-container/FloatingBtnContainer";
import { PlusIcon } from "@heroicons/react/24/solid";
import AnalyticCards from "@/lib/features/analytic-cards/AnalyticCards";

const defaultPlayers: { [player in Player]: boolean } = {
   HafenNation: false,
   "zE eskky": false,
   "zE tthrilla": false,
   YungJaguar: false,
   mcddp15: false,
};

interface Props {
   sessions: Array<Session>;
   matchesPlayed: number;
   wins: number;
   loses: number;
}

const HomeClient = ({ sessions, matchesPlayed, wins, loses }: Props) => {
   const router = useRouter();
   const { socket, socketEmit, eventResponse } = useSocketIO();
   const [modalOpen, setModalOpen] = useState<boolean>(false);

   useEffect(() => {
      console.log("eventResponse:", eventResponse);
   }, [eventResponse]);

   const handleStartNewSession = async (session: Session) => {
      const fbDoc = await createSession(session);
      router.push(`/sessions/${fbDoc?.docId}`);
   };

   const handleReturnToSession = async (sessionId: string) => {
      const path = `/sessions/${sessionId}`;
      await revalidate({ path });
      router.push(path);
   };

   const winPer = !isNaN((wins / matchesPlayed) * 100)
      ? `${Math.round((wins / matchesPlayed) * 100)}%`
      : `0%`;
   let haloMapCount: any = {};
   const matches: any = {};
   sessions?.forEach((session: Session) => {
      for (const matchId in session?.matches) {
         matches[matchId] = session?.matches[matchId];
      }
   });
   const matchIds: Array<string> = Object.keys(matches);
   matchIds.forEach((mId: string) => {
      const match = matches[mId as keyof object];
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
      { title: "Games Played", value: matchesPlayed },
      { title: "Wins / Loses", value: `${wins} - ${loses}` },
      // { title: "Total Loses", value: lossCount },
      { title: "Win %", value: winPer },
      {
         title: "Most Played Map",
         value: mostCommonMap?.join(", ") || "N/A",
         toolTipVal: `${mostCommonMap?.join(", ")} - ${mostCommonMapCount}`,
      },
   ];

   return (
      <PageContainer>
         {/* <div className="flex h-screen items-center justify-center"> */}
         {/* <div className="flex flex-row justify-between items-center">
            <Typography variant="h5" placeholder={undefined}>
               Previous Sessions
            </Typography>
            <Button
               onClick={() => {
                  console.log("emitting message");
                  // socket.emit("sendMsg", "new session being created...");
                  // socketEmit("sendMsg", "YO YO");
                  setModalOpen(true);
               }}
               placeholder={undefined}
            >
               Start New Session
            </Button>
         </div> */}

         <AnalyticCards cards={cards} />

         <SessionsTable
            sessions={sessions}
            onClick={(action: "edit", docId: string) => {
               if (action === "edit") handleReturnToSession(docId);
            }}
         />

         {/* <div className="pb-10"></div> */}

         <CreateNewSession
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            handleStartNewSession={handleStartNewSession}
         />

         <FloatingBtnContainer>
            <Button
               placeholder={undefined}
               onClick={() => {
                  console.log("emitting message");
                  // socket.emit("sendMsg", "new session being created...");
                  // socketEmit("sendMsg", "YO YO");
                  setModalOpen(true);
               }}
               className="flex items-center gap-2"
            >
               <PlusIcon width={24} height={24} color="currentColor" />
               Start New Session
            </Button>
         </FloatingBtnContainer>
      </PageContainer>
   );
};

export default HomeClient;
