import { Player, PlayerQueue } from "../../domain/entities/player";
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
    
    async getPlayers(start: number, end: number): Promise<PlayerQueue[]> {
        const result = await this.redisRepo.getRange('playersQueue', start, end);
        return result;
    }

    async getPlayersCount() {
        const result = await this.redisRepo.length('playersQueue');
        return result;
    }

    async popPlayers(count: number) {
        const result = await this.redisRepo.pop('playersQueue', count);
        return result;
    }

    async deletePlayerBySocketId(socketId: string) {
        console.log("🚀 ~ PlayersQueueRepo ~ deletePlayerBySocketId ~ socketId:", socketId)
        const players = await this.getPlayers(0, -1);
        console.log("🚀 ~ PlayersQueueRepo ~ deletePlayerBySocketId ~ players:", players)
        const player = players.find(player => player.socketId === socketId);
        console.log("🚀 ~ PlayersQueueRepo ~ deletePlayerBySocketId ~ player:", player)
        if (!player) {
            console.log('player not found');
            return null;
        }
        await this.redisRepo.remove('playersQueue', 0, player);
        return player;
    }
}