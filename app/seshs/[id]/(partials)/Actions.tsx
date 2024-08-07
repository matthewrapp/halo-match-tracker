"use client";

import FloatingBtnContainer from "@/lib/common/floating-btn-container/FloatingBtnContainer";
import { revalidate } from "@/lib/server-actions/revalidate";
import {
   ArrowLeftEndOnRectangleIcon,
   PlusIcon,
} from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { MatchContext } from "./MatchContextProvider";

type Props = {};
const Actions = ({}: Props) => {
   const router = useRouter();
   const { setMatchModalOpen } = useContext(MatchContext);

   return (
      <>
         <FloatingBtnContainer>
            <IconButton
               placeholder={undefined}
               size="lg"
               color="teal"
               onClick={() => {
                  setMatchModalOpen(true);
               }}
            >
               <PlusIcon width={24} height={24} color="currentColor" />
            </IconButton>
            <IconButton
               variant="filled"
               placeholder={undefined}
               size="lg"
               color="black"
               onClick={async () => {
                  const path = "/seshs";
                  await revalidate({ path });
                  router.push(path);
               }}
            >
               <ArrowLeftEndOnRectangleIcon
                  width={24}
                  height={24}
                  color="currentColor"
               />
            </IconButton>
         </FloatingBtnContainer>
      </>
   );
};

export default Actions;
