import { getSessionById, getSessions } from "@/lib/server-actions/firebase";
import { cookies } from "next/headers";
import React from "react";
import SessionClient from "./SessionClient";

interface Props {
   params: { id: string };
   searchParams: any;
}

const Page = async ({ params, searchParams }: Props) => {
   const docData = await getSessionById(params?.id);

   return <SessionClient session={docData} sessionId={params?.id} />;
};

export default Page;
