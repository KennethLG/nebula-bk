import { Player } from "../core/entities/player";
import IMatchesRepo from "../interfaces/IMatchesRepo";
import { IRedisRepo } from "../interfaces/IRedisRepo";

export default class MatchesRepo implements IMatchesRepo {
    constructor(
        private readonly redisRepo: IRedisRepo
    ) {}

    async createMatch(players: Player[]) {
        const id = `${Date.now()}-${Math.random()}`;
        const result = await this.redisRepo.set(id, players);
        console.log("creating match", id, players, result);
        return {
            id
        }
    }

    async updatePlayer(matchId: string, player: Player) {
        const players = await this.redisRepo.get<Player[]>(matchId);
        if (!players) {
            throw new Error(`Match with id ${matchId} not found`);
        }
        const playerIndex = players.findIndex(p => p.id === player.id);
        if (playerIndex === -1) {
            throw new Error(`Player with id ${player.id} not found in match with id ${matchId}`);
        }
        players[playerIndex] = player;
        const result = await this.redisRepo.set(matchId, players);
        console.log("updating player", matchId, player, result);
    }
}