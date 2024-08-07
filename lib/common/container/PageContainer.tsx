import React from "react";

interface Props {
   children: React.ReactNode;
   className?: string;
}

const PageContainer = ({ children, className }: Props) => {
   return (
      <div
         className={`
            p-4 max-w-[1000px] m-auto flex flex-col gap-2
            ${className ? className : ""}
         `}
      >
         {children}
      </div>
   );
};

export default PageContainer;
