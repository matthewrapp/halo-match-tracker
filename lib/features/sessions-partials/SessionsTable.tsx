"use client";

import { playerComponentClassNames, playerPillClasses } from "@/lib/maps";
import { Player, PlayerConfig, Session } from "@/lib/types";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
   Card,
   IconButton,
   Tooltip,
   Typography,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";

const TABLE_HEAD = ["Players", "W/L Ratio", "Date", ""];

interface Props {
   sessions: Array<Session>;
   players: Array<Record<Player, PlayerConfig>>;
   onClick?: (action: "edit" | "delete", sessionId: string) => void;
}

const SessionsTable = ({ sessions, onClick, players }: Props) => {
   const [data, setData] = useState<Array<any>>([]);

   useEffect(() => {
      const tableData = sessions?.map((session: Session) => {
         let wins = 0,
            losses = 0;
         Object.keys(session?.matches)?.forEach((mId: string) => {
            const match = session?.matches[mId];
            if (match?.win) wins += 1;
            else losses += 1;
         });

         return {
            ...session,
            players: Object.keys(session?.players),
            matchesPlayed: session?.matches?.length,
            wlRatio: `${wins} / ${losses}`,
            createdAt: new Date(session?.createdAt)?.toLocaleDateString(
               "en-US"
            ),
         };
      });

      setData(tableData || []);
   }, [sessions]);

   return (
      <Card
         className=" w-full h-full overflow-auto shadow-none bg-gray-50 p-4 rounded-lg"
         placeholder={undefined}
      >
         <div className="flex flex-col gap-1 mb-2">
            <Typography variant="h5" color="blue-gray" placeholder={undefined}>
               Sessions
            </Typography>
            {/* <div className="flex items-center gap-1">
               {players?.map((player, i) => {
                  const name = Object.keys(player)[0];
                  const config = player[name as keyof object] as PlayerConfig;
                  return (
                     <Typography
                        key={name}
                        variant="small"
                        className={
                           playerPillClasses[config?.color] ||
                           playerPillClasses["gray"]
                        }
                        placeholder={undefined}
                     >
                        {name}
                     </Typography>
                  );
               })}
            </div> */}
         </div>
         <table className="w-full min-w-max table-auto text-left">
            <thead>
               <tr>
                  {TABLE_HEAD?.map((head, index: number) => (
                     <th
                        key={index}
                        className={` border-b border-blue-gray-100 bg-blue-gray-50 p-3 `}
                     >
                        <Typography
                           variant="small"
                           color="blue-gray"
                           className="font-medium leading-none opacity-70"
                           placeholder={undefined}
                        >
                           {head}
                        </Typography>
                     </th>
                  ))}
               </tr>
            </thead>
            <tbody>
               {data?.map(
                  (
                     { players, matchesPlayed, wlRatio, createdAt, id }: any,
                     index: number
                  ) => {
                     const isLast = index === data?.length - 1;
                     const classes = isLast
                        ? "p-3"
                        : "p-3 border-b border-blue-gray-50 max-w-[200px]";

                     return (
                        <tr key={index}>
                           <td className={classes}>
                              <div className="flex flex-row gap-2 w-full overflow-auto">
                                 {players
                                    ?.sort((a: string, b: string) =>
                                       a > b ? 1 : b > a ? -1 : 0
                                    )
                                    ?.map((player: Player) => {
                                       const pcn = playerComponentClassNames;

                                       let classNames = ``;
                                       if (pcn[player])
                                          classNames += pcn[player]["pill"];
                                       else if (pcn["other"])
                                          classNames += pcn["other"]["pill"];

                                       return (
                                          <Tooltip
                                             content={player}
                                             key={player}
                                          >
                                             <Typography
                                                variant="small"
                                                className={classNames}
                                                placeholder={undefined}
                                             >
                                                {player}
                                             </Typography>
                                          </Tooltip>
                                       );
                                    })}
                              </div>
                           </td>
                           <td className={classes}>
                              <Typography
                                 variant="small"
                                 color="blue-gray"
                                 className="font-normal"
                                 placeholder={undefined}
                              >
                                 {wlRatio || ""}
                              </Typography>
                           </td>
                           <td className={classes}>
                              <Typography
                                 variant="small"
                                 color="blue-gray"
                                 className="font-normal"
                                 placeholder={undefined}
                              >
                                 {createdAt || ""}
                              </Typography>
                           </td>
                           <td className={classes}>
                              <IconButton
                                 placeholder={undefined}
                                 onClick={() => {
                                    onClick && onClick("edit", id);
                                 }}
                                 className="bg-transparent shadow-none"
                                 variant="text"
                              >
                                 <PencilSquareIcon
                                    width={24}
                                    height={24}
                                    color="currentColor"
                                 />
                              </IconButton>
                              {/* <IconButton
                                 placeholder={undefined}
                                 onClick={() => {
                                    onClick && onClick("delete", id);
                                 }}
                                 className="bg-transparent shadow-none"
                                 variant="text"
                              >
                                 <TrashIcon
                                    width={24}
                                    height={24}
                                    color="red"
                                 />
                              </IconButton> */}
                           </td>
                        </tr>
                     );
                  }
               )}
            </tbody>
         </table>
      </Card>
   );
};

export default SessionsTable;
