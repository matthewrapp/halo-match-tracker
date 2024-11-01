import { getGameModes, getMaps, getPlayers, getSessionById } from "@/lib/server-actions/firebase";
import React from "react";
import { GameMap, GameMode, Player } from "@/lib/types";
import PageContainer from "@/lib/common/container/PageContainer";
import Actions from "./(partials)/Actions";
import MatchContextProvider from "./(partials)/MatchContextProvider";
import Analytics from "./(partials)/Analytics";
import SessionContextProvider from "./(partials)/SessionContextProvider";
import MatchesTable from "./(partials)/MatchesTable";
import Header from "./(partials)/Header";
import ReportMatch from "./(partials)/ReportMatch";
import Players from "./(partials)/Players";
import { notFound } from "next/navigation";

interface Props {
   params: Promise<{ id: string }>;
   searchParams: Promise<any>;
}

const Page = async (props: Props) => {
   const params = await props.params;
   const sessionData = await getSessionById(params?.id);
   if (sessionData?.status === 404) return notFound();
   const [gameModes, maps, playersConfig] = await Promise.all([getGameModes(), getMaps(), getPlayers()]);

   return (
      <SessionContextProvider
         session={sessionData}
         playersConfig={playersConfig}
         sessionPlayers={Object.keys(sessionData?.players).sort() as Array<Player>}
      >
         <PageContainer className="max-h-[100dvh]">
            <MatchContextProvider>
               <div className="flex flex-col w-full gap-4 bg-gray-50 p-4 rounded-lg">
                  <Players />
                  <hr className="border-t-[1px] border-gray-300 w-full my-1" />
                  <Header />
                  <Analytics />
                  <hr className="border-t-[1px] border-gray-300 w-full my-1" />
                  <MatchesTable />
               </div>

               <Actions />
               <ReportMatch gameModes={gameModes} maps={maps} />
            </MatchContextProvider>
         </PageContainer>
      </SessionContextProvider>
   );
};

export default Page;
