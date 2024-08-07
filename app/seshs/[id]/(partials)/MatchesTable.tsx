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
import { IconButton, Typography } from "@material-tailwind/react";
import React, { useContext } from "react";
import { MatchContext } from "./MatchContextProvider";
import { deepCopy } from "@/utilities/helpers";

const TABLE_HEAD = ["Game Mode", "Map", "Won", ""];

interface Props {}

const MatchesTable = ({}: Props) => {
   const {
      matchMap,
      setMatchConfig,
      setMatchModalOpen,
      handleDeleteMatch,
      matchMapKey,
   } = useContext(MatchContext);
   const matches = matchMap[matchMapKey];

   // keeping this within the MatchesTable component because it's not being used anywhere else
   const handleEditMatch = async (matchId: string) => {
      const copy = deepCopy(matches);
      const matchIds = Object.keys(copy);
      const foundMatchId: string | undefined = matchIds?.find(
         (mId: string) => mId === matchId
      );
      setMatchConfig({
         [foundMatchId as string]: copy[foundMatchId as string],
      });
      setMatchModalOpen(true);
   };

   return (
      <div className="w-full h-full overflow-auto max-h-[250px]">
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
            <TableBody data={Object.keys(matches)}>
               {(matchId, index) => {
                  const { gameMode, win, map } = matches[
                     matchId as string
                  ] as Match;
                  const isLast = index === Object.keys(matches)?.length - 1;
                  const classes = isLast
                     ? "p-3"
                     : "p-3 border-b border-blue-gray-50 max-w-[200px]";
                  return (
                     <TableRow key={matchId || index}>
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
                              {map}
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
                                    handleEditMatch(matchId as string);
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
                                    // onClick && onClick("delete", matchId);
                                    handleDeleteMatch(matchId as string);
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
      </div>
   );
};

export default MatchesTable;
