"use client";

import { Card, CardBody, Typography } from "@material-tailwind/react";
import React from "react";

type Props = {
   title: string;
   toolTipVal?: string;
   children: React.ReactNode | string;
};
const AnalyticCard = ({ title, children, toolTipVal }: Props) => {
   return (
      <Card
         className="w-[calc(50%-8px)] sm:max-w-[200px] p-1"
         placeholder={undefined}
      >
         <CardBody className="text-center p-2" placeholder={undefined}>
            {/* <Tooltip content={toolTipVal}> */}
            <Typography
               variant="paragraph"
               color="blue-gray"
               className="truncate text-[19px] font-semibold"
               placeholder={undefined}
            >
               {children}
            </Typography>
            {/* </Tooltip> */}
            <Typography
               variant="small"
               color="blue-gray"
               className="mb-1 font-normal text-[12px]"
               placeholder={undefined}
            >
               {title}
            </Typography>
         </CardBody>
      </Card>
   );

   // return (
   //    <Card
   //       className="w-[calc(50%-8px)] sm:max-w-[200px]"
   //       placeholder={undefined}
   //    >
   //       <CardBody className="text-center p-2" placeholder={undefined}>
   //          <Typography
   //             variant="h6"
   //             color="blue-gray"
   //             className="mb-1 font-normal text-[14px]"
   //             placeholder={undefined}
   //          >
   //             {title}
   //          </Typography>
   //          <Tooltip content={toolTipVal}>
   //             <Typography
   //                variant="h4"
   //                color="blue-gray"
   //                className="truncate text-[20px]"
   //                placeholder={undefined}
   //             >
   //                {children}
   //             </Typography>
   //          </Tooltip>
   //       </CardBody>
   //    </Card>
   // );
};

export default AnalyticCard;
