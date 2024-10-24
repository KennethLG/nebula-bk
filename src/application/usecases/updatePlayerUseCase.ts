import { Player } from "../../domain/entities/player";
import { MatchService } from "../services/matchService";

export class UpdatePlayerUseCase {
    constructor(
        private readonly matchService: MatchService
    ) {}

    async execute(matchId: string, player: Player) {
        const result = await this.matchService.updatePlayer(matchId, player)
        return result;
    }
}