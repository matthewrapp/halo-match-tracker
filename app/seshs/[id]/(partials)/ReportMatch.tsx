"use client";

import { v4 as uuidv4 } from "uuid";
import { GameMap, GameMode } from "@/lib/types";
import { Button, Dialog, Option, Select, Typography } from "@material-tailwind/react";
import React, { useContext, useEffect, useState } from "react";
import { getLocalIsoToday, MatchContext } from "./MatchContextProvider";

const didWinArr: Array<"Yes" | "No"> = ["Yes", "No"];

interface Props {
   gameModes: Array<GameMode>;
   maps: Array<GameMap>;
}

const ReportMatch = ({ gameModes, maps }: Props) => {
   const { matchConfig, setMatchConfig, matchModalOpen, setMatchModalOpen, handleSaveMatch } =
      useContext(MatchContext);
   const [initData, setInitData] = useState<boolean>(false);

   const [selectedGameMode, setSelectedGameMode] = useState<GameMode | undefined>();
   const [selectedMap, setSelectedMap] = useState<GameMap | undefined>();
   const [didWin, setDidWin] = useState<boolean | undefined>();
   const [matchId, setMatchId] = useState<string>();

   useEffect(() => {
      if (matchModalOpen && matchConfig && !initData) {
         const currMatchId = Object.keys(matchConfig)[0];
         setSelectedGameMode(matchConfig[currMatchId].gameMode);
         setDidWin(matchConfig[currMatchId].win);
         setSelectedMap(matchConfig[currMatchId]?.map);
         setMatchId(currMatchId);
         setInitData(true);
      } else if (!matchModalOpen) {
         reset();
      }
   }, [matchConfig, matchModalOpen]);

   const reset = () => {
      setSelectedGameMode(undefined);
      setDidWin(undefined);
      setSelectedMap(undefined);
      setMatchId(undefined);
      setInitData(false);
      setMatchConfig(undefined);
   };

   const handleReportMatch = async (e: any) => {
      if (!selectedGameMode || typeof didWin !== "boolean" || !selectedMap) return;
      const newMatchId = uuidv4();

      await handleSaveMatch(
         {
            gameMode: selectedGameMode,
            map: selectedMap,
            win: didWin,
            createdAt: matchId && matchConfig ? matchConfig[matchId]?.createdAt : getLocalIsoToday(new Date()),
         },
         matchId || newMatchId
      )
         .then(() => {
            setMatchModalOpen(false);
         })
         .catch((err) => {
            console.log("err saving match...", err);
         });
   };

   const onMobile = typeof document !== "undefined" && "ontouchstart" in document?.documentElement;

   return (
      <Dialog
         dismiss={{
            // @ts-ignore
            outsidePress: (e: any) => {
               setMatchModalOpen(false);
               reset();
            },
         }}
         open={matchModalOpen}
         placeholder={undefined}
         handler={function (value: any): void {
            console.log("handler");
         }}
      >
         <div className="p-4 flex flex-col gap-3">
            <Typography
               variant="h5"
               placeholder={undefined}
               onPointerEnterCapture={undefined}
               onPointerLeaveCapture={undefined}
            >
               Report Match Details
            </Typography>
            <hr className="my-2" />
            <div className="flex flex-col gap-1">
               <Typography
                  variant="h6"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
               >
                  Game Mode?
               </Typography>
               <Select
                  placeholder={undefined}
                  label="Select the Game Mode"
                  value={selectedGameMode}
                  onChange={(value: any) => {
                     setSelectedGameMode(value);
                  }}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
               >
                  {gameModes?.map((gm: GameMode) => {
                     return (
                        <Option key={gm} value={gm}>
                           {gm}
                        </Option>
                     );
                  })}
               </Select>
            </div>
            <div className="flex flex-col gap-1">
               <Typography
                  variant="h6"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
               >
                  Map?
               </Typography>
               <Select
                  placeholder={undefined}
                  label="Select the Map Played"
                  value={selectedMap}
                  onChange={(value: any) => {
                     setSelectedMap(value);
                  }}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
               >
                  {maps?.map((map: GameMap) => {
                     return (
                        <Option key={map} value={map}>
                           {map}
                        </Option>
                     );
                  })}
               </Select>
            </div>
            <div className="flex flex-col gap-1">
               <Typography
                  variant="h6"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
               >
                  Did You Win?
               </Typography>
               <Select
                  placeholder={undefined}
                  label="Did you win the match?"
                  value={typeof didWin === "boolean" ? (didWin ? "Yes" : "No") : undefined}
                  onChange={(value: any) => {
                     let tempWin = false;
                     if (value === "Yes") tempWin = true;
                     setDidWin(tempWin);
                  }}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
               >
                  {didWinArr?.map((option: "Yes" | "No") => {
                     return (
                        <Option key={option} value={option}>
                           {option}
                        </Option>
                     );
                  })}
               </Select>
            </div>

            <hr className="my-2" />
            <Button
               onTouchEnd={(e: any) => {
                  onMobile && handleReportMatch(e);
               }}
               onMouseUp={(e: any) => {
                  !onMobile && handleReportMatch(e);
               }}
               placeholder={undefined}
               onPointerEnterCapture={undefined}
               onPointerLeaveCapture={undefined}
            >
               Save Match
            </Button>
         </div>
      </Dialog>
   );
};

export default ReportMatch;
