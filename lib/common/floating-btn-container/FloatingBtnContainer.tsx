"use client";
import React from "react";

interface Props {
   children: React.ReactNode;
}

const FloatingBtnContainer = ({ children }: Props) => {
   return (
      <div className="fixed bottom-0 right-0 p-2 flex flex-row gap-2 bg-transparent">
         {children}
      </div>
   );
};

export default FloatingBtnContainer;
