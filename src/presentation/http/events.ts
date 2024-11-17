import { Server, Socket } from "socket.io";
import { Express } from "express";
import { createServer } from "http";
import { createDependencies } from "./factory";
import { JoinMatchDto, UpdatePlayerDto } from "./dto/events";
import { createOkResponse } from "../../infrastructure/responseHandler";
import { JoinMatchUseCase } from "../../application/usecases/joinMatchUseCase";
import { UpdatePlayerUseCase } from "../../application/usecases/updatePlayerUseCase";
import { PlayerDisconnectedUseCase } from "../../application/usecases/playerDisconnectedUseCase";
import { auth } from "./middleware";

export default class IoConnection {
  private readonly joinMatchUseCase: JoinMatchUseCase;
  private readonly updatePlayerUseCase: UpdatePlayerUseCase;
  private readonly playerDisconnectedUseCase: PlayerDisconnectedUseCase;
  private readonly io: Server;
  private readonly httpServer;
  constructor(app: Express) {
    this.httpServer = createServer(app);
    this.io = new Server(this.httpServer, {
      cors: {
        origin: "*",
      },
    });
    this.io.use(auth);

    const { joinMatchUseCase, updatePlayerUseCase, playerDisconnectedUseCase } =
      createDependencies();
    this.joinMatchUseCase = joinMatchUseCase;
    this.updatePlayerUseCase = updatePlayerUseCase;
    this.playerDisconnectedUseCase = playerDisconnectedUseCase;
  }

  init() {
    this.io.on("connection", this.handleConnection);
    this.httpServer.listen(5000, () => {
      console.log("Server listening on port 5000");
    });
  }

  private handleConnection = (socket: Socket) => {
    console.log(`Player connected: ${socket.id}`);
    socket.on("disconnect", async () => {
      await this.playerDisconnectedUseCase.execute(socket.id);
      console.log(`Player disconnected: ${socket.id}`);
    });

    socket.on("joinMatch", async (data: JoinMatchDto) => {
      try {
        console.log("player received joinMatch", data);
        const result = await this.joinMatchUseCase.execute(socket.id, data.id);
        if (result.match == null) {
          const response = createOkResponse("waiting more players", {
            playersCount: result.playersCount,
          });
          this.io.to(socket.id).emit("addedPlayer", response);
          return;
        }
        const match = result.match;

        match.players.forEach((player) => {
          console.log(
            `joining player ${player.socketId} to room ${match.roomName}`,
          );
          this.io.sockets.sockets.get(player.socketId)?.join(match.roomName);
        });

        const response = createOkResponse("match found", {
          seed: match.seed,
          id: match.id,
          players: match.players,
        });

        this.io.to(match.roomName).emit("matchFound", response);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("updatePlayer", async (data: UpdatePlayerDto) => {
      try {
        console.log("updatePlayer", data);
        const result = await this.updatePlayerUseCase.execute(
          data.matchId,
          data.player,
        );
        console.log("🚀 ~ IoConnection ~ socket.on ~ result:", result);
        const response = createOkResponse("player updated", {
          player: data.player,
        });
        const rooms = this.io.sockets.adapter.rooms;
        console.log("rooms", rooms);
        const room = rooms.get(data.matchId);
        console.log("🚀 ~ IoConnection ~ socket.on ~ room:", room);
        this.io
          .to(data.matchId)
          .except(socket.id)
          .emit("playerUpdated", response);
      } catch (error) {
        console.error(error);
      }
    });
  };
}
