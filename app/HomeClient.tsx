"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import { GameType, Player, Session } from "@/lib/types";
import { createSession } from "@/lib/server-actions/firebase";
import SessionsTable from "@/lib/features/sessions-partials/SessionsTable";
import { useRouter } from "next/navigation";
import PageContainer from "@/lib/common/container/PageContainer";
import { revalidate } from "@/lib/server-actions/revalidate";
import useSocketIO from "@/lib/hooks/useSocketIO";
import CreateNewSession from "@/lib/features/sessions-partials/CreateNewSession";
import FloatingBtnContainer from "@/lib/common/floating-btn-container/FloatingBtnContainer";
import { PlusIcon } from "@heroicons/react/24/solid";
import AnalyticCards from "@/lib/features/analytic-cards/AnalyticCards";

// const defaultPlayers: { [player in Player]: boolean } = {
//    HafenNation: false,
//    "zE eskky": false,
//    "zE tthrilla": false,
//    YungJaguar: false,
//    mcddp15: false,
// };

interface Props {
   sessions: Array<Session>;
   matchesPlayed: number;
   wins: number;
   loses: number;
   gameTypes: Array<GameType>;
   players: Array<Player>;
}

const HomeClient = ({
   sessions,
   matchesPlayed,
   wins,
   loses,
   gameTypes,
   players,
}: Props) => {
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

   const allMatches: any = {};
   sessions?.forEach((session: Session) => {
      for (const matchId in session?.matches)
         allMatches[matchId] = session?.matches[matchId];
   });

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

         <AnalyticCards
            wins={wins}
            loses={loses}
            matchesPlayed={matchesPlayed}
            matches={allMatches}
         />

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
            gameTypes={gameTypes}
            players={players}
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
