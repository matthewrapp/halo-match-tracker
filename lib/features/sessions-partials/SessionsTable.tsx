"use client";
import { playerComponentClassNames } from "@/lib/maps";
import { Player, Session } from "@/lib/types";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import {
   Card,
   IconButton,
   Tooltip,
   Typography,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";

const TABLE_HEAD = ["Players", "W/L Ratio", "Date", ""];
const players: Array<Player> = [
   "zE tthrilla",
   "zE eskky",
   "HafenNation",
   "YungJaguar",
];

interface Props {
   sessions: Array<Session>;
   onClick?: (action: "edit", sessionId: string) => void;
}

const SessionsTable = ({ sessions, onClick }: Props) => {
   const [data, setData] = useState<Array<any>>([]);

   useEffect(() => {
      if (!!sessions?.length) {
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

         setData(tableData);
      }
   }, [sessions]);

   return (
      <Card
         className=" w-full h-full overflow-auto shadow-none bg-gray-50 p-4 rounded-lg"
         placeholder={undefined}
      >
         <div className="flex flex-col gap-1 mb-2">
            <Typography
               variant="paragraph"
               color="blue-gray"
               placeholder={undefined}
            >
               Legend:
            </Typography>
            <div className="flex items-center gap-1">
               {players?.map((player: Player, i: number) => {
                  return (
                     <Typography
                        key={player}
                        variant="small"
                        // color="blue-gray"
                        className={
                           playerComponentClassNames[player]["pill"] ||
                           playerComponentClassNames["other"]["pill"]
                        }
                        placeholder={undefined}
                     >
                        {player}
                     </Typography>
                  );
               })}
            </div>
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
                     { players, matchesPlayed, wlRatio, createdAt, docId }: any,
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
                                    onClick && onClick("edit", docId);
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