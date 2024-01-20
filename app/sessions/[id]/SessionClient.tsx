"use client";
import PageContainer from "@/lib/common/container/PageContainer";
import { Match, Player, Session } from "@/lib/types";
import {
   Button,
   Card,
   CardBody,
   IconButton,
   Typography,
} from "@material-tailwind/react";
import React, { useEffect, useRef, useState } from "react";
import Players from "./(partials)/Players";
import ReportMatch from "./(partials)/ReportMatch";
import MatchesTable from "@/lib/features/matches-table/MatchesTable";
import { getSessionById, saveMatch } from "@/lib/server-actions/firebase";
import { useRouter } from "next/navigation";
import { revalidate } from "@/lib/server-actions/revalidate";
import { deepCopy } from "@/utilities/helpers";

interface Props {
   session: Session;
   sessionId: string;
}

const SessionClient = ({ session, sessionId }: Props) => {
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

   const cards = [
      { title: "Games Played", value: gameCount },
      { title: "Total Wins", value: winCount },
      { title: "Total Loses", value: lossCount },
      { title: "Win %", value: winPer },
   ];

   return (
      <>
         <PageContainer className="max-h-[90vh]">
            <Players session={session} />

            <div className="flex flex-row flex-wrap w-full gap-2 bg-gray-50 p-2 rounded-lg">
               {cards?.map((card: any, i: number) => {
                  return (
                     <Card
                        className="w-[calc(50%-8px)] sm:max-w-[200px]"
                        placeholder={undefined}
                        key={i}
                     >
                        <CardBody
                           className="text-center p-2"
                           placeholder={undefined}
                        >
                           <Typography
                              variant="h6"
                              color="blue-gray"
                              className="mb-1 font-normal"
                              placeholder={undefined}
                           >
                              {card?.title}
                           </Typography>
                           <Typography
                              variant="h4"
                              color="blue-gray"
                              className=""
                              placeholder={undefined}
                           >
                              {card?.value}
                           </Typography>
                        </CardBody>
                     </Card>
                  );
               })}
            </div>
            <MatchesTable
               data={sessionData?.matches || []}
               onClick={(action: "edit" | "delete", id: string) => {
                  if (action === "edit") handleEditMatch(id);
                  else if (action === "delete") handleDeleteMatch(id);
               }}
            />
            <div className="fixed bottom-0 right-0 p-2 flex flex-row gap-2 bg-transparent">
               <IconButton
                  placeholder={undefined}
                  size="lg"
                  color="teal"
                  onClick={() => {
                     setModalOpen(true);
                  }}
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 24 24"
                     fill="currentColor"
                     className="w-6 h-6"
                  >
                     <path
                        fillRule="evenodd"
                        d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                        clipRule="evenodd"
                     />
                  </svg>
               </IconButton>
               <hr />
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
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 24 24"
                     fill="currentColor"
                     className="w-6 h-6"
                  >
                     <path
                        fillRule="evenodd"
                        d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm5.03 4.72a.75.75 0 0 1 0 1.06l-1.72 1.72h10.94a.75.75 0 0 1 0 1.5H10.81l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 0Z"
                        clipRule="evenodd"
                     />
                  </svg>
               </IconButton>
            </div>
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
