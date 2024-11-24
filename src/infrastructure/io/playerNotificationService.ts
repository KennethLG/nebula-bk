import { Server } from "socket.io"
import { Match } from "../../application/services/matchService";

export type NotifyMatchFound = (match: Match) => void;

export class PlayerNotificationService {
  constructor(
    private readonly io: Server
  ){}

  notifyMatchFound(match: Match) {
    console.log(`notifying players of match ${match.id}`);
    const response = {
      status: "Ok",
      message: "match found",
      data: {
        seed: match.seed,
        id: match.id,
        players: match.players,
      },
    };

    // Emit the matchFound event to the room
    this.io.of('/match').to(match.roomName).emit("matchFound", response);
  }
}
