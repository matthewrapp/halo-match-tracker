"use client";
import { allPlayers, gameTypes } from "@/lib/lookupData";
import { GameType, Player, Session } from "@/lib/types";
import { deepCopy } from "@/utilities/helpers";
import {
   Button,
   Checkbox,
   Dialog,
   Option,
   Select,
   Typography,
} from "@material-tailwind/react";
import React, { useState } from "react";

const defaultPlayers: { [player in Player]: boolean } = {
   HafenNation: false,
   "zE eskky": false,
   "zE tthrilla": false,
   YungJaguar: false,
};

interface Props {
   modalOpen: boolean;
   setModalOpen: (bool: boolean) => void;
   handleStartNewSession: (session: Session) => void;
   // handleSaveMatch: ({ gameMode, win }: Match, id: string) => void;
}

const CreateNewSession = ({
   modalOpen,
   setModalOpen,
   handleStartNewSession,
}: Props) => {
   const [selectedPlayers, setSelectedPlayers] =
      useState<{ [player in Player]: boolean }>(defaultPlayers);
   const [selectedGameType, setSelectedGameType] =
      useState<GameType>("Ranked Arena");

   return (
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
            <Button
               onClick={() => {
                  const playersCopy = deepCopy(selectedPlayers);
                  for (const player in playersCopy) {
                     const playerPlaying = playersCopy[player as Player];
                     if (!playerPlaying) delete playersCopy[player as Player];
                  }

                  console.log("here??");
                  handleStartNewSession({
                     players: playersCopy,
                     gameType: selectedGameType,
                     matches: {},
                     createdAt: new Date(),
                  });
               }}
               placeholder={undefined}
            >
               Let's Get Some Dubs
            </Button>
         </div>
      </Dialog>
   );
};

export default CreateNewSession;
