"use server";

import { db } from "@/utilities/db";
import { deepCopy } from "@/utilities/helpers";
import {
   collection,
   doc,
   getDoc,
   getDocs,
   orderBy,
   query,
   setDoc,
   updateDoc,
} from "firebase/firestore";
import { GameMap, GameMode, GameType, Player } from "../types";

export async function getGameTypes() {
   const dbRes = await getDocs(query(collection(db, "gameTypes")));
   const gameTypes = dbRes.docs.map((doc) => doc.id) as Array<GameType>;
   return deepCopy(gameTypes);
}

export async function getGameModes() {
   const dbRes = await getDocs(query(collection(db, "gameModes")));
   const gameModes = dbRes.docs.map((doc) => doc.id) as Array<GameMode>;
   return deepCopy(gameModes);
}

export async function getMaps() {
   const dbRes = await getDocs(query(collection(db, "maps")));
   const maps = dbRes.docs.map((doc) => doc.id) as Array<GameMap>;
   return deepCopy(maps);
}

export async function getPlayers() {
   const dbRes = await getDocs(query(collection(db, "players")));
   const players = dbRes.docs.map((doc) => doc.id) as Array<Player>;
   return deepCopy(players);
}

export async function getSessions() {
   const dbRes = await getDocs(
      query(collection(db, "sessions"), orderBy("createdAt", "desc"))
   );

   let totalWins = 0;
   let totalLoses = 0;
   let totalMatches = 0;
   const res = dbRes.docs.map((doc) => {
      const data = doc.data();

      const matchIdArr = Object.keys(data?.matches);
      if (!!matchIdArr?.length) {
         totalMatches += matchIdArr?.length;
         matchIdArr?.forEach((mId: string) => {
            const match = data?.matches[mId];
            if (match?.win) totalWins += 1;
            else totalLoses += 1;
         });
      }

      return {
         ...data,
         docId: doc?.id,
         createdAt: data?.createdAt?.toDate(),
      };
   });

   return deepCopy({
      sessions: res,
      matchesPlayed: totalMatches,
      wins: totalWins,
      loses: totalLoses,
   });
}

export async function createSession(reqBody: any) {
   try {
      const docId = crypto.randomUUID();
      await setDoc(doc(db, "sessions", docId), reqBody);
      const dbRes = await getDoc(doc(db, "sessions", docId));

      let dataToReturn = null;
      if (dbRes?.exists()) dataToReturn = { ...dbRes?.data(), docId };
      return deepCopy(dataToReturn);
   } catch (err: any) {
      console.log("err createSession:", err);
      throw new Error(err);
   }
}

export async function getSessionById(docId: string) {
   try {
      let dbRes: any = await getDoc(doc(db, "sessions", docId));
      if (dbRes?.exists()) {
         const data = dbRes.data();

         dbRes = {
            ...data,
            createdAt: data?.createdAt?.toDate(),
         };
      }

      return deepCopy(dbRes);
   } catch (err: any) {
      console.log("err getSessionById:", err);
      throw new Error(err);
   }
}

export async function saveMatch(sessionId: string, reqBody: any) {
   try {
      const docRef = doc(db, "sessions", sessionId);
      await updateDoc(docRef, reqBody);
      return deepCopy({ status: 200, message: "Match saved success!" });
   } catch (err: any) {
      console.log("err saveMatch:", err);
      throw new Error(err);
   }
}
