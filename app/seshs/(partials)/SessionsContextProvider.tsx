"use client";

import { createSession } from "@/lib/server-actions/firebase";
import { revalidate } from "@/lib/server-actions/revalidate";
import { GameMap, GameMode, GameType, Player, PlayersConfig, Session } from "@/lib/types";
import { useRouter } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";
import { MatchData, MatchMap } from "../[id]/(partials)/MatchContextProvider";

type SessionsContextType = {
   sessionsData: Array<Session>;
   setSessionsData: React.Dispatch<React.SetStateAction<Session[]>>;
   sessionModalOpen: boolean;
   setSessionModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
   analyticsModalOpen: boolean;
   setAnalyticsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
   playersConfig: PlayersConfig;
   gameTypes: Array<GameType>;

   getWinLossCount: (matches: MatchMap) => { wins: number; losses: number };
   getWinPercentage: (wins: number, matchesPlayed: number) => string;
   getMostCommonMapAndMode: (matches: MatchMap) => {
      mostCommonMap: Array<GameMap | undefined>;
      mostCommonMapCount: number;
      mostCommonGameMode: Array<GameMode | undefined>;
      mostCommonGameModeCount: number;
   };
   getGameModeMapAnalytics: (matches: MatchMap) => {
      gameModeMapComboAnalytics: Record<
         string,
         { wins: number; total: number; winPerc: string; gameTypes: Array<string> }
      >;
   };

   handleCreateNewSession: (session: Session) => Promise<void>;
};
export const SessionsContext = createContext({} as SessionsContextType);

