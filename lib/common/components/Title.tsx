"use client";

import { Typography } from "@material-tailwind/react";
import React from "react";

type Props = { children: string };
const Title = ({ children }: Props) => {
   return (
      <Typography
         variant="h5"
         placeholder={undefined}
         onPointerEnterCapture={undefined}
         onPointerLeaveCapture={undefined}
      >
         {children}
      </Typography>
   );
};

export default Title;
