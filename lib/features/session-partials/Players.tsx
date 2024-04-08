"use client";
import { playerComponentClassNames } from "@/lib/maps";
import { Player, Session } from "@/lib/types";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import React, { useState } from "react";

interface Props {
   session: Session;
}

const Players = ({ session }: Props) => {
   const [currPlayers, setCurrPlayers] = useState<Array<Player>>(
      Object.keys(session?.players) as Array<Player>
   );

   return (
      <Card placeholder={undefined} className="bg-gray-50 p-2 w-full">
         <div className="p-2">
            <Typography placeholder={undefined} variant="h6">
               Players List
            </Typography>
         </div>
         <CardBody className="flex flex-row gap-1 p-2" placeholder={undefined}>
            {currPlayers?.map((player: Player, i: number) => {
               let classNames = ``;
               if (playerComponentClassNames[player])
                  classNames = playerComponentClassNames[player]["pill"];
               else classNames = playerComponentClassNames["other"]["pill"];

               // const classNames =
               //    playerComponentClassNames[player]["pill"] ||
               //    playerComponentClassNames["other"]["pill"];
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
         </CardBody>
      </Card>
   );
};

export default Players;
