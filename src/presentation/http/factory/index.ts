import MatchesRepo from "../../../infrastructure/repositories/matchesRepo";
import PlayersQueueRepo from "../../../infrastructure/repositories/playersQueueRepo";
import RedisRepo from "../../../infrastructure/repositories/redisRepo";
import RedisClient from "../../../infrastructure/redis";
import { JoinMatchUseCase } from "../../../application/usecases/joinMatchUseCase";
import { MatchService } from "../../../application/services/matchService";
import { GenerateSeed } from "../../../application/services/seedService";
import { IRedisRepo } from "../../../domain/interfaces/IRedisRepo";
import IMatchesRepo from "../../../domain/interfaces/IMatchesRepo";
import IPlayersQueueRepo from "../../../domain/interfaces/IPlayersQueueRepo";
import { UpdatePlayerUseCase } from "../../../application/usecases/updatePlayerUseCase";
import { RoomService } from "../../../application/services/roomService";

const roomServiceFactory = () => {
    return new RoomService();
}

const generateSeedFactory = () => {
    return new GenerateSeed();
}

const redisClientFactory = () => {
    return new RedisClient();
}

const redisRepoFactory = (redisClient: RedisClient) => {
    return new RedisRepo(redisClient);
}

const matchesRepoFactory = (redisRepo: IRedisRepo) => {
    return new MatchesRepo(redisRepo);
}

const playersQueueRepoFactory = (redisRepo: IRedisRepo) => {
    return new PlayersQueueRepo(redisRepo);
}

const matchServiceFactory = (generateSeed: GenerateSeed, matchesRepo: IMatchesRepo, playersQueueRepo: IPlayersQueueRepo, roomService: RoomService) => {
    return new MatchService(generateSeed, matchesRepo, playersQueueRepo, roomService);
}

const joinMatchUseCaseFactory = (matchService: MatchService) => {
    return new JoinMatchUseCase(matchService)
}

const updatePlayerUseCaseFactory = (matchService: MatchService) => {
    return new UpdatePlayerUseCase(matchService);
}

export const createDependencies = () => {
    // Core dependencies
    const generateSeed = generateSeedFactory();
    const redisClient = redisClientFactory();
    const redisRepo = redisRepoFactory(redisClient);
    const matchesRepo = matchesRepoFactory(redisRepo);
    const playersQueueRepo = playersQueueRepoFactory(redisRepo);
    const roomService = roomServiceFactory();

    // Services
    const matchService = matchServiceFactory(generateSeed, matchesRepo, playersQueueRepo, roomService);

    // Handlers
    const joinMatchUseCase = joinMatchUseCaseFactory(matchService);
    const updatePlayerUseCase = updatePlayerUseCaseFactory(matchService);

    return {
        joinMatchUseCase,
        updatePlayerUseCase
    };
}