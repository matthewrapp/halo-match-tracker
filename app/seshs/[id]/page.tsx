import {
   getGameModes,
   getMaps,
   getSessionById,
} from "@/lib/server-actions/firebase";
import React from "react";
import { GameMap, GameMode } from "@/lib/types";
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
   params: { id: string };
   searchParams: any;
}

const Page = async ({ params }: Props) => {
   const sessionData = await getSessionById(params?.id);
   if (sessionData?.status === 404) return notFound();
   const gameModes = (await getGameModes()) as Array<GameMode>;
   const maps = (await getMaps()) as Array<GameMap>;

   return (
      <SessionContextProvider session={sessionData}>
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
