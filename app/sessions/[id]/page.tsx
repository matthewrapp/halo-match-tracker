import {
   getGameModes,
   getMaps,
   getSessionById,
} from "@/lib/server-actions/firebase";
import React from "react";
import SessionClient from "./SessionClient";
import { GameMap, GameMode } from "@/lib/types";
import { notFound } from "next/navigation";

interface Props {
   params: { id: string };
   searchParams: any;
}

const Page = async ({ params, searchParams }: Props) => {
   return notFound();
   const docData = await getSessionById(params?.id);
   const gameModes = (await getGameModes()) as Array<GameMode>;
   const maps = (await getMaps()) as Array<GameMap>;

   return (
      <SessionClient
         session={docData}
         sessionId={params?.id}
         gameModes={gameModes}
         maps={maps}
      />
   );
};

export default Page;