type Props = {
   children: React.ReactNode;
   sessions: Array<Session>;
   playersConfig: PlayersConfig;
   players: Array<Player>;
   gameTypes: Array<GameType>;
};
const SessionsContextProvider = ({ children, sessions, playersConfig, players, gameTypes }: Props) => {
   const router = useRouter();
   const [sessionsData, setSessionsData] = useState<Array<Session>>(sessions);
   const [sessionModalOpen, setSessionModalOpen] = useState<boolean>(false);
   const [analyticsModalOpen, setAnalyticsModalOpen] = useState<boolean>(false);
   const [matchesData, setMatchesData] = useState<MatchData>({
      todaysMatches: {},
      todaysMatchesPlayed: 0,
      previousMatches: {},
      previousMatchesPlayed: 0,
      allMatches: {},
      allMatchesPlayed: 0,
   });

   // const players = Array.from(new Set(sessionsData?.map((s) => Object.keys(s?.players)).flat())) as Array<Player>;

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
      const sortPlayers = (players: Array<Player>) => players.sort((a, b) => a.localeCompare(b));
      const arrsMatch = (arr1: Array<Player>, arr2: Array<Player>) => {
         if (arr1.length !== arr2.length) return false;
         return arr1.every((value, index) => value === arr2[index]);
      };

      const currSeshPlayers = sortPlayers(Object.keys(session?.players) as Array<Player>);
      let foundSesh: Session | undefined;
      for (const prevSesh of sessionsData) {
         if (prevSesh.gameType !== session.gameType) continue;
         const prevSeshPlayers = sortPlayers(Object.keys(prevSesh?.players) as Array<Player>);
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
      const wins = mIds?.filter((id: string) => matches[id]?.win === true)?.length;
      const losses = mIds?.filter((id: string) => matches[id]?.win === false)?.length;
      return { wins, losses };
   };

   const getWinPercentage = (wins: number, matchesPlayed: number): string => {
      const winPer = !isNaN((wins / matchesPlayed) * 100) ? `${Math.round((wins / matchesPlayed) * 100)}%` : `0%`;
      return winPer;
   };

   const getGameModeMapAnalytics = (matches: MatchMap) => {
      const matchIds: Array<string> = Object.keys(matches);
      let gameModeMapComboAnalytics: Record<
         string,
         { wins: number; total: number; winPerc: string; gameTypes: Array<string> }
      > = {};

      const getWinPerc = (w: number, t: number): number => (!isNaN((w / t) * 100) ? Math.round((w / t) * 100) : 0);

      // USING THIS TO DEBUG SOME OF THE INCOMPLETE / WRONG MATCHES
      // sessionsData?.forEach((session) => {
      //    Object.keys(session?.matches)?.forEach((mId) => {
      //       const match = session?.matches[mId];
      //       const map = match.map;
      //       const gameMode = match.gameMode;
      //       if (map === "Banished Narrows" && gameMode === "Team Slayer") {
      //          console.log("session:", session);
      //          console.log("session mId:", mId);
      //          // const tempMatches = Object.values(session?.matches)
      //          //    ?.sort((a, b) => new Date(b) - new Date(a))
      //          //    ?.filter((v) => v?.createdAt.split("T")[0] === "2024-08-05");
      //          // console.log("session tempMatches:", tempMatches);
      //       }
      //    });
      // });

      const gameTypeMap: Record<GameType, string> = {
         "Ranked Arena": "Arena",
         "Ranked Slayer": "Slayer",
         "Ranked Doubles": "Doubles",
         "League Play": "LP",
         "Ranked Snipers": "Snipers",
         "Ranked Tactical": "Tactical",
         "Tournament Play": "TP",
         Other: "Other",
      };

      matchIds.forEach((mId: string) => {
         const match = matches[mId as keyof object];
         const gameTypeKey = sessionsData?.find((session) => {
            const foundMatchSesh = Object.keys(session?.matches)?.find((matchId) => mId === matchId);
            if (foundMatchSesh) return session?.gameType;
         })?.gameType;

         const gameType = gameTypeMap[gameTypeKey as GameType];

         const map = match.map;
         const gameMode = match.gameMode;

         // Game Map & Game Mode Analytics
         const key = `${map}-${gameMode}`;
         gameModeMapComboAnalytics[key] = gameModeMapComboAnalytics[key]
            ? { ...gameModeMapComboAnalytics[key] }
            : { wins: 0, total: 0, winPerc: "0%", gameTypes: [gameType!] };

         const wins = match?.win
            ? (gameModeMapComboAnalytics[key]["wins"] += 1)
            : gameModeMapComboAnalytics[key]["wins"];
         const total = (gameModeMapComboAnalytics[key]["total"] += 1);
         const winPerc = `${getWinPerc(wins, total)}%`;
         const gameTypes = [...new Set([...gameModeMapComboAnalytics[key]["gameTypes"], gameType!])].sort();
         gameModeMapComboAnalytics[key] = { wins, total, winPerc, gameTypes: gameTypes };
      });

      gameModeMapComboAnalytics = Object.keys(gameModeMapComboAnalytics)
         .sort()
         .reduce((acc, key) => {
            // @ts-ignore
            acc[key] = gameModeMapComboAnalytics[key];
            return acc;
         }, {});

      return {
         gameModeMapComboAnalytics,
      };
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
         if (!haloGameModeCount[match.gameMode]) haloGameModeCount[match.gameMode] = 1;
         else haloGameModeCount[match.gameMode] += 1;
      });

      let mostCommonMapCount: number = 0;
      let mostCommonGameModeCount: number = 0;
      let mostCommonMap: Array<GameMap | undefined> = [];
      let mostCommonGameMode: Array<GameMode | undefined> = [];

      for (const map in haloMapCount) {
         const key = map as keyof object;
         if (haloMapCount[key] > mostCommonMapCount) mostCommonMapCount = haloMapCount[key];
      }
      for (const gameMode in haloGameModeCount) {
         const key = gameMode as keyof object;
         if (haloGameModeCount[key] > mostCommonGameModeCount) mostCommonGameModeCount = haloGameModeCount[key];
      }
      for (const map in haloMapCount) {
         const key = map as keyof object;
         if (haloMapCount[key] === mostCommonMapCount) mostCommonMap.push(map as GameMap);
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
            analyticsModalOpen,
            setAnalyticsModalOpen,
            matchesMap: matchesData,
            matchesPlayedMap: {
               todaysMatches: matchesData?.todaysMatchesPlayed,
               previousMatches: matchesData?.previousMatchesPlayed,
               allMatches: matchesData?.allMatchesPlayed,
            },
            players,
            playersConfig,
            gameTypes,

            getWinLossCount,
            getWinPercentage,
            getMostCommonMapAndMode,
            getGameModeMapAnalytics,

            handleCreateNewSession,
         }}
      >
         {children}
      </SessionsContext.Provider>
   );
};

export default SessionsContextProvider;
