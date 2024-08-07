"use client";

import { GameType, Player, PlayerConfig, Session } from "@/lib/types";
import { deepCopy } from "@/utilities/helpers";
import {
   Button,
   Checkbox,
   Dialog,
   Option,
   Select,
   Typography,
} from "@material-tailwind/react";
import React, { useContext, useState } from "react";
import { SessionsContext } from "./SessionsContextProvider";
import { getLocalIsoToday } from "../[id]/(partials)/MatchContextProvider";

interface Props {
   gameTypes: Array<GameType>;
   players: Array<Record<Player, PlayerConfig>>;
}

const CreateNewSession = ({ gameTypes, players }: Props) => {
   const { setSessionModalOpen, sessionModalOpen, handleCreateNewSession } =
      useContext(SessionsContext);

   const [selectedPlayers, setSelectedPlayers] =
      useState<{ [player in Player]: boolean }>();
   const [selectedGameType, setSelectedGameType] =
      useState<GameType>("Ranked Arena");

   return (
      <Dialog
         dismiss={{
            // @ts-ignore
            outsidePress: (e: any) => {
               setSessionModalOpen(false);
            },
         }}
         open={sessionModalOpen}
         placeholder={undefined}
         // handler={function (value: any): void {
         //    console.log("handler");
         // }}
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
               {players?.map((player, i) => {
                  const name = Object.keys(player)[0] as Player;
                  return (
                     <Checkbox
                        key={i}
                        label={name}
                        color="blue"
                        crossOrigin={undefined}
                        onClick={() => {
                           let val = true;
                           const exists =
                              selectedPlayers &&
                              typeof selectedPlayers[name] === "boolean";
                           if (exists) val = !selectedPlayers[name];

                           setSelectedPlayers((prevState: any) => ({
                              ...prevState,
                              [name]: val,
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

                  handleCreateNewSession({
                     players: playersCopy,
                     gameType: selectedGameType,
                     matches: {},
                     // createdAt: new Date()?.toISOString(), // will reset createdAt in context provider
                     createdAt: getLocalIsoToday(new Date()),
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