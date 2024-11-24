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
import { PlayerDisconnectedUseCase } from "../../../application/usecases/playerDisconnectedUseCase";
import { LoginUseCase } from "../../../application/usecases/loginUseCase";
import { UserGrpcClient } from "../../../infrastructure/grpc/userGrpcClient";
import { TokenService } from "../../../application/services/tokenService";
import { SignupUseCase } from "../../../application/usecases/signupUseCase";
import { PlayersQueueWorker } from "../../../infrastructure/queueWorker";
import { CheckForMatchUseCase } from "../../../application/usecases/checkForMatchUseCase";
import { IRedisQueueRepo } from "../../../domain/interfaces/IRedisQueueRepo";
import { RedisQueueRepo } from "../../../infrastructure/repositories/redisQueueRepo";
import { NotifyMatchFound, PlayerNotificationService } from "../../../infrastructure/io/playerNotificationService";
import { Server } from "socket.io";
import { CreateJoinMatchTaskUseCase } from "../../../application/usecases/createJoinMatchTaskUseCase";
import { JoinPlayersToRoom, JoinPlayersToRoomService } from "../../../infrastructure/io/joinPlayersToRoomService";

const roomServiceFactory = () => {
  return new RoomService();
};

const generateSeedFactory = () => {
  return new GenerateSeed();
};

const redisClientFactory = () => {
  return new RedisClient();
};

const redisQueueRepoFactory = (redisClient: RedisClient) => {
  return new RedisQueueRepo(redisClient);
};

const redisRepoFactory = (redisClient: RedisClient) => {
  return new RedisRepo(redisClient);
};

const matchesRepoFactory = (redisRepo: IRedisRepo) => {
  return new MatchesRepo(redisRepo);
};

const playersQueueRepoFactory = (redisQueueRepo: IRedisQueueRepo) => {
  return new PlayersQueueRepo(redisQueueRepo);
};

const matchServiceFactory = (
  generateSeed: GenerateSeed,
  matchesRepo: IMatchesRepo,
  playersQueueRepo: IPlayersQueueRepo,
  roomService: RoomService,
) => {
  return new MatchService(
    generateSeed,
    matchesRepo,
    playersQueueRepo,
    roomService,
  );
};

const joinMatchUseCaseFactory = (matchService: MatchService) => {
  return new JoinMatchUseCase(matchService);
};

const updatePlayerUseCaseFactory = (matchService: MatchService) => {
  return new UpdatePlayerUseCase(matchService);
};

const playerDisconnectedUseCaseFactory = (
  playersQueueRepo: IPlayersQueueRepo,
) => {
  return new PlayerDisconnectedUseCase(playersQueueRepo);
};

const userGrpcClientFactory = () => {
  return new UserGrpcClient();
};

const tokenServiceFactory = () => {
  return new TokenService();
};

const loginUseCaseFactory = (
  userGrpcClient: UserGrpcClient,
  tokenService: TokenService,
) => {
  return new LoginUseCase(userGrpcClient, tokenService);
};

const signupUseCaseFactory = (userGrpcClient: UserGrpcClient) => {
  return new SignupUseCase(userGrpcClient);
};

const checkForMatchUseCaseFactory = (
  playersQueueRepo: IPlayersQueueRepo,
  generateSeed: GenerateSeed,
  matchesRepo: MatchesRepo,
  roomService: RoomService,
) => {
  return new CheckForMatchUseCase(
    playersQueueRepo,
    generateSeed,
    matchesRepo,
    roomService,
  );
};

const queueWorkerFactory = (
  checkForMatchUseCase: CheckForMatchUseCase,
  joinPlayersToRoom: JoinPlayersToRoom,
  notifyPlayers: NotifyMatchFound,
) => {
  return new PlayersQueueWorker(
    checkForMatchUseCase,
    notifyPlayers,
    joinPlayersToRoom,
  );
};

const playerNotificationServiceFactory = (io: Server) => {
  return new PlayerNotificationService(io);
};

const createJoinMatchTaskUseCaseFactory = (
  playersQueueRepo: IPlayersQueueRepo,
) => {
  return new CreateJoinMatchTaskUseCase(playersQueueRepo);
};

const joinPlayersToRoomServiceFactory = (io: Server) => {
  console.log(`joinPlayersToRoomServiceFactory ${io}`);
  return new JoinPlayersToRoomService(io);
};

export const createIoDependencies = (io: Server) => {
  console.log(`createIoDependencies ${io}`);
  // Core dependencies
  const generateSeed = generateSeedFactory();
  const redisClient = redisClientFactory();
  const redisRepo = redisRepoFactory(redisClient);
  const matchesRepo = matchesRepoFactory(redisRepo);
  const redisQueueRepo = redisQueueRepoFactory(redisClient);
  const playersQueueRepo = playersQueueRepoFactory(redisQueueRepo);
  const roomService = roomServiceFactory();

  // Services
  const matchService = matchServiceFactory(
    generateSeed,
    matchesRepo,
    playersQueueRepo,
    roomService,
  );
  const playerNotificationService = playerNotificationServiceFactory(io);
  const joinPlayersToRoom = joinPlayersToRoomServiceFactory(io);

  // Handlers
  const joinMatchUseCase = joinMatchUseCaseFactory(matchService);
  const updatePlayerUseCase = updatePlayerUseCaseFactory(matchService);
  const playerDisconnectedUseCase =
    playerDisconnectedUseCaseFactory(playersQueueRepo);
  const checkForMatchUseCase = checkForMatchUseCaseFactory(
    playersQueueRepo,
    generateSeed,
    matchesRepo,
    roomService,
  );
  const createJoinMatchTaskUseCase =
    createJoinMatchTaskUseCaseFactory(playersQueueRepo);
  // workers
  const queueWorker = queueWorkerFactory(
    checkForMatchUseCase,
    joinPlayersToRoom.joinPlayersToRoom.bind(joinPlayersToRoom),
    playerNotificationService.notifyMatchFound.bind(playerNotificationService),
  );

  return {
    joinMatchUseCase,
    updatePlayerUseCase,
    playerDisconnectedUseCase,
    createJoinMatchTaskUseCase,
    queueWorker,
  };
};

export const createHttpDependencies = () => {
  const userGrpcClient = userGrpcClientFactory();
  const tokenService = tokenServiceFactory();
  const loginUseCase = loginUseCaseFactory(userGrpcClient, tokenService);
  const signupUseCase = signupUseCaseFactory(userGrpcClient);
  return {
    loginUseCase,
    signupUseCase,
  };
};
