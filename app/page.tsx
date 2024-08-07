import { cookies } from "next/headers";
import HomeClient from "./HomeClient";
import {
   getGameTypes,
   getPlayers,
   getSessions,
} from "@/lib/server-actions/firebase";
import { notFound } from "next/navigation";

interface Props {}
const Page = async ({}: Props) => {
   return notFound();
   cookies();
   const { sessions, wins, loses, matchesPlayed } = await getSessions();
   const gameTypes = await getGameTypes();
   const players = await getPlayers();
   // const { wins, loses }: any = await getTotalWinLossRatio();

   return (
      <HomeClient
         sessions={sessions}
         gameTypes={gameTypes}
         players={players}
         matchesPlayed={matchesPlayed}
         wins={wins}
         loses={loses}
      />
   );
};

export default Page;
