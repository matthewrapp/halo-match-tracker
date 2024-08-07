"use client";

import Title from "@/lib/common/components/Title";
import React, { useContext } from "react";
import { MatchContext, MatchMapKey } from "./MatchContextProvider";
import { Button, ButtonGroup } from "@material-tailwind/react";

type Props = {};
const Header = ({}: Props) => {
   const { matchMapKey, setMatchMapKey } = useContext(MatchContext);

   let title = "";
   if (matchMapKey === "todaysMatches") title = "Today's Matches";
   else if (matchMapKey === "allMatches") title = "All Matches";
   else if (matchMapKey === "previousMatches") title = "Previous Matches";

   const buttonsArr: Array<{ key: MatchMapKey; title: string }> = [
      { key: "allMatches", title: "All" },
      { key: "previousMatches", title: "Previous" },
      { key: "todaysMatches", title: "Today" },
   ];

   return (
      <div className="flex flex-col md:flex-row w-full gap-1 md:items-center md:justify-between">
         <Title>{title}</Title>
         <ButtonGroup
            placeholder={undefined}
            variant="filled"
            size="sm"
            color="blue-gray"
            className="gap-1 flex-wrap"
         >
            {buttonsArr?.map((b) => {
               return (
                  <Button
                     key={b.key}
                     onClick={() => {
                        setMatchMapKey(b.key);
                     }}
                     placeholder={undefined}
                     className="hover:shadow-md border-none rounded-md"
                  >
                     {b.title}
                  </Button>
               );
            })}
         </ButtonGroup>
      </div>
   );
};

export default Header;
