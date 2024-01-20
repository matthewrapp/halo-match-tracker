"use client";
import { Match } from "@/lib/types";
import { Card, IconButton, Typography } from "@material-tailwind/react";
import React from "react";

const TABLE_HEAD = ["Game Mode", "Won", ""];
interface Props {
   data: { [id: string]: Match };
   onClick?: (action: "edit" | "delete", matchId: string) => void;
}

const MatchesTable = ({ data, onClick }: Props) => {
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
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       viewBox="0 0 24 24"
                                       // fill="currentColor"
                                       className="w-6 h-6 dark:fill-white fill-gray-900"
                                    >
                                       <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                       <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                    </svg>
                                 </IconButton>
                                 <IconButton
                                    placeholder={undefined}
                                    onClick={() => {
                                       onClick && onClick("delete", matchId);
                                    }}
                                    className="bg-transparent shadow-none"
                                    variant="text"
                                 >
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       viewBox="0 0 24 24"
                                       fill="red"
                                       className="w-6 h-6"
                                    >
                                       <path
                                          fillRule="evenodd"
                                          d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                                          clipRule="evenodd"
                                       />
                                    </svg>
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
