// src/core/usecases/MatchmakingService.ts

import IMatchesRepo from '../../interfaces/IMatchesRepo';
import IPlayersQueueRepo from '../../interfaces/IPlayersQueueRepo';
import { Player } from '../entities/player';
import { GenerateSeed } from './generateSeed';

export interface Match {
  id: string;
  seed: number;
  players: Player[];
}

export class MatchService {
  constructor(
    private readonly generateSeed: GenerateSeed,
    private readonly matchesRepo: IMatchesRepo,
    private readonly playersQueueRepo: IPlayersQueueRepo
  ) {}

  async joinQueue(player: Player): Promise<Match | null> {
    this.playersQueueRepo.addPlayer(player);
    console.log("adding player", player)
    const result = await this.checkForMatch();
    return result;
  }

  private async checkForMatch(): Promise<Match | null> {
    const playersCount = await this.playersQueueRepo.getPlayersCount();
    if (playersCount >= 2) {
      const players = await this.playersQueueRepo.getPlayers();

      const seed = this.generateSeed.execute();

      const { id } = await this.matchesRepo.createMatch(players);

      return {
        players,
        id,
        seed
      }
    }
    return null;
  }
}
