import { Socket } from "socket.io";
import { validateToken } from "../../infrastructure/util/token";

export const auth = (socket: Socket, next: (err?: Error) => void) => {
   const token = socket.handshake.auth.token; 
   if (!token) {
     return next(new Error('Authentication error: Token required'));
   }

   try {
     validateToken(token);
     next();
   } catch {

     return next(new Error('Authentication error: Token invalid'));
   }
}
