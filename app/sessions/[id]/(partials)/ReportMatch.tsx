"use client";
import { gameModes } from "@/lib/lookupData";
import { v4 as uuidv4 } from "uuid";
import { getSessionById, saveMatch } from "@/lib/server-actions/firebase";
import { GameMode, Match } from "@/lib/types";
import {
   Button,
   Dialog,
   Option,
   Select,
   Typography,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";

const didWinArr: Array<"Yes" | "No"> = ["Yes", "No"];

interface Props {
   modalOpen: boolean;
   setModalOpen: (bool: boolean) => void;
   handleSaveMatch: ({ gameMode, win }: Match, id: string) => void;
   defaultData?: { [id: string]: Match };
}

const ReportMatch = ({
   modalOpen,
   setModalOpen,
   handleSaveMatch,
   defaultData,
}: Props) => {
   const [selectedGameMode, setSelectedGameMode] = useState<
      GameMode | undefined
   >();
   const [didWin, setDidWin] = useState<boolean | undefined>();
   const [matchId, setMatchId] = useState<string>();

   useEffect(() => {
      if (modalOpen && defaultData) {
         const currMatchId = Object.keys(defaultData)[0];
         setSelectedGameMode(defaultData[currMatchId].gameMode);
         setDidWin(defaultData[currMatchId].win);
         setMatchId(currMatchId);
      }
   }, [defaultData, modalOpen]);

   useEffect(() => {
      if (!modalOpen) reset();
   }, [modalOpen]);

   const reset = () => {
      setSelectedGameMode(undefined);
      setDidWin(undefined);
   };

   return (
      <Dialog
         dismiss={{
            // @ts-ignore
            outsidePress: (e: any) => {
               setModalOpen(false);
               reset();
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
               Report Match Details
            </Typography>
            <hr className="my-2" />
            <Typography variant="h6" placeholder={undefined}>
               Game Mode?
            </Typography>
            <Select
               placeholder={undefined}
               label="Select the Game Mode"
               value={selectedGameMode}
               onChange={(value: any) => {
                  setSelectedGameMode(value);
               }}
            >
               {gameModes?.map((gm: GameMode) => {
                  return (
                     <Option key={gm} value={gm}>
                        {gm}
                     </Option>
                  );
               })}
            </Select>
            <Typography variant="h6" placeholder={undefined}>
               Did You Win?
            </Typography>

            <Select
               placeholder={undefined}
               label="Did you win the match?"
               value={
                  typeof didWin === "boolean"
                     ? didWin
                        ? "Yes"
                        : "No"
                     : undefined
               }
               onChange={(value: any) => {
                  let tempWin = false;
                  if (value === "Yes") tempWin = true;
                  setDidWin(tempWin);
               }}
            >
               {didWinArr?.map((option: "Yes" | "No") => {
                  return (
                     <Option key={option} value={option}>
                        {option}
                     </Option>
                  );
               })}
            </Select>
            <hr className="my-2" />
            <Button
               onTouchEnd={async () => {
                  if (!selectedGameMode || typeof didWin !== "boolean") return;
                  const newMatchId = uuidv4();
                  handleSaveMatch(
                     {
                        gameMode: selectedGameMode,
                        win: didWin,
                        createdAt: new Date(),
                     },
                     matchId || newMatchId
                  );
               }}
               placeholder={undefined}
            >
               Save Match
            </Button>
         </div>
      </Dialog>
   );
};

export default ReportMatch;
