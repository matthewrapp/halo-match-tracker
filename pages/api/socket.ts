import { SocketEvent } from "@/lib/types";
import { Server } from "socket.io";

export default function handler(req: any, res: any) {
   try {
      if (res.socket.server.io) {
         console.log("Socket is already running");
      } else {
         console.log("Socket is initializing");
         const io = new Server(res.socket.server);
         res.socket.server.io = io;

         io.on("connection", (socket) => {
            const socketEvents: Array<SocketEvent> = [
               "userLanded",
               "userJoined",
               "userCreated",
               "sessionInit",
               "sessionCreated",
               "matchInit",
               "matchCreated",
            ];

            for (const se of socketEvents) {
               socket.on(se, (msg) => {
                  const gamertag = req.cookies["ts-gamertag"];
                  socket.broadcast.emit("catchMsg", {
                     [se]: { gamertag: gamertag || null, socketId: socket?.id },
                  });
               });
            }
         });
      }
      res.end();
   } catch (err: any) {
      console.log("err:", err);
   }
}
