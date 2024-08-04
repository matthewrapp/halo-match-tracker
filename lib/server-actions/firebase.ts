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
   deleteDoc,
} from "firebase/firestore";
import { GameMap, GameMode, GameType, Match, Player, Session } from "../types";

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
   const players = dbRes.docs.map((doc) => ({
      [doc.id]: { ...doc.data() },
   })) as Array<Record<Player, any>>;
   return deepCopy(players);
}

export async function getSessions() {
   const dbRes = await getDocs(
      query(collection(db, "sessions"), orderBy("createdAt", "desc"))
   );

   let totalWins = 0;
   let totalLoses = 0;
   let totalMatches = 0;
   const res = dbRes.docs.map((document) => {
      const data = document.data();
      const sessionDocId = document?.id;

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
         id: sessionDocId,
      };
   });

   // backup sessions whenever loaded, just as a fail-safe for now
   await backupSesssions();

   return deepCopy({
      sessions: res,
      matchesPlayed: totalMatches,
      wins: totalWins,
      loses: totalLoses,
   });
}

export async function deleteSession(documentId: string) {
   try {
      const docRef = doc(db, "sessions", documentId);
      const buDocRef = doc(db, "sessions-backup", documentId);
      await deleteDoc(docRef);
      await deleteDoc(buDocRef);
      return { status: 200, message: "Session deleted successfully!" };
   } catch (err: any) {
      console.log("err deleteSession:", err);
      throw new Error(err);
   }
}

export async function createSession(reqBody: any) {
   try {
      const docId = crypto.randomUUID();
      await setDoc(doc(db, "sessions", docId), reqBody);
      const dbRes = await getDoc(doc(db, "sessions", docId));

      let dataToReturn = null;
      if (dbRes?.exists()) dataToReturn = { ...dbRes?.data(), id: docId };
      return deepCopy(dataToReturn);
   } catch (err: any) {
      console.log("err createSession:", err);
      throw new Error(err);
   }
}

function sortMatches(matches: Array<Match>) {
   if (!Object.keys(matches)?.length) return matches;
   // Convert the object to an array
   const matchesArray = Object.entries(matches).map(([key, value]: any) => ({
      id: key,
      ...value,
   }));

   // Sort the array by createdAt in descending order
   matchesArray.sort(
      (a, b) =>
         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
   );

   // Convert the array back to an object
   const sortedMatches: Array<Match> = matchesArray.reduce((acc, match) => {
      const { id, ...matchData } = match;
      acc[id] = matchData;
      return acc;
   }, {} as Array<Match>);

   return sortedMatches;
}

export async function getSessionById(docId: string) {
   try {
      let dbRes: any = await getDoc(doc(db, "sessions", docId));
      if (dbRes?.exists()) {
         const data = dbRes.data();
         dbRes = { ...data, matches: sortMatches(data?.matches) };
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
      return { status: 200, message: "Match saved success!" };
   } catch (err: any) {
      console.log("err saveMatch:", err);
      throw new Error(err);
   }
}

export async function backupSesssions() {
   try {
      const dbAllSeshs = await getDocs(query(collection(db, "sessions")));
      const dbBackups = await getDocs(query(collection(db, "sessions-backup")));
      const allSeshs = dbAllSeshs.docs.map((s) => ({
         ...(s?.data() as Session),
         id: s.id,
      }));
      const buSeshs = dbBackups.docs.map((s) => ({
         ...(s?.data() as Session),
         id: s.id,
      }));
      const seshsToBU = allSeshs.filter(
         (s) => !buSeshs.some((bu) => bu.id === s.id)
      );

      if (!!seshsToBU?.length) {
         for (const session of seshsToBU) {
            const docId = session?.id;
            delete (session as any)["id"];
            await setDoc(doc(db, "sessions-backup", docId), session);
         }
         console.log(`Backed up ${seshsToBU?.length} sessions.`);
      } else console.log("No sessions to backup right now.");

      return true;
   } catch (err: any) {
      console.log("err backupSesssions:", err);
      throw new Error(err);
   }
}

// export async function deleteField() {
//    const docRef = doc(db, "sessions", sessionId);
//    await updateDoc(docRef, { newCreatedAt: deleteField() });
// }
