"use client";

import FloatingBtnContainer from "@/lib/common/floating-btn-container/FloatingBtnContainer";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Button } from "@material-tailwind/react";
import React, { useContext } from "react";
import { SessionsContext } from "./SessionsContextProvider";

type Props = {};
const Actions = ({}: Props) => {
   const { setSessionModalOpen } = useContext(SessionsContext);

   return (
      <FloatingBtnContainer>
         <Button
            placeholder={undefined}
            onClick={() => {
               console.log("emitting message");
               // socket.emit("sendMsg", "new session being created...");
               // socketEmit("sendMsg", "YO YO");
               setSessionModalOpen(true);
            }}
            className="flex items-center gap-2"
         >
            <PlusIcon width={24} height={24} color="currentColor" />
            Start New Session
         </Button>
      </FloatingBtnContainer>
   );
};

export default Actions;
