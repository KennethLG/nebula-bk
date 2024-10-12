import { Match, MatchmakingService } from '../../core/usecases/matchMaking';
import { Player } from '../../core/entities/player';

export class MatchController {
  private matchmakingService: MatchmakingService;

  constructor(matchmakingService: MatchmakingService) {
    this.matchmakingService = matchmakingService;
  }

  handlePlayerJoin(playerId: string): Match | null {
    const player = new Player(playerId);
    const result = this.matchmakingService.joinQueue(player);
    return result
  }
}
