import { GenerateSeed } from "../../../core/usecases/generateSeed";
import { MatchService } from "../../../core/usecases/matchService";
import IMatchesRepo from "../../../interfaces/IMatchesRepo";
import IPlayersQueueRepo from "../../../interfaces/IPlayersQueueRepo";
import { IRedisRepo } from "../../../interfaces/IRedisRepo";
import MatchesRepo from "../../../repositories/matchesRepo";
import PlayersQueueRepo from "../../../repositories/playersQueueRepo";
import RedisRepo from "../../../repositories/redisRepo";
import { MatchController } from "../../controllers/matchController";
import RedisClient from "../../redis";
import { JoinMatchHandler } from "../joinMatchHandler";
import { UpdatePlayerHandler } from "../updatePlayerHandler";

export const generateSeedFactory = () => {
    return new GenerateSeed();
}

export const redisClientFactory = () => {
    return new RedisClient();
}

export const redisRepoFactory = (redisClient: RedisClient) => {
    return new RedisRepo(redisClient);
}

export const matchesRepoFactory = (redisRepo: IRedisRepo) => {
    return new MatchesRepo(redisRepo);
}

export const playersQueueRepoFactory = (redisRepo: IRedisRepo) => {
    return new PlayersQueueRepo(redisRepo);
}

export const matchServiceFactory = (generateSeed: GenerateSeed, matchesRepo: IMatchesRepo, playersQueueRepo: IPlayersQueueRepo) => {
    return new MatchService(generateSeed, matchesRepo, playersQueueRepo);
}

export const matchControllerFactory = (matchmakingService: MatchService) => {
    return new MatchController(matchmakingService);
}

export const joinMatchHandlerFactory = (matchController: MatchController) => {
    return new JoinMatchHandler(matchController);
}

export const updatePlayerHandlerFactory = (matchController: MatchController) => {
    return new UpdatePlayerHandler(matchController);
}

export const createDependencies = () => {
    // Core dependencies
    const generateSeed = generateSeedFactory();
    const redisClient = redisClientFactory();
    const redisRepo = redisRepoFactory(redisClient);
    const matchesRepo = matchesRepoFactory(redisRepo);
    const playersQueueRepo = playersQueueRepoFactory(redisRepo);

    // Service and controller
    const matchService = matchServiceFactory(generateSeed, matchesRepo, playersQueueRepo);
    const matchController = matchControllerFactory(matchService);

    // Handlers
    const joinMatchHandler = joinMatchHandlerFactory(matchController);
    const updatePlayerHandler = updatePlayerHandlerFactory(matchController);

    return {
        joinMatchHandler,
        updatePlayerHandler
    };
}