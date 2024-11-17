import { Player, playerFactory } from "../../domain/entities/player";
import Vector from "../../domain/entities/vector";
import { Match, MatchService } from "../services/matchService";

type JoinMatchResponse = {
  match: Match | null;
  playersCount: number;
};

export class JoinMatchUseCase {
  constructor(private readonly matchService: MatchService) {}

  async execute(socketId: string, id: string): Promise<JoinMatchResponse> {
    const newPlayer = playerFactory(id);
    this.assignRandomPosition(newPlayer);
    console.log("creating new player", id);
    const playerQueue = {
      ...newPlayer,
      socketId,
    };
    await this.matchService.joinQueue(playerQueue);
    const playersCount = await this.matchService.getPlayersCount();
    const result = await this.matchService.checkForMatch(playersCount);
    console.log("check for match result", result);
    const joinMatchResponse: JoinMatchResponse = {
      match: result,
      playersCount,
    };

    return joinMatchResponse;
  }

  private assignRandomPosition(player: Player) {
    player.position = new Vector(Math.random() * 5, 0);
  }
}
