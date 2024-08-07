"use client";

import { playerComponentClassNames } from "@/lib/maps";
import { Player } from "@/lib/types";
import { Typography } from "@material-tailwind/react";
import React, { useContext } from "react";
import { SessionContext } from "./SessionContextProvider";

interface Props {}

const Players = ({}: Props) => {
   const { players } = useContext(SessionContext);

   return (
      <div className="flex flex-col gap-2">
         <Typography placeholder={undefined} variant="h6">
            Players List
         </Typography>
         <div className="flex flex-row items-center gap-1">
            {players?.map((player: Player, i: number) => {
               let classNames = ``;
               if (playerComponentClassNames[player])
                  classNames = playerComponentClassNames[player]["pill"];
               else classNames = playerComponentClassNames["other"]["pill"];

               return (
                  <Typography
                     key={i}
                     variant="small"
                     className={classNames}
                     placeholder={undefined}
                  >
                     {player}
                  </Typography>
               );
            })}
         </div>
      </div>
   );
   // return (
   //    <Card placeholder={undefined} className="p-2 w-full">
   //       <div className="p-2">
   //          <Typography placeholder={undefined} variant="h6">
   //             Players List
   //          </Typography>
   //       </div>
   //       <CardBody className="flex flex-row gap-1 p-2" placeholder={undefined}>
   //          {players?.map((player: Player, i: number) => {
   //             let classNames = ``;
   //             if (playerComponentClassNames[player])
   //                classNames = playerComponentClassNames[player]["pill"];
   //             else classNames = playerComponentClassNames["other"]["pill"];

   //             return (
   //                <Typography
   //                   key={i}
   //                   variant="small"
   //                   className={classNames}
   //                   placeholder={undefined}
   //                >
   //                   {player}
   //                </Typography>
   //             );
   //          })}
   //       </CardBody>
   //    </Card>
   // );
};

export default Players;
