"use client";

import { Session } from "@/lib/types";
import React, { useContext } from "react";
import MatchesTable from "./MatchesTable";
import { MatchContext } from "./MatchContextProvider";

type Props = {
   sessionData: Session;
   handleEditMatch: (matchId: string) => Promise<void>;
   handleDeleteMatch: (matchId: string) => Promise<void>;
};
const Matches = ({
   sessionData,
   handleEditMatch,
   handleDeleteMatch,
}: Props) => {
   const { todaysMatches, previousMatches, allMatches }: any =
      useContext(MatchContext);

   return (
      <>
         {/* TODAY'S MATCHES */}
         <MatchesTable
            tableTitle="Today's Matches"
            data={todaysMatches || {}}
            onClick={(action: "edit" | "delete", id: string) => {
               if (action === "edit") handleEditMatch(id);
               else if (action === "delete") handleDeleteMatch(id);
            }}
         />

         {/* PREVIOUS MATCHES */}
         {/* <MatchesTable
            tableTitle="Previous Matches"
            data={sessionData?.matches || {}}
            onClick={(action: "edit" | "delete", id: string) => {
               if (action === "edit") handleEditMatch(id);
               else if (action === "delete") handleDeleteMatch(id);
            }}
         /> */}
      </>
   );
};

export default Matches;
