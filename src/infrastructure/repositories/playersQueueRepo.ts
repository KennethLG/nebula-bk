import { Player } from "../../domain/entities/player";
import IPlayersQueueRepo from "../../domain/interfaces/IPlayersQueueRepo";
import { IRedisQueueRepo } from "../../domain/interfaces/IRedisQueueRepo";

export default class PlayersQueueRepo implements IPlayersQueueRepo {
  private KEY = "playersQueue";
  constructor(private readonly redisRepo: IRedisQueueRepo) {}

  async add(player: Player) {
    await this.redisRepo.push(this.KEY, player, false);
  }

  async range(start: number, end: number) {
    const players = await this.redisRepo.range(this.KEY, start, end);
    return players;
  }

  async length() {
    const count = await this.redisRepo.length(this.KEY);
    return count;
  }

  async trim(start: number, end: number) {
    await this.redisRepo.trim(this.KEY, start, end);
  }

  async removeBySocketId(socketId: string) {
    const players = await this.range(0, -1);
    const player = players.find((player) => player.socketId === socketId);
    if (player) {
      await this.trim(0, -1);
    }
  }
}
