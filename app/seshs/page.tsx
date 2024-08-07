import { cookies } from "next/headers";
import {
   getGameTypes,
   getPlayers,
   getSessions,
} from "@/lib/server-actions/firebase";
import PageContainer from "@/lib/common/container/PageContainer";
import SessionsContextProvider from "./(partials)/SessionsContextProvider";
import { Session } from "@/lib/types";
import Actions from "./(partials)/Actions";
import CreateNewSession from "./(partials)/CreateNewSession";
import SessionsTable from "./(partials)/SessionsTable";
import Analytics from "./(partials)/Analytics";
import Title from "@/lib/common/components/Title";

interface Props {}
const Page = async ({}: Props) => {
   cookies();
   const sessions = await getSessions(1);
   const gameTypes = await getGameTypes();
   const players = await getPlayers();

   return (
      <SessionsContextProvider sessions={sessions as Array<Session>}>
         <PageContainer className="max-h-[100dvh]">
            <div className="flex flex-col w-full gap-4 bg-gray-50 p-4 rounded-lg">
               <Title>All Sessions</Title>
               <Analytics matchMapKey="allMatches" />
               <hr className="border-t-[1px] border-gray-300 w-full my-1" />
               <SessionsTable />
            </div>

            <Actions />
            <CreateNewSession gameTypes={gameTypes} players={players} />
         </PageContainer>
      </SessionsContextProvider>
   );
};

export default Page;
