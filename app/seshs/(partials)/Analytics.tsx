"use client";

import React, { useContext } from "react";
import { SessionsContext } from "./SessionsContextProvider";
import AnalyticCard from "@/lib/common/components/AnalyticCard";

type Props = {
   matchMapKey: "todaysMatches" | "previousMatches" | "allMatches";
};
const Analytics = ({ matchMapKey }: Props) => {
   const {
      matchesMap,
      matchesPlayedMap,
      getWinLossCount,
      getWinPercentage,
      getMostCommonMapAndMode,
   } = useContext(SessionsContext);
   const matches = matchesMap[matchMapKey];
   const { wins, losses } = getWinLossCount(matches);
   const gamesPlayed = matchesPlayedMap[matchMapKey];
   const winPer = getWinPercentage(wins, gamesPlayed);
   const {
      mostCommonMap,
      mostCommonMapCount,
      mostCommonGameMode,
      mostCommonGameModeCount,
   } = getMostCommonMapAndMode(matches);

   // const mcMapStr = mostCommonMap?.join(", ");
   // const mcModeStr = mostCommonGameMode?.join(", ");
   const mcMapStr = mostCommonMap[0];
   const mcModeStr = mostCommonGameMode[0];
   const tempCards = {
      Record: `${wins} - ${losses} (${winPer})`,
      "Most Played Map": `${mcMapStr || "---"}`,
      "Most Played Mode": `${mcModeStr || "---"}`,
   };

   return (
      <div className="flex flex-row flex-wrap w-full gap-2">
         {Object.keys(tempCards)?.map((title) => {
            const val = tempCards[title as keyof object];
            return (
               <AnalyticCard key={title} title={title}>
                  {val}
               </AnalyticCard>
            );
         })}
      </div>
   );
};

export default Analytics;
