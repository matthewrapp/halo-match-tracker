"use server";

import { db } from "@/utilities/db";
import { deepCopy } from "@/utilities/helpers";
import {
   addDoc,
   collection,
   deleteDoc,
   doc,
   getDoc,
   getDocs,
   limit,
   orderBy,
   query,
   setDoc,
   updateDoc,
   where,
} from "firebase/firestore";
import { Match } from "../types";

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

// export async function getTotalWinLossRatio() {
//    try {
//       // const dbRes = await getDocs(query(collection(db, "sessions")));

//       let totalWins = 0,
//          totalLoses = 0;
//       // dbRes.forEach((doc: any) => {
//       //    let data = doc.data();
//       //    data?.matches?.forEach((match: Match) => {
//       //       if (match?.win) totalWins += 1;
//       //       else totalLoses += 1;
//       //    });
//       // });

//       const winsSnapshot = await getDocs(
//          query(
//             collection(db, "sessions"),
//             where("matches", "array-contains", { win: true })
//          )
//       );
//       const losesSnapshot = await getDocs(
//          query(
//             collection(db, "sessions"),
//             where("matches", "array-contains", { win: false })
//          )
//       );

//       console.log("winsSnapshot:", winsSnapshot?.size);
//       totalWins = winsSnapshot?.size;
//       totalLoses = losesSnapshot?.size;

//       return { wins: totalWins, loses: totalLoses };
//    } catch (err: any) {
//       console.log("err:", err);
//    }
// }

// With matches being sub collection
// export async function createSession(reqBody: any) {
//    try {
//       const newDocId = crypto.randomUUID();
//       const matches = [...reqBody.matches, { testing: "sup man" }];
//       delete reqBody["matches"];

//       // create doc in session collection
//       await setDoc(doc(db, "sessions", newDocId), reqBody);
//       const docRef = doc(db, "sessions", newDocId);
//       const dbRes = await getDoc(docRef);

//       // create subcollection 'matches' within the session document
//       const matchesColRef = collection(docRef, "matches");

//       /// add each match to the "matches" subcollection
//       for (const match of matches) await addDoc(matchesColRef, match);

//       let dataToReturn = null;
//       if (dbRes?.exists()) {
//          const data = dbRes?.data();

//          // Fetch the "matches" subcollection
//          const matchesQuery = query(collection(docRef, "matches"));
//          const matchesSnapshot = await getDocs(matchesQuery);

//          const matchesData: any = [];
//          matchesSnapshot.forEach((matchDoc) => {
//             // if (matchDoc.exists()) matchesData.push(matchDoc.data());
//             if (matchDoc.exists()) {
//                deleteDoc(
//                   doc(db, "sessions", newDocId, "matches", matchDoc?.id)
//                );
//             }
//          });

//          dataToReturn = { data, docId: newDocId, matches: matchesData };
//       }

//       return deepCopy(dataToReturn);
//    } catch (err: any) {
//       console.log("err createSession:", err);
//       throw new Error(err);
//    }
// }
