"use client";

import { GameMap, GameType, Player, PlayerConfig, Session } from "@/lib/types";
import { deepCopy } from "@/utilities/helpers";
import { Button, Checkbox, Dialog, IconButton, Option, Select, Typography } from "@material-tailwind/react";
import React, { useContext, useEffect, useState, useTransition } from "react";
import { SessionsContext } from "./SessionsContextProvider";
import { getLocalIsoToday } from "../[id]/(partials)/MatchContextProvider";
import Table, { TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "@/lib/common/components/Table";
import { unescape } from "querystring";

const TABLE_HEAD = ["Map", "Game Mode", "W/L Ratio", ""];

type Props = {};
const ViewAnalytics = ({}: Props) => {
   const { setAnalyticsModalOpen, analyticsModalOpen, getGameModeMapAnalytics, matchesMap } =
      useContext(SessionsContext);
   const [isPending, startTransition] = useTransition();

   const [analytics, setAnalytics] =
      useState<Record<GameMap, { wins: number; total: number; winPerc: string; gameTypes: Array<string> }>>();

   const data = analytics ? Object.keys(analytics) : [];

   useEffect(() => {
      if (analyticsModalOpen && !analytics) {
         startTransition(() => {
            const { gameModeMapComboAnalytics } = getGameModeMapAnalytics(matchesMap?.allMatches);
            setAnalytics(gameModeMapComboAnalytics);
         });
      } else {
         setAnalytics(undefined);
      }
   }, [analyticsModalOpen]);

   return (
      <Dialog
         dismiss={{
            // @ts-ignore
            outsidePress: (e: any) => {
               setAnalyticsModalOpen(false);
            },
         }}
         open={analyticsModalOpen}
         placeholder={undefined}
      >
         <div className="p-4 flex flex-col gap-2">
            <Typography
               variant="h5"
               placeholder={undefined}
               onPointerEnterCapture={undefined}
               onPointerLeaveCapture={undefined}
            >
               View Game Mode / Map Analytics
            </Typography>
            <hr className="my-2" />
            <div className="table-container max-h-[500px] overflow-auto">
               <Table>
                  <TableHead data={TABLE_HEAD}>
                     {({ item, index }) => {
                        return (
                           <TableHeadCell
                              key={index}
                              className={` border-b border-blue-gray-100 bg-blue-gray-50 p-3 `}
                           >
                              <Typography
                                 variant="small"
                                 color="blue-gray"
                                 className="font-medium leading-none opacity-70"
                                 placeholder={undefined}
                                 onPointerEnterCapture={undefined}
                                 onPointerLeaveCapture={undefined}
                              >
                                 {item}
                              </Typography>
                           </TableHeadCell>
                        );
                     }}
                  </TableHead>
                  <TableBody data={data} loading={isPending}>
                     {(gameModeMap, index) => {
                        const { wins, total, winPerc, gameTypes } = analytics
                           ? analytics[gameModeMap as keyof object]
                           : { wins: 0, total: 0, winPerc: `0%`, gameTypes: [] };

                        const gameModeMapArr = gameModeMap.split("-");
                        const map = gameModeMapArr[0];
                        const gameMode = gameModeMapArr[1];

                        const isLast = index === data?.length - 1;
                        const classes = isLast ? "p-3" : "p-3 border-b border-blue-gray-50 max-w-[200px]";

                        return (
                           <TableRow key={index}>
                              <TableCell className={classes}>
                                 <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-medium"
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                 >
                                    {map || ""}
                                 </Typography>
                              </TableCell>
                              <TableCell className={classes}>
                                 <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-medium"
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                 >
                                    {gameMode || ""}{" "}
                                    <span className="font-light italic">({gameTypes?.join(", ")})</span>
                                 </Typography>
                              </TableCell>
                              <TableCell className={classes}>
                                 <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-medium"
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                 >
                                    {`${wins} - ${total - wins}`}{" "}
                                    <span className="font-light">{`(${winPerc || ""})`}</span>
                                 </Typography>
                              </TableCell>
                           </TableRow>
                        );
                     }}
                  </TableBody>
               </Table>
            </div>
         </div>
      </Dialog>
   );
};

export default ViewAnalytics;
