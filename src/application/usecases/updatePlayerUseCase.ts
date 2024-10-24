import { Player } from "../../domain/entities/player";
import { MatchService } from "../services/matchService";

export class UpdatePlayerUseCase {
    constructor(
        private readonly matchService: MatchService
    ) {}

    execute(matchId: string, player: Player) {
        this.matchService.updatePlayer(matchId, player)
    }
}