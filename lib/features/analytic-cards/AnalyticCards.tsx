"use client";
import { GameMap, GameMode, Match } from "@/lib/types";
import { Card, CardBody, Tooltip, Typography } from "@material-tailwind/react";
import React from "react";

interface Props {
   wins: number;
   loses: number;
   matchesPlayed: number;
   matches: { [matchId: string]: Match };
}

const AnalyticCards = ({ wins, loses, matchesPlayed, matches }: Props) => {
   const winPer = !isNaN((wins / matchesPlayed) * 100)
      ? `${Math.round((wins / matchesPlayed) * 100)}%`
      : `0%`;
   let haloMapCount: any = {};
   let haloGameModeCount: any = {};
   const matchIds: Array<string> = Object.keys(matches);
   matchIds.forEach((mId: string) => {
      const match = matches[mId as keyof object];
      if (!match?.map) return;
      if (!haloMapCount[match.map]) haloMapCount[match.map] = 1;
      else haloMapCount[match.map] += 1;

      if (!match?.gameMode) return;
      if (!haloGameModeCount[match.gameMode])
         haloGameModeCount[match.gameMode] = 1;
      else haloGameModeCount[match.gameMode] += 1;
   });
   let mostCommonMapCount: number = 0;
   let mostCommonGameModeCount: number = 0;
   let mostCommonMap: Array<GameMap | undefined> = [];
   let mostCommonGameMode: Array<GameMode | undefined> = [];
   for (const map in haloMapCount) {
      if (haloMapCount[map] > mostCommonMapCount)
         mostCommonMapCount = haloMapCount[map];
   }
   for (const gameMode in haloGameModeCount) {
      if (haloGameModeCount[gameMode] > mostCommonGameModeCount)
         mostCommonGameModeCount = haloGameModeCount[gameMode];
   }
   for (const map in haloMapCount) {
      if (haloMapCount[map] === mostCommonMapCount)
         mostCommonMap.push(map as GameMap);
   }
   for (const gameMode in haloGameModeCount) {
      if (haloGameModeCount[gameMode] === mostCommonGameModeCount) {
         mostCommonGameMode.push(gameMode as GameMode);
      }
   }

   const tempCards = [
      // { title: "Games Played", value: matchesPlayed },
      {
         title: "Wins / Loses / GP",
         value: `${wins} / ${loses} / ${matchesPlayed}`,
      },
      // { title: "Total Loses", value: lossCount },
      { title: "Win %", value: winPer },
      {
         title: "Most Played Map",
         value: mostCommonMap?.join(", ") || "N/A",
         toolTipVal: `${mostCommonMap?.join(", ")} - ${mostCommonMapCount}`,
      },
      {
         title: "Most Played Game Mode",
         value: mostCommonGameMode?.join(", ") || "N/A",
         toolTipVal: `${mostCommonGameMode?.join(
            ", "
         )} - ${mostCommonGameModeCount}`,
      },
   ];

   return (
      <div className="flex flex-row flex-wrap w-full gap-2 bg-gray-50 p-2 rounded-lg">
         {tempCards?.map((card: any, i: number) => {
            return (
               <Card
                  className="w-[calc(50%-8px)] sm:max-w-[200px]"
                  placeholder={undefined}
                  key={i}
               >
                  <CardBody className="text-center p-2" placeholder={undefined}>
                     <Typography
                        variant="h6"
                        color="blue-gray"
                        className="mb-1 font-normal text-[14px]"
                        placeholder={undefined}
                     >
                        {card?.title}
                     </Typography>
                     <Tooltip content={card?.toolTipVal || card?.value}>
                        <Typography
                           variant="h4"
                           color="blue-gray"
                           className="truncate text-[20px]"
                           placeholder={undefined}
                        >
                           {card?.value}
                        </Typography>
                     </Tooltip>
                  </CardBody>
               </Card>
            );
         })}
      </div>
   );
};

export default AnalyticCards;
