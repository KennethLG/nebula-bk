import { Player, PlayerQueue } from "../../domain/entities/player";
import IPlayersQueueRepo from "../../domain/interfaces/IPlayersQueueRepo";
import { IRedisRepo } from "../../domain/interfaces/IRedisRepo";

export default class PlayersQueueRepo implements IPlayersQueueRepo {
    constructor(
        private readonly redisRepo: IRedisRepo
    ) {}

    async addPlayer(player: Player) {
        const players = await this.redisRepo.get<PlayerQueue[]>('playersQueue');
        const newPlayers = players ? [...players, player] : [player];
        const result = await this.redisRepo.set('playersQueue', newPlayers);
        return result;
    }
    
    async getPlayers(start: number, end: number): Promise<PlayerQueue[]> {
        const players = await this.redisRepo.get<PlayerQueue[]>('playersQueue');
        if (!players) {
            return [];
        }
        return players.slice(start, end);
    }

    async getPlayersCount() {
        const result = await this.redisRepo.get('playersQueue');
        return result.length;
    }

    async popPlayers(count: number) {
        const players = await this.redisRepo.get<PlayerQueue[]>('playersQueue');
        if (!players) {
            console.log('no players in queue');
            return [];
        }
        const newPlayers = players.slice(0, count);
        await this.redisRepo.set('playersQueue', players.slice(count));
        return newPlayers;
    }

    async deletePlayerBySocketId(socketId: string) {
        const players = await this.redisRepo.get<PlayerQueue[]>('playersQueue');
        if (!players) {
            console.log('no players in queue');
            return [];
        }
        const newPlayers = players.filter(player => player.socketId !== socketId);
        const result = await this.redisRepo.set('playersQueue', newPlayers);
        return result;
    }
}