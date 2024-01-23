"use client";
import { Card, CardBody, Tooltip, Typography } from "@material-tailwind/react";
import React from "react";

interface Props {
   cards: Array<{ title: string; value: any }>;
}

const AnalyticCards = ({ cards }: Props) => {
   return (
      <div className="flex flex-row flex-wrap w-full gap-2 bg-gray-50 p-2 rounded-lg">
         {cards?.map((card: any, i: number) => {
            return (
               <Card
                  className="w-[calc(50%-8px)] sm:max-w-[200px]"
                  placeholder={undefined}
                  key={i}
               >
                  <CardBody className="text-center p-2" placeholder={undefined}>
                     <Typography
                        variant="h6"
                        color="blue-gray"
                        className="mb-1 font-normal"
                        placeholder={undefined}
                     >
                        {card?.title}
                     </Typography>
                     <Tooltip content={card?.toolTipVal || card?.value}>
                        <Typography
                           variant="h4"
                           color="blue-gray"
                           className="truncate"
                           placeholder={undefined}
                        >
                           {card?.value}
                        </Typography>
                     </Tooltip>
                  </CardBody>
               </Card>
            );
         })}
      </div>
   );
};

export default AnalyticCards;
