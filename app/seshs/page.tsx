import { getGameTypes, getPlayers, getSessions } from "@/lib/server-actions/firebase";
import PageContainer from "@/lib/common/container/PageContainer";
import SessionsContextProvider from "./(partials)/SessionsContextProvider";
import { Player, Session } from "@/lib/types";
import Actions from "./(partials)/Actions";
import CreateNewSession from "./(partials)/CreateNewSession";
import SessionsTable from "./(partials)/SessionsTable";
import Analytics from "./(partials)/Analytics";
import Title from "@/lib/common/components/Title";
import ViewAnalytics from "./(partials)/ViewAnalytics";

export const dynamic = "force-dynamic";

interface Props {}
const Page = async ({}: Props) => {
   const [sessions, gameTypes, playersConfig] = await Promise.all([getSessions(1), getGameTypes(), getPlayers()]);

   return (
      <SessionsContextProvider
         sessions={sessions as Array<Session>}
         playersConfig={playersConfig}
         players={Object.keys(playersConfig) as Array<Player>}
         gameTypes={gameTypes}
      >
         <PageContainer className="max-h-[100dvh]">
            <div className="flex flex-col w-full gap-4 bg-gray-50 p-4 rounded-lg">
               <Title>All Sessions</Title>
               <Analytics matchMapKey="allMatches" />
               <hr className="border-t-[1px] border-gray-300 w-full my-1" />
               <SessionsTable />
            </div>

            <Actions />
            <CreateNewSession />
            <ViewAnalytics />
         </PageContainer>
      </SessionsContextProvider>
   );
};

export default Page;
