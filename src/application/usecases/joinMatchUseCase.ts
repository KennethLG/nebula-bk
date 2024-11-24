import { Player, playerFactory } from "../../domain/entities/player";
import Vector from "../../domain/entities/vector";
import { Match, MatchService } from "../services/matchService";

type JoinMatchResponse = {
  match: Match | null;
  playersCount: number;
};

export class JoinMatchUseCase {
  constructor(private readonly matchService: MatchService) {}

  async execute(socketId: string, id: string) {
    //const newPlayer = playerFactory(id);
    //console.log("creating new player", id);
    //const playerQueue = {
    //  ...newPlayer,
    //  socketId,
    //};
    //await this.matchService.joinQueue(playerQueue);
    //const playersCount = await this.matchService.getPlayersCount();
    //console.log("players count", playersCount);
    //const result = await this.matchService.checkForMatch(playersCount);
    //console.log("check for match result", result);
    //const joinMatchResponse: JoinMatchResponse = {
    //  match: result,
    //  playersCount,
    //};
    //
    //return joinMatchResponse;
  }
}
