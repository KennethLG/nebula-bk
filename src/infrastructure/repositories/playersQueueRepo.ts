import { Player } from "../../domain/entities/player";
import IPlayersQueueRepo from "../../domain/interfaces/IPlayersQueueRepo";
import { IRedisRepo } from "../../domain/interfaces/IRedisRepo";

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

    async removePlayersRange() {
        const result = await this.redisRepo.removeRange('playersQueue', 0, -1);
        return result;
    }

    async popPlayers(count: number) {
        const result = await this.redisRepo.pop('playersQueue', count);
        return result;
    }
}