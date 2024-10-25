import { MatchService } from "../services/matchService";

export class PlayerDisconnectedUseCase {
    constructor(
        private readonly matchService: MatchService
    ) {}

    async execute(socketId: string) {
        await this.matchService.disconnectPlayer(socketId);
    }
}