"use client";

import { Match } from "@/lib/types";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
   Card,
   IconButton,
   Typography,
   Accordion,
   AccordionBody,
   AccordionHeader,
} from "@material-tailwind/react";
import React from "react";

const TABLE_HEAD = ["Game Mode", "Won", ""];
interface Props {
   data: { [id: string]: Match };
   onClick?: (action: "edit" | "delete", matchId: string) => void;
}

const MatchesTable = ({ data, onClick }: Props) => {
   // console.log("data:", data);

   return (
      <Card
         className=" w-full h-full overflow-auto shadow-none bg-gray-50 p-4 rounded-lg max-h-[700px]"
         placeholder={undefined}
      >
         <table className="w-full min-w-max table-auto text-left">
            <thead>
               <tr>
                  {TABLE_HEAD?.map((head, index: number) => (
                     <th
                        key={index}
                        className={` border-b border-blue-gray-100 bg-blue-gray-50 p-3`}
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
               {Object.keys(data)
                  ?.sort((a: string, b: string) => {
                     // @ts-ignore
                     const one = data[a]?.createdAt?.seconds;
                     // @ts-ignore
                     const two = data[b]?.createdAt?.seconds;
                     if (one > two) return -1;
                     else if (one < two) return 1;
                     else return 0;
                  })
                  ?.map((matchId: string, index: number) => {
                     // @ts-ignore
                     const { gameMode, win, createdAt } = data[
                        matchId
                     ] as Match;
                     const isLast = index === Object.keys(data)?.length - 1;
                     const classes = isLast
                        ? "p-3"
                        : "p-3 border-b border-blue-gray-50 max-w-[200px]";

                     return (
                        <tr key={index}>
                           <td className={classes}>
                              <Typography
                                 variant="small"
                                 color="blue-gray"
                                 className="font-normal"
                                 placeholder={undefined}
                              >
                                 {gameMode}
                              </Typography>
                           </td>
                           <td className={classes}>
                              <Typography
                                 variant="small"
                                 color="blue-gray"
                                 className="font-normal"
                                 placeholder={undefined}
                              >
                                 {win ? "Yes" : "No"}
                              </Typography>
                           </td>
                           <td className={`${classes} w-[140px]`}>
                              <div className="flex items-center gap-1">
                                 <IconButton
                                    placeholder={undefined}
                                    onClick={() => {
                                       onClick && onClick("edit", matchId);
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
                                 <IconButton
                                    placeholder={undefined}
                                    onClick={() => {
                                       onClick && onClick("delete", matchId);
                                    }}
                                    className="bg-transparent shadow-none"
                                    variant="text"
                                 >
                                    <TrashIcon
                                       width={24}
                                       height={24}
                                       color="red"
                                    />
                                 </IconButton>
                              </div>
                           </td>
                        </tr>
                     );
                  })}
            </tbody>
         </table>
      </Card>
   );
};

export default MatchesTable;
