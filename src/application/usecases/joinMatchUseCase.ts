import { Player } from "../../domain/entities/player";
import Vector from "../../domain/entities/vector";
import { MatchService } from "../services/matchService";

export class JoinMatchUseCase {
    constructor(
        private readonly matchService: MatchService
    ) { }

    async execute(socketId: string, id: number) {
        const newPlayer = new Player(id, new Vector(), new Vector());
        console.log('creating new player', id)
        const playerQueue = {
            ...newPlayer,
            socketId
        }
        const result = await this.matchService.joinQueue(playerQueue);
        return result
    }
}

