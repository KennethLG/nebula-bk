import { Player } from "../../domain/entities/player";
import IMatchesRepo from "../../domain/interfaces/IMatchesRepo";
import { IRedisRepo } from "../../domain/interfaces/IRedisRepo";

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
        console.log(`updating player ${player.id} in match ${matchId}`, typeof player.id);
        const players = await this.redisRepo.get<Player[]>(matchId);
        console.log("🚀 ~ MatchesRepo ~ updatePlayer ~ players:", players)
        if (!players) {
            throw new Error(`Match with id ${matchId} not found`);
        }
        const playerIndex = players.findIndex(p => p.id === player.id);
        console.log("🚀 ~ MatchesRepo ~ updatePlayer ~ playerIndex:", playerIndex)
        if (playerIndex === -1) {
            throw new Error(`Player with id ${player.id} not found in match with id ${matchId}`);
        }
        players[playerIndex] = player;
        const result = await this.redisRepo.set(matchId, players);
        console.log("updating player", matchId, player, result);
        return result;
    }
}