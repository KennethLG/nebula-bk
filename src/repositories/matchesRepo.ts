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
}