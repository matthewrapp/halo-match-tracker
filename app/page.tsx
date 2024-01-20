import { cookies } from "next/headers";
import HomeClient from "./HomeClient";
import { getSessions } from "@/lib/server-actions/firebase";

interface Props {}
const Page = async ({}: Props) => {
   cookies();
   const { sessions, wins, loses, matchesPlayed } = await getSessions();
   // const { wins, loses }: any = await getTotalWinLossRatio();

   return (
      <HomeClient
         sessions={sessions}
         matchesPlayed={matchesPlayed}
         wins={wins}
         loses={loses}
      />
   );
};

export default Page;
