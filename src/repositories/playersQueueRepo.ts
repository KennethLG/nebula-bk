import { Player } from "../core/entities/player";
import IPlayersQueueRepo from "../interfaces/IPlayersQueueRepo";
import { IRedisRepo } from "../interfaces/IRedisRepo";

export default class PlayersQueueRepo implements IPlayersQueueRepo {
    constructor(
        private readonly redisRepo: IRedisRepo
    ) {}

    async addPlayer(player: Player) {
        const result = await this.redisRepo.push('playersQueue', player);
        return result;
    }
    
    async getPlayers(): Promise<Player[]> {
        const result = await this.redisRepo.getRange('playersQueue', 0, -1);
        return result;
    }

    async getPlayersCount() {
        const result = await this.redisRepo.length('playersQueue');
        return result;
    }
}