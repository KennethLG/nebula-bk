import { Player } from "../../../core/entities/player";
import { MatchController } from "../../controllers/matchController";

export class UpdatePlayerHandler {
    constructor(
        private readonly matchController: MatchController
    ) {}

    async handle(matchId: string, player: Player) {
        return await this.matchController.updatePlayer(matchId, player);
    }
}

