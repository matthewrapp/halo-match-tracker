"use client";

import { Match } from "@/lib/types";
import React, { createContext, useEffect, useState } from "react";

export const MatchContext = createContext({});

export type MatchMap = { [id: string]: Match };

type Props = { children: React.ReactNode; matches: MatchMap };
const MatchContextProvider = ({ children, matches }: Props) => {
   const [matchData, setMatchData] = useState<{
      todaysMatches: MatchMap;
      previousMatches: MatchMap;
      allMatches: MatchMap;
   }>();

   useEffect(() => {
      const result = groupByDate(matches || {});
      const today = getDate(new Date());

      const todaysMatches = result[today];
      const previousMatches = getPreviousMatches(result, today);

      setMatchData({ todaysMatches, previousMatches, allMatches: matches });
   }, [matches]);

   return (
      <MatchContext.Provider
         value={{
            todaysMatches: matchData?.todaysMatches,
            previousMatches: matchData?.previousMatches,
            allMatches: matchData?.allMatches,
         }}
      >
         {children}
      </MatchContext.Provider>
   );
};

export default MatchContextProvider;

const getDate = (ts: string | Date): string => {
   const dateStr = new Date(ts).toISOString();
   const date = dateStr.split("T")[0];
   return date;
};

type DateType = { [id: string]: Match };

const groupByDate = (matchesMap: DateType): { [date: string]: DateType } => {
   let data: { [date: string]: DateType } = {};
   Object.entries(matchesMap).forEach(([id, details]) => {
      const date = getDate(details?.createdAt);
      if (!data[date]) data[date as string] = {} as any;
      data[date][id] = details;
   });
   return data;
};

const getPreviousMatches = (
   dateMatchesMap: { [date: string]: DateType },
   today: string
): DateType => {
   let prevMatches: DateType = {};
   Object.entries(dateMatchesMap).forEach(([date, matches]) => {
      if (date !== today) prevMatches = { ...prevMatches, ...matches };
   });
   return prevMatches;
};
