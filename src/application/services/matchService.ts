import { Player } from '../../domain/entities/player';
import IMatchesRepo from '../../domain/interfaces/IMatchesRepo';
import IPlayersQueueRepo from '../../domain/interfaces/IPlayersQueueRepo';
import { GenerateSeed } from './seedService';

export interface Match {
  id: string;
  seed: number;
  players: Player[];
}

class PlayerQueueDto extends Player {
  socketId: string;
}

export class MatchService {
  constructor(
    private readonly generateSeed: GenerateSeed,
    private readonly matchesRepo: IMatchesRepo,
    private readonly playersQueueRepo: IPlayersQueueRepo
  ) {}

  async joinQueue(player: PlayerQueueDto): Promise<Match | null> {
    console.log("adding player to queue", player)
    await this.playersQueueRepo.addPlayer(player);
    const result = await this.checkForMatch();
    console.log("check for match result", result);
    return result;
  }

  async updatePlayer(matchId: string, player: Player): Promise<void> {
    return await this.matchesRepo.updatePlayer(matchId, player);
  }

  private async checkForMatch(): Promise<Match | null> {
    const playersCount = await this.playersQueueRepo.getPlayersCount();
    if (playersCount >= 2) {
      const players = await this.playersQueueRepo.popPlayers(2);

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
