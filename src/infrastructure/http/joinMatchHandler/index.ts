import { Server, Socket } from "socket.io";
import { MatchController } from "../../controllers/matchController";
import { MatchService } from "../../../core/usecases/matchService";
import { GenerateSeed } from "../../../core/usecases/generateSeed";
import MatchesRepo from "../../../repositories/matchesRepo";
import RedisRepo from "../../../repositories/redisRepo";
import RedisClient from "../../redis";
import PlayersQueueRepo from "../../../repositories/playersQueueRepo";

interface JoinMatchData {
    id: number
}

export class JoinMatchHandler {
    constructor(
        private readonly matchController: MatchController
    ) { }

    async handle(data: JoinMatchData) {
        return await this.matchController.handlePlayerJoin(data.id);

    }
}

export const joinMatchHandlerFactory = () => {
    const generateSeed = new GenerateSeed();
    const redisClient = new RedisClient();
    const redisRepo = new RedisRepo(redisClient);
    const matchesRepo = new MatchesRepo(redisRepo);
    const playersQueueRepo = new PlayersQueueRepo(redisRepo);
    const matchmakingService = new MatchService(generateSeed, matchesRepo, playersQueueRepo);
    const matchController = new MatchController(matchmakingService);
    return new JoinMatchHandler(matchController);
} 