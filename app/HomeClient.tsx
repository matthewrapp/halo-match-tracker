"use client";
import React, { useState } from "react";
import {
   Button,
   Card,
   CardBody,
   Checkbox,
   Dialog,
   Option,
   Select,
   Typography,
} from "@material-tailwind/react";
import { GameType, Player, Session } from "@/lib/types";
import { createSession } from "@/lib/server-actions/firebase";
import { deepCopy } from "@/utilities/helpers";
import SessionsTable from "@/lib/features/sessions-table/SessionsTable";
import { useRouter } from "next/navigation";
import PageContainer from "@/lib/common/container/PageContainer";
import { allPlayers, gameTypes } from "@/lib/lookupData";
import { revalidate } from "@/lib/server-actions/revalidate";

const defaultPlayers: { [player in Player]: boolean } = {
   HafenNation: false,
   "zE eskky": false,
   "zE tthrilla": false,
   YungJaguar: false,
};

interface Props {
   sessions: Array<Session>;
   matchesPlayed: number;
   wins: number;
   loses: number;
}

const HomeClient = ({ sessions, matchesPlayed, wins, loses }: Props) => {
   const router = useRouter();
   const [modalOpen, setModalOpen] = useState<boolean>(false);
   const [selectedGameType, setSelectedGameType] =
      useState<GameType>("Ranked Arena");
   const [selectedPlayers, setSelectedPlayers] =
      useState<{ [player in Player]: boolean }>(defaultPlayers);

   const handleStartNewSession = async () => {
      const playersCopy = deepCopy(selectedPlayers);
      for (const player in playersCopy) {
         const playerPlaying = playersCopy[player as Player];
         if (!playerPlaying) delete playersCopy[player as Player];
      }

      const fbDoc = await createSession({
         players: playersCopy,
         matches: {},
         createdAt: new Date(),
      });

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
   const cards = [
      { title: "Games Played", value: matchesPlayed },
      { title: "Total Wins", value: wins },
      { title: "Total Loses", value: loses },
      { title: "Win %", value: winPer },
   ];

   return (
      <PageContainer>
         {/* <div className="flex h-screen items-center justify-center"> */}
         <div className="flex flex-row justify-between items-center">
            <Typography variant="h5" placeholder={undefined}>
               Previous Sessions
            </Typography>
            <Button
               onClick={() => {
                  setModalOpen(true);
               }}
               placeholder={undefined}
            >
               Start New Session
            </Button>
         </div>

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

         <SessionsTable
            sessions={sessions}
            onClick={(action: "edit", docId: string) => {
               if (action === "edit") handleReturnToSession(docId);
            }}
         />

         <Dialog
            dismiss={{
               // @ts-ignore
               outsidePress: (e: any) => {
                  setModalOpen(false);
               },
            }}
            open={modalOpen}
            placeholder={undefined}
            handler={function (value: any): void {
               console.log("handler");
            }}
         >
            <div className="p-4 flex flex-col gap-2">
               <Typography variant="h5" placeholder={undefined}>
                  Configure The Session
               </Typography>
               <hr className="my-2" />
               <Typography variant="h6" placeholder={undefined}>
                  Who's playing?
               </Typography>
               <div className="flex flex-row flex-wrap">
                  {allPlayers?.map((player: Player, i: number) => {
                     return (
                        <Checkbox
                           key={i}
                           label={player}
                           color="blue"
                           crossOrigin={undefined}
                           onClick={() => {
                              const val = !selectedPlayers[player];
                              setSelectedPlayers((prevState: any) => ({
                                 ...prevState,
                                 [player]: val,
                              }));
                           }}
                        />
                     );
                  })}
               </div>
               <Typography variant="h6" placeholder={undefined}>
                  What game type?
               </Typography>
               <Select placeholder={undefined}>
                  {gameTypes?.map((gt: GameType) => {
                     return (
                        <Option
                           key={gt}
                           onClick={() => {
                              setSelectedGameType(gt);
                           }}
                        >
                           {gt}
                        </Option>
                     );
                  })}
               </Select>
               <hr className="my-2" />
               <Button onClick={handleStartNewSession} placeholder={undefined}>
                  Let's Get Some Dubs
               </Button>
            </div>
         </Dialog>
      </PageContainer>
   );
   // const [record, setRecord] = useState<{ wins: number; loses: number }>();

   // return (
   //    <div className="flex flex-col gap-4">
   //       <div className="text-center">
   //          <Typography placeholder={undefined} variant="h3">
   //             Wins
   //          </Typography>
   //          <div className="flex flex-row items-center gap-4 justify-center">
   //             <IconButton placeholder={"Minus"}>
   //                <MinusIcon className="h-5 w-5" />
   //             </IconButton>
   //             <div>{record?.wins || 0}</div>
   //             <IconButton placeholder={"Plus"}>
   //                <PlusIcon className="h-5 w-5" />
   //             </IconButton>
   //          </div>
   //       </div>
   //       <div className="text-center">
   //          <Typography placeholder={undefined} variant="h3">
   //             Loses
   //          </Typography>
   //          <div className="flex flex-row items-center gap-4 justify-center">
   //             <IconButton placeholder={"Minus"}>
   //                <MinusIcon className="h-5 w-5" />
   //             </IconButton>
   //             <div>{record?.loses || 0}</div>
   //             <IconButton placeholder={"Plus"}>
   //                <PlusIcon className="h-5 w-5" />
   //             </IconButton>
   //          </div>
   //       </div>
   //    </div>
   // );
};

export default HomeClient;
