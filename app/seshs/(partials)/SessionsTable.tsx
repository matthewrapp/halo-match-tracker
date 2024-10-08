"use client";

import { playerComponentClassNames } from "@/lib/maps";
import { Player, Session } from "@/lib/types";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
   Button,
   Dialog,
   DialogBody,
   DialogFooter,
   DialogHeader,
   IconButton,
   Tooltip,
   Typography,
} from "@material-tailwind/react";
import React, { useContext, useEffect, useState } from "react";
import { SessionsContext } from "./SessionsContextProvider";
import Table, { TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "@/lib/common/components/Table";
import { revalidate } from "@/lib/server-actions/revalidate";
import { useRouter } from "next/navigation";
import { deleteSession } from "@/lib/server-actions/firebase";

const TABLE_HEAD = ["Players", "Game Type", "W/L Ratio", ""];

interface Props {}

const SessionsTable = ({}: Props) => {
   const router = useRouter();
   const { sessionsData, setSessionsData } = useContext(SessionsContext);
   const [data, setData] = useState<Array<any>>([]);

   const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
   const [sessionToDelete, setSessionToDelete] = useState<Session>();

   useEffect(() => {
      const tableData = sessionsData?.map((session: Session) => {
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
            createdAt: new Date(session?.createdAt)?.toLocaleDateString("en-US"),
         };
      });

      setData(tableData || []);
   }, [sessionsData]);

   const handleEditSession = async (sessionId: string) => {
      const path = `/seshs/${sessionId}`;
      await revalidate({ path });
      router.push(path);
   };

   const handleDeleteSession = async (sessionId: string) => {
      const updatedSeshs = sessionsData?.filter((s) => s?.id !== sessionId);
      await deleteSession(sessionId);
      setSessionsData(updatedSeshs);
   };

   return (
      <div className="w-full h-full max-h-[400px] overflow-auto">
         <Table>
            <TableHead data={TABLE_HEAD}>
               {({ item, index }) => {
                  return (
                     <TableHeadCell key={index} className={` border-b border-blue-gray-100 bg-blue-gray-50 p-3 `}>
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
            <TableBody data={data}>
               {(session, index) => {
                  const { players, gameType, wlRatio, id } = session;
                  const isLast = index === data?.length - 1;
                  const classes = isLast ? "p-3" : "p-3 border-b border-blue-gray-50 max-w-[200px]";

                  return (
                     <TableRow key={index}>
                        <TableCell className={classes}>
                           <div className="flex flex-row gap-2 w-full overflow-auto">
                              {players
                                 ?.sort((a: string, b: string) => (a > b ? 1 : b > a ? -1 : 0))
                                 ?.map((player: Player) => {
                                    const pcn = playerComponentClassNames;

                                    let classNames = ``;
                                    if (pcn[player]) classNames += pcn[player]["pill"];
                                    else if (pcn["other"]) classNames += pcn["other"]["pill"];

                                    return (
                                       <Tooltip content={player} key={player}>
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
                        </TableCell>
                        <TableCell className={classes}>
                           <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-medium"
                              placeholder={undefined}
                           >
                              {gameType || ""}
                           </Typography>
                        </TableCell>
                        <TableCell className={classes}>
                           <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                              placeholder={undefined}
                           >
                              {wlRatio || ""}
                           </Typography>
                        </TableCell>
                        <TableCell className={classes}>
                           <IconButton
                              placeholder={undefined}
                              onClick={() => {
                                 handleEditSession(id);
                              }}
                              className="bg-transparent shadow-none"
                              variant="text"
                           >
                              <PencilSquareIcon width={24} height={24} color="currentColor" />
                           </IconButton>
                           <IconButton
                              placeholder={undefined}
                              onClick={() => {
                                 setSessionToDelete(session as Session);
                                 setConfirmModalOpen(true);
                              }}
                              className="bg-transparent shadow-none"
                              variant="text"
                           >
                              <TrashIcon width={24} height={24} color="red" />
                           </IconButton>
                        </TableCell>
                     </TableRow>
                  );
               }}
            </TableBody>
         </Table>

         <Dialog open={confirmModalOpen} handler={setConfirmModalOpen} placeholder={undefined}>
            <DialogHeader placeholder={undefined}>Delete Session</DialogHeader>
            <DialogBody placeholder={undefined} className="px-8">
               <Typography variant="paragraph" className="font-medium" placeholder={undefined}>
                  Are you sure you want to delete session?
               </Typography>
            </DialogBody>
            <DialogFooter className="flex flex-row gap-2 items-center " placeholder={undefined}>
               <Button
                  color="red"
                  placeholder={undefined}
                  onClick={async () => {
                     await handleDeleteSession(sessionToDelete?.id as string)
                        .then(() => {
                           setSessionToDelete(undefined);
                           setConfirmModalOpen(false);
                        })
                        .catch((err) => {
                           console.log("error deleting session...", err);
                        });
                  }}
               >
                  Delete Session
               </Button>
               <Button
                  color="gray"
                  placeholder={undefined}
                  onClick={() => {
                     setSessionToDelete(undefined);
                     setConfirmModalOpen(false);
                  }}
               >
                  Cancel
               </Button>
            </DialogFooter>
         </Dialog>
      </div>
   );
};

export default SessionsTable;
