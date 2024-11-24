import { Server, Socket } from "socket.io";
import { Express } from "express";
import { createServer } from "http";
import { createIoDependencies } from "./factory";
import { JoinMatchDto, UpdatePlayerDto } from "./dto/events";
import { createOkResponse } from "../../infrastructure/responseHandler";
import { UpdatePlayerUseCase } from "../../application/usecases/updatePlayerUseCase";
import { PlayerDisconnectedUseCase } from "../../application/usecases/playerDisconnectedUseCase";
import { auth } from "./middleware";
import { CreateJoinMatchTaskUseCase } from "../../application/usecases/createJoinMatchTaskUseCase";

export default class IoConnection {
  private readonly createJoinMatchTaskUseCase: CreateJoinMatchTaskUseCase;
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

    const { createJoinMatchTaskUseCase, updatePlayerUseCase, playerDisconnectedUseCase } =
      createIoDependencies(this.io);
    this.createJoinMatchTaskUseCase = createJoinMatchTaskUseCase;
    this.updatePlayerUseCase = updatePlayerUseCase;
    this.playerDisconnectedUseCase = playerDisconnectedUseCase;
  }

  init() {
    const matchNamespace = this.io.of("/match");
    matchNamespace.on("connection", this.handleConnection);
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
        await this.createJoinMatchTaskUseCase.execute(socket.id, data.id);
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
        console.log(`response ${JSON.stringify(response)}`);
        this.io
          .of("/match")
          .to(data.matchId)
          .except(socket.id)
          .emit("playerUpdated", response);
      } catch (error) {
        console.error(error);
      }
    });
  };
}
