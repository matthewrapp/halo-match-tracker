import { promises as fs } from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { db } from "@/utilities/db";
import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import { GameMap, GameMode, Player, Session } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

const parseBool = (val: string) => val?.toLowerCase() === "true";

const getDayFromTs = (timestamp: string) => {
   const date = new Date(timestamp);
   const daysOfWeek: Array<DayOfWeek> = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
   ];
   const dayIndex = date.getDay();
   return daysOfWeek[dayIndex];
};

const sortPlayers = (players: Array<Player>) =>
   players.sort((a, b) => a.localeCompare(b));

type DayOfWeek =
   | "Sunday"
   | "Monday"
   | "Tuesday"
   | "Wednesday"
   | "Thursday"
   | "Friday"
   | "Saturday";

let sessionCache: Array<Session & { id: string; day: DayOfWeek }> = [];

const sessionKeyMap = {
   "HafenNation, YungJaguar, zE eskky, zE tthrilla":
      "66231925-f4c6-4e30-8bf3-5a0a69d84a89",
   "HafenNation, Steelblade01, zE eskky, zE tthrilla":
      "180715fa-16a7-4a4c-8ae4-31e0b2d25bfe",
   "zE eskky, zE tthrilla": "62aaaf7c-6296-4d23-b6a2-62b04c2bacb3",
   "HafenNation, zE eskky, zE tthrilla": "cdad9833-5d75-4332-8d18-1c08b3779145",
   "YungJaguar, zE eskky, zE tthrilla": "91d268dc-4b66-4b74-8f4d-7a9ccf7a3190",
   "Steelblade01, YungJaguar, zE eskky, zE tthrilla":
      "cc5bf74c-ad36-4e8d-9466-c240ce7c18d8",
};

const FETCH_SESSIONS: boolean = false;

export async function GET(request: Request) {
   return Response.json({ data: `No no no... Hehe` });

   // try {
   //    // Define the paths to your CSV files in the /lib/csvs directory
   //    const filePath1 = path.resolve(process.cwd(), "lib/csvs/test.csv");
   //    const filePath2 = path.resolve(process.cwd(), "lib/csvs/train.csv");
   //    // Read and parse the CSV files
   //    const fileData1 = await fs.readFile(filePath1, "utf-8");
   //    const fileData2 = await fs.readFile(filePath2, "utf-8");
   //    // Parse the CSV data
   //    const records1 = parse(fileData1, { columns: true, delimiter: "," });
   //    const records2 = parse(fileData2, { columns: true, delimiter: "," });

   //    const allMatches = [...records1, ...records2];

   //    if (FETCH_SESSIONS) {
   //       const dbAllSeshs = await getDocs(query(collection(db, "sessions")));
   //       const allSeshs = dbAllSeshs.docs.map((s) => ({
   //          ...(s?.data() as Session),
   //          day: getDayFromTs(s?.data()?.createdAt),
   //          id: s.id,
   //       }));
   //       sessionCache = allSeshs;
   //       const resultsFilePath = path.resolve(
   //          process.cwd(),
   //          "lib/csvs/sessions-cache.json"
   //       );
   //       await fs.writeFile(resultsFilePath, JSON.stringify(allSeshs, null, 2));
   //    } else {
   //       const filePath = path.resolve(
   //          process.cwd(),
   //          "lib/csvs/sessions-cache.json"
   //       );
   //       const fileData = await fs.readFile(filePath, "utf-8");
   //       const records = JSON.parse(fileData);
   //       sessionCache = records;
   //    }

   //    let foundSeshs: Record<string, Session> = {};

   //    for (const match of allMatches) {
   //       const matchDay: DayOfWeek = match["time"];
   //       const mode = match["gamemode"] as GameMode;
   //       const map = match["game_map"] as GameMap;
   //       const win = parseBool(match["win"]);
   //       const playersObj = {
   //          ...(parseBool(match["HafenNation"]) && { HafenNation: true }),
   //          ...(parseBool(match["Steelblade01"]) && { Steelblade01: true }),
   //          ...(parseBool(match["YungJaguar"]) && { YungJaguar: true }),
   //          ...(parseBool(match["mcddp15"]) && { mcddp15: true }),
   //          ...(parseBool(match["zE tthrilla"]) && { "zE tthrilla": true }),
   //          ...(parseBool(match["zE eskky"]) && { "zE eskky": true }),
   //       } as Record<Player, boolean>;
   //       const matchPl = sortPlayers(Object.keys(playersObj) as Array<Player>);

   //       for (const s of sessionCache) {
   //          // see if day matches
   //          const isDay = s.day === matchDay;
   //          if (!isDay) continue;

   //          // see if players match
   //          let seshPl = Object.keys(s.players) as Array<Player>;
   //          if (matchPl?.length !== seshPl?.length) continue;
   //          seshPl = sortPlayers(seshPl);
   //          const isMatch = seshPl.every(
   //             (value, index) => value === matchPl[index]
   //          );
   //          if (!isMatch) continue;

   //          // if here, found the right day, found all the same players
   //          const key = `${seshPl?.join(", ")}`;
   //          const id: string = sessionKeyMap[key as keyof object];
   //          if (!foundSeshs[id]) {
   //             foundSeshs[id] = {
   //                players: s?.players,
   //                gameType: "Ranked Arena",
   //                matches: {},
   //                createdAt: new Date().toISOString(),
   //             } as Session;
   //          }

   //          const newMatchId = uuidv4();
   //          foundSeshs[id]["matches"][newMatchId] = {
   //             gameMode: mode,
   //             win: win,
   //             createdAt: new Date().toISOString(),
   //             map: map,
   //          };
   //       }
   //    }

   //    // write the session object in new collection
   //    for (const seshId in foundSeshs) {
   //       const val = foundSeshs[seshId];
   //       const docId = uuidv4();
   //       await setDoc(doc(db, "sessions-legacy", docId), val);
   //    }

   //    return Response.json({ data: foundSeshs });
   // } catch (err) {
   //    console.log("err:", err);
   //    return Response.json({ error: err }, { status: 500 });
   // }
}
