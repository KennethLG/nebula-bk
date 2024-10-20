import { Match, MatchService } from '../../core/usecases/matchService';
import { Player } from '../../core/entities/player';
import Vector from '../../core/entities/vector';

export class MatchController {
  private matchmakingService: MatchService;

  constructor(matchmakingService: MatchService) {
    this.matchmakingService = matchmakingService;
  }

  async handlePlayerJoin(playerId: number): Promise<Match | null> {
    const player = new Player(playerId, new Vector(), new Vector());
    console.log('new player', player)
    const result = await this.matchmakingService.joinQueue(player);
    return result
  }

  async updatePlayer(matchId: string, player: Player): Promise<void> {
    await this.matchmakingService.updatePlayer(matchId, player);
  }
}
