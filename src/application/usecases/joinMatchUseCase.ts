import { Player } from "../../domain/entities/player";
import Vector from "../../domain/entities/vector";
import { Match, MatchService } from "../services/matchService";

export class JoinMatchUseCase {
    constructor(
        private readonly matchService: MatchService
    ) { }

    async execute(socketId: string, id: string): Promise<Match | null> {
        const newPlayer = new Player(id, new Vector(), new Vector(), new Vector(), '', false);
        this.assignRandomPosition(newPlayer);
        console.log('creating new player', id)
        const playerQueue = {
            ...newPlayer,
            socketId
        }
        await this.matchService.joinQueue(playerQueue);
        const result = await this.matchService.checkForMatch();
        console.log("check for match result", result);

        return result;
    }

    private assignRandomPosition(player: Player) {
        player.position = new Vector(Math.random() * 5, 0);
    }

}

