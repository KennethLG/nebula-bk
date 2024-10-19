import { Server, Socket } from "socket.io";
import { MatchController } from "../../controllers/matchController";
import { MatchService } from "../../../core/usecases/matchService";
import { GenerateSeed } from "../../../core/usecases/generateSeed";

interface JoinMatchData {
    id: number
}

export default class JoinMatchHandler {
    constructor(
        private readonly matchController: MatchController
    ) { }

    handle(data: JoinMatchData, io: Server, socket: Socket) {
        const result = this.matchController.handlePlayerJoin(data.id);
        if (result) {
            io.to(socket.id).emit('matchFound', {
                seed: result.seed,
                id: result.id,
                players: result.players
            })
        }
    }
}

export const joinMatchHandlerFactory = () => {
    const generateSeed = new GenerateSeed();
    const matchmakingService = new MatchService(generateSeed);
    const matchController = new MatchController(matchmakingService);
    return new JoinMatchHandler(matchController);
} 