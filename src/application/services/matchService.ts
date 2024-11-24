import {
  Player,
  PlayerQueue,
  playerQueueFactory,
} from "../../domain/entities/player";
import IMatchesRepo from "../../domain/interfaces/IMatchesRepo";
import IPlayersQueueRepo from "../../domain/interfaces/IPlayersQueueRepo";
import { RoomService } from "./roomService";
import { GenerateSeed } from "./seedService";

export interface Match {
  id: string;
  seed: number;
  players: PlayerQueue[];
  roomName: string;
}

export class MatchService {
  constructor(
    private readonly generateSeed: GenerateSeed,
    private readonly matchesRepo: IMatchesRepo,
    private readonly playersQueueRepo: IPlayersQueueRepo,
    private readonly roomService: RoomService,
  ) {}

  async joinQueue(player: PlayerQueue) {
    console.log("adding player to queue", player);
    await this.playersQueueRepo.add(player);
    console.log('added player to queue');
  }

  async updatePlayer(matchId: string, player: Player): Promise<void> {
    return await this.matchesRepo.updatePlayer(matchId, player);
  }

  async getPlayersCount(): Promise<number> {
    const playersCount = await this.playersQueueRepo.length();
    return playersCount;
  }
}
