"use client";

import { GameMap, GameMode, Match } from "@/lib/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { SessionContext } from "./SessionContextProvider";
import { getSessionById, saveMatch } from "@/lib/server-actions/firebase";
import { deepCopy } from "@/utilities/helpers";

type MatchContextType = {
   matchMap: {
      todaysMatches: MatchMap;
      previousMatches: MatchMap;
      allMatches: MatchMap;
   };
   matchesPlayedMap: {
      todaysMatches: number;
      previousMatches: number;
      allMatches: number;
   };
   matchModalOpen: boolean;
   setMatchModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
   matchConfig: MatchMap | undefined;
   setMatchConfig: React.Dispatch<React.SetStateAction<MatchMap | undefined>>;
   matchMapKey: MatchMapKey;
   setMatchMapKey: React.Dispatch<React.SetStateAction<MatchMapKey>>;

   getWinLossCount: (matches: MatchMap) => { wins: number; losses: number };
   getWinPercentage: (wins: number, matchesPlayed: number) => string;
   getMostCommonMapAndMode: (matches: MatchMap) => {
      mostCommonMap: Array<GameMap | undefined>;
      mostCommonMapCount: number;
      mostCommonGameMode: Array<GameMode | undefined>;
      mostCommonGameModeCount: number;
   };

   handleSaveMatch: (matchToSave: Match, id: string) => Promise<void>;
   handleDeleteMatch: (matchId: string) => Promise<void>;
};
export const MatchContext = createContext({} as MatchContextType);

export type MatchMapKey = "todaysMatches" | "previousMatches" | "allMatches";
export type MatchMap = { [id: string]: Match };
export type MatchData = {
   todaysMatches: MatchMap;
   todaysMatchesPlayed: number;
   previousMatches: MatchMap;
   previousMatchesPlayed: number;
   allMatches: MatchMap;
   allMatchesPlayed: number;
};

type Props = { children: React.ReactNode };
const MatchContextProvider = ({ children }: Props) => {
   const { sessionData, sessionId, setSessionData } =
      useContext(SessionContext);
   const matches = sessionData?.matches as MatchMap;

   const [matchModalOpen, setMatchModalOpen] = useState<boolean>(false);
   const [matchConfig, setMatchConfig] = useState<MatchMap>();
   const [matchData, setMatchData] = useState<MatchData>({
      todaysMatches: {},
      todaysMatchesPlayed: 0,
      previousMatches: {},
      previousMatchesPlayed: 0,
      allMatches: {},
      allMatchesPlayed: 0,
   });
   const [matchMapKey, setMatchMapKey] = useState<MatchMapKey>("todaysMatches");

   useEffect(() => {
      const result = groupByDate(matches || {});
      const today = getDate(new Date());

      const todaysMatches = result[today] || {};
      const previousMatches = getPreviousMatches(result, today);

      setMatchData({
         todaysMatches,
         todaysMatchesPlayed: Object.keys(todaysMatches)?.length,
         previousMatches,
         previousMatchesPlayed: Object.keys(previousMatches)?.length,
         allMatches: matches,
         allMatchesPlayed: Object.keys(matches)?.length,
      });
   }, [matches]);

   const getWinLossCount = (matches: MatchMap) => {
      const mIds: Array<string> = Object.keys(matches);
      const wins = mIds?.filter(
         (id: string) => matches[id]?.win === true
      )?.length;
      const losses = mIds?.filter(
         (id: string) => matches[id]?.win === false
      )?.length;
      return { wins, losses };
   };

   const getWinPercentage = (wins: number, matchesPlayed: number): string => {
      const winPer = !isNaN((wins / matchesPlayed) * 100)
         ? `${Math.round((wins / matchesPlayed) * 100)}%`
         : `0%`;
      return winPer;
   };

   const getMostCommonMapAndMode = (matches: MatchMap) => {
      const matchIds: Array<string> = Object.keys(matches);
      let haloMapCount = {} as Record<GameMap, number>;
      let haloGameModeCount = {} as Record<GameMode, number>;
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
         const key = map as keyof object;
         if (haloMapCount[key] > mostCommonMapCount)
            mostCommonMapCount = haloMapCount[key];
      }
      for (const gameMode in haloGameModeCount) {
         const key = gameMode as keyof object;
         if (haloGameModeCount[key] > mostCommonGameModeCount)
            mostCommonGameModeCount = haloGameModeCount[key];
      }
      for (const map in haloMapCount) {
         const key = map as keyof object;
         if (haloMapCount[key] === mostCommonMapCount)
            mostCommonMap.push(map as GameMap);
      }
      for (const gameMode in haloGameModeCount) {
         const key = gameMode as keyof object;
         if (haloGameModeCount[key] === mostCommonGameModeCount) {
            mostCommonGameMode.push(gameMode as GameMode);
         }
      }

      return {
         mostCommonMap,
         mostCommonMapCount,
         mostCommonGameMode,
         mostCommonGameModeCount,
      };
   };

   const handleSaveMatch = async (mToSave: Match, id: string) => {
      const matches = { ...sessionData?.matches };

      if (matches[id]) matches[id] = mToSave;
      else matches[id] = mToSave;

      await saveMatch(sessionId, { matches }).catch((err) => {
         console.log("error saving match", err);
      });
      const updatedSessionData = await getSessionById(sessionId);
      setSessionData(updatedSessionData);
   };

   const handleDeleteMatch = async (matchId: string) => {
      const copy = deepCopy(sessionData?.matches);
      const matchIds = Object.keys(copy);
      const foundMatchId: string | undefined = matchIds?.find(
         (mId: string) => mId === matchId
      );
      delete copy[foundMatchId as string];
      const sessionId = sessionData?.id as string;
      await saveMatch(sessionId, { matches: copy });
      const updatedSessionData = await getSessionById(sessionId);
      setSessionData(updatedSessionData);
   };

   return (
      <MatchContext.Provider
         value={{
            matchMap: matchData,
            matchesPlayedMap: {
               todaysMatches: matchData?.todaysMatchesPlayed,
               previousMatches: matchData?.previousMatchesPlayed,
               allMatches: matchData?.allMatchesPlayed,
            },
            matchModalOpen,
            setMatchModalOpen,
            matchConfig,
            setMatchConfig,
            matchMapKey,
            setMatchMapKey,

            getWinLossCount,
            getWinPercentage,
            getMostCommonMapAndMode,

            handleSaveMatch,
            handleDeleteMatch,
         }}
      >
         {children}
      </MatchContext.Provider>
   );
};

export default MatchContextProvider;

export const getLocalIsoToday = (date: Date) => {
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
   const day = String(date.getDate()).padStart(2, "0");
   const hours = String(date.getHours()).padStart(2, "0");
   const minutes = String(date.getMinutes()).padStart(2, "0");
   const seconds = String(date.getSeconds()).padStart(2, "0");
   const milliseconds = String(date.getMilliseconds()).padStart(3, "0");
   return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
};

const getDate = (ts: string | Date): string => {
   const dateStr = getLocalIsoToday(new Date(ts));
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
