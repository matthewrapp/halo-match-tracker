"use client";

import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { SocketEvent, SocketEventResponse } from "../types";
let socket: Socket | undefined;

const useSocketIO = () => {
   const [eventResponse, setEventResponses] =
      useState<{ [eventName in SocketEvent]: any }>();

   useEffect(() => {
      const socketInitializer = async () => {
         await fetch("/api/socket");
         socket = io();

         socket.on("connect", connected);

         socket.on("catchMsg", handleEventRes);
      };

      socketInitializer();

      return () => {
         if (socket) socket.disconnect();
      };
   }, []);

   const connected = () => {
      const event: SocketEvent = "userLanded";
      socketEmit(event, "user has connected..");
   };

   const handleEventRes = (res: SocketEventResponse) => {
      for (const event in res) {
         // @ts-ignore
         setEventResponses({ [event]: res[event] });
      }
      // const events: Array<SocketEvent> = Object.keys(res) as Array<SocketEvent>;
      // for (const event of events) {
      //    setEventResponses({ [event]: res[event] })
      //    if (responseCallBackKey && responseCallBackKey === event) {
      //       responseCallback && responseCallback(event);
      //    }
      //    // switch (event) {
      //    //    case "userLanded":
      //    //       if (responseCallBackKey === event) {

      //    //       }
      //    //       console.log("res:", res);
      //    //       break;
      //    //    default:
      //    //       break;
      //    // }
      // }
   };

   const socketEmit = (event: SocketEvent, data: any) => {
      if (!socket) {
         console.log("no socket connected...");
         return;
      }
      socket.emit(event, data);
   };

   return { socket, socketEmit, eventResponse };
};

export default useSocketIO;
