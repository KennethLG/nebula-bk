import { Server } from "socket.io";
import { PlayerQueue } from "../../domain/entities/player";

export type JoinPlayersToRoom = (players: PlayerQueue[], roomName: string) => void;

export class JoinPlayersToRoomService {
  constructor(
    private readonly io: Server
  ){}

  joinPlayersToRoom(players: PlayerQueue[], roomName: string) {
    players.forEach((player) => {
      console.log(`joining player ${player.socketId} to room ${roomName}`);
      this.io.of('/match').sockets.get(player.socketId)?.join(roomName);
    })
  }
}
