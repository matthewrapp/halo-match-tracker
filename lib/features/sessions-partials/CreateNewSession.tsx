"use client";
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
   mcddp15: false,
};

interface Props {
   modalOpen: boolean;
   setModalOpen: (bool: boolean) => void;
   handleStartNewSession: (session: Session) => void;
   gameTypes: Array<GameType>;
   players: Array<Player>;
}

const CreateNewSession = ({
   modalOpen,
   setModalOpen,
   handleStartNewSession,
   gameTypes,
   players,
}: Props) => {
   const [selectedPlayers, setSelectedPlayers] =
      useState<{ [player in Player]: boolean }>();
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
               {players?.map((player: Player, i: number) => {
                  return (
                     <Checkbox
                        key={i}
                        label={player}
                        color="blue"
                        crossOrigin={undefined}
                        onClick={() => {
                           let val = true;
                           const exists =
                              selectedPlayers &&
                              typeof selectedPlayers[player] === "boolean";
                           if (exists) val = !selectedPlayers[player];

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
            <Select label="Select Game Type" placeholder={undefined}>
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
