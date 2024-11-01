"use client";

import { Player } from "@/lib/types";
import { Typography } from "@material-tailwind/react";
import React, { useContext } from "react";
import { SessionContext } from "./SessionContextProvider";

interface Props {}

const Players = ({}: Props) => {
   const { sessionPlayers, playersConfig } = useContext(SessionContext);

   return (
      <div className="flex flex-col gap-2">
         <Typography
            placeholder={undefined}
            variant="h6"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
         >
            Players List
         </Typography>
         <div className="flex flex-row items-center gap-1">
            {sessionPlayers?.map((player: Player, i: number) => {
               let classNames = `py-1 px-3 rounded-full text-white font-normal text-[12px] truncate`;

               return (
                  <Typography
                     key={i}
                     variant="small"
                     style={{ background: playersConfig[player]?.color || "#333" }}
                     className={classNames}
                     placeholder={undefined}
                     onPointerEnterCapture={undefined}
                     onPointerLeaveCapture={undefined}
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
