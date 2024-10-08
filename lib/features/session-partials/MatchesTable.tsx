"use client";

import Table, {
   TableBody,
   TableCell,
   TableHead,
   TableHeadCell,
   TableRow,
} from "@/lib/common/components/Table";
import { Match } from "@/lib/types";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Card, IconButton, Typography } from "@material-tailwind/react";
import React from "react";

const TABLE_HEAD = ["Game Mode", "Won", ""];

type DateType = { [id: string]: Match };
interface Props {
   data: DateType;
   onClick?: (action: "edit" | "delete", matchId: string) => void;
   tableTitle?: string;
}

const MatchesTable = ({ data, onClick, tableTitle }: Props) => {
   return (
      <Card
         className="w-full h-full overflow-auto shadow-none bg-gray-50 p-4 rounded-lg max-h-[700px] flex flex-col gap-2"
         placeholder={undefined}
      >
         {tableTitle && (
            <Typography placeholder={undefined} variant="h5">
               {tableTitle}
            </Typography>
         )}

         <Table>
            <TableHead data={TABLE_HEAD}>
               {({ item, index }) => {
                  return (
                     <TableHeadCell
                        key={index}
                        className={`border-b border-blue-gray-100 bg-blue-gray-50 p-3`}
                     >
                        <Typography
                           variant="small"
                           color="blue-gray"
                           className="font-medium leading-none opacity-70"
                           placeholder={undefined}
                        >
                           {item}
                        </Typography>
                     </TableHeadCell>
                  );
               }}
            </TableHead>
            <TableBody data={Object.keys(data)}>
               {({ item: matchId, index }) => {
                  const { gameMode, win, createdAt } = data[matchId] as Match;
                  const isLast = index === Object.keys(data)?.length - 1;
                  const classes = isLast
                     ? "p-3"
                     : "p-3 border-b border-blue-gray-50 max-w-[200px]";
                  return (
                     <TableRow key={index}>
                        <TableCell className={classes}>
                           <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                              placeholder={undefined}
                           >
                              {gameMode}
                           </Typography>
                        </TableCell>
                        <TableCell className={classes}>
                           <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                              placeholder={undefined}
                           >
                              {win ? "Yes" : "No"}
                           </Typography>
                        </TableCell>
                        <TableCell className={`${classes} w-[140px]`}>
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
                        </TableCell>
                     </TableRow>
                  );
               }}
            </TableBody>
         </Table>
      </Card>
   );
};

export default MatchesTable;
