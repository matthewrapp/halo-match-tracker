"use client";

import { createSession } from "@/lib/server-actions/firebase";
import { revalidate } from "@/lib/server-actions/revalidate";
import { GameMap, GameMode, Player, Session } from "@/lib/types";
import { useRouter } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";
import { MatchData, MatchMap } from "../[id]/(partials)/MatchContextProvider";

type SessionsContextType = {
   sessionsData: Array<Session>;
   setSessionsData: React.Dispatch<React.SetStateAction<Session[]>>;
   sessionModalOpen: boolean;
   setSessionModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
   matchesMap: {
      todaysMatches: MatchMap;
      previousMatches: MatchMap;
      allMatches: MatchMap;
   };
   matchesPlayedMap: {
      todaysMatches: number;
      previousMatches: number;
      allMatches: number;
   };
   players: Array<Player>;

   getWinLossCount: (matches: MatchMap) => { wins: number; losses: number };
   getWinPercentage: (wins: number, matchesPlayed: number) => string;
   getMostCommonMapAndMode: (matches: MatchMap) => {
      mostCommonMap: Array<GameMap | undefined>;
      mostCommonMapCount: number;
      mostCommonGameMode: Array<GameMode | undefined>;
      mostCommonGameModeCount: number;
   };

   handleCreateNewSession: (session: Session) => Promise<void>;
};
export const SessionsContext = createContext({} as SessionsContextType);

type Props = { children: React.ReactNode; sessions: Array<Session> };
const SessionsContextProvider = ({ children, sessions }: Props) => {
   const router = useRouter();
   const [sessionsData, setSessionsData] = useState<Array<Session>>(sessions);
   const [sessionModalOpen, setSessionModalOpen] = useState<boolean>(false);
   const [matchesData, setMatchesData] = useState<MatchData>({
      todaysMatches: {},
      todaysMatchesPlayed: 0,
      previousMatches: {},
      previousMatchesPlayed: 0,
      allMatches: {},
      allMatchesPlayed: 0,
   });
   const players = Array.from(
      new Set(sessionsData?.map((s) => Object.keys(s?.players)).flat())
   ) as Array<Player>;

   useEffect(() => {
      let tempMatchesMap = {} as MatchMap;
      sessionsData?.forEach((s) => {
         Object.entries(s?.matches)?.forEach(([id, match]) => {
            tempMatchesMap[id as keyof object] = match;
         });
      });

      // for now, just do all matches...
      setMatchesData({
         todaysMatches: {} as MatchMap,
         todaysMatchesPlayed: 0,
         previousMatches: {} as MatchMap,
         previousMatchesPlayed: 0,
         allMatches: tempMatchesMap,
         allMatchesPlayed: Object.keys(tempMatchesMap)?.length,
      });
   }, [sessionsData]);

   const handleCreateNewSession = async (session: Session) => {
      // see if session already exists with the same players
      const sortPlayers = (players: Array<Player>) =>
         players.sort((a, b) => a.localeCompare(b));
      const arrsMatch = (arr1: Array<Player>, arr2: Array<Player>) => {
         if (arr1.length !== arr2.length) return false;
         return arr1.every((value, index) => value === arr2[index]);
      };

      const currSeshPlayers = sortPlayers(
         Object.keys(session?.players) as Array<Player>
      );
      let foundSesh: Session | undefined;
      for (const prevSesh of sessionsData) {
         if (prevSesh.gameType !== session.gameType) continue;
         const prevSeshPlayers = sortPlayers(
            Object.keys(prevSesh?.players) as Array<Player>
         );
         const playersMatch = arrsMatch(prevSeshPlayers, currSeshPlayers);
         if (!playersMatch) continue;
         // use the same session
         foundSesh = prevSesh;
      }

      if (foundSesh) {
         console.log("FOUND ALREADY IS USE SESSION...");
         let path = `/seshs/${foundSesh?.id}`;
         await revalidate({ path });
         router.push(path);
         return;
      }

      const newSesh = await createSession(session);
      router.push(`/seshs/${newSesh?.id}`);
   };

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

   return (
      <SessionsContext.Provider
         value={{
            sessionsData,
            setSessionsData,
            sessionModalOpen,
            setSessionModalOpen,
            matchesMap: matchesData,
            matchesPlayedMap: {
               todaysMatches: matchesData?.todaysMatchesPlayed,
               previousMatches: matchesData?.previousMatchesPlayed,
               allMatches: matchesData?.allMatchesPlayed,
            },
            players,

            getWinLossCount,
            getWinPercentage,
            getMostCommonMapAndMode,

            handleCreateNewSession,
         }}
      >
         {children}
      </SessionsContext.Provider>
   );
};

export default SessionsContextProvider;
